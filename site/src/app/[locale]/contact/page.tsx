import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import ConsultationCTA from '@/components/home/ConsultationCTA';
import ShaderBackground from '@/components/home/ShaderBackground';

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await useTranslations('Contact');

  return (
    <main className="bg-white pb-24">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden bg-gray-900">
        <ShaderBackground />
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 flex flex-col items-center justify-center text-center pt-20">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 leading-tight">
            {t('title')}
          </h1>
          <p className="max-w-2xl text-lg text-gray-300 font-light mx-auto mb-10 leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mt-24 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Info & Form */}
          <div className="flex flex-col gap-12">
            <div>
              <h2 className="text-3xl font-light text-gray-900 mb-8">{t('infoTitle')}</h2>
              
              <div className="flex flex-col gap-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 mt-1 text-gray-900">
                    <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-lg mb-1">{t('addressTitle')}</h3>
                    <p className="text-gray-600 text-lg">{t('addressText')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 mt-1 text-gray-900">
                    <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path></svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-lg mb-1">{t('phoneTitle')}</h3>
                    <p className="text-gray-600 text-lg"><a href={`tel:${t('phoneText').replace(/\\s/g, '')}`} className="hover:text-gray-900 transition-colors">{t('phoneText')}</a></p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 mt-1 text-gray-900">
                    <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-lg mb-1">{t('emailTitle')}</h3>
                    <p className="text-gray-600 text-lg"><a href={`mailto:${t('emailText')}`} className="hover:text-gray-900 transition-colors">{t('emailText')}</a></p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 mt-1 text-gray-900">
                    <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-lg mb-1">{t('hoursTitle')}</h3>
                    <p className="text-gray-600 text-lg">
                      {t('hoursText').split('\n').map((line, idx) => (
                        <span key={idx} className="block">{line}</span>
                      ))}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 mt-1 text-gray-900">
                    <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path></svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-lg mb-1">{t('socialTitle')}</h3>
                    <div className="flex gap-4 mt-2">
                      <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Instagram</a>
                      <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Facebook</a>
                      <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">WhatsApp</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Simple Contact Form */}
            <div className="mt-8 p-8 bg-gray-50 border border-gray-100">
              <h2 className="text-2xl font-light text-gray-900 mb-6">{t('formTitle')}</h2>
              <form className="flex flex-col gap-6">
                <input 
                  type="text" 
                  placeholder={t('formName')} 
                  className="w-full bg-white border border-gray-200 px-4 py-3 outline-none focus:border-gray-900 transition-colors"
                  required 
                />
                <input 
                  type="email" 
                  placeholder={t('formEmail')} 
                  className="w-full bg-white border border-gray-200 px-4 py-3 outline-none focus:border-gray-900 transition-colors"
                  required 
                />
                <textarea 
                  placeholder={t('formMessage')} 
                  rows={4}
                  className="w-full bg-white border border-gray-200 px-4 py-3 outline-none focus:border-gray-900 transition-colors resize-none"
                  required 
                ></textarea>
                <button 
                  type="button" 
                  className="bg-gray-900 text-white px-8 py-4 uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors mt-2"
                >
                  {t('formSubmit')}
                </button>
              </form>
            </div>
          </div>

          {/* Map */}
          <div className="h-[600px] lg:h-auto bg-gray-100 border border-gray-200">
            <iframe 
              width="100%" 
              height="100%" 
              style={{ border: 0 }}
              loading="lazy" 
              allowFullScreen 
              src="https://maps.google.com/maps?q=K%C3%B6nigstor%2047,%2034117%20Kassel&t=&z=15&ie=UTF8&iwloc=&output=embed"
            ></iframe>
          </div>

        </div>
      </section>

      {/* Consultation CTA */}
      <ConsultationCTA />
    </main>
  );
}
