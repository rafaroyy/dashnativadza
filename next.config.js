/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["api.dicebear.com"],
    unoptimized: true,
  },
  env: {
    CUSTOM_KEY: "my-value",
  },
}

module.exports = nextConfig
