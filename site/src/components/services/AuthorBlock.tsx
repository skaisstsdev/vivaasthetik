import Image from 'next/image';
import { Link } from '@/i18n/routing';

// Блок «Ваш врач» на страницах услуг: показывает, кто проводит лечение.
// Для медицинских тем Google оценивает именно это (кто автор и какая у него квалификация).
// Текст собран из страницы «Обо мне», новых фактов здесь нет.
const copy = {
  de: {
    eyebrow: 'Ihre Ärztin',
    name: 'Natalya Schnal',
    role: 'Ärztin, Praxis für ästhetische Medizin in Kassel',
    text: 'Studium der Medizin an der Medizinischen Universität in Kasachstan (1997) und Tätigkeit als Ärztin für Innere Medizin mit Schwerpunkt Endokrinologie. Seit 2016 in Deutschland, Anerkennung des Arztabschlusses und Tätigkeit in Kliniken und Praxen. Heute liegt ihr Schwerpunkt auf der ästhetischen Medizin.',
    link: 'Mehr über Natalya Schnal',
    alt: 'Ärztin Natalya Schnal',
  },
  ru: {
    eyebrow: 'Ваш врач',
    name: 'Наталья Шналь',
    role: 'Врач, практика эстетической медицины в Касселе',
    text: 'Окончила Медицинский университет в Казахстане (1997), работала врачом-терапевтом с акцентом на эндокринологию. С 2016 года в Германии, диплом признан, работала в клиниках и практиках. Сегодня основное направление её работы — эстетическая медицина.',
    link: 'Подробнее о враче',
    alt: 'Врач Наталья Шналь',
  },
};

export default function AuthorBlock({ loc }: { loc: 'de' | 'ru' }) {
  const c = copy[loc];
  return (
    <section aria-labelledby="author-title" className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-6 md:px-8 py-16 md:py-20 grid grid-cols-[minmax(0,1fr)] md:grid-cols-[auto_minmax(0,1fr)] gap-8 md:gap-12 items-center">
        <div className="relative h-36 w-36 md:h-44 md:w-44 overflow-hidden bg-white border border-gray-200 mx-auto md:mx-0">
          <Image src="/images/about/natalia.webp" alt={c.alt} fill sizes="176px" className="object-cover object-top" />
        </div>
        <div className="text-center md:text-left">
          <p className="text-xs uppercase tracking-[0.3em] text-[#8a6327] mb-3">{c.eyebrow}</p>
          <h2 id="author-title" className="text-2xl md:text-3xl text-gray-900 leading-tight mb-2">
            {c.name}
          </h2>
          <p className="text-gray-500 mb-4">{c.role}</p>
          <p className="text-gray-700 leading-relaxed mb-5 max-w-2xl">{c.text}</p>
          <Link
            href="/about"
            className="inline-flex items-center h-11 text-xs md:text-sm uppercase tracking-[0.2em] font-medium text-gray-800 hover:text-[#8a6327] transition-colors"
          >
            {c.link} →
          </Link>
        </div>
      </div>
    </section>
  );
}
