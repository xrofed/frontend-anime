import { fetchData, getFullImageUrl } from '@/lib/api';
import VideoPlayer from '@/components/VideoPlayer';
import Link from 'next/link';
import AnimeCard from '@/components/AnimeCard';
import JsonLd from '@/components/JsonLd';

export async function generateMetadata({ params }) {
  const res = await fetchData(`/watch/${params.slug}`);
  if (!res?.success) return { title: 'Not Found' };
  
  const { episode, parentAnime } = res.data;
  return {
    title: `Nonton ${episode.title} - ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    description: `Streaming ${episode.title} dari anime ${parentAnime?.title}.`,
  };
}

export default async function WatchPage({ params }) {
  // API kamu menggunakan format slug di DB seperti "/judul-episode-1"
  // Router frontend adalah /watch/judul-episode-1
  // Jadi params.slug sudah benar "judul-episode-1" untuk dikirim ke API
  const res = await fetchData(`/watch/${params.slug}`);

  if (!res || !res.success) return <div className="text-center text-white py-10">Episode tidak ditemukan</div>;

  const { episode, parentAnime, navigation, recommendations } = res.data;

  // Schema SEO: TVEpisode
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
      <div className="text-sm text-slate-400 mb-4 flex items-center gap-2">
        <Link href="/">Home</Link> / 
        {parentAnime && <Link href={`/anime/${parentAnime.slug}`}>{parentAnime.title}</Link>} / 
        <span className="text-white">{episode.title}</span>
      </div>

      {/* Player Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <VideoPlayer streams={episode.streaming} />
          
          <div className="mt-4 flex justify-between items-center bg-slate-800 p-4 rounded-lg">
            {navigation.prev ? (
              <Link href={navigation.prev.url} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm text-white">
                « Prev Ep
              </Link>
            ) : <div/>}
            
            <Link href={navigation.all || '/'} className="px-4 py-2 text-slate-400 hover:text-white text-sm">
              List Episode
            </Link>

            {navigation.next ? (
              <Link href={navigation.next.url} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm text-white">
                Next Ep »
              </Link>
            ) : <div/>}
          </div>

          <div className="mt-6">
            <h1 className="text-xl font-bold text-white mb-2">{episode.title}</h1>
            <p className="text-slate-400 text-sm">Dirilis pada: {new Date(episode.createdAt || episode.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Sidebar Recommendations */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4 border-l-4 border-red-500 pl-3">Rekomendasi</h3>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            {recommendations.map((anime, idx) => (
               <AnimeCard 
               key={idx}
               title={anime.title}
               imageUrl={anime.imageUrl}
               link={`/anime/${anime.pageSlug}`}
               type="anime"
             />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}