'use client';

import React, { useState } from 'react';
import { AlertTriangle, Link2 } from 'lucide-react';
import { saveDay, resetDay } from '@/app/actions/admin';
import { ADMIN_HOURS, dayOfWeekOf, hourOf, openingHours, DayOverride } from '@/lib/availability';
import type { AdminData } from '../useAdminData';
import { END_HOURS, NOTE_PRESETS, fmtDate, fmtDayTitle } from '../lib';
import { HINTS } from '../hints';
import { Hint, Segmented, Sheet, TimeSelect, btn } from './ui';

/** Edit one specific date ("особый день"). Never touches the weekly template. */
export function DayEditor({ data, date, onClose }: { data: AdminData; date: string; onClose: () => void }) {
  const day = data.resolve(date);
  const tpl = data.template[dayOfWeekOf(date)];

  const [isOpen, setIsOpen] = useState(day.isOpen);
  const [startTime, setStartTime] = useState(day.startTime);
  const [endTime, setEndTime] = useState(day.endTime);
  const [blocked, setBlocked] = useState<string[]>(day.blockedHours);
  const [note, setNote] = useState(day.note ?? '');
  const [saving, setSaving] = useState(false);

  // A reason only makes sense for a closed day
  const effectiveNote = isOpen ? '' : note.trim();
  const hoursValid = hourOf(startTime) < hourOf(endTime);
  const draftHours = isOpen && hoursValid
    ? openingHours({ ...day, isOpen: true, startTime, endTime, blockedHours: [] })
    : [];
  const bookings = data.activeByDate[date] || [];
  const affected = bookings.filter(b => !draftHours.includes(b.time) || blocked.includes(b.time));

  const sameAsTemplate = isOpen === tpl.isWorking && !blocked.length && !effectiveNote &&
    (!isOpen || (startTime === tpl.startTime && endTime === tpl.endTime));

  const optimisticOverride = (): DayOverride => ({
    date, isWorking: isOpen, startTime: isOpen ? startTime : null, endTime: isOpen ? endTime : null,
    blockedHours: isOpen ? blocked.filter(b => draftHours.includes(b)) : [], note: effectiveNote || null, groupId: null,
  });

  const save = async () => {
    setSaving(true);
    let ok: boolean;
    if (sameAsTemplate) {
      ok = await data.mutate(() => resetDay(date), {
        optimistic: s => { const o = { ...s.overrides }; delete o[date]; return { ...s, overrides: o }; },
        success: `${fmtDate(date, 'd MMMM')}: как обычно`,
      });
    } else {
      const ov = optimisticOverride();
      ok = await data.mutate(
        () => saveDay(date, { isWorking: ov.isWorking, startTime: ov.startTime, endTime: ov.endTime, blockedHours: ov.blockedHours, note: ov.note }),
        { optimistic: s => ({ ...s, overrides: { ...s.overrides, [date]: ov } }), success: `${fmtDate(date, 'd MMMM')} сохранён` },
      );
    }
    setSaving(false);
    if (ok) onClose();
  };

  const reset = async () => {
    setSaving(true);
    const ok = await data.mutate(() => resetDay(date), {
      optimistic: s => { const o = { ...s.overrides }; delete o[date]; return { ...s, overrides: o }; },
      success: `${fmtDate(date, 'd MMMM')} снова по обычному графику`,
    });
    setSaving(false);
    if (ok) onClose();
  };

  const toggleHour = (h: string) => setBlocked(prev => (prev.includes(h) ? prev.filter(x => x !== h) : [...prev, h]));

  return (
    <Sheet
      title={<span className="capitalize">{fmtDayTitle(date)}</span>}
      subtitle={
        <span className="inline-flex items-center gap-2 flex-wrap">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${day.source === 'override' ? 'bg-sky-100 text-sky-800' : 'bg-gray-100 text-gray-600'}`}>
            {day.source === 'override' ? 'Особый день' : 'По обычному графику'}
          </span>
          <span className="text-xs">Обычный график: {tpl.isWorking ? `${tpl.startTime}–${tpl.endTime}` : 'выходной'}</span>
        </span>
      }
      onClose={onClose}
      footer={
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button className={`${btn.secondary} flex-1`} onClick={onClose}>Отмена</button>
            <button className={`${btn.primary} flex-[2]`} disabled={saving || (isOpen && !hoursValid)} onClick={save}>
              {saving ? 'Сохраняю…' : 'Сохранить для этого дня'}
            </button>
          </div>
          {day.source === 'override' && (
            <div className="flex items-center justify-center gap-1">
              <button className={btn.ghost} disabled={saving} onClick={reset}>Вернуть к обычному графику</button>
              <Hint text={HINTS.dayReset} />
            </div>
          )}
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {day.groupId && (
          <p className="flex items-start gap-2 text-sm bg-sky-50 border border-sky-200 text-sky-900 rounded-lg p-3">
            <Link2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Этот день входит в период{day.note ? ` «${day.note}»` : ''}. {HINTS.dayInGroup}</span>
          </p>
        )}

        <div>
          <div className="text-sm font-medium mb-2 flex items-center gap-1.5">Запись в этот день <Hint text={HINTS.dayOpen} /></div>
          <Segmented
            className="w-full"
            value={isOpen ? 'open' : 'closed'}
            onChange={v => setIsOpen(v === 'open')}
            options={[{ value: 'open', label: 'Открыт' }, { value: 'closed', label: 'Закрыт' }]}
          />
        </div>

        {isOpen && (
          <>
            <div>
              <div className="text-sm font-medium mb-2 flex items-center gap-1.5">Часы работы <Hint text={HINTS.dayHours} /></div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">с</span>
                <TimeSelect label="Начало" value={startTime} onChange={setStartTime} options={ADMIN_HOURS} />
                <span className="text-sm text-gray-500">до</span>
                <TimeSelect label="Конец" value={endTime} onChange={setEndTime} options={END_HOURS} />
              </div>
              {!hoursValid && <p className="text-sm text-red-600 mt-2">Время «с» должно быть раньше, чем «до».</p>}
            </div>

            {draftHours.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-2 flex items-center gap-1.5">Заблокировать отдельные часы <Hint text={HINTS.dayBlocked} /></div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {draftHours.map(h => {
                    const isBlocked = blocked.includes(h);
                    const booking = bookings.find(b => b.time === h);
                    return (
                      <button
                        key={h}
                        type="button"
                        onClick={() => toggleHour(h)}
                        aria-pressed={isBlocked}
                        title={booking ? `Запись: ${booking.clientName}` : undefined}
                        className={`relative py-2.5 rounded-lg border text-sm tabular-nums transition-colors ${
                          isBlocked ? 'bg-red-50 border-red-300 text-red-700 line-through' : 'bg-white border-gray-200 hover:border-gray-900'
                        }`}
                      >
                        {h}
                        {booking && <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-gray-900" />}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-2">Зачёркнутые часы недоступны для онлайн-записи. Точка — на этот час уже есть запись.</p>
              </div>
            )}
          </>
        )}

        {!isOpen && (
          <div>
            <div className="text-sm font-medium mb-2 flex items-center gap-1.5">Причина / заметка <Hint text={HINTS.dayNote} /></div>
            <div className="flex flex-wrap gap-2 mb-2">
              {NOTE_PRESETS.map(p => (
                <button key={p} type="button" onClick={() => setNote(note === p ? '' : p)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${note === p ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 hover:border-gray-400'}`}>
                  {p}
                </button>
              ))}
            </div>
            <input value={note} onChange={e => setNote(e.target.value)} placeholder="Например: семинар" maxLength={200}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-base outline-none focus:border-gray-900" />
          </div>
        )}

        {affected.length > 0 && (
          <div className="text-sm bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="flex items-center gap-2 font-medium text-amber-900 mb-2">
              <AlertTriangle className="w-4 h-4" />
              {affected.length === 1 ? 'Есть запись в недоступное время' : `Записей в недоступное время: ${affected.length}`}
            </p>
            <ul className="flex flex-col gap-1 mb-2">
              {affected.map(b => (
                <li key={b.id} className="tabular-nums">{b.time} — {b.clientName}{b.clientPhone ? `, ${b.clientPhone}` : ''}</li>
              ))}
            </ul>
            <p className="text-amber-800">{HINTS.bookingsWarning}</p>
          </div>
        )}
      </div>
    </Sheet>
  );
}
