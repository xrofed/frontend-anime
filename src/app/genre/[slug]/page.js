import { fetchData } from '@/lib/api';
import AnimeCard from '@/components/AnimeCard';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Tag } from 'lucide-react';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  const genreName = slug.replace(/-/g, ' ').toUpperCase();
  
  return {
    title: `Anime Genre ${genreName} - ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    description: `Nonton anime dengan genre ${genreName} sub indo gratis.`,
  };
}

export default async function GenrePage({ params, searchParams }) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  
  // Pastikan page menjadi integer
  const page = parseInt(pageParam) || 1;
  const res = await fetchData(`/genre/${slug}?page=${page}`);

  if (!res || !res.success) {
    return <div className="text-center py-20 text-white">Genre tidak ditemukan</div>;
  }

  const { genreName, animes } = res.data;
  const { totalPages, currentPage } = res.pagination || { totalPages: 1, currentPage: 1 };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6 border-l-4 border-blue-500 pl-3 flex items-center gap-2">
        <Tag /> Genre: {genreName}
      </h1>

      {/* UPDATE GRID: Responsif (2 kolom HP, 5 kolom PC) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-10">
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

      {/* --- BAGIAN PAGINATION (NEXT / PREV) --- */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          {/* Tombol Previous */}
          {page > 1 ? (
            <Link 
              href={`/genre/${slug}?page=${page - 1}`}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-600 text-white rounded-lg transition"
            >
              <ChevronLeft size={20} /> Prev
            </Link>
          ) : (
            <button disabled className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 text-slate-500 rounded-lg cursor-not-allowed">
              <ChevronLeft size={20} /> Prev
            </button>
          )}

          {/* Info Halaman */}
          <span className="text-slate-400 text-sm font-medium">
            Halaman {currentPage} dari {totalPages}
          </span>

          {/* Tombol Next */}
          {page < totalPages ? (
            <Link 
              href={`/genre/${slug}?page=${page + 1}`}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-600 text-white rounded-lg transition"
            >
              Next <ChevronRight size={20} />
            </Link>
          ) : (
            <button disabled className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 text-slate-500 rounded-lg cursor-not-allowed">
              Next <ChevronRight size={20} />
            </button>
          )}
        </div>
      )}

    </div>
  );
}