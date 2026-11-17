'use client';

import { useTranslations } from 'next-intl';
import { btnGold, btnGhostLight } from '@/lib/ui';
import { Link } from '@/i18n/routing';
import ShaderBackground from './ShaderBackground';

export default function Hero() {
  const t = useTranslations('Hero');

  return (
    <section className="relative w-full h-[100svh] flex items-center justify-center overflow-hidden bg-[#061220]">
      {/* Animated navy + gold background */}
      <ShaderBackground />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center justify-center text-center pt-20">

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white mb-8 leading-[1.1]">
          {t('title')}{' '}
          <span>{t('titleEm')}</span>
        </h1>
        <p className="max-w-2xl text-lg text-white/70 font-light mx-auto mb-10 leading-relaxed">
          {t('subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center w-full mt-4">
          <Link
            href="/booking"
            className={`${btnGold} w-full max-w-[18rem] sm:w-auto sm:max-w-none`}
          >
            {t('ctaBooking')}
          </Link>
          <Link
            href="/services"
            className={`${btnGhostLight} w-full max-w-[18rem] sm:w-auto sm:max-w-none`}
          >
            {t('ctaPrimary')}
          </Link>
        </div>
      </div>
    </section>
  );
}
