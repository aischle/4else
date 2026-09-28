'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import styles from './ZoomImage.module.css';

/* ============================================================
   4else — an image that enlarges in place
   ------------------------------------------------------------
   The thumbnail is a button; a magnifier shows on hover and
   focus (always, small, on touch screens). A click opens the
   image at its own size, at most filling the screen, in a
   native <dialog>: the browser brings Escape, the focus trap
   and the return of focus to the thumbnail. Any click in the
   dialog, beside the image or on it, closes it again.

   The image grows out of the thumbnail and shrinks back into
   it (FLIP with the Web Animations API); under reduced motion
   it only fades. The full image is rendered only while open,
   so nothing loads in advance; a small preview sits behind it
   until it arrives.

   `open` is set directly as well as on the dialog's close
   event: browsers deliver that event with the next frame,
   which a background tab never gets (as in MobileMenu).
   ============================================================ */

type Props = {
  /* Thumbnail and full-size sources (Sanity CDN URLs). */
  thumbSrc: string;
  fullSrc: string;
  /* A small, uncropped version shown behind the full image while it loads. */
  previewSrc: string;
  width: number;
  height: number;
  alt: string;
  objectPosition: string;
  sizes: string;
  openLabel: string;
  closeLabel: string;
  className?: string;
};

const DURATION = 280;
const EASING = 'cubic-bezier(0.2, 0, 0, 1)';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const settle = (animation: Animation) =>
  Promise.race([animation.finished, new Promise((resolve) => setTimeout(resolve, DURATION + 120))]);

export function ZoomImage({
  thumbSrc,
  fullSrc,
  previewSrc,
  width,
  height,
  alt,
  objectPosition,
  sizes,
  openLabel,
  closeLabel,
  className,
}: Props) {
  const thumb = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const closing = useRef(false);
  const [open, setOpen] = useState(false);

  /* From the thumbnail's box to the image's own, centre on centre, scaled
     to the thumbnail's width. */
  const fromThumb = useCallback((): Keyframe | null => {
    /* Measure the image where it rests, not halfway through a zoom. */
    frame.current?.getAnimations().forEach((animation) => animation.cancel());
    const a = thumb.current?.getBoundingClientRect();
    const b = frame.current?.getBoundingClientRect();
    if (!a || !b || b.width === 0) return null;
    const scale = a.width / b.width;
    const dx = a.left + a.width / 2 - (b.left + b.width / 2);
    const dy = a.top + a.height / 2 - (b.top + b.height / 2);
    return { transform: `translate(${dx}px, ${dy}px) scale(${scale})`, opacity: 0.6 };
  }, []);

  /* Open: show the dialog once the image is in the DOM, then grow it. */
  useEffect(() => {
    if (!open) return;
    dialog.current?.showModal();
    const start = reducedMotion() ? { opacity: 0 } : fromThumb();
    if (start && frame.current) {
      frame.current.animate([start, { transform: 'none', opacity: 1 }], {
        duration: DURATION,
        easing: EASING,
      });
    }
  }, [open, fromThumb]);

  const close = useCallback(async () => {
    if (closing.current || !dialog.current?.open) return;
    closing.current = true;
    const end = reducedMotion() ? { opacity: 0 } : fromThumb();
    if (end && frame.current) {
      dialog.current.classList.add(styles.leaving);
      await settle(
        frame.current.animate([{ transform: 'none', opacity: 1 }, end], {
          duration: DURATION,
          easing: EASING,
          fill: 'forwards',
        }),
      );
      dialog.current.classList.remove(styles.leaving);
    }
    dialog.current.close();
    setOpen(false);
    closing.current = false;
  }, [fromThumb]);

  /* Escape: take the browser's cancel, but close with the animation. */
  useEffect(() => {
    const element = dialog.current;
    const onCancel = (event: Event) => {
      event.preventDefault();
      void close();
    };
    const onClose = () => setOpen(false);
    element?.addEventListener('cancel', onCancel);
    element?.addEventListener('close', onClose);
    return () => {
      element?.removeEventListener('cancel', onCancel);
      element?.removeEventListener('close', onClose);
    };
  }, [close]);

  /* Its own width at most, never wider or taller than the screen (24px
     margin all round). An explicit width, not max-width, so the box has
     its size before the file arrives; the height follows from the width
     and height attributes. */
  const fullStyle: CSSProperties = {
    width: `min(${width}px, calc(100vw - 48px), calc((100svh - 48px) * ${width / height}))`,
    backgroundImage: `url(${previewSrc})`,
  };

  return (
    <>
      <button
        ref={thumb}
        type="button"
        className={`${styles.thumb}${className ? ` ${className}` : ''}`}
        aria-label={`${openLabel}: ${alt}`}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <Image
          src={thumbSrc}
          alt=""
          fill
          sizes={sizes}
          className={styles.thumbImage}
          style={{ objectPosition }}
        />
        <span className={styles.veil} aria-hidden="true" />
        <span className={styles.badge} aria-hidden="true">
          <MagnifierIcon />
        </span>
      </button>

      <dialog ref={dialog} className={styles.dialog} aria-label={alt} onClick={() => void close()}>
        {open && (
          <>
            <div ref={frame} className={styles.frame}>
              <Image
                src={fullSrc}
                alt={alt}
                width={width}
                height={height}
                sizes={`min(${width}px, 100vw)`}
                loading="eager"
                className={styles.full}
                style={fullStyle}
              />
            </div>
            <button type="button" className={styles.close} aria-label={closeLabel}>
              <CloseIcon />
            </button>
          </>
        )}
      </dialog>
    </>
  );
}

function MagnifierIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5M11 8.5v5M8.5 11h5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
