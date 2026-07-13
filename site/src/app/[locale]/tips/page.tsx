import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import ConsultationCTA from '@/components/home/ConsultationCTA';
import TipsClient from '@/components/tips/TipsClient';
import ShaderBackground from '@/components/home/ShaderBackground';
import { tipsData } from '@/data/tips';

export default async function TipsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = useTranslations('Tips');
  const serviceLocale = locale as 'de' | 'ru';

  return (
    <main className="bg-white pb-24">
      {/* Hero Section */}
      <section className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden bg-gray-900">
        <ShaderBackground />
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 flex flex-col items-center justify-center text-center pt-20">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 leading-tight">
            {t('title')}
          </h1>
          <p className="max-w-2xl text-lg text-gray-300 font-light mx-auto mb-10 leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Tips Content */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 mt-24 mb-24">
        <TipsClient locale={serviceLocale} initialData={tipsData} />
      </section>

      {/* Consultation CTA */}
      <ConsultationCTA />
    </main>
  );
}
