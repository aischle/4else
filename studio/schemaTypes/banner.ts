import {BulbOutlineIcon} from '@sanity/icons/BulbOutline'
import {CalendarIcon} from '@sanity/icons/Calendar'
import {CheckmarkCircleIcon} from '@sanity/icons/CheckmarkCircle'
import {FaceHappyIcon} from '@sanity/icons/FaceHappy'
import {InfoOutlineIcon} from '@sanity/icons/InfoOutline'
import {PresentationIcon} from '@sanity/icons/Presentation'
import {WarningOutlineIcon} from '@sanity/icons/WarningOutline'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {linkAnnotation} from './blockContent'

/* A banner inside the article body (components/inspirationen/Banner.tsx):
   a band that interrupts the text for a message that matters, after the
   mockups Robin approved (October 2026). Beatrice chooses:
   - the width: the whole page or the title image's width (992px);
   - the background: one of seven 4else colours, or a photo (a dark
     gradient for legibility comes with it);
   - the alignment of the text, an optional icon above it, a small
     heading, the title, the text and an optional button (filled or
     outlined).
   The text colour follows the background by itself. */

export const BANNER_COLORS = [
  {title: 'Navy', value: 'navy'},
  {title: 'Violett-Schwarz', value: 'nacht'},
  {title: 'Digital-Violett', value: 'violett'},
  {title: 'Eisviolett', value: 'eisviolett'},
  {title: 'Eisblau', value: 'eisblau'},
  {title: 'Eis-Lemon', value: 'eislemon'},
  {title: 'Eis-Orange', value: 'eisorange'},
] as const

export const BANNER_ICONS = [
  {title: 'Kein Icon', value: 'none', icon: PresentationIcon},
  {title: 'Info', value: 'info', icon: InfoOutlineIcon},
  {title: 'Achtung', value: 'achtung', icon: WarningOutlineIcon},
  {title: 'Tipp', value: 'tipp', icon: BulbOutlineIcon},
  {title: 'Häkchen', value: 'haekchen', icon: CheckmarkCircleIcon},
  {title: 'Termin', value: 'termin', icon: CalendarIcon},
  {title: 'Else', value: 'else', icon: FaceHappyIcon},
] as const

type ContentBlock = {_type?: string; children?: {text?: string}[]}
type BannerParent = {background?: string; button?: {label?: string; url?: string}}

function plainText(blocks: ContentBlock[] | undefined): string {
  return (blocks ?? [])
    .filter((block) => block._type === 'block')
    .map((block) => (block.children ?? []).map((child) => child.text ?? '').join(''))
    .join(' ')
}

export const banner = defineType({
  name: 'banner',
  title: 'Banner',
  type: 'object',
  icon: PresentationIcon,
  description:
    'Ein Balken quer durch den Artikel, für eine Botschaft, die auffallen soll: in einer 4else-Farbe oder mit Foto, mit Icon, Titel, Text und Button.',
  groups: [
    {name: 'look', title: 'Aussehen', default: true},
    {name: 'text', title: 'Text'},
  ],
  fields: [
    defineField({
      name: 'width',
      title: 'Breite',
      type: 'string',
      group: 'look',
      description:
        'Volle Breite: von Rand zu Rand des Bildschirms. Bildbreite: so breit wie das Titelbild, mit runden Ecken.',
      options: {
        list: [
          {title: 'Volle Breite', value: 'voll'},
          {title: 'Bildbreite', value: 'bild'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'voll',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'background',
      title: 'Hintergrund',
      type: 'string',
      group: 'look',
      options: {
        list: [
          {title: '4else-Farbe', value: 'farbe'},
          {title: 'Foto', value: 'foto'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'farbe',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'color',
      title: 'Farbe',
      type: 'string',
      group: 'look',
      description: 'Auf den dunklen Farben ist die Schrift weiss, auf den hellen dunkel.',
      options: {list: BANNER_COLORS.map(({title, value}) => ({title, value})), layout: 'radio'},
      initialValue: 'navy',
      hidden: ({parent}) => (parent as BannerParent | undefined)?.background === 'foto',
    }),
    defineField({
      name: 'image',
      title: 'Foto',
      type: 'image',
      group: 'look',
      description:
        'Querformat, mindestens 2000 Pixel breit. Das Wichtige rechts im Bild: links liegt bei linksbündigem Text der dunkle Verlauf. Auf dem Handy steht das Foto über dem Text.',
      options: {hotspot: true},
      hidden: ({parent}) => (parent as BannerParent | undefined)?.background !== 'foto',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternativtext',
          type: 'string',
          description: 'Beschreibt das Foto für Screenreader und Suchmaschinen.',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) =>
        rule.custom((value: {asset?: unknown} | undefined, context) =>
          (context.parent as BannerParent | undefined)?.background === 'foto' && !value?.asset
            ? 'Bitte ein Foto wählen oder als Hintergrund eine 4else-Farbe nehmen.'
            : true,
        ),
    }),
    defineField({
      name: 'align',
      title: 'Ausrichtung',
      type: 'string',
      group: 'look',
      description: 'Mit Foto liest sich linksbündig meist besser: Der Text steht dann auf dem dunklen Teil.',
      options: {
        list: [
          {title: 'Zentriert', value: 'mitte'},
          {title: 'Linksbündig', value: 'links'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'mitte',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      group: 'look',
      description: 'Erscheint über dem Text. «Else» zeigt ihr Gesicht statt eines Icons.',
      options: {list: BANNER_ICONS.map(({title, value}) => ({title, value})), layout: 'radio'},
      initialValue: 'none',
    }),
    defineField({
      name: 'kicker',
      title: 'Kleine Überschrift',
      type: 'string',
      group: 'text',
      description: 'Optional, z. B. «Unser Tipp» oder «Wichtig». Steht klein und in Grossbuchstaben über dem Titel.',
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      group: 'text',
      description: 'Kurz und klar, am besten eine Zeile.',
      validation: (rule) => [
        rule.required().max(90),
        rule.max(60).warning('Über 60 Zeichen: Der Titel läuft über mehrere Zeilen.'),
      ],
    }),
    defineField({
      name: 'content',
      title: 'Text',
      type: 'array',
      group: 'text',
      description: 'Optional. Ein, zwei Sätze wirken am stärksten.',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{title: 'Absatz', value: 'normal'}],
          lists: [],
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
    defineField({
      name: 'button',
      title: 'Button',
      type: 'object',
      group: 'text',
      description: 'Optional. Leer lassen, wenn der Banner keinen Button braucht.',
      options: {collapsible: true, collapsed: false},
      fields: [
        defineField({name: 'label', title: 'Beschriftung', type: 'string', validation: (rule) => rule.max(40)}),
        defineField({
          name: 'url',
          title: 'Link',
          type: 'url',
          description: 'Vollständige Adresse, z. B. https://4else.events/kontakt',
          validation: (rule) => rule.uri({scheme: ['http', 'https', 'mailto', 'tel']}),
        }),
        defineField({
          name: 'style',
          title: 'Stil',
          type: 'string',
          description: 'Gefüllt fällt stärker auf, Umriss wirkt leichter.',
          options: {
            list: [
              {title: 'Gefüllt', value: 'gefuellt'},
              {title: 'Umriss', value: 'umriss'},
            ],
            layout: 'radio',
            direction: 'horizontal',
          },
          initialValue: 'gefuellt',
        }),
      ],
      validation: (rule) =>
        rule.custom((value: BannerParent['button']) => {
          if (!value?.label && !value?.url) return true
          if (!value.label) return 'Bitte eine Beschriftung für den Button eintragen.'
          if (!value.url) return 'Bitte einen Link für den Button eintragen.'
          return true
        }),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      content: 'content',
      width: 'width',
      background: 'background',
      color: 'color',
      icon: 'icon',
      media: 'image',
    },
    prepare: ({title, content, width, background, color, icon, media}) => {
      const look =
        background === 'foto'
          ? 'Foto'
          : (BANNER_COLORS.find((c) => c.value === color)?.title ?? 'Navy')
      const glyph = BANNER_ICONS.find((i) => i.value === icon) ?? BANNER_ICONS[0]
      return {
        title: title || plainText(content) || 'Neuer Banner',
        subtitle: `Banner · ${width === 'bild' ? 'Bildbreite' : 'Volle Breite'} · ${look}`,
        media: background === 'foto' && media ? media : glyph.icon,
      }
    },
  },
})
