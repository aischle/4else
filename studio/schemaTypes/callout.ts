import {BulbOutlineIcon} from '@sanity/icons/BulbOutline'
import {InfoOutlineIcon} from '@sanity/icons/InfoOutline'
import {WarningOutlineIcon} from '@sanity/icons/WarningOutline'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {linkAnnotation} from './blockContent'

/* A callout inside the article body: a passage set apart in a tinted box
   (components/inspirationen/Callout.tsx). Three tones, chosen by Robin
   from the mockups (September 2026):
   - Gut zu wissen: Eisblau, an info icon beside the label;
   - Wichtig: Eis-Orange, an exclamation mark;
   - Unser Tipp: Eisviolett, Else with a speech bubble.
   The labels come from the website's own copy; here Beatrice only picks
   the tone. One optional title, then plain text: no subheadings, so the
   article's outline stays with the article. */

const TONES = [
  {title: 'Gut zu wissen', value: 'wissen', icon: InfoOutlineIcon},
  {title: 'Wichtig', value: 'wichtig', icon: WarningOutlineIcon},
  {title: 'Unser Tipp', value: 'tipp', icon: BulbOutlineIcon},
] as const

type ContentBlock = {_type?: string; children?: {text?: string}[]}

function plainText(blocks: ContentBlock[] | undefined): string {
  return (blocks ?? [])
    .filter((block) => block._type === 'block')
    .map((block) => (block.children ?? []).map((child) => child.text ?? '').join(''))
    .join(' ')
}

export const callout = defineType({
  name: 'callout',
  title: 'Hinweisbox',
  type: 'object',
  icon: InfoOutlineIcon,
  description: 'Hebt eine Passage im Artikel hervor: als Hinweis, als Warnung oder als Tipp mit Else.',
  fields: [
    defineField({
      name: 'tone',
      title: 'Art',
      type: 'string',
      options: {
        list: TONES.map(({title, value}) => ({title, value})),
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'wissen',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      description: 'Optional. Erscheint fett über dem Text.',
      validation: (rule) => rule.max(90),
    }),
    defineField({
      name: 'content',
      title: 'Text',
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
    select: {tone: 'tone', title: 'title', content: 'content'},
    prepare: ({tone, title, content}) => {
      const kind = TONES.find((t) => t.value === tone) ?? TONES[0]
      return {
        title: title || plainText(content) || 'Neue Hinweisbox',
        subtitle: `Hinweisbox · ${kind.title}`,
        media: kind.icon,
      }
    },
  },
})
