import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHero from '@/components/layout/PageHero';
import { useTranslations } from 'next-intl';
import ConsultationCTA from '@/components/home/ConsultationCTA';
import Image from 'next/image';
import FAQClient from '@/components/faq/FAQClient';
import { faqData } from '@/data/faq';

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'FAQ' });
  const serviceLocale = locale as 'de' | 'ru';

  return (
    <main className="bg-white">
      {/* Мини-хиро */}
      <PageHero title={t('title')} />

      {/* FAQ Content */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-24 md:py-32">
        <FAQClient locale={serviceLocale} initialData={faqData} />
      </section>

      {/* Consultation CTA */}
      <ConsultationCTA />
    </main>
  );
}
