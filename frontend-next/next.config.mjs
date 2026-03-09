import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker deployment (only in production)
  ...(process.env.NODE_ENV === 'production' && { output: 'standalone' }),

  // Disable ESLint during builds (fix later)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable TypeScript type checking during builds (fix later)
  typescript: {
    ignoreBuildErrors: true,
  },

  // Allow useSearchParams() without Suspense boundary (pre-existing across all pages)
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },

  // Allow dev access from public IP
  allowedDevOrigins: ['91.230.110.187'],

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: 'backend-web',
      },
      {
        protocol: 'http',
        hostname: '91.230.110.187',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
    unoptimized: true, // Allow images from dynamic sources
  },

  // API Rewrites for Laravel and AI Service
  async rewrites() {
    // Use runtime env vars (without NEXT_PUBLIC_ prefix) for server-side rewrites
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://backend-web';
    const aiServiceUrl = process.env.AI_SERVICE_URL || process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://ai-service:8000';

    return [
      // Laravel API routes
      {
        source: '/api/v1/:path*',
        destination: `${backendUrl}/api/v1/:path*`,
      },
      // Sanctum CSRF cookie
      {
        source: '/sanctum/:path*',
        destination: `${backendUrl}/sanctum/:path*`,
      },
      // Storage/uploads (images, files)
      {
        source: '/storage/:path*',
        destination: `${backendUrl}/storage/:path*`,
      },
      // AI Service routes
      {
        source: '/ai/:path*',
        destination: `${aiServiceUrl}/api/v1/ai/:path*`,
      },
    ];
  },

  // #523: Retry failed chunk loads
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.output = {
        ...config.output,
        chunkLoadTimeout: 30000, // 30s timeout instead of default 120s
      };
    }
    return config;
  },

  // Headers for security and CORS
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      // Cache static assets (images, fonts, icons) for 1 year
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache font files for 1 year
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache Next.js static chunks for 1 year
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Stale-while-revalidate for API proxy responses
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
      // Cache geo data for map
      {
        source: '/assets/geo/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },

};

export default withBundleAnalyzer(nextConfig);
