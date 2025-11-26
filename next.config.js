/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.unsplash.com', // Libera o Unsplash
        },
        {
          protocol: 'https',
          hostname: 'placehold.co', // Libera os placeholders
        },
      ],
    },
  };
  
  module.exports = nextConfig;