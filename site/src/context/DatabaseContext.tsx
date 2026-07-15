'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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

export interface BlockedHours {
  [date: string]: string[]; // date (YYYY-MM-DD) -> array of blocked times (e.g. ['12:00', '13:00'])
}

interface DatabaseContextType {
  // Data
  bookings: Booking[];
  workingHours: WorkingHours;
  blockedDates: string[]; // array of YYYY-MM-DD
  blockedHours: BlockedHours;
  
  // Actions
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => Promise<boolean>;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  updateWorkingHours: (day: number, config: WorkingDay) => void;
  toggleBlockedDate: (date: string) => void;
  toggleBlockedHour: (date: string, time: string) => void;
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

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [workingHours, setWorkingHours] = useState<WorkingHours>(defaultWorkingHours);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [blockedHours, setBlockedHours] = useState<BlockedHours>({});

  // Simulate loading from local storage to persist across reloads during dev
  useEffect(() => {
    const stored = localStorage.getItem('viva_mock_db');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.bookings) setBookings(parsed.bookings);
        if (parsed.workingHours) setWorkingHours(parsed.workingHours);
        if (parsed.blockedDates) setBlockedDates(parsed.blockedDates);
        if (parsed.blockedHours) setBlockedHours(parsed.blockedHours);
      } catch (e) {
        console.error('Failed to load mock DB', e);
      }
    }
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    localStorage.setItem('viva_mock_db', JSON.stringify({
      bookings, workingHours, blockedDates, blockedHours
    }));
  }, [bookings, workingHours, blockedDates, blockedHours]);

  const addBooking = async (data: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if slot is still available (basic collision check)
    const isConflict = bookings.some(b => b.date === data.date && b.time === data.time && b.status !== 'cancelled');
    if (isConflict) return false;

    const newBooking: Booking = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    setBookings(prev => [...prev, newBooking]);
    return true;
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const updateWorkingHours = (day: number, config: WorkingDay) => {
    setWorkingHours(prev => ({ ...prev, [day]: config }));
  };

  const toggleBlockedDate = (date: string) => {
    setBlockedDates(prev => 
      prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
    );
  };

  const toggleBlockedHour = (date: string, time: string) => {
    setBlockedHours(prev => {
      const currentHours = prev[date] || [];
      const newHours = currentHours.includes(time) 
        ? currentHours.filter(t => t !== time)
        : [...currentHours, time];
      
      return {
        ...prev,
        [date]: newHours
      };
    });
  };

  return (
    <DatabaseContext.Provider value={{
      bookings, workingHours, blockedDates, blockedHours,
      addBooking, updateBookingStatus, updateWorkingHours, toggleBlockedDate, toggleBlockedHour
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
