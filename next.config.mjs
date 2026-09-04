/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  devIndicators: false,
  ...(process.env.NODE_ENV === 'production' ? { output: 'standalone' } : {}),
  transpilePackages: ['motion'],
};

export default nextConfig;
