import type { NextConfig } from "next";
import config from "./src/store.config";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_STORE_NAME: config.name,
    STORE_TAGLINE: config.tagline,
    BRAND_COLOR: config.theme.brand[600],
  },
  transpilePackages: ['@tor/lib', '@tor/ui', '@tor/store', '@tor/pages'],
  serverExternalPackages: ['pdfkit'],
  images: {
    // Skip image optimization in dev to allow local Supabase (private IP)
    unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
