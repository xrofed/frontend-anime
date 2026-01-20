"use client"; // Wajib: Menandakan ini Client Component
import { useRouter, useSearchParams } from 'next/navigation';

export default function AnimeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ambil nilai saat ini dari URL agar dropdown "ingat" pilihannya
  const currentSort = searchParams.get('sort') || 'latest';
  const currentStatus = searchParams.get('status') || '';

  // Fungsi untuk update URL tanpa reload penuh
  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(searchParams);
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reset ke halaman 1 setiap kali filter berubah
    params.set('page', '1');

    router.push(`/anime?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-4">
      {/* DROPDOWN SORT (URUTAN) */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400 font-bold uppercase">Urutkan:</label>
        <select
          value={currentSort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          className="bg-slate-800 text-sm text-white px-3 py-2 rounded border border-slate-700 focus:outline-none focus:border-red-500 transition cursor-pointer"
        >
          <option value="latest">Terbaru</option>
          <option value="oldest">Terlama</option>
          <option value="az">A-Z</option>
          <option value="za">Z-A</option>
          <option value="popular">Terpopuler</option>
        </select>
      </div>

      {/* DROPDOWN STATUS */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400 font-bold uppercase">Status:</label>
        <select
          value={currentStatus}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="bg-slate-800 text-sm text-white px-3 py-2 rounded border border-slate-700 focus:outline-none focus:border-red-500 transition cursor-pointer"
        >
          <option value="">Semua Status</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
    </div>
  );
}