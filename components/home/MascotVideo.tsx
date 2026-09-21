'use client';

import { useEffect, useRef } from 'react';
import styles from './MascotVideo.module.css';

/* ============================================================
   4else — the living mascot in the hero
   ------------------------------------------------------------
   A silent 7.5-second loop (Firefly, 16:9, cropped to a square
   around the creature and its orbiting icons; the loop point
   smoothed with a half-second crossfade). The poster is the loop's
   first frame, so the page looks identical before, during and
   after the video loads.

   Playback is started from here rather than by the autoplay
   attribute, for four reasons:
   - reduced motion: visitors who asked their system for less
     motion keep the poster and never download the video;
   - off-screen: the loop pauses once the hero is scrolled out
     of view and resumes when it comes back;
   - background tabs: Chrome refuses to start a silent video in
     a tab that is not showing, so a page opened in the
     background would otherwise stay frozen on its poster. The
     loop starts when the tab is shown instead;
   - iOS: React does not render `muted` into the server HTML,
     and iOS refuses to autoplay a video it cannot see is muted.
     Setting the property before play() sidesteps that.
   ============================================================ */

export function MascotVideo({ label }: { label: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    video.muted = true;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let onScreen = true;

    const sync = () => {
      if (reduceMotion.matches || !onScreen || document.hidden) {
        video.pause();
      } else {
        /* A refused play() (data saver, low-power mode) leaves the poster
           showing, which is the right fallback. */
        video.play().catch(() => {});
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });

    observer.observe(video);
    reduceMotion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    sync();

    return () => {
      observer.disconnect();
      reduceMotion.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  return (
    <video
      ref={ref}
      className={styles.video}
      width={1080}
      height={1080}
      poster="/images/home/mascot-poster.webp"
      preload="none"
      muted
      loop
      playsInline
      disablePictureInPicture
      role="img"
      aria-label={label}
    >
      <source src="/videos/home/mascot-loop.webm" type="video/webm" />
      <source src="/videos/home/mascot-loop.mp4" type="video/mp4" />
    </video>
  );
}
