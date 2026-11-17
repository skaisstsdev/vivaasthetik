import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import PageHero from '@/components/layout/PageHero';
import ConsultationCTA from '@/components/home/ConsultationCTA';
import { servicesData } from '@/data/services';
import { serviceGroups } from '@/data/serviceGroups';
import { prices } from '@/data/prices';
import type { ServiceContent } from '@/data/services/types';

const t = {
  title: { de: 'Preise', ru: 'Цены' },
  factorsTitle: { de: 'Wovon der Preis abhängt', ru: 'От чего зависит цена' },
  factors: [
    {
      title: { de: 'Behandlungsareal', ru: 'Зона обработки' },
      text: {
        de: 'Je nach Bereich und Umfang der Behandlung unterscheidet sich der Aufwand.',
        ru: 'В зависимости от зоны и объёма процедуры отличается и объём работы.',
      },
    },
    {
      title: { de: 'Menge & Präparat', ru: 'Объём и препарат' },
      text: {
        de: 'Der Materialverbrauch, zum Beispiel die benötigte Menge des Präparats, beeinflusst den Preis.',
        ru: 'На цену влияет расход материала, например необходимое количество препарата.',
      },
    },
    {
      title: { de: 'Ihr Behandlungsziel', ru: 'Ваша цель' },
      text: {
        de: 'In der Beratung stimmen wir den Behandlungsplan auf Ihre Wünsche und Ihre Haut ab.',
        ru: 'На консультации мы подбираем план процедуры под ваши пожелания и особенности кожи.',
      },
    },
  ],
  from: { de: 'ab', ru: 'от' },
  afterConsult: { de: 'nach Beratung', ru: 'после консультации' },
  more: { de: 'Mehr erfahren', ru: 'Подробнее' },
  noteTitle: { de: 'Wichtig zu wissen', ru: 'Важно знать' },
  note: {
    de: 'Alle Preise sind „ab“-Preise und dienen der Orientierung. Der verbindliche Endpreis hängt von Menge, Behandlungsareal und Behandlungsziel ab und wird nach der persönlichen Beratung vor der Behandlung mit Ihnen besprochen.',
    ru: 'Все цены указаны «от» и служат ориентиром. Окончательная стоимость зависит от объёма препарата, зоны обработки и цели процедуры и обсуждается с вами после личной консультации перед процедурой.',
  },
};

export default async function PricesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as 'de' | 'ru';

  const known = new Set(serviceGroups.flatMap((g) => g.slugs));
  const rest = servicesData.filter((s) => !known.has(s.slug));
  const sections = [
    ...serviceGroups.map((g) => ({
      title: g.title[loc],
      items: g.slugs
        .map((slug) => servicesData.find((s) => s.slug === slug))
        .filter((s): s is ServiceContent => Boolean(s)),
    })),
    ...(rest.length ? [{ title: loc === 'de' ? 'Weitere Behandlungen' : 'Другие процедуры', items: rest }] : []),
  ].filter((s) => s.items.length > 0);

  return (
    <main className="bg-white">
      <PageHero title={t.title[loc]} />

      {/* От чего зависит цена */}
      <section aria-labelledby="factors-title" className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-24">
          <h2 id="factors-title" className="text-3xl md:text-4xl text-gray-900 leading-tight text-center mb-12 md:mb-14">
            {t.factorsTitle[loc]}
          </h2>
          <div className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-3 gap-6 md:gap-8">
            {t.factors.map((f, i) => (
              <div key={i} className="bg-white border border-gray-100 p-7 md:p-9">
                <span aria-hidden="true" className="font-mono text-sm tracking-widest text-[#8a6327]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 mb-3 text-xl md:text-2xl font-medium text-gray-900 !normal-case !tracking-normal leading-snug">
                  {f.title[loc]}
                </h3>
                <p className="text-gray-600 leading-relaxed">{f.text[loc]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Цены по категориям */}
      <div className="max-w-5xl mx-auto px-6 md:px-8 py-20 md:py-28 flex flex-col gap-16 md:gap-20">
        {sections.map((section) => (
          <section key={section.title} aria-label={section.title}>
            <h2 className="text-sm md:text-base tracking-[0.25em] text-[#8a6327] mb-2">{section.title}</h2>
            <ul className="border-b border-gray-200">
              {section.items.map((service) => {
                const info = prices[service.slug];
                const priceText =
                  info && info.price !== null
                    ? `${info.from ? t.from[loc] + ' ' : ''}${info.price} €`
                    : t.afterConsult[loc];
                return (
                  <li
                    key={service.slug}
                    className="border-t border-gray-200 py-7 md:py-8 grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-[minmax(0,1fr)_9rem_11rem] md:items-center md:gap-8"
                  >
                    <div className="min-w-0">
                      <h3 className="text-xl md:text-2xl text-gray-900 leading-tight break-words">
                        <Link
                          href={`/services/${service.slug}`}
                          className="hover:text-[#8a6327] transition-colors"
                        >
                          {service.title[loc]}
                        </Link>
                      </h3>
                      {info?.basis && (
                        <p className="mt-2 text-sm text-gray-500">{info.basis[loc]}</p>
                      )}
                    </div>

                    <p className="text-xl md:text-2xl text-gray-900 md:text-right whitespace-nowrap">
                      {priceText}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 md:justify-end">
                      <Link
                        href={`/services/${service.slug}`}
                        className="inline-flex items-center h-11 text-xs uppercase tracking-[0.2em] font-medium text-gray-800 hover:text-[#8a6327] transition-colors"
                      >
                        {t.more[loc]} →
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}

        {/* Пояснение */}
        <aside className="bg-[#faf6ea] border-l-2 border-[#c9a84c] p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl text-gray-900 leading-tight mb-4">{t.noteTitle[loc]}</h2>
          <p className="text-gray-700 leading-relaxed">{t.note[loc]}</p>
        </aside>
      </div>

      <ConsultationCTA />
    </main>
  );
}
