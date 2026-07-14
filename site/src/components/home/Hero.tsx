'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import ShaderBackground from './ShaderBackground';

export default function Hero() {
  const t = useTranslations('Hero');

  return (
    <section className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Animated navy + gold background */}
      <ShaderBackground />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 flex flex-col items-center justify-center text-center pt-20">

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 leading-tight">
          {t('title')}{' '}
          <em className="italic">{t('titleEm')}</em>
        </h1>
        <p className="max-w-2xl text-lg text-white/60 font-light mx-auto mb-10 leading-relaxed">
          {t('subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center w-full mt-4">
          <Link
            href="/booking"
            className="px-8 py-3 md:px-12 md:py-4 bg-transparent border border-white/30 text-white text-xs md:text-sm uppercase tracking-[0.2em] font-medium hover:bg-white/10 transition-colors"
          >
            {t('ctaBooking')}
          </Link>
        </div>
      </div>
    </section>
  );
}
