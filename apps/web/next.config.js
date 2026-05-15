/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@futuristic/shared"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
    NEXT_PUBLIC_DEMO_VEHICLE_ID: process.env.NEXT_PUBLIC_DEMO_VEHICLE_ID || "",
  },
};

module.exports = nextConfig;
