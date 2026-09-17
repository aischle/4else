import type { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/seo';

/* robots.txt — allow all crawlers and point them at the sitemap. */

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
