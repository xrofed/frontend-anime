import { fetchData } from '@/lib/api';
import AnimeCard from '@/components/AnimeCard';
import { Flame } from 'lucide-react';

export const metadata = {
  title: `Hentai Sub Indo Trending Top 20 - ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  description: 'Daftar anime hentai sub indo paling populer dan banyak ditonton saat ini.',
};

export default async function TrendingPage() {
  // Fetch data dari endpoint /trending
  const res = await fetchData('/trending');
  const animes = res?.success ? res.data.animes : [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Halaman */}
      <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-6">
        <div className="p-3 bg-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)] animate-pulse">
            <Flame size={28} className="text-white" fill="currentColor" />
        </div>
        <div>
            <h1 className="text-3xl font-bold text-white">Top Trending</h1>
            <p className="text-slate-400 text-sm mt-1">Anime paling banyak ditonton minggu ini</p>
        </div>
      </div>

      {animes.length > 0 ? (
        // Gunakan Grid agar semua terlihat
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-8 gap-x-4">
          {animes.map((anime, idx) => (
            <div key={idx} className="relative">
                {/* Anime Card dengan Rank Number */}
                <AnimeCard 
                    title={anime.title}
                    imageUrl={anime.imageUrl}
                    link={`/anime/${anime.pageSlug}`}
                    type="anime"
                    rank={idx + 1} // Mengirim nomor peringkat (1, 2, 3...)
                    status={anime.info?.Status}
                    animeType={anime.info?.Type}
                    year={anime.info?.Released}
                />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-800/50 rounded-lg text-slate-400">
          Belum ada data trending saat ini.
        </div>
      )}
    </div>
  );
}