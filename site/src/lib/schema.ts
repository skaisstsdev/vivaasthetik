import { PRACTICE, SITE_URL, pageUrl, OG_IMAGE, type Loc, DOCTOR_PHOTO } from '@/lib/seo';
import { servicesData } from '@/data/services';
import { serviceSeo } from '@/data/seo';

// Разметка schema.org. Принципы:
// - Звёзды отзывов (aggregateRating) НЕ добавляем: Google не показывает звёзды для отзывов,
//   которые организация размещает о самой себе.
// - Цены не добавляем, пока они не подтверждены.
// - Врач описан как Person (а не как второй LocalBusiness), чтобы не плодить дубли карточки.

const PRACTICE_ID = `${SITE_URL}/#practice`;
const DOCTOR_ID = `${SITE_URL}/#doctor`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const abs = (path: string) => `${SITE_URL}${path}`;

/** Практика, врач и сайт: выводится на всех страницах. */
export function siteGraph(locale: Loc) {
  const services = servicesData.map((s) => ({
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      name: serviceSeo[s.slug]?.[locale].title ?? s.title[locale],
      url: pageUrl(locale, `/services/${s.slug}`),
      areaServed: { '@type': 'City', name: PRACTICE.city },
    },
  }));

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalClinic',
        '@id': PRACTICE_ID,
        name: PRACTICE.name,
        alternateName: PRACTICE.fullName,
        description:
          locale === 'de'
            ? 'Praxis für ästhetische Medizin in Kassel: Faltenbehandlung, Hyaluron, Mesotherapie, PRP, Fadenlifting und mehr bei Ärztin Natalya Schnal.'
            : 'Практика эстетической медицины в Касселе: коррекция морщин, гиалуроновые филлеры, мезотерапия, PRP, нитевой лифтинг и другие процедуры у врача Натальи Шналь.',
        url: pageUrl(locale),
        logo: abs('/images/viva_monogram.png'),
        image: [abs(DOCTOR_PHOTO.wide.url), abs(DOCTOR_PHOTO.standard.url), abs(DOCTOR_PHOTO.square.url), abs(OG_IMAGE.url)],
        telephone: PRACTICE.phone,
        email: PRACTICE.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: PRACTICE.street,
          postalCode: PRACTICE.zip,
          addressLocality: PRACTICE.city,
          addressRegion: PRACTICE.region,
          addressCountry: PRACTICE.country,
        },
        geo: { '@type': 'GeoCoordinates', latitude: PRACTICE.lat, longitude: PRACTICE.lng },
        hasMap: PRACTICE.mapsUrl,
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: PRACTICE.openingHours.days,
            opens: PRACTICE.openingHours.opens,
            closes: PRACTICE.openingHours.closes,
          },
        ],
        areaServed: { '@type': 'City', name: PRACTICE.city },
        knowsLanguage: ['de', 'ru'],
        sameAs: [PRACTICE.instagram, PRACTICE.mapsUrl],
        founder: { '@id': DOCTOR_ID },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: locale === 'de' ? 'Behandlungen' : 'Процедуры',
          itemListElement: services,
        },
      },
      {
        '@type': 'Person',
        '@id': DOCTOR_ID,
        name: PRACTICE.doctor,
        jobTitle: locale === 'de' ? 'Ärztin' : 'Врач',
        image: abs(DOCTOR_PHOTO.square.url),
        worksFor: { '@id': PRACTICE_ID },
        url: pageUrl(locale, '/about'),
        knowsLanguage: ['de', 'ru'],
        knowsAbout:
          locale === 'de'
            ? ['Ästhetische Medizin', 'Mesotherapie', 'Hyaluronsäure-Filler', 'PRP-Therapie']
            : ['Эстетическая медицина', 'Мезотерапия', 'Гиалуроновые филлеры', 'PRP-терапия'],
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: SITE_URL,
        name: 'VIVA Ästhetik',
        inLanguage: locale,
        publisher: { '@id': PRACTICE_ID },
      },
    ],
  };
}

/** Главная страница: какое фото считать основным (Google показывает его рядом с сайтом в поиске). */
export function homeWebPage(locale: Loc) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: pageUrl(locale),
    inLanguage: locale,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': PRACTICE_ID },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: abs(DOCTOR_PHOTO.wide.url),
      width: DOCTOR_PHOTO.wide.width,
      height: DOCTOR_PHOTO.wide.height,
    },
  };
}

/** «Хлебные крошки»: [{name, path}] от главной до текущей страницы. */
export function breadcrumbs(locale: Loc, trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: pageUrl(locale, t.path),
    })),
  };
}

/** Страница услуги: медицинская информационная страница о процедуре. */
export function serviceWebPage(locale: Loc, slug: string, name: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    '@id': `${pageUrl(locale, `/services/${slug}`)}#webpage`,
    url: pageUrl(locale, `/services/${slug}`),
    name,
    description,
    inLanguage: locale,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@type': 'MedicalProcedure', name },
    author: { '@id': DOCTOR_ID },
    reviewedBy: { '@id': DOCTOR_ID },
    provider: { '@id': PRACTICE_ID },
  };
}

/** Вопросы и ответы, которые видны на странице. */
export function faqPage(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}
