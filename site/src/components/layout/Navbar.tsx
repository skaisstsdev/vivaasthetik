'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useBooking } from '@/context/BookingContext';

export default function Navbar() {
  const t = useTranslations('Navigation');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { openBooking } = useBooking();

  // Названия роутов и переводы для меню
  const navLinks = [
    { href: '/' as const, label: t('home') },
    { href: '/services' as const, label: t('services') },
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

  return (
    <>
      {/* 
        Сам Header
        - Прозрачный в самом верху (текст белый для контраста с Hero).
        - При скролле: белый фон, blur, текст становится черным, появляется бордер.
      */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || isMenuOpen
            ? 'bg-white/90 backdrop-blur-md border-b border-gray-100 text-gray-900 py-4' 
            : 'bg-transparent text-white py-6'
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
              className="text-xl md:text-2xl font-light tracking-[0.2em] uppercase text-center group"
            >
              VIVA <span className="font-medium shimmer-text inline-block" style={{ animationDelay: '1.5s' }}>Ästhetik</span>
            </Link>
          </div>

          {/* Правая часть: Переключатель языков и кнопка Записаться */}
          <div className="flex-1 flex items-center justify-end gap-6">
            <div className={`flex items-center gap-2 text-xs font-medium tracking-widest ${isScrolled || isMenuOpen ? 'text-gray-400' : 'text-white/70'}`}>
              <Link href="/" locale="de" className={`hover:${isScrolled || isMenuOpen ? 'text-gray-900' : 'text-white'} transition-colors`}>DE</Link>
              <span className="font-light shimmer-text" style={{ animationDelay: '3.2s' }}>/</span>
              <Link href="/" locale="ru" className={`hover:${isScrolled || isMenuOpen ? 'text-gray-900' : 'text-white'} transition-colors`}>RU</Link>
            </div>

            <Link
              href="/booking"
              onClick={() => setIsMenuOpen(false)}
              className={`hidden sm:block text-xs tracking-[0.15em] uppercase px-8 py-3 border transition-colors ${
                isScrolled || isMenuOpen
                  ? 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
                  : 'border-white text-white hover:bg-white hover:text-gray-900'
              }`}
            >
              {t('bookCta')}
            </Link>
          </div>

        </div>
      </nav>

      {/* Полноэкранное меню, открывается по бургеру */}
      <div 
        className={`fixed inset-0 z-40 bg-white transition-all duration-500 ease-out flex flex-col justify-center px-8 md:px-24 pt-32 pb-12 overflow-y-auto ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ul className="flex flex-col gap-6 sm:gap-8 max-w-7xl mx-auto w-full">
          {navLinks.map((link, index) => (
            <li key={link.href} className="flex">
              <Link
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-1 text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 hover:text-gray-600 transition-all transform ${
                  isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
                style={{ 
                  transitionDelay: `${index * 50}ms`,
                  transitionDuration: '500ms'
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
