'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, isWithinInterval, parseISO } from 'date-fns';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Booking {
  id: string;
  serviceSlug: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientNotes: string;
  status: BookingStatus;
  createdAt: string;
}

export interface WorkingDay {
  isWorking: boolean;
  startTime: string; // HH:MM
  endTime: string; // HH:MM
}

export type WorkingHours = Record<number, WorkingDay>; // 0 = Sunday, 1 = Monday...

export interface BlockedPeriod {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

export interface DateException {
  isWorking?: boolean; // If set, overrides the standard day's isWorking
  startTime?: string;  // If set, overrides standard startTime
  endTime?: string;    // If set, overrides standard endTime
  blockedHours?: string[]; // specific hours blocked on this date (e.g. ['13:00', '14:00'])
}

export type DateExceptions = Record<string, DateException>; // YYYY-MM-DD -> exception config

interface DatabaseContextType {
  // Data
  bookings: Booking[];
  workingHours: WorkingHours;
  blockedPeriods: BlockedPeriod[];
  dateExceptions: DateExceptions;
  
  // Helpers
  getAvailableSlots: (date: Date) => string[];
  isDayBlockedOrNonWorking: (date: Date) => boolean;
  
  // Actions
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>, forceStatus?: BookingStatus) => Promise<boolean>;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  rescheduleBooking: (id: string, date: string, time: string) => Promise<boolean>;
  updateWorkingHours: (day: number, config: WorkingDay) => void;
  addBlockedPeriod: (period: Omit<BlockedPeriod, 'id'>) => void;
  removeBlockedPeriod: (id: string) => void;
  updateDateException: (date: string, exception: DateException) => void;
  removeDateException: (date: string) => void;
}

const defaultWorkingHours: WorkingHours = {
  0: { isWorking: false, startTime: '10:00', endTime: '17:00' }, // Sun
  1: { isWorking: false, startTime: '10:00', endTime: '17:00' }, // Mon
  2: { isWorking: false, startTime: '10:00', endTime: '17:00' }, // Tue
  3: { isWorking: true,  startTime: '10:00', endTime: '17:00' }, // Wed
  4: { isWorking: false, startTime: '10:00', endTime: '17:00' }, // Thu
  5: { isWorking: true,  startTime: '10:00', endTime: '17:00' }, // Fri
  6: { isWorking: false, startTime: '10:00', endTime: '17:00' }, // Sat
};

// Fake bookings for demonstration
const mockBookings: Booking[] = [
  {
    id: 'b1',
    serviceSlug: 'botulinumtoxin',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '11:00',
    clientName: 'Анна Иванова',
    clientEmail: 'anna@example.com',
    clientPhone: '+49 152 12345678',
    clientNotes: 'Первый раз',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  },
  {
    id: 'b2',
    serviceSlug: 'mesotherapie',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '14:00',
    clientName: 'Мария Смирнова',
    clientEmail: 'maria@example.com',
    clientPhone: '+49 176 87654321',
    clientNotes: '',
    status: 'pending',
    createdAt: new Date().toISOString()
  }
];

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [workingHours, setWorkingHours] = useState<WorkingHours>(defaultWorkingHours);
  const [blockedPeriods, setBlockedPeriods] = useState<BlockedPeriod[]>([]);
  const [dateExceptions, setDateExceptions] = useState<DateExceptions>({});

  // Simulate loading from local storage
  useEffect(() => {
    const stored = localStorage.getItem('viva_mock_db_v2');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.bookings) setBookings(parsed.bookings);
        if (parsed.workingHours) setWorkingHours(parsed.workingHours);
        if (parsed.blockedPeriods) setBlockedPeriods(parsed.blockedPeriods);
        if (parsed.dateExceptions) setDateExceptions(parsed.dateExceptions);
      } catch (e) {
        console.error('Failed to load mock DB', e);
      }
    }
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    localStorage.setItem('viva_mock_db_v2', JSON.stringify({
      bookings, workingHours, blockedPeriods, dateExceptions
    }));
  }, [bookings, workingHours, blockedPeriods, dateExceptions]);


  // Logic: Check if a specific date is closed (either by vacation or day-level override)
  const isDayBlockedOrNonWorking = (date: Date) => {
    const dayStr = format(date, 'yyyy-MM-dd');
    
    // 1. Check vacations (blocked periods)
    const isVacation = blockedPeriods.some(p => 
      isWithinInterval(date, { start: parseISO(p.startDate), end: parseISO(p.endDate) })
    );
    if (isVacation) return true;

    // 2. Check specific day exceptions
    const exception = dateExceptions[dayStr];
    if (exception && exception.isWorking !== undefined) {
      return !exception.isWorking;
    }

    // 3. Fallback to default schedule
    const dayOfWeek = date.getDay();
    const config = workingHours[dayOfWeek];
    if (!config || !config.isWorking) return true;

    return false;
  };

  // Logic: Generate 1-hour slots for a specific date
  const getAvailableSlots = (date: Date) => {
    if (isDayBlockedOrNonWorking(date)) return [];

    const dayStr = format(date, 'yyyy-MM-dd');
    const dayOfWeek = date.getDay();
    const defaultConfig = workingHours[dayOfWeek];
    const exception = dateExceptions[dayStr];

    // Determine start and end times
    const startStr = exception?.startTime || defaultConfig.startTime;
    const endStr = exception?.endTime || defaultConfig.endTime;

    let [startH] = startStr.split(':').map(Number);
    let [endH] = endStr.split(':').map(Number);

    const slots: string[] = [];
    const dayBookings = bookings.filter(b => b.date === dayStr && b.status !== 'cancelled');
    const specificBlockedHours = exception?.blockedHours || [];

    for (let h = startH; h < endH; h++) {
      const timeStr = `${h.toString().padStart(2, '0')}:00`;
      
      if (specificBlockedHours.includes(timeStr)) continue; // Blocked manually by admin
      if (dayBookings.some(b => b.time === timeStr)) continue; // Already booked
      
      slots.push(timeStr);
    }

    return slots;
  };

  const addBooking = async (data: Omit<Booking, 'id' | 'createdAt' | 'status'>, forceStatus: BookingStatus = 'pending') => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const isConflict = bookings.some(b => b.date === data.date && b.time === data.time && b.status !== 'cancelled');
    if (isConflict) return false;

    const newBooking: Booking = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: forceStatus
    };
    
    setBookings(prev => [...prev, newBooking]);
    return true;
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const rescheduleBooking = async (id: string, newDate: string, newTime: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Check conflict (excluding current booking)
    const isConflict = bookings.some(b => b.id !== id && b.date === newDate && b.time === newTime && b.status !== 'cancelled');
    if (isConflict) return false;

    setBookings(prev => prev.map(b => b.id === id ? { ...b, date: newDate, time: newTime } : b));
    return true;
  };

  const updateWorkingHours = (day: number, config: WorkingDay) => {
    setWorkingHours(prev => ({ ...prev, [day]: config }));
  };

  const addBlockedPeriod = (period: Omit<BlockedPeriod, 'id'>) => {
    setBlockedPeriods(prev => [...prev, { ...period, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const removeBlockedPeriod = (id: string) => {
    setBlockedPeriods(prev => prev.filter(p => p.id !== id));
  };

  const updateDateException = (date: string, exception: DateException) => {
    setDateExceptions(prev => ({
      ...prev,
      [date]: { ...(prev[date] || {}), ...exception }
    }));
  };

  const removeDateException = (date: string) => {
    setDateExceptions(prev => {
      const copy = { ...prev };
      delete copy[date];
      return copy;
    });
  };

  return (
    <DatabaseContext.Provider value={{
      bookings, workingHours, blockedPeriods, dateExceptions,
      getAvailableSlots, isDayBlockedOrNonWorking,
      addBooking, updateBookingStatus, rescheduleBooking,
      updateWorkingHours, addBlockedPeriod, removeBlockedPeriod,
      updateDateException, removeDateException
    }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}
