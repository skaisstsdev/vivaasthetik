import { setRequestLocale } from 'next-intl/server';
import { servicesData } from '@/data/services';
import { Link } from '@/i18n/routing';
import BookNowButton from '@/components/booking/BookNowButton';
import ConsultationCTA from '@/components/home/ConsultationCTA';
import PlaceholderBlock from '@/components/home/PlaceholderBlock';
import { Suspense } from 'react';
import ServicesClient from './ServicesClient';
import ShaderBackground from '@/components/home/ShaderBackground';

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

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const loc = locale as 'de' | 'ru';

  return (
    <>
      <link rel="preload" as="image" href="/video2_mobile_poster.jpg" media="(max-width: 767px)" />
      <link rel="preload" as="image" href="/video2_desktop_poster.jpg" media="(min-width: 768px)" />
      <main className="bg-gray-50 pb-0">
      
      {/* Hero Section */}
      <section className="relative w-full h-[100svh] flex items-center justify-center overflow-hidden bg-gray-900">
        <ShaderBackground />
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 flex flex-col items-center justify-center text-center pt-20">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 leading-tight">
            {loc === 'de' ? 'Unsere Leistungen' : 'Наши услуги'}
          </h1>
          <p className="max-w-2xl text-lg text-gray-300 font-light mx-auto mb-10 leading-relaxed">
            {loc === 'de' 
              ? 'Individuelle Behandlungen im Einklang mit Ihrer natürlichen Schönheit.'
              : 'Индивидуальные процедуры в гармонии с вашей естественной красотой.'}
          </p>
        </div>
      </section>

      {/* Intro Text Section */}
      <section className="bg-white py-24 md:py-32 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-8 text-center">
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

      {/* Placeholder block replacing the video */}
      <PlaceholderBlock 
        desktopVideo="/video2_desktop.mp4" 
        mobileVideo="/video2_mobile.mp4" 
        desktopPoster="/video2_desktop_poster.jpg"
        mobilePoster="/video2_mobile_poster.jpg"
        titleLine1={loc === 'de' ? "Unsere" : "Наши"} 
        titleLine2={loc === 'de' ? "Leistungen." : "Услуги."} 
      />

      {/* Cards Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-24 md:py-32">
        <Suspense fallback={<div>Loading...</div>}>
          <ServicesClient services={servicesData} loc={loc} />
        </Suspense>
      </section>

      {/* Bottom CTA */}
      <ConsultationCTA />
    </main>
    </>
  );
}
