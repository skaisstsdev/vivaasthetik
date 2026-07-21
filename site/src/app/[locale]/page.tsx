import { setRequestLocale } from 'next-intl/server';
import Hero from '@/components/home/Hero';
import Intro from '@/components/home/Intro';
import ParallaxMarquee from '@/components/home/ParallaxMarquee';
import FeatureCards from '@/components/home/FeatureCards';
import SmoothScrollHero from '@/components/ui/smooth-scroll-hero';
import TestimonialsPreview from '@/components/home/TestimonialsPreview';
import WhyUs from '@/components/home/WhyUs';
import ConsultationCTA from '@/components/home/ConsultationCTA';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as 'de' | 'ru';

  return (
    <>
      <main className="flex-grow bg-white">
        <Hero />
        <Intro />
        <ParallaxMarquee />
        <SmoothScrollHero />
        <FeatureCards />
        <WhyUs />
        <TestimonialsPreview />
        <ConsultationCTA />
      </main>
    </>
  );
}
