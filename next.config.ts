import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
module.exports = {
  typescript: {
    ignoreBuildErrors: true,
  },
}
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
