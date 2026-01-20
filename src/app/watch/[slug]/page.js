import { fetchData, getFullImageUrl } from '@/lib/api';
import VideoPlayer from '@/components/VideoPlayer';
import Link from 'next/link';
import Image from 'next/image';
import AnimeCard from '@/components/AnimeCard';
import JsonLd from '@/components/JsonLd';
import { Download, Film, Calendar, ChevronLeft, ChevronRight, List } from 'lucide-react';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const res = await fetchData(`/watch/${slug}`);
  if (!res?.success) return { title: 'Not Found' };
  
  const { episode, parentAnime } = res.data;
  return {
    title: `Nonton ${episode.title} Sub Indo - ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    description: `Streaming dan Download ${episode.title} dari hentai ${parentAnime?.title} hanya di Duniahentai.`,
  };
}

export default async function WatchPage({ params }) {
  const { slug } = await params;
  const res = await fetchData(`/watch/${slug}`);

  if (!res || !res.success) return <div className="text-center text-white py-20">Episode tidak ditemukan</div>;

  const { episode, parentAnime, navigation, recommendations } = res.data;

  // Schema SEO
  const schema = {
    "@context": "https://schema.org",
    "@type": "TVEpisode",
    "episodeNumber": episode.episodeNumber || 1, 
    "name": episode.title,
    "partOfSeries": {
      "@type": "TVSeries",
      "name": parentAnime?.title
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <JsonLd data={schema} />

      {/* Breadcrumb */}
      <div className="text-sm text-slate-400 mb-6 flex flex-wrap items-center gap-2">
        <Link href="/" className="hover:text-red-500">Home</Link> / 
        {parentAnime && <Link href={`/anime/${parentAnime.slug}`} className="hover:text-red-500">{parentAnime.title}</Link>} / 
        <span className="text-white truncate max-w-[200px]">{episode.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- KOLOM KIRI (Player, Navigasi, Download) --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Video Player & Server Select */}
          <VideoPlayer streams={episode.streaming} />
          
          {/* 2. Judul & Info Episode */}
          <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700/50">
            <h1 className="text-xl md:text-2xl font-bold text-white mb-2">{episode.title}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(episode.updatedAt).toLocaleDateString()}</span>
              <span>•</span>
              <span className="text-red-400">{parentAnime?.title}</span>
            </div>
          </div>

          {/* 3. Navigasi Episode (Prev/Next) */}
          <div className="grid grid-cols-3 gap-2">
            {navigation.prev ? (
              <Link 
                href={navigation.prev.url} 
                className="flex items-center justify-center gap-1 md:gap-2 bg-slate-800 hover:bg-slate-700 text-white py-2 md:py-3 rounded-lg transition font-medium text-xs md:text-sm"
              >
                <ChevronLeft size={16} className="shrink-0"/> Prev
              </Link>
            ) : <div className="bg-slate-900/50 rounded-lg"></div>}
            
            <Link 
                href={navigation.all || '/'} 
                className="flex items-center justify-center gap-1 md:gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 md:py-3 rounded-lg transition font-medium text-xs md:text-sm"
            >
              <List size={16} className="shrink-0"/> <span className="truncate">Semua Eps</span>
            </Link>

            {navigation.next ? (
              <Link 
                href={navigation.next.url} 
                className="flex items-center justify-center gap-1 md:gap-2 bg-red-600 hover:bg-red-700 text-white py-2 md:py-3 rounded-lg transition font-medium text-xs md:text-sm"
              >
                Next <ChevronRight size={16} className="shrink-0"/>
              </Link>
            ) : <div className="bg-slate-900/50 rounded-lg"></div>}
          </div>

          {/* 4. DOWNLOAD SECTION */}
          {episode.downloads && episode.downloads.length > 0 && (
            <div className="bg-slate-800 rounded-lg overflow-hidden">
              <div className="bg-red-600 px-4 py-2 md:px-5 md:py-3 flex items-center gap-2 text-white font-bold">
                <Download size={18} className="md:w-5 md:h-5" />
                <h2 className="text-sm md:text-base">Download Links</h2>
              </div>
              <div className="p-3 md:p-5 space-y-3 md:space-y-4">
                {episode.downloads.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center border-b border-slate-700 last:border-0 pb-3 last:pb-0 gap-2 md:gap-3">
                    <div className="w-20 md:w-24 shrink-0">
                      <span className="bg-slate-900 text-slate-300 text-[10px] md:text-sm font-bold px-2 py-1 md:px-3 rounded border border-slate-700">
                        {item.quality}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 flex-grow">
                      {item.links.map((link, idxLink) => (
                        <a 
                          key={idxLink} 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] md:text-sm bg-slate-700 hover:bg-red-600 text-white px-2 py-1 md:px-3 md:py-1.5 rounded transition flex items-center gap-1"
                        >
                          {link.host}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

           {/* 5. Sinopsis Anime */}
           {parentAnime && (
            <div className="bg-slate-800/50 p-5 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Film size={18} className="text-red-500" /> Sinopsis
              </h3>
              <div>
                  <h4 className="font-bold text-slate-200 mb-1">{parentAnime.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                      {parentAnime.synopsis || "Tidak ada sinopsis."}
                  </p>
              </div>
            </div>
           )}

        </div>

        {/* --- KOLOM KANAN (Sidebar: List Episode & Rekomendasi) --- */}
        <div className="space-y-8">
          
            {/* List Episode Anime Ini */}
            {parentAnime && parentAnime.episodes && (
                <div className="bg-slate-800 rounded-lg overflow-hidden max-h-[500px] flex flex-col">
                    <div className="bg-slate-700/50 px-4 py-3 border-b border-slate-600 font-bold text-white">
                        Episode Lainnya
                    </div>
                    <div className="overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
                        <div className="flex flex-col gap-1">
                            {parentAnime.episodes.map((ep, idx) => {
                                const isCurrent = ep.url === `/${slug}` || ep.url === slug; 
                                return (
                                    <Link 
                                        key={idx} 
                                        href={`/watch${ep.url}`}
                                        className={`px-3 py-2 text-sm rounded transition truncate ${
                                            isCurrent 
                                            ? 'bg-red-600 text-white' 
                                            : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                                        }`}
                                    >
                                        <span className="font-mono opacity-50 mr-2">#{parentAnime.episodes.length - idx}</span>
                                        {ep.title}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Rekomendasi */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4 border-l-4 border-red-500 pl-3">
                    Rekomendasi
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    {recommendations.map((anime, idx) => (
                    <AnimeCard 
                        key={idx}
                        title={anime.title}
                        imageUrl={anime.imageUrl}
                        link={`/anime/${anime.pageSlug}`}
                        type="anime"
                        // --- UPDATE PROPS BARU ---
                        status={anime.info?.Status}
                        animeType={anime.info?.Type}
                        year={anime.info?.Released}
                    />
                    ))}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}