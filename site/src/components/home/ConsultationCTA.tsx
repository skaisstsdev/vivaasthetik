'use client';

import { useTranslations } from 'next-intl';
import { btnGold } from '@/lib/ui';
import { Link } from '@/i18n/routing';
import BookNowButton from '@/components/booking/BookNowButton';
import StaticGradient from './StaticGradient';

export default function ConsultationCTA() {
  const t = useTranslations('ConsultationCTA');

  return (
    <section className="relative py-24 md:py-28 px-6 md:px-8 overflow-hidden text-white">
      <StaticGradient />
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-4">
          {t('eyebrow')}
        </p>
        <h2 className="text-3xl md:text-4xl font-light mb-6 leading-snug">
          {t('title')}
        </h2>
        <p className="text-white/70 leading-relaxed mb-10">
          {t('text')}
        </p>
        <Link
          href="/booking"
          className={btnGold}
        >
          {t('cta')}
        </Link>
      </div>
    </section>
  );
}
