import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Skip TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Production optimizations
  reactStrictMode: true,
  output: 'standalone',
  compress: true,
  
  // Image optimization for Supabase
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cgurtxyvdglkwptnrcua.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'exportreadyai-production.up.railway.app',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
