'use client';

import React, { useState } from 'react';
import { saveWeekTemplate } from '@/app/actions/admin';
import { ADMIN_HOURS, WeekDay, WeekTemplate, hourOf, todayInBerlin } from '@/lib/availability';
import type { AdminData } from '../useAdminData';
import { END_HOURS, plural } from '../lib';
import { HINTS } from '../hints';
import { Card, Hint, SectionTitle, Switch, TimeSelect, btn } from './ui';

const DAYS = [
  { id: 1, label: 'Понедельник' }, { id: 2, label: 'Вторник' }, { id: 3, label: 'Среда' },
  { id: 4, label: 'Четверг' }, { id: 5, label: 'Пятница' }, { id: 6, label: 'Суббота' }, { id: 0, label: 'Воскресенье' },
];

const same = (a: WeekTemplate, b: WeekTemplate) =>
  DAYS.every(({ id }) => a[id].isWorking === b[id].isWorking && a[id].startTime === b[id].startTime && a[id].endTime === b[id].endTime);

export function WeekTemplateEditor({ data }: { data: AdminData }) {
  // null = not editing, so the form follows server data until the first change
  const [edits, setEdits] = useState<WeekTemplate | null>(null);
  const [saving, setSaving] = useState(false);
  const draft = edits ?? data.template;
  const dirty = edits !== null && !same(edits, data.template);

  const update = (id: number, patch: Partial<WeekDay>) =>
    setEdits(prev => { const d = prev ?? data.template; return { ...d, [id]: { ...d[id], ...patch } }; });
  const invalid = DAYS.some(({ id }) => draft[id].isWorking && hourOf(draft[id].startTime) >= hourOf(draft[id].endTime));

  const today = todayInBerlin();
  const upcomingOverrides = Object.keys(data.overrides).filter(d => d >= today).length;

  const save = async () => {
    setSaving(true);
    const next = draft;
    const ok = await data.mutate(() => saveWeekTemplate(DAYS.map(({ id }) => next[id])), {
      optimistic: s => ({ ...s, template: next }),
      success: 'Обычный график сохранён',
    });
    setSaving(false);
    if (ok) setEdits(null);
  };

  return (
    <Card className="p-4 md:p-6">
      <SectionTitle hint={HINTS.template}>Обычный график</SectionTitle>
      <p className="text-sm text-gray-500 -mt-2 mb-4">
        Обычные часы работы. Особые дни и периоды{upcomingOverrides ? ` (впереди ${upcomingOverrides} ${plural(upcomingOverrides, 'день', 'дня', 'дней')})` : ''} не изменятся.
      </p>

      <div className="divide-y divide-gray-100 border-y border-gray-100">
        {DAYS.map(({ id, label }) => {
          const d = draft[id];
          const bad = d.isWorking && hourOf(d.startTime) >= hourOf(d.endTime);
          return (
            <div key={id} className="py-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <label className="flex items-center gap-3 sm:w-48 cursor-pointer">
                <Switch checked={d.isWorking} onChange={v => update(id, { isWorking: v })} label={`${label}: рабочий день`} />
                <span className={`text-base ${d.isWorking ? 'font-medium' : 'text-gray-400'}`}>{label}</span>
              </label>
              {d.isWorking ? (
                <div className="flex items-center gap-2 pl-[60px] sm:pl-0">
                  <span className="text-sm text-gray-500">с</span>
                  <TimeSelect label={`${label}: начало`} value={d.startTime} onChange={v => update(id, { startTime: v })} options={ADMIN_HOURS} />
                  <span className="text-sm text-gray-500">до</span>
                  <TimeSelect label={`${label}: конец`} value={d.endTime} onChange={v => update(id, { endTime: v })} options={END_HOURS} />
                  {bad && <span className="text-xs text-red-600">«с» позже «до»</span>}
                </div>
              ) : (
                <span className="text-sm text-gray-400 pl-[60px] sm:pl-0">Выходной</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-3">
        Как читать часы <Hint text={HINTS.templateHours} />
      </div>

      {dirty && (
        <div className="sticky bottom-20 md:bottom-4 mt-4 flex flex-col sm:flex-row sm:items-center gap-3 bg-gray-900 text-white rounded-xl p-3 shadow-2xl z-10">
          <span className="text-sm flex-1 px-1">Есть несохранённые изменения в обычном графике</span>
          <div className="flex gap-2">
            <button className={`${btn.ghost} !text-gray-300 hover:!bg-white/10 hover:!text-white`} onClick={() => setEdits(null)} disabled={saving}>
              Отменить
            </button>
            <button className={`${btn.primary} !bg-white !text-gray-900 hover:!bg-gray-100`} onClick={save} disabled={saving || invalid}>
              {saving ? 'Сохраняю…' : 'Сохранить график'}
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
