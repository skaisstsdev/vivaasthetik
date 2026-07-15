'use client';

import { useState } from 'react';
import { useDatabase } from '@/context/DatabaseContext';
import { format } from 'date-fns';
import { de, ru } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { Calendar, Clock, LogOut, Check, X, Trash2 } from 'lucide-react';
import { servicesData } from '@/data/services';

export default function AdminClient({ locale }: { locale: string }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Tabs: 'bookings', 'schedule', 'blocks'
  const [activeTab, setActiveTab] = useState<'bookings' | 'schedule' | 'blocks'>('bookings');

  const {
    bookings,
    workingHours,
    blockedDates,
    blockedHours,
    updateBookingStatus,
    updateWorkingHours,
    toggleBlockedDate,
    toggleBlockedHour
  } = useDatabase();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'viva2026') { // Simple hardcoded password
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const daysOfWeek = [
    { id: 1, label: 'Monday' },
    { id: 2, label: 'Tuesday' },
    { id: 3, label: 'Wednesday' },
    { id: 4, label: 'Thursday' },
    { id: 5, label: 'Friday' },
    { id: 6, label: 'Saturday' },
    { id: 0, label: 'Sunday' },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <form onSubmit={handleLogin} className="bg-white p-8 md:p-12 shadow-xl border border-gray-100 rounded-sm w-full max-w-md">
          <h2 className="text-3xl font-light text-center mb-8">Admin Access</h2>
          <div className="flex flex-col gap-2 mb-6">
            <label className="text-xs uppercase tracking-widest text-gray-400 font-mono">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="border-b border-gray-300 py-2 outline-none focus:border-gray-900 transition-colors"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          <button type="submit" className="w-full bg-gray-900 text-white py-4 uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors">
            Login
          </button>
        </form>
      </div>
    );
  }

  // Helper to get service name
  const getServiceName = (slug: string) => {
    const service = servicesData.find(s => s.slug === slug);
    return service ? service.title[locale as 'de'|'ru'] : slug;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Admin Header */}
      <div className="bg-gray-900 text-white pt-24 pb-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-light tracking-wide mb-2">Admin Dashboard</h1>
            <p className="text-gray-400 font-mono text-sm uppercase tracking-widest">Manage bookings & schedule</p>
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex gap-8 overflow-x-auto">
          {[
            { id: 'bookings', label: 'Bookings' },
            { id: 'schedule', label: 'Working Hours' },
            { id: 'blocks', label: 'Time Off / Blocks' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 text-sm font-mono uppercase tracking-widest border-b-2 whitespace-nowrap transition-colors ${
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

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* TAB: BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-light mb-4">Upcoming Appointments</h2>
            
            {bookings.length === 0 ? (
              <div className="p-12 text-center bg-white border border-gray-100 rounded-sm text-gray-500">
                No bookings yet.
              </div>
            ) : (
              <div className="grid gap-4">
                {[...bookings].sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()).map(booking => (
                  <div key={booking.id} className="bg-white border border-gray-100 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                    
                    <div className="flex flex-col gap-1 md:w-1/3">
                      <span className="font-medium text-lg">{booking.clientName}</span>
                      <span className="text-gray-500 text-sm">{booking.clientPhone} • {booking.clientEmail}</span>
                      <span className="text-gray-900 text-sm mt-2">{getServiceName(booking.serviceSlug)}</span>
                      {booking.clientNotes && (
                        <span className="text-gray-400 text-xs italic mt-1">Note: {booking.clientNotes}</span>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-1 md:w-1/3">
                      <div className="flex items-center gap-2 text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{format(new Date(booking.date), 'EEEE, d. MMMM yyyy', { locale: locale === 'de' ? de : ru })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-900">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-lg">{booking.time}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 md:w-1/3 md:justify-end">
                      {booking.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                            className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                            title="Confirm Booking"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                            className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                            title="Cancel Booking"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs uppercase tracking-widest font-mono rounded-sm">Confirmed</span>
                      )}
                      {booking.status === 'cancelled' && (
                        <span className="px-3 py-1 bg-red-100 text-red-800 text-xs uppercase tracking-widest font-mono rounded-sm">Cancelled</span>
                      )}
                      {booking.status !== 'pending' && (
                        <button 
                          onClick={() => updateBookingStatus(booking.id, 'pending')}
                          className="ml-2 text-xs text-gray-400 hover:text-gray-600 underline"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: SCHEDULE */}
        {activeTab === 'schedule' && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-300">
            <div>
              <h2 className="text-2xl font-light mb-2">Standard Working Hours</h2>
              <p className="text-gray-500 mb-8">Set your default weekly schedule. The calendar will automatically generate 1-hour slots between the Start and End times.</p>
            </div>
            
            <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
              {daysOfWeek.map((day, index) => {
                const config = workingHours[day.id];
                return (
                  <div key={day.id} className={`flex flex-col md:flex-row md:items-center justify-between p-6 ${index !== daysOfWeek.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <div className="flex items-center gap-4 md:w-1/3 mb-4 md:mb-0">
                      <div 
                        className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${config?.isWorking ? 'bg-gray-900' : 'bg-gray-300'}`}
                        onClick={() => updateWorkingHours(day.id, { ...config, isWorking: !config?.isWorking })}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${config?.isWorking ? 'translate-x-6' : 'translate-x-0'}`} />
                      </div>
                      <span className={`font-medium ${config?.isWorking ? 'text-gray-900' : 'text-gray-400'}`}>{day.label}</span>
                    </div>
                    
                    <div className={`flex items-center gap-4 transition-opacity ${config?.isWorking ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400 uppercase tracking-widest">Start Time</label>
                        <select 
                          value={config?.startTime || '10:00'}
                          onChange={e => updateWorkingHours(day.id, { ...config, startTime: e.target.value })}
                          className="border border-gray-200 p-2 outline-none focus:border-gray-900 bg-transparent"
                        >
                          {Array.from({length: 13}).map((_, i) => {
                            const time = `${(i + 8).toString().padStart(2, '0')}:00`;
                            return <option key={time} value={time}>{time}</option>;
                          })}
                        </select>
                      </div>
                      <span className="text-gray-300 mt-4">—</span>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400 uppercase tracking-widest">End Time</label>
                        <select 
                          value={config?.endTime || '17:00'}
                          onChange={e => updateWorkingHours(day.id, { ...config, endTime: e.target.value })}
                          className="border border-gray-200 p-2 outline-none focus:border-gray-900 bg-transparent"
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
        )}

        {/* TAB: BLOCKS */}
        {activeTab === 'blocks' && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-300">
            <div>
              <h2 className="text-2xl font-light mb-2">Time Off & Blocked Dates</h2>
              <p className="text-gray-500 mb-8">Select dates on the calendar to completely block them, or select specific hours to block on a working day.</p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="bg-white p-6 border border-gray-100 rounded-sm flex-shrink-0 mx-auto lg:mx-0 shadow-sm">
                <DayPicker 
                  mode="multiple"
                  selected={blockedDates.map(d => new Date(d))}
                  onSelect={(dates) => {
                    // Custom logic handled by onDayClick
                  }}
                  onDayClick={(day) => {
                    const dayStr = format(day, 'yyyy-MM-dd');
                    toggleBlockedDate(dayStr);
                  }}
                  locale={locale === 'de' ? de : ru}
                  disabled={[{ before: new Date() }]}
                  className="font-sans"
                  modifiersClassNames={{
                    selected: "bg-red-50 text-red-600 font-medium hover:bg-red-100 rounded-sm border border-red-200",
                    today: "font-semibold text-gray-900 bg-gray-50 rounded-sm",
                  }}
                />
                <p className="text-xs text-gray-400 text-center mt-6">Click a date to block/unblock the entire day</p>
              </div>

              <div className="flex-1 bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                  <h3 className="font-medium text-gray-900">Block Specific Hours</h3>
                  <p className="text-sm text-gray-500 mt-1">If you need to close only 1-2 hours on a working day.</p>
                </div>
                
                <div className="p-6 grid gap-6">
                  {/* For demo, we just show today and tomorrow, or let them select a day. Since we have the state, let's just render a simple day selector for specific hours */}
                  <BlockHoursTool />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-component for blocking specific hours
function BlockHoursTool() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { workingHours, blockedDates, blockedHours, toggleBlockedHour } = useDatabase();

  if (!selectedDate) return null;

  const dayStr = format(selectedDate, 'yyyy-MM-dd');
  const dayOfWeek = selectedDate.getDay();
  const config = workingHours[dayOfWeek];
  const isFullyBlocked = blockedDates.includes(dayStr);
  const currentBlockedHours = blockedHours[dayStr] || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase tracking-widest text-gray-400">Select Date to Edit Hours</label>
        <input 
          type="date" 
          value={format(selectedDate, 'yyyy-MM-dd')}
          onChange={e => {
            if (e.target.value) setSelectedDate(new Date(e.target.value));
          }}
          className="border border-gray-200 p-3 outline-none focus:border-gray-900 w-full md:w-64"
        />
      </div>

      {isFullyBlocked ? (
        <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-sm">
          This entire day is blocked. Unblock it in the calendar first to manage specific hours.
        </div>
      ) : !config?.isWorking ? (
        <div className="p-4 bg-gray-50 text-gray-500 border border-gray-100 rounded-sm">
          This is a non-working day according to your standard schedule.
        </div>
      ) : (
        <div className="flex flex-col gap-4 border-t border-gray-100 pt-6">
          <h4 className="font-medium text-gray-900">Select hours to block on {format(selectedDate, 'MMM d, yyyy')}:</h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {Array.from({length: 13}).map((_, i) => {
              const time = `${(i + 8).toString().padStart(2, '0')}:00`;
              // Only show times within working hours
              const startH = parseInt(config.startTime.split(':')[0]);
              const endH = parseInt(config.endTime.split(':')[0]);
              const currentH = parseInt(time.split(':')[0]);
              
              if (currentH < startH || currentH >= endH) return null;

              const isBlocked = currentBlockedHours.includes(time);

              return (
                <button
                  key={time}
                  onClick={() => toggleBlockedHour(dayStr, time)}
                  className={`py-3 px-2 border rounded-sm text-sm transition-colors ${
                    isBlocked 
                      ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100 line-through' 
                      : 'bg-white border-gray-200 text-gray-900 hover:border-gray-900'
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
          {currentBlockedHours.length > 0 && (
            <p className="text-xs text-red-500 mt-2">Highlighted hours will not be available for booking.</p>
          )}
        </div>
      )}
    </div>
  );
}
