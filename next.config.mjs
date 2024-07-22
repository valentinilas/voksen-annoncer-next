import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/posts',
                destination: '/',
                permanent: true,
            },
        ]
    },
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'ik.imagekit.io',
            port: '',
            pathname: '/wo0srdcz6/**',
          }],
      },
};

export default withNextIntl(nextConfig);