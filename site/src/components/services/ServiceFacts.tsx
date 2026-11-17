import { BookingDetails } from '@/data/services/types';

const labels: { key: keyof BookingDetails; de: string; ru: string }[] = [
  { key: 'duration', de: 'Dauer', ru: 'Длительность' },
  { key: 'onset', de: 'Ergebnis sichtbar', ru: 'Результат виден' },
  { key: 'durationOfEffect', de: 'Wirkdauer', ru: 'Длительность эффекта' },
  { key: 'recovery', de: 'Alltagstauglich', ru: 'Возвращение к делам' },
  { key: 'anesthesia', de: 'Betäubung', ru: 'Обезболивание' },
  { key: 'pain', de: 'Schmerzen', ru: 'Ощущения' },
];

// Плитки «Auf einen Blick» из данных услуги (bookingDetails). Стоимость здесь
// намеренно не выводится.
export default function ServiceFacts({ details, loc }: { details: BookingDetails; loc: 'de' | 'ru' }) {
  const items = labels
    .map((l) => ({ label: l[loc], value: (details[l.key] as { de: string; ru: string } | undefined)?.[loc] }))
    .filter((i): i is { label: string; value: string } => Boolean(i.value));
  if (!items.length) return null;

  return (
    <section aria-labelledby="facts-title" className="bg-gray-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-14 md:py-16">
        <h2 id="facts-title" className="text-sm md:text-base tracking-[0.25em] text-[#8a6327] mb-8">
          {loc === 'de' ? 'Auf einen Blick' : 'Коротко о процедуре'}
        </h2>
        <dl className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 md:gap-y-10">
          {items.map((i) => (
            <div key={i.label} className="border-l border-[#c9a84c] pl-5">
              <dt className="text-xs uppercase tracking-[0.15em] text-gray-500 mb-2 break-words">{i.label}</dt>
              <dd className="text-gray-900 text-base md:text-lg leading-snug">{i.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
