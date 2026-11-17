import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHero from '@/components/layout/PageHero';
import ConsultationCTA from '@/components/home/ConsultationCTA';
import TipsClient from '@/components/tips/TipsClient';
import { tipsData } from '@/data/tips';

import { buildMetadata, type Loc } from '@/lib/seo';
import { pageSeo, crumbNames } from '@/data/seo';
import { breadcrumbs } from '@/lib/schema';
import JsonLd from '@/components/seo/JsonLd';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Loc;
  return buildMetadata({ locale: l, path: '/tips', ...pageSeo.tips[l] });
}

export default async function TipsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Tips' });
  const serviceLocale = locale as 'de' | 'ru';

  return (
    <main className="bg-white">
      <JsonLd
        data={breadcrumbs(locale as Loc, [
          { name: crumbNames.home[locale as Loc], path: '' },
          { name: crumbNames.tips[locale as Loc], path: '/tips' },
        ])}
      />
      {/* Мини-хиро */}
      <PageHero title={t('title')} />

      {/* Tips Content */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-24 md:py-32">
        <TipsClient locale={serviceLocale} initialData={tipsData} />
      </section>

      {/* Consultation CTA */}
      <ConsultationCTA />
    </main>
  );
}
