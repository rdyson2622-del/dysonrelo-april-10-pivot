import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { VolumeX, Volume2, Play, Pause } from 'lucide-react';

const GOLD = '#D4AF37';
const DNN_LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/08d73fd44_DNNOPTIONALLOGO.png';

/**
 * LandingBroadcastPlayer — embeds the latest composited DNN broadcast MP4
 * directly into the landing page hero.
 *
 * - Autoplays muted (browser policy compliant)
 * - Small mute/unmute button in corner (not a full-screen overlay)
 * - No pill button — viewer scrolls down to see path selection
 */
export default function LandingBroadcastPlayer({ onEnter }) {
  const videoRef = useRef(null);
  const [broadcast, setBroadcast] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    base44.entities.DnnBroadcast.filter({ status: 'completed' }, '-broadcast_date', 5)
      .then((broadcasts) => {
        const withVideo = broadcasts.find(b => b.videoUrl);
        if (withVideo) setBroadcast(withVideo);
      })
      .catch(() => {});
  }, []);

  // Autoplay muted (browser policy compliant)
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
        setPlaying(false);
      });
    };

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
    return null;
  }

  return (
    <section className="relative h-screen w-full overflow-hidden" style={{ background: '#000' }}>
      {/* Composited broadcast MP4 */}
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

      {/* Mute/unmute button — bottom right, small, non-blocking */}
      <button
        onClick={toggleMute}
        aria-label={muted ? 'Unmute' : 'Mute'}
        className="absolute bottom-6 right-6 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ background: 'rgba(0,0,0,0.7)', border: `1px solid ${GOLD}`, backdropFilter: 'blur(4px)' }}
      >
        {muted
          ? <VolumeX className="w-5 h-5" style={{ color: GOLD }} />
          : <Volume2 className="w-5 h-5" style={{ color: GOLD }} />}
      </button>

      {/* Play/pause button — bottom left, small, non-blocking */}
      <button
        onClick={togglePlay}
        aria-label={playing ? 'Pause' : 'Play'}
        className="absolute bottom-6 left-6 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ background: 'rgba(0,0,0,0.7)', border: `1px solid ${GOLD}`, backdropFilter: 'blur(4px)' }}
      >
        {playing
          ? <Pause className="w-5 h-5" style={{ color: GOLD }} />
          : <Play className="w-5 h-5 ml-0.5" style={{ color: GOLD }} fill={GOLD} />}
      </button>
    </section>
  );
}