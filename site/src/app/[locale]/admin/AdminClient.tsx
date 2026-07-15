'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDatabase, BookingStatus } from '@/context/DatabaseContext';
import { format, parseISO, isSameDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { Calendar, Clock, LogOut, Check, X, Trash2, Edit2, Plus, ArrowLeft, Info, ChevronDown, ChevronUp, Bell } from 'lucide-react';
import { servicesData } from '@/data/services';

export default function AdminClient({ locale }: { locale: string }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState<'calendar' | 'bookings' | 'schedule' | 'exceptions'>('calendar');
  const [toastMessage, setToastMessage] = useState('');

  const db = useDatabase();
  const prevBookingsCount = useRef(0);

  useEffect(() => {
    if (db.bookings.length > prevBookingsCount.current && prevBookingsCount.current !== 0) {
      setToastMessage('У вас новая запись! Проверьте вкладку заявок.');
      // Add sound if possible
      try {
        const audio = new Audio('/notification.mp3');
        audio.play().catch(() => {});
      } catch (e) {}
      
      setTimeout(() => setToastMessage(''), 3000);
    }
    prevBookingsCount.current = db.bookings.length;
  }, [db.bookings.length]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'viva2026') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Неверный пароль');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-sans text-gray-900">
        <form onSubmit={handleLogin} className="bg-white p-8 md:p-12 shadow-xl border border-gray-100 rounded-sm w-full max-w-md">
          <h2 className="text-3xl font-light text-center mb-8 text-gray-900">Вход в админ панель</h2>
          <div className="flex flex-col gap-2 mb-6">
            <label className="text-xs uppercase tracking-widest text-gray-500 font-mono">Пароль</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="border-b border-gray-300 py-2 outline-none focus:border-gray-900 transition-colors text-gray-900 bg-transparent w-full"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          <button type="submit" className="w-full bg-gray-900 text-white py-4 uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors">
            Войти
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans text-gray-900 w-full overflow-x-hidden">
      
      {/* Toast Notification */}
      <div className={`fixed top-6 right-6 z-50 transition-all duration-500 transform ${toastMessage ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className="bg-gray-900 text-white px-6 py-4 rounded-md shadow-2xl flex items-center gap-3 border border-gray-700">
          <Bell className="w-5 h-5 text-gray-300" />
          <span className="font-medium tracking-wide">{toastMessage}</span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gray-900 text-white pt-12 pb-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-light tracking-wide mb-2">CRM Viva Ästhetik</h1>
            <p className="text-gray-400 font-mono text-sm uppercase tracking-widest">Управление записями и графиком</p>
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm uppercase tracking-widest">Выйти</span>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex gap-6 overflow-x-auto no-scrollbar">
          {[
            { id: 'calendar', label: 'Календарь' },
            { id: 'bookings', label: 'Список записей' },
            { id: 'schedule', label: 'График работы' },
            { id: 'exceptions', label: 'Отпуска и Исключения' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 text-xs md:text-sm font-mono uppercase tracking-widest border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id 
                  ? 'border-gray-900 text-gray-900' 
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 w-full">
        {activeTab === 'calendar' && <CalendarTab db={db} locale={locale} />}
        {activeTab === 'bookings' && <BookingsTab db={db} locale={locale} />}
        {activeTab === 'schedule' && <ScheduleTab db={db} />}
        {activeTab === 'exceptions' && <ExceptionsTab db={db} />}
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// TAB 1: CALENDAR VIEW
// ---------------------------------------------------------
function CalendarTab({ db, locale }: { db: ReturnType<typeof useDatabase>, locale: string }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showManualModal, setShowManualModal] = useState(false);

  const dayStr = format(selectedDate, 'yyyy-MM-dd');
  const dayBookings = db.bookings.filter(b => b.date === dayStr && b.status !== 'cancelled');

  // Time bar generation (8:00 - 20:00)
  const hours = Array.from({length: 13}).map((_, i) => {
    const h = i + 8;
    const timeStr = `${h.toString().padStart(2, '0')}:00`;
    const isBooked = dayBookings.some(b => b.time === timeStr);
    return { time: timeStr, isBooked, label: `${h}` };
  });

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-300">
      
      {/* Left Column: Calendar & Time Bar */}
      <div className="flex flex-col gap-6 mx-auto lg:mx-0 w-full lg:w-auto flex-shrink-0">
        <div className="bg-white p-6 md:p-8 border border-gray-100 rounded-sm shadow-sm">
          <DayPicker 
            mode="single"
            selected={selectedDate}
            onSelect={(d) => d && setSelectedDate(d)}
            locale={ru}
            className="font-sans"
            modifiers={{
              hasBooking: (date) => db.bookings.some(b => b.date === format(date, 'yyyy-MM-dd') && b.status !== 'cancelled')
            }}
            modifiersClassNames={{
              selected: "!bg-blue-600 !text-white !font-bold rounded-md shadow-md hover:!bg-blue-700",
              today: "font-semibold text-gray-900 bg-gray-50 rounded-sm",
              hasBooking: "bg-blue-50 border border-blue-200 text-blue-800 font-bold relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-blue-600 after:rounded-full"
            }}
          />
        </div>

        <div className="bg-white p-4 md:p-6 border border-gray-100 rounded-sm shadow-sm flex flex-col">
          <h4 className="text-[10px] uppercase tracking-widest text-gray-400 mb-4">Занятость (8:00 - 20:00)</h4>
          <div className="flex w-full border border-gray-200 rounded-sm overflow-hidden">
            {hours.map((slot, i) => (
              <div 
                key={slot.time} 
                className={`flex-1 flex items-center justify-center py-2 border-r last:border-r-0 border-gray-100 transition-colors ${slot.isBooked ? 'bg-blue-500 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-400'}`}
                title={slot.time + (slot.isBooked ? ' (Занято)' : ' (Свободно)')}
              >
                <span className="text-[10px] font-mono font-medium">
                  {slot.label}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-50 border border-gray-200"></div> Свободно</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500"></div> Занято</div>
          </div>
        </div>
      </div>

      {/* Right Column: Bookings List */}
      <div className="flex-1 bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <div>
            <h3 className="font-medium text-lg md:text-xl text-gray-900">{format(selectedDate, 'd MMMM yyyy', { locale: ru })}</h3>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              {dayBookings.length} {dayBookings.length === 1 ? 'запись' : 'записей'}
            </p>
          </div>
          <button 
            onClick={() => setShowManualModal(true)}
            className="flex items-center gap-2 bg-gray-900 text-white px-3 py-2 md:px-4 md:py-2 rounded-sm text-xs md:text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Добавить
          </button>
        </div>
        
        <div className="p-4 md:p-6 flex-1 flex flex-col gap-4">
          {dayBookings.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              На этот день нет записей
            </div>
          ) : (
            dayBookings.sort((a,b) => a.time.localeCompare(b.time)).map(booking => (
              <BookingCard key={booking.id} booking={booking} db={db} locale={locale} />
            ))
          )}
        </div>
      </div>

      {showManualModal && (
        <ManualBookingModal 
          db={db} 
          locale={locale}
          defaultDate={selectedDate}
          onClose={() => setShowManualModal(false)} 
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------
// TAB 2: BOOKINGS LIST
// ---------------------------------------------------------
function BookingsTab({ db, locale }: { db: ReturnType<typeof useDatabase>, locale: string }) {
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');

  const filtered = db.bookings
    .filter(b => filter === 'all' || b.status === filter)
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h2 className="text-2xl font-light">Управление записями</h2>
        <div className="flex bg-white border border-gray-200 rounded-sm overflow-hidden text-xs md:text-sm font-mono uppercase tracking-widest w-full sm:w-auto">
          {[
            { id: 'all', label: 'Все' },
            { id: 'pending', label: 'Новые' },
            { id: 'confirmed', label: 'Подтвержд.' },
            { id: 'cancelled', label: 'Отменены' }
          ].map(f => (
            <button 
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`flex-1 sm:flex-none px-3 py-2 border-r last:border-r-0 border-gray-200 transition-colors whitespace-nowrap ${filter === f.id ? 'bg-gray-900 text-white' : 'hover:bg-gray-50'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white border border-gray-100 rounded-sm text-gray-500">
            Записей не найдено.
          </div>
        ) : (
          filtered.map(booking => (
            <BookingCard key={booking.id} booking={booking} db={db} locale={locale} showDate />
          ))
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// TAB 3: SCHEDULE
// ---------------------------------------------------------
function ScheduleTab({ db }: { db: ReturnType<typeof useDatabase> }) {
  const daysOfWeek = [
    { id: 1, label: 'Понедельник' },
    { id: 2, label: 'Вторник' },
    { id: 3, label: 'Среда' },
    { id: 4, label: 'Четверг' },
    { id: 5, label: 'Пятница' },
    { id: 6, label: 'Суббота' },
    { id: 0, label: 'Воскресенье' },
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-light mb-2">Стандартный график работы</h2>
        <p className="text-gray-500 text-sm max-w-2xl">
          Настройте стандартные рабочие дни недели. Календарь автоматически сгенерирует слоты с шагом 1 час.
        </p>
      </div>
      
      <div className="bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm w-full max-w-4xl">
        {daysOfWeek.map((day, index) => {
          const config = db.workingHours[day.id];
          return (
            <div key={day.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 md:p-6 ${index !== daysOfWeek.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <div className="flex items-center gap-4 sm:w-1/3 mb-4 sm:mb-0">
                <div 
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors flex-shrink-0 ${config?.isWorking ? 'bg-gray-900' : 'bg-gray-300'}`}
                  onClick={() => db.updateWorkingHours(day.id, { ...config, isWorking: !config?.isWorking })}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${config?.isWorking ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
                <span className={`text-base md:text-lg font-medium ${config?.isWorking ? 'text-gray-900' : 'text-gray-400'}`}>{day.label}</span>
              </div>
              
              <div className={`flex items-center gap-4 sm:w-2/3 sm:justify-end transition-opacity ${config?.isWorking ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                <div className="flex items-center gap-3 bg-gray-50 p-2 md:p-3 border border-gray-100 rounded-sm w-full sm:w-auto justify-between sm:justify-start">
                  <span className="text-xs text-gray-500 uppercase tracking-widest hidden sm:inline">С</span>
                  <select 
                    value={config?.startTime || '10:00'}
                    onChange={e => db.updateWorkingHours(day.id, { ...config, startTime: e.target.value })}
                    className="border border-gray-200 p-2 text-sm md:text-base outline-none focus:border-gray-900 bg-white rounded-sm w-24 text-center"
                  >
                    {Array.from({length: 13}).map((_, i) => {
                      const time = `${(i + 8).toString().padStart(2, '0')}:00`;
                      return <option key={time} value={time}>{time}</option>;
                    })}
                  </select>
                  <span className="text-gray-400">—</span>
                  <span className="text-xs text-gray-500 uppercase tracking-widest hidden sm:inline">ДО</span>
                  <select 
                    value={config?.endTime || '17:00'}
                    onChange={e => db.updateWorkingHours(day.id, { ...config, endTime: e.target.value })}
                    className="border border-gray-200 p-2 text-sm md:text-base outline-none focus:border-gray-900 bg-white rounded-sm w-24 text-center"
                  >
                    {Array.from({length: 13}).map((_, i) => {
                      const time = `${(i + 10).toString().padStart(2, '0')}:00`;
                      return <option key={time} value={time}>{time}</option>;
                    })}
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// TAB 4: EXCEPTIONS
// ---------------------------------------------------------
function ExceptionsTab({ db }: { db: ReturnType<typeof useDatabase> }) {
  const [newVacationStart, setNewVacationStart] = useState('');
  const [newVacationEnd, setNewVacationEnd] = useState('');

  const [exceptionDate, setExceptionDate] = useState('');
  const [editingException, setEditingException] = useState<{ isWorking: boolean, blockedHours: string[] } | null>(null);

  const handleDateSelect = (dateStr: string) => {
    setExceptionDate(dateStr);
    if (dateStr) {
      const existing = db.dateExceptions[dateStr];
      if (existing) {
        setEditingException({ isWorking: existing.isWorking ?? true, blockedHours: existing.blockedHours || [] });
      } else {
        setEditingException({ isWorking: false, blockedHours: [] });
      }
    } else {
      setEditingException(null);
    }
  };

  const saveException = () => {
    if (exceptionDate && editingException) {
      db.updateDateException(exceptionDate, editingException);
      setExceptionDate('');
      setEditingException(null);
    }
  };

  const cancelException = () => {
    setExceptionDate('');
    setEditingException(null);
  };

  const activeExceptions = Object.entries(db.dateExceptions).filter(([_, exc]) => exc.isWorking === false || (exc.blockedHours && exc.blockedHours.length > 0));

  return (
    <div className="flex flex-col gap-12 animate-in fade-in duration-300">
      
      <section className="bg-white border border-gray-100 rounded-sm shadow-sm p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-light mb-2">Закрытые периоды (Отпуск)</h2>
        <p className="text-gray-500 mb-6 text-xs md:text-sm max-w-3xl">Укажите период (От и До). В эти дни запись будет полностью недоступна.</p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-end mb-8">
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <label className="text-[10px] text-gray-400 uppercase tracking-widest">С даты</label>
            <input type="date" value={newVacationStart} onChange={e => setNewVacationStart(e.target.value)} className="border border-gray-200 p-2 rounded-sm w-full" />
          </div>
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <label className="text-[10px] text-gray-400 uppercase tracking-widest">По дату</label>
            <input type="date" value={newVacationEnd} onChange={e => setNewVacationEnd(e.target.value)} className="border border-gray-200 p-2 rounded-sm w-full" />
          </div>
          <button 
            onClick={() => {
              if (newVacationStart && newVacationEnd) {
                db.addBlockedPeriod({ startDate: newVacationStart, endDate: newVacationEnd });
                setNewVacationStart(''); setNewVacationEnd('');
              }
            }}
            disabled={!newVacationStart || !newVacationEnd}
            className="bg-gray-900 text-white px-6 py-2 rounded-sm text-sm uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50 h-[42px] w-full sm:w-auto transition-colors whitespace-nowrap"
          >
            Добавить
          </button>
        </div>

        {db.blockedPeriods.length > 0 && (
          <div className="grid gap-2">
            <h3 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-2 mt-4">Активные периоды отпусков</h3>
            {db.blockedPeriods.map(p => (
              <div key={p.id} className="flex justify-between items-center p-3 md:p-4 bg-gray-50 border border-gray-100 rounded-sm">
                <span className="font-medium text-sm">
                  {format(parseISO(p.startDate), 'dd.MM.yyyy')} — {format(parseISO(p.endDate), 'dd.MM.yyyy')}
                </span>
                <button onClick={() => db.removeBlockedPeriod(p.id)} className="text-red-500 hover:text-red-700 p-2">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white border border-gray-100 rounded-sm shadow-sm p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-light mb-2">Исключения для конкретных дней</h2>
        <p className="text-gray-500 mb-6 text-xs md:text-sm max-w-3xl">Здесь можно переопределить настройки для одного конкретного дня.</p>
        
        {!editingException ? (
          <div className="flex flex-col gap-2 mb-8 max-w-xs">
            <label className="text-[10px] text-gray-400 uppercase tracking-widest">Выберите дату для настройки</label>
            <input type="date" value={exceptionDate} onChange={e => handleDateSelect(e.target.value)} className="border border-gray-200 p-3 rounded-sm outline-none focus:border-gray-900 w-full" />
          </div>
        ) : (
          <div className="border border-gray-200 rounded-sm p-4 md:p-6 bg-gray-50 animate-in fade-in relative mb-8">
            <h3 className="font-medium text-base md:text-lg mb-6">Настройка исключения на {format(parseISO(exceptionDate), 'd MMMM yyyy', { locale: ru })}</h3>
            
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-sm">
                <div 
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors flex-shrink-0 ${editingException.isWorking ? 'bg-green-500' : 'bg-red-500'}`}
                  onClick={() => setEditingException(prev => prev ? { ...prev, isWorking: !prev.isWorking } : null)}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${editingException.isWorking ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
                <span className="font-medium text-sm md:text-base">{editingException.isWorking ? 'Сделать рабочим днем' : 'Сделать выходным (Закрыть весь день)'}</span>
              </div>

              {editingException.isWorking && (
                <div className="p-4 bg-white border border-gray-100 rounded-sm">
                  <h4 className="font-medium text-xs mb-4 uppercase tracking-widest text-gray-500">Заблокировать часы</h4>
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                    {Array.from({length: 13}).map((_, i) => {
                      const time = `${(i + 8).toString().padStart(2, '0')}:00`;
                      const isBlocked = editingException.blockedHours.includes(time);
                      return (
                        <button
                          key={time}
                          onClick={() => {
                            const newBlocks = isBlocked 
                              ? editingException.blockedHours.filter(t => t !== time) 
                              : [...editingException.blockedHours, time];
                            setEditingException(prev => prev ? { ...prev, blockedHours: newBlocks } : null);
                          }}
                          className={`py-2 px-1 border rounded-sm text-xs md:text-sm transition-colors ${
                            isBlocked ? 'bg-red-50 border-red-200 text-red-600 line-through' : 'bg-white border-gray-200 text-gray-900 hover:border-gray-900'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <button onClick={saveException} className="px-6 py-3 bg-blue-600 text-white rounded-sm uppercase tracking-widest text-xs md:text-sm hover:bg-blue-700 transition-colors">Сохранить</button>
                <button onClick={cancelException} className="px-6 py-3 border border-gray-200 text-gray-600 bg-white rounded-sm uppercase tracking-widest text-xs md:text-sm hover:bg-gray-50 transition-colors">Отмена</button>
              </div>
            </div>
          </div>
        )}

        {activeExceptions.length > 0 && (
          <div className="mt-8 border-t border-gray-100 pt-8">
            <h3 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-4">Активные исключения</h3>
            <div className="grid gap-3">
              {activeExceptions.map(([date, exc]) => (
                <div key={date} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 md:p-4 bg-gray-50 border border-gray-100 rounded-sm gap-4">
                  <div>
                    <span className="font-medium text-base block mb-1">{format(parseISO(date), 'd MMMM yyyy', { locale: ru })}</span>
                    {exc.isWorking === false ? (
                      <span className="text-red-600 text-xs font-medium bg-red-50 px-2 py-1 rounded-sm">Полностью закрыт</span>
                    ) : (
                      <span className="text-orange-600 text-xs font-medium bg-orange-50 px-2 py-1 rounded-sm">Блок: {exc.blockedHours?.join(', ')}</span>
                    )}
                  </div>
                  <button 
                    onClick={() => db.removeDateException(date)} 
                    className="flex items-center gap-1 text-red-500 hover:text-red-700 p-2 text-xs uppercase tracking-widest transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Удалить
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}


// ---------------------------------------------------------
// UTILS & COMPONENTS
// ---------------------------------------------------------

function BookingCard({ booking, db, locale, showDate = false }: { booking: any, db: ReturnType<typeof useDatabase>, locale: string, showDate?: boolean }) {
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const [newDate, setNewDate] = useState<Date | undefined>(new Date(booking.date));
  const [newTime, setNewTime] = useState<string>('');

  // Always use Original German name for admin clarity, fallback to slug if not found
  const serviceName = servicesData.find(s => s.slug === booking.serviceSlug)?.title.de || booking.serviceSlug;

  const handleReschedule = async () => {
    if (!newDate || !newTime) return;
    const success = await db.rescheduleBooking(booking.id, format(newDate, 'yyyy-MM-dd'), newTime);
    if (success) setIsRescheduling(false);
    else alert('Ошибка: Это время уже занято или недоступно.');
  };

  if (isCancelling) {
    return (
      <div className="bg-red-50 border border-red-100 p-4 md:p-6 flex flex-col items-center justify-center gap-4 animate-in fade-in">
        <h4 className="text-red-800 font-medium text-base md:text-lg text-center">Уверены, что хотите отменить эту запись?</h4>
        <p className="text-red-600 text-sm text-center">{booking.clientName} — {serviceName}</p>
        <div className="flex gap-4 mt-2">
          <button onClick={() => setIsCancelling(false)} className="px-4 py-2 border border-red-200 text-red-700 bg-white hover:bg-red-50 rounded-sm text-xs md:text-sm uppercase tracking-widest">Нет, назад</button>
          <button onClick={() => { db.updateBookingStatus(booking.id, 'cancelled'); setIsCancelling(false); }} className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-sm text-xs md:text-sm uppercase tracking-widest">Да, отменить</button>
        </div>
      </div>
    );
  }

  if (isRescheduling) {
    const slots = newDate ? db.getAvailableSlots(newDate) : [];
    return (
      <div className="bg-gray-50 border border-gray-200 p-4 md:p-6 flex flex-col gap-6 animate-in fade-in">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <h4 className="font-medium text-lg">Перенос записи</h4>
          <button onClick={() => setIsRescheduling(false)} className="text-gray-400 hover:text-gray-900"><X className="w-5 h-5"/></button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <DayPicker 
            mode="single" selected={newDate} onSelect={(d) => { d && setNewDate(d); setNewTime(''); }} 
            locale={ru} disabled={[(date: Date) => db.isDayBlockedOrNonWorking(date)]}
            className="bg-white p-4 border border-gray-100 rounded-sm font-sans mx-auto lg:mx-0 w-full md:w-auto overflow-x-auto"
            modifiersClassNames={{ selected: "!bg-blue-600 !text-white !font-bold rounded-md shadow-md hover:!bg-blue-700", today: "font-semibold text-gray-900 bg-gray-50 rounded-sm" }}
          />
          <div className="flex-1 w-full">
            <label className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 block">Доступное время на {newDate ? format(newDate, 'd MMMM') : ''}</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.length === 0 ? (
                <span className="text-sm text-gray-400 col-span-full">Нет времени</span>
              ) : (
                slots.map(t => (
                  <button key={t} onClick={() => setNewTime(t)} className={`py-2 text-xs md:text-sm border rounded-sm transition-colors ${newTime === t ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 hover:border-gray-400'}`}>
                    {t}
                  </button>
                ))
              )}
            </div>
            <button 
              onClick={handleReschedule} disabled={!newDate || !newTime} 
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-sm uppercase tracking-widest text-xs md:text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Подтвердить перенос
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-100 p-4 md:p-6 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow relative overflow-hidden ${booking.status === 'cancelled' ? 'opacity-60 grayscale' : ''}`}>
      {booking.status === 'pending' && <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400" title="Новая заявка" />}
      {booking.status === 'confirmed' && <div className="absolute top-0 left-0 w-1 h-full bg-green-500" title="Подтверждено" />}
      {booking.status === 'cancelled' && <div className="absolute top-0 left-0 w-1 h-full bg-red-500" title="Отменено" />}
      
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        {/* Left Side: Client Info */}
        <div className="flex flex-col gap-1 w-full md:w-1/2">
          <div className="flex items-center gap-3">
            <span className="font-medium text-lg">{booking.clientName}</span>
          </div>
          <span className="text-gray-900 text-sm mt-1 font-medium bg-gray-50 p-2 border border-gray-100 rounded-sm inline-block w-fit text-blue-800">
            {serviceName}
          </span>
          {showDate && (
            <div className="flex items-center gap-2 text-gray-500 mt-2 text-sm">
              <Calendar className="w-3.5 h-3.5" />
              <span>{format(parseISO(booking.date), 'EEEE, d MMMM yyyy', { locale: ru })}</span>
            </div>
          )}
        </div>
        
        {/* Right Side: Time & Status */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start w-full md:w-auto gap-2">
          <div className="flex items-center gap-2 text-gray-900">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-xl">{booking.time}</span>
          </div>
          <div className="text-[10px] md:text-xs uppercase tracking-widest font-mono">
            {booking.status === 'pending' && <span className="text-yellow-600 bg-yellow-50 px-2 py-1 rounded-sm">Новая</span>}
            {booking.status === 'confirmed' && <span className="text-green-600 bg-green-50 px-2 py-1 rounded-sm">Подтверждена</span>}
            {booking.status === 'cancelled' && <span className="text-red-600 bg-red-50 px-2 py-1 rounded-sm">Отменена</span>}
          </div>
        </div>
      </div>
      
      {/* Expanded Details Section */}
      {isExpanded && (
        <div className="mt-2 p-4 bg-gray-50 border border-gray-100 rounded-sm flex flex-col gap-2 text-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2"><span className="text-gray-400 w-16">Телефон:</span> <span className="font-medium">{booking.clientPhone || '—'}</span></div>
          <div className="flex items-center gap-2"><span className="text-gray-400 w-16">Email:</span> <span className="font-medium">{booking.clientEmail || '—'}</span></div>
          {booking.clientNotes && (
            <div className="flex items-start gap-2 mt-2">
              <span className="text-gray-400 w-16">Заметка:</span> 
              <span className="italic text-gray-700">{booking.clientNotes}</span>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-50 flex-wrap gap-4">
        <button 
          onClick={() => setIsExpanded(!isExpanded)} 
          className="flex items-center gap-2 text-xs uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Info className="w-3.5 h-3.5" />
          {isExpanded ? 'Скрыть информацию' : 'Детали клиента'}
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          {booking.status === 'pending' && (
            <button onClick={() => db.updateBookingStatus(booking.id, 'confirmed')} className="p-2 md:p-3 bg-green-50 text-green-600 hover:bg-green-100 rounded-full transition-colors" title="Подтвердить">
              <Check className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          )}
          {booking.status !== 'cancelled' && (
            <>
              <button onClick={() => setIsRescheduling(true)} className="p-2 md:p-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-full transition-colors" title="Перенести">
                <Edit2 className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button onClick={() => setIsCancelling(true)} className="p-2 md:p-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-full transition-colors" title="Отменить">
                <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </>
          )}
          {booking.status === 'cancelled' && (
            <button onClick={() => db.updateBookingStatus(booking.id, 'pending')} className="text-[10px] md:text-xs text-gray-400 hover:text-gray-900 underline underline-offset-4 uppercase tracking-widest ml-4">
              Восстановить
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


function ManualBookingModal({ db, locale, defaultDate, onClose }: { db: ReturnType<typeof useDatabase>, locale: string, defaultDate: Date, onClose: () => void }) {
  const [date, setDate] = useState<Date>(defaultDate);
  const [time, setTime] = useState<string>('');
  const [serviceSlug, setServiceSlug] = useState(servicesData[0].slug);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  const slots = db.getAvailableSlots(date);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time || !name) return;
    const ok = await db.addBooking({
      serviceSlug, date: format(date, 'yyyy-MM-dd'), time, clientName: name, clientEmail: '', clientPhone: phone, clientNotes: 'Добавлено администратором'
    }, 'confirmed');
    if (ok) onClose();
    else alert('Ошибка: Слот недоступен');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-sm shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row">
        <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50 w-full md:w-1/2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl md:text-2xl font-light">Новая запись</h3>
            <button onClick={onClose} className="md:hidden p-2"><X className="w-5 h-5"/></button>
          </div>
          <div className="overflow-x-auto w-full">
            <DayPicker 
              mode="single" selected={date} onSelect={(d) => { d && setDate(d); setTime(''); }} 
              locale={ru} disabled={[(d: Date) => db.isDayBlockedOrNonWorking(d)]}
              className="bg-white p-4 border border-gray-100 rounded-sm font-sans mx-auto min-w-min"
              modifiersClassNames={{ selected: "!bg-blue-600 !text-white !font-bold rounded-md shadow-md hover:!bg-blue-700", today: "font-semibold text-gray-900 bg-gray-50 rounded-sm" }}
            />
          </div>
          <div className="mt-6">
            <label className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 block">Доступное время</label>
            <div className="grid grid-cols-4 gap-2">
              {slots.length === 0 ? <span className="text-sm text-gray-400 col-span-full">Нет слотов</span> : slots.map(t => (
                <button key={t} type="button" onClick={() => setTime(t)} className={`py-2 text-xs md:text-sm border rounded-sm transition-colors ${time === t ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 hover:border-gray-400'}`}>{t}</button>
              ))}
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 md:p-8 w-full md:w-1/2 flex flex-col gap-6 relative">
          <button type="button" onClick={onClose} className="absolute top-8 right-8 hidden md:block text-gray-400 hover:text-gray-900"><X className="w-6 h-6"/></button>
          
          <div className="flex flex-col gap-2 mt-2 md:mt-0">
            <label className="text-[10px] md:text-xs text-gray-400 uppercase tracking-widest">Процедура</label>
            <select value={serviceSlug} onChange={e => setServiceSlug(e.target.value)} className="border-b border-gray-300 py-2 outline-none focus:border-gray-900 bg-transparent text-sm md:text-base" required>
              {servicesData.map(s => <option key={s.slug} value={s.slug}>{s.title.de}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] md:text-xs text-gray-400 uppercase tracking-widest">Имя клиента</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="border-b border-gray-300 py-2 outline-none focus:border-gray-900 bg-transparent text-sm md:text-base" required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] md:text-xs text-gray-400 uppercase tracking-widest">Телефон</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="border-b border-gray-300 py-2 outline-none focus:border-gray-900 bg-transparent text-sm md:text-base" />
          </div>
          
          <div className="mt-auto pt-8">
            <button type="submit" disabled={!date || !time || !name} className="w-full bg-gray-900 text-white py-3 md:py-4 uppercase tracking-widest text-xs md:text-sm hover:bg-gray-800 disabled:opacity-50 transition-colors">
              Добавить запись
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
