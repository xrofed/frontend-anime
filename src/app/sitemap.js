import { fetchData } from '@/lib/api';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hentaicop.com';

  // 1. Static Routes (Halaman Utama)
  const routes = [
    '', 
    '/anime', 
    '/episodes', 
    '/genres'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  }));

  // 2. Dynamic: Genres
  // Kita ambil semua genre dari API
  const genresRes = await fetchData('/genres');
  const genres = genresRes?.success ? genresRes.data.map((genre) => ({
    url: `${baseUrl}/genre/${genre.toLowerCase().replace(/ /g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  })) : [];

  // 3. Dynamic: Anime Terbaru (Page 1)
  // Mengambil list anime terbaru agar cepat terindex
  const animesRes = await fetchData('/animes?page=1&sort=latest');
  const animes = animesRes?.success ? animesRes.data.map((anime) => ({
    url: `${baseUrl}/anime/${anime.pageSlug}`,
    lastModified: new Date(), // Idealnya ambil dari updatedAt di DB jika ada
    changeFrequency: 'weekly',
    priority: 0.9,
  })) : [];

  // 4. Dynamic: Episode Terbaru (Page 1)
  const episodesRes = await fetchData('/episodes?page=1');
  const episodes = episodesRes?.success ? episodesRes.data.map((ep) => ({
    // ep.watchUrl formatnya sudah '/watch/slug' dari API
    url: `${baseUrl}${ep.watchUrl}`,
    lastModified: new Date(ep.releasedAt || new Date()),
    changeFrequency: 'daily',
    priority: 0.7,
  })) : [];

  // Gabungkan semua menjadi satu array sitemap
  return [...routes, ...genres, ...animes, ...episodes];
}