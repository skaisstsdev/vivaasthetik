import { setRequestLocale } from 'next-intl/server';
import PageHero from '@/components/layout/PageHero';

import { buildMetadata, type Loc } from '@/lib/seo';
import { pageSeo, crumbNames } from '@/data/seo';
import { breadcrumbs } from '@/lib/schema';
import JsonLd from '@/components/seo/JsonLd';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Loc;
  return buildMetadata({ locale: l, path: '/agb', ...pageSeo.agb[l] });
}

export default async function AgbPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="bg-white text-gray-900 min-h-screen">
      <JsonLd
        data={breadcrumbs(locale as Loc, [
          { name: crumbNames.home[locale as Loc], path: '' },
          { name: crumbNames.agb[locale as Loc], path: '/agb' },
        ])}
      />
      {/* Мини-хиро */}
      <PageHero title={locale === 'ru' ? 'Условия и положения (AGB)' : 'Allgemeine Geschäftsbedingungen (AGB)'} />

      <div className="max-w-4xl mx-auto px-6 md:px-8 py-20 md:py-24">
        {locale === 'ru' ? (
          <div className="prose prose-lg text-gray-600 max-w-none">
            <p className="text-sm text-gray-400">
              * Перевод немецкого текста для вашего удобства. Юридическую силу имеет немецкая редакция. Состояние на ноябрь 2026 года.
            </p>

            <h2>§ 1 Область применения</h2>
            <p>Настоящие Общие условия (AGB) применяются ко всем врачебным и эстетическим процедурам, консультациям и другим услугам, которые практика VIVA Ästhetik (Natalya Schnal, Königstor 47, 34117 Kassel) оказывает пациентам. Иные условия пациента не применяются.</p>

            <h2>§ 2 Договор на лечение, информирование и согласие</h2>
            <p>1. Договор на лечение заключается договорённостью о приёме и его подтверждением со стороны практики, не позднее начала лечения. При онлайн-записи на сайте время бронируется и подтверждается сразу: подтверждение показывается на экране и отправляется по e-mail. Применяются положения §§ 630a и далее BGB.</p>
            <p>2. Перед каждой процедурой проводится личная консультация. Врач объясняет ход процедуры, ожидаемую пользу и риски, возможные альтернативы и уход после неё. Процедура проводится только после того, как пациент дал согласие после такого информирования. Согласие можно отозвать в любой момент.</p>
            <p>3. Запись на консультацию не означает, что процедура будет проведена. Если по медицинским причинам процедуру проводить не следует, врач вправе от неё отказаться.</p>

            <h2>§ 3 Запись на приём и отмена</h2>
            <p>1. Приём можно назначить онлайн, по телефону, по электронной почте или через WhatsApp. Согласованное время резервируется за пациентом и является обязательным.</p>
            <p>2. Если пациент не может прийти, просим отменить или перенести приём не позднее чем за <strong>24 часа</strong> до назначенного времени.</p>
            <p>3. При несвоевременной отмене или неявке практика вправе потребовать компенсацию за сорванный приём. Её размер определяется фактически понесённой потерей; при этом учитываются сэкономленные расходы и иное использование времени. За пациентом сохраняется право доказать, что ущерба нет или он значительно меньше. Компенсация не взимается, если пациент не может прийти по не зависящей от него причине (например, внезапная болезнь или экстренный случай) и без промедления сообщил об этом практике.</p>

            <h2>§ 4 Цены и оплата</h2>
            <p>1. Все цены указаны в евро как окончательные, включая налог на добавленную стоимость, если он по закону взимается. Цены со словом «от» служат ориентиром.</p>
            <p>2. Окончательная цена зависит от зоны обработки, объёма и цели процедуры. Предполагаемую стоимость мы сообщаем после консультации до процедуры.</p>
            <p>3. Процедуры являются частными услугами. Оплата через государственное медицинское страхование невозможна. Возмещение частными страховщиками или ведомствами не входит в нашу ответственность.</p>
            <p>4. Оплата производится сразу после процедуры. Принимаются наличные и распространённые карты EC и кредитные карты.</p>

            <h2>§ 5 Участие пациента</h2>
            <p>1. Пациент обязан до процедуры предоставить полные и правдивые сведения о состоянии здоровья, в частности о заболеваниях, аллергиях, беременности и принимаемых лекарствах.</p>
            <p>2. Пациент выполняет рекомендации по подготовке и уходу после процедуры. При неожиданных жалобах после процедуры он незамедлительно обращается в практику.</p>

            <h2>§ 6 Результат и ответственность</h2>
            <p>1. Практика обязуется провести процедуру качественно по признанному медицинскому стандарту, но не гарантирует конкретный результат. В эстетической медицине организм каждого реагирует индивидуально, поэтому определённый визуальный результат гарантировать нельзя.</p>
            <p>2. Ответственность практики определяется законом. Это относится, в частности, к вреду жизни, телу и здоровью.</p>
            <p>3. Неверные или скрытые пациентом сведения о здоровье могут учитываться при решении вопроса о том, в какой мере практика отвечает за вред.</p>

            <h2>§ 7 Защита данных</h2>
            <p>О том, как мы обрабатываем персональные данные, написано в нашей <a href="/ru/datenschutz">политике конфиденциальности</a>.</p>

            <h2>§ 8 Заключительные положения</h2>
            <p>1. Применяется немецкое право. Обязательные нормы защиты потребителей государства, в котором пациент обычно проживает, сохраняют силу.</p>
            <p>2. Если отдельные положения этих AGB недействительны или станут таковыми, остальные положения остаются в силе. Вместо недействительного положения применяется закон.</p>
          </div>
        ) : (
          <div className="prose prose-lg text-gray-600 max-w-none">
            <p className="text-sm text-gray-400">Stand: November 2026</p>

            <h2>§ 1 Geltungsbereich</h2>
            <p>Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle ärztlichen und ästhetischen Behandlungen, Beratungen und sonstigen Leistungen, die die Praxis VIVA Ästhetik (Natalya Schnal, Königstor 47, 34117 Kassel) gegenüber Patientinnen und Patienten erbringt. Abweichende Bedingungen des Patienten gelten nicht.</p>

            <h2>§ 2 Behandlungsvertrag, Aufklärung und Einwilligung</h2>
            <p>1. Der Behandlungsvertrag kommt durch die Vereinbarung eines Termins und dessen Bestätigung durch die Praxis zustande, spätestens mit dem Beginn der Behandlung. Bei einer Online-Buchung über die Website wird der Termin sofort reserviert und bestätigt; die Bestätigung wird auf dem Bildschirm angezeigt und per E-Mail versendet. Es gelten die Vorschriften der §§ 630a ff. BGB.</p>
            <p>2. Vor jeder Behandlung findet ein persönliches Beratungsgespräch statt. Die Ärztin klärt dabei über Ablauf, Chancen und Risiken, mögliche Alternativen und Nachsorge auf. Eine Behandlung erfolgt erst, wenn der Patient nach der Aufklärung eingewilligt hat. Die Einwilligung kann jederzeit widerrufen werden.</p>
            <p>3. Ein Termin zur Beratung bedeutet nicht, dass eine Behandlung durchgeführt wird. Besteht aus ärztlicher Sicht ein Grund, eine Behandlung nicht durchzuführen, kann die Ärztin sie ablehnen.</p>

            <h2>§ 3 Terminvereinbarung und Absage</h2>
            <p>1. Termine können online, telefonisch, per E-Mail oder per WhatsApp vereinbart werden. Ein vereinbarter Termin wird für den Patienten reserviert und ist verbindlich.</p>
            <p>2. Kann ein Patient einen Termin nicht wahrnehmen, bitten wir um Absage oder Verschiebung spätestens <strong>24 Stunden</strong> vor dem vereinbarten Zeitpunkt.</p>
            <p>3. Bei nicht rechtzeitiger Absage oder Nichterscheinen kann die Praxis ein Ausfallhonorar verlangen. Die Höhe richtet sich nach dem tatsächlich entstandenen Ausfall; die Praxis berücksichtigt dabei ersparte Aufwendungen und anderweitige Verwendung der Termin­zeit. Dem Patienten bleibt der Nachweis vorbehalten, dass kein oder ein wesentlich geringerer Schaden entstanden ist. Ein Ausfallhonorar wird nicht verlangt, wenn der Patient die Verhinderung nicht zu vertreten hat (zum Beispiel bei plötzlicher Erkrankung oder einem Notfall) und die Praxis unverzüglich informiert.</p>

            <h2>§ 4 Preise und Zahlung</h2>
            <p>1. Alle Preise verstehen sich in Euro als Endpreise einschließlich einer etwa gesetzlich anfallenden Umsatzsteuer. Preisangaben mit „ab“ dienen der Orientierung.</p>
            <p>2. Der verbindliche Preis hängt von Behandlungsareal, Menge und Behandlungsziel ab. Wir teilen Ihnen die voraussichtlichen Kosten nach der Beratung vor der Behandlung mit.</p>
            <p>3. Die Behandlungen sind Privatleistungen. Eine Abrechnung über die gesetzliche Krankenversicherung ist nicht möglich. Eine Erstattung durch private Versicherungen oder Beihilfestellen liegt nicht in unserer Verantwortung.</p>
            <p>4. Die Zahlung erfolgt unmittelbar nach der Behandlung. Akzeptiert werden Barzahlung sowie gängige EC- und Kreditkarten.</p>

            <h2>§ 5 Mitwirkung des Patienten</h2>
            <p>1. Der Patient ist verpflichtet, vor der Behandlung vollständige und wahrheitsgemäße Angaben zu seinem Gesundheitszustand zu machen, insbesondere zu Vorerkrankungen, Allergien, Schwangerschaft und eingenommenen Medikamenten.</p>
            <p>2. Der Patient beachtet die Hinweise zur Vor- und Nachsorge. Treten nach der Behandlung unerwartete Beschwerden auf, wendet er sich umgehend an die Praxis.</p>

            <h2>§ 6 Behandlungserfolg und Haftung</h2>
            <p>1. Die Praxis schuldet eine fachgerechte Behandlung nach dem anerkannten medizinischen Standard, nicht einen bestimmten Behandlungserfolg. In der ästhetischen Medizin reagiert jeder Körper individuell; ein bestimmtes optisches Ergebnis kann nicht garantiert werden.</p>
            <p>2. Die Haftung der Praxis richtet sich nach den gesetzlichen Vorschriften. Das gilt insbesondere für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit.</p>
            <p>3. Falsche oder verschwiegene Angaben des Patienten zu seiner Gesundheit können bei der Frage berücksichtigt werden, ob und in welchem Umfang ein Schaden zu vertreten ist.</p>

            <h2>§ 7 Datenschutz</h2>
            <p>Wie wir personenbezogene Daten verarbeiten, erfahren Sie in unserer <a href="/de/datenschutz">Datenschutzerklärung</a>.</p>

            <h2>§ 8 Schlussbestimmungen</h2>
            <p>1. Es gilt deutsches Recht. Zwingende Verbraucherschutzvorschriften des Staates, in dem der Patient seinen gewöhnlichen Aufenthalt hat, bleiben unberührt.</p>
            <p>2. Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt. Anstelle der unwirksamen Bestimmung gilt die gesetzliche Regelung.</p>
          </div>
        )}
      </div>
    </main>
  );
}
