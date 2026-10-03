'use server';

import { randomUUID } from 'crypto';
import { prisma } from '@/lib/prisma';
import {
  checkPassword, createAdminSession, destroyAdminSession, requireAdmin, UnauthorizedError,
} from '@/lib/adminAuth';
import { DayOverride, WeekDay, DATE_RE, TIME_RE, datesInRange, hourOf } from '@/lib/availability';

// Every mutation returns a fresh snapshot of all admin data, so the client
// replaces its state with server truth in one round trip (no refetch races).

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface AdminBooking {
  id: string;
  serviceSlug: string;
  date: string;
  time: string;
  clientName: string;
  clientEmail: string | null;
  clientPhone: string | null;
  clientNotes: string | null;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSnapshot {
  bookings: AdminBooking[];
  template: WeekDay[];
  overrides: DayOverride[];
}

export type ActionResult = { ok: true; snapshot: AdminSnapshot } | { ok: false; error: string; unauthorized?: boolean };

const STATUSES: BookingStatus[] = ['pending', 'confirmed', 'cancelled'];
const MAX_PERIOD_DAYS = 366;

class UserError extends Error {}

async function loadSnapshot(): Promise<AdminSnapshot> {
  const [bookings, workingDays, exceptions] = await Promise.all([
    prisma.booking.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.workingDay.findMany(),
    prisma.dateException.findMany({ orderBy: { date: 'asc' } }),
  ]);
  return {
    bookings: bookings.map(b => ({
      ...b,
      status: b.status as BookingStatus,
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
    })),
    template: workingDays.map(d => ({ dayOfWeek: d.dayOfWeek, isWorking: d.isWorking, startTime: d.startTime, endTime: d.endTime })),
    overrides: exceptions.map(e => ({
      date: e.date, isWorking: e.isWorking, startTime: e.startTime, endTime: e.endTime,
      blockedHours: e.blockedHours, note: e.note, groupId: e.groupId,
    })),
  };
}

async function run(fn: () => Promise<void>): Promise<ActionResult> {
  try {
    await requireAdmin();
    await fn();
    return { ok: true, snapshot: await loadSnapshot() };
  } catch (e) {
    if (e instanceof UnauthorizedError) return { ok: false, error: e.message, unauthorized: true };
    if (e instanceof UserError) return { ok: false, error: e.message };
    console.error('Admin action failed', e);
    return { ok: false, error: 'Ошибка сервера — изменения не сохранены. Попробуйте ещё раз.' };
  }
}

function assertDate(d: string) {
  if (!DATE_RE.test(d)) throw new UserError('Некорректная дата');
}

function assertHours(start: string | null, end: string | null) {
  if (start === null && end === null) return;
  if (!start || !end || !TIME_RE.test(start) || !TIME_RE.test(end)) throw new UserError('Некорректное время');
  if (hourOf(start) >= hourOf(end)) throw new UserError('Время «с» должно быть раньше, чем «до»');
}

const clip = (s: string | null | undefined, max: number) => {
  const v = (s ?? '').trim().slice(0, max);
  return v || null;
};

// ------------------------------------------------------------------
// AUTH
// ------------------------------------------------------------------

export async function adminLogin(password: string): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!checkPassword(password)) {
      await new Promise(r => setTimeout(r, 600)); // slow down guessing
      return { ok: false, error: 'Неверный пароль' };
    }
    await createAdminSession();
    return { ok: true };
  } catch (e) {
    console.error('Admin login failed', e);
    return { ok: false, error: 'Вход не настроен на сервере (ADMIN_PASSWORD / ADMIN_SESSION_SECRET)' };
  }
}

export async function adminLogout() {
  await destroyAdminSession();
}

export async function getAdminSnapshot(): Promise<ActionResult> {
  return run(async () => {});
}

// ------------------------------------------------------------------
// BOOKINGS
// ------------------------------------------------------------------

async function assertSlotFree(date: string, time: string, exceptId?: string) {
  const clash = await prisma.booking.findFirst({
    where: { date, time, status: { not: 'cancelled' }, ...(exceptId ? { id: { not: exceptId } } : {}) },
  });
  if (clash) throw new UserError(`На ${time} уже есть запись (${clash.clientName})`);
}

export async function setBookingStatus(id: string, status: BookingStatus) {
  return run(async () => {
    if (!STATUSES.includes(status)) throw new UserError('Некорректный статус');
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new UserError('Запись не найдена — возможно, её уже удалили');
    if (status !== 'cancelled' && booking.status === 'cancelled') {
      await assertSlotFree(booking.date, booking.time, id);
    }
    await prisma.booking.update({ where: { id }, data: { status } });
  });
}

export async function rescheduleBooking(id: string, date: string, time: string) {
  return run(async () => {
    assertDate(date);
    if (!TIME_RE.test(time)) throw new UserError('Некорректное время');
    await assertSlotFree(date, time, id);
    await prisma.booking.update({ where: { id }, data: { date, time } });
  });
}

export async function deleteBooking(id: string) {
  return run(async () => {
    await prisma.booking.deleteMany({ where: { id } });
  });
}

export async function createManualBooking(input: {
  serviceSlug: string; date: string; time: string; clientName: string; clientPhone?: string; clientEmail?: string; clientNotes?: string;
}) {
  return run(async () => {
    assertDate(input.date);
    if (!TIME_RE.test(input.time)) throw new UserError('Выберите время');
    const clientName = clip(input.clientName, 120);
    if (!clientName) throw new UserError('Укажите имя клиента');
    await assertSlotFree(input.date, input.time);
    await prisma.booking.create({
      data: {
        serviceSlug: clip(input.serviceSlug, 100) ?? '',
        date: input.date,
        time: input.time,
        clientName,
        clientPhone: clip(input.clientPhone, 50),
        clientEmail: clip(input.clientEmail, 200),
        clientNotes: clip(input.clientNotes, 2000) ?? 'Добавлено администратором',
        status: 'confirmed',
      },
    });
  });
}

// ------------------------------------------------------------------
// SCHEDULE
// ------------------------------------------------------------------

export async function saveWeekTemplate(days: WeekDay[]) {
  return run(async () => {
    if (days.length !== 7) throw new UserError('Нужно передать все 7 дней');
    days.forEach(d => {
      if (d.dayOfWeek < 0 || d.dayOfWeek > 6) throw new UserError('Некорректный день недели');
      assertHours(d.startTime, d.endTime);
    });
    await prisma.$transaction(
      days.map(d =>
        prisma.workingDay.upsert({
          where: { dayOfWeek: d.dayOfWeek },
          update: { isWorking: d.isWorking, startTime: d.startTime, endTime: d.endTime },
          create: { dayOfWeek: d.dayOfWeek, isWorking: d.isWorking, startTime: d.startTime, endTime: d.endTime },
        }),
      ),
    );
  });
}

export interface DayInput {
  isWorking: boolean;
  startTime: string | null;
  endTime: string | null;
  blockedHours: string[];
  note: string | null;
}

/** Save a single special day. Detaches it from any period group. */
export async function saveDay(date: string, input: DayInput) {
  return run(async () => {
    assertDate(date);
    assertHours(input.startTime, input.endTime);
    const blockedHours = input.blockedHours.filter(h => TIME_RE.test(h));
    const data = {
      isWorking: input.isWorking,
      startTime: input.isWorking ? input.startTime : null,
      endTime: input.isWorking ? input.endTime : null,
      blockedHours: input.isWorking ? blockedHours : [],
      note: clip(input.note, 200),
      groupId: null,
    };
    await prisma.dateException.upsert({ where: { date }, update: data, create: { date, ...data } });
  });
}

/** Remove the special settings for a day — it goes back to the weekly template. */
export async function resetDay(date: string) {
  return run(async () => {
    assertDate(date);
    await prisma.dateException.deleteMany({ where: { date } });
  });
}

export async function applyPeriod(input: {
  start: string; end: string; mode: 'close' | 'open' | 'reset';
  startTime?: string | null; endTime?: string | null; note?: string | null;
}) {
  return run(async () => {
    assertDate(input.start);
    assertDate(input.end);
    if (input.start > input.end) throw new UserError('Дата начала позже даты окончания');
    const dates = datesInRange(input.start, input.end);
    if (dates.length > MAX_PERIOD_DAYS) throw new UserError('Период не может быть длиннее года');

    const startTime = input.mode === 'open' ? input.startTime ?? null : null;
    const endTime = input.mode === 'open' ? input.endTime ?? null : null;
    assertHours(startTime, endTime);

    const groupId = randomUUID();
    const note = clip(input.note, 200);

    await prisma.$transaction([
      prisma.dateException.deleteMany({ where: { date: { gte: input.start, lte: input.end } } }),
      ...(input.mode === 'reset'
        ? []
        : [prisma.dateException.createMany({
            data: dates.map(date => ({
              date,
              isWorking: input.mode === 'open',
              startTime,
              endTime,
              blockedHours: [],
              note,
              groupId,
            })),
          })]),
    ]);
  });
}

/** Delete every day created by one period action. */
export async function deleteGroup(groupId: string) {
  return run(async () => {
    if (!groupId) throw new UserError('Не указан период');
    await prisma.dateException.deleteMany({ where: { groupId } });
  });
}
