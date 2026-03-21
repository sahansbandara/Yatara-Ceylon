import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
            { protocol: 'https', hostname: 'overatours.com' },
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'res.cloudinary.com' },
            { protocol: 'https', hostname: 'i.pravatar.cc' },
            { protocol: 'https', hostname: 'dxk1acp76n912.cloudfront.net' },
            { protocol: 'https', hostname: 'media-cdn.tripadvisor.com' },
            { protocol: 'https', hostname: 's.yimg.com' },
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
};

export default nextConfig;
