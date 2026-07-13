"use client";

import { useState } from 'react';
import { faqData } from '@/data/faq';
import { ServiceLocale } from '@/data/services/types';

export default function FAQClient({ locale }: { locale: ServiceLocale }) {
  const [activeCategory, setActiveCategory] = useState(faqData[0].id);
  const [openItemId, setOpenItemId] = useState<number | null>(null);

  const activeData = faqData.find((c) => c.id === activeCategory);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    setOpenItemId(null); // Reset open item when switching categories
  };

  return (
    <div className="flex flex-col md:flex-row gap-12 lg:gap-24 items-start relative">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-2 md:sticky md:top-32 self-start h-fit">
        {faqData.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`text-left px-4 py-3 rounded-none transition-colors border-l-2 ${
              activeCategory === category.id
                ? 'border-gray-900 text-gray-900 bg-gray-50 font-medium'
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {category.category[locale]}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col gap-6">
        {activeData?.items.map((item) => {
          const isOpen = openItemId === item.id;
          return (
            <div 
              key={item.id} 
              className={`bg-gray-50 border border-gray-100 transition-all duration-300 ${isOpen ? 'bg-white shadow-sm' : 'hover:bg-white'}`}
            >
              <button 
                onClick={() => setOpenItemId(isOpen ? null : item.id)}
                className="flex justify-between items-start font-medium text-lg text-gray-900 outline-none w-full text-left p-6 sm:p-8 cursor-pointer"
              >
                <span className="pr-6">{item.q[locale]}</span>
                <span className={`transition-transform duration-300 flex-shrink-0 mt-1 ${isOpen ? 'rotate-180' : ''}`}>
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </button>
              
              <div 
                className={`grid transition-all duration-300 ease-in-out px-6 sm:px-8 ${
                  isOpen ? 'grid-rows-[1fr] opacity-100 pb-6 sm:pb-8' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-gray-600 leading-relaxed border-t border-gray-100 pt-6">
                    {item.a[locale]}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
