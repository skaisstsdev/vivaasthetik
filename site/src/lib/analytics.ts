// Отправка событий в Google Analytics 4. Работает только если GA включён (есть ID и согласие);
// иначе ничего не делает, поэтому вызывать можно везде.
type Gtag = (command: 'event', name: string, params?: Record<string, unknown>) => void;

export function track(name: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag === 'function') gtag('event', name, params);
}

export const CONSENT_KEY = 'cookie_consent';
export const CONSENT_EVENT = 'viva-consent-changed';
