'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { format, isWithinInterval, parseISO } from 'date-fns';
import { 
  getSettings, getBookings, 
  updateWorkingHoursAction, addBlockedPeriodAction, removeBlockedPeriodAction,
  updateDateExceptionAction, removeDateExceptionAction,
  addBookingAction, updateBookingStatusAction, rescheduleBookingAction, deleteBookingAction
} from '@/app/actions/database';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Booking {
  id: string;
  serviceSlug: string;
  date: string;
  time: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientNotes?: string;
  status: BookingStatus;
}

export interface WorkingDay {
  dayOfWeek: number;
  isWorking: boolean;
  startTime: string;
  endTime: string;
}

export interface BlockedPeriod {
  id: string;
  startDate: string;
  endDate: string;
}

export interface DateException {
  date: string;
  isWorking: boolean;
  blockedHours: string[];
}

interface DatabaseContextType {
  bookings: Booking[];
  workingHours: Record<number, WorkingDay>;
  blockedPeriods: BlockedPeriod[];
  dateExceptions: Record<string, DateException>;
  
  isLoading: boolean;
  
  addBooking: (booking: Omit<Booking, 'id' | 'status'>, status?: BookingStatus) => Promise<boolean>;
  updateBookingStatus: (id: string, status: BookingStatus) => Promise<void>;
  rescheduleBooking: (id: string, newDate: string, newTime: string) => Promise<boolean>;
  deleteBooking: (id: string) => Promise<void>;
  
  updateWorkingHours: (dayOfWeek: number, data: Omit<WorkingDay, 'dayOfWeek'>) => Promise<void>;
  addBlockedPeriod: (period: Omit<BlockedPeriod, 'id'>) => Promise<void>;
  removeBlockedPeriod: (id: string) => Promise<void>;
  updateDateException: (date: string, exception: Omit<DateException, 'date'>) => Promise<void>;
  removeDateException: (date: string) => Promise<void>;

  isDayBlockedOrNonWorking: (date: Date) => boolean;
  getAvailableSlots: (date: Date) => string[];
}

const DatabaseContext = createContext<DatabaseContextType | null>(null);

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [workingHours, setWorkingHours] = useState<Record<number, WorkingDay>>({});
  const [blockedPeriods, setBlockedPeriods] = useState<BlockedPeriod[]>([]);
  const [dateExceptions, setDateExceptions] = useState<Record<string, DateException>>({});
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const isAdmin = pathname?.includes('/admin');

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [b, s] = await Promise.all([getBookings(), getSettings()]);
      
      setBookings(b as Booking[]);
      
      const wh: Record<number, WorkingDay> = {};
      s.workingDays.forEach(d => { wh[d.dayOfWeek] = d; });
      // Fallback for empty DB
      if (Object.keys(wh).length === 0) {
        [1,2,3,4,5].forEach(d => { wh[d] = { dayOfWeek: d, isWorking: true, startTime: '10:00', endTime: '17:00' }; });
        [0,6].forEach(d => { wh[d] = { dayOfWeek: d, isWorking: false, startTime: '10:00', endTime: '17:00' }; });
      }
      setWorkingHours(wh);
      
      setBlockedPeriods(s.blockedPeriods);
      
      const de: Record<string, DateException> = {};
      s.dateExceptions.forEach(e => { de[e.date] = e; });
      setDateExceptions(de);
    } catch (e) {
      console.error("Error fetching data", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    
    // Only poll on admin pages — regular visitors don't need real-time sync
    if (!isAdmin) return;

    const interval = setInterval(() => {
      // Background refresh without triggering the loading spinner
      Promise.all([getBookings(), getSettings()]).then(([b, s]) => {
        setBookings(b as Booking[]);
        const wh: Record<number, WorkingDay> = {};
        s.workingDays.forEach(d => { wh[d.dayOfWeek] = d; });
        if (Object.keys(wh).length === 0) {
          [1,2,3,4,5].forEach(d => { wh[d] = { dayOfWeek: d, isWorking: true, startTime: '10:00', endTime: '17:00' }; });
          [0,6].forEach(d => { wh[d] = { dayOfWeek: d, isWorking: false, startTime: '10:00', endTime: '17:00' }; });
        }
        setWorkingHours(wh);
        setBlockedPeriods(s.blockedPeriods);
        const de: Record<string, DateException> = {};
        s.dateExceptions.forEach(e => { de[e.date] = e; });
        setDateExceptions(de);
      }).catch(e => console.error("Error in background sync", e));
    }, 5000);

    return () => clearInterval(interval);
  }, [isAdmin]);

  const addBooking = async (b: Omit<Booking, 'id' | 'status'>, status: BookingStatus = 'pending') => {
    const success = await addBookingAction(b, status);
    if (success) refreshData();
    return success;
  };

  const updateBookingStatus = async (id: string, status: BookingStatus) => {
    setBookings(prev => prev.map(booking => booking.id === id ? { ...booking, status } : booking));
    await updateBookingStatusAction(id, status);
    refreshData();
  };

  const rescheduleBooking = async (id: string, newDate: string, newTime: string) => {
    setBookings(prev => prev.map(booking => booking.id === id ? { ...booking, date: newDate, time: newTime } : booking));
    const success = await rescheduleBookingAction(id, newDate, newTime);
    if (success) refreshData();
    return success;
  };

  const deleteBooking = async (id: string) => {
    setBookings(prev => prev.filter(booking => booking.id !== id));
    await deleteBookingAction(id);
    refreshData();
  };

  const updateWorkingHours = async (dayOfWeek: number, data: Omit<WorkingDay, 'dayOfWeek'>) => {
    setWorkingHours(prev => ({ ...prev, [dayOfWeek]: { dayOfWeek, ...data } }));
    await updateWorkingHoursAction(dayOfWeek, data);
    refreshData();
  };

  const addBlockedPeriod = async (period: Omit<BlockedPeriod, 'id'>) => {
    setBlockedPeriods(prev => [...prev, { id: 'temp-' + Date.now(), ...period }]);
    await addBlockedPeriodAction(period);
    refreshData();
  };

  const removeBlockedPeriod = async (id: string) => {
    setBlockedPeriods(prev => prev.filter(p => p.id !== id));
    await removeBlockedPeriodAction(id);
    refreshData();
  };

  const updateDateException = async (date: string, data: Omit<DateException, 'date'>) => {
    setDateExceptions(prev => ({ ...prev, [date]: { date, ...data } }));
    await updateDateExceptionAction(date, data);
    refreshData();
  };

  const removeDateException = async (date: string) => {
    setDateExceptions(prev => {
      const copy = { ...prev };
      delete copy[date];
      return copy;
    });
    await removeDateExceptionAction(date);
    refreshData();
  };

  const isDayBlockedOrNonWorking = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayOfWeek = date.getDay();

    const exc = dateExceptions[dateStr];
    if (exc) {
      if (!exc.isWorking) return true;
      return false; // has specific blocked hours, but day is open
    }

    if (blockedPeriods.some(p => isWithinInterval(date, { start: parseISO(p.startDate), end: parseISO(p.endDate) }))) {
      return true;
    }
    const wh = workingHours[dayOfWeek];
    if (!wh || !wh.isWorking) return true;
    return false;
  };

  const getAvailableSlots = (date: Date) => {
    if (isDayBlockedOrNonWorking(date)) return [];
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayOfWeek = date.getDay();
    const exc = dateExceptions[dateStr];
    const wh = workingHours[dayOfWeek];
    
    const startHour = parseInt(wh?.startTime.split(':')[0] || '10');
    const endHour = parseInt(wh?.endTime.split(':')[0] || '17');
    
    const allSlots = [];
    for (let i = startHour; i < endHour; i++) {
      allSlots.push(`${i.toString().padStart(2, '0')}:00`);
    }

    const takenTimes = bookings
      .filter(b => b.date === dateStr && b.status !== 'cancelled')
      .map(b => b.time);

    let finalSlots = allSlots.filter(s => !takenTimes.includes(s));
    
    if (exc && exc.blockedHours) {
      finalSlots = finalSlots.filter(s => !exc.blockedHours.includes(s));
    }
    
    return finalSlots;
  };

  return (
    <DatabaseContext.Provider value={{
      bookings, workingHours, blockedPeriods, dateExceptions, isLoading,
      addBooking, updateBookingStatus, rescheduleBooking, deleteBooking,
      updateWorkingHours, addBlockedPeriod, removeBlockedPeriod,
      updateDateException, removeDateException,
      isDayBlockedOrNonWorking, getAvailableSlots
    }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) throw new Error('useDatabase must be used within DatabaseProvider');
  return context;
}
