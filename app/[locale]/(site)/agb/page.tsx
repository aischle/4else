import { use } from 'react';
import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CompanyCard, LegalDocument } from '@/components/legal/LegalDocument';

/* ============================================================
   4else — AGB
   ------------------------------------------------------------
   The terms of the old site (4else.events, "Hüntwangen, Mai
   2020"), every clause kept, brought up to date with what this
   site states: the offers Free, Premium and Connect, the 4else
   Zahlungslösung on Payrexx, CHF and VAT, the pricing page.
   In du, like the rest of the site; (01) says that "du" includes
   organisations.

   Copy in the `agb` namespace, laid out by `LegalDocument`;
   SECTIONS sets the order. Company name and address come from
   the footer's keys, as on the Impressum.
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

  const company = useTranslations('footer');

  return (
    <LegalDocument
      namespace="agb"
      sections={SECTIONS}
      values={{
        company: company('company'),
        street: company('street'),
        city: company('city'),
      }}
      extras={{ kontakt: { after: <CompanyCard withContact /> } }}
    />
  );
}
