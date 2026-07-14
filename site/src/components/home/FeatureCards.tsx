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
  
  // To handle touch devices where hover doesn't exist, we track an "active" card
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
    <section className="py-24 px-6 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {cards.map((card, i) => {
          const isActive = activeCard === i;
          
          return (
            <div 
              key={i}
              className="relative w-full aspect-[4/5] md:aspect-square lg:aspect-[4/5] rounded-[24px] overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-700 bg-slate-100"
              onClick={(e) => {
                e.stopPropagation();
                setActiveCard(isActive ? null : i);
              }}
              onMouseEnter={() => setActiveCard(i)}
              onMouseLeave={() => setActiveCard(null)}
            >
              {/* Image */}
              <Image 
                src={card.imageSrc} 
                alt={card.title} 
                fill 
                className={`object-cover transition-transform duration-700 ${isActive ? 'scale-105' : 'group-hover:scale-105'}`} 
              />
              
              {/* Darkens fully on hover */}
              <div className={`absolute inset-0 transition-colors duration-500 ${isActive ? 'bg-black/70' : 'bg-black/0 group-hover:bg-black/70'}`} />
              
              {/* Gradient for bottom title, fades out slightly on hover */}
              <div className={`absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-500 ${isActive ? 'opacity-0' : 'group-hover:opacity-0 opacity-100'}`} />

              {/* Content Wrapper */}
              <div className="relative z-10 flex flex-col h-full p-6 md:p-8 text-white">
                
                {/* Number */}
                <div className="flex justify-between items-start">
                  <div className={`text-sm font-mono transition-colors ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                </div>

                {/* Title (visible by default, fades out on hover) */}
                <div className={`absolute left-6 md:left-8 right-6 md:right-8 bottom-6 md:bottom-8 transition-all duration-500 pointer-events-none ${isActive ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0 group-hover:opacity-0 group-hover:translate-y-4'}`}>
                  <h3 className="text-2xl md:text-3xl font-light text-white leading-tight drop-shadow-md">
                    {card.title}
                  </h3>
                </div>

                {/* Hover revealed content */}
                <div className={`flex-grow flex flex-col pt-4 transition-all duration-500 ease-out ${isActive ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto'}`}>
                  <p className="text-white/90 text-sm md:text-base leading-relaxed mb-4 line-clamp-6">
                    {card.text}
                  </p>
                  
                  <div className="mt-auto">
                    <Link
                      href={card.href}
                      scroll={false}
                      className="inline-block w-full py-4 border border-white text-white hover:bg-white hover:text-gray-900 transition-colors text-sm font-medium tracking-wide uppercase text-center backdrop-blur-sm"
                    >
                      {card.link}
                    </Link>
                  </div>
                </div>
                
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
