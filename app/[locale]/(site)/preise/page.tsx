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
   Built from the design handoff "4else Preise", then reworked
   to Beatrice's change request (30 Sep 2026): three offers,
   Free · Premium · Connect, and a TWINT-only fee example. Further
   licences and the full fee calculator belong on a separate
   detail page, not built yet (tariffs to be confirmed); until
   then the note under the plans links to the old 4else.one page.

   Sections: hero → plans (one white block, run up behind the
   sticky nav) → payment panel with the fee panel → FAQ → dark CTA
   band. The billing toggle is two radios and CSS (:has); the fee
   panel is the only client component. All copy lives in
   messages/de.json under `preise`.
   ============================================================ */

/* The free sign-up of 4else.com, as the old site links it. Free,
   Premium and the CTA band all start there (Premium is switched on
   in the app afterwards). */
const SIGNUP_URL = 'https://www.4else.com/de/user/login#tab-register';

/* Further licences and the detailed calculator, until the new detail
   page exists. */
const MORE_URL = 'https://4else.one/was-kostet-die-shoploesung-4else-one/';

const rich = {
  accent: (chunks: ReactNode) => <span className={styles.accent}>{chunks}</span>,
};

const free = ['freeF1', 'freeF2', 'freeF3', 'freeF4', 'freeF5', 'freeF6', 'freeF7', 'freeF8'] as const;
const premium = ['premiumF1', 'premiumF2', 'premiumF3', 'premiumF4', 'premiumF5', 'premiumF6'] as const;
const connect = ['connectF1', 'connectF2', 'connectF3', 'connectF4'] as const;
const methods = ['payMethod1', 'payMethod2', 'payMethod3', 'payMethod4'] as const;

/* q5 ("Wo werden meine Daten gespeichert?") is written but held back:
   Beatrice wants the Swiss storage location confirmed before it is
   published. Add 'q5' here once she has. */
const faqs = ['q1', 'q2', 'q3', 'q4'] as const;

type FeatureKey = (typeof free)[number] | (typeof premium)[number] | (typeof connect)[number];

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
              {/* Else with her purse, standing on the hero's bottom edge
                  with a speech bubble over her head. */}
              <figure className={styles.else}>
                <Image
                  src="/images/preise/else-portemonnaie.webp"
                  alt={t('elseImageAlt')}
                  width={600}
                  height={758}
                  sizes="206px"
                  priority
                  className={styles.elseImage}
                />
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
                  Premium and Connect prices that match the checked one. */}
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
                  {t('billingYearly')}
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
                <div className={styles.priceBlock}>
                  <p className={styles.price}>
                    <b className={styles.amount}>{t('freePrice')}</b>
                    <span className={styles.period}>{t('freePeriod')}</span>
                  </p>
                </div>
                <div className={styles.action}>
                  <a href={SIGNUP_URL} className={`${buttons.pill} ${buttons.outline} ${styles.cta}`}>
                    {t('freeCta')}
                  </a>
                </div>
                {features(free)}
                <p className={styles.cardNote}>{t('freeNote')}</p>
              </article>

              <article className={`${styles.card} ${styles.premium}`} aria-labelledby="plan-premium">
                <span className={styles.label}>{t('premiumLabel')}</span>
                <div className={styles.cardHead}>
                  <h2 id="plan-premium" className={styles.cardName}>
                    {t('premiumName')}
                  </h2>
                  <p className={styles.cardDescription}>{t('premiumDescription')}</p>
                </div>
                <div className={`${styles.priceBlock} ${styles.yearly}`}>
                  <p className={styles.price}>
                    <b className={styles.amount}>{t('premiumPriceYearly')}</b>
                    <span className={styles.period}>{t('premiumPeriodYearly')}</span>
                  </p>
                  <p className={styles.equivalent}>{t('premiumEquivalentYearly')}</p>
                  <p className={styles.saving}>{t('premiumSavingYearly')}</p>
                </div>
                <div className={`${styles.priceBlock} ${styles.monthly}`}>
                  <p className={styles.price}>
                    <b className={styles.amount}>{t('premiumPriceMonthly')}</b>
                    <span className={styles.period}>{t('premiumPeriodMonthly')}</span>
                  </p>
                  <p className={styles.saving}>{t('premiumSavingMonthly')}</p>
                </div>
                <div className={styles.action}>
                  <a href={SIGNUP_URL} className={`${buttons.pill} ${buttons.violet} ${styles.cta}`}>
                    {t('premiumCta')}
                  </a>
                  <p className={styles.after}>{t('premiumAfter')}</p>
                </div>
                {features(premium)}
                <p className={styles.cardNote}>{t('premiumNote')}</p>
              </article>

              <article className={`${styles.card} ${styles.connect}`} aria-labelledby="plan-connect">
                <div className={styles.cardHead}>
                  <h2 id="plan-connect" className={styles.cardName}>
                    {t('connectName')}
                  </h2>
                  <p className={styles.cardDescription}>{t('connectDescription')}</p>
                </div>
                <div className={`${styles.priceBlock} ${styles.yearly}`}>
                  <p className={styles.price}>
                    <b className={styles.amount}>{t('connectPriceYearly')}</b>
                    <span className={styles.period}>{t('connectPeriodYearly')}</span>
                  </p>
                  <p className={styles.equivalent}>{t('connectEquivalentYearly')}</p>
                  <p className={styles.saving}>{t('connectSavingYearly')}</p>
                  <p className={styles.equivalent}>{t('connectFees')}</p>
                </div>
                <div className={`${styles.priceBlock} ${styles.monthly}`}>
                  <p className={styles.price}>
                    <b className={styles.amount}>{t('connectPriceMonthly')}</b>
                    <span className={styles.period}>{t('connectPeriodMonthly')}</span>
                  </p>
                  <p className={styles.saving}>{t('connectSavingMonthly')}</p>
                  <p className={styles.equivalent}>{t('connectFees')}</p>
                </div>
                <div className={styles.action}>
                  <Link href="/kontakt" className={`${buttons.pill} ${buttons.solid} ${styles.cta}`}>
                    {t('connectCta')}
                  </Link>
                  <p className={styles.after}>{t('connectAfter')}</p>
                </div>
                {features(connect)}
              </article>
            </div>

            <div className={styles.plansFoot}>
              <p className={styles.plansMore}>
                {t.rich('plansMore', {
                  link: (chunks) => (
                    <a href={MORE_URL} target="_blank" rel="noopener noreferrer" className={styles.inlineLink}>
                      {chunks}
                    </a>
                  ),
                })}
              </p>
              <p className={styles.plansNote}>{t('plansNote')}</p>
            </div>
          </div>
        </section>
      </div>

      {/* ── Payment: the 4else Zahlungslösung ─────────────────── */}
      <section className={styles.pay} aria-labelledby="preise-pay">
        <div className={styles.payPanel}>
          <div className={styles.payText}>
            <p className={styles.eyebrow}>{t('payEyebrow')}</p>
            <h2 id="preise-pay" className={styles.payHeading}>
              {t.rich('payHeading', rich)}
            </h2>
            <p className={styles.payBody}>{t('payBody1')}</p>
            <p className={styles.payBody}>{t('payBody2')}</p>
            <ul className={styles.methods} aria-label={t('payMethodsLabel')}>
              {methods.map((key) => (
                <li key={key} className={styles.method}>
                  {t(key)}
                </li>
              ))}
            </ul>
            <p className={styles.payNote}>{t('payNote')}</p>
          </div>
          <FeeCalculator />
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
                  <Link href="/kontakt" className={styles.inlineLink}>
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
            <a href={SIGNUP_URL} className={`${buttons.pill} ${buttons.inverse}`}>
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
