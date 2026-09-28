import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n-request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    /* Next 16 allows only 75 unless listed; the payment banner's
       ticket uses 90 to keep its small print legible. */
    qualities: [75, 90],
    /* Blog images from Sanity (project 6e5n16nr). */
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io', pathname: '/images/6e5n16nr/**' }],
  },
  async redirects() {
    return [
      /* The Studio for the blog is hosted by Sanity (studio/); /studio
         gives Beatrice a 4else address to remember. Temporary, so the
         target can move without browsers caching the old one. */
      { source: '/studio', destination: 'https://fourelse.sanity.studio', permanent: false },
      { source: '/studio/:path*', destination: 'https://fourelse.sanity.studio/:path*', permanent: false },
    ];
  },
};

export default withNextIntl(nextConfig);
