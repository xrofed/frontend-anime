"use client";
import { useEffect, useState, useRef } from 'react';
import { Play, Loader2 } from 'lucide-react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css'; // Wajib import CSS Video.js

export default function VideoPlayer({ streams }) {
  const [activeStreamIndex, setActiveStreamIndex] = useState(0);
  
  // State untuk menyimpan status Player
  const [playerState, setPlayerState] = useState({
    url: null,
    type: 'embed', // 'embed' | 'hls'
    isLoading: false
  });

  // Refs untuk Video.js
  const videoNodeRef = useRef(null); // Ref untuk elemen DIV pembungkus
  const playerRef = useRef(null);    // Ref untuk instance Video.js

  // --- 1. LOGIKA PROSES STREAM (DECODE, SCRAPE & PROXY) ---
  useEffect(() => {
    let isMounted = true;

    // Reset state saat ganti stream
    setPlayerState(prev => ({ ...prev, url: null, isLoading: true }));

    const processStream = async () => {
      if (!streams || streams.length === 0) return;

      const currentStream = streams[activeStreamIndex];
      if (!currentStream?.url) return;

      try {
        // 1. Decode Base64 dari API
        const decodedUrl = atob(currentStream.url);
        
        // Tentukan URL API Backend (Port 3000)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

        // A. Cek apakah ini target Scraper (Embed Saitou/Lainnya)
        if (decodedUrl.includes('saitou.my.id') || decodedUrl.includes('embed')) {
          console.log("Mendeteksi Embed, mencoba extract via Backend...");
          
          // Panggil endpoint /extract
          const res = await fetch(`${apiUrl}/extract?url=${encodeURIComponent(decodedUrl)}`);
          const result = await res.json();

          if (isMounted) {
            if (result.success && result.data?.url) {
              // SUKSES SCRAPE -> BUNGKUS DENGAN PROXY
              const originalM3u8 = result.data.url;
              
              // Kita bungkus URL m3u8 dengan Proxy Backend kita agar tidak kena CORS
              const proxyUrl = `${apiUrl}/proxy?url=${encodeURIComponent(originalM3u8)}`;

              console.log("Menggunakan Proxy URL:", proxyUrl);

              setPlayerState({ 
                url: proxyUrl, 
                type: 'hls', 
                isLoading: false 
              });
            } else {
              // GAGAL SCRAPE -> Fallback ke Iframe Embed biasa
              console.warn("Gagal scrape, fallback ke embed");
              setPlayerState({ 
                url: decodedUrl, 
                type: 'embed', 
                isLoading: false 
              });
            }
          }
        } 
        // B. Bukan target scraper (Direct Link / M3U8 langsung)
        else {
          const isM3u8 = decodedUrl.includes('.m3u8');
          
          if (isM3u8) {
             // Jika m3u8 langsung, juga sebaiknya lewat proxy untuk jaga-jaga CORS
             const proxyUrl = `${apiUrl}/proxy?url=${encodeURIComponent(decodedUrl)}`;
             if (isMounted) {
                setPlayerState({ 
                  url: proxyUrl, 
                  type: 'hls', 
                  isLoading: false 
                });
             }
          } else {
             // Jika mp4 biasa atau iframe lain
             if (isMounted) {
                setPlayerState({ 
                  url: decodedUrl, 
                  type: 'embed', 
                  isLoading: false 
                });
             }
          }
        }

      } catch (e) {
        console.error("Error processing stream:", e);
        if (isMounted) setPlayerState(prev => ({ ...prev, isLoading: false }));
      }
    };

    processStream();

    return () => { isMounted = false; };
  }, [streams, activeStreamIndex]);


  // --- 2. LOGIKA VIDEO.JS PLAYER (HLS) ---
  useEffect(() => {
    // Hanya jalankan jika tipe adalah 'hls' dan URL tersedia
    if (playerState.type === 'hls' && playerState.url && videoNodeRef.current) {
      
      // Jika player belum ada, inisialisasi
      if (!playerRef.current) {
        const videoElement = document.createElement("video-js");
        videoElement.classList.add('vjs-big-play-centered'); // Tombol play di tengah
        videoElement.classList.add('vjs-16-9'); // Rasio 16:9
        videoNodeRef.current.appendChild(videoElement);

        const player = videojs(videoElement, {
          autoplay: false,
          controls: true,
          responsive: true,
          fluid: true,
          html5: {
            vhs: {
              overrideNative: true // Paksa gunakan Video.js engine, bukan native Safari
            },
            nativeAudioTracks: false,
            nativeVideoTracks: false
          },
          sources: [{
            src: playerState.url,
            type: 'application/x-mpegURL' // Tipe MIME untuk HLS
          }]
        }, () => {
          console.log('Video.js Player Ready');
        });

        playerRef.current = player;
      } else {
        // Jika player sudah ada, update source-nya saja
        const player = playerRef.current;
        player.src({ src: playerState.url, type: 'application/x-mpegURL' });
      }
    } else {
      // Jika tipe berubah jadi 'embed', hancurkan player Video.js jika ada
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
        // Bersihkan DOM anak di ref container
        if(videoNodeRef.current) videoNodeRef.current.innerHTML = "";
      }
    }
  }, [playerState.url, playerState.type]);


  // --- 3. CLEANUP SAAT UNMOUNT ---
  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);


  if (!streams || streams.length === 0) {
    return (
      <div className="aspect-video bg-black flex items-center justify-center text-slate-500 rounded-lg">
        Video tidak tersedia
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* AREA PLAYER UTAMA */}
      <div className="aspect-video bg-black rounded-lg overflow-hidden relative shadow-lg ring-1 ring-slate-800 group z-10">
        
        {playerState.isLoading ? (
          /* LOADING SCREEN */
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-900/50">
            <Loader2 className="animate-spin mb-2 text-red-500" size={32} />
            <span className="text-sm font-medium animate-pulse">Menyiapkan Video...</span>
          </div>
        ) : playerState.url ? (
          /* PLAYER SUDAH SIAP */
          playerState.type === 'hls' ? (
            
            // --- VIDEO.JS CONTAINER ---
            // 'data-vjs-player' menjaga agar React tidak merusak DOM Video.js
            <div data-vjs-player ref={videoNodeRef} className="w-full h-full" />
            
          ) : (
            
            // --- IFRAME EMBED (Fallback / Non-HLS) ---
            <iframe 
              src={playerState.url} 
              className="w-full h-full" 
              allowFullScreen 
              scrolling="no"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
            
          )
        ) : (
          /* STATE KOSONG */
          <div className="w-full h-full flex items-center justify-center text-slate-500">
            Memuat...
          </div>
        )}
      </div>

      {/* TOMBOL PILIH SERVER */}
      <div className="bg-slate-800 p-4 rounded-lg">
        <h3 className="text-sm font-bold text-slate-400 mb-3 flex items-center gap-2">
          <Play size={16} /> PILIH SERVER STREAMING
        </h3>
        <div className="flex flex-wrap gap-2">
          {streams.map((stream, idx) => (
            <button
              key={stream._id || idx}
              onClick={() => setActiveStreamIndex(idx)}
              disabled={playerState.isLoading && activeStreamIndex === idx}
              className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                activeStreamIndex === idx
                  ? 'bg-red-600 text-white shadow-lg scale-105'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {stream.name || `Server ${idx + 1}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}