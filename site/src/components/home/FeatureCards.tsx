'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { useState, useEffect } from 'react';

type Card = {
  title: string;
  text: string;
  link: string;
  href: string;
  imageSrc: string;
};

export default function FeatureCards() {
  const t = useTranslations('FeatureCards');
  
  const [activeCard, setActiveCard] = useState<number | null>(null);
  
  useEffect(() => {
    const handleOutsideClick = () => setActiveCard(null);
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const cards: Card[] = [
    {
      title: t('servicesTitle'),
      text: t('servicesText'),
      link: t('servicesLink'),
      href: '/services',
      imageSrc: '/feature_1.webp',
    },
    {
      title: t('clinicTitle'),
      text: t('clinicText'),
      link: t('clinicLink'),
      href: '?info=clinic',
      imageSrc: '/feature_2.webp',
    },
    {
      title: t('techTitle'),
      text: t('techText'),
      link: t('techLink'),
      href: '?info=technology',
      imageSrc: '/feature_3.webp',
    },
  ];

  return (
    <section className="py-24 px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card, i) => {
          const isActive = activeCard === i;
          
          return (
            <div 
              key={i}
              className="relative group block w-full text-left bg-white p-10 hover:shadow-xl transition-shadow duration-300 overflow-hidden min-h-[400px] flex flex-col justify-end cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setActiveCard(isActive ? null : i);
              }}
              onMouseEnter={() => setActiveCard(i)}
              onMouseLeave={() => setActiveCard(null)}
            >
              {/* Background Image */}
              <Image 
                src={card.imageSrc} 
                alt={card.title} 
                fill 
                className={`object-cover transition-transform duration-700 z-0 ${isActive ? 'scale-105' : 'group-hover:scale-105'}`} 
              />
              
              {/* Dark Overlay (always partially dark so text is readable, gets darker on hover) */}
              <div className={`absolute inset-0 z-0 transition-colors duration-500 ${isActive ? 'bg-black/70' : 'bg-black/30 group-hover:bg-black/70'}`} />

              <div className="relative z-10 flex flex-col h-full w-full text-white">
                {/* Number */}
                <p className="text-xs font-mono mb-6 transition-colors duration-500 text-white/80">
                  {String(i + 1).padStart(2, '0')}
                </p>

                {/* Title */}
                <h3 className={`text-2xl md:text-xl lg:text-2xl font-light text-white mb-4 transition-all duration-500 transform ${isActive ? '-translate-y-4' : 'group-hover:-translate-y-4'}`}>
                  {card.title}
                </h3>

                {/* Hover Text and Link Container */}
                <div className={`overflow-hidden transition-all duration-500 ease-out ${isActive ? 'opacity-100 max-h-[300px]' : 'opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-[300px]'}`}>
                  <p className="text-white/90 text-sm leading-relaxed mb-8 line-clamp-5">
                    {card.text}
                  </p>
                  
                  <Link
                    href={card.href}
                    scroll={false}
                    className="inline-block w-full py-3 border border-white text-white hover:bg-white hover:text-gray-900 transition-colors text-sm font-medium tracking-wide uppercase text-center backdrop-blur-sm"
                  >
                    {card.link}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
