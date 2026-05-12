/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@futuristic/shared"],
  output: "standalone",
};

module.exports = nextConfig;
