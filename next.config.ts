import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "10.85.250.244",
    "192.168.40.37",
  ],
};



export default nextConfig;
