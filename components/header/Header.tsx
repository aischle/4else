'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Wordmark } from '@/components/brand/Wordmark';
import { usePathname } from '@/lib/navigation';
import { NAV_THEME_SENTINEL } from './navTheme';
import buttons from '@/components/ui/Button.module.css';
import styles from './Header.module.css';

/* ============================================================
   4else — sticky navigation bar
   ------------------------------------------------------------
   Glass bar that mirrors whatever ground it sits over: dark
   while it is above the mascot hero and its fade, light once
   the page ground has taken over.

   The flip is driven by a single sentinel element that the
   start page puts at the end of that fade (NAV_THEME_SENTINEL,
   see ./navTheme.ts). A page without the sentinel — the 404 —
   keeps the light bar throughout.

   The section links jump to anchors on the start page and hide
   below 1000px, as in the design (there is no mobile menu yet).
   Pricing, About, Login and Demo have no destination yet and
   point at "#".
   ============================================================ */

function navHeight() {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--nav-h');
  return Number.parseFloat(value) || 0;
}

export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  /* The start page opens on the dark hero, so the bar is already dark in
     the server-rendered HTML — no light flash before the observer runs. */
  const [onDark, setOnDark] = useState(() => pathname === '/');

  useEffect(() => {
    const sentinel = document.getElementById(NAV_THEME_SENTINEL);

    if (!sentinel) {
      setOnDark(false);
      return;
    }

    /* Shrinking the root by the bar's height puts the trigger line at the
       bar's lower edge: the ground is dark for as long as the sentinel is
       still below it. */
    const offset = navHeight();
    const observer = new IntersectionObserver(
      ([entry]) => setOnDark(entry.boundingClientRect.top > offset),
      { rootMargin: `-${offset}px 0px 0px 0px`, threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header className={`${styles.bar}${onDark ? ` ${styles.onDark}` : ''}`}>
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
          <a
            href="#"
            className={`${buttons.pill} ${onDark ? buttons.inverse : buttons.solid} ${buttons.small}`}
          >
            {t('demo')}
          </a>
        </div>
      </div>
    </header>
  );
}
