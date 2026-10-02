import type { Metadata, Viewport } from 'next';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { Instrument_Sans } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { WipDialog } from '@/components/ui/WipDialog';
import { Preview } from '@/components/preview/Preview';
import { routing } from '@/lib/routing';
import { locales, type Locale } from '@/lib/i18n';
import { BASE_URL, SITE_NAME } from '@/lib/seo';
import '@/styles/tokens.css';
import '../globals.css';

/* The html, the fonts, the messages — everything every route needs.
   The nav and footer are one level down, in the (site) route group,
   so the 404 can render inside this layout without them. */

/* Instrument Sans, self-hosted by next/font (no request to Google at
   runtime). Exposed as --font-instrument; styles/tokens.css builds
   --font from it. */
const instrumentSans = Instrument_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-instrument',
});

/* The message namespaces client components read. Only these go to
   the browser: server components get every message on the server,
   and the long texts (AGB, Datenschutz, the FAQs) would
   otherwise ride along on every page. A new client component that
   calls useTranslations needs its namespace here, and so does any
   component a client component imports (Wordmark). */
const CLIENT_NAMESPACES = [
  'brand', // Wordmark, inside Header and MobileMenu
  'nav', // Header, MobileMenu
  'footer', // MobileMenu
  'kontakt', // ContactForm
  'newsletter', // NewsletterForm
  'preise', // FeeCalculator
  'preview', // ExitPreview
  'scrollTop', // ScrollToTop
  'wip', // WipDialog
] as const;

/* Prerender every locale at build time. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: t('homeTitle'),
      template: `%s — ${SITE_NAME}`,
    },
    description: t('homeDescription'),
    applicationName: SITE_NAME,
  };
}

export const viewport: Viewport = {
  themeColor: '#F7F7FA',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();

  setRequestLocale(locale);
  const all = await getMessages();
  const messages = Object.fromEntries(CLIENT_NAMESPACES.map((key) => [key, all[key]]));
  /* Draft mode is the Studio's preview (app/api/draft-mode). Reading it
     keeps pages static: visitors never have it on. */
  const { isEnabled: preview } = await draftMode();

  return (
    /* data-scroll-behavior: Next 16 no longer drops globals.css's
       smooth scrolling on its own during route changes; with it, a
       new page still starts at the top at once. */
    <html lang={locale} className={instrumentSans.variable} data-scroll-behavior="smooth">
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
          <WipDialog />
          {preview && <Preview />}
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
