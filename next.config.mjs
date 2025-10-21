/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // basePath: '/exam-digital-time', // Removed for local development
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Since we're using static export, we can't use API routes
  // The client will fetch time directly from external APIs
  reactStrictMode: false,
};

export default nextConfig;
