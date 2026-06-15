import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    loader: 'default',
    unoptimized: true,
  },
  turbopack: {
    rules: {
      '*.yaml': {
        loaders: ['yaml-loader'],
	as: '*.js'
      }
    }
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.yaml/,
      use: 'yaml-loader'
    })

    return config
  }
};

export default nextConfig;
