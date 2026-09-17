import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { Instrument_Sans } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { routing } from '@/lib/routing';
import { locales, type Locale } from '@/lib/i18n';
import { BASE_URL, SITE_NAME } from '@/lib/seo';
import '@/styles/tokens.css';
import '../globals.css';

/* Instrument Sans, self-hosted by next/font (no request to Google at
   runtime). Exposed as --font-instrument; styles/tokens.css builds
   --font from it. */
const instrumentSans = Instrument_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-instrument',
});

/* Prerender every locale at build time. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
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
  themeColor: '#F7F6F2',
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as Locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={instrumentSans.variable}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <div className="appContent">{children}</div>
          <Footer />
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
