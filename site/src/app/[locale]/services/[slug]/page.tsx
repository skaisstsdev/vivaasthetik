import { setRequestLocale } from 'next-intl/server';
import PageHero from '@/components/layout/PageHero';
import { parseServiceContent } from '@/lib/serviceContent';
import ServiceFacts from '@/components/services/ServiceFacts';
import ServiceFaq, { getServiceFaqItems } from '@/components/services/ServiceFaq';
import ServiceLayout from '@/components/services/ServiceLayout';
import AuthorBlock from '@/components/services/AuthorBlock';
import RelatedServices from '@/components/services/RelatedServices';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata, type Loc } from '@/lib/seo';
import { serviceSeo, crumbNames } from '@/data/seo';
import { breadcrumbs, serviceWebPage, faqPage } from '@/lib/schema';
import { getServiceBySlug, servicesData } from '@/data/services';
import { notFound } from 'next/navigation';
import BookingBand from '@/components/services/BookingBand';
import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';

export function generateStaticParams() {
  const slugs = servicesData.map(s => s.slug);
  return ['de', 'ru'].flatMap(locale => 
    slugs.map(slug => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const l = locale as Loc;
  const service = getServiceBySlug(slug);
  const seo = serviceSeo[slug]?.[l];
  if (!service || !seo) return {};
  return buildMetadata({ locale: l, path: `/services/${slug}`, ...seo });
}

export default async function ServiceDetailPage({ 
  params 
}: { 
  params: Promise<{ locale: string, slug: string }> 
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const service = getServiceBySlug(slug);
  if (!service) {
    notFound();
  }

  const loc = locale as 'de' | 'ru';

  // В текстах услуг разделы размечены h3/h4; здесь они становятся главами (h2) и карточками (h3).
  const layout = service.layout?.[loc];
  const seo = serviceSeo[slug]?.[loc];
  const faqItems = getServiceFaqItems(service.slug, loc, layout?.faq);
  const chapters = layout ? [] : parseServiceContent(service.content[loc]);
  const bodyCls =
    'prose-base md:prose-lg prose-strong:text-gray-900 prose-li:my-1.5 [&_ul.list-cols]:md:columns-2 [&_ul.list-cols]:gap-x-10 [&_ul.list-cols_li]:break-inside-avoid';
  const proseCls =
    'prose prose-gray max-w-none prose-p:leading-relaxed prose-li:marker:text-[#c9a84c] prose-ul:my-4 prose-p:my-4 first:prose-p:mt-0 text-gray-700';

  return (
    <main className="bg-white">
      <JsonLd
        data={[
          breadcrumbs(loc, [
            { name: crumbNames.home[loc], path: '' },
            { name: crumbNames.services[loc], path: '/services' },
            { name: service.title[loc], path: `/services/${service.slug}` },
          ]),
          serviceWebPage(loc, service.slug, service.title[loc], seo?.description ?? service.shortDescription[loc]),
          faqPage(faqItems),
        ]}
      />
      
      {/* Мини-хиро */}
      <PageHero
        title={service.title[loc]}
        top={
          <Link
            href="/services"
            className="inline-flex items-center gap-3 text-xs md:text-sm uppercase tracking-widest text-white/70 hover:text-white transition-colors mb-8 md:mb-10"
          >
            <ArrowLeft size={16} />
            {loc === 'de' ? 'Zurück zu Leistungen' : 'Назад к услугам'}
          </Link>
        }
      />

      {/* Коротко о процедуре */}
      {service.bookingDetails && <ServiceFacts details={service.bookingDetails} loc={loc} />}

      {layout ? (
        <ServiceLayout layout={layout} loc={loc} />
      ) : (
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-28 flex flex-col gap-20 md:gap-28">
        {chapters.map((chapter, i) => (
          <section key={i}>
            {(chapter.title || chapter.html) && (
              <div className={`grid grid-cols-[minmax(0,1fr)] gap-6 lg:gap-20 ${chapter.title ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]' : ''}`}>
                {chapter.title && (
                  <h2 className="text-3xl md:text-4xl text-gray-900 leading-tight">{chapter.title}</h2>
                )}
                {chapter.html && (
                  <div
                    className={`${proseCls} prose-lg md:prose-xl ${chapter.title ? '' : 'max-w-4xl'}`}
                    dangerouslySetInnerHTML={{ __html: chapter.html }}
                  />
                )}
              </div>
            )}
            {chapter.cards.length > 0 && (
              <div className="mt-12 md:mt-16 border-b border-gray-200">
                {chapter.cards.map((card, j) => (
                  <article
                    key={j}
                    className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-5 lg:gap-16 py-9 md:py-12 border-t border-gray-200"
                  >
                    <div className="flex gap-4 md:gap-5">
                      <span aria-hidden="true" className="font-mono text-sm tracking-widest text-[#8a6327] pt-1.5">
                        {String(j + 1).padStart(2, '0')}
                      </span>
                      <h3 className="text-2xl md:text-[1.7rem] font-medium text-gray-900 !normal-case !tracking-normal leading-snug">
                        {card.title}
                      </h3>
                    </div>
                    <div
                      className={
                        card.important
                          ? 'bg-[#faf6ea] border-l-2 border-[#c9a84c] p-6 md:p-8'
                          : ''
                      }
                    >
                      <div className={`${proseCls} ${bodyCls}`} dangerouslySetInnerHTML={{ __html: card.html }} />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
      )}

      {/* Врач */}
      <AuthorBlock loc={loc} />

      {/* Частые вопросы по процедуре */}
      <ServiceFaq slug={service.slug} loc={loc} extra={layout?.faq} />

      {/* Похожие процедуры */}
      <RelatedServices slug={service.slug} loc={loc} />

      {/* Запись */}
      <BookingBand loc={loc} serviceSlug={service.slug} hideBooking={service.hideBookingButton} />

    </main>
  );
}
