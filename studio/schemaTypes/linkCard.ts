import {LinkIcon} from '@sanity/icons/Link'
import {defineField, defineType} from 'sanity'

/* A link card inside the article body: a tool, a partner, a website
   worth a click. The website renders it as a white card
   (components/inspirationen/LinkCard.tsx): the image on the left, which
   readers can enlarge, and on the right the category and name, the
   title, the description and the domain. The text side is the link and
   always opens in a new tab. */

function domain(url: string | undefined): string {
  try {
    return url ? new URL(url).hostname.replace(/^www\./, '') : ''
  } catch {
    return ''
  }
}

export const linkCard = defineType({
  name: 'linkCard',
  title: 'Link-Karte',
  type: 'object',
  icon: LinkIcon,
  description:
    'Ein Hinweis auf ein Werkzeug, einen Partner oder eine Website. Der Text öffnet die Adresse in einem neuen Tab; das Bild lässt sich vergrössern.',
  fields: [
    defineField({
      name: 'label',
      title: 'Kategorie',
      type: 'string',
      description: 'Klein über der Überschrift, vor dem Namen, z. B. «Tool-Tipp».',
      initialValue: 'Tool-Tipp',
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Wofür die Karte steht, z. B. «Limen».',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'title',
      title: 'Überschrift',
      type: 'string',
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: 'text',
      title: 'Beschreibung',
      type: 'text',
      rows: 3,
      description: 'Auf der Karte nach drei Zeilen gekürzt.',
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: 'url',
      title: 'Adresse',
      type: 'url',
      description: 'Vollständige Adresse, z. B. https://www.translimen.io/',
      validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'image',
      title: 'Bild',
      type: 'image',
      description: 'Zum Beispiel ein Bildschirmfoto. Ohne Bild zeigt die Karte nur Text.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternativtext',
          type: 'string',
          description: 'Beschreibt das Bild für Screenreader und Suchmaschinen.',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', url: 'url', media: 'image'},
    prepare: ({title, url, media}) => ({
      title: title || 'Link-Karte',
      subtitle: ['Link-Karte', domain(url)].filter(Boolean).join(' · '),
      media: media || LinkIcon,
    }),
  },
})
