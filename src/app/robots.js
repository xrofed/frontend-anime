export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hentaicop.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Jangan index halaman API, pencarian (agar tidak spam), dan file internal Next.js
      disallow: ['/api/', '/search', '/_next/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}