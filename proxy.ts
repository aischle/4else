/* ============================================================
   4else — next-intl proxy (locale prefix)
   ------------------------------------------------------------
   Enforces the locale prefix defined in lib/routing.ts. The
   matcher skips Next internals and any path with a file
   extension, so images and icons are served directly.
   Next 16 calls this file proxy.ts (it was middleware.ts);
   next-intl still names its factory createMiddleware.
   ============================================================ */

import createMiddleware from 'next-intl/middleware';
import { routing } from './lib/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!_next|_vercel|api|.*\\..*).*)'],
};
