'use client';

import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Wordmark } from '@/components/brand/Wordmark';
import { Link, usePathname } from '@/lib/navigation';
import { faqNumber } from '@/lib/faq';
import buttons from '@/components/ui/Button.module.css';
import type { NavItem } from './navItems';
import styles from './MobileMenu.module.css';

/* ============================================================
   4else — full-screen menu below 1000px
   ------------------------------------------------------------
   Mockup option A, chosen by Robin (September 2026). A round
   button, the only control left in the bar, opens the menu over the whole
   screen, in the hero's violet-black: the five links large and
   numbered like the FAQ, Login and Demo, the e-mail and phone
   line, and Else asking where to go.

   <dialog> with showModal(), like the wip dialog: the browser
   brings Escape, the focus trap, an inert page behind it and
   the return of focus to the button. The page stops scrolling
   while it is open (the :has() rule in the CSS).

   It closes on every link that leads somewhere, on a route
   change and when the window grows past 1000px. Placeholder
   links ("#") leave it open: the wip dialog opens on top of it,
   and closing that returns to the menu.
   ============================================================ */

export function MobileMenu({ items, lightText }: { items: NavItem[]; lightText: boolean }) {
  const t = useTranslations('nav');
  const tFooter = useTranslations('footer');
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  /* State is set here as well as in the close event: browsers deliver
     that event with the next frame, which a background tab never gets. */
  const close = useCallback(() => {
    dialog.current?.close();
    setOpen(false);
  }, []);

  const show = () => {
    dialog.current?.showModal();
    setOpen(true);
    closeButton.current?.focus();
  };

  /* Escape closes the dialog without going through close(). */
  useEffect(() => {
    const element = dialog.current;
    const onClose = () => setOpen(false);
    element?.addEventListener('close', onClose);
    return () => element?.removeEventListener('close', onClose);
  }, []);

  useEffect(close, [pathname, close]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1001px)');
    const onChange = () => desktop.matches && close();
    desktop.addEventListener('change', onChange);
    return () => desktop.removeEventListener('change', onChange);
  }, [close]);

  const onMenuClick = (event: MouseEvent) => {
    const link = (event.target as Element).closest('a');
    if (link && link.getAttribute('href') !== '#') close();
  };

  const phoneHref = `tel:${tFooter('phone').replace(/\s+/g, '')}`;

  return (
    <>
      <button
        type="button"
        className={`${styles.toggle}${lightText ? ` ${styles.toggleInverse}` : ''}`}
        aria-label={t('menuOpen')}
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={show}
      >
        <i />
        <i />
      </button>

      <dialog
        ref={dialog}
        id="site-menu"
        className={styles.menu}
        aria-label={t('menuLabel')}
        onClick={onMenuClick}
      >
        <div className={styles.inner}>
          <div className={styles.top}>
            <Wordmark />
            <button
              ref={closeButton}
              type="button"
              className={`${styles.toggle} ${styles.toggleLight} ${styles.close}`}
              aria-label={t('menuClose')}
              onClick={close}
            >
              <i />
              <i />
            </button>
          </div>

          <nav aria-label={t('label')}>
            <ol className={styles.list}>
              {items.map((item, index) => {
                const content = (
                  <>
                    <span className={styles.number}>{faqNumber(index)}</span>
                    <span className={styles.label}>{t(item.key)}</span>
                    {item.active ? <Dot /> : <Arrow />}
                  </>
                );
                const className = `${styles.link}${item.active ? ` ${styles.linkActive}` : ''}`;

                return (
                  <li key={item.key}>
                    {item.route ? (
                      <Link
                        href={item.route}
                        aria-current={item.current ? 'page' : undefined}
                        className={className}
                      >
                        {content}
                      </Link>
                    ) : (
                      <a href={item.href} className={className}>
                        {content}
                      </a>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className={styles.actions}>
            <a href="#" data-wip="backend" className={`${buttons.pill} ${buttons.ghostOnInk}`}>
              {t('login')}
            </a>
            <a href="#" data-wip="backend" className={`${buttons.pill} ${buttons.violet}`}>
              {t('demo')}
            </a>
          </div>

          <p className={styles.contact}>
            <a href={`mailto:${tFooter('email')}`} className={styles.email}>
              {tFooter('email')}
            </a>
            <br />
            <a href={phoneHref}>{tFooter('phone')}</a>
          </p>

          <div className={styles.else}>
            <p className={styles.bubble}>{t('menuBubble')}</p>
            <span className={styles.face}>
              <Image src="/images/ui/else-face.webp" alt="" width={76} height={76} />
            </span>
          </div>
        </div>
      </dialog>
    </>
  );
}

function Arrow() {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function Dot() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <circle cx="12" cy="12" r="4" fill="currentColor" />
    </svg>
  );
}
