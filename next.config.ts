import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'public.zynerd.com' },
    ],
  },
};

export default nextConfig;
