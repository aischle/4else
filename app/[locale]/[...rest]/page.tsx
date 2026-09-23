import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

/* ============================================================
   4else — catch-all inside the locale segment
   ------------------------------------------------------------
   Without this, an unknown URL falls through to Next's own
   global 404, which renders outside the locale layout: no nav,
   no footer, no German. Catching it here hands it to
   ./not-found.tsx instead, which sits inside the layout and so
   keeps the whole frame.

   Real routes are static and always win over this catch-all.

   The metadata below is this segment's; whether Next keeps it
   once the segment throws notFound() is verified in the browser
   rather than assumed. Either way the 404 status is what keeps
   the page out of search indexes.
   ============================================================ */

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'notFound' });

  return {
    title: t('metaTitle'),
    robots: { index: false, follow: true },
  };
}

export default function CatchAll() {
  notFound();
}
