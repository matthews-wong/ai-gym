import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // skip ESLint
  },
  typescript: {
    ignoreBuildErrors: true, // skip TypeScript type errors
  },
};

export default nextConfig;
