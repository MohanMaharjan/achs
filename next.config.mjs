const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@prisma/client'); // Avoids Vercel bundling issues
    }
    return config;
  },
};

export default nextConfig;