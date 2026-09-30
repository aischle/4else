import { PortableText, toPlainText, type PortableTextComponents } from '@portabletext/react';
import { stegaClean } from '@sanity/client/stega';
import type { TableBlock, TableCell } from '@/lib/sanity';
import styles from './ArticleTable.module.css';

/* ============================================================
   4else — table inside an article (studio/schemaTypes/table.ts)
   ------------------------------------------------------------
   From the mockup Robin approved (September 2026): no frame or
   fill, rows on hairlines, the header row in the eyebrow style,
   the first column as ink row labels.

   On a narrow column (its own container, ≤ 620px) a table with a
   header row turns into one card per row: the first cell as the
   title, each value under its column name, which every cell
   carries as data-label (plain text, stega cleaned: it is an
   attribute). Without a header row there are no names to label
   the cards, so the grid stays and scrolls sideways in its
   wrapper; the page never does.

   A cell's blocks render inline, one line each. Ragged rows are
   padded to the widest row, so every column lines up.
   ============================================================ */

/* A cell's text: bold and italic only, each block its own line. */
const cellComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <span className={styles.line}>{children}</span>,
  },
};

function Cell({ cell }: { cell: TableCell | undefined }) {
  return cell?.value?.length ? <PortableText value={cell.value} components={cellComponents} /> : null;
}

export function ArticleTable({ value }: { value: TableBlock }) {
  const rows = (value.rows ?? []).filter((row) => row.cells?.length);
  if (rows.length === 0) return null;

  const columns = Math.max(...rows.map((row) => row.cells?.length ?? 0));
  const headerCount = Math.min(Math.max(0, value.headerRows ?? 0), rows.length);
  const head = rows.slice(0, headerCount);
  const body = rows.slice(headerCount);
  const cellsOf = (row: (typeof rows)[number]) =>
    Array.from({ length: columns }, (_, i) => row.cells?.[i]);

  /* The column names the phone cards show: the first header row. */
  const labels = head.length
    ? cellsOf(head[0]).map((cell) => stegaClean(toPlainText(cell?.value ?? [])))
    : [];
  const hasHeader = labels.length > 0;

  return (
    <div className={styles.wrap}>
      <table className={`${styles.table} ${hasHeader ? styles.cards : styles.plain}`}>
        {hasHeader && (
          <thead>
            {head.map((row) => (
              <tr key={row._key}>
                {cellsOf(row).map((cell, i) => (
                  <th key={cell?._key ?? i} scope="col">
                    <Cell cell={cell} />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
        )}
        <tbody>
          {body.map((row) => (
            <tr key={row._key}>
              {cellsOf(row).map((cell, i) =>
                /* With a header row the first column labels its row. */
                hasHeader && i === 0 ? (
                  <th key={cell?._key ?? i} scope="row">
                    <Cell cell={cell} />
                  </th>
                ) : (
                  <td key={cell?._key ?? i} data-label={labels[i] || undefined}>
                    <Cell cell={cell} />
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
