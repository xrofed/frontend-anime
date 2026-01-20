/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // 1. Domain Backend Render (SESUAI REQUEST)
      {
        protocol: 'https',
        hostname: 'apinekopoi.onrender.com',
        port: '',
        pathname: '/**',
      },
      // 2. Domain CDN R2 Cloudflare (PENTING: Karena kamu pakai R2 tadi)
      {
        protocol: 'https',
        hostname: 'cdn.sekaikomik.biz.id',
        port: '',
        pathname: '/**',
      },
      // 3. Localhost (Agar tetap jalan saat development lokal)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000', 
        pathname: '/**',
      },
      // 4. Wildcard (Cadangan: Mengizinkan semua domain HTTPS lain)
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Menonaktifkan optimasi gambar saat dev agar lebih cepat/tidak error local
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;