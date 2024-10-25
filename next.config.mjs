import withPWA from 'next-pwa';

// PWA 활성화
const isProd = process.env.NODE_ENV === 'production';

const pwaConfig = {
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: !isProd,
  buildExcludes: [
    /app-build-manifest\.json$/,
    /_buildManifest\.js$/,
  ],
};

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',

  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'img1.kakaocdn.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 't1.kakaocdn.net',
        pathname: '/**',
      },
    ],
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'rc-util': 'commonjs rc-util',
      });
    }

    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'],
          plugins: [
            '@babel/plugin-transform-private-methods',
            '@babel/plugin-transform-runtime',
          ],
        },
      },
    });

    return config;
  },
};

export default withPWA(pwaConfig)(nextConfig);
