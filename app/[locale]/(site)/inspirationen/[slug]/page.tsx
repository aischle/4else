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
  const author = article.author;

  return (
    <main className={styles.articleMain}>
      <article className={styles.article}>
        <Link href="/inspirationen" className={styles.back}>
          <span aria-hidden="true">←</span> {t('back')}
        </Link>

        <header className={styles.articleHead}>
          <h1 className={styles.articleTitle}>{article.title}</h1>
          <p className={styles.articleExcerpt}>{article.excerpt}</p>
        </header>

        {/* Byline: who wrote it, then when and how long it reads. Without an
            author only the date and reading time remain. */}
        <div className={styles.byline}>
          {author && (
            <div className={styles.author}>
              {author.photo && (
                <Image
                  src={urlFor(author.photo).width(112).height(112).fit('crop').auto('format').url()}
                  alt=""
                  width={52}
                  height={52}
                  className={styles.avatar}
                />
              )}
              <p className={styles.authorText}>
                <span className={styles.authorName}>{author.name}</span>
                {author.role && <span className={styles.authorRole}>{author.role}</span>}
              </p>
            </div>
          )}
          <p className={styles.when}>
            <time dateTime={article.publishedAt}>
              {format.dateTime(new Date(article.publishedAt), { dateStyle: 'long' })}
            </time>
            <span className={styles.dot} aria-hidden="true" />
            <span>{t('readingTime', { minutes: article.readingMinutes })}</span>
          </p>
        </div>

        {article.mainImage && (
          <div className={styles.hero}>
            <Image
              src={urlFor(article.mainImage).width(1680).height(1050).fit('crop').auto('format').url()}
              alt={article.mainImage.alt ?? ''}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 840px"
              className={styles.cover}
            />
          </div>
        )}

        <ArticleBody value={article.body} />
      </article>
    </main>
  );
}
