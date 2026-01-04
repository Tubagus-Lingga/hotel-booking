import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8081/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:8081/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;
