import {deDELocale} from '@sanity/locale-de-de'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {UserIcon} from '@sanity/icons/User'
import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool, type StructureResolver} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'

/* ============================================================
   4else — Studio for the blog "Inspirationen"
   ------------------------------------------------------------
   Hosted by Sanity at https://4else.sanity.studio (npm run
   deploy); the website's /studio redirects there. Beatrice
   logs in with her own Sanity account as an Editor of project
   6e5n16nr. The whole interface is German.
   ============================================================ */

const structure: StructureResolver = (S) =>
  S.list()
    .title('Inspirationen')
    .items([
      S.listItem()
        .title('Artikel')
        .icon(DocumentTextIcon)
        .child(
          S.documentTypeList('article')
            .title('Artikel')
            .defaultOrdering([{field: 'publishedAt', direction: 'desc'}]),
        ),
      S.divider(),
      S.documentTypeListItem('author').title('Autor:innen').icon(UserIcon),
    ])

export default defineConfig({
  name: 'default',
  title: '4else · Inspirationen',
  projectId: '6e5n16nr',
  dataset: 'production',
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
