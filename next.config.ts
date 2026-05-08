import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'public.zynerd.com' },
    ],
    
  },
  allowedDevOrigins: ['http://localhost:3000', 'http://localhost:8080'],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
