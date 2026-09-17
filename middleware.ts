/* ============================================================
   4else — next-intl middleware (locale prefix)
   ------------------------------------------------------------
   Enforces the locale prefix defined in lib/routing.ts. The
   matcher skips Next internals and any path with a file
   extension, so images and icons are served directly.
   ============================================================ */

import createMiddleware from 'next-intl/middleware';
import { routing } from './lib/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!_next|_vercel|api|.*\\..*).*)'],
};
