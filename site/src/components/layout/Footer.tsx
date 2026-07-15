'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';

export default function Footer() {
  const t = useTranslations('Footer');
  const nav = useTranslations('Navigation');
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & Address */}
          <div>
            <div className="mb-6">
              <img src="/logo.png" alt="VIVA Ästhetik" className="w-14 md:w-16 h-auto brightness-0" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">{t('addressTitle')}</p>
            <p className="text-sm text-gray-500">{t('address')}</p>
          </div>

          {/* Contact & Social */}
          <div>
            <p className="text-sm font-medium text-gray-900 mb-4">{t('contactTitle')}</p>
            <ul className="flex flex-col gap-2 mb-6">
              <li>
                <a href={`tel:${t('phone').replace(/\\s/g, '')}`} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  {t('phone')}
                </a>
              </li>
              <li>
                <a href={`mailto:${t('email')}`} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  {t('email')}
                </a>
              </li>
            </ul>

            <p className="text-sm font-medium text-gray-900 mb-3">{t('socialTitle')}</p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/viva_asthetik?igsh=bW5vYnB2dDhmeGdo" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Instagram</a>
              <a href="https://wa.me/491799004902" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">WhatsApp</a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-sm font-medium text-gray-900 mb-4">{nav('home')}</p>
            <ul className="flex flex-col gap-3">
              {[
                { href: '/services' as const, label: nav('services') },
                { href: '/about' as const, label: nav('about') },
                { href: '/faq' as const, label: nav('faq') },
                { href: '/tips' as const, label: nav('tips') },
                { href: '/contact' as const, label: nav('contact') },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-sm font-medium text-gray-900 mb-4">{t('legalTitle')}</p>
            <ul className="flex flex-col gap-3">
              {[
                { href: '/impressum' as const, label: t('impressum') },
                { href: '/datenschutz' as const, label: t('datenschutz') },
                { href: '/agb' as const, label: t('agb') },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 pt-6 flex justify-between items-center">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} VIVA Ästhetik. {t('rights')}
          </p>
          <Link href="/admin" className="text-xs text-gray-400 hover:text-gray-900 transition-colors">
            {t('admin')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
