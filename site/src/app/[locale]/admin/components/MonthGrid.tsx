'use client';

import React from 'react';
import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameMonth, startOfMonth, startOfWeek } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { AdminData } from '../useAdminData';
import { DayState, dayState, toDateStr } from '../lib';
import { Hint } from './ui';
import { HINTS } from '../hints';

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const STATE_CLASS: Record<DayState, string> = {
  open: 'bg-white text-gray-900 border-gray-200 hover:border-gray-900',
  off: 'bg-gray-100 text-gray-400 border-transparent hover:border-gray-400',
  custom: 'bg-sky-50 text-sky-900 border-sky-300 hover:border-sky-600',
  closed: 'bg-red-50 text-red-700 border-red-200 hover:border-red-500 bg-[repeating-linear-gradient(135deg,transparent_0_5px,rgba(239,68,68,0.10)_5px_7px)]',
};

export function MonthGrid({ data, month, onMonthChange, onDayClick, selected, range, compact = false }: {
  data: AdminData;
  month: Date;
  onMonthChange: (d: Date) => void;
  onDayClick: (dateStr: string) => void;
  selected?: string | null;
  range?: { start: string; end: string | null } | null;
  compact?: boolean;
}) {
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
  });
  const today = toDateStr(new Date());
  const rangeEnd = range ? range.end ?? range.start : null;

  return (
    <div className="w-full select-none">
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={() => onMonthChange(addMonths(month, -1))} className="p-2 rounded-lg hover:bg-gray-100" aria-label="Предыдущий месяц">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-base font-medium capitalize">{format(month, 'LLLL yyyy', { locale: ru })}</div>
        <button type="button" onClick={() => onMonthChange(addMonths(month, 1))} className="p-2 rounded-lg hover:bg-gray-100" aria-label="Следующий месяц">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((w, i) => (
          <div key={w} className={`text-center text-xs py-1 ${i >= 5 ? 'text-gray-400' : 'text-gray-500'}`}>{w}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map(d => {
          const dateStr = toDateStr(d);
          const inMonth = isSameMonth(d, month);
          const state = dayState(data.resolve(dateStr));
          const count = data.activeByDate[dateStr]?.length || 0;
          const isSelected = selected === dateStr;
          const inRange = range && rangeEnd && dateStr >= range.start && dateStr <= rangeEnd;
          const isRangeEdge = range && (dateStr === range.start || dateStr === rangeEnd);
          const isPast = dateStr < today;

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => onDayClick(dateStr)}
              aria-label={`${format(d, 'd MMMM', { locale: ru })}${count ? `, записей: ${count}` : ''}`}
              aria-pressed={isSelected || !!inRange}
              className={`relative ${compact ? 'h-10' : 'h-11 md:h-14'} rounded-lg border text-sm transition-all flex items-start justify-start p-1.5 md:p-2 ${STATE_CLASS[state]}
                ${!inMonth ? 'opacity-35' : ''} ${isPast && inMonth ? 'opacity-60' : ''}
                ${inRange ? '!ring-2 !ring-gray-900 !ring-offset-0 z-[1]' : ''}
                ${isRangeEdge ? '!bg-gray-900 !text-white' : ''}
                ${isSelected ? '!bg-gray-900 !text-white !border-gray-900 shadow-md' : ''}`}
            >
              <span className={`tabular-nums leading-none ${dateStr === today ? 'font-bold underline underline-offset-4 decoration-2' : 'font-medium'}`}>
                {format(d, 'd')}
              </span>
              {count > 0 && (
                <span className={`absolute bottom-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[11px] leading-[18px] font-semibold text-center
                  ${isSelected || isRangeEdge ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function CalendarLegend() {
  const items: { state: DayState; label: string }[] = [
    { state: 'open', label: 'Рабочий по графику' },
    { state: 'off', label: 'Выходной по графику' },
    { state: 'custom', label: 'Особые часы' },
    { state: 'closed', label: 'Закрыто (особый день)' },
  ];
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-600 mt-4">
      {items.map(i => (
        <span key={i.state} className="inline-flex items-center gap-1.5">
          <span className={`w-4 h-4 rounded border ${STATE_CLASS[i.state]}`} />
          {i.label}
        </span>
      ))}
      <span className="inline-flex items-center gap-1.5">
        <span className="w-[18px] h-[18px] rounded-full bg-gray-900 text-white text-[11px] font-semibold flex items-center justify-center">2</span>
        Записи
      </span>
      <Hint text={HINTS.scheduleLegend} />
    </div>
  );
}
