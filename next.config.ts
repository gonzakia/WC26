import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
    allowedDevOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://10.85.250.244:3000",
  ],
};



export default nextConfig;
