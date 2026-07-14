import { ServiceContent } from './types';

export const intimlifting: ServiceContent = {
  slug: 'intimlifting',
  imageSrc: '/images/services/intim_final.webp',
  title: {
    de: 'Intimlifting',
    ru: 'Интимный лифтинг'
  },
  shortDescription: {
    de: 'Das Intimlifting ist eine moderne, minimalinvasive Behandlung zur sanften Straffung und Verjüngung des Intimbereichs. Durch den Einsatz innovativer Methoden wird die Elastizität des Gewebes verbessert, die Hautstruktur gestärkt und das ästhetische Erscheinungsbild harmonisch optimiert. Diese diskrete und effektive Therapie trägt nicht nur zu einem gesteigerten Wohlbefinden bei, sondern unterstützt auch das persönliche Selbstvertrauen.',
    ru: 'Интимлифтинг — это современное, минимально инвазивное лечение для мягкого подтягивания и омоложения интимной зоны. С помощью инновационных методов улучшается эластичность тканей, укрепляется структура кожи и гармонично оптимизируется эстетический вид. Эта дискретная и эффективная терапия способствует не только повышению благополучия, но и поддерживает личную уверенность.'
  },
  content: {
    de: `
<h3>Was ist ein „Intimlifting“?</h3>
<p>Das Intimlifting ist eine moderne, minimalinvasive Behandlung zur sanften Straffung und Verjüngung des Intimbereichs.</p>

<p>Durch den Einsatz innovativer Methoden wird die Elastizität des Gewebes verbessert, die Hautstruktur gestärkt und das ästhetische Erscheinungsbild harmonisch optimiert.</p>

<p>Diese diskrete und effektive Therapie trägt nicht nur zu einem gesteigerten Wohlbefinden bei, sondern unterstützt auch das persönliche Selbstvertrauen.</p>
    `,
    ru: `
<h3>Что такое "интимный лифтинг"?</h3>
<p>Интим-лифтинг - это современная малоинвазивная процедура для мягкого подтяжки и омоложения интимной зоны.</p>
<p>Использование инновационных методов повышает эластичность тканей, укрепляет текстуру кожи и гармонично оптимизирует эстетический вид.</p>
<p>Эта сдержанная и эффективная терапия не только способствует улучшению самочувствия, но и поддерживает личную уверенность в себе.</p>
    `
  },
  bookingDetails: {
    duration: { de: 'ca. 30–60 Minuten', ru: 'около 30–60 минут' },
    pain: { de: 'leicht bis mittel, individuell unterschiedlich', ru: 'лёгкие до умеренных, индивидуально' },
    anesthesia: { de: 'oberflächliche oder lokale Betäubung', ru: 'поверхностная или местная анестезия' },
    recovery: { de: 'in der Regel sofort', ru: 'как правило, возможна сразу' },
    restrictions: { de: '2–5 Tage Verzicht auf Geschlechtsverkehr, Sport, Sauna', ru: '2–5 дней — воздержание от половых контактов, физических нагрузок и посещения сауны' },
    onset: { de: 'sofort sichtbar', ru: 'результаты видны сразу' },
    durationOfEffect: { de: '9–18 Monate (je nach Produkt und Stoffwechsel)', ru: '9–18 месяцев (в зависимости от используемого препарата и метаболизма)' },
    cost: { de: 'individuell nach Materialverbrauch und Behandlungsziel, ab 300 €', ru: 'рассчитывается индивидуально в зависимости от объёма препарата и цели лечения, от 300 €' }
  }
};
