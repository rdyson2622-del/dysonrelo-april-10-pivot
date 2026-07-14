import React, { useEffect, useRef, useState } from 'react';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

const GOLD = '#D4AF37';
const STUDIO_BG_URL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/5f493d29d_generated_image.png';


const SPEAKER_LABELS = {
  charlie: 'CHARLIE · DYSON AI CONCIERGE',
  bob: 'BOB DYSON · FOUNDER',
};

/**
 * DnnNewsBroadcastPlayer — a FULL-SCREEN broadcast player.
 *
 * Plays: DNN sting (with sound) → Charlie/Bob news clips → DNN sting (outro).
 *
 * Background logic:
 *   - Sting: full-screen black (DNN logo video)
 *   - Charlie: studio backdrop (lower-left box)
 *   - Bob: off-white background with bullet-point overlay (lower-right box)
 *
 * Props:
 *   segments: [{ src, speaker: 'charlie'|'bob'|'sting', bullets?: string[], title?: string }]
 *   onClose: () => void
 */
export default function DnnNewsBroadcastPlayer({ segments, onClose }) {
  const videoRef = useRef(null);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [ended, setEnded] = useState(false);

  const segmentsKey = segments.map(s => s.src).join('|');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segmentsKey]);

  useEffect(() => {
    if (idx === 0) return;
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
      setTimeout(() => onClose(), 2500);
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
  const isBob = seg.speaker === 'bob';
  const hasBullets = isBob && Array.isArray(seg.bullets) && seg.bullets.length > 0;
  const headerLabel = isSting ? 'DNN' : (SPEAKER_LABELS[seg.speaker] || 'DNN');

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: '#000', overflow: 'hidden' }}>
      {/* Background layer */}
      {isSting ? (
        <div className="absolute inset-0" style={{ zIndex: 0, background: '#000' }} />
      ) : hasBullets ? (
        /* Off-white presentation background with bullet-point overlay */
        <div className="absolute inset-0" style={{ zIndex: 0, background: '#f5f0e8' }}>
          {/* Bullet-point content panel — left side, Bob is lower-right */}
          <div className="absolute inset-0 flex flex-col justify-start px-[8vw] md:px-[10vw] pt-[6vh] md:pt-[8vh] pb-[20vh]">
            {seg.title && (
              <h2 className="display-heading text-xl md:text-3xl lg:text-4xl mb-4 md:mb-6"
                style={{ color: '#1a1a1a', lineHeight: '1.2' }}>
                {seg.title}
              </h2>
            )}
            <ul className="space-y-3 md:space-y-5">
              {seg.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3 md:gap-4">
                  <span className="mt-1.5 md:mt-2 w-2 h-2 md:w-2.5 md:h-2.5 rounded-full flex-shrink-0"
                    style={{ background: GOLD }} />
                  <span className="text-sm md:text-lg lg:text-xl"
                    style={{ color: '#2a2a2a', fontWeight: 400, lineHeight: 1.5 }}>
                    {b}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {/* Subtle DNN watermark */}
          <div className="absolute top-6 left-6 md:top-8 md:left-10">
            <span className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase"
              style={{ color: 'rgba(212,175,55,0.5)' }}>
              DNN Intelligence Bureau
            </span>
          </div>
        </div>
      ) : (
        /* Studio backdrop for Charlie (and Bob without bullets) */
        <img src={STUDIO_BG_URL} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ zIndex: 0 }} />
      )}

      {/* Close button */}
      <button onClick={onClose} aria-label="Close"
        className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${GOLD}`, color: GOLD }}>
        <X className="w-6 h-6" />
      </button>

      {/* Speaker label badge — only on studio background, not on the off-white bullet view */}
      {!isSting && !hasBullets && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{
            background: 'rgba(0,0,0,0.65)',
            border: '1px solid rgba(212,175,55,0.4)',
            backdropFilter: 'blur(4px)'
          }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: GOLD }} />
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase"
            style={{ color: GOLD }}>
            {headerLabel}
          </span>
        </div>
      )}

      {/* Video element */}
      {isSting ? (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden" style={{ zIndex: 10, background: '#000' }}>
          <video
            key={seg.src + idx}
            ref={videoRef}
            src={seg.src}
            playsInline
            onEnded={handleEnded}
            onClick={togglePlay}
            className="cursor-pointer w-full h-full"
            style={{ objectFit: 'cover', transform: 'translate(-0.5%, 10%)' }}
          />
        </div>
      ) : (
        <video
          key={seg.src + idx}
          ref={videoRef}
          src={seg.src}
          playsInline
          onEnded={handleEnded}
          onClick={togglePlay}
          className="cursor-pointer transition-all duration-300"
          style={{
            width: 'clamp(200px, 28vw, 360px)',
            height: 'auto',
            aspectRatio: '16/9',
            objectFit: 'cover',
            position: 'absolute',
            bottom: '8px',
            left: seg.speaker === 'charlie' ? '4px' : 'auto',
            right: seg.speaker === 'bob' ? '4px' : 'auto',
            borderRadius: '10px',
            border: `2px solid ${GOLD}`,
            boxShadow: '0 12px 36px rgba(0,0,0,0.7)',
            zIndex: 10,
          }}
        />
      )}

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