import type { Metadata } from 'next';

// Единый адрес сайта. Живой сайт открывается с www, поэтому canonical, sitemap и разметка
// везде используют его. Переопределяется переменной NEXT_PUBLIC_SITE_URL.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vivaasthetik.de').replace(/\/$/, '');

// Дата последнего заметного обновления контента (для sitemap). Меняйте при крупных правках.
export const LAST_UPDATED = '2026-11-17';

export type Loc = 'de' | 'ru';

// Данные практики: адрес, телефон, часы совпадают с профилем Google и страницей «Kontakt».
export const PRACTICE = {
  name: 'VIVA Ästhetik Kassel',
  fullName: 'VIVA Ästhetik Kassel | Ästhetische Medizin & Mesotherapie',
  doctor: 'Natalya Schnal',
  phone: '+49 179 9004902',
  email: 'vivaasthetik@gmail.com',
  street: 'Königstor 47',
  zip: '34117',
  city: 'Kassel',
  region: 'Hessen',
  country: 'DE',
  lat: 51.31325,
  lng: 9.47994,
  instagram: 'https://www.instagram.com/viva_asthetik',
  whatsapp: 'https://wa.me/491799004902',
  // Карточка в Google Картах (по CID) и ссылка «оставить отзыв» из вашего профиля
  mapsUrl: 'https://www.google.com/maps?cid=15565632468713508515',
  reviewUrl: 'https://g.page/r/CaOO9JFCPATYEBM/review',
  // Пн–Пт 09:00–18:00 (суббота по договорённости, воскресенье выходной)
  openingHours: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '18:00' },
} as const;

export const OG_IMAGE = { url: '/images/og-default.jpg', width: 1200, height: 630 };

/** Фото врача в трёх пропорциях: подсказка Google, какую картинку показывать рядом с сайтом в поиске. */
export const DOCTOR_PHOTO = {
  wide: { url: '/images/about/natalya-schnal-16x9.jpg', width: 1200, height: 675 },
  standard: { url: '/images/about/natalya-schnal-4x3.jpg', width: 1200, height: 900 },
  square: { url: '/images/about/natalya-schnal-1x1.jpg', width: 900, height: 900 },
};

/** Абсолютный адрес страницы: /de/services/botox → https://www.vivaasthetik.de/de/services/botox */
export function pageUrl(locale: Loc, path = ''): string {
  return `${SITE_URL}/${locale}${path === '/' ? '' : path}`;
}

type BuildArgs = {
  locale: Loc;
  /** Путь без языка: '' для главной, '/services', '/services/botox' */
  path?: string;
  title: string;
  description: string;
  /** Для главной: заголовок без добавления « | VIVA Ästhetik » */
  absoluteTitle?: boolean;
  noindex?: boolean;
  /** Своя картинка для превью и поиска; по умолчанию логотип */
  image?: { url: string; width: number; height: number };
};

/** Заголовок, описание, canonical, hreflang, Open Graph и Twitter для одной страницы. */
export function buildMetadata({ locale, path = '', title, description, absoluteTitle, noindex, image }: BuildArgs): Metadata {
  const p = path === '/' ? '' : path;
  const img = image ?? OG_IMAGE;
  const url = pageUrl(locale, p);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: {
        de: pageUrl('de', p),
        ru: pageUrl('ru', p),
        'x-default': pageUrl('de', p),
      },
    },
    openGraph: {
      type: 'website',
      siteName: 'VIVA Ästhetik',
      locale: locale === 'de' ? 'de_DE' : 'ru_RU',
      alternateLocale: locale === 'de' ? ['ru_RU'] : ['de_DE'],
      url,
      title,
      description,
      images: [{ url: img.url, width: img.width, height: img.height, alt: PRACTICE.fullName }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [img.url],
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
