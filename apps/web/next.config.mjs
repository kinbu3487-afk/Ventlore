const isStaticExport = process.env.STATIC_EXPORT === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ventlore/domain', '@ventlore/api-client'],
  output: isStaticExport ? 'export' : undefined,
  trailingSlash: isStaticExport ? true : false,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
      '.cjs': ['.cts', '.cjs'],
    };
    return config;
  },
};

export default nextConfig;
