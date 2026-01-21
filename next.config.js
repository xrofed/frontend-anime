/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Konfigurasi Gambar (Yang sudah dibuat sebelumnya)
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

  // 2. KONFIGURASI REDIRECT (Legacy Routes)
  async redirects() {
    return [
      // --- Category & Hentai Slug -> Anime Detail ---
      // ex: /category/naruto -> /anime/naruto
      {
        source: '/category/:slug',
        destination: '/anime/:slug',
        permanent: true, // 301
      },
      {
        source: '/hentai/:slug',
        destination: '/anime/:slug',
        permanent: true,
      },

      // --- Anime List / Hentai List -> Halaman Directory Kita (/anime) ---
      // ex: /anime-list -> /anime
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
      // Pagination: /anime-list/page/2 -> /anime?page=2
      {
        source: '/anime-list/page/:page',
        destination: '/anime?page=:page',
        permanent: true,
      },

      // --- Trending Pagination ---
      // ex: /trending/page/2 -> /trending (sesuai request kamu)
      // Note: Di project ini kita belum buat page /trending khusus, 
      // tapi saya arahkan ke root atau search filter jika ada.
      {
        source: '/trending/page/:page',
        destination: '/trending', // Atau ke halaman trending jika sudah dibuat
        permanent: true,
      },

      // --- Genre Pagination ---
      // ex: /genre/action/page/2 -> /genre/action?page=2
      {
        source: '/genre/:slug/page/:page',
        destination: '/genre/:slug?page=:page',
        permanent: true,
      },

      // --- Nonton Legacy (Complex Logic) ---
      // Logic: /nonton/judul-episode-1 -> /watch/judul-episode-1
      // Kita asumsikan strukturnya cocok langsung ke /watch
      {
        source: '/:slug',
        destination: '/watch/:slug',
        permanent: true,
      },
      {
        source: '/nonton/:slug',
        destination: '/watch/:slug',
        permanent: true,
      },

      {
        source: '/genre-list',
        destination: '/genres',
        permanent: true,
      },

      // --- Root Slug (Legacy SEO URL) ---
      // Regex: /judul-episode-1-subtitle-indonesia -> /watch/judul-episode-1
      // Penjelasan Regex: 
      // :slug(.*) = menangkap "judul"
      // -episode- = teks statis
      // :num(\\d+) = menangkap angka episode
      // -subtitle-indonesia = teks yang akan dibuang
      {
        source: '/:slug(.*)-episode-:num(\\d+)-subtitle-indonesia',
        destination: '/watch/:slug-episode-:num',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;