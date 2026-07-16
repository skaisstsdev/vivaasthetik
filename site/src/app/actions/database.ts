'use server';

import { prisma } from '@/lib/prisma';

// ------------------------------------------------------------------
// SETTINGS (WorkingDays, BlockedPeriods, Exceptions)
// ------------------------------------------------------------------

export async function getSettings() {
  const [workingDays, blockedPeriods, dateExceptions] = await Promise.all([
    prisma.workingDay.findMany(),
    prisma.blockedPeriod.findMany(),
    prisma.dateException.findMany()
  ]);

  // Strip Date objects for client component serialization
  return { 
    workingDays: workingDays.map(d => ({ ...d, updatedAt: d.updatedAt.toISOString() })),
    blockedPeriods: blockedPeriods.map(d => ({ ...d, createdAt: d.createdAt.toISOString(), updatedAt: d.updatedAt.toISOString() })),
    dateExceptions: dateExceptions.map(d => ({ ...d, updatedAt: d.updatedAt.toISOString() }))
  };
}

export async function updateWorkingHoursAction(dayOfWeek: number, data: { isWorking: boolean, startTime: string, endTime: string }) {
  await prisma.workingDay.upsert({
    where: { dayOfWeek },
    update: data,
    create: { dayOfWeek, ...data }
  });
  return true;
}

export async function addBlockedPeriodAction(data: { startDate: string, endDate: string }) {
  await prisma.blockedPeriod.create({ data });
  return true;
}

export async function removeBlockedPeriodAction(id: string) {
  await prisma.blockedPeriod.delete({ where: { id } });
  return true;
}

export async function updateDateExceptionAction(date: string, data: { isWorking: boolean, blockedHours: string[] }) {
  await prisma.dateException.upsert({
    where: { date },
    update: data,
    create: { date, ...data }
  });
  return true;
}

export async function removeDateExceptionAction(date: string) {
  await prisma.dateException.delete({ where: { date } });
  return true;
}

// ------------------------------------------------------------------
// BOOKINGS
// ------------------------------------------------------------------

export async function getBookings() {
  const bookings = await prisma.booking.findMany({
    orderBy: [
      { date: 'asc' },
      { time: 'asc' }
    ]
  });
  return bookings.map(b => ({
    ...b,
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString()
  }));
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
  return true;
}

export async function updateBookingStatusAction(id: string, status: string) {
  await prisma.booking.update({
    where: { id },
    data: { status }
  });
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
  return true;
}

export async function deleteBookingAction(id: string) {
  await prisma.booking.delete({
    where: { id }
  });
  return true;
}
