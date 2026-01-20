import { fetchData } from '@/lib/api';
import AnimeCard from '@/components/AnimeCard';
import Pagination from '@/components/Pagination';
import { Clock } from 'lucide-react';

export const metadata = {
  title: `Episode Terbaru - ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  description: 'Nonton episode anime terbaru yang baru saja rilis.',
};

export default async function EpisodesPage({ searchParams }) {
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam) || 1;

  const res = await fetchData(`/episodes?page=${page}`);
  const { data: episodes, pagination } = res?.success ? res : { data: [], pagination: {} };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6 border-l-4 border-green-500 pl-3 flex items-center gap-2">
        <Clock /> Episode Terbaru
      </h1>

      {/* UPDATE GRID: Lebih responsif (sm, md, lg) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {episodes.map((ep, idx) => (
          <AnimeCard 
            key={idx}
            title={ep.title}
            imageUrl={ep.imageUrl}
            link={ep.watchUrl}
            type="episode"
            // --- PROPS BARU DITAMBAHKAN ---
            quality={ep.quality} // e.g. "720p"
            year={ep.year}       // e.g. "2026"
          />
        ))}
      </div>

      <Pagination 
        page={pagination.currentPage} 
        totalPages={pagination.totalPages} 
        baseUrl="/episodes" 
      />
    </div>
  );
}