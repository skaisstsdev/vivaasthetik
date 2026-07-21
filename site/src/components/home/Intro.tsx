'use client';

import { useTranslations } from 'next-intl';

export default function Intro() {
  const t = useTranslations('Intro');

  return (
    <section className="pt-24 pb-8 px-8 bg-white">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center">
        <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-10 leading-snug">
          {t('title')}
        </h2>
        <p className="max-w-2xl text-gray-500 leading-relaxed text-lg mx-auto font-light">
          {t('text')}
        </p>
      </div>
    </section>
  );
}
