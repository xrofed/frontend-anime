// lib/api.js
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchData(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    // Gunakan 'no-store' untuk data yang sering berubah (seperti view count)
    // atau 'force-cache' jika ingin static generation.
    // Di sini kita pakai default fetch Next.js (caching dinamis)
    cache: 'no-store', 
    ...options,
  });

  if (!res.ok) {
    // Bisa return null atau throw error tergantung strategi error handling
    return null;
  }

  return res.json();
}

export function getFullImageUrl(path) {
  if (!path) return '/placeholder.jpg';
  if (path.startsWith('http')) return path;
  // Jika path relative dari backend, kita arahkan ke domain backend (bukan /api)
  const backendRoot = BASE_URL.replace('/api', ''); 
  return `${backendRoot}${path}`;
}