/* ============================================================
   4else — next-intl routing (v4 `defineRouting`)
   ------------------------------------------------------------
   `localePrefix: 'as-needed'`: German, the default, is served
   bare (`/`), other locales carry a prefix (`/en`).

   `localeDetection: false`: every visitor lands on German unless
   they ask for another locale. With detection on, an English
   browser would be redirected to /en — which today only shows
   the German fallback.
   ============================================================ */

import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale } from './i18n';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: false,
  pathnames: {
    '/': '/',
    '/kontakt': '/kontakt',
    '/inspirationen': '/inspirationen',
    '/inspirationen/[slug]': '/inspirationen/[slug]',
  },
});
