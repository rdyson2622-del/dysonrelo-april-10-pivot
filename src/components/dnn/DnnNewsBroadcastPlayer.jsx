import React, { useEffect, useRef, useState } from 'react';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

const GOLD = '#D4AF37';

const SPEAKER_LABELS = {
  charlie: 'CHARLIE · DYSON AI CONCIERGE',
  bob: 'BOB DYSON · FOUNDER',
};

/**
 * DnnNewsBroadcastPlayer — a FULL-SCREEN broadcast player.
 *
 * Plays: DNN sting (with sound) → Charlie/Bob news clips → DNN sting (outro).
 * All full screen. No small boxes, no overlapping content.
 *
 * Props:
 *   segments: [{ src, speaker: 'charlie'|'bob' }]
 *   onClose: () => void
 */
export default function DnnNewsBroadcastPlayer({ segments, onClose }) {
  const videoRef = useRef(null);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    setIdx(0);
    setEnded(false);
    setPlaying(true);
    setMuted(false);
    const timer = setTimeout(() => {
      const v = videoRef.current;
      if (!v) return;
      v.muted = true;
      v.play().then(() => {
        setPlaying(true);
        v.muted = false;
        setMuted(false);
      }).catch(() => {
        v.muted = true;
        setMuted(true);
        v.play().then(() => setPlaying(true)).catch(() => {});
      });
    }, 50);
    return () => clearTimeout(timer);
  }, [segments]);

  useEffect(() => {
    // When idx changes, auto-play the next segment
    if (idx === 0) return; // already handled by mount effect
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
    v.currentTime = 0;
    v.play().then(() => setPlaying(true)).catch(() => {
      v.muted = true;
      setMuted(true);
      v.play().then(() => setPlaying(true)).catch(() => {});
    });
  }, [idx]);

  const seg = segments[idx];
  if (!seg) return null;

  const handleEnded = () => {
    if (idx < segments.length - 1) {
      setIdx(i => i + 1);
    } else {
      setEnded(true);
      setPlaying(false);
    }
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); setEnded(false); }
    else { v.pause(); setPlaying(false); }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const replay = () => {
    setIdx(0);
    setEnded(false);
    setTimeout(() => {
      const v = videoRef.current;
      if (v) { v.currentTime = 0; v.muted = false; setMuted(false); v.play().then(() => setPlaying(true)).catch(() => {}); }
    }, 50);
  };

  const isSting = seg.speaker === 'sting';
  const headerLabel = isSting ? 'DNN' : (SPEAKER_LABELS[seg.speaker] || 'DNN');

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: '#000' }}>
      {/* Close button */}
      <button onClick={onClose} aria-label="Close"
        className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${GOLD}`, color: GOLD }}>
        <X className="w-6 h-6" />
      </button>

      {/* Full-screen video — sting is centered; Charlie lower-left, Bob lower-right */}
      <video
        key={seg.src + idx}
        ref={videoRef}
        src={seg.src}
        autoPlay
        playsInline
        onEnded={handleEnded}
        onClick={togglePlay}
        className="cursor-pointer transition-all duration-300"
        style={isSting
          ? { width: '100%', height: '100%', objectFit: 'contain' }
          : {
              width: 'clamp(200px, 28vw, 360px)',
              height: 'auto',
              aspectRatio: '16/9',
              objectFit: 'cover',
              position: 'absolute',
              bottom: '90px',
              left: seg.speaker === 'charlie' ? '24px' : 'auto',
              right: seg.speaker === 'bob' ? '24px' : 'auto',
              borderRadius: '10px',
              border: `2px solid ${GOLD}`,
              boxShadow: '0 12px 36px rgba(0,0,0,0.7)',
            }
        }
      />

      {/* Play overlay when paused/ended */}
      {!playing && (
        <button
          onClick={ended ? replay : togglePlay}
          aria-label={ended ? 'Replay' : 'Play'}
          className="absolute inset-0 flex items-center justify-center transition-all hover:bg-black/20"
        >
          <span className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.65)', border: `2px solid ${GOLD}` }}>
            {ended
              ? <RotateCcw className="w-8 h-8" style={{ color: GOLD }} />
              : <Play className="w-8 h-8 ml-1" style={{ color: GOLD }} fill={GOLD} />}
          </span>
        </button>
      )}

      {/* Tap for sound overlay when muted but playing */}
      {playing && muted && (
        <button
          onClick={toggleMute}
          aria-label="Tap for sound"
          className="absolute inset-0 flex items-center justify-center transition-all hover:bg-black/30"
        >
          <span className="flex flex-col items-center gap-2 px-6 py-4 rounded-lg"
            style={{ background: 'rgba(0,0,0,0.7)', border: `1px solid ${GOLD}` }}>
            <VolumeX className="w-8 h-8" style={{ color: GOLD }} />
            <span className="text-xs font-bold tracking-wider uppercase" style={{ color: GOLD }}>
              Tap for Sound
            </span>
          </span>
        </button>
      )}

      {/* Header badge */}
      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-lg"
        style={{ background: 'rgba(0,0,0,0.65)', border: `1px solid rgba(212,175,55,0.4)`, backdropFilter: 'blur(4px)' }}>
        {!isSting && <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: GOLD }} />}
        <span className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>{headerLabel}</span>
      </div>

      {/* Progress dots */}
      {segments.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2">
          {segments.map((_, i) => (
            <span key={i} className="w-2 h-2 rounded-full transition-all"
              style={{ background: i <= idx ? GOLD : 'rgba(255,255,255,0.25)' }} />
          ))}
        </div>
      )}

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-6 px-6 py-4"
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
        <button onClick={replay} aria-label="Replay"
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ color: GOLD }}>
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}