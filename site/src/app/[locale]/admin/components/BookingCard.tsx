'use client';

import React, { useState } from 'react';
import { Check, CalendarClock, X, Phone, Mail, MessageCircle, RotateCcw, Trash2, Clock, Calendar } from 'lucide-react';
import { AdminBooking, BookingStatus, setBookingStatus, deleteBooking } from '@/app/actions/admin';
import type { AdminData } from '../useAdminData';
import { fmtCreated, fmtDate, serviceName, whatsappLink } from '../lib';
import { HINTS } from '../hints';
import { Hint, btn } from './ui';
import { RescheduleSheet } from './BookingForms';

const STATUS: Record<BookingStatus, { label: string; badge: string; stripe: string; hint: string }> = {
  pending: { label: 'Новая', badge: 'bg-amber-100 text-amber-800', stripe: 'bg-amber-400', hint: HINTS.statusPending },
  confirmed: { label: 'Подтверждена', badge: 'bg-emerald-100 text-emerald-800', stripe: 'bg-emerald-500', hint: HINTS.statusConfirmed },
  cancelled: { label: 'Отменена', badge: 'bg-gray-200 text-gray-600', stripe: 'bg-gray-300', hint: HINTS.statusCancelled },
};

export function BookingCard({ booking, data, showDate = false }: { booking: AdminBooking; data: AdminData; showDate?: boolean }) {
  const [confirming, setConfirming] = useState<null | 'cancel' | 'delete'>(null);
  const [rescheduling, setRescheduling] = useState(false);
  const st = STATUS[booking.status];

  const changeStatus = (status: BookingStatus, success: string) =>
    data.mutate(() => setBookingStatus(booking.id, status), {
      optimistic: s => ({ ...s, bookings: s.bookings.map(b => (b.id === booking.id ? { ...b, status } : b)) }),
      success,
    });

  const remove = () =>
    data.mutate(() => deleteBooking(booking.id), {
      optimistic: s => ({ ...s, bookings: s.bookings.filter(b => b.id !== booking.id) }),
      success: 'Запись удалена',
    });

  return (
    <article className={`relative bg-white border border-gray-200/80 rounded-xl shadow-sm overflow-hidden ${booking.status === 'cancelled' ? 'opacity-70' : ''}`}>
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${st.stripe}`} />

      <div className="p-4 md:p-5 pl-5 md:pl-6 flex flex-col gap-3">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className={`text-base md:text-lg font-medium leading-tight break-words ${booking.status === 'cancelled' ? 'line-through decoration-gray-400' : ''}`}>
              {booking.clientName}
            </h3>
            <p className="text-sm text-gray-600 mt-0.5">{serviceName(booking.serviceSlug)}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="flex items-center justify-end gap-1.5 text-lg md:text-xl font-medium tabular-nums">
              <Clock className="w-4 h-4 text-gray-400" />{booking.time}
            </div>
            {showDate && (
              <div className="flex items-center justify-end gap-1.5 text-sm text-gray-600 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span className="capitalize">{fmtDate(booking.date, 'EEEEEE, d MMM yyyy')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Status + created */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
          <span className="inline-flex items-center gap-1">
            <span className={`px-2 py-0.5 rounded-full font-medium ${st.badge}`}>{st.label}</span>
            <Hint text={st.hint} />
          </span>
          <span className="text-gray-500 inline-flex items-center gap-1">
            Получена {fmtCreated(booking.createdAt)}
            <Hint text={HINTS.created} />
          </span>
        </div>

        {/* Contacts */}
        {(booking.clientPhone || booking.clientEmail) && (
          <div className="flex flex-wrap gap-2">
            {booking.clientPhone && (
              <>
                <a href={`tel:${booking.clientPhone}`} className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 hover:border-gray-400 tabular-nums">
                  <Phone className="w-4 h-4 text-gray-500" />{booking.clientPhone}
                </a>
                <a href={whatsappLink(booking.clientPhone)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 hover:border-emerald-400">
                  <MessageCircle className="w-4 h-4" />WhatsApp
                </a>
              </>
            )}
            {booking.clientEmail && (
              <a href={`mailto:${booking.clientEmail}`} className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 hover:border-gray-400 min-w-0 max-w-full">
                <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" /><span className="truncate">{booking.clientEmail}</span>
              </a>
            )}
          </div>
        )}

        {booking.clientNotes && (
          <p className="text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 whitespace-pre-line break-words">
            <span className="text-gray-400">Комментарий: </span>{booking.clientNotes}
          </p>
        )}

        {/* Actions */}
        {confirming ? (
          <div className={`rounded-lg p-3 flex flex-col sm:flex-row sm:items-center gap-3 ${confirming === 'delete' ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'}`}>
            <p className="text-sm flex-1">
              {confirming === 'cancel'
                ? 'Отменить запись? Время освободится для других клиентов. Не забудьте предупредить клиента.'
                : 'Удалить запись навсегда? Это действие нельзя отменить.'}
            </p>
            <div className="flex gap-2">
              <button className={btn.secondary} onClick={() => setConfirming(null)}>Назад</button>
              <button
                className={btn.danger}
                onClick={() => {
                  setConfirming(null);
                  if (confirming === 'cancel') changeStatus('cancelled', 'Запись отменена');
                  else remove();
                }}
              >
                {confirming === 'cancel' ? 'Да, отменить' : 'Удалить'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {booking.status === 'pending' && (
              <span className="inline-flex items-center gap-1">
                <button className={`${btn.primary} !bg-emerald-600 hover:!bg-emerald-700`} onClick={() => changeStatus('confirmed', 'Запись подтверждена')}>
                  <Check className="w-4 h-4" />Подтвердить
                </button>
                <Hint text={HINTS.actionConfirm} />
              </span>
            )}
            {booking.status !== 'cancelled' && (
              <>
                <span className="inline-flex items-center gap-1">
                  <button className={btn.secondary} onClick={() => setRescheduling(true)}>
                    <CalendarClock className="w-4 h-4" />Перенести
                  </button>
                  <Hint text={HINTS.actionReschedule} />
                </span>
                <span className="inline-flex items-center gap-1">
                  <button className={`${btn.ghost} text-red-600 hover:!text-red-700 hover:!bg-red-50`} onClick={() => setConfirming('cancel')}>
                    <X className="w-4 h-4" />Отменить
                  </button>
                  <Hint text={HINTS.actionCancel} />
                </span>
              </>
            )}
            {booking.status === 'cancelled' && (
              <>
                <button className={btn.secondary} onClick={() => changeStatus('pending', 'Запись восстановлена')}>
                  <RotateCcw className="w-4 h-4" />Восстановить
                </button>
                <span className="inline-flex items-center gap-1">
                  <button className={`${btn.ghost} text-red-600 hover:!text-red-700 hover:!bg-red-50`} onClick={() => setConfirming('delete')}>
                    <Trash2 className="w-4 h-4" />Удалить навсегда
                  </button>
                  <Hint text={HINTS.actionDelete} />
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {rescheduling && <RescheduleSheet booking={booking} data={data} onClose={() => setRescheduling(false)} />}
    </article>
  );
}
