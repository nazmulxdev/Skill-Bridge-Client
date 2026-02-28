import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // production only

  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `https://skill-bridge-v3.vercel.app/api/auth/:path*`,
      },
    ];
  },
};

export default nextConfig;
