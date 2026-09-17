/* ============================================================
   4else — typed navigation helpers (v4 `createNavigation`)
   ------------------------------------------------------------
   Use these instead of next/link + next/navigation so the locale
   prefix is always injected and routes stay typed against
   lib/routing.ts.
   ============================================================ */

import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
