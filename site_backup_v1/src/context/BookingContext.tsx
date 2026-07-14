'use client';

import React, { createContext, useContext, useState } from 'react';

interface BookingContextType {
  isOpen: boolean;
  preselectedServiceSlug: string | null;
  openBooking: (serviceSlug?: string) => void;
  closeBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [preselectedServiceSlug, setPreselectedServiceSlug] = useState<string | null>(null);

  const openBooking = (serviceSlug?: string) => {
    if (serviceSlug) {
      setPreselectedServiceSlug(serviceSlug);
    } else {
      setPreselectedServiceSlug(null);
    }
    setIsOpen(true);
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
  };

  const closeBooking = () => {
    setIsOpen(false);
    setPreselectedServiceSlug(null);
    // Restore background scrolling
    document.body.style.overflow = 'auto';
  };

  return (
    <BookingContext.Provider value={{ isOpen, preselectedServiceSlug, openBooking, closeBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
