import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable static generation globally during build
  output: 'standalone',
  // Set Turbopack root to silence warning
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
