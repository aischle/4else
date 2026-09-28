import {EyeOpenIcon} from '@sanity/icons/EyeOpen'
import {defineDocuments, defineLocations, presentationTool} from 'sanity/presentation'

/* ============================================================
   4else — "Vorschau" (Sanity's Presentation tool)
   ------------------------------------------------------------
   Shows the website beside the editing form: drafts and
   scheduled articles included, every text clickable to jump to
   its field, the page refreshing as Beatrice types. The site
   side lives in app/api/draft-mode (on/off), lib/sanity.ts
   (draft queries) and components/preview (overlays).

   Which site it shows: SANITY_STUDIO_PREVIEW_URL, read when the
   Studio is built. studio/.env.development points `npm run dev`
   at the local site (localhost:3007); the hosted Studio shows
   the live site, 4else.vercel.app until the production domain
   exists. When that domain comes, change SITE and allowOrigins
   here, then deploy the Studio.

   The live site sits behind Vercel's Deployment Protection; the
   Vercel-Zugang tool (@sanity/vercel-protection-bypass, admins
   only) stores the bypass secret that lets the Vorschau through.
   ============================================================ */

const SITE = process.env.SANITY_STUDIO_PREVIEW_URL || 'https://4else.vercel.app'

/* URL → the document the editor opens alongside it. */
const mainDocuments = defineDocuments([
  {
    route: '/inspirationen/:slug',
    filter: `_type == "article" && slug.current == $slug`,
  },
])

/* Document → the pages it appears on ("Verwendet auf" in the form). */
const locations = {
  article: defineLocations({
    select: {title: 'title', slug: 'slug.current'},
    resolve: (doc) => ({
      locations: doc?.slug
        ? [
            {title: doc.title || 'Ohne Titel', href: `/inspirationen/${doc.slug}`},
            {title: 'Inspirationen (Übersicht)', href: '/inspirationen'},
          ]
        : [],
    }),
  }),
}

export const preview = presentationTool({
  title: 'Vorschau',
  icon: EyeOpenIcon,
  previewUrl: {
    initial: SITE,
    previewMode: {enable: '/api/draft-mode/enable'},
  },
  allowOrigins: ['http://localhost:*', 'https://4else.vercel.app'],
  resolve: {mainDocuments, locations},
})
