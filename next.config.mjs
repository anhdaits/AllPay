/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // No ESLint config/package is installed in this project yet. Without this,
  // `next build` can prompt to set one up or fail in non-interactive shells.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
