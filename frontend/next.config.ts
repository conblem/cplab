import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        search: "",
      },
      {
        protocol: "https",
        hostname: "cplabr2.conblem.me",
        port: "",
        search: "",
      },
    ],
  },
};

export default nextConfig;
