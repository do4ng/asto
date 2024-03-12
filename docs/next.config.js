/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['shiki'],
  },
  /**
   * @type {import("sass").Options<"sync">}
   */
  sassOptions: {},
};

module.exports = nextConfig;
