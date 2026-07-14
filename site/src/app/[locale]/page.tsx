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

  return (
    <main>
      <Hero />
      <Intro />
      <PlaceholderBlock />
      <FeatureCards />
      <WhyUs />
      <TestimonialsPreview />
      <ConsultationCTA />
    </main>
  );
}
