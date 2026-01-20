import { fetchData } from '@/lib/api';
import AnimeCard from '@/components/AnimeCard';
import Pagination from '@/components/Pagination'; // Pastikan Pagination diimport
import { Search as SearchIcon } from 'lucide-react'; // Icon agar lebih cantik

export async function generateMetadata({ searchParams }) {
  const { q } = await searchParams;
  return {
    title: `Cari: ${q || ''} - ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    description: `Hasil pencarian anime untuk kata kunci ${q}`,
    robots: 'noindex, follow',
  };
}

export default async function SearchPage({ searchParams }) {
  // Tunggu searchParams (Next.js 15)
  const { q, page: pageParam } = await searchParams;
  const page = parseInt(pageParam) || 1;
  
  if (!q) return <div className="text-center py-20 text-slate-400">Ketikan sesuatu untuk mencari...</div>;

  // Gunakan encodeURIComponent untuk menangani spasi atau karakter spesial
  const res = await fetchData(`/search?q=${encodeURIComponent(q)}&page=${page}`);
  
  // Ambil data animes dan pagination dengan fallback
  const { animes } = res?.data || { animes: [] };
  const { totalPages, currentPage } = res?.pagination || { totalPages: 1, currentPage: 1 };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header dengan Icon */}
      <h1 className="text-2xl font-bold text-white mb-6 border-l-4 border-yellow-500 pl-3 flex items-center gap-2">
        <SearchIcon /> Hasil Pencarian: "{q}"
      </h1>

      {animes.length === 0 ? (
        <div className="text-center py-20 bg-slate-800/50 rounded-lg text-slate-400 border border-slate-700 border-dashed">
          Tidak ada anime yang ditemukan untuk kata kunci <strong>"{q}"</strong>.
        </div>
      ) : (
        // Grid Responsif (sama dengan halaman lain: 2 kolom HP, 5 kolom PC)
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-10">
          {animes.map((anime, idx) => (
            <AnimeCard 
              key={idx}
              title={anime.title}
              imageUrl={anime.imageUrl}
              link={`/anime/${anime.pageSlug}`}
              type="anime"
              // --- UPDATE PROPS BARU ---
              status={anime.info?.Status}    // Badge Status
              animeType={anime.info?.Type}   // Badge Tipe
              year={anime.info?.Released}    // Tahun Rilis
            />
          ))}
        </div>
      )}

      {/* --- PAGINATION --- */}
      {animes.length > 0 && (
        <Pagination 
            page={currentPage} 
            totalPages={totalPages} 
            baseUrl={`/search?q=${encodeURIComponent(q)}`} 
        />
      )}
    </div>
  );
}