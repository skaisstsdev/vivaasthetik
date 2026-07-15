'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, isWithinInterval, parseISO } from 'date-fns';
import { 
  getSettings, getBookings, 
  updateWorkingHoursAction, addBlockedPeriodAction, removeBlockedPeriodAction,
  updateDateExceptionAction, removeDateExceptionAction,
  addBookingAction, updateBookingStatusAction, rescheduleBookingAction
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
  }, []);

  const addBooking = async (b: Omit<Booking, 'id' | 'status'>, status: BookingStatus = 'pending') => {
    const success = await addBookingAction(b, status);
    if (success) await refreshData();
    return success;
  };

  const updateBookingStatus = async (id: string, status: BookingStatus) => {
    await updateBookingStatusAction(id, status);
    await refreshData();
  };

  const rescheduleBooking = async (id: string, newDate: string, newTime: string) => {
    const success = await rescheduleBookingAction(id, newDate, newTime);
    if (success) await refreshData();
    return success;
  };

  const updateWorkingHours = async (dayOfWeek: number, data: Omit<WorkingDay, 'dayOfWeek'>) => {
    await updateWorkingHoursAction(dayOfWeek, data);
    await refreshData();
  };

  const addBlockedPeriod = async (period: Omit<BlockedPeriod, 'id'>) => {
    await addBlockedPeriodAction(period);
    await refreshData();
  };

  const removeBlockedPeriod = async (id: string) => {
    await removeBlockedPeriodAction(id);
    await refreshData();
  };

  const updateDateException = async (date: string, data: Omit<DateException, 'date'>) => {
    await updateDateExceptionAction(date, data);
    await refreshData();
  };

  const removeDateException = async (date: string) => {
    await removeDateExceptionAction(date);
    await refreshData();
  };

  const isDayBlockedOrNonWorking = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayOfWeek = date.getDay();

    if (blockedPeriods.some(p => isWithinInterval(date, { start: parseISO(p.startDate), end: parseISO(p.endDate) }))) {
      return true;
    }
    const exc = dateExceptions[dateStr];
    if (exc) {
      if (!exc.isWorking) return true;
      return false; // has specific blocked hours, but day is open
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
      addBooking, updateBookingStatus, rescheduleBooking,
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
