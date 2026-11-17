import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHero from '@/components/layout/PageHero';
import Image from 'next/image';
import ConsultationCTA from '@/components/home/ConsultationCTA';

import { buildMetadata, type Loc } from '@/lib/seo';
import { pageSeo, crumbNames } from '@/data/seo';
import { breadcrumbs } from '@/lib/schema';
import JsonLd from '@/components/seo/JsonLd';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Loc;
  return buildMetadata({ locale: l, path: '/about', ...pageSeo.about[l] });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'About' });

  return (
    <main className="bg-white">
      <JsonLd
        data={breadcrumbs(locale as Loc, [
          { name: crumbNames.home[locale as Loc], path: '' },
          { name: crumbNames.about[locale as Loc], path: '/about' },
        ])}
      />
      
      {/* Мини-хиро */}
      <PageHero title={t('Hero.title')} />

      {/* Professional Journey */}
      <section className="py-24 md:py-32 px-6 md:px-8 border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-10 leading-tight">
            {t('Journey.title')}
          </h2>
          <p className="text-lg md:text-xl text-gray-500 leading-relaxed">
            {t('Journey.text')}
          </p>
        </div>
      </section>

      {/* Quote Section with Photo Placeholder */}
      <section className="py-24 md:py-32 px-6 md:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
          
          {/* Photo Placeholder */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="w-full aspect-[4/5] bg-gray-200 relative overflow-hidden flex items-center justify-center text-gray-400">
              <Image 
                src="/images/about/natalia.webp"
                alt={locale === 'de' ? 'Natalya Schnall' : 'Наталья Шналь'}
                fill 
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Quote Text */}
          <div className="w-full md:w-1/2">
            <blockquote className="text-2xl md:text-4xl font-light text-gray-900 leading-snug">
              {t('Quote.text')}
            </blockquote>
          </div>

        </div>
      </section>

      {/* Education & Experience */}
      <section className="py-24 md:py-32 px-6 md:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-16 text-center">
            {t('Experience.title')}
          </h2>
          
          <div className="space-y-8 text-lg text-gray-600 leading-relaxed font-light">
            <p>{t('Experience.text1')}</p>
            <p>{t('Experience.text2')}</p>
            <p>{t('Experience.text3')}</p>
            <p>{t('Experience.text4')}</p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <ConsultationCTA />

    </main>
  );
}
