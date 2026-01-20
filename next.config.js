/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Membolehkan akses ke localhost dan semua domain
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000', // Port API kamu
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // HANYA JIKA masih error "private ip":
    // Aktifkan unoptimized untuk development agar tidak error saat ambil gambar lokal
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;