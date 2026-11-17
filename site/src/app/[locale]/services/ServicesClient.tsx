import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { ServiceContent } from '@/data/services/types';
import BookNowButton from '@/components/booking/BookNowButton';
import { btnRowGold } from '@/lib/ui';
import { serviceGroups as groups } from '@/data/serviceGroups';

interface ServicesClientProps {
  services: ServiceContent[];
  loc: 'de' | 'ru';
}

export default function ServicesClient({ services, loc }: ServicesClientProps) {
  const known = new Set(groups.flatMap((g) => g.slugs));
  const rest = services.filter((s) => !known.has(s.slug));
  const sections = [
    ...groups.map((g) => ({
      title: g.title[loc],
      items: g.slugs
        .map((slug) => services.find((s) => s.slug === slug))
        .filter((s): s is ServiceContent => Boolean(s)),
    })),
    ...(rest.length ? [{ title: loc === 'de' ? 'Weitere Behandlungen' : 'Другие процедуры', items: rest }] : []),
  ].filter((s) => s.items.length > 0);

  let counter = 0;

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-16 md:gap-20">
      {sections.map((section) => (
        <section key={section.title} aria-labelledby={`grp-${section.title}`}>
          <h2
            id={`grp-${section.title}`}
            className="text-sm md:text-base tracking-[0.25em] text-[#8a6327] mb-2"
          >
            {section.title}
          </h2>
          <ul className="border-b border-gray-200">
            {section.items.map((service) => {
              counter += 1;
              return (
                <li
                  key={service.slug}
                  className="border-t border-gray-200 py-8 md:py-10 grid gap-5 md:grid-cols-[3.5rem_1fr_auto] md:gap-8 md:items-center"
                >
                  <span className="hidden md:block text-sm font-mono tracking-widest text-gray-400">
                    {String(counter).padStart(2, '0')}
                  </span>

                  <div className="min-w-0">
                    <h3 className="text-2xl md:text-3xl text-gray-900 leading-tight break-words mb-3">
                      <Link
                        href={`/services/${service.slug}`}
                        className="hover:text-[#8a6327] transition-colors"
                      >
                        {service.title[loc]}
                      </Link>
                    </h3>
                    <p className="text-gray-600 leading-relaxed line-clamp-2 md:line-clamp-3 max-w-2xl">
                      {service.shortDescription[loc]}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 md:justify-end">
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center gap-2 h-11 text-xs md:text-sm uppercase tracking-[0.2em] font-medium text-gray-800 hover:text-[#8a6327] transition-colors"
                    >
                      {loc === 'de' ? 'Mehr erfahren' : 'Подробнее'}
                      <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                    {!service.hideBookingButton && (
                      <BookNowButton serviceSlug={service.slug} className={btnRowGold}>
                        {loc === 'de' ? 'Termin buchen' : 'Записаться'}
                      </BookNowButton>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
