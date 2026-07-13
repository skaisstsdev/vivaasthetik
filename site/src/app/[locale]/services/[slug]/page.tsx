import { setRequestLocale } from 'next-intl/server';
import { getServiceBySlug, servicesData } from '@/data/services';
import { notFound } from 'next/navigation';
import BookNowButton from '@/components/booking/BookNowButton';
import ShaderBackground from '@/components/home/ShaderBackground';
import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';

export function generateStaticParams() {
  const slugs = servicesData.map(s => s.slug);
  return ['de', 'ru'].flatMap(locale => 
    slugs.map(slug => ({ locale, slug }))
  );
}

export default async function ServiceDetailPage({ 
  params 
}: { 
  params: Promise<{ locale: string, slug: string }> 
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const service = getServiceBySlug(slug);
  if (!service) {
    notFound();
  }

  const loc = locale as 'de' | 'ru';

  return (
    <main className="bg-white pb-24">
      
      {/* Full-screen Hero Section for the specific service */}
      <section className="relative w-full h-[100dvh] flex items-center justify-center bg-gray-900 overflow-hidden">
        <ShaderBackground />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12 flex flex-col items-center justify-center text-center">
          
          <Link 
            href="/services" 
            className="inline-flex items-center gap-3 text-xs md:text-sm uppercase tracking-widest text-white/70 hover:text-white transition-colors mb-10 md:mb-16"
          >
            <ArrowLeft size={16} />
            {loc === 'de' ? 'Zurück zu Leistungen' : 'Назад к услугам'}
          </Link>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white mb-8 leading-tight">
            {service.title[loc]}
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl font-light leading-relaxed">
            {service.shortDescription[loc]}
          </p>
        </div>

      </section>

      {/* Main Content Section */}
      <section className="max-w-3xl mx-auto px-6 md:px-8 pt-24 md:pt-32">
        <div 
          className="prose prose-lg md:prose-xl prose-gray prose-headings:font-light prose-h3:text-3xl prose-h4:text-2xl max-w-none mb-24"
          dangerouslySetInnerHTML={{ __html: service.content[loc] }}
        />

        {/* Booking CTA for this specific service */}
        <div className="relative bg-[#111111] p-10 md:p-16 text-center text-white flex flex-col items-center overflow-hidden">
          <ShaderBackground />
          <div className="relative z-10 flex flex-col items-center">
            <h3 className="text-2xl md:text-3xl font-light mb-6">
              {loc === 'de' ? 'Interesse an dieser Behandlung?' : 'Заинтересовала эта процедура?'}
            </h3>
            <p className="text-gray-400 mb-10 text-lg">
              {loc === 'de' ? 'Vereinbaren Sie jetzt einen Beratungstermin.' : 'Запишитесь на консультацию прямо сейчас.'}
            </p>
            <BookNowButton 
              serviceSlug={service.slug}
              className="inline-block bg-transparent border border-white text-white px-10 py-5 text-sm uppercase tracking-wider font-medium hover:bg-white hover:text-gray-900 transition-colors"
            >
              {loc === 'de' ? 'Termin buchen' : 'Записаться на прием'}
            </BookNowButton>
          </div>
        </div>
      </section>

    </main>
  );
}
