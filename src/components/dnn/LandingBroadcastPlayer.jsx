import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { VolumeX, Volume2, Play, Pause, ChevronDown } from 'lucide-react';

const GOLD = '#D4AF37';
const DNN_LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/08d73fd44_DNNOPTIONALLOGO.png';

/**
 * LandingBroadcastPlayer — embeds the latest composited DNN broadcast MP4
 * directly into the landing page hero. Handles Safari/Firefox autoplay
 * policies by starting muted and showing a "tap for sound" overlay.
 *
 * The composited MP4 already has both presenter boxes, studio backdrop,
 * nameplates, news pills, intro/outro stings, and new font logos baked in.
 */
export default function LandingBroadcastPlayer({ onEnter }) {
  const videoRef = useRef(null);
  const [broadcast, setBroadcast] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    base44.entities.DnnBroadcast.filter({ status: 'completed' }, '-broadcast_date', 5)
      .then((broadcasts) => {
        const withVideo = broadcasts.find(b => b.videoUrl);
        if (withVideo) setBroadcast(withVideo);
      })
      .catch(() => {});
  }, []);

  // Autoplay muted (Safari/Firefox compliant), then show tap-for-sound
  useEffect(() => {
    if (!broadcast) return;
    const v = videoRef.current;
    if (!v) return;

    v.muted = true;
    v.volume = 1.0;

    const tryPlay = () => {
      v.play().then(() => {
        setPlaying(true);
        setMuted(true);
      }).catch(() => {
        // If muted autoplay fails, try again after user interaction
        setPlaying(false);
      });
    };

    // Small delay to ensure video element is ready
    const timer = setTimeout(tryPlay, 100);
    return () => clearTimeout(timer);
  }, [broadcast]);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted && v.paused) {
      v.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  if (!broadcast) {
    // Fallback: no broadcast available — show static studio background
    return null;
  }

  return (
    <section className="relative h-screen w-full overflow-hidden" style={{ background: '#000' }}>
      {/* Composited broadcast MP4 — both boxes, stings, logos all baked in */}
      <video
        ref={videoRef}
        src={broadcast.videoUrl}
        autoPlay
        muted
        playsInline
        loop
        preload="auto"
        crossOrigin="anonymous"
        className="absolute inset-0 w-full h-full object-cover"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {/* Dark gradient overlay at bottom for text legibility */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 60%, rgba(0,0,0,0.7) 100%)' }} />

      {/* DNN Logo — top left */}
      <div className="absolute top-6 left-6 z-10 flex items-center gap-2 px-3 py-2 rounded-lg"
        style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid rgba(212,175,55,0.4)`, backdropFilter: 'blur(4px)' }}>
        <img src={DNN_LOGO} alt="DNN" className="h-6 w-auto" />
        <span className="text-[9px] font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>LIVE</span>
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#ef4444' }} />
      </div>

      {/* Show title — top right */}
      <div className="absolute top-6 right-6 z-10 px-3 py-2 rounded-lg"
        style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid rgba(212,175,55,0.3)`, backdropFilter: 'blur(4px)' }}>
        <p className="text-[10px] font-black tracking-[0.15em] uppercase" style={{ color: GOLD }}>
          {broadcast.show_name || 'DNN Broadcast'}
        </p>
        <p className="text-[8px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {new Date(broadcast.broadcast_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Tap for sound overlay — Safari/Firefox autoplay compliance */}
      {muted && playing && (
        <button
          onClick={toggleMute}
          className="absolute inset-0 flex items-center justify-center z-20 transition-all"
          style={{ background: 'rgba(0,0,0,0.3)' }}
        >
          <span className="flex flex-col items-center gap-2 px-6 py-4 rounded-lg"
            style={{ background: 'rgba(0,0,0,0.75)', border: `1px solid ${GOLD}` }}>
            <VolumeX className="w-8 h-8" style={{ color: GOLD }} />
            <span className="text-xs font-bold tracking-wider uppercase" style={{ color: GOLD }}>
              Tap for Sound
            </span>
          </span>
        </button>
      )}

      {/* Play/pause toggle when not muted */}
      {!muted && (
        <button
          onClick={togglePlay}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${GOLD}` }}
        >
          {playing
            ? <Pause className="w-5 h-5" style={{ color: GOLD }} />
            : <Play className="w-5 h-5 ml-0.5" style={{ color: GOLD }} fill={GOLD} />}
        </button>
      )}

      {/* Enter Site button — bottom center */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center gap-3 pb-8">
        <button
          onClick={onEnter}
          className="flex items-center gap-2 px-8 py-3 rounded-full text-sm font-black tracking-widest uppercase text-black transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37)', boxShadow: '0 4px 24px rgba(212,175,55,0.4)' }}
        >
          Enter Dyson Relocation
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </button>
        <p className="text-[10px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Real Estate News with Solutions
        </p>
      </div>
    </section>
  );
}