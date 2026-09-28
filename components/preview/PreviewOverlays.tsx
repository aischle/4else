'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { VisualEditing } from 'next-sanity/visual-editing/client-component';
import { perspectiveChangeAction } from 'next-sanity/visual-editing/server-actions';

/* ============================================================
   4else — click-to-edit overlays (preview only)
   ------------------------------------------------------------
   Mounted by the locale layout only in draft mode. next-sanity's
   <VisualEditing> reads the stega markers in the page's texts,
   draws the overlays that open a field in the Studio, and keeps
   the Studio and the page on the same URL.

   It wraps next-sanity's client component rather than using its
   server one, because only here can a refresh handler be
   passed: next-sanity leaves edits ("mutation") to the Live
   Content API, which 4else does not use, so without this the
   page would only update on a manual reload. router.refresh()
   re-runs the server components, which fetch the draft again.

   perspectiveChangeAction is next-sanity's own (marked
   internal): it stores the Studio's Entwürfe / Veröffentlicht
   choice in the cookie lib/sanity.ts reads. next-sanity is
   pinned to an exact version in package.json for that reason;
   check this file when upgrading it.
   ============================================================ */

type Refresh = { source: 'manual' | 'mutation'; livePreviewEnabled: boolean };

export function PreviewOverlays() {
  const router = useRouter();

  const refresh = useCallback(
    (payload: Refresh) => {
      if (payload.livePreviewEnabled) return false;
      router.refresh();
      /* The promise tells the Studio when to stop its spinner. */
      return new Promise<void>((resolve) => setTimeout(resolve, 1000));
    },
    [router],
  );

  return <VisualEditing refresh={refresh} onPerspectiveChange={perspectiveChangeAction} />;
}
