/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    domains: ["images.unsplash.com"],
    formats: ["image/webp", "image/avif"],
  },
};

export default nextConfig;
