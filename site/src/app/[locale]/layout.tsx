import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale, getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {BookingProvider} from '@/context/BookingContext';
import {DatabaseProvider} from '@/context/DatabaseContext';
import BookingModal from '@/components/booking/BookingModal';
import { Suspense } from 'react';
import InfoModal from '@/components/home/InfoModal';
import { Metadata } from 'next';
import { Cormorant, Inter } from 'next/font/google';

import CookieBanner from '@/components/layout/CookieBanner';
import '@/app/globals.css';

const cormorant = Cormorant({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-bodoni',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      languages: {
        de: '/de',
        ru: '/ru',
      },
    },
  };
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
    <html lang={locale} className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <DatabaseProvider>
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
          </DatabaseProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
