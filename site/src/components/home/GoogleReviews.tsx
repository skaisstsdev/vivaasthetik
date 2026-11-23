'use client';

import { useId, useState } from 'react';
import { reviews, GOOGLE_RATING } from '@/data/reviews';
import { PRACTICE } from '@/lib/seo';
import { btnOutlineDark } from '@/lib/ui';

type Loc = 'de' | 'ru';

const copy = {
  de: {
    eyebrow: 'Google Bewertungen',
    title: 'Was unsere Patientinnen sagen',
    summary: (n: number) => `${n} Bewertungen bei Google`,
    all: 'Alle Bewertungen auf Google',
    leave: 'Bewertung hinterlassen',
    readMore: 'Mehr lesen',
    readLess: 'Weniger',
    translated: (from: string) => `Aus dem ${from}, übersetzt von Google`,
    langName: { de: 'Deutschen', ru: 'Russischen' },
    stars: 'von 5 Sternen',
    note: 'Die Bewertungen stammen aus unserem Google-Profil und wurden nicht verändert. Google prüft nicht, ob eine Bewertung von einer Patientin oder einem Patienten stammt; wir haben keinen Einfluss darauf. Übersetzungen erstellt Google automatisch.',
  },
  ru: {
    eyebrow: 'Отзывы Google',
    title: 'Что говорят наши пациенты',
    summary: (n: number) => `${n} отзывов в Google`,
    all: 'Все отзывы в Google',
    leave: 'Оставить отзыв',
    readMore: 'Читать полностью',
    readLess: 'Свернуть',
    translated: (from: string) => `Перевод Google (оригинал на ${from})`,
    langName: { de: 'немецком', ru: 'русском' },
    stars: 'из 5 звёзд',
    note: 'Отзывы взяты из нашего профиля Google без изменений. Google не проверяет, оставлен ли отзыв пациентом, и мы на это не влияем. Переводы выполняет Google автоматически.',
  },
};

// Отзыв длиннее этого порога сворачивается до 5 строк с кнопкой «Читать полностью»
const LONG = 230;

// Острые тонкие звёзды в золоте логотипа — только возле общей оценки
const STAR_POINTS = '12.00,1.00 14.41,8.68 22.46,8.60 15.90,13.27 18.47,20.90 12.00,16.10 5.53,20.90 8.10,13.27 1.54,8.60 9.59,8.68';

function Stars({ label }: { label: string }) {
  const gid = useId();
  return (
    <span className="inline-flex items-center gap-1.5" role="img" aria-label={`5 ${label}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
          <defs>
            <linearGradient id={`${gid}-${i}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#b8860b" />
              <stop offset="0.5" stopColor="#e8cf86" />
              <stop offset="1" stopColor="#b8860b" />
            </linearGradient>
          </defs>
          <polygon points={STAR_POINTS} fill={`url(#${gid}-${i})`} strokeLinejoin="miter" />
        </svg>
      ))}
    </span>
  );
}

export default function GoogleReviews({ loc }: { loc: Loc }) {
  const c = copy[loc];
  const items = reviews.filter((r) => !r.hidden);
  // Открытый отзыв один; пока он открыт, бегущая лента стоит на месте
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section id="bewertungen" aria-labelledby="reviews-title" className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Заголовок и общая оценка */}
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">{c.eyebrow}</p>
          <h2 id="reviews-title" className="text-4xl md:text-5xl font-light text-gray-900 mb-8">
            {c.title}
          </h2>
          <a
            href={PRACTICE.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2 group"
          >
            <span className="text-4xl text-gray-900">{GOOGLE_RATING.score.toFixed(1).replace('.', ',')}</span>
            <Stars label={c.stars} />
            <span className="text-gray-600 group-hover:text-gray-900 transition-colors underline underline-offset-4 decoration-gray-300">
              {c.summary(GOOGLE_RATING.count)}
            </span>
          </a>
        </div>
      </div>

      {/* Бегущая лента отзывов, как раньше */}
      <div className="flex gap-12 marquee-host overflow-hidden w-full px-4 items-start">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
            className={`flex gap-12 w-max flex-shrink-0 items-start animate-marquee`}
          >
            {items.map((r) => {
              const text = r.text[loc];
              const long = text.length > LONG;
              const open = openId === r.id;
              const translated = r.lang !== loc ? c.translated(c.langName[r.lang]) : null;
              return (
                <div key={r.id} className="flex flex-col gap-6 w-[300px] md:w-[400px] whitespace-normal">
                  <p className={`text-gray-600 leading-relaxed ${long && !open ? 'line-clamp-5' : ''}`}>{text}</p>
                  {long && (
                    <button
                      type="button"
                      tabIndex={copy === 1 ? -1 : undefined}
                      onClick={() => setOpenId(open ? null : r.id)}
                      aria-expanded={open}
                      className="self-start -mt-3 text-xs uppercase tracking-[0.2em] font-medium text-[#8a6327] hover:text-gray-900 transition-colors"
                    >
                      {open ? c.readLess : c.readMore}
                    </button>
                  )}
                  <div className="mt-auto">
                    <p className="text-sm font-medium text-gray-900 tracking-wide">— {r.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Google{translated ? ` · ${translated}` : ''}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Ссылки под отзывами и пояснение */}
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-16">
          <a href={PRACTICE.reviewUrl} target="_blank" rel="noopener noreferrer" className={btnOutlineDark}>
            {c.leave}
          </a>
          <a
            href={PRACTICE.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center h-11 text-xs md:text-sm uppercase tracking-[0.2em] font-medium text-gray-800 hover:text-[#8a6327] transition-colors"
          >
            {c.all} →
          </a>
        </div>

        <p className="max-w-3xl mx-auto mt-12 text-xs text-gray-500 leading-relaxed text-center">{c.note}</p>
      </div>
    </section>
  );
}
