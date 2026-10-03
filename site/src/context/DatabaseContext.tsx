'use client';

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { format } from 'date-fns';
import { getPublicAvailability, createBooking, CreateBookingInput, CreateBookingResult } from '@/app/actions/public';
import {
  OverrideMap, WeekTemplate, defaultTemplate, normalizeTemplate, resolveDay, getSlots, hourOf,
} from '@/lib/availability';

// Public booking availability. Contains no client personal data — only which
// slots are taken. Loaded lazily when the booking wizard mounts, so regular
// page views don't hit the database.

interface DatabaseContextType {
  isLoading: boolean;
  load: () => Promise<void>;
  addBooking: (booking: CreateBookingInput) => Promise<CreateBookingResult>;
  isDayBlockedOrNonWorking: (date: Date) => boolean;
  getAvailableSlots: (date: Date) => string[];
}

const DatabaseContext = createContext<DatabaseContextType | null>(null);

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [template, setTemplate] = useState<WeekTemplate>(defaultTemplate);
  const [overrides, setOverrides] = useState<OverrideMap>({});
  const [taken, setTaken] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const inFlight = useRef<Promise<void> | null>(null);

  const load = useCallback(() => {
    if (inFlight.current) return inFlight.current;
    const p = getPublicAvailability()
      .then(a => {
        setTemplate(normalizeTemplate(a.template));
        const ov: OverrideMap = {};
        a.overrides.forEach(o => { ov[o.date] = o; });
        setOverrides(ov);
        const tk: Record<string, string[]> = {};
        a.taken.forEach(t => { (tk[t.date] ||= []).push(t.time); });
        setTaken(tk);
      })
      .catch(e => console.error('Error fetching availability', e))
      .finally(() => {
        setIsLoading(false);
        inFlight.current = null;
      });
    inFlight.current = p;
    return p;
  }, []);

  const addBooking = useCallback(async (booking: CreateBookingInput) => {
    const result = await createBooking(booking);
    load();
    return result;
  }, [load]);

  const value = useMemo<DatabaseContextType>(() => {
    const day = (date: Date) => resolveDay(format(date, 'yyyy-MM-dd'), template, overrides);
    return {
      isLoading,
      load,
      addBooking,
      isDayBlockedOrNonWorking: (date: Date) => getSlots(day(date), []).length === 0,
      getAvailableSlots: (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const slots = getSlots(day(date), taken[dateStr] || []);
        // Hide hours that have already passed today
        if (dateStr !== format(new Date(), 'yyyy-MM-dd')) return slots;
        const nowHour = new Date().getHours();
        return slots.filter(s => hourOf(s) > nowHour);
      },
    };
  }, [template, overrides, taken, isLoading, load, addBooking]);

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) throw new Error('useDatabase must be used within DatabaseProvider');
  return context;
}
