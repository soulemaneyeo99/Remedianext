/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'remedia-backend.railway.app'],
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
  // Optimisations pour production
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
}

module.exports = nextConfig
