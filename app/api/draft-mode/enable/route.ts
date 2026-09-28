import { defineEnableDraftMode } from 'next-sanity/draft-mode';
import { readToken, sanityClient } from '@/lib/sanity';

/* ============================================================
   4else — preview on (draft mode)
   ------------------------------------------------------------
   Called by the Studio's Vorschau tool (presentationTool in
   studio/sanity.config.ts) with a one-time secret. next-sanity
   checks that secret against Sanity with the read token, turns
   on Next's draft mode for this browser (cookies that also work
   inside the Studio's iframe) and redirects to the page asked
   for. A request without a valid secret gets a 401, so a visitor
   cannot switch the preview on.

   Without SANITY_API_READ_TOKEN (.env.local, Vercel) there is
   no preview: the route says so instead of failing with a 500.
   ============================================================ */

const enable = readToken
  ? defineEnableDraftMode({ client: sanityClient.withConfig({ token: readToken }) }).GET
  : null;

export async function GET(request: Request) {
  if (!enable) {
    return new Response('Preview not configured: SANITY_API_READ_TOKEN is missing.', {
      status: 503,
    });
  }
  return enable(request);
}
