/* ============================================================
   4else — site constants
   ------------------------------------------------------------
   The production domain is not decided yet, so the origin comes
   from NEXT_PUBLIC_SITE_URL (see .env.example) and falls back to
   the local dev server.
   ============================================================ */

export const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3007'
).replace(/\/$/, '');

export const SITE_NAME = '4else';
