import { setRequestLocale } from 'next-intl/server';

export default async function DatenschutzPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="bg-white text-gray-900 min-h-screen">
      {/* Hero Section */}
      <div className="bg-[#0a0a0a] text-white pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide">
            {locale === 'ru' ? 'Защита данных (Datenschutzerklärung)' : 'Datenschutzerklärung'}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20">
        {locale === 'ru' ? (
          <div className="prose prose-lg text-gray-600 max-w-none">
            <p className="mb-8 text-sm text-gray-400">
              * В соответствии с европейским законодательством (DSGVO), юридическая информация о защите данных предоставляется на немецком языке. Ниже представлен перевод для вашего удобства.
            </p>
            
            <h2>1. Ответственное лицо</h2>
            <p>
              Ответственным за обработку данных на этом сайте является:<br />
              <strong>VIVA Ästhetik</strong><br />
              Natalya Shnal<br />
              Königstor 47, 34117 Kassel<br />
              Телефон: +49 179 9004902<br />
              E-Mail: vivaasthetik@gmail.com
            </p>

            <h2>2. Сбор и хранение персональных данных</h2>
            <p><strong>a) При посещении веб-сайта</strong></p>
            <p>При вызове нашего веб-сайта браузер на вашем устройстве автоматически отправляет информацию на сервер нашего сайта. Эта информация временно сохраняется в так называемом лог-файле. При этом собираются IP-адрес, дата и время запроса, тип браузера и операционная система.</p>
            <p><strong>b) При использовании нашей контактной формы или формы записи</strong></p>
            <p>Если вы хотите связаться с нами или записаться на прием, мы просим вас указать ваше имя, адрес электронной почты, номер телефона и, при необходимости, дополнительную информацию о желаемой процедуре. Эти данные обрабатываются исключительно с целью ответа на ваш запрос или организации приема на основании ст. 6 абз. 1 п. b) DSGVO.</p>

            <h2>3. Передача данных третьим лицам</h2>
            <p>Ваши личные данные не передаются третьим лицам для целей, отличных от перечисленных ниже. Мы передаем ваши данные только в том случае, если вы дали свое явное согласие, это необходимо по закону, или это требуется для выполнения договора с вами.</p>

            <h2>4. Файлы Cookie</h2>
            <p>Мы используем файлы cookie на нашем сайте. Это небольшие файлы, которые ваш браузер создает автоматически и которые сохраняются на вашем устройстве при посещении нашего сайта. Файлы cookie не причиняют вреда вашему устройству и не содержат вирусов. Мы используем их, чтобы сделать использование нашего предложения более приятным для вас.</p>

            <h2>5. Права субъекта данных</h2>
            <p>Вы имеете право:<br />
            - запрашивать информацию о ваших персональных данных, обрабатываемых нами;<br />
            - требовать немедленного исправления неверных или неполных персональных данных;<br />
            - требовать удаления ваших персональных данных, хранящихся у нас;<br />
            - отозвать свое согласие, данное нам в любое время.</p>
          </div>
        ) : (
          <div className="prose prose-lg text-gray-600 max-w-none">
            <h2>1. Name und Kontaktdaten des für die Verarbeitung Verantwortlichen</h2>
            <p>
              Diese Datenschutzhinweise gelten für die Datenverarbeitung durch:<br />
              <strong>VIVA Ästhetik</strong><br />
              Natalya Shnal<br />
              Königstor 47, 34117 Kassel<br />
              Telefon: +49 179 9004902<br />
              E-Mail: vivaasthetik@gmail.com
            </p>

            <h2>2. Erhebung und Speicherung personenbezogener Daten sowie Art und Zweck von deren Verwendung</h2>
            <p><strong>a) Beim Besuch der Website</strong></p>
            <p>Beim Aufrufen unserer Website werden durch den auf Ihrem Endgerät zum Einsatz kommenden Browser automatisch Informationen an den Server unserer Website gesendet. Diese Informationen werden temporär in einem sog. Logfile gespeichert. Folgende Informationen werden dabei ohne Ihr Zutun erfasst und bis zur automatisierten Löschung gespeichert: IP-Adresse des anfragenden Rechners, Datum und Uhrzeit des Zugriffs, Name und URL der abgerufenen Datei, verwendeter Browser und ggf. das Betriebssystem Ihres Rechners.</p>
            <p><strong>b) Bei Nutzung unseres Kontakt- oder Buchungsformulars</strong></p>
            <p>Bei Fragen jeglicher Art bieten wir Ihnen die Möglichkeit, über ein auf der Website bereitgestelltes Formular Kontakt mit uns aufzunehmen. Dabei ist die Angabe einer gültigen E-Mail-Adresse sowie Ihres Namens und Ihrer Telefonnummer erforderlich, damit wir wissen, von wem die Anfrage stammt und um diese beantworten zu können. Die Datenverarbeitung zum Zwecke der Kontaktaufnahme erfolgt nach Art. 6 Abs. 1 S. 1 lit. a DSGVO auf Grundlage Ihrer freiwillig erteilten Einwilligung.</p>

            <h2>3. Weitergabe von Daten</h2>
            <p>Eine Übermittlung Ihrer persönlichen Daten an Dritte zu anderen als den im Folgenden aufgeführten Zwecken findet nicht statt. Wir geben Ihre persönlichen Daten nur an Dritte weiter, wenn: Sie Ihre ausdrückliche Einwilligung dazu erteilt haben, die Weitergabe zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen erforderlich ist oder eine gesetzliche Verpflichtung besteht.</p>

            <h2>4. Cookies</h2>
            <p>Wir setzen auf unserer Seite Cookies ein. Hierbei handelt es sich um kleine Dateien, die Ihr Browser automatisch erstellt und die auf Ihrem Endgerät gespeichert werden, wenn Sie unsere Seite besuchen. In dem Cookie werden Informationen abgelegt, die sich jeweils im Zusammenhang mit dem spezifisch eingesetzten Endgerät ergeben. Dies bedeutet jedoch nicht, dass wir dadurch unmittelbar Kenntnis von Ihrer Identität erhalten. Der Einsatz von Cookies dient einerseits dazu, die Nutzung unseres Angebots für Sie angenehmer zu gestalten.</p>

            <h2>5. Betroffenenrechte</h2>
            <p>Sie haben das Recht:<br />
            - gemäß Art. 15 DSGVO Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten zu verlangen;<br />
            - gemäß Art. 16 DSGVO unverzüglich die Berichtigung unrichtiger oder Vervollständigung Ihrer bei uns gespeicherten personenbezogenen Daten zu verlangen;<br />
            - gemäß Art. 17 DSGVO die Löschung Ihrer bei uns gespeicherten personenbezogenen Daten zu verlangen;<br />
            - gemäß Art. 7 Abs. 3 DSGVO Ihre einmal erteilte Einwilligung jederzeit gegenüber uns zu widerrufen.</p>
          </div>
        )}
      </div>
    </main>
  );
}
