'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/routing';
import { ServiceContent } from '@/data/services/types';
import BookNowButton from '@/components/booking/BookNowButton';
import { X } from 'lucide-react';

interface ServicesClientProps {
  services: ServiceContent[];
  loc: 'de' | 'ru';
}

export default function ServicesClient({ services, loc }: ServicesClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [selectedServiceSlug, setSelectedServiceSlug] = useState<string | null>(null);

  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam) {
      setSelectedServiceSlug(serviceParam);
    }
  }, [searchParams]);

  const selectedService = services.find(s => s.slug === selectedServiceSlug) || null;

  const openModal = (slug: string) => {
    setSelectedServiceSlug(slug);
  };

  const closeModal = () => {
    setSelectedServiceSlug(null);
    window.history.replaceState(null, '', pathname);
  };

  const [activeCard, setActiveCard] = useState<string | null>(null);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (selectedService) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedService]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
        {services.map((service, idx) => {
          const isActive = activeCard === service.slug;
          
          return (
            <div 
              key={service.slug} 
              className="relative group overflow-hidden aspect-square flex flex-col cursor-pointer transition-all duration-500"
              style={{
                background: 'linear-gradient(135deg, #061220 0%, #0d2a6e 60%, #1a3a8f 100%)',
                boxShadow: isActive 
                  ? 'inset 0 0 0 1.5px #cda557, 0 20px 60px rgba(0,0,0,0.4)' 
                  : '0 4px 24px rgba(0,0,0,0.2)'
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'inset 0 0 0 1.5px #cda557, 0 20px 60px rgba(0,0,0,0.3)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.2)';
                }
              }}
              onClick={() => setActiveCard(isActive ? null : service.slug)}
            >
              {/* Content Wrapper */}
              <div className="relative z-10 flex flex-col h-full p-6 md:p-10 text-white">
                {/* Top: Number */}
                <div className="flex justify-between items-start mb-auto">
                  <div className="text-sm font-mono tracking-widest text-white/70">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                </div>

                {/* Center: Title (visible by default) */}
                <div className={`absolute inset-0 flex items-center justify-center p-4 md:p-8 transition-all duration-500 pointer-events-none ${isActive ? 'opacity-0 scale-95' : 'opacity-100 scale-100 group-hover:opacity-0 group-hover:scale-95'}`}>
                  <h3 
                    className="text-2xl md:text-3xl lg:text-4xl text-center leading-tight text-white/90 break-words hyphens-auto w-full px-2"
                    style={{ fontFamily: "var(--font-bodoni), Georgia, serif", fontWeight: 300 }}
                  >
                    {service.title[loc]}
                  </h3>
                </div>

                {/* Hover revealed content */}
                <div className={`flex-grow flex flex-col justify-end transition-all duration-500 ease-out ${isActive ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-6 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto'}`}>
                  <h3 
                    className="text-2xl md:text-3xl mb-4 text-white"
                    style={{ fontFamily: "var(--font-bodoni), Georgia, serif", fontWeight: 300 }}
                  >
                    {service.title[loc]}
                  </h3>
                  <p className="text-white/70 text-sm md:text-base leading-relaxed mb-6 line-clamp-4">
                    {service.shortDescription[loc]}
                  </p>
                  <div className="flex flex-col gap-2 md:gap-3 flex-shrink-0">
                    <button 
                      onClick={(e) => { e.stopPropagation(); openModal(service.slug); }}
                      className="py-3 border border-[#c9a84c] text-[#f5e198] hover:bg-[#c9a84c] hover:text-white transition-all duration-300 text-sm tracking-wide uppercase"
                    >
                      {loc === 'de' ? 'Mehr erfahren' : 'Узнать больше'}
                    </button>
                    <div onClick={(e) => e.stopPropagation()}>
                      <BookNowButton 
                        serviceSlug={service.slug}
                        className="py-3 bg-white/10 border border-white/20 text-white hover:bg-white hover:text-gray-900 uppercase tracking-wide text-sm font-medium text-center w-full block transition-all duration-300"
                      >
                        {loc === 'de' ? 'Termin buchen' : 'Записаться'}
                      </BookNowButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedService && (
        <div 
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 sm:p-6 md:p-12 bg-black/20 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div 
            className="bg-white w-full max-w-4xl h-[90vh] md:max-h-[85vh] flex flex-col rounded-xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-500 ease-out overflow-hidden text-gray-900"
            onClick={e => e.stopPropagation()}
          >
            {/* Fixed Close Button inside Modal */}
            <button 
              onClick={closeModal}
              className="absolute top-6 right-6 p-2 text-gray-500 hover:text-gray-900 transition-colors bg-gray-100 hover:bg-gray-200 rounded-full z-50 border border-gray-200 shadow-sm"
            >
              <X size={24} strokeWidth={1.5} />
            </button>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 w-full">
              
              {/* Header Area */}
              <div className="p-8 md:pt-16 md:pb-12 text-center border-b border-gray-200">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 leading-tight pr-12 md:pr-0">
                  {selectedService.title[loc]}
                </h2>
              </div>

              {/* Content Area */}
              <div className="p-8 md:p-16">
                <div 
                  className="prose prose-lg md:prose-xl prose-headings:font-light prose-h3:text-3xl prose-h4:text-2xl max-w-none mx-auto text-gray-800"
                  dangerouslySetInnerHTML={{ __html: selectedService.content[loc] }}
                />
              </div>

              {/* Action Area */}
              <div className="p-8 md:p-16 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                <p className="text-gray-700 font-medium text-lg">
                  {loc === 'de' ? 'Interesse an dieser Behandlung?' : 'Заинтересовала эта процедура?'}
                </p>
                <div onClick={closeModal}>
                  <BookNowButton 
                    serviceSlug={selectedService.slug}
                    className="w-full sm:w-auto px-10 py-5 bg-black text-white hover:bg-gray-800 transition-colors uppercase tracking-widest text-sm font-medium text-center inline-block shadow-lg"
                  >
                    {loc === 'de' ? 'Termin buchen' : 'Записаться на прием'}
                  </BookNowButton>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      )}
    </>
  );
}
