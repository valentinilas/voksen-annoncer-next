export default function robots() {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: '/dashboard/',
      },
      sitemap: 'https://www.voksen-annoncer.com/sitemap.xml',
    }
  }