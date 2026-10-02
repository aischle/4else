import { use } from 'react';
import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CompanyCard, LegalDocument } from '@/components/legal/LegalDocument';

/* ============================================================
   4else — Datenschutzerklärung
   ------------------------------------------------------------
   Twelve sections in plain du (October 2026), condensed from the
   old site's generator policy: what the Swiss DSG asks a privacy
   notice to say (controller, data and purposes, recipients,
   transfers abroad, retention, rights), this website's real setup
   (Vercel, Sanity, one language cookie) and one paragraph for the
   EU's DSGVO. See CLAUDE.md §5k.

   Copy in the `datenschutz` namespace, laid out by
   `LegalDocument`; SECTIONS sets the order. The controller's
   name and address come from the footer's keys.
   ============================================================ */

const SECTIONS = [
  'geltung',
  'verantwortlich',
  'daten',
  'website',
  'zahlungen',
  'dienstleister',
  'social',
  'ausland',
  'aufbewahrung',
  'sicherheit',
  'rechte',
  'aenderungen',
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

  const company = useTranslations('footer');

  return (
    <LegalDocument
      namespace="datenschutz"
      sections={SECTIONS}
      values={{ company: company('company') }}
      extras={{ verantwortlich: { before: <CompanyCard /> } }}
    />
  );
}
