/** @type {import('next').NextConfig} */
const nextConfig = {
  // Images optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 an
    
    // Domains autorisés (si images externes)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
  },

  // Performance optimizations
  swcMinify: true,
  reactStrictMode: true,
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Experimental features
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig