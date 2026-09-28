import { useTranslations } from 'next-intl';

/* ============================================================
   4else — FAQ structured data (JSON-LD)
   ------------------------------------------------------------
   Emits the schema.org FAQPage node for the start page's FAQ
   section (FaqJsonLd) and for blog articles with an FAQ block
   (FaqPageJsonLd, below). Questions and answers are read from the same `faq`
   message keys the visible accordion renders, so the structured
   data and the copy on the page cannot drift apart.

   FAQ_IDS is the single list both consume, and it is also the
   rendered order: add a pair here and in messages/de.json, and
   both surfaces pick it up.

   There is no `about` reference to an Organization node — this
   is the only JSON-LD on the site so far, so there is nothing
   to point at. Wire it up if a sitewide @graph is ever added.
   ============================================================ */

export const FAQ_IDS = [
  'f1',
  'f2',
  'f3',
  'f4',
  'f5',
  'f6',
  'f7',
  'f8',
  'f9',
  'f10',
  'f11',
] as const;

/* An answer may one day carry a rich-text tag (<accent>, <b>, a
   link). t.raw() reads the message without ICU tag parsing — plain
   t() throws on a tag it has no renderer for — so tags are stripped
   here rather than rendered; an answer with no tags passes through
   unchanged. */
const stripInlineTags = (s: string): string => s.replace(/<\/?[a-z]+>/g, '');

export function FaqJsonLd() {
  const t = useTranslations('faq');

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_IDS.map((id) => ({
      '@type': 'Question',
      name: t(`${id}Question`),
      acceptedAnswer: {
        '@type': 'Answer',
        text: stripInlineTags(t.raw(`${id}Answer`)),
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      // Developer-authored copy from the message file — no user input flows in.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
    />
  );
}

/* The same FAQPage node for any list of plain-text pairs — used by blog
   articles, whose FAQ blocks come from Sanity (see
   app/[locale]/(site)/inspirationen/[slug]/page.tsx). Renders nothing
   for an empty list. */
export function FaqPageJsonLd({ items }: { items: { question: string; answer: string }[] }) {
  if (items.length === 0) return null;

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };

  /* Editor text from Sanity: "<" is escaped so no answer can close the
     script element early. */
  const json = JSON.stringify(faqPage).replace(/</g, '\\u003c');

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
