import {UserIcon} from '@sanity/icons/User'
import {defineField, defineType} from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Autor:in',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Funktion',
      type: 'string',
      description: 'Erscheint unter dem Namen, z. B. „Gründerin von 4else“.',
    }),
    defineField({
      name: 'photo',
      title: 'Foto',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternativtext',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'role', media: 'photo'},
  },
})
