import { fetchData } from '@/lib/api';
import Link from 'next/link';
import { Tag } from 'lucide-react';

export const metadata = {
  title: `Daftar Genre Anime - ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  description: 'Temukan anime berdasarkan genre favoritmu.',
};

export default async function GenresPage() {
  const res = await fetchData('/genres');
  const genres = res?.success ? res.data : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6 border-l-4 border-yellow-500 pl-3 flex items-center gap-2">
        <Tag /> Semua Genre
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {genres.map((genre) => (
          <Link
            key={genre}
            href={`/genre/${genre.toLowerCase().replace(/ /g, '-')}`}
            className="bg-slate-800 hover:bg-red-600 hover:text-white transition p-4 rounded-lg text-center text-sm font-medium text-slate-300 border border-slate-700 hover:border-red-500"
          >
            {genre}
          </Link>
        ))}
      </div>
    </div>
  );
}