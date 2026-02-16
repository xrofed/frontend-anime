// generate-sitemap.js - Perbaikan API URL
import { writeFileSync, createReadStream, createWriteStream, existsSync, mkdirSync } from 'fs';
import { createGzip } from 'zlib';
import { pipeline } from 'stream/promises';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Debug: Log environment variables
console.log('🔧 Environment check:');
console.log('NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL);
console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);

async function fetchData(endpoint) {
  // Gunakan API URL yang benar untuk development
  // Coba beberapa opsi URL:
  const apiUrls = [
    process.env.NEXT_PUBLIC_API_URL,
    'https://apinekopoi.onrender.com/api',
  ];

  let lastError = null;
  
  for (const baseApiUrl of apiUrls) {
    if (!baseApiUrl) continue;
    
    const url = `${baseApiUrl}${endpoint}`;
    console.log(`🔗 Trying API: ${url}`);
    
    try {
      const response = await fetch(url, {
        timeout: 5000, // Timeout 5 detik
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Success from: ${baseApiUrl}`);
        return data;
      }
    } catch (error) {
      lastError = error;
      console.log(`❌ Failed: ${baseApiUrl} - ${error.message}`);
    }
  }
  
  console.error(`❌ All API attempts failed for ${endpoint}`);
  console.error('Last error:', lastError?.message);
  return null;
}

async function generateSitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://v2.duniahentai.top';
  
  console.log('\n🚀 Generating sitemap for:', baseUrl);
  console.log('=' .repeat(50));
  
  // Tentukan path yang benar
  const publicDir = join(__dirname, 'public');
  
  // Pastikan folder public ada
  if (!existsSync(publicDir)) {
    console.log('📁 Creating public directory...');
    mkdirSync(publicDir, { recursive: true });
  }
  
  // Path untuk file sitemap
  const sitemapPath = join(publicDir, 'sitemap.xml');
  const sitemapGzPath = join(publicDir, 'sitemap.xml.gz');
  
  // XML header
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // 1. Static Routes
  const staticRoutes = [
    '', 
    '/anime', 
    '/episodes', 
    '/genres'
  ];

  console.log('📝 Adding static routes...');
  staticRoutes.forEach(route => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${route}</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
    xml += '    <changefreq>daily</changefreq>\n';
    xml += '    <priority>1.0</priority>\n';
    xml += '  </url>\n';
  });

  // 2. Dynamic: Genres
  console.log('\n🎭 Fetching genres...');
  try {
    const genresRes = await fetchData('/genres');
    if (genresRes?.success) {
      console.log(`✅ Found ${genresRes.data?.length || 0} genres`);
      if (genresRes.data && Array.isArray(genresRes.data)) {
        genresRes.data.forEach(genre => {
          const genreName = typeof genre === 'string' ? genre : genre.name || 'unknown';
          const genreSlug = genreName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
          
          xml += '  <url>\n';
          xml += `    <loc>${baseUrl}/genre/${genreSlug}</loc>\n`;
          xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
          xml += '    <changefreq>weekly</changefreq>\n';
          xml += '    <priority>0.8</priority>\n';
          xml += '  </url>\n';
        });
      }
    } else {
      console.log('⚠️ No genres data found or API not available');
      // Tambahkan contoh genre untuk testing
      console.log('📌 Adding sample genres for testing...');
      const sampleGenres = ['action', 'adventure', 'comedy', 'drama', 'fantasy'];
      sampleGenres.forEach(genre => {
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/genre/${genre}</loc>\n`;
        xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.8</priority>\n';
        xml += '  </url>\n';
      });
    }
  } catch (error) {
    console.error('❌ Error fetching genres:', error.message);
  }

  // 3. Dynamic: Anime Terbaru
  console.log('\n📺 Fetching latest anime...');
  try {
    const animesRes = await fetchData('/animes?page=1&sort=latest');
    if (animesRes?.success) {
      console.log(`✅ Found ${animesRes.data?.length || 0} anime`);
      if (animesRes.data && Array.isArray(animesRes.data)) {
        animesRes.data.forEach(anime => {
          const slug = anime.pageSlug || anime.slug || anime.id || 'unknown';
          xml += '  <url>\n';
          xml += `    <loc>${baseUrl}/anime/${slug}</loc>\n`;
          xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
          xml += '    <changefreq>weekly</changefreq>\n';
          xml += '    <priority>0.9</priority>\n';
          xml += '  </url>\n';
        });
      }
    } else {
      console.log('⚠️ No anime data found or API not available');
      // Tambahkan contoh anime untuk testing
      console.log('📌 Adding sample anime for testing...');
      for (let i = 1; i <= 10; i++) {
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/anime/sample-anime-${i}</loc>\n`;
        xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.9</priority>\n';
        xml += '  </url>\n';
      }
    }
  } catch (error) {
    console.error('❌ Error fetching animes:', error.message);
  }

  // 4. Dynamic: Episode Terbaru
  console.log('\n🎬 Fetching latest episodes...');
  try {
    const episodesRes = await fetchData('/episodes?page=1');
    if (episodesRes?.success) {
      console.log(`✅ Found ${episodesRes.data?.length || 0} episodes`);
      if (episodesRes.data && Array.isArray(episodesRes.data)) {
        episodesRes.data.forEach(ep => {
          const watchUrl = ep.watchUrl || `/watch/${ep.slug || ep.id || 'unknown'}`;
          xml += '  <url>\n';
          xml += `    <loc>${baseUrl}${watchUrl}</loc>\n`;
          const date = ep.releasedAt ? new Date(ep.releasedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
          xml += `    <lastmod>${date}</lastmod>\n`;
          xml += '    <changefreq>daily</changefreq>\n';
          xml += '    <priority>0.7</priority>\n';
          xml += '  </url>\n';
        });
      }
    } else {
      console.log('⚠️ No episodes data found or API not available');
      // Tambahkan contoh episode untuk testing
      console.log('📌 Adding sample episodes for testing...');
      for (let i = 1; i <= 10; i++) {
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/watch/sample-episode-${i}</loc>\n`;
        xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
        xml += '    <changefreq>daily</changefreq>\n';
        xml += '    <priority>0.7</priority>\n';
        xml += '  </url>\n';
      }
    }
  } catch (error) {
    console.error('❌ Error fetching episodes:', error.message);
  }

  xml += '</urlset>';

  // Simpan sitemap.xml
  writeFileSync(sitemapPath, xml);
  console.log('\n' + '=' .repeat(50));
  console.log(`✅ Sitemap.xml generated at: ${sitemapPath}`);
  console.log(`📊 Total URLs: ${xml.split('<url>').length - 1}`);

  // Kompres ke .gz
  try {
    await compressToGzip(sitemapPath, sitemapGzPath);
    console.log(`✅ Sitemap.xml.gz generated at: ${sitemapGzPath}`);
    
    // Tampilkan ukuran file
    const { statSync } = await import('fs');
    const originalSize = statSync(sitemapPath).size;
    const gzSize = statSync(sitemapGzPath).size;
    const compressionRatio = ((1 - gzSize / originalSize) * 100).toFixed(1);
    console.log(`📦 File sizes: ${(originalSize / 1024).toFixed(2)}KB → ${(gzSize / 1024).toFixed(2)}KB (${compressionRatio}% smaller)`);
  } catch (error) {
    console.error('❌ Error compressing to gzip:', error.message);
  }
}

async function compressToGzip(inputPath, outputPath) {
  const gzip = createGzip();
  const source = createReadStream(inputPath);
  const destination = createWriteStream(outputPath);
  
  await pipeline(source, gzip, destination);
}

// Jalankan script
generateSitemap().catch(console.error);