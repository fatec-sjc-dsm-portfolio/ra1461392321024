const repo = "/ra1461392321024";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: repo,
  assetPrefix: repo,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
