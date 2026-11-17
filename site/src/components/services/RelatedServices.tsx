import { Link } from '@/i18n/routing';
import { servicesData } from '@/data/services';
import { serviceGroups } from '@/data/serviceGroups';

// «Другие процедуры»: до трёх похожих услуг (из той же группы, затем из соседних).
// Внутренние ссылки помогают посетителям и поисковикам переходить между страницами.
export default function RelatedServices({ slug, loc }: { slug: string; loc: 'de' | 'ru' }) {
  const own = serviceGroups.find((g) => g.slugs.includes(slug));
  const order = [
    ...(own ? own.slugs : []),
    ...serviceGroups.filter((g) => g !== own).flatMap((g) => g.slugs),
  ].filter((s) => s !== slug);
  const items = order
    .map((s) => servicesData.find((x) => x.slug === s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .slice(0, 3);
  if (!items.length) return null;

  return (
    <section aria-labelledby="related-title" className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-20">
        <h2 id="related-title" className="text-2xl md:text-3xl text-gray-900 leading-tight text-center mb-10">
          {loc === 'de' ? 'Weitere Behandlungen in Kassel' : 'Другие процедуры в Касселе'}
        </h2>
        <ul className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-3 gap-4 md:gap-6">
          {items.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="group flex h-full items-center justify-between gap-4 border border-gray-200 p-6 hover:border-[#c9a84c] transition-colors"
              >
                <span className="text-lg md:text-xl text-gray-900 leading-snug group-hover:text-[#8a6327] transition-colors">
                  {s.title[loc]}
                </span>
                <span aria-hidden="true" className="text-[#8a6327]">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
