import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  headers() {
    // Required by FHEVM 
    return Promise.resolve([
      {
        source: '/',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ]);
  },
  webpack: (config, { isServer, webpack }) => {
    // Exclude @fhevm/mock-utils from production bundle
    // This package should only be used in development with local Hardhat node
    if (process.env.NODE_ENV === 'production') {
      // Mark @fhevm/mock-utils as external to prevent bundling in production
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push('@fhevm/mock-utils');
      } else if (typeof config.externals === 'object') {
        config.externals['@fhevm/mock-utils'] = '@fhevm/mock-utils';
      }
      
      // Ignore the mock file during production builds to prevent type checking errors
      // This prevents Next.js from trying to analyze the mock file during build
      if (!isServer) {
        config.plugins = config.plugins || [];
        config.plugins.push(
          new webpack.IgnorePlugin({
            checkResource(resource: string) {
              // Ignore fhevmMock.ts file in production builds
              return resource.includes('fhevmMock') || resource.includes('mock/fhevmMock');
            },
          })
        );
      }
    }
    return config;
  },
};

export default nextConfig;
