'use client';

import React, { useMemo, useState } from 'react';
import { Search, Inbox } from 'lucide-react';
import type { AdminBooking } from '@/app/actions/admin';
import type { AdminData } from '../useAdminData';
import { serviceName, sortByVisit, toDateStr } from '../lib';
import { HINTS } from '../hints';
import { BookingCard } from './BookingCard';
import { Card, Hint, Segmented } from './ui';

type Segment = 'new' | 'upcoming' | 'past' | 'cancelled' | 'all';

const byCreatedDesc = (a: AdminBooking, b: AdminBooking) => b.createdAt.localeCompare(a.createdAt);

const EMPTY: Record<Segment, string> = {
  new: 'Новых заявок нет — все обработаны.',
  upcoming: 'Предстоящих записей нет.',
  past: 'Прошедших записей нет.',
  cancelled: 'Отменённых записей нет.',
  all: 'Записей пока нет.',
};

export function RequestsTab({ data, initialSegment = 'all' }: { data: AdminData; initialSegment?: Segment }) {
  const [segment, setSegment] = useState<Segment>(initialSegment);
  const [query, setQuery] = useState('');
  const today = toDateStr(new Date());

  const groups = useMemo(() => {
    const active = data.bookings.filter(b => b.status !== 'cancelled');
    return {
      new: data.bookings.filter(b => b.status === 'pending').sort(byCreatedDesc),
      upcoming: active.filter(b => b.date >= today).sort(sortByVisit),
      past: active.filter(b => b.date < today).sort((a, b) => sortByVisit(b, a)),
      cancelled: data.bookings.filter(b => b.status === 'cancelled').sort(byCreatedDesc),
      all: [...data.bookings].sort(byCreatedDesc),
    } satisfies Record<Segment, AdminBooking[]>;
  }, [data.bookings, today]);

  const q = query.trim().toLowerCase();
  const list = q
    ? groups[segment].filter(b =>
        [b.clientName, b.clientPhone, b.clientEmail, serviceName(b.serviceSlug)].some(v => v?.toLowerCase().includes(q)) ||
        (b.clientPhone && q.replace(/\D/g, '') && b.clientPhone.replace(/\D/g, '').includes(q.replace(/\D/g, ''))))
    : groups[segment];

  const label = (text: string, n: number, accent = false) => (
    <span className="inline-flex items-center gap-1.5">
      {text}
      <span className={`text-xs px-1.5 rounded-full tabular-nums ${accent && n ? 'bg-amber-400 text-gray-900 font-semibold' : 'text-gray-400'}`}>{n}</span>
    </span>
  );

  return (
    <div className="flex flex-col gap-5 max-w-4xl">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
            <Segmented
              value={segment}
              onChange={setSegment}
              options={[
                { value: 'all', label: label('Все', groups.all.length) },
                { value: 'new', label: label('Новые', groups.new.length, true) },
                { value: 'upcoming', label: label('Предстоящие', groups.upcoming.length) },
                { value: 'past', label: label('Прошедшие', groups.past.length) },
                { value: 'cancelled', label: label('Отменённые', groups.cancelled.length) },
              ]}
            />
          </div>
          <Hint text={HINTS.requestsSegments} />
        </div>

        <div className="flex items-center gap-2">
          <label className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Поиск: имя, телефон, email"
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-base bg-white outline-none focus:border-gray-900"
            />
          </label>
          <Hint text={HINTS.requestsSearch} />
        </div>

        <p className="text-xs text-gray-500">
          {segment === 'all' || segment === 'new' || segment === 'cancelled'
            ? 'Сначала самые свежие заявки'
            : segment === 'upcoming' ? 'По дате визита: ближайшие сверху' : 'По дате визита: последние сверху'}
        </p>
      </div>

      {list.length === 0 ? (
        <Card className="p-10 flex flex-col items-center gap-3 text-center text-gray-500">
          <Inbox className="w-8 h-8 text-gray-300" />
          <p className="text-sm">{q ? 'Ничего не найдено.' : EMPTY[segment]}</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {list.map(b => <BookingCard key={b.id} booking={b} data={data} showDate />)}
        </div>
      )}
    </div>
  );
}
