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
   Built from the design handoff "404 (Der Blick durchs
   Guckloch)": the 0 of "404" is a porthole Else peeks through,
   then the headline, one sentence and four ways back.

   It sits inside the locale segment but outside the (site)
   route group, so it keeps the html, the fonts and the
   visitor's language while standing alone — no nav, no footer,
   the content centred in the viewport. Unknown URLs reach it
   through the catch-all in ./[...rest]/page.tsx, which is also
   what makes the response a real 404.

   The numerals are a <p>, not a heading: the page's heading is
   the sentence below them. The code is announced by a visually
   hidden label rather than aria-label, which a <p> has no role
   to carry.
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
      <p className={styles.code}>
        <span className="srOnly">{t('codeLabel')}</span>
        <span aria-hidden="true">4</span>
        <span className={styles.porthole}>
          <Image
            src="/images/404/else-porthole.webp"
            alt={t('imageAlt')}
            fill
            sizes="(min-width: 1280px) 236px, 22vw"
            priority
            className={styles.portholeImage}
          />
        </span>
        <span aria-hidden="true">4</span>
      </p>

      <div className={styles.text}>
        <h1 className={styles.headline}>{t.rich('headline', rich)}</h1>
        <p className={styles.body}>{t('body')}</p>
      </div>

      <div className={styles.ways}>
        <Link href="/" className={`${buttons.pill} ${buttons.solid}`}>
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
