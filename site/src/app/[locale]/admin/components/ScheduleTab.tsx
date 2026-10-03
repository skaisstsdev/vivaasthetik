'use client';

import React, { useMemo, useState } from 'react';
import { AlertTriangle, ChevronDown, Lock, Unlock, RotateCcw, Trash2, Settings2, X } from 'lucide-react';
import { applyPeriod, deleteGroup, resetDay } from '@/app/actions/admin';
import { ADMIN_HOURS, DayOverride, OverrideMap, datesInRange, hourOf, openingHours, resolveDay, todayInBerlin } from '@/lib/availability';
import type { AdminData } from '../useAdminData';
import { END_HOURS, NOTE_PRESETS, describeDay, fmtDate, fmtRange, plural } from '../lib';
import { HINTS } from '../hints';
import { MonthGrid, CalendarLegend } from './MonthGrid';
import { DayEditor } from './DayEditor';
import { WeekTemplateEditor } from './WeekTemplateEditor';
import { Card, Hint, Segmented, SectionTitle, TimeSelect, usePersistentState, btn } from './ui';

type Mode = 'day' | 'period';
type Range = { start: string; end: string | null };

const HOW_KEY = 'viva-admin-how-collapsed';

export function ScheduleTab({ data }: { data: AdminData }) {
  const [mode, setMode] = useState<Mode>('day');
  const [month, setMonth] = useState(() => new Date());
  const [editDate, setEditDate] = useState<string | null>(null);
  const [range, setRange] = useState<Range | null>(null);

  const onDayClick = (d: string) => {
    if (mode === 'day') return setEditDate(d);
    if (!range || range.end) return setRange({ start: d, end: null });
    setRange(d < range.start ? { start: d, end: range.start } : { start: range.start, end: d });
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setRange(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <HowItWorks />

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_420px] gap-6 items-start">
        <Card className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <h2 className="text-lg md:text-xl font-medium">Календарь работы</h2>
            <div className="flex items-center gap-1.5">
              <Segmented
                value={mode}
                onChange={switchMode}
                options={[{ value: 'day', label: 'Один день' }, { value: 'period', label: 'Период' }]}
              />
              <Hint text={HINTS.scheduleMode} />
            </div>
          </div>

          <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2 mb-4">
            {mode === 'day'
              ? 'Нажмите на дату, чтобы закрыть её, поменять часы или заблокировать отдельные часы.'
              : !range
                ? 'Нажмите на первую дату периода.'
                : !range.end
                  ? `Начало: ${fmtDate(range.start, 'd MMMM')}. Теперь нажмите на последнюю дату (или ту же, если это один день).`
                  : `Выбрано: ${fmtRange(range.start, range.end)}. Выберите действие ниже.`}
          </p>

          <MonthGrid data={data} month={month} onMonthChange={setMonth} onDayClick={onDayClick} range={mode === 'period' ? range : null} />
          <CalendarLegend />

          {mode === 'period' && range && (
            <PeriodPanel
              data={data}
              range={range}
              onDone={() => setRange(null)}
              onCancel={() => setRange(null)}
            />
          )}
        </Card>

        <UpcomingList data={data} onEdit={setEditDate} />
      </div>

      <WeekTemplateEditor data={data} />

      {editDate && <DayEditor data={data} date={editDate} onClose={() => setEditDate(null)} />}
    </div>
  );
}

// ---------------------------------------------------------

function HowItWorks() {
  const [stored, setStored] = usePersistentState<'0' | '1'>(HOW_KEY, '0');
  const collapsed = stored === '1';
  const toggle = () => setStored(collapsed ? '0' : '1');

  return (
    <Card className="overflow-hidden">
      <button onClick={toggle} className="w-full flex items-center justify-between px-4 md:px-6 py-3 text-left hover:bg-gray-50" aria-expanded={!collapsed}>
        <span className="font-medium">Как работает расписание</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
      </button>
      {!collapsed && (
        <ol className="grid md:grid-cols-3 gap-3 px-4 md:px-6 pb-5 text-sm">
          {[
            ['1', 'Обычный график', 'Ваши обычные часы по дням недели. Настраивается внизу страницы.'],
            ['2', 'Особый день или период', 'Закрыть день, поменять часы или открыть выходной. Всегда важнее обычного графика.'],
            ['3', 'Обычный график не трогает особые дни', 'Если поменять обычный график, все особые дни и периоды останутся как есть.'],
          ].map(([n, title, text]) => (
            <li key={n} className="flex gap-3 bg-gray-50 rounded-lg p-3">
              <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">{n}</span>
              <span><b className="font-medium block">{title}</b><span className="text-gray-600">{text}</span></span>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}

// ---------------------------------------------------------

type PeriodAction = 'close' | 'open' | 'reset';

function PeriodPanel({ data, range, onDone, onCancel }: { data: AdminData; range: Range; onDone: () => void; onCancel: () => void }) {
  const [action, setAction] = useState<PeriodAction>('close');
  const [note, setNote] = useState('Отпуск');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('17:00');
  const [saving, setSaving] = useState(false);

  const end = range.end ?? range.start;
  const dates = useMemo(() => datesInRange(range.start, end), [range.start, end]);
  const existing = dates.filter(d => data.overrides[d]).length;
  const hoursValid = hourOf(startTime) < hourOf(endTime);

  // Simulate the result to warn about bookings that would fall outside working time
  const noteToSave = action === 'close' ? note.trim() : '';
  const nextOverrides = useMemo(() => {
    const o: OverrideMap = { ...data.overrides };
    dates.forEach(d => {
      if (action === 'reset') delete o[d];
      else o[d] = {
        date: d, isWorking: action === 'open', startTime: action === 'open' ? startTime : null,
        endTime: action === 'open' ? endTime : null, blockedHours: [], note: noteToSave || null, groupId: 'pending',
      } satisfies DayOverride;
    });
    return o;
  }, [data.overrides, dates, action, startTime, endTime, noteToSave]);

  const affected = dates.flatMap(d => {
    const list = data.activeByDate[d] || [];
    if (!list.length) return [];
    const hours = openingHours({ ...resolveDay(d, data.template, nextOverrides), blockedHours: [] });
    return list.filter(b => !hours.includes(b.time));
  });

  const apply = async () => {
    setSaving(true);
    const ok = await data.mutate(
      () => applyPeriod({ start: range.start, end, mode: action, startTime, endTime, note: noteToSave }),
      {
        optimistic: s => ({ ...s, overrides: nextOverrides }),
        success: action === 'close' ? `Закрыто: ${fmtRange(range.start, end)}`
          : action === 'open' ? `Открыто: ${fmtRange(range.start, end)}, ${startTime}–${endTime}`
          : `${fmtRange(range.start, end)}: снова по обычному графику`,
      },
    );
    setSaving(false);
    if (ok) onDone();
  };

  if (!range.end) return null;

  const options: { value: PeriodAction; icon: React.ReactNode; label: string; hint: string }[] = [
    { value: 'close', icon: <Lock className="w-4 h-4" />, label: 'Закрыть', hint: HINTS.periodClose },
    { value: 'open', icon: <Unlock className="w-4 h-4" />, label: 'Открыть с часами', hint: HINTS.periodOpen },
    { value: 'reset', icon: <RotateCcw className="w-4 h-4" />, label: 'Вернуть к обычному графику', hint: HINTS.periodReset },
  ];

  return (
    <div className="mt-6 border border-gray-900 rounded-xl p-4 md:p-5 flex flex-col gap-5 bg-white">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium text-base">{fmtRange(range.start, end)}</h3>
          <p className="text-sm text-gray-500">{dates.length} {plural(dates.length, 'день', 'дня', 'дней')}</p>
        </div>
        <button onClick={onCancel} className="p-2 -m-2 text-gray-400 hover:text-gray-900" aria-label="Сбросить выбор"><X className="w-5 h-5" /></button>
      </div>

      <div className="grid sm:grid-cols-3 gap-2" role="radiogroup">
        {options.map(o => (
          <div key={o.value} className={`flex items-center gap-1 rounded-lg border transition-colors ${action === o.value ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 hover:border-gray-400'}`}>
            <button type="button" role="radio" aria-checked={action === o.value} onClick={() => setAction(o.value)} className="flex-1 flex items-center gap-2 px-3 py-3 text-sm font-medium text-left">
              {o.icon}{o.label}
            </button>
            <span className={`pr-2 ${action === o.value ? '[&_button]:text-gray-300 [&_button:hover]:bg-white/10 [&_button:hover]:text-white' : ''}`}><Hint text={o.hint} /></span>
          </div>
        ))}
      </div>

      {action === 'open' && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Часы:</span>
          <span className="text-sm text-gray-500">с</span>
          <TimeSelect label="Начало" value={startTime} onChange={setStartTime} options={ADMIN_HOURS} />
          <span className="text-sm text-gray-500">до</span>
          <TimeSelect label="Конец" value={endTime} onChange={setEndTime} options={END_HOURS} />
          {!hoursValid && <span className="text-sm text-red-600">«с» должно быть раньше «до»</span>}
        </div>
      )}

      {action === 'close' && (
        <div>
          <div className="text-sm font-medium mb-2 flex items-center gap-1.5">Причина <Hint text={HINTS.dayNote} /></div>
          <div className="flex flex-wrap gap-2 mb-2">
            {NOTE_PRESETS.map(p => (
              <button key={p} type="button" onClick={() => setNote(note === p ? '' : p)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${note === p ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 hover:border-gray-400'}`}>
                {p}
              </button>
            ))}
          </div>
          <input value={note} onChange={e => setNote(e.target.value)} maxLength={200} placeholder="Своя причина"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-base outline-none focus:border-gray-900" />
        </div>
      )}

      {/* Hidden while saving: the optimistic update already contains the new days */}
      {existing > 0 && action !== 'reset' && !saving && (
        <p className="text-sm text-sky-900 bg-sky-50 border border-sky-200 rounded-lg p-3 flex items-start gap-2">
          <span className="flex-1">
            {existing} {plural(existing, 'день', 'дня', 'дней')} в этом периоде уже {plural(existing, 'имеет', 'имеют', 'имеют')} особые настройки — они будут заменены.
          </span>
          <Hint text={HINTS.periodOverwrite} />
        </p>
      )}

      {affected.length > 0 && (
        <div className="text-sm bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="flex items-center gap-2 font-medium text-amber-900 mb-2">
            <AlertTriangle className="w-4 h-4" />
            {affected.length} {plural(affected.length, 'запись попадёт', 'записи попадут', 'записей попадут')} в нерабочее время
          </p>
          <ul className="flex flex-col gap-1 mb-2 max-h-40 overflow-y-auto">
            {affected.map(b => (
              <li key={b.id} className="tabular-nums">{fmtDate(b.date, 'd MMM')}, {b.time} — {b.clientName}{b.clientPhone ? `, ${b.clientPhone}` : ''}</li>
            ))}
          </ul>
          <p className="text-amber-800">{HINTS.bookingsWarning}</p>
        </div>
      )}

      <div className="flex gap-2">
        <button className={`${btn.secondary} flex-1`} onClick={onCancel}>Отмена</button>
        <button className={`${action === 'close' ? btn.danger : btn.primary} flex-[2]`} disabled={saving || (action === 'open' && !hoursValid)} onClick={apply}>
          {saving ? 'Сохраняю…'
            : action === 'close' ? `Закрыть ${dates.length} ${plural(dates.length, 'день', 'дня', 'дней')}`
            : action === 'open' ? `Открыть ${dates.length} ${plural(dates.length, 'день', 'дня', 'дней')}`
            : 'Вернуть к обычному графику'}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------

function UpcomingList({ data, onEdit }: { data: AdminData; onEdit: (d: string) => void }) {
  const today = todayInBerlin();

  const items = useMemo(() => {
    const upcoming = Object.values(data.overrides).filter(o => o.date >= today).sort((a, b) => a.date.localeCompare(b.date));
    const groups = new Map<string, DayOverride[]>();
    const out: ({ kind: 'day'; day: DayOverride } | { kind: 'group'; id: string; days: DayOverride[] })[] = [];
    upcoming.forEach(o => {
      if (!o.groupId) return out.push({ kind: 'day', day: o });
      if (!groups.has(o.groupId)) {
        groups.set(o.groupId, []);
        out.push({ kind: 'group', id: o.groupId, days: groups.get(o.groupId)! });
      }
      groups.get(o.groupId)!.push(o);
    });
    return out;
  }, [data.overrides, today]);

  const removeGroup = (id: string, label: string) =>
    data.mutate(() => deleteGroup(id), {
      optimistic: s => {
        const o = { ...s.overrides };
        Object.values(o).forEach(x => { if (x.groupId === id) delete o[x.date]; });
        return { ...s, overrides: o };
      },
      success: `Период ${label} удалён — дни снова по обычному графику`,
    });

  const removeDay = (date: string) =>
    data.mutate(() => resetDay(date), {
      optimistic: s => { const o = { ...s.overrides }; delete o[date]; return { ...s, overrides: o }; },
      success: `${fmtDate(date, 'd MMMM')} снова по обычному графику`,
    });

  return (
    <Card className="p-4 md:p-6">
      <SectionTitle hint={HINTS.upcoming}>Особые дни и периоды</SectionTitle>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
          Пока нет. Все дни работают по обычному графику. Нажмите на дату в календаре или выберите режим «Период», чтобы добавить отпуск.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map(item => {
            if (item.kind === 'group') {
              const first = item.days[0];
              const last = item.days[item.days.length - 1];
              const label = fmtRange(first.date, last.date);
              return (
                <li key={item.id} className={`flex items-center gap-3 p-3 rounded-lg border ${first.isWorking ? 'border-sky-200 bg-sky-50/60' : 'border-red-200 bg-red-50/60'}`}>
                  {first.isWorking ? <Unlock className="w-4 h-4 text-sky-700 flex-shrink-0" /> : <Lock className="w-4 h-4 text-red-600 flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{label}</div>
                    <div className="text-xs text-gray-600">
                      {first.isWorking ? `Открыто ${first.startTime}–${first.endTime}` : 'Закрыто'}
                      {first.note ? ` · ${first.note}` : ''} · {item.days.length} {plural(item.days.length, 'день', 'дня', 'дней')}
                    </div>
                  </div>
                  <button onClick={() => removeGroup(item.id, label)} className={`${btn.ghost} text-red-600 hover:!bg-red-50`} aria-label={`Удалить период ${label}`}>
                    <Trash2 className="w-4 h-4" /><span className="hidden sm:inline">Удалить</span>
                  </button>
                </li>
              );
            }
            const d = item.day;
            const resolved = data.resolve(d.date);
            return (
              <li key={d.date} className={`flex items-center gap-3 p-3 rounded-lg border ${d.isWorking ? 'border-sky-200 bg-sky-50/60' : 'border-red-200 bg-red-50/60'}`}>
                {d.isWorking ? <Settings2 className="w-4 h-4 text-sky-700 flex-shrink-0" /> : <Lock className="w-4 h-4 text-red-600 flex-shrink-0" />}
                <button onClick={() => onEdit(d.date)} className="flex-1 min-w-0 text-left">
                  <div className="font-medium text-sm capitalize">{fmtDate(d.date, 'EEEEEE, d MMMM')}</div>
                  <div className="text-xs text-gray-600 truncate">{describeDay(resolved).replace(/^Особый день · /, '')}</div>
                </button>
                <button onClick={() => onEdit(d.date)} className={btn.ghost} aria-label="Изменить"><Settings2 className="w-4 h-4" /></button>
                <button onClick={() => removeDay(d.date)} className={`${btn.ghost} text-red-600 hover:!bg-red-50`} aria-label="Вернуть к обычному графику"><Trash2 className="w-4 h-4" /></button>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
