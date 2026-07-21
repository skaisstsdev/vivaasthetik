import { setRequestLocale } from 'next-intl/server';

export default async function AgbPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="bg-white text-gray-900 min-h-screen">
      {/* Hero Section */}
      <div className="bg-[#0a0a0a] text-white pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide">
            {locale === 'ru' ? 'Условия и положения (AGB)' : 'Allgemeine Geschäftsbedingungen (AGB)'}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20">
        {locale === 'ru' ? (
          <div className="prose prose-lg text-gray-600 max-w-none">
            <h2>§1 Область применения</h2>
            <p>Настоящие Общие условия заключения сделок (AGB) применяются ко всем медицинским и эстетическим процедурам, консультациям и другим услугам, предоставляемым клиникой VIVA Ästhetik (Наталья Шналь) пациентам.</p>

            <h2>§2 Запись на прием и политика отмены</h2>
            <p>1. Приемы могут быть забронированы онлайн, по телефону или по электронной почте. Согласованный прием является обязательным.</p>
            <p>2. Если пациент не может явиться на прием, он обязан отменить или перенести его не позднее чем за <strong>24 часа</strong> до назначенного времени.</p>
            <p>3. В случае несвоевременной отмены (менее чем за 24 часа) или неявки без предупреждения, клиника оставляет за собой право выставить счет за неустойку.</p>

            <h2>§3 Цены и оплата</h2>
            <p>1. Все цены на эстетические процедуры указаны в евро и включают законный налог на добавленную стоимость, если не указано иное.</p>
            <p>2. Оплата производится непосредственно после процедуры. Принимаются наличные и распространенные дебетовые/кредитные карты (EC-Karte/Kreditkarte).</p>
            <p>3. Лечение проводится в рамках частной медицинской практики. Услуги не покрываются государственными больничными кассами (gesetzliche Krankenkassen).</p>

            <h2>§4 Ответственность</h2>
            <p>1. Врач несет ответственность за проведение процедур в соответствии с общепризнанными медицинскими стандартами.</p>
            <p>2. Пациент обязан предоставить полную и правдивую информацию о своем здоровье (включая аллергии и принимаемые лекарства) до начала процедуры. Врач не несет ответственности за осложнения, возникшие из-за сокрытия важной медицинской информации.</p>
            <p>3. В эстетической медицине нельзя гарантировать стопроцентный специфический визуальный результат, так как каждый организм реагирует индивидуально.</p>
          </div>
        ) : (
          <div className="prose prose-lg text-gray-600 max-w-none">
            <h2>§1 Geltungsbereich</h2>
            <p>Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle medizinischen und ästhetischen Behandlungen, Beratungen und sonstigen Leistungen, die von der Praxis VIVA Ästhetik (Natalya Schnal) an Patienten erbracht werden.</p>

            <h2>§2 Terminvereinbarung und Stornierungsbedingungen</h2>
            <p>1. Termine können online, telefonisch oder per E-Mail vereinbart werden. Ein vereinbarter Termin ist verbindlich.</p>
            <p>2. Kann ein Patient einen Termin nicht wahrnehmen, ist er verpflichtet, diesen spätestens <strong>24 Stunden</strong> vor dem vereinbarten Zeitpunkt abzusagen oder zu verschieben.</p>
            <p>3. Bei nicht fristgerechter Absage (weniger als 24 Stunden) oder Nichterscheinen ohne vorherige Absage behält sich die Praxis das Recht vor, ein Ausfallhonorar in Rechnung zu stellen.</p>

            <h2>§3 Preise und Zahlungsbedingungen</h2>
            <p>1. Alle Preise für ästhetische Behandlungen verstehen sich in Euro und beinhalten die gesetzliche Mehrwertsteuer, sofern nicht anders angegeben.</p>
            <p>2. Die Zahlung erfolgt unmittelbar nach der Behandlung. Akzeptiert werden Barzahlung sowie gängige EC- und Kreditkarten.</p>
            <p>3. Die Behandlungen erfolgen als Privatleistung. Eine Abrechnung über die gesetzlichen Krankenkassen ist nicht möglich.</p>

            <h2>§4 Haftung</h2>
            <p>1. Die Ärztin haftet für die Erbringung der Leistungen nach den allgemein anerkannten medizinischen Standards.</p>
            <p>2. Der Patient ist verpflichtet, vor Behandlungsbeginn vollständige und wahrheitsgemäße Angaben zu seinem Gesundheitszustand (inkl. Allergien und Medikamenteneinnahme) zu machen. Für Komplikationen, die auf verschwiegenen Gesundheitsinformationen beruhen, wird keine Haftung übernommen.</p>
            <p>3. In der ästhetischen Medizin kann ein hundertprozentiger spezifischer optischer Erfolg nicht garantiert werden, da jeder Körper individuell auf Behandlungen reagiert.</p>
          </div>
        )}
      </div>
    </main>
  );
}
