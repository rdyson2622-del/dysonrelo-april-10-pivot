// BroadcastShow — public full-screen broadcast player (no auth required).
// Minimal, single-video implementation. ONE <video> element, ONE play() call.
// No realtime subscriptions, no complex autoplay, no possibility of echo.
import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { X, Loader2, Play, Pause, Volume2, VolumeX } from 'lucide-react';

const GOLD = '#D4AF37';
const DNN_LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/08d73fd44_DNNOPTIONALLOGO.png';
const STUDIO_BG_URL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/5f493d29d_generated_image.png';

function optimizeVideoUrl(url) {
  if (!url || !url.includes('res.cloudinary.com/video/upload/')) return url;
  return url.replace('/video/upload/', '/video/upload/c_scale,w_1280,q_auto,f_auto/');
}

export default function BroadcastShow() {
  const [broadcast, setBroadcast] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const broadcasts = await base44.entities.DnnBroadcast.list('-updated_date', 20);
        const ready = broadcasts.find(b =>
          (b.status === 'ready' || b.status === 'completed') &&
          b.videoUrl &&
          !String(b.videoUrl).startsWith('heygen:pending:')
        );
        if (ready) {
          setBroadcast(ready);
        } else {
          window.location.href = '/dnn-news';
          return;
        }
      } catch (_) {
        window.location.href = '/dnn-news';
        return;
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const videoUrl = broadcast?.videoUrl ? optimizeVideoUrl(broadcast.videoUrl) : null;
  const canPlay = (broadcast?.status === 'ready' || broadcast?.status === 'completed') && videoUrl;

  if (!loaded) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: '#000' }}>
        <div className="w-8 h-8 border-4 border-slate-700 border-t-yellow-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!canPlay) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-4" style={{ background: '#000' }}>
        <img src={DNN_LOGO} alt="DNN" className="h-12 w-auto opacity-80" />
        <p className="text-xs text-slate-500">No broadcast available at this time.</p>
        <button onClick={() => window.location.href = '/'} className="text-xs underline" style={{ color: GOLD }}>
          Return Home
        </button>
      </div>
    );
  }

  return <SimplePlayer key={videoUrl} videoUrl={videoUrl} showName={broadcast?.show_name} />;
}

function SimplePlayer({ videoUrl, showName }) {
  const videoRef = useRef(null);
  const startedRef = useRef(false);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  // Pause on unmount — no ghost audio
  useEffect(() => {
    return () => { try { videoRef.current?.pause(); } catch (_) {} };
  }, []);

  // Autoplay exactly once on mount. Safe: single <video>, strict guard.
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    setStarted(true);
    const t = setTimeout(() => {
      const v = videoRef.current;
      if (!v) return;
      v.muted = false;
      v.play().then(() => {
        setPlaying(true);
        setMuted(false);
      }).catch(() => {
        // Browser blocked unmuted autoplay — fall back to muted
        v.muted = true;
        setMuted(true);
        v.play().then(() => setPlaying(true)).catch(() => {});
      });
    }, 100);
    return () => clearTimeout(t);
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const handleEnded = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    setPlaying(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: '#000', overflow: 'hidden' }}>
      <img src={STUDIO_BG_URL} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ zIndex: 0 }} />

      <button onClick={() => window.location.href = '/'} aria-label="Close"
        className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${GOLD}`, color: GOLD }}>
        <X className="w-6 h-6" />
      </button>

      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg"
        style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(212,175,55,0.4)' }}>
        <img src={DNN_LOGO} alt="DNN" className="h-5 w-auto" />
        <span className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>LIVE</span>
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#ef4444' }} />
      </div>

      {showName && (
        <div className="absolute top-4 right-20 z-20 px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(212,175,55,0.3)' }}>
          <span className="text-[10px] font-black tracking-[0.15em] uppercase" style={{ color: GOLD }}>{showName}</span>
        </div>
      )}

      {/* ONE video element — centered, black-backed, gold-bordered */}
      <div className="absolute overflow-hidden"
        style={{
          width: 'clamp(220px, 30vw, 420px)',
          aspectRatio: '16/9',
          bottom: '10vh',
          left: '50%',
          transform: 'translateX(-50%)',
          borderRadius: '12px',
          border: `2px solid ${GOLD}`,
          boxShadow: '0 14px 40px rgba(0,0,0,0.7)',
          background: '#000',
          zIndex: 10,
        }}>
        {started ? (
          <video
            ref={videoRef}
            src={videoUrl}
            playsInline
            preload="auto"
            loop={false}
            onClick={togglePlay}
            onEnded={handleEnded}
            className="w-full h-full object-cover"
            style={{ transform: 'scale(1.18)' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: '#000' }}>
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: GOLD }} />
          </div>
        )}
      </div>

      {started && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-6 px-6 py-4 z-20"
          style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
          <button onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ color: GOLD }}>
            {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </button>
          <button onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ color: GOLD }}>
            {muted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
        </div>
      )}
    </div>
  );
}