import type { ReactNode } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { NewsletterForm } from '@/components/home/NewsletterForm';
import { Link } from '@/lib/navigation';
import { MascotVideo } from '@/components/home/MascotVideo';
import { TicketCard } from '@/components/home/TicketCard';
import { NAV_FADE_START, NAV_FADE_TEXT, NAV_FADE_END } from '@/components/header/navTheme';
import { FaqJsonLd, FAQ_IDS } from '@/components/seo/FaqJsonLd';
import { faqNumber } from '@/lib/faq';
import buttons from '@/components/ui/Button.module.css';
import styles from './page.module.css';

/* ============================================================
   4else — start page
   ------------------------------------------------------------
   Sections, in order: hero → statement → what we do → payment
   banner → why 4else → how it works → testimonials → FAQ → CTA
   → newsletter; the nav and footer come from the locale layout.

   The hero is the mascot redesign: a dark ground that the
   statement section fades back into the page ground. The nav
   floats over it and takes its colours from whichever ground it
   is over — see the three marks in the statement section below.

   All copy lives in messages/de.json. Emphasis sits in the
   messages as <accent> (brand violet) and <b> tags, rendered by
   t.rich(), so a translation can place it differently.

   Buttons and links without a destination yet point at "#".
   ============================================================ */

const rich = {
  accent: (chunks: ReactNode) => <span className={styles.accent}>{chunks}</span>,
  b: (chunks: ReactNode) => <b className={styles.strong}>{chunks}</b>,
};

function Arrow() {
  return <span aria-hidden="true">→</span>;
}

export default function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  const tHero = useTranslations('hero');
  const tStatement = useTranslations('statement');
  const tServices = useTranslations('services');
  const tPayment = useTranslations('payment');
  const tWhy = useTranslations('why');
  const tSteps = useTranslations('steps');
  const tTestimonials = useTranslations('testimonials');
  const tFaq = useTranslations('faq');
  const tCta = useTranslations('cta');
  const tNewsletter = useTranslations('newsletter');

  const services = [
    { id: 's1', tone: styles.lilac },
    { id: 's2', tone: styles.mint },
    { id: 's3', tone: styles.peach },
  ] as const;

  const reasons = ['r1', 'r2', 'r3'] as const;
  const steps = ['s1', 's2', 's3'] as const;
  const chips = ['chipTwint', 'chipCard', 'chipInvoice', 'chipPaypal', 'chipCheckin'] as const;

  return (
    <main>
      {/* ── Hero ───────────────────────────────────── */}
      <section className={styles.hero} aria-labelledby="hero-headline">
        <div className={styles.heroGlow} aria-hidden="true" />

        <div className={`${styles.container} ${styles.heroGrid}`}>
          <div className={styles.heroMascot}>
            <MascotVideo label={tHero('mascotAlt')} />
          </div>

          <div className={styles.heroIntro}>
            <span className={styles.badge}>
              <i className={styles.badgeDot} aria-hidden="true" />
              {tHero('badge')}
            </span>
            <h1 id="hero-headline" className={styles.heroHeadline}>
              {tHero.rich('headline', rich)}
            </h1>
            <p className={styles.heroBody}>{tHero('body')}</p>
            <div className={styles.buttonRow}>
              <a
                href="#"
                data-wip="backend"
                className={`${buttons.pill} ${buttons.violet}`}
              >
                {tHero('ctaPrimary')} <Arrow />
              </a>
              <a
                href="#"
                data-wip="backend"
                className={`${buttons.pill} ${buttons.ghostOnInk}`}
              >
                {tHero('ctaSecondary')}
              </a>
            </div>
            <TicketCard />
          </div>
        </div>
      </section>

      {/* ── Statement ────────────────────────────────────────── */}
      {/* The gradient here carries the hero's dark ground down to the page
          ground. The three marks are for the nav, which has no tint of its
          own between the first and the last and so mirrors the gradient
          exactly — see components/header/navTheme.ts. */}
      <section className={styles.statement}>
        <span id={NAV_FADE_START} className={styles.fadeStart} aria-hidden="true" />
        <span id={NAV_FADE_TEXT} className={styles.fadeText} aria-hidden="true" />
        <span id={NAV_FADE_END} className={styles.fadeEnd} aria-hidden="true" />
        <div className={`${styles.container} ${styles.statementGrid}`}>
          <p className={styles.eyebrow}>{tStatement('eyebrow')}</p>
          <h2 className={styles.statementText}>{tStatement.rich('text', rich)}</h2>
        </div>
      </section>

      {/* ── What we do ───────────────────────────────────────── */}
      <section id="tun" className={styles.section} aria-labelledby="services-heading">
        <div className={styles.container}>
          <div className={styles.servicesHead}>
            <div className={styles.headStack}>
              <p className={styles.eyebrow}>{tServices('eyebrow')}</p>
              <h2 id="services-heading" className={styles.sectionHeading}>
                {tServices('heading')}
              </h2>
            </div>
            <p className={styles.servicesIntro}>{tServices('intro')}</p>
          </div>

          <div className={styles.cards}>
            {services.map(({ id, tone }) => (
              <article key={id} className={`${styles.card} ${tone}`}>
                <span className={styles.cardLabel}>{tServices(`${id}Label`)}</span>
                <h3 className={styles.cardTitle}>{tServices(`${id}Title`)}</h3>
                <p className={styles.cardBody}>{tServices(`${id}Body`)}</p>
                <a href="#" className={styles.cardLink}>
                  {tServices(`${id}Link`)} <Arrow />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Payment banner ───────────────────────────────────── */}
      <section className={styles.bannerSection} aria-labelledby="payment-heading">
        <div className={styles.banner}>
          <div className={styles.bannerText}>
            <p className={styles.eyebrow}>{tPayment('eyebrow')}</p>
            <h2 id="payment-heading" className={styles.bannerHeading}>
              {tPayment.rich('heading', rich)}
            </h2>
            <p className={styles.lead}>{tPayment('body')}</p>
            <ul className={styles.chips} aria-label={tPayment('chipsLabel')}>
              {chips.map((chip) => (
                <li key={chip} className={styles.chip}>
                  {tPayment(chip)}
                </li>
              ))}
            </ul>
            <a href="#" className={`${buttons.pill} ${buttons.solid}`}>
              {tPayment('cta')} <Arrow />
            </a>
            <p className={styles.poweredBy}>{tPayment.rich('poweredBy', rich)}</p>
          </div>
          <div className={styles.bannerMedia}>
            <Image
              src="/images/home/ticket.jpg"
              alt={tPayment('imageAlt')}
              fill
              sizes="(min-width: 1240px) 572px, (min-width: 760px) 50vw, 100vw"
              className={styles.cover}
            />
          </div>
        </div>
      </section>

      {/* ── Why 4else ────────────────────────────────────────── */}
      <section id="warum" className={styles.why} aria-labelledby="why-heading">
        <div className={`${styles.container} ${styles.whyGrid}`}>
          <div className={styles.whyMedia}>
            <Image
              src="/images/home/participant.png"
              alt={tWhy('imageAlt')}
              fill
              sizes="(min-width: 1240px) 527px, (min-width: 760px) 45vw, 100vw"
              className={`${styles.cover} ${styles.whyImage}`}
            />
          </div>
          <div>
            <p className={`${styles.eyebrow} ${styles.whyEyebrow}`}>{tWhy('eyebrow')}</p>
            <h2 id="why-heading" className={styles.whyHeading}>
              {tWhy.rich('heading', rich)}
            </h2>
            <div className={styles.reasons}>
              {reasons.map((id) => (
                <div key={id} className={styles.reason}>
                  <span className={styles.reasonNum}>{tWhy(`${id}Num`)}</span>
                  <div>
                    <h3 className={styles.reasonTitle}>{tWhy(`${id}Title`)}</h3>
                    <p className={styles.reasonBody}>{tWhy(`${id}Body`)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.whyCta}>
              <a href="#" className={`${buttons.pill} ${buttons.outline}`}>
                {tWhy('cta')} <Arrow />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section id="ablauf" className={styles.steps} aria-labelledby="steps-heading">
        <div className={styles.container}>
          <div className={`${styles.headStack} ${styles.stepsHead}`}>
            <p className={styles.eyebrow}>{tSteps('eyebrow')}</p>
            <h2 id="steps-heading" className={`${styles.sectionHeading} ${styles.stepsHeading}`}>
              {tSteps('heading')}
            </h2>
          </div>
          <ol className={styles.stepList}>
            {steps.map((id) => (
              <li key={id} className={styles.step}>
                <span className={styles.stepNum}>{tSteps(`${id}Num`)}</span>
                <span className={styles.stepDigit} aria-hidden="true">
                  {tSteps(`${id}Digit`)}
                </span>
                <h3 className={styles.stepTitle}>{tSteps(`${id}Title`)}</h3>
                <p className={styles.stepBody}>{tSteps(`${id}Body`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section className={styles.section} aria-labelledby="testimonials-heading">
        <div className={styles.container}>
          <div className={`${styles.headStack} ${styles.testimonialsHead}`}>
            <p className={styles.eyebrow}>{tTestimonials('eyebrow')}</p>
            <h2 id="testimonials-heading" className={styles.sectionHeading}>
              {tTestimonials('heading')}
            </h2>
          </div>
          <div className={styles.quotes}>
            <figure className={`${styles.quoteCard} ${styles.quoteWithImage}`}>
              <Image
                src="/images/home/testimonial.jpg"
                alt=""
                width={800}
                height={533}
                sizes="(min-width: 1240px) 370px, (min-width: 900px) 30vw, 100vw"
                className={styles.quoteImage}
              />
              <div className={styles.quoteInner}>
                <Stars label={tTestimonials('ratingLabel')} />
                <blockquote className={styles.quote}>{tTestimonials('t1Quote')}</blockquote>
                <figcaption className={styles.author}>{tTestimonials('t1Author')}</figcaption>
              </div>
            </figure>
            <figure className={`${styles.quoteCard} ${styles.quotePlain}`}>
              <Stars label={tTestimonials('ratingLabel')} />
              <blockquote className={styles.quote}>{tTestimonials('t2Quote')}</blockquote>
              <figcaption className={styles.author}>{tTestimonials('t2Author')}</figcaption>
            </figure>
            <figure className={`${styles.quoteCard} ${styles.quotePlain} ${styles.quoteLilac}`}>
              <Stars label={tTestimonials('ratingLabel')} />
              <blockquote className={styles.quote}>{tTestimonials('t3Quote')}</blockquote>
              <figcaption className={`${styles.author} ${styles.authorStrong}`}>
                {tTestimonials('t3Author')}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      {/* Native <details>, never a client-side accordion: the page
          stays a server component and every answer sits in the
          server-rendered HTML whether the item is open or closed, so
          crawlers and assistants read them all regardless of state.
          The shared name makes the items one exclusive group — the
          browser closes the open one when another opens — and the
          first starts open. */}
      <section id="faq" className={styles.section} aria-labelledby="faq-heading">
        <div className={`${styles.container} ${styles.faqGrid}`}>
          <div className={styles.headStack}>
            <p className={styles.eyebrow}>{tFaq('eyebrow')}</p>
            <h2 id="faq-heading" className={styles.sectionHeading}>
              {tFaq('heading')}
            </h2>
          </div>
          <div className={styles.faqList}>
            {FAQ_IDS.map((id, index) => (
              <details
                key={id}
                name="faq"
                open={index === 0}
                className={styles.faqItem}
              >
                <summary className={styles.faqQuestion}>
                  <span className={styles.faqNum}>{faqNumber(index)}</span>
                  <span className={styles.faqText}>{tFaq(`${id}Question`)}</span>
                  {/* Drawn plus/minus. Decorative only — <details> already
                      conveys the expanded state to assistive technology. */}
                  <span className={styles.faqMarker} aria-hidden="true" />
                </summary>
                <p className={styles.faqAnswer}>{tFaq(`${id}Answer`)}</p>
              </details>
            ))}
          </div>
        </div>
        <FaqJsonLd />
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className={styles.bannerSection} aria-labelledby="cta-heading">
        <div className={styles.ctaBand}>
          <h2 id="cta-heading" className={styles.ctaHeading}>{tCta('heading')}</h2>
          <p className={styles.ctaSub}>{tCta('sub')}</p>
          <div className={`${styles.buttonRow} ${styles.ctaButtons}`}>
            <a
              href="#"
              data-wip="backend"
              className={`${buttons.pill} ${buttons.inverse}`}
            >
              {tCta('primary')} <Arrow />
            </a>
            <Link href="/kontakt" className={`${buttons.pill} ${buttons.ghostOnInk}`}>
              {tCta('secondary')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────────── */}
      <div className={styles.container}>
        <section className={styles.newsletter} aria-labelledby="newsletter-heading">
          <h2 id="newsletter-heading" className={styles.newsletterHeading}>
            {tNewsletter.rich('heading', rich)}
          </h2>
          <NewsletterForm />
        </section>
      </div>
    </main>
  );
}

function Stars({ label }: { label: string }) {
  return (
    <span className={styles.stars} role="img" aria-label={label}>
      ★★★★★
    </span>
  );
}
