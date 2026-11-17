import { setRequestLocale } from 'next-intl/server';
import Hero from '@/components/home/Hero';
import Intro from '@/components/home/Intro';
import ParallaxMarquee from '@/components/home/ParallaxMarquee';
import FeatureCards from '@/components/home/FeatureCards';
import GoogleReviews from '@/components/home/GoogleReviews';
import WhyUs from '@/components/home/WhyUs';
import ConsultationCTA from '@/components/home/ConsultationCTA';
import { buildMetadata, type Loc } from '@/lib/seo';
import { pageSeo } from '@/data/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Loc;
  return buildMetadata({ locale: l, path: '', absoluteTitle: true, ...pageSeo.home[l] });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as 'de' | 'ru';

  return (
    <>
      <main className="flex-grow bg-white">
        <Hero />
        {/* Intro section that appears exactly after shader */}
        <Intro />
        <ParallaxMarquee />
        <FeatureCards />
        <WhyUs />
        <GoogleReviews loc={loc} />
        <ConsultationCTA />
      </main>
    </>
  );
}
