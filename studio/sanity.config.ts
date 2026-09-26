import {deDELocale} from '@sanity/locale-de-de'
import {ClockIcon} from '@sanity/icons/Clock'
import {DocumentsIcon} from '@sanity/icons/Documents'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {EarthGlobeIcon} from '@sanity/icons/EarthGlobe'
import {EditIcon} from '@sanity/icons/Edit'
import {UserIcon} from '@sanity/icons/User'
import {buildTheme} from '@sanity/themer'
import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool, type StructureResolver} from 'sanity/structure'
import {StudioIcon} from './components/StudioIcon'
import {schemaTypes} from './schemaTypes'

/* ============================================================
   4else — Studio for the blog "Inspirationen"
   ------------------------------------------------------------
   Hosted by Sanity at https://fourelse.sanity.studio (npm run
   deploy); the website's /studio redirects there. Beatrice
   logs in with her own Sanity account as an Editor of project
   6e5n16nr. The whole interface is German.

   Branding mirrors the website (styles/tokens.css): the digital
   accent #5B5BD6 for buttons, links and focus (#7C5CF0 in dark
   mode), the heading ink #393951 for text and neutrals, the navy
   "4e" mark as logo and favicon (static/).
   ============================================================ */

const theme = buildTheme({
  light: {
    accent: '#5B5BD6', // --accent (the client's "digital accent")
    text: '#393951', // --ink (her "Überschriften")
  },
  /* On dark grounds the website lifts the violet for legibility
     (--accent-violet, the hero's buttons); the Studio's dark mode does
     the same. */
  dark: {
    accent: '#7C5CF0',
  },
})

/* Article lists by state. "Now" is taken when the Studio loads, which
   is precise enough to tell scheduled posts from live ones. */
const article = '_type == "article"'
const isDraft = '_id in path("drafts.**")'

const structure: StructureResolver = (S) => {
  const now = new Date().toISOString()

  const articleList = (title: string, filter: string) =>
    S.documentList()
      .title(title)
      .schemaType('article')
      .filter(filter)
      .params({now})
      .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])

  return S.list()
    .title('Inspirationen')
    .items([
      S.listItem()
        .title('Alle Artikel')
        .icon(DocumentsIcon)
        .child(
          S.documentTypeList('article')
            .title('Alle Artikel')
            .defaultOrdering([{field: 'publishedAt', direction: 'desc'}]),
        ),
      S.divider(),
      S.listItem()
        .title('Online')
        .icon(EarthGlobeIcon)
        .child(
          articleList('Online auf der Website', `${article} && !(${isDraft}) && publishedAt <= $now`),
        ),
      S.listItem()
        .title('Geplant')
        .icon(ClockIcon)
        .child(articleList('Geplant (Datum in der Zukunft)', `${article} && publishedAt > $now`)),
      S.listItem()
        .title('Entwürfe')
        .icon(EditIcon)
        .child(
          articleList('Entwürfe und unveröffentlichte Änderungen', `${article} && ${isDraft}`),
        ),
      S.divider(),
      S.documentTypeListItem('author').title('Autor:innen').icon(UserIcon),
    ])
}

export default defineConfig({
  name: 'default',
  title: '4else · Inspirationen',
  icon: StudioIcon,
  projectId: '6e5n16nr',
  dataset: 'production',
  theme,
  plugins: [structureTool({structure, title: 'Inhalte'}), visionTool(), deDELocale()],
  schema: {types: schemaTypes},
  /* German only, whatever the browser's language: without this the
     Studio falls back to English for an English browser. */
  i18n: {
    locales: (prev) => prev.filter((locale) => locale.id === 'de-DE'),
  },
  /* Vision (the GROQ query tool) is for the developer only: editors never
     see it. */
  tools: (prev, {currentUser}) =>
    currentUser?.roles.some((role) => role.name === 'administrator')
      ? prev
      : prev.filter((tool) => tool.name !== 'vision'),
})
