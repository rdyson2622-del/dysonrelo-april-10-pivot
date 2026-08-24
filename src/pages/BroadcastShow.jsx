// BroadcastShow — public full-screen broadcast player (no auth required).
// Uses the COMPOSITED studio video (studio bg + whiteboard baked in) and
// plays it full-frame. Single always-mounted <video> element with ref-based
// src — React never touches the src, so no orphan audio / duplicate streams.
import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { X, Loader2, Play, Pause, Volume2, VolumeX } from 'lucide-react';

const GOLD = '#D4AF37';
const DNN_LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/08d73fd44_DNNOPTIONALLOGO.png';

export default function BroadcastShow() {
  const [broadcast, setBroadcast] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const broadcasts = await base44.entities.DnnBroadcast.list('-updated_date', 20);
        const ready = broadcasts.find(b =>
          (b.status === 'ready' || b.status === 'completed') &&
          ((b.compositedVideoUrl && !String(b.compositedVideoUrl).startsWith('creatomate:pending:')) ||
           (b.videoUrl && !String(b.videoUrl).startsWith('heygen:pending:')))
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

  // Prefer composited (studio bg baked in) → full-frame. Fall back to raw.
  const compUrl = broadcast?.compositedVideoUrl;
  const playUrl = (compUrl && !String(compUrl).startsWith('creatomate:pending:'))
    ? compUrl
    : broadcast?.videoUrl;
  const isComposited = !!(compUrl && !String(compUrl).startsWith('creatomate:pending:'));
  const canPlay = (broadcast?.status === 'ready' || broadcast?.status === 'completed') && playUrl;

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

  return <FullFramePlayer key={playUrl} videoUrl={playUrl} showName={broadcast?.show_name} composited={isComposited} />;
}

function FullFramePlayer({ videoUrl, showName, composited }) {
  const videoRef = useRef(null);
  const playInitiatedRef = useRef(false);
  const lockedUrlRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  const activeUrl = lockedUrlRef.current || videoUrl;

  // Set src via ref assignment — NOT via React prop. React can never touch
  // the src, so no reload, no orphan audio, no duplicate stream.
  useEffect(() => {
    if (videoRef.current && activeUrl) {
      videoRef.current.src = activeUrl;
      videoRef.current.load();
    }
  }, [activeUrl]);

  // Pause on unmount — capture element in closure (refs clear before cleanup).
  useEffect(() => {
    if (!started) return;
    const v = videoRef.current;
    return () => { try { v?.pause(); } catch (_) {} };
  }, [started]);

  // Autoplay exactly once.
  useEffect(() => {
    if (playInitiatedRef.current) return;
    const existing = videoRef.current;
    if (existing && !existing.paused && !existing.ended) return;
    // Pause every other <video> on the page (safety net).
    document.querySelectorAll('video').forEach(v => { try { if (!v.paused) v.pause(); } catch (_) {} });
    playInitiatedRef.current = true;
    lockedUrlRef.current = videoUrl;
    setStarted(true);
    const v = videoRef.current;
    if (!v) return;
    v.muted = true; // start muted (autoplay policy), unmute after play confirms
    v.play().then(() => {
      setPlaying(true);
      v.muted = false;
      setMuted(false);
    }).catch(() => {
      v.muted = true;
      setMuted(true);
      v.play().then(() => setPlaying(true)).catch(() => {});
    });
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
      {/* Close */}
      <button onClick={() => window.location.href = '/'} aria-label="Close"
        className="absolute top-4 right-4 z-30 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${GOLD}`, color: GOLD }}>
        <X className="w-6 h-6" />
      </button>

      {/* DNN LIVE bug */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-lg"
        style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(212,175,55,0.4)' }}>
        <img src={DNN_LOGO} alt="DNN" className="h-5 w-auto" />
        <span className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>LIVE</span>
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#ef4444' }} />
      </div>

      {showName && (
        <div className="absolute top-4 right-20 z-30 px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(212,175,55,0.3)' }}>
          <span className="text-[10px] font-black tracking-[0.15em] uppercase" style={{ color: GOLD }}>{showName}</span>
        </div>
      )}

      {/* Single always-mounted <video> — full-frame for composited, centered box for raw.
          src is set via ref, NEVER via React prop, so re-renders can't reload it. */}
      <div className={composited ? "absolute inset-0 z-10" : "absolute overflow-hidden"}
        style={composited
          ? { background: '#000' }
          : {
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
        <video
          ref={videoRef}
          playsInline
          preload="auto"
          loop={false}
          onClick={togglePlay}
          onEnded={handleEnded}
          onPlay={e => { document.querySelectorAll('video').forEach(v => { try { if (v !== e.currentTarget && !v.paused) v.pause(); } catch (_) {} }); }}
          className={`w-full h-full object-contain ${started ? 'opacity-100' : 'opacity-0'}`}
          style={{}}
        />
        {!started && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: '#000' }}>
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: GOLD }} />
          </div>
        )}
      </div>

      {/* Bottom controls */}
      {started && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-6 px-6 py-4 z-30"
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