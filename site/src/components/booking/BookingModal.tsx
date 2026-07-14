'use client';

import { useBooking } from '@/context/BookingContext';
import BookingWizard from './BookingWizard';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function BookingModal() {
  const { isOpen, closeBooking } = useBooking();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 animate-in fade-in duration-300">
      
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={closeBooking}
      />

      {/* Modal Content container */}
      <div className="relative bg-white w-full max-w-6xl max-h-full overflow-y-auto shadow-2xl rounded-sm flex flex-col animate-in zoom-in-95 duration-500 ease-out">
        
        {/* Header with close button */}
        <div className="sticky top-0 right-0 z-10 flex justify-end p-4 pointer-events-none">
          <button 
            onClick={closeBooking}
            className="p-3 bg-white/80 backdrop-blur-md hover:bg-gray-100 text-gray-900 transition-colors rounded-full pointer-events-auto border border-gray-200 shadow-sm"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* The Wizard */}
        <div className="px-6 pb-12 sm:px-12 md:px-20 md:pb-20 -mt-10">
          <BookingWizard inModal={true} />
        </div>
        
      </div>
    </div>
  );
}
