export type ServiceLocale = 'de' | 'ru';

export type LocalizedContent = Record<ServiceLocale, string>;

export interface BookingDetails {
  duration: { de: string; ru: string };
  pain: { de: string; ru: string };
  anesthesia: { de: string; ru: string };
  recovery: { de: string; ru: string };
  restrictions: { de: string; ru: string };
  onset: { de: string; ru: string };
  durationOfEffect: { de: string; ru: string };
  cost: { de: string; ru: string };
  course?: { de: string; ru: string };
}

// Ручная раскладка страницы услуги. Если она задана, страница строится по ней,
// иначе текст разбирается автоматически (см. lib/serviceContent.ts).
export interface ServiceLayoutLocale {
  /** Крупный заголовок по центру и вводный абзац под ним. */
  intro: { title: string; html: string };
  /** Области применения, сгруппированные по категориям. */
  areas?: { title: string; groups: { title: string; items: string[] }[] };
  /** Остальные блоки: заголовок по центру, под ним текст. */
  blocks: { title: string; html: string }[];
  /** Противопоказания отдельным блоком. */
  contraindications?: { title: string; items: string[]; note?: string };
  /** Вопросы, перенесённые в «Частые вопросы» этой услуги (идут первыми). */
  faq?: { q: string; a: string }[];
}

export type ServiceContent = {
  slug: string;
  imageSrc?: string;
  title: LocalizedContent;
  shortDescription: LocalizedContent;
  content: LocalizedContent;
  bookingDetails?: BookingDetails;
  hideBookingButton?: boolean;
  layout?: Record<ServiceLocale, ServiceLayoutLocale>;
};
