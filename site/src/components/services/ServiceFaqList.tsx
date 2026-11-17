'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

// Аккордеон как в разделе FAQ: ответ раскрывается плавно, при открытии
// одного вопроса предыдущий закрывается.
export default function ServiceFaqList({ items }: { items: { id: string; q: string; a: string }[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="border-b border-gray-200">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className="border-t border-gray-200">
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${item.id}`}
              className="flex w-full items-start justify-between gap-6 py-6 md:py-7 text-left cursor-pointer"
            >
              <span className="text-lg md:text-xl text-gray-900 leading-snug">{item.q}</span>
              <ChevronDown
                size={22}
                aria-hidden="true"
                className={`mt-1 flex-shrink-0 text-[#8a6327] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <div
              id={`faq-panel-${item.id}`}
              role="region"
              inert={!isOpen}
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="pb-7 pr-10 text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
