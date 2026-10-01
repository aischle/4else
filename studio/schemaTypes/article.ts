import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {defineField, defineType} from 'sanity'

/* What an article's address may be: lowercase words of letters and
   digits, joined by single hyphens. */
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/* "Generieren" for German titles, so the result always passes SLUG:
   umlauts spelled out (für → fuer), other accents dropped, everything
   else a hyphen, hyphens collapsed and trimmed, at most 96 characters
   without a dangling hyphen. */
function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
    .replace(/-+$/, '')
}

/* One blog post on 4else.events/inspirationen. The website only shows
   published articles whose "Veröffentlicht am" is not in the future, so
   a future date is a simple way to schedule a post. */
export const article = defineType({
  name: 'article',
  title: 'Artikel',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'content', title: 'Inhalt', default: true},
    {name: 'seo', title: 'Suchmaschinen'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      group: 'content',
      description: 'Am besten 40 bis 70 Zeichen.',
      /* A warning from 70 (publishing still works), a hard stop at 125.
         Past ~70 the heading runs to four lines and more on a phone. */
      validation: (rule) => [
        rule.required().max(125),
        rule
          .max(70)
          .warning(
            'Über 70 Zeichen: Auf dem Handy wird der Titel sehr lang. Für Google am besten zusätzlich einen kürzeren „Titel für Suchmaschinen“ setzen.',
          ),
      ],
    }),
    defineField({
      name: 'slug',
      title: 'Adresse (URL)',
      type: 'slug',
      group: 'content',
      description:
        'Der letzte Teil der Adresse, z. B. 4else.events/inspirationen/mein-artikel. Mit „Generieren“ aus dem Titel erstellen. Nach der Veröffentlichung nicht mehr ändern, sonst funktionieren geteilte Links nicht mehr.',
      options: {source: 'title', maxLength: 96, slugify},
      /* Only what the site can put in /inspirationen/<slug>: an imported
         slug with slashes ("/alter-pfad/") once turned an article into a
         404 (October 2026). */
      validation: (rule) =>
        rule.required().custom((slug?: {current?: string}) => {
          const value = slug?.current
          if (!value) return true
          return SLUG.test(value)
            ? true
            : 'Nur Kleinbuchstaben, Ziffern und Bindestriche – keine Schrägstriche, Leerzeichen oder Umlaute. Am einfachsten mit „Generieren“ aus dem Titel erstellen.'
        }),
    }),
    defineField({
      name: 'excerpt',
      title: 'Anriss',
      type: 'text',
      rows: 3,
      group: 'content',
      description:
        'Zwei, drei Sätze, die neugierig machen. Erscheinen in der Übersicht und in Suchergebnissen.',
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: 'mainImage',
      title: 'Titelbild',
      type: 'image',
      group: 'content',
      options: {hotspot: true},
      description: 'Querformat, mindestens 1600 Pixel breit.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternativtext',
          type: 'string',
          description: 'Beschreibt das Bild für Screenreader und Suchmaschinen.',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Veröffentlicht am',
      type: 'datetime',
      group: 'content',
      description:
        'Liegt das Datum in der Zukunft, erscheint der Artikel erst dann auf der Website.',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Autor:in',
      type: 'reference',
      group: 'content',
      to: [{type: 'author'}],
    }),
    defineField({
      name: 'body',
      title: 'Inhalt',
      type: 'blockContent',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'Suchmaschinen',
      type: 'object',
      group: 'seo',
      description: 'Optional. Leer gelassen, verwendet die Website Titel und Anriss.',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Titel für Suchmaschinen',
          type: 'string',
          description: 'Höchstens 60 Zeichen, sonst kürzt Google ihn.',
          /* A warning from 60 (Google cuts the title link at about that
             length), a hard stop at 100. */
          validation: (rule) => [
            rule.max(100),
            rule
              .max(60)
              .warning('Über 60 Zeichen: Google zeigt den Titel in den Suchergebnissen gekürzt.'),
          ],
        }),
        defineField({
          name: 'metaDescription',
          title: 'Beschreibung für Suchmaschinen',
          type: 'text',
          rows: 3,
          validation: (rule) => rule.max(160),
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: 'Neueste zuerst',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'title', date: 'publishedAt', media: 'mainImage'},
    prepare({title, date, media}) {
      const subtitle = date
        ? new Date(date).toLocaleDateString('de-CH', {day: 'numeric', month: 'long', year: 'numeric'})
        : 'Ohne Datum'
      return {title, subtitle, media}
    },
  },
})
