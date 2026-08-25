import type { NextConfig } from "next";

const r2Host = process.env.NEXT_PUBLIC_R2_PUBLIC_URL
  ? new URL(process.env.NEXT_PUBLIC_R2_PUBLIC_URL).hostname
  : "";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "bishalghale.com.np",
      },
      {
        protocol: "https",
        hostname:"pub-5872e4be5ca04def9f54a051c830c9d8.r2.dev",
      }
    ],
  },
};

export default nextConfig;
