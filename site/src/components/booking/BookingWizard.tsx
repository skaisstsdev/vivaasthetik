'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { servicesData } from '@/data/services';
import { ServiceContent, ServiceLocale } from '@/data/services/types';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { de, ru } from 'date-fns/locale';
import { ArrowRight, X, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import 'react-day-picker/style.css';

type Step = 1 | 2 | 3 | 4;

interface BookingWizardProps {
  inModal?: boolean;
}

export default function BookingWizard({ inModal = false }: BookingWizardProps) {
  const t = useTranslations('Booking');
  const locale = useLocale() as ServiceLocale;
  const searchParams = useSearchParams();
  const timeSlotsRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  
  const { preselectedServiceSlug, closeBooking } = useBooking();

  const [step, setStep] = useState<Step>(1);
  const [selectedService, setSelectedService] = useState<ServiceContent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isFactsExpanded, setIsFactsExpanded] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Initial setup based on Context or URL
  useEffect(() => {
    const serviceSlug = preselectedServiceSlug || searchParams.get('service');
    if (serviceSlug) {
      const service = servicesData.find(s => s.slug === serviceSlug);
      if (service) {
        setSelectedService(service);
        setStep(2); // Skip step 1
      }
    }
  }, [preselectedServiceSlug, searchParams]);

  const handleNext = () => {
    if (step < 4) {
      setStep((s) => (s + 1) as Step);
      setTimeout(() => {
        topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setTimeout(() => {
        timeSlotsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBack = () => setStep(s => Math.max(s - 1, 1) as Step);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting:', { selectedService: selectedService?.slug, selectedDate, selectedTime, name, email, phone, notes });
    setStep(4);
  };

  const timeSlots = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30"];

  // We use this function to render the interactive forms for Step 2, 3, and 4
  const renderStepsTwoToFour = () => (
    <div ref={topRef} className="flex flex-col md:flex-row w-full min-h-full bg-transparent relative">
      {/* Left Column: Quick Facts */}
      {step > 1 && step < 4 && selectedService && selectedService.bookingDetails && (
        <div className={`${step === 3 ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 bg-gray-50 border-r border-gray-100 p-8 md:p-12 flex-col flex-shrink-0`}>
          <h4 className="text-xl font-light text-gray-900 mb-6 border-b border-gray-200 pb-4 pr-12">
            {selectedService.title[locale]}
          </h4>

          <div className="flex flex-col gap-1 mb-8 pb-8 border-b border-gray-200">
            <span className="text-gray-400 uppercase text-xs tracking-wider">{t('cost')}</span>
            <span className="font-semibold text-gray-900">
              {selectedService.bookingDetails.cost[locale]}
            </span>
          </div>
          
          <div className="flex flex-col h-full">
            <div className="text-base text-gray-700 flex-1 flex flex-col min-h-[320px]">
              {(() => {
                const allFacts = [
                  { key: 'duration', label: t('duration'), value: selectedService.bookingDetails.duration[locale] },
                  { key: 'pain', label: t('pain'), value: selectedService.bookingDetails.pain[locale] },
                  { key: 'anesthesia', label: t('anesthesia'), value: selectedService.bookingDetails.anesthesia[locale] },
                  { key: 'recovery', label: t('recovery'), value: selectedService.bookingDetails.recovery[locale] },
                ];
                if (selectedService.bookingDetails.restrictions) allFacts.push({ key: 'restrictions', label: t('restrictions'), value: selectedService.bookingDetails.restrictions[locale] });
                if (selectedService.bookingDetails.onset) allFacts.push({ key: 'onset', label: t('onset'), value: selectedService.bookingDetails.onset[locale] });
                if (selectedService.bookingDetails.durationOfEffect) allFacts.push({ key: 'durationOfEffect', label: t('durationOfEffect'), value: selectedService.bookingDetails.durationOfEffect[locale] });
                if (selectedService.bookingDetails.course) allFacts.push({ key: 'course', label: t('course'), value: selectedService.bookingDetails.course[locale] });

                const FIRST_PAGE_ITEMS = 5;
                const totalPages = allFacts.length > FIRST_PAGE_ITEMS ? 2 : 1;
                const currentPage = isFactsExpanded ? 1 : 0;
                
                const visibleFacts = currentPage === 0 
                  ? allFacts.slice(0, FIRST_PAGE_ITEMS) 
                  : allFacts.slice(FIRST_PAGE_ITEMS);

                return (
                  <>
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300 flex-1 mb-8" key={currentPage}>
                      {visibleFacts.map(fact => (
                        <div key={fact.key} className="flex flex-col gap-1">
                          <span className="text-gray-400 uppercase text-xs tracking-wider">{fact.label}</span>
                          <span>{fact.value}</span>
                        </div>
                      ))}
                    </div>
                    
                    {totalPages > 1 && (
                      <div className="mt-auto pt-4 pb-2 flex justify-between items-center border-t border-gray-200 w-full">
                        <button 
                          onClick={() => setIsFactsExpanded(false)}
                          disabled={!isFactsExpanded}
                          className={`p-2 transition-colors ${!isFactsExpanded ? 'text-gray-200 cursor-not-allowed' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="text-xs text-gray-400 tracking-widest font-mono">
                          0{currentPage + 1} / 0{totalPages}
                        </div>
                        <button 
                          onClick={() => setIsFactsExpanded(true)}
                          disabled={isFactsExpanded}
                          className={`p-2 transition-colors ${isFactsExpanded ? 'text-gray-200 cursor-not-allowed' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Right Column / Full Column */}
      <div className={`w-full ${step === 4 ? 'md:w-full' : 'md:w-2/3'} p-8 md:p-12 flex flex-col flex-grow bg-transparent`}>
        
        {/* Step Indicator */}
        {step < 4 && (
          <div className="flex flex-col border-b border-gray-100 pb-6 mb-8">
            <h3 className="text-sm font-mono uppercase tracking-[0.2em] text-gray-400 mb-2">
              {step === 2 ? t('step2') : t('step3')}
            </h3>
            <h2 className="text-3xl font-light text-gray-900 pr-12">
              {step === 2 ? t('step2_title') : t('step3_title')}
            </h2>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-right-4 duration-500 w-full max-w-lg mx-auto">
              
            <div className="w-full flex justify-center max-w-full overflow-x-auto overflow-y-hidden px-1 py-2">
              <div className="bg-white border border-gray-100 p-4 sm:p-6 shadow-sm rounded-sm w-fit mx-auto min-w-[280px]">
                <DayPicker 
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  locale={locale === 'de' ? de : ru}
                  disabled={[{ before: new Date() }, { dayOfWeek: [0] }]}
                  className="font-sans text-[0.85rem] md:text-[1.05rem]"
                  style={{ 
                    '--rdp-day-width': 'min(11vw, 44px)', 
                    '--rdp-day-height': 'min(11vw, 44px)',
                    '--rdp-day_button-width': 'min(11vw, 44px)',
                    '--rdp-day_button-height': 'min(11vw, 44px)' 
                  } as React.CSSProperties}
                  modifiersClassNames={{
                    selected: "bg-gray-900 text-white font-medium hover:bg-gray-800 rounded-sm",
                    today: "font-semibold text-gray-900 bg-gray-50 rounded-sm",
                  }}
                />
              </div>
            </div>

            <div ref={timeSlotsRef} className="flex flex-col gap-6 w-full">
              <h4 className="font-medium text-gray-900 border-b border-gray-100 pb-4 text-center capitalize">
                {selectedDate 
                  ? format(selectedDate, 'EEEE, d. MMMM', { locale: locale === 'de' ? de : ru })
                  : (locale === 'de' ? 'Zeit auswählen' : 'Выберите время')}
              </h4>
              
              <div className={`grid grid-cols-2 gap-4 transition-all duration-300 ${!selectedDate ? 'opacity-30 pointer-events-none grayscale' : ''}`}>
                {timeSlots.map(time => (
                  <button
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    className={`p-4 border text-sm md:text-base transition-colors rounded-sm tracking-wide ${
                      selectedTime === time 
                        ? 'border-gray-900 bg-gray-900 text-white shadow-sm' 
                        : 'border-gray-200 hover:border-gray-400 text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
              
              {!selectedDate && (
                <p className="text-sm text-center text-gray-400 mt-4">
                  {locale === 'de' ? 'Bitte wählen Sie zuerst ein Datum' : 'Пожалуйста, сначала выберите дату'}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-gray-100 w-full">
              <button 
                onClick={handleBack}
                className="w-full sm:w-auto px-6 sm:px-8 py-4 border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors uppercase tracking-widest text-sm"
              >
                {t('btn_back')}
              </button>
              <button 
                onClick={handleNext}
                disabled={!selectedDate || !selectedTime}
                className="w-full sm:w-auto px-6 sm:px-8 py-4 bg-gray-900 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors uppercase tracking-widest text-sm"
              >
                {t('btn_next')}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col gap-6 w-full max-w-2xl">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">{t('form_name')}</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="border border-gray-300 p-3 outline-none focus:border-gray-900 transition-colors" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">{t('form_email')}</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="border border-gray-300 p-3 outline-none focus:border-gray-900 transition-colors" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">{t('form_phone')}</label>
                <input 
                  type="tel" 
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="border border-gray-300 p-3 outline-none focus:border-gray-900 transition-colors" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">{t('form_notes')}</label>
                <textarea 
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="border border-gray-300 p-3 outline-none focus:border-gray-900 transition-colors h-32 resize-none" 
                ></textarea>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-gray-100 w-full">
              <button 
                type="button"
                onClick={handleBack}
                className="w-full sm:w-auto px-6 sm:px-8 py-4 border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors uppercase tracking-widest text-sm"
              >
                {t('btn_back')}
              </button>
              <button 
                type="submit"
                className="w-full sm:w-auto px-6 sm:px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 transition-colors uppercase tracking-widest text-sm"
              >
                {t('btn_submit')}
              </button>
            </div>
          </form>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="flex flex-col items-center justify-center text-center py-20 animate-in zoom-in-95 duration-500 h-full">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8 border border-gray-100">
              <svg className="w-12 h-12 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">{t('success_title')}</h2>
            <p className="text-gray-500 text-lg max-w-md leading-relaxed mb-12">
              {t('success_text')}
            </p>
            {inModal ? (
              <button 
                onClick={closeBooking}
                className="px-10 py-5 bg-gray-900 text-white uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors"
              >
                {locale === 'de' ? 'Schließen' : 'Закрыть'}
              </button>
            ) : (
              <button 
                onClick={() => window.location.href = '/'}
                className="px-10 py-5 bg-gray-900 text-white uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors"
              >
                {locale === 'de' ? 'Zur Startseite' : 'На главную'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // If the wizard is rendered INSIDE the global modal (e.g. from a BookNowButton on another page)
  if (inModal) {
    if (step === 1) {
      // Very unlikely since openBooking sets step=2 with preselected, but fallback just in case
      return (
        <div className="p-8 md:p-12">
          <div className="flex flex-col border-b border-gray-100 pb-6 mb-8">
            <h3 className="text-sm font-mono uppercase tracking-[0.2em] text-gray-400 mb-2">
              {t('step1')}
            </h3>
            <h2 className="text-3xl font-light text-gray-900">
              {t('step1_title')}
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            {servicesData.map(service => (
              <button
                key={service.slug}
                onClick={() => {
                  setSelectedService(service);
                  handleNext();
                }}
                className="group flex flex-col md:flex-row md:items-center justify-between text-left p-6 md:p-8 bg-gray-50 border border-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all duration-300"
              >
                <div className="flex flex-col gap-2 max-w-xl">
                  <h3 className="text-xl font-medium text-gray-900 group-hover:text-black transition-colors">
                    {service.title[locale]}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                    {service.shortDescription[locale]}
                  </p>
                </div>
                <div className="mt-6 md:mt-0 flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-gray-400 group-hover:text-gray-900 transition-colors">
                  <span>{locale === 'de' ? 'Wählen' : 'Выбрать'}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </button>
            ))}
          </div>
        </div>
      );
    }
    // If step > 1
    return renderStepsTwoToFour();
  }

  // If the wizard is rendered on the /booking page directly
  return (
    <>
      <div className="mx-auto w-full max-w-4xl flex flex-col gap-8">
        <div className="flex flex-col items-center justify-center border-b border-gray-100 pb-8 mb-8 text-center">
          <h3 className="text-sm font-mono uppercase tracking-[0.2em] text-gray-400 mb-2">
            {t('step1')}
          </h3>
          <h2 className="text-3xl md:text-4xl font-light text-gray-900">
            {t('step1_title')}
          </h2>
        </div>
        
        <div className="flex flex-col gap-4 animate-in fade-in duration-500 pb-24">
          {servicesData.map(service => (
            <button
              key={service.slug}
              onClick={() => {
                setSelectedService(service);
                handleNext();
              }}
              className="group flex flex-col md:flex-row md:items-center justify-between text-left p-6 md:p-8 bg-gray-50 border border-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all duration-300"
            >
              <div className="flex flex-col gap-2 max-w-xl">
                <h3 className="text-xl font-medium text-gray-900 group-hover:text-black transition-colors">
                  {service.title[locale]}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                  {service.shortDescription[locale]}
                </p>
              </div>
              <div className="mt-6 md:mt-0 flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-gray-400 group-hover:text-gray-900 transition-colors">
                <span>{locale === 'de' ? 'Wählen' : 'Выбрать'}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Overlay Modal for Steps 2+ on the Booking page */}
      {step > 1 && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 sm:p-6 md:p-12 bg-black/20 backdrop-blur-sm animate-in fade-in duration-500 ease-out">
          <div className="bg-white/95 backdrop-blur-3xl border border-gray-200 w-full max-w-6xl max-h-[95vh] flex flex-col rounded-xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500 ease-out">
            
            {/* Close Button */}
            <button 
              onClick={() => {
                if (step === 4) {
                  window.location.href = '/';
                } else {
                  setStep(1);
                }
              }}
              className="absolute top-6 right-6 p-2 text-gray-500 hover:text-gray-900 transition-colors bg-gray-100 hover:bg-gray-200 rounded-full z-50 border border-gray-200 shadow-sm"
            >
              <X size={24} strokeWidth={1.5} />
            </button>

            {/* Scrollable Modal Content */}
            <div className="overflow-y-auto flex-1 w-full bg-transparent">
              {renderStepsTwoToFour()}
            </div>
            
          </div>
        </div>
      )}
    </>
  );
}
