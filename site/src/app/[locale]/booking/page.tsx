import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

// Dynamic imports — separate JS chunks, load in parallel after page shell renders
const BookingWizard = dynamic(() => import('@/components/booking/BookingWizard'), {
  loading: () => (
    <div className="flex justify-center p-20 text-gray-400 animate-pulse">
      Loading...
    </div>
  ),
});

const ShaderBackground = dynamic(() => import('@/components/home/ShaderBackground'));

export default async function BookingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = useTranslations('Booking');

  return (
    <main className="bg-white pb-24">
      
      {/* Hero Section — bg-gray-900 shows instantly while shader loads */}
      <section className="relative w-full h-[100svh] flex items-center justify-center overflow-hidden bg-gray-900">
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

      <div className="max-w-7xl mx-auto px-6 md:px-8 mt-24 flex flex-col gap-12">
        <BookingWizard />
      </div>
    </main>
  );
}
