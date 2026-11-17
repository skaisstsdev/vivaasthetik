import { setRequestLocale } from 'next-intl/server';
import PageHero from '@/components/layout/PageHero';

import { buildMetadata, type Loc } from '@/lib/seo';
import { pageSeo, crumbNames } from '@/data/seo';
import { breadcrumbs } from '@/lib/schema';
import JsonLd from '@/components/seo/JsonLd';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Loc;
  return buildMetadata({ locale: l, path: '/impressum', ...pageSeo.impressum[l] });
}

export default async function ImpressumPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="bg-white text-gray-900 min-h-screen">
      <JsonLd
        data={breadcrumbs(locale as Loc, [
          { name: crumbNames.home[locale as Loc], path: '' },
          { name: crumbNames.impressum[locale as Loc], path: '/impressum' },
        ])}
      />
      {/* Мини-хиро */}
      <PageHero title={locale === 'ru' ? 'Импрессум (Impressum)' : 'Impressum'} />

      <div className="max-w-4xl mx-auto px-6 md:px-8 py-20 md:py-24">
        {locale === 'ru' ? (
          <div className="prose prose-lg text-gray-600 max-w-none">
            <p className="mb-8 text-sm text-gray-400">
              * В соответствии с немецким законодательством (Telemediengesetz), юридическая информация предоставляется на немецком языке.
            </p>
            <h2>Angaben gemäß § 5 TMG</h2>
            <p>
              <strong>VIVA Ästhetik</strong><br />
              Natalya Schnal<br />
              Königstor 47<br />
              34117 Kassel<br />
              Deutschland
            </p>

            <h2>Kontakt</h2>
            <p>
              Telefon: +49 179 9004902<br />
              E-Mail: vivaasthetik@gmail.com
            </p>

            <h2>Berufsbezeichnung und berufsrechtliche Regelungen</h2>
            <p>
              <strong>Gesetzliche Berufsbezeichnung:</strong> Ärztin<br />
              <strong>Zuständige Kammer:</strong> Landesärztekammer Hessen<br />
              <strong>Verliehen in:</strong> Kasachstan (anerkannt in der Bundesrepublik Deutschland)
            </p>
            <p>
              Es gelten die folgenden berufsrechtlichen Regelungen:<br />
              Berufsordnung für die Ärztinnen und Ärzte in Hessen<br />
              Heilberufegesetz des Landes Hessen<br />
              Die Regelungen können auf der Website der zuständigen Ärztekammer eingesehen werden.
            </p>

            <h2>Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>
        ) : (
          <div className="prose prose-lg text-gray-600 max-w-none">
            <h2>Angaben gemäß § 5 TMG</h2>
            <p>
              <strong>VIVA Ästhetik</strong><br />
              Natalya Schnal<br />
              Königstor 47<br />
              34117 Kassel<br />
              Deutschland
            </p>

            <h2>Kontakt</h2>
            <p>
              Telefon: +49 179 9004902<br />
              E-Mail: vivaasthetik@gmail.com
            </p>

            <h2>Berufsbezeichnung und berufsrechtliche Regelungen</h2>
            <p>
              <strong>Gesetzliche Berufsbezeichnung:</strong> Ärztin<br />
              <strong>Zuständige Kammer:</strong> Landesärztekammer Hessen<br />
              <strong>Verliehen in:</strong> Kasachstan (anerkannt in der Bundesrepublik Deutschland)
            </p>
            <p>
              Es gelten die folgenden berufsrechtlichen Regelungen:<br />
              Berufsordnung für die Ärztinnen und Ärzte in Hessen<br />
              Heilberufegesetz des Landes Hessen<br />
              Die Regelungen können auf der Website der zuständigen Ärztekammer eingesehen werden.
            </p>

            <h2>Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
