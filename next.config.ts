import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["juantap.info"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "juantap.info",
        pathname: "/avatars/**",
      },
      {
        protocol: "https",
        hostname: "juantap.info",
        pathname: "/defaults/**",
      },
    ],
  },
};

export default nextConfig;
