import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['boring-avatars'],
  experimental: {
    esmExternals: 'loose',
  },
};

export default nextConfig;
