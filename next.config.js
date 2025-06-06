/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // SEO and performance optimizations
    compress: true,

    // Image optimization
    images: {
        domains: [],
        formats: ['image/webp', 'image/avif'],
    },

    // Security headers
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                ],
            },
        ]
    },

    // Generate sitemap and robots.txt
    async rewrites() {
        return [
            {
                source: '/sitemap.xml',
                destination: '/api/sitemap',
            },
        ]
    },
}

module.exports = nextConfig