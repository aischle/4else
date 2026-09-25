import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Wordmark } from '@/components/brand/Wordmark';
import styles from './Footer.module.css';

/* ============================================================
   4else — footer
   ------------------------------------------------------------
   Address block, three link columns, the giant wordmark, and
   the legal bar. Link destinations are not built yet and point
   at "#"; the e-mail and phone are real mailto/tel links.

   One footer for the whole site: the locale layout renders it
   on every route, and every page gets it in full, closing
   wordmark included. (The contact handoff drops the wordmark
   away from the start page — Robin asked for the start page's
   footer everywhere instead.)
   ============================================================ */

const rich = {
  b: (chunks: ReactNode) => <b className={styles.wordmarkStrong}>{chunks}</b>,
};

export function Footer() {
  const t = useTranslations('footer');
  const phoneHref = `tel:${t('phone').replace(/\s+/g, '')}`;

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.contact}>
          <Wordmark className={styles.brand} />
          <p className={styles.p}>
            {t('company')}
            <br />
            {t('street')}
            <br />
            {t('city')}
          </p>
          <p className={styles.p}>
            <a href={`mailto:${t('email')}`} className={styles.link}>
              {t('email')}
            </a>
            <br />
            <a href={phoneHref} className={styles.link}>
              {t('phone')}
            </a>
          </p>
        </div>

        <div>
          <h2 className={styles.heading}>{t('startHeading')}</h2>
          <ul className={styles.list}>
            <li><a href="#" data-wip="backend" className={styles.link}>{t('startDemo')}</a></li>
            <li><a href="#" data-wip="backend" className={styles.link}>{t('startRegister')}</a></li>
            <li><a href="#" data-wip="backend" className={styles.link}>{t('startLogin')}</a></li>
            <li><a href="#" className={styles.link}>{t('startPricing')}</a></li>
          </ul>
        </div>

        <div>
          <h2 className={styles.heading}>{t('knowHeading')}</h2>
          <ul className={styles.list}>
            <li><a href="#" className={styles.link}>{t('knowTerminal')}</a></li>
            <li><a href="#" className={styles.link}>{t('knowWordpress')}</a></li>
            <li><a href="#" className={styles.link}>{t('knowWebshop')}</a></li>
            <li><a href="#" className={styles.link}>{t('knowSupport')}</a></li>
            <li><a href="#" className={styles.link}>{t('knowInspiration')}</a></li>
          </ul>
        </div>

        <div>
          <h2 className={styles.heading}>{t('followHeading')}</h2>
          <ul className={styles.list}>
            <li><a href="#" className={styles.link}>{t('followLinkedin')}</a></li>
            <li><a href="#" className={styles.link}>{t('followInstagram')}</a></li>
            <li><a href="#" className={styles.link}>{t('followTelegram')}</a></li>
          </ul>
        </div>
      </div>

      <p className={styles.wordmark} aria-hidden="true">
        {t.rich('wordmark', rich)}
      </p>

      <div className={styles.legal}>
        <span>{t('copyright')}</span>
        <nav aria-label={t('legalLabel')}>
          <a href="#" className={styles.legalLink}>{t('imprint')}</a>
          {' · '}
          <a href="#" className={styles.legalLink}>{t('terms')}</a>
          {' · '}
          <a href="#" className={styles.legalLink}>{t('privacy')}</a>
        </nav>
      </div>
    </footer>
  );
}
