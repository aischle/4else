'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import styles from './ScrollToTop.module.css';

/* ============================================================
   4else — scroll to top
   ------------------------------------------------------------
   Else in a white disc, bottom right, with a violet ring that
   fills as the page is read (mockup option C with the progress
   ring of option B). It appears once 30% of the page lies behind
   the visitor and hides again above that line; on hover or
   focus a speech bubble says what it does.

   The ring is written straight to the DOM on every scroll frame,
   so reading does not re-render React; state changes only when
   the 30% line is crossed. While hidden the button is
   visibility: hidden, which also takes it out of the tab order
   and the accessibility tree.

   Mounted once by the (site) layout, so every real page has it
   and the 404, which never scrolls, does not.
   ============================================================ */

const THRESHOLD = 0.3;

export function ScrollToTop() {
  const t = useTranslations('scrollTop');
  const [visible, setVisible] = useState(false);
  const ringRef = useRef<SVGCircleElement>(null);

  /* Browsers already fire scroll at most once per frame, so the handler
     measures directly. setVisible with an unchanged value re-renders
     nothing. */
  useEffect(() => {
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      /* pathLength is 100, so the offset is the unread share in percent. */
      ringRef.current?.style.setProperty('stroke-dashoffset', String(100 - progress * 100));
      setVisible(progress >= THRESHOLD);
    };

    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    /* Explicit, not 'auto': auto would inherit html's scroll-behavior. */
    window.scrollTo({ top: 0, behavior: reduce ? 'instant' : 'smooth' });
    /* Keyboard users go up with the page: focus the wordmark, the first
       stop in the sticky nav, without letting it scroll anything. */
    document.querySelector<HTMLElement>('header a')?.focus({ preventScroll: true });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label={t('label')}
      className={`${styles.button}${visible ? ` ${styles.visible}` : ''}`}
    >
      <svg className={styles.ring} viewBox="0 0 64 64" aria-hidden="true">
        <circle className={styles.track} cx="32" cy="32" r="30" />
        <circle
          ref={ringRef}
          className={styles.fill}
          cx="32"
          cy="32"
          r="30"
          pathLength={100}
        />
      </svg>
      <span className={styles.disc}>
        <Image
          src="/images/ui/else-face.webp"
          alt=""
          width={46}
          height={46}
          className={styles.face}
        />
      </span>
      <span className={styles.badge} aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </span>
      <span className={styles.tip} aria-hidden="true">
        {t('label')}
      </span>
    </button>
  );
}
