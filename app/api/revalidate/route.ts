import { revalidatePath } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

/* ============================================================
   4else — Sanity webhook: refresh the blog at once
   ------------------------------------------------------------
   Configured in sanity.io/manage → project 4else → API →
   Webhooks: POST to https://<domain>/api/revalidate, filter
   _type == "article", header x-webhook-secret = the value of
   SANITY_REVALIDATE_SECRET in Vercel. Without it, pages still
   refresh on their own within 60 seconds.

   The middleware matcher skips /api, so no locale prefix here.
   ============================================================ */

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret || request.headers.get('x-webhook-secret') !== secret) {
    return NextResponse.json({ revalidated: false }, { status: 401 });
  }

  revalidatePath('/[locale]/inspirationen', 'page');
  revalidatePath('/[locale]/inspirationen/[slug]', 'page');
  revalidatePath('/sitemap.xml');

  return NextResponse.json({ revalidated: true, now: Date.now() });
}

export function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
