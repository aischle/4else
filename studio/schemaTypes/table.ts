import {ThListIcon} from '@sanity/icons/ThList'
import {defineArrayMember, defineField, defineType} from 'sanity'

/* A table inside the article body, edited in place by the Studio's own
   Portable Text table editing (Studio ≥ 6.6, switched on for the body in
   ./blockContent.ts): rows and columns added and removed in the text, a
   header-row toggle, a new table starts as 3×3 with a header row.

   The names are the canonical ones that editing binds to: table → rows →
   row → cells → cell → value. headerRows MUST stay declared: without it
   the header toggle silently does nothing (Sanity's documented gotcha).

   Cells take plain text with bold and italic, nothing more; emojis such
   as ✅ ❌ ⚠️ are just text. The website renders it in
   components/inspirationen/ArticleTable.tsx; on a phone a table with a
   header row turns into one card per row. */

export const table = defineType({
  name: 'table',
  title: 'Tabelle',
  type: 'object',
  icon: ThListIcon,
  fields: [
    defineField({name: 'headerRows', title: 'Kopfzeilen', type: 'number'}),
    defineField({
      name: 'rows',
      title: 'Zeilen',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'row',
          title: 'Zeile',
          type: 'object',
          fields: [
            defineField({
              name: 'cells',
              title: 'Zellen',
              type: 'array',
              of: [
                defineArrayMember({
                  name: 'cell',
                  title: 'Zelle',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'value',
                      title: 'Inhalt',
                      type: 'array',
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
                            annotations: [],
                          },
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {rows: 'rows'},
    prepare: ({rows}) => {
      const list = Array.isArray(rows) ? rows : []
      const columns = Math.max(0, ...list.map((r: {cells?: unknown[]}) => r.cells?.length ?? 0))
      return {
        title: 'Tabelle',
        subtitle: `${list.length} ${list.length === 1 ? 'Zeile' : 'Zeilen'} · ${columns} ${columns === 1 ? 'Spalte' : 'Spalten'}`,
        media: ThListIcon,
      }
    },
  },
})
