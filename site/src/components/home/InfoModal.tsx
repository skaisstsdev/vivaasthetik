'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function InfoModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  
  const [infoType, setInfoType] = useState<string | null>(null);

  useEffect(() => {
    setInfoType(searchParams.get('info'));
  }, [searchParams]);

  const close = () => {
    // Remove ?info parameter but keep other params
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('info');
    const newQuery = newParams.toString();
    router.push(pathname + (newQuery ? `?${newQuery}` : ''), { scroll: false });
  };

  const tClinic = useTranslations('Clinic');
  const tTech = useTranslations('Technology');

  if (!infoType || (infoType !== 'clinic' && infoType !== 'technology')) {
    return null;
  }

  const isClinic = infoType === 'clinic';
  const features = tTech.raw('features') as Array<{ title: string; description: string }>;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 sm:p-6 md:p-12 bg-black/20 backdrop-blur-sm animate-in fade-in duration-500 ease-out">
      <div className="bg-slate-900/80 backdrop-blur-3xl border border-white/10 w-full max-w-5xl max-h-[95vh] flex flex-col rounded-xl shadow-2xl relative overflow-hidden text-white animate-in zoom-in-95 duration-500 ease-out">
        
        {/* Close Button */}
        <button 
          onClick={close}
          className="absolute top-6 right-6 p-2 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full z-50 border border-white/10 shadow-sm"
        >
          <X size={24} strokeWidth={1.5} />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 w-full px-6 md:px-16 py-16 md:py-24">
          
          {isClinic ? (
            <div className="max-w-3xl mx-auto flex flex-col gap-10">
              <div className="flex flex-col border-b border-white/10 pb-8">
                <h2 className="text-3xl md:text-4xl font-light text-white mb-4">{tClinic('title')}</h2>
                <h3 className="text-xl md:text-2xl font-light text-white/70 leading-relaxed">{tClinic('subtitle')}</h3>
              </div>
              
              <div className="flex flex-col gap-6 text-base md:text-lg text-white font-light leading-relaxed">
                <p>{tClinic('p1')}</p>
                <p>{tClinic('p2')}</p>
                <p>{tClinic('p3')}</p>
                <p>{tClinic('p4')}</p>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto flex flex-col gap-12 text-white">
              <div className="flex flex-col border-b border-white/10 pb-8">
                <h2 className="text-3xl md:text-4xl font-light text-white mb-4">{tTech('title')}</h2>
                <h3 className="text-xl md:text-2xl font-light text-white/70 leading-relaxed mb-6">{tTech('subtitle')}</h3>
                <p className="text-base md:text-lg text-white font-light leading-relaxed">{tTech('intro')}</p>
              </div>
              
              <div className="flex flex-col gap-8">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row gap-4 md:gap-6 group">
                    <div className="text-white/40 font-mono text-xl md:text-2xl tracking-widest pt-1 w-10 flex-shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="flex flex-col gap-2">
                      <h4 className="text-xl font-medium text-white transition-colors">
                        {feature.title}
                      </h4>
                      <p className="text-white leading-relaxed text-base md:text-lg font-light">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white/5 p-8 rounded-sm border border-white/10 mt-4">
                <p className="text-base md:text-lg text-white/90 font-light leading-relaxed mb-6">
                  {tTech('outro')}
                </p>
                <button 
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams.toString());
                    newParams.delete('info');
                    newParams.set('booking', 'true');
                    router.push(pathname + '?' + newParams.toString(), { scroll: false });
                  }}
                  className="px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 transition-colors uppercase tracking-widest text-sm inline-block"
                >
                  {locale === 'de' ? 'Beratung vereinbaren' : 'Записаться на консультацию'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
