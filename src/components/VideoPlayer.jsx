"use client";
import { useEffect, useState, useRef } from 'react';
import { Play, Loader2, AlertCircle, Signal, Settings, Info } from 'lucide-react';
import videojs from 'video.js';
import Script from 'next/script'; // [BARU] Import Script dari Next.js
import 'video.js/dist/video-js.css';

export default function VideoPlayer({ streams }) {
  const [activeStreamIndex, setActiveStreamIndex] = useState(0);

  // State Status Player
  const [playerState, setPlayerState] = useState({
    url: null,
    type: 'embed',
    isLoading: true,
    statusMessage: 'Menginisialisasi...',
    error: null,
    isPlaying: false,
    isBuffering: false
  });

  const [showInfo, setShowInfo] = useState(false);
  const videoNodeRef = useRef(null);
  const playerRef = useRef(null);

  // --- 1. PROSES STREAM (Sama seperti sebelumnya) ---
  useEffect(() => {
    let isMounted = true;
    setPlayerState(prev => ({
      ...prev,
      url: null,
      isLoading: true,
      error: null,
      statusMessage: 'Menghubungkan ke server...',
      isBuffering: false
    }));

    const processStream = async () => {
      if (!streams || streams.length === 0) {
        if (isMounted) setPlayerState(p => ({ ...p, isLoading: false, error: 'Tidak ada stream tersedia.' }));
        return;
      }

      const currentStream = streams[activeStreamIndex];
      if (!currentStream?.url) return;

      try {
        const decodedUrl = atob(currentStream.url);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

        if (isMounted) setPlayerState(p => ({ ...p, statusMessage: 'Menganalisis tipe stream...' }));

        if (decodedUrl.includes('saitou.my.id') || decodedUrl.includes('embed')) {
          if (isMounted) setPlayerState(p => ({ ...p, statusMessage: 'Mengekstrak video dari sumber...' }));

          const res = await fetch(`${apiUrl}/extract?url=${encodeURIComponent(decodedUrl)}`);
          const result = await res.json();

          if (!isMounted) return;

          if (result.success && result.data?.url) {
            const proxyUrl = `${apiUrl}/proxy?url=${encodeURIComponent(result.data.url)}`;
            setPlayerState({
              url: proxyUrl, type: 'hls', isLoading: false, statusMessage: 'Siap diputar (HLS Proxy)',
              error: null, isPlaying: false, isBuffering: false
            });
          } else {
            setPlayerState({
              url: decodedUrl, type: 'embed', isLoading: false, statusMessage: 'Mode Embed (Direct)',
              error: null, isPlaying: false, isBuffering: false
            });
          }
        } else {
          const isM3u8 = decodedUrl.includes('.m3u8');
          const proxyUrl = isM3u8 ? `${apiUrl}/proxy?url=${encodeURIComponent(decodedUrl)}` : decodedUrl;
          const type = isM3u8 ? 'hls' : 'embed';

          if (isMounted) {
            setPlayerState({
              url: proxyUrl, type, isLoading: false,
              statusMessage: isM3u8 ? 'Siap diputar (Direct HLS)' : 'Siap diputar (Embed)',
              error: null, isPlaying: false, isBuffering: false
            });
          }
        }
      } catch (e) {
        if (isMounted) {
          setPlayerState(prev => ({ ...prev, isLoading: false, error: 'Gagal memproses video.' }));
        }
      }
    };
    processStream();
    return () => { isMounted = false; };
  }, [streams, activeStreamIndex]);

  // --- 2. VIDEO.JS SETUP (Sama seperti sebelumnya) ---
  useEffect(() => {
    if (playerState.type === 'hls' && playerState.url && videoNodeRef.current) {
      if (!playerRef.current) {
        const videoElement = document.createElement("video-js");
        videoElement.classList.add('vjs-big-play-centered', 'custom-video-theme');
        videoNodeRef.current.appendChild(videoElement);

        const player = videojs(videoElement, {
          autoplay: false, controls: true, responsive: true, fluid: true,
          playbackRates: [0.5, 1, 1.5, 2],
          userActions: { hotkeys: true },
          html5: { vhs: { overrideNative: true } },
          sources: [{ src: playerState.url, type: 'application/x-mpegURL' }]
        });

        player.on('waiting', () => setPlayerState(p => ({ ...p, isBuffering: true, statusMessage: 'Buffering...' })));
        player.on('playing', () => setPlayerState(p => ({ ...p, isBuffering: false, isPlaying: true, statusMessage: 'Sedang Memutar' })));
        player.on('pause', () => setPlayerState(p => ({ ...p, isPlaying: false, statusMessage: 'Jeda' })));
        player.on('error', () => setPlayerState(p => ({ ...p, error: 'Terjadi kesalahan player.', isLoading: false })));

        playerRef.current = player;
      } else {
        const player = playerRef.current;
        player.src({ src: playerState.url, type: 'application/x-mpegURL' });
        player.load();
      }
    } else {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
        if (videoNodeRef.current) videoNodeRef.current.innerHTML = "";
      }
    }
  }, [playerState.url, playerState.type]);

  // Cleanup
  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) player.dispose();
    };
  }, []);

  const currentServerName = streams?.[activeStreamIndex]?.name || `Server ${activeStreamIndex + 1}`;
  const customCss = `
    .custom-video-theme .vjs-big-play-button { background-color: rgba(220, 38, 38, 0.8) !important; border: none !important; border-radius: 50% !important; width: 2em !important; height: 2em !important; line-height: 2em !important; font-size: 3em !important; }
    .custom-video-theme .vjs-control-bar { background-color: rgba(0, 0, 0, 0.7) !important; }
    .custom-video-theme .vjs-play-progress { background-color: #dc2626 !important; }
  `;

  if (!streams || streams.length === 0) return <div className="text-slate-500">Video tidak tersedia</div>;

  return (
    <div className="flex flex-col gap-4">
      <style>{customCss}</style>

      {/* --- HEADER --- */}
      <div className="flex justify-between items-center bg-slate-800 px-4 py-2 rounded-t-lg border-b border-slate-700">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Signal size={16} className={playerState.error ? "text-red-500" : "text-green-500"} />
          <span>{currentServerName}</span>
          <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-400 uppercase">
            {playerState.type === 'hls' ? 'HLS Player' : 'Embed Frame'}
          </span>
        </div>
        <button onClick={() => setShowInfo(!showInfo)} className={`p-1.5 rounded hover:bg-slate-700 transition ${showInfo ? 'text-red-400 bg-slate-700' : 'text-slate-400'}`}>
          <Info size={18} />
        </button>
      </div>

      {/* --- MAIN PLAYER --- */}
      <div className="aspect-video bg-black relative shadow-2xl group overflow-hidden">
        {playerState.isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/90 text-white">
            <Loader2 className="animate-spin mb-3 text-red-500" size={40} />
            <p className="text-sm font-medium animate-pulse text-slate-300">{playerState.statusMessage}</p>
          </div>
        )}

        {!playerState.isLoading && playerState.error && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/95 text-white px-6 text-center">
            <AlertCircle className="text-red-500 mb-3" size={48} />
            <h3 className="text-lg font-bold mb-1">Gagal Memutar Video</h3>
            <p className="text-slate-400 text-sm mb-4">{playerState.error}</p>
            <div className="flex gap-3">
              <button onClick={() => window.location.reload()} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm font-medium">Refresh</button>
              <button onClick={() => setActiveStreamIndex((prev) => (prev + 1) % streams.length)} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-medium">Ganti Server</button>
            </div>
          </div>
        )}

        {showInfo && (
          <div className="absolute top-2 left-2 z-30 bg-black/80 backdrop-blur-sm p-3 rounded text-xs text-green-400 font-mono border border-green-500/30 max-w-[200px]">
            <p>Status: {playerState.statusMessage}</p>
            <p>Url: {playerState.url ? 'Hidden (Proxy)' : '-'}</p>
          </div>
        )}

        {!playerState.isLoading && !playerState.error && playerState.url && (
          playerState.type === 'hls' ? (
            <div data-vjs-player ref={videoNodeRef} className="w-full h-full" />
          ) : (
            <iframe src={playerState.url} className="w-full h-full" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
          )
        )}
      </div>

      {/* --- SERVER SELECTOR --- */}
      <div className="bg-slate-800 p-4 rounded-b-lg border-t border-slate-700">
        <h3 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2">
          <Settings size={14} /> Pilih Server Streaming
        </h3>
        <div className="flex flex-wrap gap-2">
          {streams.map((stream, idx) => {
            const isActive = activeStreamIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => !playerState.isLoading && setActiveStreamIndex(idx)}
                disabled={playerState.isLoading && isActive}
                className={`relative px-4 py-2.5 rounded-lg text-sm font-semibold transition-all border ${isActive ? 'bg-red-600/10 border-red-500 text-red-500' : 'bg-slate-700/50 border-transparent text-slate-400 hover:bg-slate-700'
                  }`}
              >
                {isActive && <span className="absolute top-1 right-1 flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span></span>}
                {stream.name || `Server ${idx + 1}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* --- [BARU] SCRIPT IKLAN --- */}
      {/* Menggunakan next/script agar loading optimal dan tidak blocking */}
      <Script
        src="https://js.wpadmngr.com/static/adManager.js"
        data-admpid="314095"
        strategy="lazyOnload" // Load setelah halaman interaktif agar video player prioritas utama
      />
    </div>
  );
}