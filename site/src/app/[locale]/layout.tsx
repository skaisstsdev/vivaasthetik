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

import CookieBanner from '@/components/layout/CookieBanner';
import ChatWidget from '@/components/chat/ChatWidget';
import StickyActionBar from '@/components/layout/StickyActionBar';
import JsonLd from '@/components/seo/JsonLd';
import Analytics from '@/components/analytics/Analytics';
import { SITE_URL, OG_IMAGE, type Loc } from '@/lib/seo';
import { siteGraph } from '@/lib/schema';
// Шрифты лежат в проекте (пакеты @fontsource), с Google при сборке и на сайте не загружаются.
// Cormorant: 300 (все заголовки) и 500 (заголовки с font-medium). Inter: основной текст.
import '@fontsource/cormorant/300.css';
import '@fontsource/cormorant/500.css';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@/app/globals.css';

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
    <html lang={locale}>
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
              <ChatWidget />
              <CookieBanner />
              <Analytics />
            </BookingProvider>
          </DatabaseProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
