import type { MetadataRoute } from 'next';
import { routing } from '@/lib/routing';
import { getPathname } from '@/lib/navigation';
import { enabledLocales } from '@/lib/i18n';
import { BASE_URL } from '@/lib/seo';

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

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return staticRoutes.flatMap((route) => {
    const languages = alternatesFor(route);
    return enabledLocales.map((locale) => ({
      url: `${BASE_URL}${getPathname({ locale, href: route as never })}`,
      lastModified: now,
      changeFrequency: route === '/' ? ('weekly' as const) : ('monthly' as const),
      priority: route === '/' ? 1 : 0.6,
      alternates: { languages },
    }));
  });
}
