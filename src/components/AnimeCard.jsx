import Link from 'next/link';
import Image from 'next/image';
import { getFullImageUrl } from '@/lib/api';
import { PlayCircle, Calendar, Star, MonitorPlay } from 'lucide-react';

export default function AnimeCard({ 
  title, 
  imageUrl, 
  link, 
  type = 'episode', 
  quality,    // e.g. "720p" (dari data episode)
  year,       // e.g. "2026" (dari data episode/anime)
  status,     // e.g. "Completed" (dari data anime)
  animeType   // e.g. "TV" / "Hentai" (dari data anime)
}) {
  
  // Helper untuk menentukan warna badge status
  const getStatusColor = (s) => {
    if (!s) return 'bg-slate-600';
    if (s.toLowerCase() === 'completed') return 'bg-green-600';
    if (s.toLowerCase() === 'ongoing') return 'bg-blue-600';
    return 'bg-slate-600';
  };

  return (
    <Link href={link} className="group block relative">
      {/* --- IMAGE CONTAINER --- */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-slate-800 shadow-lg group-hover:shadow-red-900/20 border border-slate-700/50 group-hover:border-red-500/50 transition-all duration-300">
        
        <Image
          src={getFullImageUrl(imageUrl)}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, 20vw"
        />

        {/* Overlay Gelap saat Hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />

        {/* --- BADGES (TOP) --- */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {/* Badge Quality (Untuk Episode) */}
          {quality && (
            <span className="bg-slate-900/90 backdrop-blur-sm text-red-400 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-red-500/30 shadow-sm">
              {quality}
            </span>
          )}
          {/* Badge Type (Untuk Anime) */}
          {animeType && (
            <span className="bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded border border-white/10">
              {animeType}
            </span>
          )}
        </div>

        <div className="absolute top-2 right-2 z-10">
          {type === 'episode' ? (
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md animate-pulse">
              EP BARU
            </span>
          ) : (
            status && (
              <span className={`${getStatusColor(status)} text-white text-[10px] font-bold px-2 py-1 rounded shadow-md`}>
                {status}
              </span>
            )
          )}
        </div>

        {/* --- PLAY ICON (CENTER HOVER) --- */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110">
          <PlayCircle className="w-10 h-10 md:w-12 md:h-12 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" fill="rgba(220, 38, 38, 0.8)" />
        </div>

        {/* --- INFO BAR (BOTTOM OVERLAY) --- */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3 pt-8">
          <div className="flex items-center justify-between text-[10px] font-medium text-slate-300">
            {year && (
              <div className="flex items-center gap-1">
                <Calendar size={10} className="text-red-500" /> {year}
              </div>
            )}
            {/* Jika type anime, tampilkan icon type */}
            {type === 'anime' && (
               <div className="flex items-center gap-1">
                 <MonitorPlay size={10} /> Info
               </div>
            )}
          </div>
        </div>
      </div>

      {/* --- TITLE SECTION --- */}
      <h3 className="mt-2 text-xs md:text-sm font-semibold text-slate-200 line-clamp-2 leading-snug group-hover:text-red-500 transition-colors">
        {title}
      </h3>
    </Link>
  );
}