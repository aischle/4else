import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {defineField, defineType} from 'sanity'

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
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: 'slug',
      title: 'Adresse (URL)',
      type: 'slug',
      group: 'content',
      description:
        'Der letzte Teil der Adresse, z. B. 4else.events/inspirationen/mein-artikel. Mit „Generieren“ aus dem Titel erstellen. Nach der Veröffentlichung nicht mehr ändern, sonst funktionieren geteilte Links nicht mehr.',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
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
          validation: (rule) => rule.max(60),
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
