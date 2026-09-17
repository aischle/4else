import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import buttons from '@/components/ui/Button.module.css';
import styles from './not-found.module.css';

/* 404 inside the locale segment, so it keeps the nav, footer and
   the visitor's language. All copy via the `notFound` namespace. */

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <main className={styles.wrap}>
      <span className={styles.eyebrow}>{t('eyebrow')}</span>
      <h1 className={styles.headline}>{t('headline')}</h1>
      <p className={styles.body}>{t('body')}</p>
      <Link href="/" className={`${buttons.pill} ${buttons.solid}`}>
        {t('cta')}
      </Link>
    </main>
  );
}
