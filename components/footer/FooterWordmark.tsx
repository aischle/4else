'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/lib/navigation';
import styles from './Footer.module.css';

/* ============================================================
   4else — the footer's closing wordmark
   ------------------------------------------------------------
   Decorative, and only on the start page: the contact design
   ends on the legal line instead, and a page that already
   carries the address does not need the shout as well.

   It is split out as a client component because the footer is
   rendered by the locale layout, which does not know the route.
   Only this line watches the path; the rest of the footer stays
   a server component.
   ============================================================ */

const rich = {
  b: (chunks: ReactNode) => <b className={styles.wordmarkStrong}>{chunks}</b>,
};

export function FooterWordmark() {
  const t = useTranslations('footer');
  const pathname = usePathname();

  if (pathname !== '/') return null;

  return (
    <p className={styles.wordmark} aria-hidden="true">
      {t.rich('wordmark', rich)}
    </p>
  );
}
