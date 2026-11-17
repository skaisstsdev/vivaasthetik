import ServiceFaqList from './ServiceFaqList';
import { Link } from '@/i18n/routing';
import { faqData } from '@/data/faq';

// Какие разделы общего FAQ относятся к какой услуге.
const faqBySlug: Record<string, string[]> = {
  botox: ['botox'],
  mesotherapie: ['meso'],
  biorevitalisierung: ['meso'],
  faltenunterspritzung: ['fillers'],
  lippenkorrektur: ['fillers'],
  vampirlifting: ['prp'],
  'prp-kopfhaut': ['prp'],
  fadenlifting: ['pdo'],
  radiesse: ['radiesse-profhilo'],
  lipolyse: ['lipolysis'],
};

export default function ServiceFaq({
  slug,
  loc,
  extra = [],
}: {
  slug: string;
  loc: 'de' | 'ru';
  extra?: { q: string; a: string }[];
}) {
  const ids = faqBySlug[slug] ?? ['general'];
  const own = faqData
    .filter((c) => ids.includes(c.id))
    .flatMap((c) => c.items)
    .map((i) => ({ id: `faq-${i.id}`, q: i.q[loc], a: i.a[loc] }));
  // Вопросы, перенесённые со страницы услуги, идут первыми.
  const items = [...extra.map((e, i) => ({ id: `extra-${i}`, q: e.q, a: e.a })), ...own].slice(0, 8);
  if (!items.length) return null;

  return (
    <section aria-labelledby="faq-title" className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-24 md:py-32 grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-20">
        <div className="lg:sticky lg:top-32 self-start">
          <p className="text-sm tracking-[0.25em] text-[#8a6327] uppercase mb-4">FAQ</p>
          <h2 id="faq-title" className="text-3xl md:text-4xl text-gray-900 leading-tight mb-6">
            {loc === 'de' ? 'Häufige Fragen' : 'Частые вопросы'}
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            {loc === 'de'
              ? 'Antworten auf die Fragen, die uns zu dieser Behandlung am häufigsten gestellt werden.'
              : 'Ответы на вопросы, которые нам чаще всего задают об этой процедуре.'}
          </p>
          <Link
            href="/faq"
            className="inline-flex items-center h-11 text-xs md:text-sm uppercase tracking-[0.2em] font-medium text-gray-800 hover:text-[#8a6327] transition-colors"
          >
            {loc === 'de' ? 'Alle Fragen ansehen →' : 'Все вопросы →'}
          </Link>
        </div>

        <ServiceFaqList items={items} />
      </div>
    </section>
  );
}
