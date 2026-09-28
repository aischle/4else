import { draftMode } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

/* ============================================================
   4else — preview off
   ------------------------------------------------------------
   The "Vorschau beenden" pill (components/preview/ExitPreview)
   links here when the preview is open outside the Studio. Ends
   draft mode and returns to the same page, now published. Only
   a path on this site is accepted as the way back.
   ============================================================ */

export async function GET(request: NextRequest) {
  (await draftMode()).disable();

  const back = request.nextUrl.searchParams.get('redirect') ?? '/';
  const path = back.startsWith('/') && !back.startsWith('//') ? back : '/';
  return NextResponse.redirect(new URL(path, request.url));
}
