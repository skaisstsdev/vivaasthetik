import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

// В Next 16 файл `middleware` переименован в `proxy` (старое имя устарело).
export const proxy = createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
