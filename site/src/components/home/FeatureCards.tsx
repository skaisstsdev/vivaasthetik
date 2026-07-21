'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';

type Card = {
  title: string;
  text: string;
  link: string;
  href: string;
};

export default function FeatureCards() {
  const t = useTranslations('FeatureCards');

  const cards: Card[] = [
    {
      title: t('servicesTitle'),
      text: t('servicesText'),
      link: t('servicesLink'),
      href: '/services',
    },
    {
      title: t('clinicTitle'),
      text: t('clinicText'),
      link: t('clinicLink'),
      href: '?info=clinic',
    },
    {
      title: t('techTitle'),
      text: t('techText'),
      link: t('techLink'),
      href: '?info=technology',
    },
  ];

  return (
    <section className="py-24 px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card, i) => (
            <Link
              key={i}
              href={card.href}
              scroll={false}
              className="group flex flex-col w-full text-left bg-white p-10 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Number */}
              <p className="text-xs font-mono mb-6 text-gold font-medium">
                {String(i + 1).padStart(2, '0')}
              </p>
              {/* Title */}
              <h3 className="text-2xl md:text-xl lg:text-2xl font-light text-gray-900 mb-4">
                {card.title}
              </h3>
              {/* Text */}
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                {card.text}
              </p>
              {/* Link */}
              <span className="flex items-center gap-2 text-sm text-gray-900 font-medium group-hover:gap-3 transition-all mt-auto">
                {card.link}
                <ArrowRight size={14} />
              </span>
            </Link>
        ))}
      </div>
    </section>
  );
}
