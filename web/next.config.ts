import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable static generation globally during build
  output: 'standalone',
};

export default nextConfig;
