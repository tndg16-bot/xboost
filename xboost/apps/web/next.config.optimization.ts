import type { NextConfig } from 'next'

/**
 * Next.js Configuration
 *
 * Includes:
 * - Sentry integration
 * - Performance optimization
 * - Image optimization
 * - Font optimization
 * - Bundle analysis
 */

const nextConfig: NextConfig = {
  // === Performance Optimization ===

  // Disable source maps in production
  productionBrowserSourceMaps: false,

  // === Image Optimization ===

  images: {
    // Allow external image domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
      },
      {
        protocol: 'https',
        hostname: 'abs.twimg.com',
      },
    ],
    // Image formats
    formats: ['image/webp', 'image/avif'],
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200],
    // Image sizes for responsive images
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // === Bundle Analysis ===

  // Enable bundle analyzer (uncomment to use)
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     const { BundleAnalyzerPlugin } = require('@next/bundle-analyzer')({
  //       openAnalyzer: false,
  //     })
  //     config.plugins.push(new BundleAnalyzerPlugin())
  //   }
  //   return config
  // },

  // === Headers & Security ===

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
        ],
      },
    ]
  },

  // === Experimental Features ===

  experimental: {
    // Optimize CSS
    optimizeCss: true,
    // Optimize package imports
    optimizePackageImports: [
      'recharts',
      'lucide-react',
    ],
  },

  // === Compiler Options ===

  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // === Logging ===

  onDemandEntries: {
    // Limit the number of on-demand entries
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}

export default nextConfig
