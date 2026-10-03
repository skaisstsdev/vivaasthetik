'use client';

import React, { useRef, useState } from 'react';
import { addDays, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Settings2, Lock } from 'lucide-react';
import type { AdminData } from '../useAdminData';
import { describeDay, dayState, fmtDayTitle, plural, toDateStr } from '../lib';
import { HINTS } from '../hints';
import { openingHours } from '@/lib/availability';
import { MonthGrid, CalendarLegend } from './MonthGrid';
import { BookingCard } from './BookingCard';
import { ManualBookingSheet } from './BookingForms';
import { DayEditor } from './DayEditor';
import { Card, Hint, btn } from './ui';

const STATE_BAR: Record<string, string> = {
  open: 'bg-emerald-50 border-emerald-200 text-emerald-900',
  off: 'bg-gray-100 border-gray-200 text-gray-700',
  custom: 'bg-sky-50 border-sky-200 text-sky-900',
  closed: 'bg-red-50 border-red-200 text-red-800',
};

export function JournalTab({ data }: { data: AdminData }) {
  const [date, setDate] = useState(() => toDateStr(new Date()));
  const [month, setMonth] = useState(() => new Date());
  const [newBooking, setNewBooking] = useState<{ time: string } | null>(null);
  const [editDay, setEditDay] = useState(false);
  const dayRef = useRef<HTMLDivElement>(null);

  const day = data.resolve(date);
  const state = dayState(day);
  const bookings = data.activeByDate[date] || [];
  const hours = openingHours(day);
  // Show every working hour plus any booking that falls outside of them
  const rows = Array.from(new Set([...hours, ...bookings.map(b => b.time)])).sort();
  const free = hours.filter(h => !day.blockedHours.includes(h) && !bookings.some(b => b.time === h)).length;

  const goTo = (d: string) => {
    setDate(d);
    setMonth(parseISO(d));
  };
  // On phones the day sits below the calendar — bring it into view after picking a date
  const pickFromCalendar = (d: string) => {
    goTo(d);
    if (window.matchMedia('(max-width: 1023px)').matches) {
      requestAnimationFrame(() => dayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
  };
  const shift = (n: number) => goTo(toDateStr(addDays(parseISO(date), n)));
  const isToday = date === toDateStr(new Date());

  return (
    <div className="grid lg:grid-cols-[minmax(320px,380px)_1fr] gap-6 items-start">
      {/* Calendar */}
      <Card className="p-4 md:p-5">
        <MonthGrid data={data} month={month} onMonthChange={setMonth} selected={date} onDayClick={pickFromCalendar} compact />
        <CalendarLegend />
      </Card>

      {/* Day */}
      <div ref={dayRef} className="flex flex-col gap-4 min-w-0 scroll-mt-20">
        <Card className="p-4 md:p-5">
          <div className="flex items-center justify-between gap-2">
            <button onClick={() => shift(-1)} className="p-2.5 rounded-lg hover:bg-gray-100 border border-gray-200" aria-label="Предыдущий день">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-center min-w-0">
              <h2 className="text-lg md:text-2xl font-medium capitalize truncate">{fmtDayTitle(date)}</h2>
              <p className="text-sm text-gray-500">
                {bookings.length} {plural(bookings.length, 'запись', 'записи', 'записей')}
                {day.isOpen && ` · ${free} ${plural(free, 'свободный час', 'свободных часа', 'свободных часов')}`}
              </p>
            </div>
            <button onClick={() => shift(1)} className="p-2.5 rounded-lg hover:bg-gray-100 border border-gray-200" aria-label="Следующий день">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {!isToday && (
            <div className="flex justify-center mt-3">
              <button className={btn.ghost} onClick={() => goTo(toDateStr(new Date()))}>Сегодня</button>
            </div>
          )}

          <div className={`mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border rounded-lg px-3 py-2.5 ${STATE_BAR[state]}`}>
            <span className="text-sm flex items-center gap-1.5">
              {describeDay(day)}
              <Hint text={HINTS.journalDay} />
            </span>
            <span className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => setEditDay(true)} className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md bg-white/80 border border-current/20 hover:bg-white">
                <Settings2 className="w-4 h-4" />Изменить этот день
              </button>
              <Hint text={HINTS.journalEditDay} />
            </span>
          </div>
        </Card>

        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium flex items-center gap-1.5">Расписание дня <Hint text={HINTS.journalFree} /></h3>
          <span className="flex items-center gap-1">
            <button className={btn.primary} onClick={() => setNewBooking({ time: '' })}>
              <Plus className="w-4 h-4" />Новая запись
            </button>
            <Hint text={HINTS.journalAdd} />
          </span>
        </div>

        {rows.length === 0 ? (
          <Card className="p-8 text-center text-gray-500 text-sm">
            {day.isOpen ? 'Нет рабочих часов.' : 'В этот день запись закрыта. Записей нет.'}
            <div className="mt-3">
              <button className={btn.secondary} onClick={() => setEditDay(true)}>Открыть этот день</button>
            </div>
          </Card>
        ) : (
          <ol className="flex flex-col gap-2">
            {rows.map(h => {
              const hourBookings = bookings.filter(b => b.time === h);
              const isBlocked = day.blockedHours.includes(h);
              const outside = !hours.includes(h);
              return (
                <li key={h} className="grid grid-cols-[52px_1fr] md:grid-cols-[64px_1fr] gap-2 md:gap-3 items-start">
                  <div className={`pt-3 text-sm md:text-base font-medium tabular-nums ${outside ? 'text-amber-700' : 'text-gray-500'}`}>{h}</div>
                  <div className="flex flex-col gap-2 min-w-0">
                    {hourBookings.map(b => <BookingCard key={b.id} booking={b} data={data} />)}
                    {hourBookings.length === 0 && (isBlocked ? (
                      <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-red-200 bg-red-50/50 text-sm text-red-700">
                        <Lock className="w-4 h-4" />Заблокировано для онлайн-записи
                        <Hint text={HINTS.journalBlocked} />
                      </div>
                    ) : (
                      <button
                        onClick={() => setNewBooking({ time: h })}
                        className="group flex items-center justify-between px-4 py-3 rounded-xl border border-dashed border-gray-300 bg-white/60 text-sm text-gray-500 hover:border-gray-900 hover:text-gray-900 hover:bg-white transition-colors text-left"
                      >
                        <span>Свободно</span>
                        <span className="inline-flex items-center gap-1 font-medium"><Plus className="w-4 h-4" />Записать</span>
                      </button>
                    ))}
                    {outside && hourBookings.length > 0 && <p className="text-xs text-amber-700">Вне рабочих часов этого дня</p>}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      {newBooking && (
        <ManualBookingSheet data={data} defaultDate={date} defaultTime={newBooking.time} onClose={() => setNewBooking(null)} />
      )}
      {editDay && <DayEditor data={data} date={date} onClose={() => setEditDay(false)} />}
    </div>
  );
}
