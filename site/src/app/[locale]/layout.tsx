import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {BookingProvider} from '@/context/BookingContext';
import BookingModal from '@/components/booking/BookingModal';
import { Suspense } from 'react';
import InfoModal from '@/components/home/InfoModal';

import CookieBanner from '@/components/layout/CookieBanner';
import '@/app/globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <BookingProvider>
            <Navbar />
            {children}
            <Footer />
            <Suspense fallback={null}>
              <BookingModal />
            </Suspense>
            <Suspense fallback={null}>
              <InfoModal />
            </Suspense>
            <CookieBanner />
          </BookingProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
