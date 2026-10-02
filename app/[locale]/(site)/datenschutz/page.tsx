import { use } from 'react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CompanyCard, LegalDocument } from '@/components/legal/LegalDocument';

/* ============================================================
   4else — Datenschutzerklärung
   ------------------------------------------------------------
   The old site's privacy policy (4else.events, Datenschutz-
   Generator, "Stand: 1. September 2026"), every section kept,
   in Swiss spelling and du, its website parts brought up to
   this site: Vercel instead of the WordPress hosting, firewall,
   cookie banner and analytics plugins; Sanity for the blog;
   the font served with the site. See CLAUDE.md §5k.

   Copy in the `datenschutz` namespace, laid out by
   `LegalDocument`; SECTIONS sets the order. The controller's
   address comes from the footer's keys.
   ============================================================ */

const SECTIONS = [
  'praeambel',
  'verantwortlicher',
  'uebersicht',
  'rechtsgrundlagen',
  'sicherheit',
  'uebermittlung',
  'datentransfers',
  'speicherung',
  'rechte',
  'leistungen',
  'geschaeftsprozesse',
  'plattformen',
  'anbieter',
  'zahlung',
  'hosting',
  'cookies',
  'apps',
  'nutzerkonto',
  'blog',
  'kontakt',
  'ki',
  'videokonferenzen',
  'newsletter',
  'webanalyse',
  'socialmedia',
  'plugins',
  'hilfswerkzeuge',
  'aenderungen',
  'begriffe',
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: t('datenschutzTitle'),
    description: t('datenschutzDescription'),
    alternates: { canonical: '/datenschutz' },
  };
}

export default function DatenschutzPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <LegalDocument
      namespace="datenschutz"
      sections={SECTIONS}
      extras={{ verantwortlicher: { before: <CompanyCard /> } }}
    />
  );
}
