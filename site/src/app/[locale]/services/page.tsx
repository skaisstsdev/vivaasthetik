import { setRequestLocale } from 'next-intl/server';
import PageHero from '@/components/layout/PageHero';
import { servicesData } from '@/data/services';
import { Link } from '@/i18n/routing';
import BookNowButton from '@/components/booking/BookNowButton';
import ConsultationCTA from '@/components/home/ConsultationCTA';
import ServicesClient from './ServicesClient';

import { buildMetadata, type Loc } from '@/lib/seo';
import { pageSeo, crumbNames } from '@/data/seo';
import { breadcrumbs } from '@/lib/schema';
import JsonLd from '@/components/seo/JsonLd';

// Функция для определения размера карточки (Bento Grid)
const getCardClasses = (slug: string) => {
  // Выделяем самые популярные процедуры, делая их в 2 раза шире на планшетах и ПК
  const largeCards = ['botox', 'faltenunterspritzung', 'lippenkorrektur', 'fadenlifting'];
  
  if (largeCards.includes(slug)) {
    return 'md:col-span-2 lg:col-span-2';
  }
  // Остальные занимают 1 колонку
  return 'col-span-1';
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Loc;
  return buildMetadata({ locale: l, path: '/services', ...pageSeo.services[l] });
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const loc = locale as 'de' | 'ru';

  return (
    <>
      <main className="bg-gray-50 pb-0">
      <JsonLd
        data={breadcrumbs(locale as Loc, [
          { name: crumbNames.home[locale as Loc], path: '' },
          { name: crumbNames.services[locale as Loc], path: '/services' },
        ])}
      />
      
      {/* Мини-хиро */}
      <PageHero
        title={
          loc === 'de' ? (
            <>
              Unsere
              <br className="sm:hidden" /> Leistungen
            </>
          ) : (
            'Наши услуги'
          )
        }
      />

      {/* Intro Text Section */}
      <section className="bg-white py-24 md:py-32 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-8 leading-tight">
            {loc === 'de' ? 'Behandlung, der Sie vertrauen können' : 'Лечение, которому вы можете доверять'}
          </h2>
          <p className="text-gray-500 text-lg md:text-xl leading-relaxed">
            {loc === 'de' 
              ? 'Jede Behandlung wird individuell auf Sie abgestimmt, um die bestmöglichen Ergebnisse zu erzielen - ganz im Einklang mit Ihrer natürlichen Schönheit.'
              : 'Каждое лечение подбирается индивидуально, с учётом ваших особенностей, чтобы подчеркнуть вашу естественную красоту и достичь наилучших результатов.'}
          </p>
        </div>
      </section>
      {/* Cards Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-24 md:py-32">
        <ServicesClient services={servicesData} loc={loc} />
      </section>

      {/* Bottom CTA */}
      <ConsultationCTA />
    </main>
    </>
  );
}
