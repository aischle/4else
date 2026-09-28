import { cache } from 'react';
import { cookies, draftMode } from 'next/headers';
import { createClient, type ClientConfig, type QueryParams } from '@sanity/client';
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import type { PortableTextBlock } from '@portabletext/react';
import { resolvePerspectiveFromCookies } from 'next-sanity/live';

/* ============================================================
   4else — Sanity (blog "Inspirationen")
   ------------------------------------------------------------
   Client for project 6e5n16nr. The dataset is public, so
   visitors are served without a token and only ever see
   published documents. Content is written in the Studio
   (studio/, hosted at fourelse.sanity.studio). The schema lives
   in studio/schemaTypes; the shapes below mirror it.

   Every query shows an article only once its publishedAt has
   passed, so a future date schedules a post. Pages revalidate
   every 60s; the /api/revalidate webhook makes it immediate.

   Preview (draft mode, switched on by the Studio's Vorschau
   tool through app/api/draft-mode/enable): the same queries
   run with the read token, uncached, in the perspective the
   Studio chose (drafts by default), show scheduled articles
   too, and carry stega, the invisible edit markers the
   click-to-edit overlays read. Visitors never reach that path.
   ============================================================ */

const config: ClientConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '6e5n16nr',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-10-01',
  useCdn: process.env.NODE_ENV === 'production',
  perspective: 'published',
  /* Off unless a preview fetch turns it on. studioUrl is where a click
     on an overlay leads when the page is open outside the Studio. */
  stega: {
    enabled: false,
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'https://fourelse.sanity.studio',
  },
};

export const sanityClient = createClient(config);

/* Viewer token, server only: reads drafts in preview and lets the enable
   route check the Studio's secret. Never sent to the browser. */
export const readToken = process.env.SANITY_API_READ_TOKEN;

/* Every query goes through here. Published unless draft mode is on, and
   draft mode can only be switched on with a secret from the Studio. */
async function sanityFetch<T>(query: string, params: QueryParams = {}): Promise<T> {
  const { isEnabled: preview } = await draftMode();
  if (!preview || !readToken) {
    return sanityClient.fetch<T>(query, { ...params, preview: false });
  }

  const perspective = await resolvePerspectiveFromCookies({ cookies: await cookies() });
  return sanityClient.fetch<T>(
    query,
    { ...params, preview: true },
    { perspective, token: readToken, useCdn: false, stega: true, cache: 'no-store' },
  );
}

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/* ── Shapes ─────────────────────────────────────────────────── */

export type SanityImage = SanityImageSource & { alt?: string };

export type ArticleCard = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  mainImage?: SanityImage;
};

export type Author = { name: string; role?: string; photo?: SanityImage };

export type Article = ArticleCard & {
  _updatedAt: string;
  body: PortableTextBlock[];
  author?: Author | null;
  seo?: { metaTitle?: string; metaDescription?: string };
  /* Derived in getArticle, not stored in Sanity. */
  readingMinutes: number;
};

export type ArticleSlug = { slug: string; _updatedAt: string };

/* An FAQ block in the article body (studio/schemaTypes/faq.ts). */
export type FaqItem = { _key: string; question: string; answer: PortableTextBlock[] };
export type FaqBlock = { _type: 'faq'; _key: string; title?: string; items?: FaqItem[] };

/* A link card in the article body (studio/schemaTypes/linkCard.ts). */
export type LinkCardImage = SanityImage & {
  asset?: { _ref?: string };
  hotspot?: { x: number; y: number };
};
export type LinkCardBlock = {
  _type: 'linkCard';
  _key: string;
  label?: string;
  name: string;
  title: string;
  text?: string;
  url: string;
  image?: LinkCardImage;
};

/* A Sanity image asset id carries its size: image-<hash>-2000x1333-jpg. */
export function assetSize(ref: string | undefined): { width: number; height: number } {
  const match = ref?.match(/-(\d+)x(\d+)-/);
  return match
    ? { width: Number(match[1]), height: Number(match[2]) }
    : { width: 1600, height: 1000 };
}

export function isFaqBlock(block: { _type: string }): block is FaqBlock {
  return block._type === 'faq';
}

/* Every question of every FAQ block in a body, in reading order. */
export function faqItems(body: { _type: string }[] | undefined): FaqItem[] {
  return (body ?? []).filter(isFaqBlock).flatMap((block) => block.items ?? []);
}

/* ── Queries ────────────────────────────────────────────────── */

/* $preview (set by sanityFetch) also shows articles dated in the future,
   so a scheduled post can be checked before its day. */
const VISIBLE = `_type == "article" && defined(slug.current) && (publishedAt <= now() || $preview)`;

const CARD = `_id, title, "slug": slug.current, excerpt, publishedAt, mainImage`;

const ARTICLES_QUERY = `*[${VISIBLE}] | order(publishedAt desc) { ${CARD} }`;

const ARTICLE_QUERY = `*[${VISIBLE} && slug.current == $slug][0] {
  ${CARD},
  _updatedAt,
  body,
  "author": author->{ name, role, photo },
  seo
}`;

const SLUGS_QUERY = `*[${VISIBLE}] { "slug": slug.current, _updatedAt }`;

/* The listing and the index fail soft: an unreachable Sanity must not
   take the overview page or the sitemap down with it. */

export async function getArticles(): Promise<ArticleCard[]> {
  try {
    return await sanityFetch<ArticleCard[]>(ARTICLES_QUERY);
  } catch {
    return [];
  }
}

/* Reading time at ~200 words per minute (as temu.swiss), from the text
   of the body's blocks, its FAQ questions and answers, and its link
   cards; images don't count. At least one minute. */
function countWords(blocks: PortableTextBlock[] | undefined): number {
  let words = 0;
  for (const block of blocks ?? []) {
    if (block._type !== 'block' || !Array.isArray(block.children)) continue;
    for (const child of block.children as { text?: string }[]) {
      words += (child.text ?? '').split(/\s+/).filter(Boolean).length;
    }
  }
  return words;
}

function readingMinutes(body: PortableTextBlock[] | undefined): number {
  let words = countWords(body);
  const count = (text: string | undefined) => (text ?? '').split(/\s+/).filter(Boolean).length;
  for (const item of faqItems(body)) {
    words += count(item.question);
    words += countWords(item.answer);
  }
  for (const block of body ?? []) {
    if (block._type !== 'linkCard') continue;
    const card = block as unknown as LinkCardBlock;
    words += count(card.title) + count(card.text);
  }
  return Math.max(1, Math.round(words / 200));
}

/* Wrapped in cache() so generateMetadata and the page share one query. */
export const getArticle = cache(async (slug: string): Promise<Article | null> => {
  const article = await sanityFetch<Omit<Article, 'readingMinutes'> | null>(ARTICLE_QUERY, {
    slug,
  });
  return article ? { ...article, readingMinutes: readingMinutes(article.body) } : null;
});

/* Published only, never the preview: it feeds generateStaticParams and the
   sitemap, which run outside any visitor's request. */
export async function getArticleSlugs(): Promise<ArticleSlug[]> {
  try {
    return await sanityClient.fetch<ArticleSlug[]>(SLUGS_QUERY, { preview: false });
  } catch {
    return [];
  }
}
