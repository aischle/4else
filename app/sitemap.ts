import type { MetadataRoute } from 'next';
import { routing } from '@/lib/routing';
import { getPathname } from '@/lib/navigation';
import { enabledLocales } from '@/lib/i18n';
import { BASE_URL } from '@/lib/seo';
import { getArticleSlugs } from '@/lib/sanity';

/* ============================================================
   4else — sitemap
   ------------------------------------------------------------
   Static routes are read from lib/routing.ts, so adding a page
   there lists it here automatically. One entry per enabled
   locale, each with hreflang alternates.
   ============================================================ */

const staticRoutes = Object.keys(routing.pathnames).filter(
  (route) => !route.includes('['),
);

function alternatesFor(route: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of enabledLocales) {
    languages[locale] = `${BASE_URL}${getPathname({ locale, href: route as never })}`;
  }
  languages['x-default'] = `${BASE_URL}${getPathname({
    locale: routing.defaultLocale,
    href: route as never,
  })}`;
  return languages;
}

/* Articles come from Sanity; the listing fails soft, so an unreachable
   Sanity only drops the article entries, never the whole sitemap. */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages = staticRoutes.flatMap((route) => {
    const languages = alternatesFor(route);
    return enabledLocales.map((locale) => ({
      url: `${BASE_URL}${getPathname({ locale, href: route as never })}`,
      lastModified: now,
      changeFrequency: route === '/' ? ('weekly' as const) : ('monthly' as const),
      priority: route === '/' ? 1 : 0.6,
      alternates: { languages },
    }));
  });

  const articles = (await getArticleSlugs()).flatMap(({ slug, _updatedAt }) => {
    const href = { pathname: '/inspirationen/[slug]', params: { slug } } as const;
    const languages: Record<string, string> = {};
    for (const locale of enabledLocales) {
      languages[locale] = `${BASE_URL}${getPathname({ locale, href })}`;
    }
    languages['x-default'] = `${BASE_URL}${getPathname({ locale: routing.defaultLocale, href })}`;
    return enabledLocales.map((locale) => ({
      url: `${BASE_URL}${getPathname({ locale, href })}`,
      lastModified: new Date(_updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
      alternates: { languages },
    }));
  });

  return [...pages, ...articles];
}
