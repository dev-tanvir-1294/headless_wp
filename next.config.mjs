import path from 'node:path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'redbox.page.gd',
        pathname: '/wp-content/**',
      },
    ],
  },
  webpack(config) {
    config.resolve.alias['@'] = path.resolve('.');
    return config;
  },
};

export default nextConfig;
