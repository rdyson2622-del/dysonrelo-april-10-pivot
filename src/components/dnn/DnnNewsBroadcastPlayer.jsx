import React, { useEffect, useRef, useState } from 'react';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import SubscribeCTA from '@/components/dnn/SubscribeCTA';

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
      {/* Background layer — always studio backdrop (except sting) */}
      {isSting ? (
        <div className="absolute inset-0" style={{ zIndex: 0, background: '#000' }} />
      ) : (
        <img src={STUDIO_BG_URL} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ zIndex: 0 }} />
      )}

      {/* Whiteboard overlay on the center studio screen — shown when Bob presents bullet points */}
      {!isSting && hasBullets && (
        <div className="absolute" style={{
          zIndex: 5,
          left: '26%', top: '16%', width: '46%', height: '36%',
          background: '#f5f0e8',
          borderRadius: '6px',
          border: `3px solid ${GOLD}`,
          boxShadow: '0 6px 24px rgba(0,0,0,0.6)',
          padding: '2vh 2vw',
          overflow: 'hidden',
        }}>
          {seg.title && (
            <h2 className="display-heading text-sm md:text-xl lg:text-2xl mb-2 md:mb-3"
              style={{ color: '#1a1a1a', lineHeight: '1.2' }}>
              {seg.title}
            </h2>
          )}
          <ul className="space-y-1.5 md:space-y-2.5">
            {seg.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2 md:gap-2.5">
                <span className="mt-1 md:mt-1.5 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full flex-shrink-0"
                  style={{ background: GOLD }} />
                <span className="text-[10px] md:text-sm lg:text-base"
                  style={{ color: '#2a2a2a', fontWeight: 400, lineHeight: 1.4 }}>
                  {b}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Close button */}
      <button onClick={onClose} aria-label="Close"
        className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${GOLD}`, color: GOLD }}>
        <X className="w-6 h-6" />
      </button>

      {/* Speaker label badge */}
      {!isSting && (
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
      ) : isBob ? (
        /* Bob — lower right, flush against right border with black backdrop */
        <video
          key={seg.src + idx}
          ref={videoRef}
          src={seg.src}
          playsInline
          onEnded={handleEnded}
          onClick={togglePlay}
          className="cursor-pointer transition-all duration-300"
          style={{
            position: 'absolute',
            bottom: '8%',
            right: 0,
            width: 'clamp(110px, 13vw, 170px)',
            height: 'clamp(195px, 27vh, 310px)',
            aspectRatio: '9/16',
            objectFit: 'cover',
            borderRadius: '8px 0 0 8px',
            border: `2px solid ${GOLD}`,
            borderRight: 'none',
            boxShadow: '0 8px 28px rgba(0,0,0,0.8)',
            background: '#000',
            zIndex: 10,
          }}
        />
      ) : (
        /* Charlie — lower left, flush against left border with black backdrop */
        <video
          key={seg.src + idx}
          ref={videoRef}
          src={seg.src}
          playsInline
          onEnded={handleEnded}
          onClick={togglePlay}
          className="cursor-pointer transition-all duration-300"
          style={{
            position: 'absolute',
            bottom: '8%',
            left: 0,
            width: 'clamp(110px, 13vw, 170px)',
            height: 'clamp(195px, 27vh, 310px)',
            aspectRatio: '9/16',
            objectFit: 'cover',
            borderRadius: '0 8px 8px 0',
            border: `2px solid ${GOLD}`,
            borderLeft: 'none',
            boxShadow: '0 8px 28px rgba(0,0,0,0.8)',
            background: '#000',
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

      {/* News pills on the floor area */}
      {!isSting && (
        <div className="absolute left-1/2 -translate-x-1/2 flex gap-2 md:gap-3" style={{ bottom: '12%', zIndex: 8 }}>
          {['MARKET PULSE', 'RATE WATCH', 'MIGRATION DATA', 'HOUSING SUPPLY'].map((label) => (
            <span key={label} className="text-[8px] md:text-[10px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 md:px-3 md:py-1.5 rounded-full whitespace-nowrap"
              style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid rgba(212,175,55,0.3)`, color: 'rgba(212,175,55,0.7)' }}>
              {label}
            </span>
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

      {/* Subscribe CTA — shown when broadcast ends */}
      {ended && (
        <div className="absolute inset-0 z-30 flex items-center justify-center px-6" style={{ background: 'rgba(0,0,0,0.85)' }}>
          <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <SubscribeCTA variant="endcard" />
            <button onClick={replay} className="mx-auto mt-4 flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full"
              style={{ color: GOLD, border: `1px solid ${GOLD}`, background: 'transparent' }}>
              <RotateCcw className="w-3.5 h-3.5" /> Replay Broadcast
            </button>
          </div>
        </div>
      )}
    </div>
  );
}