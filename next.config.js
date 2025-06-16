/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // webpack: (config) => {
  //   config.resolve.alias['@'] = path.resolve(__dirname, 'app');
  //   return config;
  // },
};

module.exports = nextConfig;
