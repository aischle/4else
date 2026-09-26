import type { Metadata } from 'next';
import Image from 'next/image';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/lib/navigation';
import { getArticles, urlFor } from '@/lib/sanity';
import styles from './inspirationen.module.css';

/* ============================================================
   4else — Inspirationen (the blog), overview
   ------------------------------------------------------------
   Lists every published article from Sanity (project 6e5n16nr),
   newest first. Articles are written in the Studio at
   fourelse.sanity.studio; this page picks them up within 60s, or
   at once via the /api/revalidate webhook.
   ============================================================ */

export const revalidate = 60;

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: t('inspirationenTitle'),
    description: t('inspirationenDescription'),
    alternates: { canonical: '/inspirationen' },
  };
}

export default async function InspirationenPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  const [t, format, articles] = await Promise.all([
    getTranslations('inspirationen'),
    getFormatter(),
    getArticles(),
  ]);

  return (
    <main className={styles.container}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>{t('eyebrow')}</p>
        <h1 className={styles.headline}>{t('headline')}</h1>
        <p className={styles.lead}>{t('intro')}</p>
      </header>

      {articles.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>{t('emptyTitle')}</p>
          <p className={styles.emptyBody}>{t('emptyBody')}</p>
        </div>
      ) : (
        <ul className={styles.grid} aria-label={t('listLabel')}>
          {articles.map((article) => (
            <li key={article._id}>
              <Link
                href={{ pathname: '/inspirationen/[slug]', params: { slug: article.slug } }}
                className={styles.card}
              >
                <div className={styles.cardMedia}>
                  {article.mainImage && (
                    <Image
                      src={urlFor(article.mainImage).width(960).height(600).fit('crop').auto('format').url()}
                      alt={article.mainImage.alt ?? ''}
                      fill
                      sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 400px"
                      className={styles.cover}
                    />
                  )}
                </div>
                <div className={styles.cardText}>
                  <time className={styles.date} dateTime={article.publishedAt}>
                    {format.dateTime(new Date(article.publishedAt), { dateStyle: 'long' })}
                  </time>
                  <h2 className={styles.cardTitle}>{article.title}</h2>
                  <p className={styles.excerpt}>{article.excerpt}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
