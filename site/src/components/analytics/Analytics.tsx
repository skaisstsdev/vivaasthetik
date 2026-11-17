'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { CONSENT_EVENT, CONSENT_KEY, track } from '@/lib/analytics';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

// Google Analytics 4. Включается только если задан NEXT_PUBLIC_GA_ID И посетитель нажал
// «Принять» в cookie-баннере. Без согласия скрипт Google вообще не загружается.
// В админке не работает. Считает звонки, WhatsApp, e-mail и переходы на запись.
export default function Analytics() {
  const pathname = usePathname();
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    const read = () => {
      try {
        setConsent(localStorage.getItem(CONSENT_KEY) === 'accepted');
      } catch {
        setConsent(false);
      }
    };
    read();
    window.addEventListener(CONSENT_EVENT, read);
    window.addEventListener('storage', read);
    return () => {
      window.removeEventListener(CONSENT_EVENT, read);
      window.removeEventListener('storage', read);
    };
  }, []);

  const active = Boolean(GA_ID) && consent && !pathname?.includes('/admin');

  // Клики по телефону, WhatsApp, e-mail и ссылкам на запись
  useEffect(() => {
    if (!active) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest('a');
      const href = a?.getAttribute('href') || '';
      if (href.startsWith('tel:')) track('phone_click', { link_url: href });
      else if (href.includes('wa.me')) track('whatsapp_click', { link_url: href });
      else if (href.startsWith('mailto:')) track('email_click', { link_url: href });
      else if (/\/booking\/?$/.test(href)) track('booking_link_click');
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [active]);

  if (!active) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}',{allow_google_signals:false,allow_ad_personalization_signals:false});`}
      </Script>
    </>
  );
}
