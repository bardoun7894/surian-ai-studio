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
    ];
  },

};

export default withBundleAnalyzer(nextConfig);
