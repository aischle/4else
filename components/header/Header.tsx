'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Wordmark } from '@/components/brand/Wordmark';
import { Link, getPathname, usePathname } from '@/lib/navigation';
import type { Locale } from '@/lib/i18n';
import { NAV_FADE_MARKS, NAV_FADE_START, NAV_FADE_TEXT, NAV_FADE_END } from './navTheme';
import buttons from '@/components/ui/Button.module.css';
import styles from './Header.module.css';

/* ============================================================
   4else — sticky navigation bar
   ------------------------------------------------------------
   Glass bar that mirrors whatever ground it sits over. Over the
   hero it is dark glass; through the hero's fade it carries no
   tint at all, so the blur alone reproduces the gradient behind
   it; over the page it is the light glass the rest of the site
   knows. Its own text switches from light to ink halfway down
   the fade.

   The three points are marked by the start page — see
   ./navTheme.ts and the statement section in
   app/[locale]/page.tsx. A page without them, like the 404,
   keeps the light bar throughout.

   The links hide below 1000px, as in the design (there is no
   mobile menu yet). "Was wir tun" jumps to its anchor on the
   start page; away from the start page it carries the route in
   front of the hash, so it leads home and scrolls there. Kontakt
   is the one item with a real route, and marks itself when the
   visitor is on it.
   Pricing, About, Inspirationen (the future blog), Login and
   Demo have no destination yet and point at "#".
   ============================================================ */

type Passed = Partial<Record<string, boolean>>;

/* What a page that marks nothing looks like: the light bar. */
const ALL_PASSED: Passed = Object.fromEntries(NAV_FADE_MARKS.map((id) => [id, true]));

function navHeight() {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--nav-h');
  return Number.parseFloat(value) || 0;
}

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();

  /* The start page opens on the dark hero with nothing passed yet, so the
     bar is already dark in the server-rendered HTML — no light flash before
     the observer runs. Every other route starts, and stays, light. */
  const [passed, setPassed] = useState<Passed>(() => (pathname === '/' ? {} : ALL_PASSED));

  /* On the start page the section links are plain same-page anchors; from
     anywhere else they need the route in front of the hash. */
  const home = pathname === '/' ? '' : getPathname({ locale: locale as Locale, href: '/' });
  const section = (hash: string) => `${home}#${hash}`;
  const onContact = pathname === '/kontakt';

  useEffect(() => {
    const marks = NAV_FADE_MARKS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );

    if (marks.length === 0) {
      setPassed(ALL_PASSED);
      return;
    }

    /* Shrinking the root by the bar's height puts the trigger line at the
       bar's lower edge, so a mark counts as passed the moment it slips
       under the bar. */
    const offset = navHeight();
    const observer = new IntersectionObserver(
      (entries) =>
        setPassed((current) => {
          const next = { ...current };
          for (const entry of entries) {
            next[entry.target.id] = entry.boundingClientRect.top <= offset;
          }
          return next;
        }),
      { rootMargin: `-${offset}px 0px 0px 0px`, threshold: 0 },
    );

    marks.forEach((mark) => observer.observe(mark));
    return () => observer.disconnect();
  }, [pathname]);

  const tint = !passed[NAV_FADE_START]
    ? styles.tintDark
    : !passed[NAV_FADE_END]
      ? styles.tintClear
      : '';
  const lightText = !passed[NAV_FADE_TEXT];

  return (
    <header
      className={[styles.bar, tint, lightText ? styles.textLight : '']
        .filter(Boolean)
        .join(' ')}
    >
      <div className={styles.inner}>
        <Wordmark />

        <nav className={styles.links} aria-label={t('label')}>
          <a href={section('tun')} className={styles.link}>{t('services')}</a>
          <a href="#" className={styles.link}>{t('pricing')}</a>
          <a href="#" className={styles.link}>{t('about')}</a>
          <a href="#" className={styles.link}>{t('inspiration')}</a>
          <Link
            href="/kontakt"
            aria-current={onContact ? 'page' : undefined}
            className={`${styles.link}${onContact ? ` ${styles.linkActive}` : ''}`}
          >
            {t('contact')}
          </Link>
        </nav>

        <div className={styles.actions}>
          <a href="#" data-wip="backend" className={styles.login}>{t('login')}</a>
          <a
            href="#"
            data-wip="backend"
            className={`${buttons.pill} ${lightText ? buttons.inverse : buttons.solid} ${buttons.small}`}
          >
            {t('demo')}
          </a>
        </div>
      </div>
    </header>
  );
}
