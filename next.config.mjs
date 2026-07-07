/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // No ESLint config/package is installed in this project yet. Without this,
  // `next build` can prompt to set one up or fail in non-interactive shells.
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    // wagmi's MetaMask/WalletConnect connectors optionally import these for
    // React Native and Node.js-only logging — neither applies in a browser
    // build. Without this, they show up as harmless "Module not found"
    // warnings in `next dev`/`next build` output.
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "@react-native-async-storage/async-storage": false,
      "pino-pretty": false,
    };
    return config;
  },
};

export default nextConfig;
