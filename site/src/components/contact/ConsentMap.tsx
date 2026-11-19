'use client';

import { useState } from 'react';
import { PRACTICE } from '@/lib/seo';

const copy = {
  de: {
    title: 'Karte von Google Maps',
    text: 'Beim Laden der Karte werden Daten (z. B. Ihre IP-Adresse) an Google übertragen. Die Karte wird erst nach Ihrem Klick geladen.',
    load: 'Karte laden',
    loading: 'Karte wird geladen…',
    open: 'In Google Maps öffnen',
    privacy: 'Details in der Datenschutzerklärung',
    iframeTitle: 'Google Maps: VIVA Ästhetik, Königstor 47, Kassel',
  },
  ru: {
    title: 'Карта Google Maps',
    text: 'При загрузке карты данные (например, ваш IP-адрес) передаются в Google. Карта загрузится только после вашего нажатия.',
    load: 'Загрузить карту',
    loading: 'Карта загружается…',
    open: 'Открыть в Google Maps',
    privacy: 'Подробнее в политике конфиденциальности',
    iframeTitle: 'Google Maps: VIVA Ästhetik, Königstor 47, Kassel',
  },
};

const SRC = 'https://maps.google.com/maps?q=K%C3%B6nigstor%2047,%2034117%20Kassel&t=&z=15&ie=UTF8&iwloc=&output=embed';

// Карта Google грузится только после нажатия кнопки (два клика), пока идёт загрузка видно кружок
export default function ConsentMap({ loc }: { loc: 'de' | 'ru' }) {
  const c = copy[loc];
  const [requested, setRequested] = useState(false);
  const [ready, setReady] = useState(false);

  return (
    <div className="relative h-[420px] lg:h-auto lg:min-h-[420px] bg-gray-100 border border-gray-200">
      {requested && (
        <iframe
          title={c.iframeTitle}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          src={SRC}
          onLoad={() => setReady(true)}
          className={`absolute inset-0 transition-opacity duration-300 ${ready ? 'opacity-100' : 'opacity-0'}`}
        />
      )}

      {!ready && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center gap-5 px-8">
          {requested ? (
            <div role="status" className="flex flex-col items-center gap-4 text-gray-600">
              <span
                aria-hidden="true"
                className="w-10 h-10 rounded-full border-2 border-gray-300 border-t-[#8a6327] animate-spin"
              />
              <span className="text-sm">{c.loading}</span>
            </div>
          ) : (
            <>
              <p className="text-xl text-gray-900">{c.title}</p>
              <p className="max-w-sm text-sm text-gray-600 leading-relaxed">{c.text}</p>
              <button
                type="button"
                onClick={() => setRequested(true)}
                className="h-11 px-8 bg-gray-900 text-white text-xs md:text-sm uppercase tracking-[0.2em] font-medium hover:bg-[#8a6327] transition-colors"
              >
                {c.load}
              </button>
              <a
                href={PRACTICE.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-[0.2em] font-medium text-gray-800 hover:text-[#8a6327] transition-colors"
              >
                {c.open} →
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}
