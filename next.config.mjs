/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Toi uu hoa import cac goi lon -> giam bundle size
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
