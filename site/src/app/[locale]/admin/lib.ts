import { format, formatDistanceToNowStrict, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { servicesData } from '@/data/services';
import type { AdminBooking } from '@/app/actions/admin';
import type { ResolvedDay } from '@/lib/availability';

export const toDateStr = (d: Date) => format(d, 'yyyy-MM-dd');

export const fmtDate = (dateStr: string, pattern = 'd MMMM yyyy') => format(parseISO(dateStr), pattern, { locale: ru });

export const fmtDayTitle = (dateStr: string) => fmtDate(dateStr, 'EEEE, d MMMM');

export function fmtRange(start: string, end: string) {
  if (start === end) return fmtDate(start, 'd MMMM yyyy');
  const s = parseISO(start);
  const e = parseISO(end);
  if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
    return `${format(s, 'd')}–${format(e, 'd MMMM yyyy', { locale: ru })}`;
  }
  if (s.getFullYear() === e.getFullYear()) {
    return `${format(s, 'd MMM', { locale: ru })} – ${format(e, 'd MMM yyyy', { locale: ru })}`;
  }
  return `${format(s, 'd MMM yyyy', { locale: ru })} – ${format(e, 'd MMM yyyy', { locale: ru })}`;
}

export function fmtCreated(iso: string) {
  const d = parseISO(iso);
  return `${format(d, 'd MMM, HH:mm', { locale: ru })} · ${formatDistanceToNowStrict(d, { locale: ru, addSuffix: true })}`;
}

export function plural(n: number, one: string, few: string, many: string) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}

export const serviceName = (slug: string) => servicesData.find(s => s.slug === slug)?.title.de || slug || '—';

/** wa.me link; German local numbers (0…) are converted to +49. */
export function whatsappLink(phone: string) {
  let digits = phone.replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) digits = digits.slice(1);
  else if (digits.startsWith('00')) digits = digits.slice(2);
  else if (digits.startsWith('0')) digits = '49' + digits.slice(1);
  return `https://wa.me/${digits.replace(/\D/g, '')}`;
}

export const sortByVisit = (a: AdminBooking, b: AdminBooking) =>
  a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date);

export type DayState = 'open' | 'off' | 'custom' | 'closed';

export function dayState(day: ResolvedDay): DayState {
  if (day.source === 'template') return day.isOpen ? 'open' : 'off';
  return day.isOpen ? 'custom' : 'closed';
}

export function describeDay(day: ResolvedDay): string {
  if (!day.isOpen) {
    return day.source === 'template' ? 'Выходной по графику' : `Закрыто${day.note ? ` · ${day.note}` : ''}`;
  }
  const hours = `${day.startTime}–${day.endTime}`;
  if (day.source === 'template') return `Рабочий день · ${hours} · по графику`;
  const blocked = day.blockedHours.length ? ` · заблокировано: ${day.blockedHours.join(', ')}` : '';
  return `Особый день · ${hours}${blocked}${day.note ? ` · ${day.note}` : ''}`;
}

export const END_HOURS = Array.from({ length: 14 }, (_, i) => `${String(i + 9).padStart(2, '0')}:00`); // 09:00 … 22:00

export const NOTE_PRESETS = ['Отпуск', 'Праздник', 'Больничный', 'Обучение', 'Работа'];
