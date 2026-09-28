'use client';

import { ExitPreview } from './ExitPreview';
import { PreviewOverlays } from './PreviewOverlays';

/* Loaded lazily by ./Preview, so none of this reaches visitors. */
export default function PreviewTools() {
  return (
    <>
      <PreviewOverlays />
      <ExitPreview />
    </>
  );
}
