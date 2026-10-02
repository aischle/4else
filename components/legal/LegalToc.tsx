'use client';

import { useEffect, useRef, useState } from 'react';
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

   A long list (the privacy policy has 29 sections) is taller
   than the screen and scrolls in its own box; the marked item is
   then kept in view inside it, without moving the page. On
   phones a long list is a box of its own height (LONG).
   ============================================================ */

export type TocItem = { id: string; number: string; label: string };

const LONG = 14;

/* The nearest ancestor that scrolls its content. */
function scrollBox(el: HTMLElement) {
  for (let node = el.parentElement; node; node = node.parentElement) {
    const overflow = getComputedStyle(node).overflowY;
    if ((overflow === 'auto' || overflow === 'scroll') && node.scrollHeight > node.clientHeight) {
      return node;
    }
  }
  return null;
}

export function LegalToc({ label, items }: { label: string; items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    /* Only where the spine stays beside the text (the page's 960px). */
    if (!window.matchMedia('(min-width: 960px)').matches) return;
    const link = listRef.current?.querySelector<HTMLElement>('[aria-current]');
    if (!link) return;
    const box = scrollBox(link);
    if (!box) return;
    const item = link.getBoundingClientRect();
    const frame = box.getBoundingClientRect();
    const margin = 48;
    if (item.top < frame.top + margin) box.scrollTop -= frame.top + margin - item.top;
    else if (item.bottom > frame.bottom - margin) box.scrollTop += item.bottom - frame.bottom + margin;
  }, [active]);

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
      <ol
        ref={listRef}
        className={items.length > LONG ? `${styles.list} ${styles.listLong}` : styles.list}
      >
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
