/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker deployment
  output: 'standalone',

  // Disable ESLint during builds (fix later)
  eslint: {
    ignoreDuringBuilds: true,
  },

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
    ],
  },

  // API Rewrites for Laravel and AI Service
  async rewrites() {
    return [
      // Laravel API routes
      {
        source: '/api/v1/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'}/api/v1/:path*`,
      },
      // Sanctum CSRF cookie
      {
        source: '/sanctum/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'}/sanctum/:path*`,
      },
      // AI Service routes
      {
        source: '/ai/:path*',
        destination: `${process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8001'}/api/v1/:path*`,
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

  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:8080'],
    },
  },
};

export default nextConfig;
