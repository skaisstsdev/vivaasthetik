import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHero from '@/components/layout/PageHero';
import ConsultationCTA from '@/components/home/ConsultationCTA';
import ContactForm from '@/components/contact/ContactForm';
import ConsentMap from '@/components/contact/ConsentMap';

import { buildMetadata, type Loc } from '@/lib/seo';
import { pageSeo, crumbNames } from '@/data/seo';
import { breadcrumbs } from '@/lib/schema';
import JsonLd from '@/components/seo/JsonLd';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Loc;
  return buildMetadata({ locale: l, path: '/contact', ...pageSeo.contact[l] });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Contact' });

  return (
    <main className="bg-white">
      <JsonLd
        data={breadcrumbs(locale as Loc, [
          { name: crumbNames.home[locale as Loc], path: '' },
          { name: crumbNames.contact[locale as Loc], path: '/contact' },
        ])}
      />
      {/* Мини-хиро */}
      <PageHero title={t('title')} />

      {/* Contact Content */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-24 md:py-32">
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

            {/* Форма обратной связи */}
            <ContactForm
              loc={locale as 'de' | 'ru'}
              labels={{
                title: t('formTitle'),
                name: t('formName'),
                email: t('formEmail'),
                message: t('formMessage'),
                submit: t('formSubmit'),
              }}
            />
          </div>

          {/* Map */}
          <ConsentMap loc={locale as 'de' | 'ru'} />

        </div>
      </section>

      {/* Consultation CTA */}
      <ConsultationCTA />
    </main>
  );
}
