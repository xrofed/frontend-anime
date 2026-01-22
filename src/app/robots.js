// robots.js
export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://duniahentai.top';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/search', '/_next/', '/_error', '/admin'],
    },
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap.xml.gz`,
    ],
    host: baseUrl.replace(/^https?:\/\//, ''),
  };
}