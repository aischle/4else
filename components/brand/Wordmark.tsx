import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import styles from './Wordmark.module.css';

/* ============================================================
   4else — typographic wordmark ("4else" + ".events")
   ------------------------------------------------------------
   Used in the nav and the footer. Links home through the typed
   Link so the locale prefix is kept.
   ============================================================ */

export function Wordmark({ className }: { className?: string }) {
  const t = useTranslations('brand');

  return (
    <Link
      href="/"
      className={`${styles.wordmark}${className ? ` ${className}` : ''}`}
      aria-label={t('homeLabel')}
    >
      {t('name')}
      <small className={styles.suffix}>{t('suffix')}</small>
    </Link>
  );
}
