import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: false,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/image-proxy/**',
      },
      {
        protocol: 'https',
        hostname: 'ark-content-generation-v2-cn-beijing.tos-cn-beijing.volces.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-a51a2574d6e74ec8b4c2cc453bfecf10.r2.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
        port: '',
        pathname: '/**',
      },
      // 添加具体的R2域名支持
      {
        protocol: 'https',
        hostname: '5c4526fa64900b23d9572f57b126ea45.r2.cloudflarestorage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
