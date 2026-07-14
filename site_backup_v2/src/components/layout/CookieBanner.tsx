"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations('Cookies');

  useEffect(() => {
    // Check if user has already accepted/declined cookies
    const cookieConsent = localStorage.getItem('cookie_consent');
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white z-50 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
      <div className="max-w-3xl">
        <p className="text-sm text-gray-300 leading-relaxed">
          {t('text')}
        </p>
      </div>
      <div className="flex gap-4 flex-shrink-0 w-full md:w-auto">
        <button 
          onClick={handleDecline}
          className="flex-1 md:flex-none px-6 py-3 border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors text-sm font-medium tracking-wide"
        >
          {t('decline')}
        </button>
        <button 
          onClick={handleAccept}
          className="flex-1 md:flex-none px-6 py-3 bg-white text-gray-900 hover:bg-gray-100 transition-colors text-sm font-medium tracking-wide"
        >
          {t('accept')}
        </button>
      </div>
    </div>
  );
}
