"use client";

import { useState } from 'react';
import { ServiceLocale } from '@/data/services/types';

export default function TipsClient({ locale, initialData }: { locale: ServiceLocale, initialData: any[] }) {
  const [activeCategory, setActiveCategory] = useState(initialData[0].id);

  const activeData = initialData.find((c) => c.id === activeCategory);

  return (
    <div className="flex flex-col md:flex-row gap-12 lg:gap-24 items-start relative">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-2 md:sticky md:top-32 self-start h-fit">
        <h3 className="text-sm font-mono uppercase tracking-[0.2em] text-gray-400 mb-2 px-4">
          {locale === 'de' ? 'Kategorien' : 'Категории'}
        </h3>
        {initialData.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`text-left px-4 py-3 rounded-none transition-colors border-l-2 ${
              activeCategory === category.id
                ? 'border-gray-900 text-gray-900 bg-gray-50 font-medium'
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {category.title[locale]}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col gap-8">
        {activeData && (
          <div className="bg-white">
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6">{activeData.title[locale]}</h2>
            
            {activeData.description && (
              <p className="text-gray-600 mb-10 leading-relaxed text-lg">{activeData.description[locale]}</p>
            )}
            
            <div className="space-y-12">
              {activeData.sections.map((section: any, idx: number) => (
                <div key={idx} className="bg-gray-50 p-6 sm:p-8 border border-gray-100">
                  {(section as any).subtitle && (
                    <h3 className="text-xl font-medium text-gray-900 mb-6 border-b border-gray-200 pb-4">{(section as any).subtitle[locale]}</h3>
                  )}
                  <ul className="space-y-4">
                    {section.items.map((item: any, itemIdx: number) => (
                      <li key={itemIdx} className="text-gray-700 leading-relaxed flex items-start">
                        <span className="text-gray-400 mr-4 mt-1">—</span>
                        <span>{item[locale]}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
