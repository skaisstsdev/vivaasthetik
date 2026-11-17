'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import Image from 'next/image';
import { useState, useEffect, useTransition } from 'react';
import { Menu, X } from 'lucide-react';
import { useBooking } from '@/context/BookingContext';

export default function Navbar() {
  const t = useTranslations('Navigation');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { openBooking } = useBooking();

  const switchLocale = (locale: 'de' | 'ru') => {
    startTransition(() => {
      router.replace(pathname, { locale, scroll: false });
    });
  };

  // Названия роутов и переводы для меню
  const navLinks = [
    { href: '/' as const, label: t('home') },
    { href: '/services' as const, label: t('services') },
    { href: '/prices' as const, label: t('prices') },
    { href: '/about' as const, label: t('about') },
    { href: '/booking' as const, label: t('booking') },
    { href: '/faq' as const, label: t('faq') },
    { href: '/tips' as const, label: t('tips') },
    { href: '/contact' as const, label: t('contact') },
  ];

  // Обработчик скролла для изменения стиля хедера
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Блокировка скролла, если открыто меню
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      {/* 
        Сам Header
        - Прозрачный в самом верху (текст белый для контраста с Hero).
        - При скролле: белый фон, blur, текст становится черным, появляется бордер.
      */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 border-b py-5 ${
          isScrolled || isMenuOpen
            ? 'bg-white/90 backdrop-blur-md border-gray-100 text-gray-900' 
            : 'bg-transparent border-transparent text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
          
          {/* Левая часть: Бургер меню (показываем всегда, как просил пользователь) */}
          <div className="flex-1">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="group flex items-center gap-3 hover:opacity-70 transition-opacity"
            >
              {isMenuOpen ? <X size={28} strokeWidth={1.5} /> : <Menu size={28} strokeWidth={1.5} />}
              <span className="text-sm tracking-widest uppercase hidden md:block">
                Menu
              </span>
            </button>
          </div>

          {/* Центр: Логотип */}
          <div className="flex-1 flex justify-center">
          <Link 
              href="/" 
              onClick={() => setIsMenuOpen(false)}
              className="relative w-[180px] h-[40px] md:w-[220px] md:h-[50px]"
            >
              <div
                className={`w-full h-full transition-all duration-300 ${
                  isScrolled || isMenuOpen 
                    ? 'bg-gradient-to-tr from-[#8a6327] via-[#cca343] to-[#8a6327] drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]' 
                    : 'bg-gradient-to-tr from-[#a67c00] via-[#fceab8] to-[#a67c00]'
                }`}
                style={{
                  maskImage: 'url(/images/viva_logo_final.png)',
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskImage: 'url(/images/viva_logo_final.png)',
                  WebkitMaskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                }}
              />
            </Link>
          </div>

          {/* Правая часть: Переключатель языков и кнопка Записаться */}
          <div className="flex-1 flex items-center justify-end gap-6">
            <div className={`flex items-center gap-2 text-xs font-medium tracking-widest transition-opacity duration-300 ${isScrolled || isMenuOpen ? 'text-gray-500' : 'text-white/70'} ${isPending ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              <button onClick={() => switchLocale('de')} className={`${isScrolled || isMenuOpen ? 'hover:text-gray-900' : 'hover:text-white'} transition-colors`}>DE</button>
              <span className="font-light">/</span>
              <button onClick={() => switchLocale('ru')} className={`${isScrolled || isMenuOpen ? 'hover:text-gray-900' : 'hover:text-white'} transition-colors`}>RU</button>
            </div>

            <Link
              href="/booking"
              onClick={() => setIsMenuOpen(false)}
              className={`hidden sm:inline-flex items-center h-11 whitespace-nowrap text-xs tracking-[0.2em] font-medium uppercase px-8 border transition-colors duration-300 ${
                isScrolled || isMenuOpen
                  ? 'border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-white'
                  : 'border-[#c9a84c] text-[#f5e198] hover:bg-[#c9a84c] hover:text-white'
              }`}
            >
              {t('bookCta')}
            </Link>
          </div>

        </div>
      </nav>

      {/* Полноэкранное меню, открывается по бургеру */}
      <div 
        className={`fixed inset-0 bg-white transition-all duration-500 ease-out flex flex-col justify-center px-8 md:px-24 pt-[12vh] pb-[4vh] overflow-y-auto ${
          isMenuOpen ? 'opacity-100 pointer-events-auto z-40' : 'opacity-0 pointer-events-none -z-10 invisible'
        }`}
      >
        <ul className="flex flex-col gap-[1.4vh] max-w-7xl mx-auto w-full">
          {navLinks.map((link, index) => (
            <li key={link.href} className="flex">
              <Link
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-1 text-[clamp(1.6rem,min(5.8vh,10vw),4rem)] leading-tight font-light text-gray-900 hover:text-gray-600 transition-all transform ${
                  isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
                style={{ 
                  transitionDelay: `${index * 50}ms`,
                  transitionDuration: '500ms',
                  fontFamily: 'var(--font-bodoni), Georgia, serif',
                  wordBreak: 'break-word'
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
