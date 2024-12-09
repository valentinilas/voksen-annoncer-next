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
          },
          {
            protocol: 'https',
            hostname: 'ndinpokdjajhdzzpbzic.supabase.co',
            port: '',
            pathname: '/storage/**',
          },],
      },
};

export default withNextIntl(nextConfig);



