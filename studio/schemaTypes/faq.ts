import {HelpCircleIcon} from '@sanity/icons/HelpCircle'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {linkAnnotation} from './blockContent'

/* An FAQ block inside the article body. The website renders it as the
   start page's accordion, narrowed to the text column
   (components/inspirationen/ArticleFaq.tsx): numbered questions, the
   first answer open, opening one closes the others. The same questions
   and answers are also published as schema.org FAQPage data. */

type AnswerBlock = {_type?: string; children?: {text?: string}[]}

function plainText(blocks: AnswerBlock[] | undefined): string {
  return (blocks ?? [])
    .filter((block) => block._type === 'block')
    .map((block) => (block.children ?? []).map((child) => child.text ?? '').join(''))
    .join(' ')
}

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'object',
  icon: HelpCircleIcon,
  description:
    'Erscheint im Artikel als Akkordeon; die erste Antwort ist offen. Wird auch als strukturierte Daten für Suchmaschinen ausgegeben.',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      description: 'Erscheint als Zwischentitel über den Fragen. Leer lassen für keinen Titel.',
      initialValue: 'Häufige Fragen',
    }),
    defineField({
      name: 'items',
      title: 'Fragen',
      type: 'array',
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          name: 'faqItem',
          title: 'Frage',
          type: 'object',
          fields: [
            defineField({
              name: 'question',
              title: 'Frage',
              type: 'string',
              validation: (rule) => rule.required().max(160),
            }),
            defineField({
              name: 'answer',
              title: 'Antwort',
              type: 'array',
              validation: (rule) => rule.required(),
              of: [
                defineArrayMember({
                  type: 'block',
                  styles: [{title: 'Absatz', value: 'normal'}],
                  lists: [
                    {title: 'Aufzählung', value: 'bullet'},
                    {title: 'Nummeriert', value: 'number'},
                  ],
                  marks: {
                    decorators: [
                      {title: 'Fett', value: 'strong'},
                      {title: 'Kursiv', value: 'em'},
                    ],
                    annotations: [linkAnnotation],
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {title: 'question', answer: 'answer'},
            prepare: ({title, answer}) => ({
              title: title || 'Neue Frage',
              subtitle: plainText(answer),
            }),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', items: 'items'},
    prepare: ({title, items}) => {
      const count = Array.isArray(items) ? items.length : 0
      return {
        title: title || 'FAQ',
        subtitle: `FAQ · ${count} ${count === 1 ? 'Frage' : 'Fragen'}`,
        media: HelpCircleIcon,
      }
    },
  },
})
