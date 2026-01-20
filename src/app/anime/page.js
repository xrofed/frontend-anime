import { fetchData } from '@/lib/api';
import AnimeCard from '@/components/AnimeCard';
import Pagination from '@/components/Pagination';
import AnimeFilter from '@/components/AnimeFilter'; // Import komponen baru
import { Filter } from 'lucide-react';

export const metadata = {
  title: `Daftar Anime Lengkap - ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  description: 'Cari anime berdasarkan status, urutan A-Z, atau popularitas.',
};

export default async function AnimeDirectoryPage({ searchParams }) {
  // Kita perlu await searchParams di Next.js 15
  const { page: pageParam, sort, status } = await searchParams;
  
  const page = parseInt(pageParam) || 1;
  const currentSort = sort || 'latest';
  const currentStatus = status || '';

  // Buat query string untuk API
  let endpoint = `/animes?page=${page}&sort=${currentSort}`;
  if (currentStatus) endpoint += `&status=${currentStatus}`;

  const res = await fetchData(endpoint);
  const { data: animes, pagination } = res?.success ? res : { data: [], pagination: {} };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-800 pb-6">
        <h1 className="text-2xl font-bold text-white border-l-4 border-red-500 pl-3 flex items-center gap-2">
          <Filter /> Daftar Anime
        </h1>

        {/* --- PASANG KOMPONEN FILTER DI SINI --- */}
        <AnimeFilter />
      </div>

      {/* Grid Anime */}
      {animes.length > 0 ? (
        // Update Grid agar responsif (2 kolom di HP, 5 di PC)
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {animes.map((anime, idx) => (
            <AnimeCard 
              key={idx}
              title={anime.title}
              imageUrl={anime.imageUrl}
              link={`/anime/${anime.pageSlug}`}
              type="anime"
              // --- UPDATE PROPS BARU ---
              status={anime.info?.Status}    // Badge Status (Ongoing/Completed)
              animeType={anime.info?.Type}   // Badge Tipe (TV/Hentai/Movie)
              year={anime.info?.Released}    // Info Tahun di bawah
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-800/50 rounded-lg text-slate-400">
          Anime tidak ditemukan untuk filter ini.
        </div>
      )}

      {/* Pagination */}
      <Pagination 
        page={pagination.currentPage} 
        totalPages={pagination.totalPages} 
        baseUrl={`/anime?sort=${currentSort}${currentStatus ? `&status=${currentStatus}` : ''}`} 
      />
    </div>
  );
}