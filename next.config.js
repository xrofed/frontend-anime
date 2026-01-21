/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Konfigurasi Gambar
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'apinekopoi.onrender.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sekaikomik.biz.id',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000', 
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },

  // 2. KONFIGURASI REDIRECT
  async redirects() {
    return [
      // --- Category & Hentai Slug -> Anime Detail ---
      {
        source: '/category/:slug',
        destination: '/anime/:slug',
        permanent: true,
      },
      {
        source: '/hentai/:slug',
        destination: '/anime/:slug',
        permanent: true,
      },

      // --- List Pages -> Directory ---
      {
        source: '/anime-list',
        destination: '/anime', 
        permanent: true,
      },
      {
        source: '/hentai-list',
        destination: '/anime',
        permanent: true,
      },
      {
        source: '/anime-list/page/:page',
        destination: '/anime?page=:page',
        permanent: true,
      },
      {
        source: '/genre-list',
        destination: '/genres',
        permanent: true,
      },

      // --- Pagination Lainnya ---
      {
        source: '/trending/page/:page',
        destination: '/trending', 
        permanent: true,
      },
      {
        source: '/genre/:slug/page/:page',
        destination: '/genre/:slug?page=:page',
        permanent: true,
      },

      // --- PERBAIKAN: Redirect Legacy Nonton ---
      // Rule lama '/nonton/:slug' tetap aman
      {
        source: '/nonton/:slug',
        destination: '/watch/:slug',
        permanent: true,
      },

      // --- PERBAIKAN UTAMA DI SINI ---
      // Jangan pakai '/:slug' saja. Gunakan Regex untuk memastikan
      // URL tersebut mengandung kata "-episode-" sebelum melempar ke /watch.
      // Ini akan menyelamatkan /logo.png, /episodes, /genres agar tidak kena redirect.
      {
        source: '/:slug(.*-episode-.*)', 
        destination: '/watch/:slug',
        permanent: true,
      },

      // --- Legacy SEO URL (Panjang) ---
      {
        source: '/:slug(.*)-episode-:num(\\d+)-subtitle-indonesia',
        destination: '/watch/:slug-episode-:num',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;