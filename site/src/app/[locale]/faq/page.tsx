import { setRequestLocale, getTranslations } from 'next-intl/server';
import ConsultationCTA from '@/components/home/ConsultationCTA';
import FAQClient from '@/components/faq/FAQClient';
import { ServiceLocale } from '@/data/services/types';

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const serviceLocale = locale as ServiceLocale;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'FAQ' });

  return (
    <main className="bg-white pb-24">
      {/* Hero Section */}
      <section className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 flex flex-col items-center justify-center text-center pt-20">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 leading-tight">
            {t('title')}
          </h1>
          <p className="max-w-2xl text-lg text-gray-300 font-light mx-auto mb-10 leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 mt-24 mb-24">
        <FAQClient locale={serviceLocale} />
      </section>

      {/* Consultation CTA */}
      <ConsultationCTA />
    </main>
  );
}
