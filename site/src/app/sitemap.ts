import { MetadataRoute } from 'next';
import { servicesData } from '@/data/services';
import { LAST_UPDATED, pageUrl } from '@/lib/seo';

// Все индексируемые страницы на двух языках. У каждой указаны языковые версии (hreflang).
// Страница записи (/booking) намеренно не включена: это рабочая форма, а не страница для поиска.
const STATIC_PAGES: { path: string; priority: number; changeFrequency: 'weekly' | 'monthly' | 'yearly' }[] = [
  { path: '', priority: 1, changeFrequency: 'weekly' },
  { path: '/services', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/prices', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.8, changeFrequency: 'yearly' },
  { path: '/faq', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/tips', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/impressum', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/datenschutz', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/agb', priority: 0.2, changeFrequency: 'yearly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    ...STATIC_PAGES,
    ...servicesData.map((s) => ({ path: `/services/${s.slug}`, priority: 0.9, changeFrequency: 'monthly' as const })),
  ];
  const lastModified = new Date(LAST_UPDATED);

  return pages.flatMap((p) =>
    (['de', 'ru'] as const).map((locale) => ({
      url: pageUrl(locale, p.path),
      lastModified,
      changeFrequency: p.changeFrequency,
      priority: p.priority,
      alternates: {
        languages: {
          de: pageUrl('de', p.path),
          ru: pageUrl('ru', p.path),
          'x-default': pageUrl('de', p.path),
        },
      },
    })),
  );
}

