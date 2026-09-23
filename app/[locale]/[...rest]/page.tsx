import { notFound } from 'next/navigation';

/* ============================================================
   4else — catch-all inside the locale segment
   ------------------------------------------------------------
   Without this, an unknown URL falls through to Next's own
   global 404, which renders outside the locale layout: no nav,
   no footer, no German. Catching it here hands it to
   ./not-found.tsx instead, which sits inside the layout and so
   keeps the whole frame.

   Real routes are static and always win over this catch-all.
   ============================================================ */

export default function CatchAll() {
  notFound();
}
