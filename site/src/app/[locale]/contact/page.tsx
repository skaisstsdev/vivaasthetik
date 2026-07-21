import { setRequestLocale, getTranslations } from 'next-intl/server';
import ConsultationCTA from '@/components/home/ConsultationCTA';
import dynamic from 'next/dynamic';
const ShaderBackground = dynamic(() => import('@/components/home/ShaderBackground'));

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Contact' });

  return (
    <main className="bg-white pb-24">
      {/* Hero Section */}
      <section className="relative w-full h-[100svh] flex items-center justify-center overflow-hidden bg-gray-900">
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
                  <div className="w-1.5 h-1.5 rounded-full bg-[#cda557] mt-3 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-lg mb-1">{t('addressTitle')}</h3>
                    <p className="text-gray-600 text-lg">{t('addressText')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#cda557] mt-3 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-lg mb-1">{t('phoneTitle')}</h3>
                    <p className="text-gray-600 text-lg"><a href={`tel:${t('phoneText').replace(/\\s/g, '')}`} className="hover:text-gray-900 transition-colors">{t('phoneText')}</a></p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#cda557] mt-3 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-lg mb-1">{t('emailTitle')}</h3>
                    <p className="text-gray-600 text-lg"><a href={`mailto:${t('emailText')}`} className="hover:text-gray-900 transition-colors">{t('emailText')}</a></p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#cda557] mt-3 flex-shrink-0"></div>
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
                  <div className="w-1.5 h-1.5 rounded-full bg-[#cda557] mt-3 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-lg mb-1">{t('socialTitle')}</h3>
                    <div className="flex gap-4 mt-2">
                      <a href="https://www.instagram.com/viva_asthetik?igsh=bW5vYnB2dDhmeGdo" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">Instagram</a>
                      <a href="https://wa.me/491799004902" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">WhatsApp</a>
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
