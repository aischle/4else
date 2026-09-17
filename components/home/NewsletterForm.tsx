'use client';

import { useTranslations } from 'next-intl';
import buttons from '@/components/ui/Button.module.css';
import styles from './NewsletterForm.module.css';

/* ============================================================
   4else — newsletter sign-up (UI only)
   ------------------------------------------------------------
   Matches the design, which has no backend: submitting does
   nothing yet. Wire it to a list provider before launch.
   ============================================================ */

export function NewsletterForm() {
  const t = useTranslations('newsletter');

  return (
    <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="newsletter-email" className="srOnly">
        {t('emailLabel')}
      </label>
      <input
        id="newsletter-email"
        type="email"
        name="email"
        autoComplete="email"
        placeholder={t('placeholder')}
        className={styles.input}
      />
      <button type="submit" className={`${buttons.pill} ${buttons.solid} ${styles.submit}`}>
        {t('submit')}
      </button>
    </form>
  );
}
