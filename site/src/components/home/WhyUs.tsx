'use client';

import { useTranslations } from 'next-intl';

export default function WhyUs() {
  const t = useTranslations('WhyUs');

  const features = [
    {
      title: t('item1_title'),
      text: t('item1_text'),
      number: '01',
    },
    {
      title: t('item2_title'),
      text: t('item2_text'),
      number: '02',
    },
    {
      title: t('item3_title'),
      text: t('item3_text'),
      number: '03',
    },
  ];

  return (
    <section className="py-24 md:py-32 px-6 md:px-8 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16 md:gap-24">
          
          {/* Left Title */}
          <div className="md:w-1/3">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight sticky top-32">
              {t('title')}
            </h2>
          </div>

          {/* Right Content */}
          <div className="md:w-2/3 flex flex-col gap-12 md:gap-16">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="flex flex-col gap-4 relative pb-12 mb-12 last:mb-0 last:pb-0"
              >
                {/* Custom animated divider (except for last item) */}
                {idx !== features.length - 1 && (
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-100 shimmer-bg" style={{ animationDelay: `${idx * 1.2}s` }}></div>
                )}
                
                <span className="text-sm font-mono text-gray-300 shimmer-text" style={{ animationDelay: `${idx * 1.8 + 1}s` }}>
                  {feature.number}
                </span>
                <h3 className="text-2xl md:text-3xl font-light text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-lg leading-relaxed max-w-2xl">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
