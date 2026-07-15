'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// ------------------------------------------------------------------
// SETTINGS (WorkingDays, BlockedPeriods, Exceptions)
// ------------------------------------------------------------------

export async function getSettings() {
  const [workingDays, blockedPeriods, dateExceptions] = await Promise.all([
    prisma.workingDay.findMany(),
    prisma.blockedPeriod.findMany(),
    prisma.dateException.findMany()
  ]);

  return { workingDays, blockedPeriods, dateExceptions };
}

export async function updateWorkingHoursAction(dayOfWeek: number, data: { isWorking: boolean, startTime: string, endTime: string }) {
  await prisma.workingDay.upsert({
    where: { dayOfWeek },
    update: data,
    create: { dayOfWeek, ...data }
  });
  revalidatePath('/admin');
  return true;
}

export async function addBlockedPeriodAction(data: { startDate: string, endDate: string }) {
  await prisma.blockedPeriod.create({ data });
  revalidatePath('/admin');
  return true;
}

export async function removeBlockedPeriodAction(id: string) {
  await prisma.blockedPeriod.delete({ where: { id } });
  revalidatePath('/admin');
  return true;
}

export async function updateDateExceptionAction(date: string, data: { isWorking: boolean, blockedHours: string[] }) {
  await prisma.dateException.upsert({
    where: { date },
    update: data,
    create: { date, ...data }
  });
  revalidatePath('/admin');
  return true;
}

export async function removeDateExceptionAction(date: string) {
  await prisma.dateException.delete({ where: { date } });
  revalidatePath('/admin');
  return true;
}

// ------------------------------------------------------------------
// BOOKINGS
// ------------------------------------------------------------------

export async function getBookings() {
  return await prisma.booking.findMany({
    orderBy: [
      { date: 'asc' },
      { time: 'asc' }
    ]
  });
}

export async function addBookingAction(data: { serviceSlug: string, date: string, time: string, clientName: string, clientEmail?: string, clientPhone?: string, clientNotes?: string }, status: string = 'pending') {
  // Check if slot is taken
  const existing = await prisma.booking.findFirst({
    where: { date: data.date, time: data.time, status: { not: 'cancelled' } }
  });

  if (existing) return false; // Slot occupied

  await prisma.booking.create({
    data: { ...data, status }
  });
  revalidatePath('/admin');
  return true;
}

export async function updateBookingStatusAction(id: string, status: string) {
  await prisma.booking.update({
    where: { id },
    data: { status }
  });
  revalidatePath('/admin');
  return true;
}

export async function rescheduleBookingAction(id: string, newDate: string, newTime: string) {
  const existing = await prisma.booking.findFirst({
    where: { date: newDate, time: newTime, status: { not: 'cancelled' } }
  });

  if (existing) return false; // Target slot occupied

  await prisma.booking.update({
    where: { id },
    data: { date: newDate, time: newTime }
  });
  revalidatePath('/admin');
  return true;
}
