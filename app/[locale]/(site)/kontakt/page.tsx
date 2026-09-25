import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ContactForm } from '@/components/contact/ContactForm';
import { faqNumber } from '@/lib/faq';
import buttons from '@/components/ui/Button.module.css';
import styles from './page.module.css';

/* ============================================================
   4else — contact page
   ------------------------------------------------------------
   Built from the design handoff "4else Kontakt", with the v4
   update. Sections, in order: hero → Beatrice band → form and
   contact cards → FAQ → dark CTA band; the nav and footer come
   from the locale layout.

   No dark hero and no mascot: those stay exclusive to the start
   page. Instead the hero, the Beatrice band and the form sit on
   one white block that runs up behind the sticky nav, so the bar
   reads as white here.

   The form has no backend yet — see components/contact/
   ContactForm.tsx. All copy lives in messages/de.json.
   ============================================================ */

const rich = {
  accent: (chunks: ReactNode) => <span className={styles.accent}>{chunks}</span>,
};

const faqs = ['k1', 'k2', 'k3', 'k4'] as const;

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: t('kontaktTitle'),
    description: t('kontaktDescription'),
    alternates: { canonical: '/kontakt' },
  };
}

export default function KontaktPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  const t = useTranslations('kontakt');

  return (
    <main>
      {/* ── White block: hero + form ─────────────────────────── */}
      <div className={styles.white}>
        <section className={styles.hero} aria-labelledby="kontakt-headline">
          <div className={`${styles.container} ${styles.heroGrid}`}>
            <div className={styles.heroIntro}>
              <span className={styles.badge}>
                <i className={styles.badgeDot} aria-hidden="true" />
                {t('badge')}
              </span>
              <h1 id="kontakt-headline" className={styles.headline}>
                {t.rich('headline', rich)}
              </h1>
            </div>
            <p className={styles.lead}>{t('lead')}</p>
          </div>
        </section>

        {/* ── Beatrice: the person behind "Sprich mit mir" ───── */}
        <section className={styles.beatrice} aria-labelledby="kontakt-beatrice">
          <div className={styles.container}>
            <div className={styles.beatricePanel}>
              <div className={styles.beatricePhoto}>
                <Image
                  src="/images/kontakt/beatrice-hohl.webp"
                  alt={t('beatriceImageAlt')}
                  fill
                  sizes="(max-width: 900px) 100vw, 58vw"
                  className={styles.beatriceImage}
                />
              </div>

              <div className={styles.beatriceText}>
                <p className={styles.eyebrow}>{t('beatriceEyebrow')}</p>
                <h2 id="kontakt-beatrice" className={styles.beatriceHeading}>
                  {t.rich('beatriceHeading', rich)}
                </h2>
                <p className={styles.beatriceBody}>{t('beatriceBody')}</p>

                <div className={styles.beatriceMeta}>
                  <div className={styles.beatriceWho}>
                    <b className={styles.beatriceName}>{t('c1Name')}</b>
                    <span className={styles.beatriceRole}>{t('c1Role')}</span>
                  </div>
                  <div className={styles.beatriceWho}>
                    <a href={`mailto:${t('c1Email')}`} className={styles.cardMail}>
                      {t('c1Email')}
                    </a>
                    <a
                      href={`tel:${t('c1Phone').replace(/\s+/g, '')}`}
                      className={styles.cardPhone}
                    >
                      {t('c1Phone')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.contact}>
          <div className={`${styles.container} ${styles.contactRow}`}>
            <ContactForm />

            <aside className={styles.cards} aria-label={t('cardsLabel')}>
              <div className={`${styles.card} ${styles.iceLemon}`}>
                <span className={styles.cardLabel}>{t('c2Label')}</span>
                <p className={styles.cardBody}>{t('c2Body')}</p>
                <a href={`mailto:${t('c2Email')}`} className={styles.cardMail}>
                  {t('c2Email')}
                </a>
                <a href="#" data-wip="backend" className={styles.cardLink}>
                  {t('c2Link')} <Arrow />
                </a>
              </div>

              <div className={`${styles.card} ${styles.iceOrange}`}>
                <span className={styles.cardLabel}>{t('c3Label')}</span>
                <p className={styles.cardBody}>
                  <b className={styles.cardStrong}>{t('c3Company')}</b>
                  <br />
                  {t('c3Street')}
                  <br />
                  {t('c3City')}
                </p>
                <a
                  href={t('mapsUrl')}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.cardLink}
                >
                  {t('c3Link')} <Arrow />
                </a>
              </div>
            </aside>
          </div>
        </section>
      </div>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      {/* Native <details> sharing a name, like the start page: the browser
          keeps one open, every answer stays in the server HTML, no script.
          No FAQPage schema here — all four questions are re-phrasings of
          start-page items, and the same Q&A on two URLs competes with
          itself. The start page stays the canonical FAQ. */}
      <section className={styles.faq} aria-labelledby="kontakt-faq-heading">
        <div className={`${styles.container} ${styles.faqGrid}`}>
          <div className={styles.faqIntro}>
            <p className={styles.eyebrow}>{t('faqEyebrow')}</p>
            <h2 id="kontakt-faq-heading" className={styles.faqHeading}>
              {t.rich('faqHeading', rich)}
            </h2>
            <p className={styles.faqLead}>{t('faqIntro')}</p>
          </div>

          <div className={styles.faqList}>
            {faqs.map((id, index) => (
              <details
                key={id}
                name="kontakt-faq"
                open={index === 0}
                className={styles.faqItem}
              >
                <summary className={styles.faqQuestion}>
                  <span className={styles.faqNum}>{faqNumber(index)}</span>
                  <span className={styles.faqText}>{t(`${id}Question`)}</span>
                  {/* Drawn plus/minus. Decorative — <details> already conveys
                      the expanded state to assistive technology. */}
                  <span className={styles.faqMarker} aria-hidden="true" />
                </summary>
                <p className={styles.faqAnswer}>{t(`${id}Answer`)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className={styles.ctaSection} aria-labelledby="kontakt-cta">
        <div className={styles.ctaBand}>
          <h2 id="kontakt-cta" className={styles.ctaHeading}>
            {t('ctaHeading')}
          </h2>
          <div className={styles.ctaButtons}>
            <a
              href="#"
              data-wip="backend"
              className={`${buttons.pill} ${buttons.inverse}`}
            >
              {t('ctaPrimary')} <Arrow />
            </a>
            <a
              href="#"
              data-wip="backend"
              className={`${buttons.pill} ${buttons.ghostOnInk}`}
            >
              {t('ctaSecondary')}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function Arrow() {
  return <span aria-hidden="true">→</span>;
}
