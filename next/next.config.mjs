import { normalizeStrapiApiUrl } from './lib/strapi/normalize-api-url.mjs';

const strapiOrigin = () => {
  const raw = process.env.NEXT_PUBLIC_API_URL;
  if (raw === undefined || raw.trim() === '') {
    return undefined;
  }

  return normalizeStrapiApiUrl(raw);
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NEXT_OUTPUT || undefined,
  agentRules: false,
  // Enable Next.js 16 cache components
  cacheComponents: true,
  turbopack: {
    root: process.cwd().replace('/next', ''),
  },
  images: {
    // Disable image optimization for localhost in development
    ...(process.env.NODE_ENV === 'development' ? { unoptimized: true } : {}),
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: process.env.IMAGE_HOSTNAME || 'localhost',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '*.strapiapp.com',
      },
    ],
  },
  pageExtensions: ['ts', 'tsx'],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "frame-ancestors 'self' http://localhost:1337 http://127.0.0.1:1337 https://*.strapiapp.com https://*.admin.strapiapp.com",
          },
        ],
      },
    ];
  },
  async redirects() {
    const apiUrl = strapiOrigin();
    if (apiUrl === undefined) {
      console.warn(
        '[next.config] NEXT_PUBLIC_API_URL is not defined. Skipping redirect generation.'
      );
      return [];
    }

    let redirections = [];
    try {
      const res = await fetch(`${apiUrl}/api/redirections`, {
        signal: AbortSignal.timeout(3000),
      });
      const result = await res.json();
      const redirectItems = result.data.map(({ source, destination }) => {
        return {
          source: `/:locale${source}`,
          destination: `/:locale${destination}`,
          permanent: false,
        };
      });

      redirections = redirections.concat(redirectItems);

      return redirections;
    } catch (error) {
      // Log warning but don't fail build - redirects are optional
      console.warn(
        '[next.config] Failed to fetch redirects from Strapi:',
        error instanceof Error ? error.message : error
      );
      return [];
    }
  },
};

export default nextConfig;
