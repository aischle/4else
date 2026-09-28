import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { faqNumber } from '@/lib/faq';
import type { FaqBlock } from '@/lib/sanity';
import styles from './ArticleFaq.module.css';

/* ============================================================
   4else — FAQ block inside an article
   ------------------------------------------------------------
   The start page's FAQ, narrowed to the text column: numbered
   questions, a drawn plus/minus, the first answer open. Native
   <details>/<summary>, no script, so every answer is in the
   server-rendered HTML whether it is open or not. All items of
   one block share a `name` (the block's _key), which makes them
   an exclusive group: opening one closes the others, and two
   FAQ blocks in one article do not interfere.

   Answers render through the article's own Portable Text
   components (passed in by ArticleBody), so their paragraphs,
   lists and links look like the rest of the text.

   The same questions and answers also go out as FAQPage data,
   from the article page (FaqPageJsonLd).
   ============================================================ */

export function ArticleFaq({
  value,
  components,
  headingClassName,
}: {
  value: FaqBlock;
  components: PortableTextComponents;
  headingClassName: string;
}) {
  const items = (value.items ?? []).filter((item) => item.question);
  if (items.length === 0) return null;

  const group = `faq-${value._key}`;

  return (
    <section className={styles.faq} aria-label={value.title || undefined}>
      {value.title && <h2 className={headingClassName}>{value.title}</h2>}
      <div className={styles.list}>
        {items.map((item, index) => (
          <details key={item._key} name={group} open={index === 0} className={styles.item}>
            <summary className={styles.question}>
              <span className={styles.number}>{faqNumber(index)}</span>
              <span className={styles.text}>{item.question}</span>
              {/* Decorative: <details> already tells assistive technology
                  whether the answer is open. */}
              <span className={styles.marker} aria-hidden="true" />
            </summary>
            <div className={styles.answer}>
              <PortableText value={item.answer ?? []} components={components} />
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
