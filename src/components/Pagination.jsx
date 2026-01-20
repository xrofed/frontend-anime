import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, baseUrl }) {
  // Helper untuk menangani URL dengan query params lain (misal ?sort=...)
  const getLink = (pageNum) => {
    if (baseUrl.includes('?')) {
      return `${baseUrl}&page=${pageNum}`;
    }
    return `${baseUrl}?page=${pageNum}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-10">
      {page > 1 ? (
        <Link 
          href={getLink(page - 1)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-600 text-white rounded-lg transition"
        >
          <ChevronLeft size={20} /> Prev
        </Link>
      ) : (
        <button disabled className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 text-slate-500 rounded-lg cursor-not-allowed">
          <ChevronLeft size={20} /> Prev
        </button>
      )}

      <span className="text-slate-400 text-sm font-medium">
        Halaman {page} dari {totalPages}
      </span>

      {page < totalPages ? (
        <Link 
          href={getLink(page + 1)}
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
  );
}