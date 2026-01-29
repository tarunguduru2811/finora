import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["sdmntprcentralus.oaiusercontent.com"], // add your domains here
  },
   async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://finora-1-k8mq.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
