import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import dynamic from 'next/dynamic';
const ShaderBackground = dynamic(() => import('@/components/home/ShaderBackground'));
import ConsultationCTA from '@/components/home/ConsultationCTA';

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'About' });

  return (
    <main className="bg-white pb-24">
      
      {/* Hero Section */}
      <section className="relative w-full h-[100svh] flex items-center justify-center overflow-hidden bg-gray-900">
        <ShaderBackground />
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 flex flex-col items-center justify-center text-center pt-20">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 leading-tight">
            {t('Hero.title')}
          </h1>
          <p className="max-w-2xl text-lg text-gray-300 font-light mx-auto mb-10 leading-relaxed">
            {t('Hero.subtitle1')}
            <em className="italic">{t('Hero.subtitle2')}</em>
          </p>
        </div>
      </section>

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
            <blockquote className="text-2xl md:text-4xl font-light text-gray-900 leading-snug italic">
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
