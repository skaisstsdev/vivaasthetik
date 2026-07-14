'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import BookNowButton from '@/components/booking/BookNowButton';
import ShaderBackground from './ShaderBackground';

export default function ConsultationCTA() {
  const t = useTranslations('ConsultationCTA');

  return (
    <section className="relative py-24 px-8 overflow-hidden text-white">
      <ShaderBackground />
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">
          {t('eyebrow')}
        </p>
        <h2 className="text-3xl md:text-4xl font-light mb-6 leading-snug">
          {t('title')}
        </h2>
        <p className="text-gray-400 leading-relaxed mb-10">
          {t('text')}
        </p>
        <Link
          href="/booking"
          className="inline-block px-12 py-5 bg-transparent border border-white text-white text-xs md:text-sm tracking-[0.2em] uppercase font-medium hover:bg-white hover:text-gray-900 transition-colors relative overflow-hidden group"
        >
          <span className="shimmer-text relative z-10" style={{ animationDelay: '6s' }}>{t('cta')}</span>
          <div className="absolute inset-0 border border-transparent shimmer-border rounded-none pointer-events-none" style={{ animationDelay: '6.2s' }}></div>
        </Link>
      </div>
    </section>
  );
}
