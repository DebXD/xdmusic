/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig

module.exports = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'c.saavncdn.com',
            },
            {
                protocol: 'http',
                hostname: 'c.saavncdn.com',
            },
        ],
    },
};
