'use server';

import { after } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendNewBookingToAdmin, sendBookingConfirmationToClient } from '@/lib/mail';
import { servicesData } from '@/data/services';
import {
  DayOverride, WeekDay, DATE_RE, TIME_RE,
  normalizeTemplate, resolveDay, getSlots, todayInBerlin,
} from '@/lib/availability';

// Public endpoints for the booking wizard. Never return client personal data here.

const BOOKING_HORIZON_DAYS = 93;

export interface PublicAvailability {
  template: WeekDay[];
  overrides: DayOverride[];
  taken: { date: string; time: string }[];
}

function toOverride(e: { date: string; isWorking: boolean; startTime: string | null; endTime: string | null; blockedHours: string[]; note: string | null; groupId: string | null }): DayOverride {
  return { date: e.date, isWorking: e.isWorking, startTime: e.startTime, endTime: e.endTime, blockedHours: e.blockedHours, note: null, groupId: null };
}

export async function getPublicAvailability(): Promise<PublicAvailability> {
  const today = todayInBerlin();
  const [workingDays, exceptions, taken] = await Promise.all([
    prisma.workingDay.findMany(),
    prisma.dateException.findMany({ where: { date: { gte: today } } }),
    prisma.booking.findMany({
      where: { date: { gte: today }, status: { not: 'cancelled' } },
      select: { date: true, time: true },
    }),
  ]);

  return {
    template: workingDays.map(d => ({ dayOfWeek: d.dayOfWeek, isWorking: d.isWorking, startTime: d.startTime, endTime: d.endTime })),
    overrides: exceptions.map(toOverride),
    taken,
  };
}

export interface CreateBookingInput {
  serviceSlug: string;
  date: string;
  time: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientNotes?: string;
  /** Язык страницы, с которой записывается клиент (для языка письма). */
  locale?: 'de' | 'ru';
}

export type CreateBookingResult = { ok: true } | { ok: false; reason: 'slot_taken' | 'invalid' };

const clip = (s: string | undefined, max: number) => (s ?? '').trim().slice(0, max);

export async function createBooking(input: CreateBookingInput): Promise<CreateBookingResult> {
  const data = {
    serviceSlug: clip(input.serviceSlug, 100),
    date: clip(input.date, 10),
    time: clip(input.time, 5),
    clientName: clip(input.clientName, 120),
    clientEmail: clip(input.clientEmail, 200),
    clientPhone: clip(input.clientPhone, 50),
    clientNotes: clip(input.clientNotes, 2000),
  };

  // Адрес идёт в письмо: заведомо некорректный не принимаем (бронь без письма клиенту)
  if (data.clientEmail && !/^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]+$/.test(data.clientEmail)) data.clientEmail = '';

  const today = todayInBerlin();
  const horizon = new Date(`${today}T12:00:00Z`);
  horizon.setUTCDate(horizon.getUTCDate() + BOOKING_HORIZON_DAYS);

  if (
    !data.clientName ||
    !DATE_RE.test(data.date) || !TIME_RE.test(data.time) ||
    data.date < today || data.date > horizon.toISOString().slice(0, 10) ||
    !servicesData.some(s => s.slug === data.serviceSlug)
  ) {
    return { ok: false, reason: 'invalid' };
  }

  const locale: 'de' | 'ru' = input.locale === 'ru' ? 'ru' : 'de';

  let result: CreateBookingResult;
  try {
    result = await prisma.$transaction(async tx => {
      const [workingDays, exception, taken] = await Promise.all([
        tx.workingDay.findMany(),
        tx.dateException.findUnique({ where: { date: data.date } }),
        tx.booking.findMany({ where: { date: data.date, status: { not: 'cancelled' } }, select: { time: true } }),
      ]);
      const day = resolveDay(
        data.date,
        normalizeTemplate(workingDays),
        exception ? { [data.date]: toOverride(exception) } : {},
      );
      if (!getSlots(day, taken.map(t => t.time)).includes(data.time)) {
        return { ok: false, reason: 'slot_taken' } as const;
      }
      await tx.booking.create({ data: { ...data, locale, status: 'pending' } });
      return { ok: true } as const;
    });
  } catch (e) {
    console.error('createBooking failed', e);
    return { ok: false, reason: 'slot_taken' };
  }

  // Письма уходят после ответа клиенту; сбой почты запись не отменяет (ошибки пишутся в лог)
  if (result.ok) {
    after(async () => {
      await Promise.allSettled([
        sendNewBookingToAdmin(data),
        sendBookingConfirmationToClient(data),
      ]);
    });
  }
  return result;
}
