/* ============================================================
   4else — next-intl request config (v4 `getRequestConfig`)
   ------------------------------------------------------------
   Referenced by next.config.mjs. Validates the locale and loads
   its message file, falling back to the default (German) for
   locales that are routed but not yet translated.
   ============================================================ */

import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, locales, type Locale } from './i18n';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: Locale = locales.includes(requested as Locale)
    ? (requested as Locale)
    : defaultLocale;

  let messages;
  try {
    messages = (await import(`../messages/${locale}.json`)).default;
  } catch {
    messages = (await import(`../messages/${defaultLocale}.json`)).default;
  }

  return { locale, messages };
});
