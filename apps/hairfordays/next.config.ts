import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
