'use client';

import { useEffect, useState } from 'react';
import styles from './LegalToc.module.css';

/* ============================================================
   4else — the spine of a legal page
   ------------------------------------------------------------
   The section list left of the text (after Limen's terms page).
   On wide screens it stays in view and marks the section being
   read; on phones the page shows it as a plain list above the
   text.

   Active section: the last one whose heading has passed a line
   30% down the viewport, measured in the scroll listener
   (browsers fire scroll at most once per frame). At the very
   bottom the last section wins, even if it is too short to
   reach the line. The links are plain anchors, so the browser
   updates the hash and the smooth scroll stands down under
   reduced motion by itself (globals.css).
   ============================================================ */

export type TocItem = { id: string; number: string; label: string };

export function LegalToc({ label, items }: { label: string; items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    function update() {
      const line = window.innerHeight * 0.3;
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      let current = headings[0]?.id;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= line) current = heading.id;
      }
      if (atBottom) current = headings[headings.length - 1]?.id;
      setActive(current);
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [items]);

  return (
    <nav className={styles.toc} aria-label={label}>
      <p className={styles.head} aria-hidden="true">
        {label}
      </p>
      <ol className={styles.list}>
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={isActive ? `${styles.link} ${styles.linkActive}` : styles.link}
                aria-current={isActive ? 'location' : undefined}
              >
                <span className={styles.num}>{item.number}</span>
                <span>{item.label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
