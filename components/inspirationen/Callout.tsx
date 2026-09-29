import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { stegaClean } from '@sanity/client/stega';
import type { CalloutBlock, CalloutTone } from '@/lib/sanity';
import styles from './Callout.module.css';

/* ============================================================
   4else — callout inside an article (studio/schemaTypes/callout.ts)
   ------------------------------------------------------------
   The mix Robin chose from the mockups (September 2026):
   - Gut zu wissen: Eisblau, a navy info icon beside the label
     (option B);
   - Wichtig: Eis-Orange, an orange exclamation mark in the same
     place (option C's third tone);
   - Unser Tipp: Eisviolett, Else's face on the top edge with a
     navy speech bubble (option D).
   The labels are the site's copy (inspirationen.callout*), the
   Studio only picks the tone. The text renders through the
   article's own Portable Text components (passed in by
   ArticleBody), so its lists and links look like the rest.

   An <aside> named by its label and title. In the Studio's
   preview the tone carries stega (lib/sanity.ts), so it is
   cleaned before it is compared; anything unknown is "wissen".
   ============================================================ */

const TONES: readonly CalloutTone[] = ['wissen', 'wichtig', 'tipp'];

function toneOf(raw: string | undefined): CalloutTone {
  const tone = stegaClean(raw);
  return TONES.find((t) => t === tone) ?? 'wissen';
}

const LABEL = {
  wissen: 'calloutWissen',
  wichtig: 'calloutWichtig',
  tipp: 'calloutTipp',
} as const;

function InfoIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 26 26" aria-hidden="true">
      <circle className={styles.iconGround} cx="13" cy="13" r="13" />
      <circle className={styles.iconGlyph} cx="13" cy="8.2" r="1.6" />
      <rect className={styles.iconGlyph} x="11.6" y="11.2" width="2.8" height="7.6" rx="1.4" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 26 26" aria-hidden="true">
      <circle className={styles.iconGround} cx="13" cy="13" r="13" />
      <rect className={styles.iconGlyph} x="11.6" y="6.4" width="2.8" height="8.8" rx="1.4" />
      <circle className={styles.iconGlyph} cx="13" cy="18.6" r="1.6" />
    </svg>
  );
}

export function Callout({
  value,
  components,
}: {
  value: CalloutBlock;
  components: PortableTextComponents;
}) {
  const t = useTranslations('inspirationen');
  if (!value.content?.length && !value.title) return null;

  const tone = toneOf(value.tone);
  const labelId = `callout-${value._key}-label`;
  const titleId = `callout-${value._key}-title`;
  const label = t(LABEL[tone]);

  return (
    <aside
      className={`${styles.callout} ${styles[tone]}`}
      aria-labelledby={value.title ? `${labelId} ${titleId}` : labelId}
    >
      {tone === 'tipp' ? (
        <div className={styles.who}>
          <Image
            src="/images/ui/else-face.webp"
            alt=""
            width={56}
            height={56}
            className={styles.face}
          />
          <span id={labelId} className={styles.bubble}>
            {label}
          </span>
        </div>
      ) : (
        <p className={styles.tag}>
          {tone === 'wichtig' ? <WarningIcon /> : <InfoIcon />}
          <span id={labelId}>{label}</span>
        </p>
      )}
      {value.title && (
        <p id={titleId} className={styles.title}>
          {value.title}
        </p>
      )}
      {value.content?.length ? (
        <div className={styles.body}>
          <PortableText value={value.content} components={components} />
        </div>
      ) : null}
    </aside>
  );
}
