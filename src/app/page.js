import { fetchData } from '@/lib/api';
import AnimeCard from '@/components/AnimeCard';
import JsonLd from '@/components/JsonLd';
import Link from 'next/link'; // Opsional: jika ingin tombol 'Lihat Semua'
import { ChevronRight } from 'lucide-react'; // Opsional: icon

export const metadata = {
  title: `${process.env.NEXT_PUBLIC_SITE_NAME} - Nonton dan Download Anime Hentai Sub Indo 18+ Terbaru`,
  description: 'Streaming anime subtitle Indonesia terbaru dan terlengkap.',
};

export default async function Home({ searchParams }) {
  // Tunggu searchParams sebelum mengakses propertinya (Next.js 15)
  const { page: pageParam } = await searchParams;
  const page = pageParam || 1;

  const res = await fetchData(`/home?page=${page}`);

  if (!res || !res.success) return <div className="text-center py-10 text-slate-400">Gagal memuat data.</div>;

  const { episodes, latestSeries } = res.data;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": process.env.NEXT_PUBLIC_SITE_NAME,
    "url": process.env.NEXT_PUBLIC_SITE_URL,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${process.env.NEXT_PUBLIC_SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <JsonLd data={schema} />
      
      {/* --- SECTION 1: EPISODE TERBARU --- */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6 border-l-4 border-red-500 pl-4">
          <h2 className="text-2xl font-bold text-white">Rilis Terbaru</h2>
          <Link href="/episodes" className="text-sm text-red-500 hover:text-red-400 font-medium flex items-center gap-1">
            Lihat Semua <ChevronRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {episodes.map((ep, idx) => (
            <AnimeCard 
              key={idx}
              title={ep.title}
              imageUrl={ep.imageUrl}
              link={ep.watchUrl}
              type="episode"
              // --- PROPS BARU ---
              quality={ep.quality}  // "720p"
              year={ep.year}        // "2026"
            />
          ))}
        </div>
      </section>

      {/* --- SECTION 2: ANIME BARU DITAMBAHKAN --- */}
      <section>
        <div className="flex justify-between items-center mb-6 border-l-4 border-blue-500 pl-4">
          <h2 className="text-2xl font-bold text-white">Anime Baru Ditambahkan</h2>
          <Link href="/anime" className="text-sm text-blue-500 hover:text-blue-400 font-medium flex items-center gap-1">
            Lihat Directory <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {latestSeries.map((anime, idx) => (
            <AnimeCard 
              key={idx}
              title={anime.title}
              imageUrl={anime.imageUrl}
              link={`/anime/${anime.pageSlug}`}
              type="anime"
              // --- PROPS BARU ---
              // Menggunakan optional chaining (?.) untuk jaga-jaga jika info kosong
              status={anime.info?.Status}   // "Completed"
              animeType={anime.info?.Type}  // "Hentai"
              year={anime.info?.Released}   // "2015"
            />
          ))}
        </div>
      </section>
    </div>
  );
}