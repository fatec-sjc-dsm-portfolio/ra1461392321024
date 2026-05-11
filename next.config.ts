import type { NextConfig } from "next";

const repo = "/ra1461392321024";

const nextConfig: NextConfig = {
  output: "export",

  basePath: repo,
  assetPrefix: repo,

  images: {
    unoptimized: true,
  },
};

export default nextConfig;