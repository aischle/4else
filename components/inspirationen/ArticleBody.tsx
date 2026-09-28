import Image from 'next/image';
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from '@portabletext/react';
import { assetSize, urlFor, type FaqBlock, type LinkCardBlock, type SanityImage } from '@/lib/sanity';
import { ArticleFaq } from './ArticleFaq';
import { LinkCard } from './LinkCard';
import styles from './ArticleBody.module.css';

/* ============================================================
   4else — article body (Portable Text)
   ------------------------------------------------------------
   Renders exactly what the Studio's blockContent offers
   (studio/schemaTypes/blockContent.ts): paragraphs, H2, H3,
   quote, bullet and numbered lists, bold, italic, links,
   images, FAQ blocks (./ArticleFaq.tsx) and link cards
   (./LinkCard.tsx). Anything added there needs its renderer
   here.
   ============================================================ */

type BodyImage = SanityImage & {
  asset?: { _ref?: string };
  caption?: string;
};

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className={styles.p}>{children}</p>,
    h2: ({ children }) => <h2 className={styles.h2}>{children}</h2>,
    h3: ({ children }) => <h3 className={styles.h3}>{children}</h3>,
    blockquote: ({ children }) => <blockquote className={styles.quote}>{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul className={styles.list}>{children}</ul>,
    number: ({ children }) => <ol className={styles.list}>{children}</ol>,
  },
  marks: {
    link: ({ value, children }) => {
      const href: string = value?.href ?? '#';
      const external = value?.blank === true;
      return (
        <a
          href={href}
          className={styles.link}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    /* The answers reuse these same components, so they read like the text. */
    faq: ({ value }: { value: FaqBlock }) => (
      <ArticleFaq value={value} components={components} headingClassName={styles.h2} />
    ),
    linkCard: ({ value }: { value: LinkCardBlock }) => <LinkCard value={value} />,
    image: ({ value }: { value: BodyImage }) => {
      if (!value?.asset) return null;
      const { width, height } = assetSize(value.asset._ref);
      return (
        <figure className={styles.figure}>
          <Image
            src={urlFor(value).width(1520).fit('max').auto('format').url()}
            alt={value.alt ?? ''}
            width={width}
            height={height}
            sizes="(max-width: 800px) 100vw, 720px"
            className={styles.image}
            style={{ maxWidth: width }}
          />
          {value.caption && <figcaption className={styles.caption}>{value.caption}</figcaption>}
        </figure>
      );
    },
  },
};

export function ArticleBody({ value }: { value: PortableTextBlock[] }) {
  return (
    <div className={styles.body}>
      <PortableText value={value} components={components} />
    </div>
  );
}
