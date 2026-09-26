import {defineArrayMember, defineField, defineType} from 'sanity'

/* The article body. Deliberately small: what a blog post needs and what
   the website renders (components/inspirationen/ArticleBody.tsx). Add a
   style or block here only together with its renderer there. */
export const blockContent = defineType({
  name: 'blockContent',
  title: 'Inhalt',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Absatz', value: 'normal'},
        {title: 'Zwischentitel', value: 'h2'},
        {title: 'Unterzwischentitel', value: 'h3'},
        {title: 'Zitat', value: 'blockquote'},
      ],
      lists: [
        {title: 'Aufzählung', value: 'bullet'},
        {title: 'Nummeriert', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Fett', value: 'strong'},
          {title: 'Kursiv', value: 'em'},
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            title: 'Link',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: 'Adresse',
                type: 'url',
                description: 'Vollständige Adresse, z. B. https://4else.events/kontakt',
                validation: (rule) =>
                  rule.required().uri({scheme: ['http', 'https', 'mailto', 'tel']}),
              }),
              defineField({
                name: 'blank',
                title: 'In neuem Tab öffnen',
                type: 'boolean',
                initialValue: false,
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({
      name: 'image',
      title: 'Bild',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternativtext',
          type: 'string',
          description: 'Beschreibt das Bild für Screenreader und Suchmaschinen.',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'caption',
          title: 'Bildlegende',
          type: 'string',
        }),
      ],
    }),
  ],
})
