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
        <div className="prose prose-lg text-gray-600 max-w-none">
          {locale === 'ru' && (
            <p className="mb-8 text-sm text-gray-400">
              * В соответствии с немецким законодательством (§ 5 DDG) юридическая информация предоставляется на немецком языке и имеет юридическую силу в этой редакции.
            </p>
          )}

          <h2>Angaben gemäß § 5 DDG</h2>
          <p>
            <strong>VIVA Ästhetik</strong><br />
            Natalya Schnal, Ärztin<br />
            Königstor 47<br />
            34117 Kassel<br />
            Deutschland
          </p>

          <h2>Kontakt</h2>
          <p>
            Telefon: <a href="tel:+491799004902">+49 179 9004902</a><br />
            E-Mail: <a href="mailto:vivaasthetik@gmail.com">vivaasthetik@gmail.com</a>
          </p>

          <h2>Berufsbezeichnung und berufsrechtliche Regelungen</h2>
          <p>
            <strong>Berufsbezeichnung:</strong> Ärztin<br />
            <strong>Zuständige Ärztekammer:</strong> Landesärztekammer Hessen, Im Vogelsgesang 3, 60488 Frankfurt am Main, <a href="https://www.laekh.de" target="_blank" rel="noopener noreferrer">www.laekh.de</a><br />
            <strong>Berufsbezeichnung verliehen in:</strong> Kasachstan (Anerkennung in der Bundesrepublik Deutschland)
          </p>
          <p>
            Es gelten die folgenden berufsrechtlichen Regelungen: Berufsordnung für die Ärztinnen und Ärzte in Hessen und Hessisches Heilberufsgesetz. Sie können über die Website der Landesärztekammer Hessen eingesehen werden.
          </p>

          <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
          <p>
            Natalya Schnal<br />
            Königstor 47, 34117 Kassel
          </p>

          <h2>Hinweis zu den Inhalten dieser Website</h2>
          <p>
            Die Informationen auf dieser Website dienen der allgemeinen Information über unser Behandlungsangebot. Sie ersetzen weder eine ärztliche Untersuchung noch eine persönliche Beratung. Ob und wie eine Behandlung für Sie geeignet ist, klären wir im persönlichen Gespräch. Ein bestimmter Behandlungserfolg kann nicht garantiert werden.
          </p>

          <h2>Verbraucherstreitbeilegung</h2>
          <p>
            Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
          </p>

          <h2>Haftung für Links</h2>
          <p>
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Für diese fremden Inhalte übernehmen wir keine Gewähr. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter verantwortlich. Bei Bekanntwerden von Rechtsverletzungen entfernen wir solche Links umgehend.
          </p>

          <h2>Urheberrecht</h2>
          <p>
            Die auf dieser Website veröffentlichten Texte, Bilder und sonstigen Inhalte unterliegen dem deutschen Urheberrecht. Eine Vervielfältigung, Bearbeitung oder Verbreitung bedarf der schriftlichen Zustimmung der Betreiberin.
          </p>
        </div>
      </div>
    </main>
  );
}
