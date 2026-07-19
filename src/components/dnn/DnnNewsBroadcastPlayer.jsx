import React, { useEffect, useRef, useState } from 'react';
import { X, Play, Pause, Volume2, VolumeX } from 'lucide-react';

const GOLD = '#D4AF37';
const DNN_POSTER = "https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/fe0a2ddb0_dnn_studio_1200x627.png";

/**
 * DnnNewsBroadcastPlayer — SINGLE-SCENE broadcast player.
 *
 * Plays exactly ONE master MP4 from start to finish, then hard-redirects to /?choose=1.
 * No segments. No handoffs. No multi-presenter layering. One video in, one video out.
 *
 * Props:
 *   videoUrl: string  — permanent URL of the master broadcast MP4
 *   title?: string    — optional show title for overlay
 *   onClose: () => void
 */
export default function DnnNewsBroadcastPlayer({ videoUrl, title, onClose }) {
  const videoRef = useRef(null);
  const terminatedRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  // Initial playback kick — runs once per video URL.
  useEffect(() => {
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
    }, 150);
    return () => clearTimeout(timer);
  }, [videoUrl]);

  if (!videoUrl) return null;

  // ── HARD TERMINAL EXIT ──
  const handleEnded = () => {
    if (terminatedRef.current) return;
    console.log("Broadcast complete. Executing hard exit.");
    terminatedRef.current = true;
    window.location.replace('/?choose=1');
  };

  // ── DEFENSIVE ESCAPE HATCH ──
  const handleTimeUpdate = (e) => {
    const v = e.currentTarget;
    if (!v) return;
    const duration = v.duration;
    const currentTime = v.currentTime;
    if (!duration || isNaN(duration) || terminatedRef.current) return;
    if (currentTime >= duration - 0.3) {
      console.log("Defensive escape hatch triggered. Executing hard exit.");
      terminatedRef.current = true;
      window.location.replace('/?choose=1');
    }
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const newMuted = !v.muted;
    v.muted = newMuted;
    setMuted(newMuted);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: '#000', overflow: 'hidden' }}>
      {/* Close button */}
      <button onClick={onClose} aria-label="Close"
        className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${GOLD}`, color: GOLD }}>
        <X className="w-6 h-6" />
      </button>

      {/* Optional title overlay */}
      {title && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 px-5 py-2 rounded-full"
          style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid rgba(212,175,55,0.4)` }}>
          <span className="text-xs md:text-sm font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>
            {title}
          </span>
        </div>
      )}

      {/* Single master video — fills the frame */}
      <video
        ref={videoRef}
        src={videoUrl}
        poster={DNN_POSTER}
        playsInline
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
        className="w-full h-full cursor-pointer"
        style={{ objectFit: 'contain' }}
      />

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
      </div>
    </div>
  );
}