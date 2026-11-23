import { setRequestLocale } from 'next-intl/server';
import PageHero from '@/components/layout/PageHero';

import { buildMetadata, type Loc } from '@/lib/seo';
import { pageSeo, crumbNames } from '@/data/seo';
import { breadcrumbs } from '@/lib/schema';
import JsonLd from '@/components/seo/JsonLd';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Loc;
  return buildMetadata({ locale: l, path: '/datenschutz', ...pageSeo.datenschutz[l] });
}

export default async function DatenschutzPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="bg-white text-gray-900 min-h-screen">
      <JsonLd
        data={breadcrumbs(locale as Loc, [
          { name: crumbNames.home[locale as Loc], path: '' },
          { name: crumbNames.datenschutz[locale as Loc], path: '/datenschutz' },
        ])}
      />
      {/* Мини-хиро */}
      <PageHero title={locale === 'ru' ? 'Политика конфиденциальности (Datenschutz)' : 'Datenschutzerklärung'} />

      <div className="max-w-4xl mx-auto px-6 md:px-8 py-20 md:py-24">
        {locale === 'ru' ? (
          <div className="prose prose-lg text-gray-600 max-w-none">
            <p className="text-sm text-gray-400">
              * Перевод немецкого текста для вашего удобства. Юридическую силу имеет немецкая редакция. Состояние на ноябрь 2026 года.
            </p>

            <h2>1. Ответственное лицо и контакты</h2>
            <p>
              Ответственным за обработку данных на этом сайте по смыслу Общего регламента по защите данных (DSGVO) является:<br />
              <strong>VIVA Ästhetik</strong><br />
              Natalya Schnal<br />
              Königstor 47, 34117 Kassel<br />
              Телефон: +49 179 9004902<br />
              E-Mail: vivaasthetik@gmail.com
            </p>

            <h2>2. Обзор и правовые основания</h2>
            <p>Мы обрабатываем персональные данные только в той мере, в какой это необходимо для работы сайта, ответа на ваши обращения и записи на приём, либо если вы дали согласие. Правовые основания: ст. 6 абз. 1 п. a DSGVO (согласие), п. b (договор или преддоговорные меры), п. c (юридическая обязанность) и п. f (законные интересы). Если на вашем устройстве сохраняется или считывается информация, дополнительно применяется § 25 TDDDG.</p>

            <h2>3. Хостинг и серверные журналы</h2>
            <p>Сайт размещён у Vercel Inc. (США). При открытии сайта хостинг-провайдер обрабатывает технически необходимые данные в серверных журналах: IP-адрес, дату и время запроса, открытую страницу, тип браузера и операционную систему, а также страницу, с которой вы пришли. Это нужно для работы и защиты сайта (ст. 6 абз. 1 п. f DSGVO, законный интерес в безопасной и стабильной работе). Журналы автоматически удаляются через короткое время.</p>

            <h2>4. Контактная форма</h2>
            <p>Когда вы пишете нам через контактную форму, мы обрабатываем ваше имя, адрес электронной почты и сообщение, чтобы ответить на обращение (ст. 6 абз. 1 п. b или п. f DSGVO). Сообщение передаётся нам по электронной почте через сервис Resend (см. раздел 6). Мы удаляем данные, когда обращение полностью обработано и нет законных обязанностей хранения. Указание данных добровольно, но без них мы не сможем ответить. Пожалуйста, не отправляйте через форму чувствительные данные о здоровье.</p>

            <h2>5. Онлайн-запись на приём</h2>
            <p>При записи мы обрабатываем выбранную процедуру, дату и время, а также ваше имя, электронную почту, телефон и, если вы их указали, заметки. Мы используем данные, чтобы запланировать и подтвердить приём и при необходимости связаться с вами (ст. 6 абз. 1 п. b DSGVO). Данные записи хранятся в базе данных нашего поставщика Supabase. Кроме того, мы отправляем вам и практике подтверждение по электронной почте через Resend (см. раздел 6).</p>
            <p>В поле «Заметки» следует указывать только то, что нужно для планирования приёма. Если вы всё же указываете там данные о здоровье, вы делаете это добровольно, и мы обрабатываем их на основании вашего явного согласия (ст. 9 абз. 2 п. a DSGVO), которое вы даёте отправкой формы. Данные о здоровье мы предпочитаем обсуждать лично на консультации.</p>
            <p>Имя, e-mail и телефон необходимы для записи; без них приём назначить нельзя. Мы храним данные до проведения приёма и дальше только в той мере, в какой это нужно для проведения и документирования лечения либо если действуют обязательные сроки хранения (например, десять лет для медицинской документации по § 630f абз. 3 BGB и налоговые сроки). Данные, которые больше не нужны, мы удаляем.</p>

            <h2>6. Отправка писем через Resend</h2>
            <p>Для отправки контактных сообщений, подтверждений записи и уведомлений о вашей записи (подтверждение, перенос, отмена) мы используем сервис Resend (Resend, Inc., США, resend.com). Письма отправляются с нашего сервера через инфраструктуру Resend; обработка настроена в ЕС (регион Ирландия). Введённые вами данные (например, имя, e-mail, телефон, данные записи, сообщение) передаются на почтовый ящик практики, а при записи дополнительно вам. В этих письмах мы не используем отслеживание открытий и переходов по ссылкам. Правовое основание: ст. 6 абз. 1 п. b DSGVO. С поставщиком заключён договор об обработке данных по ст. 28 DSGVO. Передача данных в третьи страны, в частности в США, не исключена; она происходит на основании стандартных договорных условий или решения об адекватности.</p>

            <h2>7. Связь по телефону, e-mail и WhatsApp</h2>
            <p>Когда вы звоните, пишете по e-mail или в WhatsApp, мы обрабатываем ваши контакты и содержание сообщения для обработки обращения (ст. 6 абз. 1 п. b или п. f DSGVO). Мы даём ссылку на WhatsApp (Meta Platforms Ireland Limited); при нажатии вы покидаете наш сайт, и действуют правила конфиденциальности WhatsApp. Обычные письма и сообщения в мессенджерах не обеспечивают защиты конфиденциальной беседы с врачом. Не отправляйте через них чувствительные данные о здоровье.</p>

            <h2>8. Cookie и локальное хранилище</h2>
            <p>Сайт сохраняет ваше решение в cookie-баннере в локальном хранилище браузера (запись «cookie_consent»). Это технически необходимо, чтобы учитывать ваш выбор (§ 25 абз. 2 п. 2 TDDDG, ст. 6 абз. 1 п. f DSGVO). Другие cookie, в частности для измерения посещаемости, мы устанавливаем только с вашего согласия (см. раздел 9). Решение можно изменить в любой момент по ссылке «Настройки cookie» внизу страницы.</p>

            <h2>9. Google Analytics 4</h2>
            <p>С вашего согласия (ст. 6 абз. 1 п. a DSGVO, § 25 абз. 1 TDDDG) мы используем Google Analytics 4, сервис веб-аналитики компании Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ирландия. Сервис использует cookie (например, «_ga» со сроком до двух лет) и фиксирует использование сайта: просмотренные страницы, клики по номеру телефона, e-mail и WhatsApp, отправку форм (без содержимого), примерный регион, данные об устройстве и браузере. IP-адреса в Google Analytics 4 не журналируются. Google Signals и рекламные функции мы отключили. Данные хранятся 14 месяцев и затем автоматически удаляются.</p>
            <p>Передача данных в Google LLC в США возможна на основании EU-US Data Privacy Framework и стандартных договорных условий. Без вашего согласия Google Analytics не загружается. Согласие можно отозвать в любой момент через «Настройки cookie» внизу страницы с действием на будущее. Законность обработки до отзыва это не затрагивает. Подробнее: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>.</p>

            <h2>10. Google Maps</h2>
            <p>На странице «Kontakt» мы встраиваем карту Google Maps (Google Ireland Limited). Карта загружается только после нажатия на «Загрузить карту» (ст. 6 абз. 1 п. a DSGVO, § 25 абз. 1 TDDDG). При этом Google получает ваш IP-адрес и данные браузера и может устанавливать cookie. Без нажатия данные в Google не передаются. Ссылка «Открыть в Google Maps» ведёт на сайт Google, где действуют его правила конфиденциальности: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>.</p>

            <h2>11. Внешние ссылки и отзывы</h2>
            <p>На сайте есть ссылки на внешние ресурсы, например на наш профиль Google с отзывами, Instagram и WhatsApp. Данные передаются соответствующему провайдеру только после нажатия на такую ссылку. Показанные на сайте отзывы Google мы взяли в виде текста; данные вашего посещения при этом в Google не передаются.</p>

            <h2>12. Шрифты</h2>
            <p>Используемые на сайте шрифты отдаются с нашего собственного сервера. Подключения к серверам Google Fonts нет.</p>

            <h2>13. Получатели и передача в третьи страны</h2>
            <p>Получателями ваших данных, в той мере, как описано выше, являются наши технические поставщики (хостинг, база данных, отправка почты) и, при вашем согласии, Google. С поставщиками, обрабатывающими данные по нашему поручению, мы при необходимости заключаем договоры по ст. 28 DSGVO. Передача данных за пределы ЕС и ЕЭП происходит только на основании решения об адекватности, стандартных договорных условий или вашего согласия. Иная передача третьим лицам не происходит, кроме случаев, когда мы обязаны по закону.</p>

            <h2>14. Безопасность данных</h2>
            <p>Передача данных между вашим браузером и сайтом шифруется (TLS/HTTPS). Мы принимаем технические и организационные меры для защиты данных от потери, злоупотребления и несанкционированного доступа. Доступ к данным записи защищён паролем.</p>

            <h2>15. Ваши права</h2>
            <p>У вас есть следующие права в отношении ваших персональных данных:</p>
            <ul>
              <li>получить информацию (ст. 15 DSGVO),</li>
              <li>исправить неверные данные (ст. 16 DSGVO),</li>
              <li>удалить данные (ст. 17 DSGVO),</li>
              <li>ограничить обработку (ст. 18 DSGVO),</li>
              <li>переносимость данных (ст. 20 DSGVO),</li>
              <li>возразить против обработки на основании законных интересов (ст. 21 DSGVO),</li>
              <li>отозвать согласие с действием на будущее (ст. 7 абз. 3 DSGVO).</li>
            </ul>
            <p>Чтобы воспользоваться правами, достаточно письма на vivaasthetik@gmail.com. Кроме того, вы вправе подать жалобу в надзорный орган по защите данных (ст. 77 DSGVO). Для нас компетентен Hessischer Beauftragter für Datenschutz und Informationsfreiheit, Gustav-Stresemann-Ring 1, 65189 Wiesbaden, <a href="https://datenschutz.hessen.de" target="_blank" rel="noopener noreferrer">datenschutz.hessen.de</a>.</p>

            <h2>16. Автоматизированные решения не принимаются</h2>
            <p>Автоматизированного принятия решений, включая профилирование по ст. 22 DSGVO, не происходит.</p>

            <h2>17. ИИ-ассистент (VIVA Assistent)</h2>
            <p>На сайте работает чат-ассистент на основе искусственного интеллекта. Вы общаетесь с программой, а не с человеком, и не получаете медицинской консультации. Текст ваших сообщений (без явных e-mail, телефонов и номеров счетов, которые мы удаляем автоматически) передаётся для подготовки ответа провайдеру OpenAI (OpenAI Ireland Ltd. / OpenAI, L.L.C., США). Правовое основание: ст. 6 абз. 1 п. b и f DSGVO (ответ на ваш запрос, удобная работа сайта). Мы не сохраняем содержимое диалогов на нашей стороне: история хранится только в памяти открытой страницы и пропадает при её закрытии. OpenAI может сохранять данные запросов ограниченное время для предотвращения злоупотреблений (по данным OpenAI, как правило, до 30 дней), но не использует их для обучения моделей. Пожалуйста, не вводите в чат медицинские и другие личные данные. Для записи используйте форму записи.</p>

            <h2>18. Изменения</h2>
            <p>Мы изменяем эту политику, когда меняются сайт, наши сервисы или законодательство. Действует редакция, опубликованная здесь.</p>
          </div>
        ) : (
          <div className="prose prose-lg text-gray-600 max-w-none">
            <p className="text-sm text-gray-400">Stand: November 2026</p>

            <h2>1. Verantwortliche und Kontakt</h2>
            <p>
              Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:<br />
              <strong>VIVA Ästhetik</strong><br />
              Natalya Schnal<br />
              Königstor 47, 34117 Kassel<br />
              Telefon: +49 179 9004902<br />
              E-Mail: vivaasthetik@gmail.com
            </p>

            <h2>2. Überblick und Rechtsgrundlagen</h2>
            <p>Wir verarbeiten personenbezogene Daten nur, soweit das zur Bereitstellung dieser Website, zur Beantwortung Ihrer Anfragen und zur Vereinbarung von Terminen erforderlich ist oder Sie eingewilligt haben. Rechtsgrundlagen sind Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), lit. b (Vertrag oder vorvertragliche Maßnahmen), lit. c (rechtliche Verpflichtung) und lit. f (berechtigte Interessen). Soweit auf Ihrem Endgerät Informationen gespeichert oder abgerufen werden, gilt zusätzlich § 25 TDDDG.</p>

            <h2>3. Hosting und Server-Logfiles</h2>
            <p>Diese Website wird bei Vercel Inc. (USA) gehostet. Beim Aufruf der Website verarbeitet der Hosting-Anbieter technisch notwendige Daten in Server-Logfiles: IP-Adresse, Datum und Uhrzeit des Abrufs, aufgerufene Seite, Browsertyp und Betriebssystem sowie die zuvor besuchte Seite. Das ist zur Auslieferung und Absicherung der Website erforderlich (Art. 6 Abs. 1 lit. f DSGVO, berechtigtes Interesse an einem sicheren und stabilen Betrieb). Die Logdaten werden nach kurzer Zeit automatisch gelöscht.</p>

            <h2>4. Kontaktformular</h2>
            <p>Wenn Sie uns über das Kontaktformular schreiben, verarbeiten wir Ihren Namen, Ihre E-Mail-Adresse und Ihre Nachricht, um Ihre Anfrage zu beantworten (Art. 6 Abs. 1 lit. b bzw. lit. f DSGVO). Die Nachricht wird über den Dienst Resend (siehe Abschnitt 6) per E-Mail an uns übermittelt. Wir löschen die Daten, sobald Ihre Anfrage abschließend bearbeitet ist und keine gesetzlichen Aufbewahrungspflichten entgegenstehen. Ihre Angaben sind freiwillig; ohne sie können wir Ihre Anfrage jedoch nicht beantworten. Bitte senden Sie uns über das Formular keine sensiblen Gesundheitsdaten.</p>

            <h2>5. Online-Terminbuchung</h2>
            <p>Bei der Terminbuchung verarbeiten wir die gewählte Behandlung, Datum und Uhrzeit sowie Ihren Namen, Ihre E-Mail-Adresse, Ihre Telefonnummer und, falls Sie es eintragen, Ihre Notizen. Wir nutzen die Daten, um Ihren Termin zu planen, zu bestätigen und Sie bei Bedarf zu erreichen (Art. 6 Abs. 1 lit. b DSGVO). Die Buchungsdaten werden in einer Datenbank unseres Dienstleisters Supabase gespeichert. Zusätzlich senden wir Ihnen und der Praxis eine Bestätigung per E-Mail über Resend (siehe Abschnitt 6).</p>
            <p>Im Feld „Notizen“ sollen nur Angaben stehen, die für die Terminplanung nötig sind. Tragen Sie dort dennoch Gesundheitsdaten ein, geschieht das freiwillig und wir verarbeiten sie auf Grundlage Ihrer ausdrücklichen Einwilligung (Art. 9 Abs. 2 lit. a DSGVO), die Sie mit dem Absenden erteilen. Gesundheitsangaben besprechen wir bevorzugt persönlich in der Beratung.</p>
            <p>Die Angaben zu Name, E-Mail und Telefonnummer sind für die Buchung erforderlich; ohne sie kann kein Termin vereinbart werden. Wir speichern die Daten bis zur Durchführung des Termins und darüber hinaus nur, soweit es zur Abwicklung und Dokumentation der Behandlung erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen (zum Beispiel zehn Jahre für die ärztliche Dokumentation nach § 630f Abs. 3 BGB und die steuerrechtlichen Fristen). Nicht mehr benötigte Daten löschen wir.</p>

            <h2>6. E-Mail-Versand über Resend</h2>
            <p>Für den Versand von Kontaktnachrichten, Terminbestätigungen und Hinweisen zu Ihrem Termin (Bestätigung, Verschiebung, Absage) nutzen wir den Dienst Resend (Resend, Inc., USA, resend.com). Die E-Mails werden von unserem Server über die Infrastruktur von Resend versendet; wir haben die Verarbeitung in der EU (Region Irland) eingestellt. Dabei werden die jeweils eingegebenen Angaben (zum Beispiel Name, E-Mail-Adresse, Telefonnummer, Termindaten, Nachricht) an das E-Mail-Postfach der Praxis und bei Buchungen zusätzlich an Sie übermittelt. Wir verwenden keine Öffnungs- oder Klickverfolgung in diesen E-Mails. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO. Mit dem Anbieter besteht ein Auftragsverarbeitungsvertrag nach Art. 28 DSGVO. Eine Übermittlung in Drittländer, insbesondere in die USA, kann dabei nicht ausgeschlossen werden; sie erfolgt auf Grundlage von Standardvertragsklauseln oder eines Angemessenheitsbeschlusses.</p>

            <h2>7. Kontakt per Telefon, E-Mail und WhatsApp</h2>
            <p>Wenn Sie uns anrufen, per E-Mail oder über WhatsApp kontaktieren, verarbeiten wir Ihre Kontaktdaten und den Inhalt der Nachricht zur Bearbeitung Ihrer Anfrage (Art. 6 Abs. 1 lit. b bzw. lit. f DSGVO). Wir verlinken auf WhatsApp (Meta Platforms Ireland Limited); beim Klick auf den Link verlassen Sie unsere Website und es gelten die Datenschutzbestimmungen von WhatsApp. Bitte beachten Sie, dass normale E-Mails und Messenger-Nachrichten nicht den Schutz eines vertraulichen Arztgesprächs bieten. Senden Sie uns darüber keine sensiblen Gesundheitsdaten.</p>

            <h2>8. Cookies und lokaler Speicher</h2>
            <p>Unsere Website speichert Ihre Entscheidung im Cookie-Banner im lokalen Speicher Ihres Browsers (Eintrag „cookie_consent“). Das ist technisch erforderlich, damit wir Ihre Entscheidung berücksichtigen können (§ 25 Abs. 2 Nr. 2 TDDDG, Art. 6 Abs. 1 lit. f DSGVO). Weitere Cookies, insbesondere zur Reichweitenmessung, setzen wir nur mit Ihrer Einwilligung (siehe Abschnitt 9). Sie können Ihre Entscheidung jederzeit über den Link „Cookie-Einstellungen“ im Fußbereich der Website ändern.</p>

            <h2>9. Google Analytics 4</h2>
            <p>Mit Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG) nutzen wir Google Analytics 4, einen Webanalysedienst der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Der Dienst verwendet Cookies (zum Beispiel „_ga“ mit einer Laufzeit von bis zu zwei Jahren) und erfasst Ihre Nutzung der Website, etwa aufgerufene Seiten, Klicks auf Telefonnummer, E-Mail-Adresse und WhatsApp, das Absenden von Formularen (ohne Inhalte), die ungefähre Region sowie Geräte- und Browserdaten. IP-Adressen werden in Google Analytics 4 nicht protokolliert. Google-Signals und Werbefunktionen haben wir deaktiviert. Die Daten werden 14 Monate gespeichert und danach automatisch gelöscht.</p>
            <p>Eine Übermittlung von Daten an Google LLC in den USA kann auf Grundlage des EU-US Data Privacy Framework und von Standardvertragsklauseln erfolgen. Ohne Ihre Einwilligung wird Google Analytics nicht geladen. Ihre Einwilligung können Sie jederzeit über „Cookie-Einstellungen“ im Fußbereich mit Wirkung für die Zukunft widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung bleibt unberührt. Weitere Informationen: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>.</p>

            <h2>10. Google Maps</h2>
            <p>Auf der Seite „Kontakt“ binden wir eine Karte von Google Maps (Google Ireland Limited) ein. Die Karte wird erst geladen, wenn Sie auf „Karte laden“ klicken (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG). Dabei erhält Google Ihre IP-Adresse und Browserdaten und kann Cookies setzen. Ohne Ihren Klick werden keine Daten an Google übertragen. Der Link „In Google Maps öffnen“ führt auf die Website von Google; dort gelten deren Datenschutzbestimmungen: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>.</p>

            <h2>11. Externe Links und Bewertungen</h2>
            <p>Unsere Website verlinkt auf externe Angebote, zum Beispiel auf unser Google-Profil mit Bewertungen, auf Instagram und WhatsApp. Erst wenn Sie einen solchen Link anklicken, werden Daten an den jeweiligen Anbieter übertragen. Die auf unserer Website angezeigten Google-Bewertungen haben wir als Text übernommen; dabei werden keine Daten Ihres Besuchs an Google übermittelt.</p>

            <h2>12. Schriftarten</h2>
            <p>Die auf der Website verwendeten Schriftarten werden von unserem eigenen Server ausgeliefert. Es findet keine Verbindung zu Servern von Google Fonts statt.</p>

            <h2>13. Empfänger und Drittlandübermittlung</h2>
            <p>Empfänger Ihrer Daten sind, soweit oben beschrieben, unsere technischen Dienstleister (Hosting, Datenbank, E-Mail-Versand) und bei Ihrer Einwilligung Google. Mit Dienstleistern, die in unserem Auftrag Daten verarbeiten, schließen wir, soweit erforderlich, Verträge nach Art. 28 DSGVO. Werden Daten in Länder außerhalb der EU und des EWR übermittelt, erfolgt dies nur auf Grundlage eines Angemessenheitsbeschlusses, von Standardvertragsklauseln oder Ihrer Einwilligung. Eine darüber hinausgehende Weitergabe an Dritte findet nicht statt, es sei denn, wir sind gesetzlich dazu verpflichtet.</p>

            <h2>14. Datensicherheit</h2>
            <p>Die Übertragung zwischen Ihrem Browser und unserer Website erfolgt verschlüsselt (TLS/HTTPS). Wir treffen technische und organisatorische Maßnahmen, um Ihre Daten vor Verlust, Missbrauch und unbefugtem Zugriff zu schützen. Der Zugang zu den Buchungsdaten ist passwortgeschützt.</p>

            <h2>15. Ihre Rechte</h2>
            <p>Sie haben gegenüber uns folgende Rechte hinsichtlich Ihrer personenbezogenen Daten:</p>
            <ul>
              <li>Auskunft (Art. 15 DSGVO),</li>
              <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO),</li>
              <li>Löschung (Art. 17 DSGVO),</li>
              <li>Einschränkung der Verarbeitung (Art. 18 DSGVO),</li>
              <li>Datenübertragbarkeit (Art. 20 DSGVO),</li>
              <li>Widerspruch gegen die Verarbeitung auf Grundlage berechtigter Interessen (Art. 21 DSGVO),</li>
              <li>Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO).</li>
            </ul>
            <p>Zur Ausübung Ihrer Rechte genügt eine E-Mail an vivaasthetik@gmail.com. Außerdem haben Sie das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren (Art. 77 DSGVO). Zuständig für uns ist der Hessische Beauftragte für Datenschutz und Informationsfreiheit, Gustav-Stresemann-Ring 1, 65189 Wiesbaden, <a href="https://datenschutz.hessen.de" target="_blank" rel="noopener noreferrer">datenschutz.hessen.de</a>.</p>

            <h2>16. Keine automatisierte Entscheidungsfindung</h2>
            <p>Eine automatisierte Entscheidungsfindung einschließlich Profiling nach Art. 22 DSGVO findet nicht statt.</p>

            <h2>17. KI-Assistent (VIVA Assistent)</h2>
            <p>Auf dieser Website steht ein Chat-Assistent auf Basis künstlicher Intelligenz zur Verfügung. Sie kommunizieren mit einem Programm, nicht mit einem Menschen, und erhalten keine ärztliche Beratung. Der Text Ihrer Nachrichten (ohne offensichtliche E-Mail-Adressen, Telefon- und Kontonummern, die wir automatisch entfernen) wird zur Erstellung der Antwort an den Anbieter OpenAI (OpenAI Ireland Ltd. bzw. OpenAI, L.L.C., USA) übermittelt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b und lit. f DSGVO (Beantwortung Ihrer Anfrage, nutzerfreundlicher Betrieb der Website). Wir speichern die Inhalte der Unterhaltungen nicht selbst: Der Verlauf liegt nur im Arbeitsspeicher der geöffneten Seite und entfällt beim Schließen. OpenAI kann Anfragedaten zur Missbrauchserkennung für begrenzte Zeit speichern (nach Angaben von OpenAI in der Regel bis zu 30 Tage), nutzt sie aber nicht zum Training seiner Modelle. Bitte geben Sie im Chat keine Gesundheitsdaten oder sonstigen persönlichen Daten ein. Für Terminanfragen nutzen Sie bitte das Buchungsformular.</p>

            <h2>18. Änderungen</h2>
            <p>Wir passen diese Datenschutzerklärung an, wenn sich die Website, unsere Dienste oder die Rechtslage ändern. Es gilt die jeweils hier veröffentlichte Fassung.</p>
          </div>
        )}
      </div>
    </main>
  );
}
