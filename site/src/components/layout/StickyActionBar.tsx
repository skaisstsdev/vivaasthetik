'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import BookNowButton from '@/components/booking/BookNowButton';

const PHONE = '+491799004902';
const WHATSAPP = 'https://wa.me/491799004902';

// Липкая панель быстрых действий на телефоне: позвонить, WhatsApp, записаться.
// На главной появляется только после прокрутки хиро, на остальных страницах видна сразу.
// На странице записи и в админке её нет. Куки-баннер и модальные окна лежат выше панели.
export default function StickyActionBar() {
  const loc = useLocale() as 'de' | 'ru';
  const pathname = usePathname();
  const isHome = pathname === '/';
  const disabled = pathname.startsWith('/booking') || pathname.startsWith('/admin');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > window.innerHeight * 0.6);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [isHome]);

  if (disabled) return null;
  const visible = !isHome || scrolled;

  const label = {
    call: loc === 'de' ? 'Anrufen' : 'Позвонить',
    book: loc === 'de' ? 'Termin' : 'Записаться',
  };
  const small =
    'inline-flex items-center justify-center h-9 uppercase tracking-[0.14em] text-[10.5px] font-medium transition-colors duration-300';

  return (
    <>
      <div
        role="region"
        aria-label={loc === 'de' ? 'Schnellkontakt' : 'Быстрая связь'}
        inert={!visible}
        className={`md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-t border-gray-200 shadow-[0_-6px_24px_rgba(6,18,32,0.08)] transition-transform duration-300 ease-out ${
          visible ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="grid grid-cols-[1fr_1fr_1.3fr] gap-2 px-3 py-1.5">
          <a
            href={`tel:${PHONE}`}
            className={`${small} border border-gray-300 text-gray-800 active:bg-gray-100`}
          >
            {label.call}
          </a>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className={`${small} border border-gray-300 text-gray-800 active:bg-gray-100`}
          >
            WhatsApp
          </a>
          <BookNowButton className={`${small} bg-[#061220] text-white active:bg-[#0d2a6e]`}>
            {label.book}
          </BookNowButton>
        </div>
      </div>
      {/* Чтобы панель не закрывала низ страницы */}
      {visible && <div aria-hidden="true" className="md:hidden h-[3rem]" />}
    </>
  );
}
