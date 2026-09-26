import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n-request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    /* Blog images from Sanity (project 6e5n16nr). */
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io', pathname: '/images/6e5n16nr/**' }],
  },
  async redirects() {
    return [
      /* The Studio for the blog is hosted by Sanity (studio/); /studio
         gives Beatrice a 4else address to remember. Temporary, so the
         target can move without browsers caching the old one. */
      { source: '/studio', destination: 'https://4else.sanity.studio', permanent: false },
      { source: '/studio/:path*', destination: 'https://4else.sanity.studio/:path*', permanent: false },
    ];
  },
};

export default withNextIntl(nextConfig);
