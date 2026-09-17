/* ============================================================
   4else — locale config (CLAUDE.md §4)
   ------------------------------------------------------------
   German is the default and, for now, the only authored
   language. en/fr/it are declared so their routes already
   resolve; until their message files exist they fall back to
   German (lib/i18n-request.ts).
   ============================================================ */

export const locales = ['de', 'en', 'fr', 'it'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'de';

/* Locales with an authored message file. Adding a language is a
   one-line change here once its file exists. */
export const enabledLocales: readonly Locale[] = ['de'];
