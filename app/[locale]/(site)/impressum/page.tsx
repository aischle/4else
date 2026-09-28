import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import styles from './page.module.css';

/* ============================================================
   4else — Impressum
   ------------------------------------------------------------
   The legally required company information, taken from the old
   site's Impressum (4else.events/impressum, September 2026) and
   brought up to date with Robin: the site's e-mail address, Swiss
   terms (UID, "Verantwortlich für den Inhalt"), "du" throughout,
   the 4my.horse social list dropped, one note on 4else.com and
   4else.one instead of the old product paragraphs.

   Company name, address, e-mail and phone come from the footer's
   message keys, so footer and Impressum cannot disagree. The rest
   of the copy lives in the `impressum` namespace.
   ============================================================ */

const TERMS_URL = 'https://4else.events/allgemeine-geschaeftsbedingungen/';

function external(href: string) {
  return function ExternalLink(chunks: ReactNode) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={styles.link}>
        {chunks}
      </a>
    );
  };
}
const bold = (chunks: ReactNode) => <strong className={styles.strong}>{chunks}</strong>;

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: t('impressumTitle'),
    description: t('impressumDescription'),
    alternates: { canonical: '/impressum' },
  };
}

function Row({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className={styles.row} aria-labelledby={id}>
      <h2 id={id} className={styles.rowTitle}>
        {title}
      </h2>
      <div className={styles.rowBody}>{children}</div>
    </section>
  );
}

export default function ImpressumPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  const t = useTranslations('impressum');
  const company = useTranslations('footer');
  const phoneHref = `tel:${company('phone').replace(/\s+/g, '')}`;

  return (
    <main className={styles.container}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>{t('eyebrow')}</p>
        <h1 className={styles.headline}>{t('headline')}</h1>
        <p className={styles.lead}>{t('lead')}</p>
      </header>

      <div className={styles.rows}>
        <Row id="impressum-anbieter" title={t('providerTitle')}>
          <p>
            {company('company')}
            <br />
            {company('street')}
            <br />
            {company('city')}
            <br />
            {t('country')}
          </p>
        </Row>

        <Row id="impressum-kontakt" title={t('contactTitle')}>
          <dl className={styles.facts}>
            <dt>{t('emailLabel')}</dt>
            <dd>
              <a href={`mailto:${company('email')}`} className={styles.link}>
                {company('email')}
              </a>
            </dd>
            <dt>{t('phoneLabel')}</dt>
            <dd>
              <a href={phoneHref} className={styles.link}>
                {company('phone')}
              </a>
            </dd>
          </dl>
        </Row>

        <Row id="impressum-verantwortlich" title={t('responsibleTitle')}>
          <p>{t('responsibleName')}</p>
        </Row>

        <Row id="impressum-register" title={t('registerTitle')}>
          <p>{t('registerOffice')}</p>
          <dl className={styles.facts}>
            <dt>{t('uidLabel')}</dt>
            <dd>{t('uid')}</dd>
          </dl>
        </Row>

        <Row id="impressum-versicherung" title={t('insuranceTitle')}>
          <p>
            {t('insurer')}
            <br />
            {t('insurerStreet')}
            <br />
            {t('insurerCity')}
          </p>
        </Row>

        <Row id="impressum-angebote" title={t('offerTitle')}>
          <p>{t.rich('offerBody', { b: bold })}</p>
        </Row>

        <Row id="impressum-haftung" title={t('liabilityTitle')}>
          <p>{t.rich('disclaimer', { b: bold })}</p>
          <p>{t.rich('externalLinks', { b: bold })}</p>
          <p>{t.rich('copyright', { b: bold })}</p>
          <p>{t.rich('violations', { b: bold })}</p>
        </Row>

        <Row id="impressum-agb" title={t('termsTitle')}>
          <p>{t.rich('termsBody', { link: external(TERMS_URL) })}</p>
        </Row>

        <Row id="impressum-bilder" title={t('imagesTitle')}>
          <p>{t('imagesIntro')}</p>
          <ul className={styles.list}>
            <li>{t('images1')}</li>
            <li>{t('images2')}</li>
            <li>{t('images3')}</li>
          </ul>
          <p>{t('imagesLicence')}</p>
        </Row>
      </div>
    </main>
  );
}
