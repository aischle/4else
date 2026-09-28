'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useIsPresentationTool } from 'next-sanity/hooks';
import buttons from '@/components/ui/Button.module.css';
import styles from './ExitPreview.module.css';

/* ============================================================
   4else — "Vorschau beenden"
   ------------------------------------------------------------
   Shown in draft mode when the page is open in a tab of its
   own (the Studio's "open in new tab"), so it is clear that
   drafts are showing and there is a way back to the published
   page. Inside the Studio's Vorschau tool it stays hidden: the
   Studio controls the preview there. A plain <a>, not the typed
   Link: the target is a route handler, not a page.
   ============================================================ */

export function ExitPreview() {
  const t = useTranslations('preview');
  const pathname = usePathname();
  const inStudio = useIsPresentationTool();

  /* null while the check runs, true inside the Studio. */
  if (inStudio !== false) return null;

  return (
    <div className={styles.bar} role="status">
      <span className={styles.label}>{t('label')}</span>
      <a
        href={`/api/draft-mode/disable?redirect=${encodeURIComponent(pathname)}`}
        className={`${buttons.pill} ${buttons.inverse} ${styles.exit}`}
      >
        {t('exit')}
      </a>
    </div>
  );
}
