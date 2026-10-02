import type { ReactNode } from 'react';
import { useTranslations, type RichTranslationValues } from 'next-intl';
import { faqNumber } from '@/lib/faq';
import { Link } from '@/lib/navigation';
import { LegalToc } from './LegalToc';
import styles from './LegalDocument.module.css';

/* ============================================================
   4else — a legal document (AGB, Datenschutz)
   ------------------------------------------------------------
   Header (eyebrow, headline, lead, "Stand" pill), then the
   numbered sections, with the spine left (after Limen's terms
   page). The page names its namespace and the section order;
   everything else comes from the messages:

     <namespace>.eyebrow / headline / lead / updated / tocLabel
     <namespace>.sections.<id>.title
       pN      a paragraph
       hN      a sub-heading
       listN   a list, its items iN

   so a paragraph, sub-heading or list is added in the messages
   alone, in the order the keys stand. Rich tags everywhere:
   <b>, <url> (the address is the text), <mail>, and the routes
   <imprint>, <pricing>, <privacy>; a page adds its own tags or
   placeholders through `values`.

   `extras` puts page markup before or after a section's text,
   e.g. the company card from the footer's keys.
   ============================================================ */

type Extras = Record<string, { before?: ReactNode; after?: ReactNode }>;

function text(chunks: ReactNode): string {
  return Array.isArray(chunks) ? chunks.join('') : String(chunks);
}

export function LegalDocument({
  namespace,
  sections,
  values = {},
  extras = {},
}: {
  namespace: string;
  sections: readonly string[];
  values?: RichTranslationValues;
  extras?: Extras;
}) {
  const t = useTranslations(namespace);

  const rich: RichTranslationValues = {
    b: (chunks) => <strong className={styles.strong}>{chunks}</strong>,
    url: (chunks) => (
      <a
        href={text(chunks)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.link} ${styles.url}`}
      >
        {chunks}
      </a>
    ),
    mail: (chunks) => (
      <a href={`mailto:${text(chunks)}`} className={styles.link}>
        {chunks}
      </a>
    ),
    imprint: (chunks) => (
      <Link href="/impressum" className={styles.link}>
        {chunks}
      </Link>
    ),
    pricing: (chunks) => (
      <Link href="/preise" className={styles.link}>
        {chunks}
      </Link>
    ),
    privacy: (chunks) => (
      <Link href="/datenschutz" className={styles.link}>
        {chunks}
      </Link>
    ),
    ...values,
  };

  const items = sections.map((id, index) => ({
    id,
    number: faqNumber(index),
    label: t(`sections.${id}.title`),
  }));

  function block(id: string, key: string, value: unknown) {
    const path = `sections.${id}.${key}`;
    if (key.startsWith('list')) {
      return (
        <ul key={key} className={styles.list}>
          {Object.keys(value as Record<string, string>).map((item) => (
            <li key={item}>{t.rich(`${path}.${item}`, rich)}</li>
          ))}
        </ul>
      );
    }
    if (key.startsWith('h')) {
      return (
        <h3 key={key} className={styles.subtitle}>
          {t.rich(path, rich)}
        </h3>
      );
    }
    return <p key={key}>{t.rich(path, rich)}</p>;
  }

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
            const content = t.raw(`sections.${id}`) as Record<string, unknown>;
            return (
              <section key={id} className={styles.section} aria-labelledby={id}>
                <h2 id={id} className={styles.title}>
                  <span className={styles.num}>{number}</span>
                  {label}
                </h2>
                {extras[id]?.before}
                {Object.entries(content)
                  .filter(([key]) => key !== 'title')
                  .map(([key, value]) => block(id, key, value))}
                {extras[id]?.after}
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}

/* The company's address from the footer's keys (one source with
   footer and Impressum), with e-mail and phone if asked. */
export function CompanyCard({ withContact = false }: { withContact?: boolean }) {
  const company = useTranslations('footer');
  const labels = useTranslations('impressum');
  const phoneHref = `tel:${company('phone').replace(/\s+/g, '')}`;

  return (
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
      {withContact && (
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
      )}
    </div>
  );
}
