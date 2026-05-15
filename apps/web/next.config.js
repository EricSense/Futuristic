/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@futuristic/shared"],
  output: "standalone",
  // Allow NEXT_PUBLIC_API_URL to be set at build time via Vercel env vars.
  // Default falls back to localhost for local dev.
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
    NEXT_PUBLIC_DEMO_VEHICLE_ID: process.env.NEXT_PUBLIC_DEMO_VEHICLE_ID || "",
  },
};

module.exports = nextConfig;
