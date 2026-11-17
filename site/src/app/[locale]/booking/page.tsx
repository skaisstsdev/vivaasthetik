import { setRequestLocale } from 'next-intl/server';
import PageHero from '@/components/layout/PageHero';
import { getTranslations } from 'next-intl/server';
import dynamic from 'next/dynamic';

// Dynamic imports — separate JS chunks, load in parallel after page shell renders
const BookingWizard = dynamic(() => import('@/components/booking/BookingWizard'), {
  loading: () => (
    <div className="flex justify-center p-20 text-gray-400 animate-pulse">
      Loading...
    </div>
  ),
});


export default async function BookingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Booking');

  return (
    <main className="bg-white">
      
      {/* Мини-хиро */}
      <PageHero title={t('title')} />

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-24 md:py-32 flex flex-col gap-12">
        <BookingWizard />
      </div>
    </main>
  );
}
