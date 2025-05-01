/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    compiler: {
      removeConsole: process.env.NODE_ENV === 'production',
    },
    images: {
      formats: ['image/avif', 'image/webp'],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    webpack: (config, { isServer }) => {
      // Optimize bundle size
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            default: false,
            vendors: false,
            commons: {
              name: 'commons',
              chunks: 'all',
              minChunks: 2,
              reuseExistingChunk: true,
            },
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                const match = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
                return match ? `npm.${match[1].replace('@', '')}` : 'npm.unknown';
              },
              chunks: 'all',
            },
          },
        },
      };
  
      // Ensure proper handling of both .mjs and .js files
      config.resolve = {
        ...config.resolve,
        extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
      };
  
      return config;
    },
    // Enable static optimization
  };
  
  module.exports = nextConfig; 