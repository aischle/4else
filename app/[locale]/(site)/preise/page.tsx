import { use, type ReactNode } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { FeeCalculator } from '@/components/pricing/FeeCalculator';
import { faqNumber } from '@/lib/faq';
import { Link } from '@/lib/navigation';
import buttons from '@/components/ui/Button.module.css';
import styles from './page.module.css';

/* ============================================================
   4else — pricing page (/preise)
   ------------------------------------------------------------
   Built from the design handoff "4else Preise"
   (Z:\GoogleDrive\projects\4else\design_handoff_4else_preise\).
   Sections, in order: hero → plans (one white block, run up
   behind the sticky nav like the contact page) → payment panel
   with the fee calculator → FAQ → dark CTA band; nav and footer
   come from the site layout.

   The billing toggle is two radio buttons and CSS (:has), so it
   works without JavaScript; the fee calculator is the page's
   only client component. Sign-up and plan buttons need the
   backend and point at "#" (the wip dialog, CLAUDE.md §5d);
   Business leads to /kontakt. All copy lives in messages/de.json
   under `preise`.
   ============================================================ */

const rich = {
  accent: (chunks: ReactNode) => <span className={styles.accent}>{chunks}</span>,
};

const free = ['freeF1', 'freeF2', 'freeF3', 'freeF4', 'freeF5'] as const;
const premium = ['premiumF1', 'premiumF2', 'premiumF3', 'premiumF4', 'premiumF5'] as const;
const business = ['businessF1', 'businessF2', 'businessF3', 'businessF4'] as const;
const methods = ['payMethod1', 'payMethod2', 'payMethod3', 'payMethod4'] as const;
const faqs = ['q1', 'q2', 'q3', 'q4', 'q5'] as const;

type FeatureKey = (typeof free)[number] | (typeof premium)[number] | (typeof business)[number];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    /* Absolute: the title already names 4else, so the layout's
       " — 4else" suffix would repeat it. */
    title: { absolute: t('preiseTitle') },
    description: t('preiseDescription'),
    alternates: { canonical: '/preise' },
  };
}

export default function PreisePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  const t = useTranslations('preise');

  const features = (keys: readonly FeatureKey[]) => (
    <ul className={styles.features}>
      {keys.map((key) => (
        <li key={key} className={styles.feature}>
          <span className={styles.check} aria-hidden="true">
            ✓
          </span>
          {t(key)}
        </li>
      ))}
    </ul>
  );

  return (
    <main>
      {/* ── White block: hero + plans ─────────────────────────── */}
      <div className={styles.white}>
        <section className={styles.hero} aria-labelledby="preise-headline">
          <div className={`${styles.container} ${styles.heroGrid}`}>
            <div className={styles.heroIntro}>
              <span className={styles.badge}>
                <i className={styles.badgeDot} aria-hidden="true" />
                {t('badge')}
              </span>
              <h1 id="preise-headline" className={styles.headline}>
                {t.rich('headline', rich)}
              </h1>
            </div>
            <div className={styles.heroAside}>
              <p className={styles.lead}>{t('lead')}</p>
              {/* Else, puzzling over the plans, standing on the hero's
                  bottom edge with a speech bubble over her head. */}
              <figure className={styles.else}>
                <div className={styles.elseCrop}>
                  <Image
                    src="/images/404/else-sucht.webp"
                    alt={t('elseImageAlt')}
                    width={314}
                    height={314}
                    sizes="314px"
                    priority
                    className={styles.elseImage}
                  />
                </div>
                <figcaption className={styles.elseBubble}>{t('elseBubble')}</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className={styles.plans} aria-labelledby="preise-plans">
          <div className={`${styles.container} ${styles.plansInner}`}>
            <div className={styles.plansHead}>
              <p id="preise-plans" className={styles.eyebrow}>
                {t('plansEyebrow')}
              </p>
              {/* Two radios styled as a pill switch; the CSS shows the
                  Premium price that matches the checked one. */}
              <fieldset className={styles.toggle}>
                <legend className={styles.srOnly}>{t('billingLabel')}</legend>
                <input
                  type="radio"
                  name="billing"
                  id="billing-monthly"
                  value="monthly"
                  className={`${styles.toggleInput} ${styles.monthlyInput}`}
                />
                <label htmlFor="billing-monthly" className={styles.toggleLabel}>
                  {t('billingMonthly')}
                </label>
                <input
                  type="radio"
                  name="billing"
                  id="billing-yearly"
                  value="yearly"
                  defaultChecked
                  className={styles.toggleInput}
                />
                <label htmlFor="billing-yearly" className={styles.toggleLabel}>
                  {t('billingYearly')} <span className={styles.toggleSave}>{t('billingSave')}</span>
                </label>
              </fieldset>
            </div>

            <div className={styles.cards}>
              <article className={`${styles.card} ${styles.free}`} aria-labelledby="plan-free">
                <div className={styles.cardHead}>
                  <h2 id="plan-free" className={styles.cardName}>
                    {t('freeName')}
                  </h2>
                  <p className={styles.cardDescription}>{t('freeDescription')}</p>
                </div>
                <p className={styles.price}>
                  <b className={styles.amount}>{t('freePrice')}</b>
                  <span className={styles.period}>{t('freePeriod')}</span>
                </p>
                <a
                  href="#"
                  data-wip="backend"
                  className={`${buttons.pill} ${buttons.outline} ${styles.cta}`}
                >
                  {t('freeCta')}
                </a>
                {features(free)}
              </article>

              <article className={`${styles.card} ${styles.premium}`} aria-labelledby="plan-premium">
                <span className={styles.popular}>{t('premiumBadge')}</span>
                <div className={styles.cardHead}>
                  <h2 id="plan-premium" className={styles.cardName}>
                    {t('premiumName')}
                  </h2>
                  <p className={styles.cardDescription}>{t('premiumDescription')}</p>
                </div>
                <p className={`${styles.price} ${styles.yearly}`}>
                  <b className={styles.amount}>{t('premiumPriceYearly')}</b>
                  <span className={styles.period}>{t('premiumPeriodYearly')}</span>
                </p>
                <p className={`${styles.price} ${styles.monthly}`}>
                  <b className={styles.amount}>{t('premiumPriceMonthly')}</b>
                  <span className={styles.period}>{t('premiumPeriodMonthly')}</span>
                </p>
                <a
                  href="#"
                  data-wip="backend"
                  className={`${buttons.pill} ${buttons.violet} ${styles.cta}`}
                >
                  {t('premiumCta')} <Arrow />
                </a>
                {features(premium)}
              </article>

              <article className={`${styles.card} ${styles.business}`} aria-labelledby="plan-business">
                <div className={styles.cardHead}>
                  <h2 id="plan-business" className={styles.cardName}>
                    {t('businessName')}
                  </h2>
                  <p className={styles.cardDescription}>{t('businessDescription')}</p>
                </div>
                <p className={styles.price}>
                  <b className={styles.amount}>{t('businessPrice')}</b>
                  <span className={styles.period}>{t('businessPeriod')}</span>
                </p>
                <Link
                  href="/kontakt"
                  className={`${buttons.pill} ${buttons.solid} ${styles.cta}`}
                >
                  {t('businessCta')}
                </Link>
                {features(business)}
              </article>
            </div>

            <p className={styles.plansNote}>{t('plansNote')}</p>
          </div>
        </section>
      </div>

      {/* ── Payment: 4else.one ────────────────────────────────── */}
      <section className={styles.pay} aria-labelledby="preise-pay">
        <div className={styles.payPanel}>
          <div className={styles.payText}>
            <p className={styles.eyebrow}>{t('payEyebrow')}</p>
            <h2 id="preise-pay" className={styles.payHeading}>
              {t.rich('payHeading', rich)}
            </h2>
            <p className={styles.payBody}>{t('payBody')}</p>
            <ul className={styles.methods} aria-label={t('payMethodsLabel')}>
              {methods.map((key) => (
                <li key={key} className={styles.method}>
                  {t(key)}
                </li>
              ))}
            </ul>
            <p className={styles.payNote}>{t('payNote')}</p>
          </div>
          <div className={styles.feeSide}>
            <div className={styles.feeFigure}>
              <span className={styles.feeEyebrow}>{t('feeEyebrow')}</span>
              <p className={styles.feeLine}>
                <b className={styles.feeRate}>{t('feeRate')}</b>
                <b className={styles.feeFixed}>{t('feeFixed')}</b>
              </p>
            </div>
            <FeeCalculator />
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      {/* The contact page's FAQ: native <details> sharing a name, the
          first open, every answer in the server HTML, no script. */}
      <section className={styles.faq} aria-labelledby="preise-faq-heading">
        <div className={`${styles.container} ${styles.faqGrid}`}>
          <div className={styles.faqIntro}>
            <p className={styles.eyebrow}>{t('faqEyebrow')}</p>
            <h2 id="preise-faq-heading" className={styles.faqHeading}>
              {t('faqHeading')}
            </h2>
            <p className={styles.faqLead}>
              {t.rich('faqIntro', {
                link: (chunks) => (
                  <Link href="/kontakt" className={styles.faqLink}>
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </div>

          <div className={styles.faqList}>
            {faqs.map((id, index) => (
              <details key={id} name="preise-faq" open={index === 0} className={styles.faqItem}>
                <summary className={styles.faqQuestion}>
                  <span className={styles.faqNum}>{faqNumber(index)}</span>
                  <span className={styles.faqText}>{t(`${id}Question`)}</span>
                  <span className={styles.faqMarker} aria-hidden="true" />
                </summary>
                <p className={styles.faqAnswer}>{t(`${id}Answer`)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className={styles.ctaSection} aria-labelledby="preise-cta">
        <div className={styles.ctaBand}>
          <div className={styles.ctaText}>
            <h2 id="preise-cta" className={styles.ctaHeading}>
              {t('ctaHeading')}
            </h2>
            <p className={styles.ctaSub}>{t('ctaSub')}</p>
          </div>
          <div className={styles.ctaButtons}>
            <a href="#" data-wip="backend" className={`${buttons.pill} ${buttons.inverse}`}>
              {t('ctaPrimary')} <Arrow />
            </a>
            <a href="#" data-wip="backend" className={`${buttons.pill} ${buttons.ghostOnInk}`}>
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
