/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed: output: 'export'
  // Now using default server mode to support API routes
  // This allows /api/* routes to work on IIS with Node.js

  // basePath: '/exam-digital-time', // Uncomment if deploying to subdirectory
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  reactStrictMode: false,
};

export default nextConfig;
