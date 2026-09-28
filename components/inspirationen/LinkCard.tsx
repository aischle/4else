import { useTranslations } from 'next-intl';
import { assetSize, urlFor, type LinkCardBlock } from '@/lib/sanity';
import { ZoomImage } from './ZoomImage';
import styles from './LinkCard.module.css';

/* ============================================================
   4else — link card inside an article
   ------------------------------------------------------------
   Mockup option A, chosen by Robin (September 2026): a white
   card with the image on the left (on top on phones) and, on the
   right, category and name, title, description (three lines at
   most) and the domain.

   The card is not one big link: the image is its own button,
   which enlarges it (ZoomImage), and a button inside a link is
   invalid. The text side is the link instead: the title's link
   stretches over the whole text column (::after), footer
   included, and always opens in a new tab. Hovering it lifts
   the card and nudges the arrow.
   ============================================================ */

function domain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export function LinkCard({ value }: { value: LinkCardBlock }) {
  const t = useTranslations('inspirationen');
  if (!value?.url || !value.title) return null;

  const image = value.image?.asset ? value.image : null;
  const size = assetSize(image?.asset?._ref);
  const hotspot = image?.hotspot;
  const eyebrow = [value.label, value.name].filter(Boolean).join(' · ');

  return (
    <aside className={`${styles.card}${image ? '' : ` ${styles.textOnly}`}`}>
      {image && (
        <div className={styles.media}>
          <ZoomImage
            thumbSrc={urlFor(image).width(800).fit('max').auto('format').url()}
            fullSrc={urlFor(image).width(Math.min(size.width, 2400)).fit('max').auto('format').url()}
            previewSrc={urlFor(image).width(480).fit('max').auto('format').url()}
            width={size.width}
            height={size.height}
            alt={image.alt ?? ''}
            objectPosition={hotspot ? `${hotspot.x * 100}% ${hotspot.y * 100}%` : '50% 8%'}
            sizes="(max-width: 620px) 100vw, 250px"
            openLabel={t('zoomOpen')}
            closeLabel={t('zoomClose')}
          />
        </div>
      )}
      <div className={styles.text}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <p className={styles.title}>
          <a href={value.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
            {value.title}
            <span className="srOnly"> {t('linkCardNewTab')}</span>
          </a>
        </p>
        {value.text && <p className={styles.description}>{value.text}</p>}
        <p className={styles.foot}>
          <span className={styles.domain}>
            <span className={styles.tile} aria-hidden="true">
              {value.name.charAt(0).toUpperCase()}
            </span>
            {domain(value.url)}
          </span>
          <span className={styles.go} aria-hidden="true">
            {t('linkCardCta')}
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </p>
      </div>
    </aside>
  );
}
