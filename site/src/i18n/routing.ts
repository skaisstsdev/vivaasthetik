import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';
 
export const routing = defineRouting({
  locales: ['de', 'ru'],
  defaultLocale: 'de',
  localeDetection: false
});
 
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
