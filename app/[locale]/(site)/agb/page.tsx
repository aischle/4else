import { use, type ReactNode } from 'react';
import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LegalToc } from '@/components/legal/LegalToc';
import { faqNumber } from '@/lib/faq';
import { Link } from '@/lib/navigation';
import styles from './page.module.css';

/* ============================================================
   4else — AGB
   ------------------------------------------------------------
   The terms of the old site (4else.events, "Hüntwangen, Mai
   2020"), every clause kept, brought up to date with what this
   site states: the offers Free, Premium and Connect, the 4else
   Zahlungslösung on Payrexx, CHF and VAT, the pricing page.
   The legal text speaks of "der Kunde", as in 2020.

   Layout after Limen's terms page: the numbered sections as a
   spine on the left (`LegalToc`), the text on the right.

   Copy in the `agb` namespace. SECTIONS sets the order; each
   section's paragraphs are its p1, p2, … keys, so a paragraph
   is added in the messages alone. Company name and address come
   from the footer's keys, as on the Impressum.
   ============================================================ */

const SECTIONS = [
  'grundlagen',
  'leistungen',
  'pflichten',
  'vertrag',
  'preise',
  'zahlungsloesung',
  'eigentum',
  'datenschutz',
  'haftung',
  'wirksamkeit',
  'gerichtsstand',
  'kontakt',
] as const;

/* The old site's, until this site has its own. */
const PRIVACY_URL = 'https://4else.events/datenschutzerklaerung/';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: t('agbTitle'),
    description: t('agbDescription'),
    alternates: { canonical: '/agb' },
  };
}

export default function AgbPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);

  const t = useTranslations('agb');
  const company = useTranslations('footer');
  const labels = useTranslations('impressum');
  const phoneHref = `tel:${company('phone').replace(/\s+/g, '')}`;

  const rich = {
    b: (chunks: ReactNode) => <strong className={styles.strong}>{chunks}</strong>,
    pricing: (chunks: ReactNode) => (
      <Link href="/preise" className={styles.link}>
        {chunks}
      </Link>
    ),
    privacy: (chunks: ReactNode) => (
      <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer" className={styles.link}>
        {chunks}
      </a>
    ),
    company: company('company'),
    street: company('street'),
    city: company('city'),
  };

  const items = SECTIONS.map((id, index) => ({
    id,
    number: faqNumber(index),
    label: t(`sections.${id}.title`),
  }));

  return (
    <main className={styles.container}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>{t('eyebrow')}</p>
        <h1 className={styles.headline}>{t('headline')}</h1>
        <p className={styles.lead}>{t('lead')}</p>
        <p className={styles.updated}>{t('updated')}</p>
      </header>

      <div className={styles.layout}>
        <aside className={styles.spine}>
          <LegalToc label={t('tocLabel')} items={items} />
        </aside>

        <div className={styles.text}>
          {items.map(({ id, number, label }) => {
            const paragraphs = Object.keys(t.raw(`sections.${id}`) as Record<string, string>)
              .filter((key) => key !== 'title');

            return (
              <section key={id} className={styles.section} aria-labelledby={id}>
                <h2 id={id} className={styles.title}>
                  <span className={styles.num}>{number}</span>
                  {label}
                </h2>
                {paragraphs.map((key) => (
                  <p key={key}>{t.rich(`sections.${id}.${key}`, rich)}</p>
                ))}
                {id === 'kontakt' && (
                  <div className={styles.contact}>
                    <p>
                      {company('company')}
                      <br />
                      {company('street')}
                      <br />
                      {company('city')}
                      <br />
                      {labels('country')}
                    </p>
                    <dl className={styles.facts}>
                      <dt>{labels('emailLabel')}</dt>
                      <dd>
                        <a href={`mailto:${company('email')}`} className={styles.link}>
                          {company('email')}
                        </a>
                      </dd>
                      <dt>{labels('phoneLabel')}</dt>
                      <dd>
                        <a href={phoneHref} className={styles.link}>
                          {company('phone')}
                        </a>
                      </dd>
                    </dl>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
