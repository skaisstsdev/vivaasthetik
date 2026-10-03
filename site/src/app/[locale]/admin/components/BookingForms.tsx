'use client';

import React, { useState } from 'react';
import { parseISO } from 'date-fns';
import { AlertTriangle } from 'lucide-react';
import { AdminBooking, createManualBooking, rescheduleBooking } from '@/app/actions/admin';
import { servicesData } from '@/data/services';
import { ADMIN_HOURS, getSlots } from '@/lib/availability';
import type { AdminData } from '../useAdminData';
import { describeDay, fmtDate, fmtDayTitle, serviceName } from '../lib';
import { HINTS } from '../hints';
import { MonthGrid } from './MonthGrid';
import { Hint, Sheet, Switch, btn } from './ui';

// ---------------------------------------------------------
// Date + time picker shared by "new booking" and "reschedule"
// ---------------------------------------------------------

function SlotPicker({ data, date, time, onDate, onTime, ignoreBookingId }: {
  data: AdminData;
  date: string;
  time: string;
  onDate: (d: string) => void;
  onTime: (t: string) => void;
  ignoreBookingId?: string;
}) {
  const [month, setMonth] = useState(() => parseISO(date));
  const [showAll, setShowAll] = useState(false);

  const day = data.resolve(date);
  const taken = (data.activeByDate[date] || []).filter(b => b.id !== ignoreBookingId).map(b => b.time);
  const workSlots = getSlots(day, taken);
  const slots = showAll ? ADMIN_HOURS.filter(h => !taken.includes(h)) : workSlots;
  const outside = time && !workSlots.includes(time);

  return (
    <div className="flex flex-col gap-5">
      <MonthGrid data={data} month={month} onMonthChange={setMonth} selected={date} onDayClick={d => { onDate(d); onTime(''); }} compact />

      <div>
        <div className="flex items-baseline justify-between gap-3 mb-1">
          <h4 className="font-medium capitalize">{fmtDayTitle(date)}</h4>
        </div>
        <p className="text-xs text-gray-500 mb-3">{describeDay(day)}</p>

        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {slots.length === 0 ? (
            <p className="col-span-full text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
              Нет свободного времени по графику. Включите «Все часы», чтобы записать вне графика.
            </p>
          ) : slots.map(t => {
            const off = !workSlots.includes(t);
            return (
              <button
                key={t}
                type="button"
                onClick={() => onTime(t)}
                className={`py-2.5 rounded-lg border text-sm tabular-nums transition-colors ${
                  time === t ? 'bg-gray-900 text-white border-gray-900' : off ? 'bg-amber-50 border-amber-200 text-amber-800 hover:border-amber-500' : 'bg-white border-gray-200 hover:border-gray-900'
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>

        <label className="flex items-center gap-3 mt-4 text-sm">
          <Switch checked={showAll} onChange={setShowAll} label="Показать все часы" />
          <span>Все часы (8:00–22:00)</span>
          <Hint text={HINTS.slotsAll} />
        </label>

        {outside && (
          <p className="flex items-start gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            {time} — вне рабочего времени этого дня. Запись всё равно можно сохранить.
          </p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// Reschedule
// ---------------------------------------------------------

export function RescheduleSheet({ booking, data, onClose }: { booking: AdminBooking; data: AdminData; onClose: () => void }) {
  const [date, setDate] = useState(booking.date);
  const [time, setTime] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    const ok = await data.mutate(() => rescheduleBooking(booking.id, date, time), {
      optimistic: s => ({ ...s, bookings: s.bookings.map(b => (b.id === booking.id ? { ...b, date, time } : b)) }),
      success: `Запись перенесена на ${fmtDate(date, 'd MMMM')}, ${time}`,
    });
    setSaving(false);
    if (ok) onClose();
  };

  return (
    <Sheet
      title="Перенос записи"
      subtitle={<>{booking.clientName} · {serviceName(booking.serviceSlug)}<br />Сейчас: {fmtDate(booking.date, 'd MMMM')}, {booking.time}</>}
      onClose={onClose}
      footer={
        <div className="flex gap-2">
          <button className={`${btn.secondary} flex-1`} onClick={onClose}>Отмена</button>
          <button className={`${btn.primary} flex-[2]`} disabled={!time || saving} onClick={submit}>
            {saving ? 'Сохраняю…' : time ? `Перенести на ${fmtDate(date, 'd MMM')}, ${time}` : 'Выберите время'}
          </button>
        </div>
      }
    >
      <SlotPicker data={data} date={date} time={time} onDate={setDate} onTime={setTime} ignoreBookingId={booking.id} />
    </Sheet>
  );
}

// ---------------------------------------------------------
// New booking (added by admin)
// ---------------------------------------------------------

export function ManualBookingSheet({ data, defaultDate, defaultTime = '', onClose }: {
  data: AdminData;
  defaultDate: string;
  defaultTime?: string;
  onClose: () => void;
}) {
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);
  const [serviceSlug, setServiceSlug] = useState(servicesData[0]?.slug ?? '');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const canSave = !!time && !!name.trim() && !saving;

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canSave) return;
    setSaving(true);
    const ok = await data.mutate(
      () => createManualBooking({ serviceSlug, date, time, clientName: name, clientPhone: phone, clientEmail: email, clientNotes: notes }),
      { success: `${name} записан(а) на ${fmtDate(date, 'd MMMM')}, ${time}` },
    );
    setSaving(false);
    if (ok) onClose();
  };

  const input = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-base outline-none focus:border-gray-900 bg-white';

  return (
    <Sheet
      title="Новая запись"
      subtitle="Запись, добавленная вами, сразу подтверждена"
      onClose={onClose}
      wide
      footer={
        <div className="flex gap-2">
          <button className={`${btn.secondary} flex-1`} onClick={onClose}>Отмена</button>
          <button className={`${btn.primary} flex-[2]`} disabled={!canSave} onClick={() => submit()}>
            {saving ? 'Сохраняю…' : !time ? 'Выберите время' : !name.trim() ? 'Укажите имя' : `Записать на ${fmtDate(date, 'd MMM')}, ${time}`}
          </button>
        </div>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-6">
        <fieldset className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium flex items-center gap-1.5">Процедура <Hint text={HINTS.manualService} /></span>
            <select value={serviceSlug} onChange={e => setServiceSlug(e.target.value)} className={input}>
              {servicesData.map(s => <option key={s.slug} value={s.slug}>{s.title.de}</option>)}
            </select>
          </label>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Имя клиента *</span>
              <input value={name} onChange={e => setName(e.target.value)} className={input} autoComplete="off" required />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium flex items-center gap-1.5">Телефон <Hint text={HINTS.manualContact} /></span>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={input} autoComplete="off" placeholder="+49 …" />
            </label>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Email <span className="text-gray-400 font-normal">(необязательно)</span></span>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={input} autoComplete="off" />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Комментарий <span className="text-gray-400 font-normal">(необязательно)</span></span>
              <input value={notes} onChange={e => setNotes(e.target.value)} className={input} autoComplete="off" />
            </label>
          </div>
        </fieldset>

        <div className="border-t border-gray-100 pt-5">
          <h4 className="text-sm font-medium mb-3">Дата и время</h4>
          <SlotPicker data={data} date={date} time={time} onDate={setDate} onTime={setTime} />
        </div>
      </form>
    </Sheet>
  );
}
