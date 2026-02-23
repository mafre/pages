import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  basePath: process.env.PAGES_BASE_PATH,
};

export default nextConfig;
