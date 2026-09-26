import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { ArticleBody } from '@/components/inspirationen/ArticleBody';
import { Link } from '@/lib/navigation';
import { getArticle, getArticleSlugs, urlFor } from '@/lib/sanity';
import styles from '../inspirationen.module.css';

/* ============================================================
   4else — Inspirationen, one article
   ------------------------------------------------------------
   Pre-rendered for every published slug; new slugs render on
   first request (dynamicParams) and everything revalidates
   every 60s or on the webhook. An unknown or not-yet-published
   slug is a real 404.
   ============================================================ */

export const revalidate = 60;
export const dynamicParams = true;

/* Slugs only: Next combines them with the locales from the parent layout. */
export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params: { slug },
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const article = await getArticle(slug);
  if (!article) return {};

  const title = article.seo?.metaTitle || article.title;
  const description = article.seo?.metaDescription || article.excerpt;
  const image = article.mainImage
    ? urlFor(article.mainImage).width(1200).height(630).fit('crop').auto('format').url()
    : undefined;

  return {
    title,
    description,
    alternates: { canonical: `/inspirationen/${slug}` },
    openGraph: {
      type: 'article',
      title,
      description,
      publishedTime: article.publishedAt,
      modifiedTime: article._updatedAt,
      ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}),
    },
  };
}

export default async function InspirationenArticlePage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(locale);

  const article = await getArticle(slug);
  if (!article) notFound();

  const [t, format] = await Promise.all([getTranslations('inspirationen'), getFormatter()]);

  return (
    <main>
      <article className={styles.article}>
        <Link href="/inspirationen" className={styles.back}>
          <span aria-hidden="true">←</span> {t('back')}
        </Link>

        <header className={styles.articleHead}>
          <p className={styles.meta}>
            <time dateTime={article.publishedAt}>
              {format.dateTime(new Date(article.publishedAt), { dateStyle: 'long' })}
            </time>
            {article.author?.name && <> · {t('byline', { name: article.author.name })}</>}
          </p>
          <h1 className={styles.articleTitle}>{article.title}</h1>
          <p className={styles.articleExcerpt}>{article.excerpt}</p>
        </header>

        {article.mainImage && (
          <div className={styles.hero}>
            <Image
              src={urlFor(article.mainImage).width(1600).height(1000).fit('crop').auto('format').url()}
              alt={article.mainImage.alt ?? ''}
              fill
              priority
              sizes="(max-width: 800px) 100vw, 760px"
              className={styles.cover}
            />
          </div>
        )}

        <ArticleBody value={article.body} />
      </article>
    </main>
  );
}
