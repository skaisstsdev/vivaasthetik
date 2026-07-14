'use client';

import { useBooking } from '@/context/BookingContext';
import { useTranslations } from 'next-intl';

interface BookNowButtonProps {
  serviceSlug?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function BookNowButton({ serviceSlug, className, children }: BookNowButtonProps) {
  const { openBooking } = useBooking();
  const t = useTranslations('Navigation'); // Or another appropriate dictionary

  return (
    <button
      onClick={() => openBooking(serviceSlug)}
      className={className || "px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 transition-colors uppercase tracking-widest text-sm font-medium"}
    >
      {children || t('bookCta')}
    </button>
  );
}
