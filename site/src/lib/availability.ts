// Shared, pure scheduling logic. Used by the public booking wizard, the admin
// panel and the server (to validate bookings), so all three always agree.
//
// Single precedence rule: a per-date override ("особый день") always wins over
// the weekly template. Periods are just batches of overrides sharing a groupId.

export interface WeekDay {
  dayOfWeek: number; // 0 = Sunday … 6 = Saturday
  isWorking: boolean;
  startTime: string; // HH:MM
  endTime: string; // HH:MM
}

export interface DayOverride {
  date: string; // YYYY-MM-DD
  isWorking: boolean;
  startTime: string | null;
  endTime: string | null;
  blockedHours: string[];
  note: string | null;
  groupId: string | null;
}

export interface ResolvedDay {
  date: string;
  isOpen: boolean;
  startTime: string;
  endTime: string;
  blockedHours: string[];
  source: 'template' | 'override';
  note: string | null;
  groupId: string | null;
}

export type WeekTemplate = Record<number, WeekDay>;
export type OverrideMap = Record<string, DayOverride>;

export const DEFAULT_START = '10:00';
export const DEFAULT_END = '17:00';

/** Hours offered in admin pickers: 08:00 … 21:00 */
export const ADMIN_HOURS = Array.from({ length: 14 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`);

export const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function defaultTemplate(): WeekTemplate {
  const t: WeekTemplate = {};
  for (let d = 0; d < 7; d++) {
    t[d] = { dayOfWeek: d, isWorking: d >= 1 && d <= 5, startTime: DEFAULT_START, endTime: DEFAULT_END };
  }
  return t;
}

/** Fill gaps so every weekday has an entry. */
export function normalizeTemplate(days: WeekDay[]): WeekTemplate {
  const t = defaultTemplate();
  days.forEach(d => {
    t[d.dayOfWeek] = { dayOfWeek: d.dayOfWeek, isWorking: d.isWorking, startTime: d.startTime, endTime: d.endTime };
  });
  return t;
}

/** Weekday of a YYYY-MM-DD string, independent of the runtime's timezone. */
export function dayOfWeekOf(dateStr: string): number {
  return new Date(`${dateStr}T12:00:00Z`).getUTCDay();
}

/** All YYYY-MM-DD strings from start to end inclusive (timezone independent). */
export function datesInRange(start: string, end: string): string[] {
  const out: string[] = [];
  const cur = new Date(`${start}T12:00:00Z`);
  const last = new Date(`${end}T12:00:00Z`);
  while (cur <= last) {
    out.push(cur.toISOString().slice(0, 10));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return out;
}

/** Today's date in the clinic's timezone. */
export function todayInBerlin(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin' }).format(now);
}

export function hourOf(time: string): number {
  return parseInt(time.split(':')[0], 10);
}

export function resolveDay(date: string, template: WeekTemplate, overrides: OverrideMap): ResolvedDay {
  const wd = template[dayOfWeekOf(date)] ?? { isWorking: false, startTime: DEFAULT_START, endTime: DEFAULT_END };
  const ov = overrides[date];
  if (ov) {
    return {
      date,
      isOpen: ov.isWorking,
      startTime: ov.startTime || wd.startTime,
      endTime: ov.endTime || wd.endTime,
      blockedHours: ov.blockedHours || [],
      source: 'override',
      note: ov.note,
      groupId: ov.groupId,
    };
  }
  return {
    date,
    isOpen: wd.isWorking,
    startTime: wd.startTime,
    endTime: wd.endTime,
    blockedHours: [],
    source: 'template',
    note: null,
    groupId: null,
  };
}

/** Every hourly slot inside the day's opening hours (ignores bookings and blocks). */
export function openingHours(day: ResolvedDay): string[] {
  if (!day.isOpen) return [];
  const slots: string[] = [];
  for (let h = hourOf(day.startTime); h < hourOf(day.endTime); h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
  }
  return slots;
}

/** Slots a client can book: opening hours minus blocked hours minus taken times. */
export function getSlots(day: ResolvedDay, takenTimes: string[]): string[] {
  return openingHours(day).filter(s => !day.blockedHours.includes(s) && !takenTimes.includes(s));
}
