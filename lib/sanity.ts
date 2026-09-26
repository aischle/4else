import { cache } from 'react';
import { createClient, type ClientConfig } from '@sanity/client';
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import type { PortableTextBlock } from '@portabletext/react';

/* ============================================================
   4else — Sanity (blog "Inspirationen")
   ------------------------------------------------------------
   Read-only client for project 6e5n16nr. The dataset is public,
   so no token: the site only ever sees published documents.
   Content is written in the Studio (studio/, hosted at
   4else.sanity.studio). The schema lives in studio/schemaTypes;
   the shapes below mirror it.

   Every query shows an article only once its publishedAt has
   passed, so a future date schedules a post. Pages revalidate
   every 60s; the /api/revalidate webhook makes it immediate.
   ============================================================ */

const config: ClientConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '6e5n16nr',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-10-01',
  useCdn: process.env.NODE_ENV === 'production',
  perspective: 'published',
};

export const sanityClient = createClient(config);

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

export type Article = ArticleCard & {
  _updatedAt: string;
  body: PortableTextBlock[];
  author?: { name: string; role?: string };
  seo?: { metaTitle?: string; metaDescription?: string };
};

export type ArticleSlug = { slug: string; _updatedAt: string };

/* ── Queries ────────────────────────────────────────────────── */

const VISIBLE = `_type == "article" && defined(slug.current) && publishedAt <= now()`;

const CARD = `_id, title, "slug": slug.current, excerpt, publishedAt, mainImage`;

const ARTICLES_QUERY = `*[${VISIBLE}] | order(publishedAt desc) { ${CARD} }`;

const ARTICLE_QUERY = `*[${VISIBLE} && slug.current == $slug][0] {
  ${CARD},
  _updatedAt,
  body,
  "author": author->{ name, role },
  seo
}`;

const SLUGS_QUERY = `*[${VISIBLE}] { "slug": slug.current, _updatedAt }`;

/* The listing and the index fail soft: an unreachable Sanity must not
   take the overview page or the sitemap down with it. */

export async function getArticles(): Promise<ArticleCard[]> {
  try {
    return await sanityClient.fetch<ArticleCard[]>(ARTICLES_QUERY);
  } catch {
    return [];
  }
}

/* Wrapped in cache() so generateMetadata and the page share one query. */
export const getArticle = cache(async (slug: string): Promise<Article | null> => {
  return sanityClient.fetch<Article | null>(ARTICLE_QUERY, { slug });
});

export async function getArticleSlugs(): Promise<ArticleSlug[]> {
  try {
    return await sanityClient.fetch<ArticleSlug[]>(SLUGS_QUERY);
  } catch {
    return [];
  }
}
