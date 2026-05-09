
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // TypeScript errors ko ignore karega
  },
  eslint: {
    ignoreDuringBuilds: true, // ESLint errors ko ignore karega
  },
}

module.exports = nextConfig
