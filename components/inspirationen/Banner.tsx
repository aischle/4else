import type { ReactNode } from 'react';
import Image from 'next/image';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { stegaClean } from '@sanity/client/stega';
import { urlFor, type BannerBlock } from '@/lib/sanity';
import buttons from '@/components/ui/Button.module.css';
import styles from './Banner.module.css';

/* ============================================================
   4else — banner inside an article (studio/schemaTypes/banner.ts)
   ------------------------------------------------------------
   The mockups Robin approved (October 2026,
   https://claude.ai/artifact/YS1F4yQoESXMGjNxHQ97Hs): a band that
   interrupts the text.
   - Width: the whole page ("voll", out of the text column with
     the article's container units) or the title image's 992px
     ("bild", the hero's own overhang, rounded corners).
   - Ground: seven 4else colours, or a photo under a veil of the
     hero ground (from the left for left-aligned text, even when
     centred). On a narrow banner the photo stands above the text
     instead, on the hero ground.
   - An optional icon above the text (five line icons or Else's
     face), a small heading, the title, the text through the
     article's own Portable Text components, an optional button,
     filled or outlined.
   The text colours follow the ground (Banner.module.css).

   In the Studio's preview every choice carries stega, so each is
   cleaned before it is compared; anything unknown falls back to
   the first option.
   ============================================================ */

const WIDTHS = ['voll', 'bild'] as const;
const COLORS = ['navy', 'nacht', 'violett', 'eisviolett', 'eisblau', 'eislemon', 'eisorange'] as const;
const ALIGNS = ['mitte', 'links'] as const;
const ICONS = ['none', 'info', 'achtung', 'tipp', 'haekchen', 'termin', 'else'] as const;
const DARK = new Set<string>(['navy', 'nacht', 'violett', 'foto']);

function pick<T extends string>(raw: string | undefined, options: readonly T[]): T {
  const value = stegaClean(raw);
  return options.find((option) => option === value) ?? options[0];
}

/* The mockups' line icons, 24px grid, drawn in currentColor. */
const GLYPHS: Record<Exclude<(typeof ICONS)[number], 'none' | 'else'>, ReactNode> = {
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5" />
      <path d="M12 7.6h.01" />
    </>
  ),
  achtung: (
    <>
      <path d="M10.3 4.3 2.7 17.6a2 2 0 0 0 1.7 2.9h15.2a2 2 0 0 0 1.7-2.9L13.7 4.3a2 2 0 0 0-3.4 0z" />
      <path d="M12 9.5v4.2" />
      <path d="M12 17.1h.01" />
    </>
  ),
  tipp: (
    <>
      <path d="M9.5 18h5" />
      <path d="M10.5 21h3" />
      <path d="M12 3a6 6 0 0 0-3.7 10.7c.7.6 1.2 1.4 1.2 2.3h5c0-.9.5-1.7 1.2-2.3A6 6 0 0 0 12 3z" />
    </>
  ),
  haekchen: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.3 12.4l2.6 2.6 5-5.3" />
    </>
  ),
  termin: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 10h17" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M8 14h3" />
    </>
  ),
};

export function Banner({
  value,
  components,
}: {
  value: BannerBlock;
  components: PortableTextComponents;
}) {
  if (!value.title && !value.content?.length) return null;

  const width = pick(value.width, WIDTHS);
  const photo = stegaClean(value.background) === 'foto' && value.image?.asset ? value.image : null;
  const ground = photo ? 'foto' : pick(value.color, COLORS);
  const align = pick(value.align, ALIGNS);
  const icon = pick(value.icon, ICONS);
  const dark = DARK.has(ground);
  const titleId = `banner-${value._key}-title`;
  const button = value.button?.label && value.button.url ? value.button : null;
  /* Filled: white on dark grounds, navy on light ones. Outlined: the
     CTA band's ghost on dark, the white outline pill on light. */
  const outlined = stegaClean(button?.style) === 'umriss';
  const buttonLook = dark
    ? outlined
      ? buttons.ghostOnInk
      : buttons.inverse
    : outlined
      ? buttons.outline
      : buttons.solid;

  return (
    <aside
      className={`${styles.banner} ${styles[width]}`}
      aria-labelledby={value.title ? titleId : undefined}
    >
      <div className={`${styles.panel} ${styles[ground]} ${styles[align]}`}>
        {photo && (
          <div className={styles.photo}>
            <Image
              src={urlFor(photo).width(2400).fit('max').auto('format').url()}
              alt={photo.alt ?? ''}
              fill
              sizes={width === 'voll' ? '100vw' : '(max-width: 1040px) 100vw, 992px'}
              className={styles.photoImage}
              style={
                photo.hotspot
                  ? { objectPosition: `${photo.hotspot.x * 100}% ${photo.hotspot.y * 100}%` }
                  : undefined
              }
            />
          </div>
        )}
        <div className={styles.inner}>
          <div className={styles.content}>
            {icon === 'else' ? (
              <Image
                src="/images/ui/else-face.webp"
                alt=""
                width={64}
                height={64}
                className={styles.face}
              />
            ) : icon !== 'none' ? (
              <span className={styles.icon}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {GLYPHS[icon]}
                </svg>
              </span>
            ) : null}
            {value.kicker && <p className={styles.kicker}>{value.kicker}</p>}
            {value.title && (
              <p id={titleId} className={styles.title}>
                {value.title}
              </p>
            )}
            {value.content?.length ? (
              <div className={styles.text}>
                <PortableText value={value.content} components={components} />
              </div>
            ) : null}
            {button && (
              <a
                href={button.url}
                className={`${buttons.pill} ${buttonLook} ${styles.button}`}
              >
                {button.label}
              </a>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
