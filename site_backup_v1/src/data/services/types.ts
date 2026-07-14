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

export type ServiceContent = {
  slug: string;
  imageSrc?: string;
  title: LocalizedContent;
  shortDescription: LocalizedContent;
  content: LocalizedContent;
  bookingDetails?: BookingDetails;
};
