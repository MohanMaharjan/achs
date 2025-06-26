/** @type {import('next').NextConfig} */
const nextConfig = {
     images: {
    domains: ['images.unsplash.com','islington.edu.np','iimscollege.edu.np'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("@prisma/client"); // Avoids Vercel bundling issues
    }
    return config;
  },
};

export default nextConfig;
