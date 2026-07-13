'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/routing';
import { ServiceContent } from '@/data/services/types';
import BookNowButton from '@/components/booking/BookNowButton';
import { X } from 'lucide-react';
import Image from 'next/image';

interface ServicesClientProps {
  services: ServiceContent[];
  loc: 'de' | 'ru';
}

export default function ServicesClient({ services, loc }: ServicesClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const serviceParam = searchParams.get('service');
  const selectedService = services.find(s => s.slug === serviceParam) || null;

  const openModal = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('service', slug);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('service');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 max-w-5xl mx-auto">
        {services.map((service, idx) => {
          const isActive = activeCard === service.slug;
          
          return (
            <div 
              key={service.slug} 
              className="relative group overflow-hidden rounded-sm aspect-square bg-gray-900 flex flex-col cursor-pointer"
              onClick={() => setActiveCard(isActive ? null : service.slug)}
            >
              {/* Image Background */}
              {service.imageSrc && (
                <div className="absolute inset-0 z-0">
                  <Image 
                    src={service.imageSrc} 
                    alt={service.title[loc]} 
                    fill 
                    className={`object-cover transition-transform duration-700 group-hover:scale-105 ${isActive ? 'scale-105' : ''}`} 
                  />
                  {/* Darkens fully on hover */}
                  <div className={`absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-colors duration-500 ${isActive ? 'bg-black/70' : ''}`} />
                  {/* Gradient for bottom title, fades out slightly on hover */}
                  <div className={`absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-500 group-hover:opacity-0 ${isActive ? 'opacity-0' : 'opacity-100'}`} />
                </div>
              )}

              {/* Content Wrapper */}
              <div className="relative z-10 flex flex-col h-full p-5 md:p-8 text-white">
                {/* Top Area: Number */}
                <div className="flex justify-between items-start">
                  <div className={`text-sm font-mono transition-colors group-hover:text-white ${isActive ? 'text-white' : 'text-white/70'}`}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                </div>

                {/* Title (visible by default, fades out on hover) */}
                <div className={`absolute left-5 md:left-8 right-5 md:right-8 bottom-5 md:bottom-8 transition-all duration-500 pointer-events-none group-hover:opacity-0 group-hover:translate-y-4 ${isActive ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                  <h3 className="text-2xl md:text-3xl font-light text-white">
                    {service.title[loc]}
                  </h3>
                </div>

                {/* Hover revealed content */}
                <div className={`flex-grow flex flex-col pt-4 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto ${isActive ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                  <p className="text-white/90 text-sm md:text-base leading-relaxed mb-4 line-clamp-5 md:line-clamp-6">
                    {service.shortDescription[loc]}
                  </p>
                  <div className="mt-auto flex flex-col gap-2 md:gap-3 flex-shrink-0">
                    <button 
                      onClick={(e) => { e.stopPropagation(); openModal(service.slug); }}
                      className="py-3 border border-white text-white hover:bg-white hover:text-gray-900 transition-colors text-sm tracking-wide uppercase"
                    >
                      {loc === 'de' ? 'Mehr erfahren' : 'Узнать больше'}
                    </button>
                    <div onClick={(e) => e.stopPropagation()}>
                      <BookNowButton 
                        serviceSlug={service.slug}
                        className="py-3 bg-white text-gray-900 hover:bg-gray-100 uppercase tracking-wide text-sm font-medium text-center w-full block"
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
            className="bg-black/70 backdrop-blur-3xl border border-white/10 w-full max-w-4xl h-[90vh] md:max-h-[85vh] flex flex-col rounded-xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 overflow-hidden text-white"
            onClick={e => e.stopPropagation()}
          >
            {/* Fixed Close Button inside Modal */}
            <button 
              onClick={closeModal}
              className="absolute top-6 right-6 p-2 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full z-50 border border-white/10 shadow-sm"
            >
              <X size={24} strokeWidth={1.5} />
            </button>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 w-full">
              
              {/* Header Area */}
              <div className="p-8 md:pt-16 md:pb-12 text-center border-b border-white/10">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-white leading-tight pr-12 md:pr-0">
                  {selectedService.title[loc]}
                </h2>
              </div>

              {/* Content Area */}
              <div className="p-8 md:p-16">
                <div 
                  className="prose prose-lg md:prose-xl prose-invert prose-headings:font-light prose-h3:text-3xl prose-h4:text-2xl max-w-none mx-auto"
                  dangerouslySetInnerHTML={{ __html: selectedService.content[loc] }}
                />
              </div>

              {/* Action Area */}
              <div className="p-8 md:p-16 bg-white/5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <p className="text-white/90 font-medium text-lg">
                  {loc === 'de' ? 'Interesse an dieser Behandlung?' : 'Заинтересовала эта процедура?'}
                </p>
                <div onClick={closeModal}>
                  <BookNowButton 
                    serviceSlug={selectedService.slug}
                    className="w-full sm:w-auto px-10 py-5 bg-white text-gray-900 hover:bg-gray-200 transition-colors uppercase tracking-widest text-sm font-medium text-center inline-block shadow-lg"
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
