'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import buttons from '@/components/ui/Button.module.css';
import styles from './WipDialog.module.css';

/* ============================================================
   4else — "not built yet" dialog
   ------------------------------------------------------------
   The site is the design; the application behind it and the
   pages beyond Start/Kontakt/404 are not part of it. Every
   control that would need one of those points at "#", and this
   dialog explains why nothing happens.

   It catches the clicks centrally — one listener, on the whole
   document — so no link has to opt in and nothing is forgotten
   when a placeholder is added later. What a link may say is
   which of the two explanations fits:

     data-wip="backend"  the 4else application (Login, Demo,
                         Registrieren, Event erstellen)
     no attribute        a page that is not designed yet
                         (Preise, Über uns, Impressum …)

   <dialog> rather than a div: the browser brings the backdrop,
   Escape, the focus trap and the return of focus with it.
   ============================================================ */

type Variant = 'backend' | 'page';

export function WipDialog() {
  const t = useTranslations('wip');
  const ref = useRef<HTMLDialogElement>(null);
  const [variant, setVariant] = useState<Variant>('page');

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) {
        return;
      }

      const target = (event.target as Element | null)?.closest<HTMLElement>('a[href="#"]');
      if (!target) return;

      event.preventDefault();
      setVariant(target.dataset.wip === 'backend' ? 'backend' : 'page');
      ref.current?.showModal();
    };

    /* A click on the backdrop lands on the dialog element itself, never on
       its content: that is the "click outside" people expect. */
    const onBackdrop = (event: MouseEvent) => {
      if (event.target === ref.current) ref.current?.close();
    };

    document.addEventListener('click', onClick);
    ref.current?.addEventListener('click', onBackdrop);
    const dialog = ref.current;

    return () => {
      document.removeEventListener('click', onClick);
      dialog?.removeEventListener('click', onBackdrop);
    };
  }, []);

  return (
    <dialog ref={ref} className={styles.dialog} aria-labelledby="wip-title">
      <div className={styles.inner}>
        <span className={styles.icon}>
          <ToolIcon />
        </span>
        <h2 id="wip-title" className={styles.title}>
          {t(`${variant}Title`)}
        </h2>
        <p className={styles.body}>{t(`${variant}Body`)}</p>
        <div className={styles.actions}>
          <form method="dialog">
            <button type="submit" className={`${buttons.pill} ${buttons.solid}`}>
              {t('close')}
            </button>
          </form>
          <Link
            href="/kontakt"
            onClick={() => ref.current?.close()}
            className={`${buttons.pill} ${buttons.outline}`}
          >
            {t('contact')}
          </Link>
        </div>
      </div>
    </dialog>
  );
}

function ToolIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14.7 6.3a4 4 0 0 0 5 5L15 16l-3 3-4-4 3-3 4.7-4.7Z" />
      <path d="M8 15l-4.5 4.5a1.8 1.8 0 0 0 2.5 2.5L10.5 18" />
    </svg>
  );
}
