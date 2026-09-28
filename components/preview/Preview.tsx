'use client';

import dynamic from 'next/dynamic';

/* ============================================================
   4else — the preview's entry point
   ------------------------------------------------------------
   The locale layout renders this only in draft mode. The
   overlays and the exit bar are loaded lazily from here, because
   a layout's client components are bundled into every page
   whether they render or not: imported directly, next-sanity's
   overlay code (~590 KB) reached every visitor. Now only this
   stub ships; the rest loads when the preview is on.
   ============================================================ */

const PreviewTools = dynamic(() => import('./PreviewTools'), { ssr: false });

export function Preview() {
  return <PreviewTools />;
}
