'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function TestimonialsPreview() {
  const t = useTranslations('Testimonials');

  // next-intl doesn't support useTranslations().raw() for arrays directly,
  // so we read items individually using index access pattern
  const items = Array.from({ length: 13 }).map((_, i) => ({
    text: t(`items.${i}.text` as any),
    name: t(`items.${i}.name` as any),
  }));

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-3">
            {t('eyebrow')}
          </p>
          <h2 className="text-4xl md:text-5xl font-light text-gray-900">
            {t('title')}
          </h2>
        </div>
      </div>

      {/* Marquee of testimonials */}
      <div className="flex gap-12 group overflow-hidden w-full px-4">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex gap-12 w-max flex-shrink-0 animate-marquee group-hover:[animation-play-state:paused]">
            {items.map((item, i) => (
              <div key={i} className="flex flex-col gap-6 w-[300px] md:w-[400px] whitespace-normal">
                {/* Quote mark */}
                <span className="text-4xl font-serif text-gold leading-none">&ldquo;</span>
                <p className="text-gray-600 leading-relaxed">
                  {item.text}
                </p>
                <p className="text-sm font-medium text-gray-900 tracking-wide mt-auto">
                  — {item.name}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Leave a review link */}
      <div className="text-center mt-16 px-8">
        <a
          href="#"
          className="inline-block border border-gray-300 text-gray-700 text-sm px-8 py-3 hover:border-gray-900 hover:text-gray-900 transition-colors uppercase tracking-widest"
        >
          {t('leaveReview')}
        </a>
      </div>
    </section>
  );
}
