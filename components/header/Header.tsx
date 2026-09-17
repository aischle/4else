import { useTranslations } from 'next-intl';
import { Wordmark } from '@/components/brand/Wordmark';
import buttons from '@/components/ui/Button.module.css';
import styles from './Header.module.css';

/* ============================================================
   4else — sticky navigation bar
   ------------------------------------------------------------
   Glass bar over the page ground. The section links jump to
   anchors on the start page and hide below 1000px, as in the
   design (there is no mobile menu yet). Pricing, About, Login
   and Demo have no destination yet and point at "#".
   ============================================================ */

export function Header() {
  const t = useTranslations('nav');

  return (
    <header className={styles.bar}>
      <div className={styles.inner}>
        <Wordmark />

        <nav className={styles.links} aria-label={t('label')}>
          <a href="#tun" className={styles.link}>{t('services')}</a>
          <a href="#warum" className={styles.link}>{t('why')}</a>
          <a href="#ablauf" className={styles.link}>{t('steps')}</a>
          <a href="#" className={styles.link}>{t('pricing')}</a>
          <a href="#" className={styles.link}>{t('about')}</a>
        </nav>

        <div className={styles.actions}>
          <a href="#" className={styles.login}>{t('login')}</a>
          <a href="#" className={`${buttons.pill} ${buttons.solid} ${buttons.small}`}>
            {t('demo')}
          </a>
        </div>
      </div>
    </header>
  );
}
