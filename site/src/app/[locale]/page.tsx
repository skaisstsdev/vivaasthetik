import { setRequestLocale } from 'next-intl/server';
import Hero from '@/components/home/Hero';
import Intro from '@/components/home/Intro';
import PlaceholderBlock from '@/components/home/PlaceholderBlock';
import FeatureCards from '@/components/home/FeatureCards';
import TestimonialsPreview from '@/components/home/TestimonialsPreview';
import WhyUs from '@/components/home/WhyUs';
import ConsultationCTA from '@/components/home/ConsultationCTA';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as 'de' | 'ru';

  return (
    <>
      <link rel="preload" as="image" href="/video1_mobile_poster.jpg" media="(max-width: 767px)" />
      <link rel="preload" as="image" href="/video1_desktop_poster.jpg" media="(min-width: 768px)" />
      <main>
        <Hero />
        <Intro />
        <PlaceholderBlock 
          desktopVideo="/video1_desktop.mp4" 
          mobileVideo="/video1_desktop.mp4"
          desktopPoster="/video1_desktop_poster.jpg"
          mobilePoster="/video1_mobile_poster.jpg"
          titleLine1={loc === 'de' ? "Natürliche" : "Естественная"} 
          titleLine2={loc === 'de' ? "Schönheit." : "Красота."} 
        />
        <FeatureCards />
        <WhyUs />
        <TestimonialsPreview />
        <ConsultationCTA />
      </main>
    </>
  );
}
