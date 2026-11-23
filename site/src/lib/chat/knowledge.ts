import { servicesData } from '@/data/services';
import { serviceGroups } from '@/data/serviceGroups';
import { prices } from '@/data/prices';
import { faqData } from '@/data/faq';
import type { ServiceContent } from '@/data/services/types';

export type Loc = 'de' | 'ru';

// ---------- Вспомогательное ----------

function stripHtml(html: string): string {
  return html
    .replace(/<li[^>]*>/gi, '\n- ')
    .replace(/<\/(p|h[1-6]|ul|ol|div)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n')
    .trim();
}

const norm = (s: string) => s.toLowerCase().replace(/ё/g, 'е');

// Слова-запросы, по которым бот находит услугу. Корень слова достаточно, поиск идёт по вхождению.
const SYNONYMS: Record<string, string[]> = {
  botox: ['botox', 'botoks', 'botulin', 'ботокс', 'ботулин', 'морщин', 'falten', 'mimik', 'schweiß', 'hyperhidrose', 'мигрен', 'migräne', 'потлив'],
  faltenunterspritzung: ['filler', 'філер', 'wrinkle filler', 'hyaluron', 'филлер', 'гиалурон', 'faltenunterspritzung', 'unterspritz', 'объем', 'объём', 'volumen', 'скул', 'jochbein', 'kinn', 'подбород'],
  lippenkorrektur: ['lip ', 'lips', 'губи', 'dudak', 'lippe', 'lippen', 'губ', 'lips'],
  biorevitalisierung: ['biorevital', 'биоревитал', 'увлажнен', 'hydration', 'skinbooster'],
  mesotherapie: ['mesother', 'мезотер', 'мезо', 'коктейл'],
  vampirlifting: ['vampir', 'prp', 'вампир', 'плазмолифтинг', 'eigenblut', 'плазм'],
  radiesse: ['radiesse', 'радиесс', 'kollagenstimul', 'коллаген', 'calciumhydroxyl'],
  fadenlifting: ['faden', 'нит', 'мезонит', 'lifting', 'лифтинг', 'thread'],
  haarausfall: ['haar', 'волос', 'выпаден', 'haarausfall', 'alopez', 'лысен'],
  'prp-kopfhaut': ['kopfhaut', 'кожа головы', 'головы', 'prp', 'scalp'],
  lipolyse: ['lipolyse', 'липолиз', 'fett', 'жир', 'doppelkinn', 'двойной подбород', 'abnehm'],
  intimlifting: ['intim', 'интим', 'женск', 'vaginal'],
};

function flattenLayout(svc: ServiceContent, loc: Loc): string | null {
  const l = svc.layout?.[loc];
  if (!l) return null;
  const parts: string[] = [];
  parts.push(`${l.intro.title}\n${stripHtml(l.intro.html)}`);
  if (l.areas) {
    parts.push(
      `${l.areas.title}:\n` +
        l.areas.groups.map((g) => `${g.title}: ${g.items.join(', ')}`).join('\n'),
    );
  }
  for (const b of l.blocks) parts.push(`${b.title}\n${stripHtml(b.html)}`);
  if (l.contraindications) {
    parts.push(
      `${l.contraindications.title}:\n- ${l.contraindications.items.join('\n- ')}` +
        (l.contraindications.note ? `\n${l.contraindications.note}` : ''),
    );
  }
  if (l.faq?.length) {
    parts.push(l.faq.map((f) => `Q: ${f.q}\nA: ${stripHtml(f.a)}`).join('\n'));
  }
  return parts.join('\n\n');
}

const BOOKING_LABELS: Record<Loc, Record<string, string>> = {
  de: {
    duration: 'Dauer', pain: 'Schmerzen', anesthesia: 'Betäubung', recovery: 'Gesellschaftsfähigkeit',
    restrictions: 'Einschränkungen', onset: 'Wirkungseintritt', durationOfEffect: 'Haltbarkeit',
    cost: 'Kosten', course: 'Behandlungsverlauf',
  },
  ru: {
    duration: 'Длительность', pain: 'Боль', anesthesia: 'Обезболивание', recovery: 'Возвращение к делам',
    restrictions: 'Ограничения', onset: 'Начало эффекта', durationOfEffect: 'Длительность эффекта',
    cost: 'Стоимость', course: 'Ход процедуры',
  },
};

function priceLine(slug: string, loc: Loc): string {
  const p = prices[slug];
  if (!p) return '';
  if (p.price == null) return loc === 'de' ? 'Preis: nach Beratung' : 'Цена: после консультации';
  const basis = p.basis?.[loc] ? ` (${p.basis[loc]})` : '';
  return loc === 'de'
    ? `Preis: ${p.from ? 'ab ' : ''}${p.price} €${basis}`
    : `Цена: ${p.from ? 'от ' : ''}${p.price} €${basis}`;
}

const MAX_SERVICE_CHARS = 12000;

function serviceDoc(svc: ServiceContent, loc: Loc): string {
  const body = flattenLayout(svc, loc) ?? stripHtml(svc.content[loc]);
  const lines: string[] = [`### ${svc.title[loc]} (slug: ${svc.slug})`, priceLine(svc.slug, loc)];
  if (svc.bookingDetails) {
    const labels = BOOKING_LABELS[loc];
    for (const [k, v] of Object.entries(svc.bookingDetails)) {
      const val = (v as { de: string; ru: string })[loc];
      if (val) lines.push(`${labels[k] ?? k}: ${val}`);
    }
  }
  lines.push('', body.length > MAX_SERVICE_CHARS ? body.slice(0, MAX_SERVICE_CHARS) + ' …' : body);
  return lines.filter((l) => l !== undefined).join('\n');
}

// ---------- Постоянная часть (идёт в каждый запрос, кэшируется OpenAI) ----------

export function serviceOverview(loc: Loc): string {
  const groups = serviceGroups
    .map((g) => {
      const items = g.slugs
        .map((slug) => servicesData.find((s) => s.slug === slug))
        .filter((s): s is ServiceContent => !!s)
        .map((s) => `  - ${s.title[loc]} [slug: ${s.slug}] — ${priceLine(s.slug, loc)}`);
      return `${g.title[loc]}:\n${items.join('\n')}`;
    })
    .join('\n');
  return groups;
}

// ---------- Поиск по запросу ----------

function relevantServices(query: string, max = 2): ServiceContent[] {
  const q = norm(query);
  const scored = servicesData
    .map((svc) => {
      let score = 0;
      for (const kw of SYNONYMS[svc.slug] ?? []) if (q.includes(norm(kw))) score += kw.length > 4 ? 3 : 2;
      for (const l of ['de', 'ru'] as const) {
        const title = norm(svc.title[l]).replace(/[®™()]/g, '');
        for (const w of title.split(/\s+/)) if (w.length > 4 && q.includes(w.slice(0, 6))) score += 2;
      }
      return { svc, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, max).map((x) => x.svc);
}

function tokens(s: string): string[] {
  return Array.from(
    new Set(
      norm(s)
        .split(/[^a-zа-яäöüß0-9]+/i)
        .filter((w) => w.length >= 4)
        .map((w) => w.slice(0, 6)),
    ),
  );
}

type FaqItem = { q: Record<Loc, string>; a: Record<Loc, string> };

function relevantFaq(query: string, loc: Loc, max = 4): string[] {
  const qt = tokens(query);
  if (!qt.length) return [];
  const all: FaqItem[] = faqData.flatMap((c) => c.items as unknown as FaqItem[]);
  return all
    .map((it) => {
      const hay = norm(`${it.q[loc]} ${it.a[loc]}`);
      const qh = norm(it.q[loc]);
      let score = 0;
      for (const t of qt) {
        if (qh.includes(t)) score += 3;
        else if (hay.includes(t)) score += 1;
      }
      return { it, score };
    })
    .filter((x) => x.score >= 4)
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map((x) => `Q: ${x.it.q[loc]}\nA: ${stripHtml(x.it.a[loc]).slice(0, 1800)}`);
}

function quickFacts(loc: Loc): string {
  const labels = BOOKING_LABELS[loc];
  return servicesData
    .map((svc) => {
      const lines = [`### ${svc.title[loc]} (slug: ${svc.slug})`, priceLine(svc.slug, loc)];
      if (svc.bookingDetails) {
        for (const k of ['duration', 'pain', 'anesthesia', 'onset', 'durationOfEffect', 'restrictions'] as const) {
          const v = svc.bookingDetails[k]?.[loc];
          if (v) lines.push(`${labels[k]}: ${v}`);
        }
      }
      return lines.filter(Boolean).join('\n');
    })
    .join('\n\n');
}

/** Контекст из сайта под конкретный вопрос: подходящие услуги и пункты FAQ. */
export function retrieveContext(query: string, loc: Loc): string {
  const svcs = relevantServices(query);
  const faq = relevantFaq(query, loc);
  const out: string[] = [];
  // Ни одна услуга не распознана (например, вопрос на другом языке): даём краткие факты по всем
  if (!svcs.length) out.push('## QUICK FACTS FOR ALL TREATMENTS (source of truth)\n' + quickFacts(loc));
  if (svcs.length) out.push('## SERVICE PAGES (source of truth)\n' + svcs.map((s) => serviceDoc(s, loc)).join('\n\n'));
  if (faq.length) out.push('## FAQ ENTRIES\n' + faq.join('\n\n'));
  return out.join('\n\n');
}

export const SERVICE_SLUGS = servicesData.map((s) => s.slug);
