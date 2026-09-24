import type { ReactNode } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link, getPathname } from '@/lib/navigation';
import type { Locale } from '@/lib/i18n';
import buttons from '@/components/ui/Button.module.css';
import styles from './not-found.module.css';

/* ============================================================
   4else — 404
   ------------------------------------------------------------
   Built from the design handoff "404 v2" (variant 2b, "Else
   rätselt über der 404"): Else stands puzzled in front of a
   giant, very pale "404", then an eyebrow, the headline, one
   sentence and four ways back.

   It sits inside the locale segment but outside the (site)
   route group, so it keeps the html, the fonts and the
   visitor's language while standing alone — no nav, no footer,
   the content centred in the viewport. Unknown URLs reach it
   through the catch-all in ./[...rest]/page.tsx, which is also
   what makes the response a real 404.

   The giant numerals are decoration (aria-hidden); the eyebrow
   says "Fehler 404" in words, and the heading is the sentence
   below it.
   ============================================================ */

const rich = {
  accent: (chunks: ReactNode) => <span className={styles.accent}>{chunks}</span>,
};

export default function NotFound() {
  const t = useTranslations('notFound');
  const locale = useLocale();
  const home = getPathname({ locale: locale as Locale, href: '/' });

  return (
    <main className={styles.wrap}>
      <div className={styles.stage}>
        <p className={styles.ghost} aria-hidden="true">
          404
        </p>
        <Image
          src="/images/404/else-sucht.webp"
          alt={t('imageAlt')}
          width={900}
          height={900}
          sizes="(max-width: 800px) 50vw, 380px"
          priority
          className={styles.else}
        />
      </div>

      <div className={styles.text}>
        <p className={styles.eyebrow}>{t('eyebrow')}</p>
        <h1 className={styles.headline}>{t.rich('headline', rich)}</h1>
        <p className={styles.body}>{t('body')}</p>
      </div>

      <div className={styles.ways}>
        <Link href="/" className={`${buttons.pill} ${buttons.solid} ${styles.home}`}>
          {t('home')} <span aria-hidden="true">→</span>
        </Link>
        <a href={`${home}#ablauf`} className={`${buttons.pill} ${styles.soft}`}>
          {t('howItWorks')}
        </a>
        <a href="#" className={`${buttons.pill} ${styles.soft}`}>
          {t('pricing')}
        </a>
        <Link href="/kontakt" className={`${buttons.pill} ${styles.soft}`}>
          {t('contact')}
        </Link>
      </div>
    </main>
  );
}
