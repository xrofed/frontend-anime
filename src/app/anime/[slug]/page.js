import { fetchData, getFullImageUrl } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import JsonLd from '@/components/JsonLd';
import AnimeCard from '@/components/AnimeCard';
import { Film, Info, Tag, Video, PlayCircle } from 'lucide-react';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const res = await fetchData(`/anime/${slug}`);
  
  if (!res?.success) return { title: 'Not Found' };
  
  const anime = res.data.anime;
  return {
    title: `Nonton ${anime.title} Sub Indo Gratis`,
    description: `Streaming ${anime.title} Subtitle Indonesia. ${anime.synopsis?.substring(0, 150)}...`,
    openGraph: {
      images: [getFullImageUrl(anime.imageUrl)],
      title: anime.title,
      description: anime.synopsis,
    },
  };
}

export default async function AnimeDetail({ params }) {
  const { slug } = await params;
  const res = await fetchData(`/anime/${slug}`);
  
  if (!res || !res.success) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-400">
        Anime tidak ditemukan atau terjadi kesalahan.
      </div>
    );
  }

  const { anime, recommendations } = res.data;

  // Schema SEO
  const schema = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    "name": anime.title,
    "image": getFullImageUrl(anime.imageUrl),
    "description": anime.synopsis,
    "numberOfEpisodes": anime.episodes?.length,
    "genre": anime.genres,
    "productionCompany": {
        "@type": "Organization",
        "name": anime.info?.Studio || "Unknown"
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <JsonLd data={schema} />

      {/* --- BAGIAN ATAS: DETAIL ANIME (Modern Card Style) --- */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-8 md:mb-12 bg-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden p-6 relative">
        
        {/* Background Blur Effect */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-slate-800/20 to-slate-900/90 pointer-events-none z-0"></div>

        {/* Kolom Kiri: Poster */}
        <div className="w-full md:w-1/3 lg:w-1/4 shrink-0 z-10">
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg border border-white/10 group">
            <Image 
              src={getFullImageUrl(anime.imageUrl)} 
              alt={anime.title} 
              fill 
              className="object-cover transition-transform duration-500 group-hover:scale-105" 
              sizes="(max-width: 768px) 100vw, 300px"
              priority
            />
            {anime.info?.Status && (
                <div className="absolute top-3 left-3 bg-red-600/90 backdrop-blur-sm text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-red-500/50">
                    {anime.info.Status}
                </div>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Informasi */}
        <div className="w-full text-slate-300 z-10 flex flex-col justify-center">
          {/* Judul */}
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
            {anime.title}
          </h1>

          {/* Genre Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
             {anime.genres?.map(g => (
               <Link 
                 key={g} 
                 href={`/genre/${g.toLowerCase().replace(/ /g, '-')}`}
                 className="bg-slate-800/80 hover:bg-slate-700 border border-white/10 text-[10px] md:text-xs px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 text-slate-200"
               >
                 <Tag size={12} className="text-red-500"/> {g}
               </Link>
             ))}
          </div>

          {/* Grid Info Lengkap */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Tipe', val: anime.info?.Type },
              { label: 'Rilis', val: anime.info?.Released },
              { label: 'Studio', val: anime.info?.Studio },
              { label: 'Durasi', val: anime.info?.Duration },
              { label: 'Sensor', val: anime.info?.Censor, highlight: anime.info?.Censor === 'Uncensored' }
            ].map((item, idx) => (
                <div key={idx} className="bg-slate-800/50 border border-white/5 rounded-lg p-3 flex flex-col">
                    <span className="text-[10px] md:text-xs text-slate-500 uppercase font-bold mb-1 tracking-wider">{item.label}</span>
                    <span className={`text-xs md:text-sm font-medium ${item.highlight ? 'text-red-400' : 'text-slate-200'}`}>
                        {item.val || '-'}
                    </span>
                </div>
            ))}
          </div>

          {/* Sinopsis */}
          <div className="bg-slate-800/30 rounded-xl p-4 border border-white/5">
            <h3 className="text-white font-bold mb-2 flex items-center gap-2 text-sm md:text-base">
                <Info size={16} className="text-red-500" /> Sinopsis
            </h3>
            <p className="text-slate-400 leading-relaxed text-xs md:text-sm text-justify line-clamp-4 md:line-clamp-none hover:line-clamp-none transition-all cursor-pointer">
                {anime.synopsis || "Sinopsis belum tersedia."}
            </p>
          </div>
        </div>
      </div>

      {/* --- BAGIAN TENGAH: DAFTAR EPISODE (Tile Style) --- */}
      <div className="mb-8 md:mb-12">
        <div className="flex items-center justify-between mb-4 md:mb-6 border-b border-white/10 pb-4">
            <h2 className="text-lg md:text-2xl font-bold text-white flex items-center gap-2">
                <Video className="text-red-500" /> Daftar Episode
            </h2>
            <span className="text-xs md:text-sm text-slate-500 bg-slate-800 px-3 py-1 rounded-full border border-white/5">
                Total {anime.episodes?.length || 0} Eps
            </span>
        </div>
        
        {anime.episodes && anime.episodes.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {anime.episodes.map((ep, idx) => (
                <Link 
                key={idx} 
                href={ep.watchUrl || `/watch${ep.url}`}
                className="group relative flex flex-col justify-between bg-slate-800 hover:bg-slate-700 transition-all duration-300 p-3 rounded-lg border border-white/5 hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(220,38,38,0.2)] hover:-translate-y-1"
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-slate-500 bg-black/20 px-1.5 py-0.5 rounded">
                            EPS {anime.episodes.length - idx}
                        </span>
                        <PlayCircle size={16} className="text-slate-600 group-hover:text-red-500 transition-colors" />
                    </div>
                    
                    <div className="text-xs md:text-sm font-semibold text-slate-200 group-hover:text-white line-clamp-2 mb-2 leading-snug">
                         Episode {anime.episodes.length - idx}
                    </div>
                    
                    <div className="text-[10px] text-slate-500 group-hover:text-slate-400 border-t border-white/5 pt-2 mt-auto">
                        {new Date(ep.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: '2-digit' }) || '-'}
                    </div>
                </Link>
            ))}
            </div>
        ) : (
            <div className="p-8 text-center bg-slate-800/50 border border-dashed border-slate-700 rounded-xl text-slate-500 text-sm">
                Belum ada episode yang diupload.
            </div>
        )}
      </div>

      {/* --- BAGIAN BAWAH: REKOMENDASI (Updated Props) --- */}
      {recommendations && recommendations.length > 0 && (
        <div>
            <h2 className="text-lg md:text-2xl font-bold text-white mb-6 border-l-4 border-blue-500 pl-4 flex items-center gap-2">
                <Film className="text-blue-500" /> Anime Serupa
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {recommendations.map((item, idx) => (
                    <AnimeCard 
                        key={idx}
                        title={item.title}
                        imageUrl={item.imageUrl}
                        link={`/anime/${item.pageSlug}`}
                        type="anime"
                        // --- PROPS BARU DITAMBAHKAN ---
                        status={item.info?.Status}
                        animeType={item.info?.Type}
                        year={item.info?.Released}
                    />
                ))}
            </div>
        </div>
      )}
    </div>
  );
}