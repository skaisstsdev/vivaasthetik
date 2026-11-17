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
import StickyActionBar from '@/components/layout/StickyActionBar';
import JsonLd from '@/components/seo/JsonLd';
import Analytics from '@/components/analytics/Analytics';
import { SITE_URL, OG_IMAGE, type Loc } from '@/lib/seo';
import { siteGraph } from '@/lib/schema';
import '@/app/globals.css';

const cormorant = Cormorant({
  subsets: ['latin', 'cyrillic'],
  // 300 — все заголовки, 500 — заголовки с font-medium. 400 и курсив не используются.
  weight: ['300', '500'],
  style: ['normal'],
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
    title: {
      template: '%s | VIVA Ästhetik',
      default: t('title'),
    },
    description: t('description'),
    metadataBase: new URL(SITE_URL),
    applicationName: 'VIVA Ästhetik',
    // Заголовок, описание, canonical и hreflang задаёт каждая страница (lib/seo.ts)
    openGraph: {
      siteName: 'VIVA Ästhetik',
      locale: locale === 'de' ? 'de_DE' : 'ru_RU',
      type: 'website',
      images: [{ url: OG_IMAGE.url, width: OG_IMAGE.width, height: OG_IMAGE.height, alt: 'VIVA Ästhetik Kassel' }],
    },
    twitter: { card: 'summary_large_image', images: [OG_IMAGE.url] },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    // Подтверждение сайта в Google Search Console / Bing Webmaster — включается переменными окружения
    verification: {
      ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } : {}),
      ...(process.env.NEXT_PUBLIC_BING_VERIFICATION ? { other: { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION } } : {}),
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
        <JsonLd data={siteGraph(locale as Loc)} />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <DatabaseProvider>
            <BookingProvider>
              <Navbar />
              {children}
              <Footer />
              <StickyActionBar />
              <Suspense fallback={null}>
                <BookingModal />
              </Suspense>
              <Suspense fallback={null}>
                <InfoModal />
              </Suspense>
              <CookieBanner />
              <Analytics />
            </BookingProvider>
          </DatabaseProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
