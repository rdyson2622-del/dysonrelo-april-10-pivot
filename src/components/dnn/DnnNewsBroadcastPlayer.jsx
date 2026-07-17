import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const FLOOR_PILLS = [
    { word: 'News', dest: '/dnn-news?autoplay=1', sub: "Today's Clips" },
    { word: 'Relocation', dest: '/relo-management', sub: 'Free Access' },
    { word: 'Intelligence', dest: '/real-estate-answers', sub: 'Tell Your Story' },
  ];
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
      setPlaying(false);
      onClose();
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

  // Find the last video src for a given speaker (for still-shot display when not active)
  const lastSrcFor = (speaker) => {
    for (let i = idx; i >= 0; i--) {
      if (segments[i]?.speaker === speaker) return segments[i].src;
    }
    return segments.find(s => s?.speaker === speaker)?.src;
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
        /* Studio backdrop with bordered Solution Panel inside the monitor screen */
        <>
          <img src={STUDIO_BG_URL} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ zIndex: 0 }} />
          <div
            className="absolute flex flex-col overflow-hidden"
            style={{
              top: '8%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'min(52vw, 640px)',
              minHeight: '52vh',
              maxHeight: '60vh',
              zIndex: 5,
              background: '#ffffff',
              border: `2px solid ${GOLD}`,
              borderRadius: '14px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
              padding: 'clamp(12px, 2.2vh, 22px) clamp(14px, 2.2vw, 28px)',
            }}
          >
            {seg.title && (
              <h2 className="serif-heading mb-2 md:mb-3"
                style={{ color: '#1a1a1a', lineHeight: '1.15', fontSize: 'clamp(1.3rem, 3.2vh, 2rem)' }}>
                {seg.title}
              </h2>
            )}
            <ul className="space-y-2.5 md:space-y-4 flex-1">
              {seg.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2 md:gap-2.5">
                  <span className="mt-1.5 md:mt-2 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full flex-shrink-0"
                    style={{ background: GOLD }} />
                  <span
                    style={{ color: '#2a2a2a', fontWeight: 400, lineHeight: 1.45, fontSize: 'clamp(1rem, 2.4vh, 1.5rem)' }}>
                    {b}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
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
        <>
          {/* Charlie — bottom-left, always structurally visible (vertical) */}
          <div
            className="absolute transition-all duration-300"
            style={{
              bottom: '24px',
              left: '32px',
              width: 'clamp(104px, 14.3vw, 182px)',
              aspectRatio: '3 / 4',
              borderRadius: '10px',
              border: `2px solid ${GOLD}`,
              boxShadow: '0 12px 36px rgba(0,0,0,0.7)',
              background: '#000',
              overflow: 'hidden',
              zIndex: 10,
              opacity: 1,
            }}
          >
            {seg.speaker === 'charlie' ? (
              <video
                key={seg.src + idx}
                ref={videoRef}
                src={seg.src}
                playsInline
                onEnded={handleEnded}
                onClick={togglePlay}
                className="cursor-pointer w-full h-full"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <video
                src={lastSrcFor('charlie')}
                muted
                playsInline
                preload="metadata"
                onLoadedMetadata={(e) => { e.target.currentTime = 1; e.target.pause(); }}
                className="w-full h-full"
                style={{ objectFit: 'cover' }}
              />
            )}
            {/* Charlie label bar */}
            <div className="absolute bottom-0 left-0 right-0 px-2 py-1 flex items-center gap-1.5"
              style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.9))' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0" style={{ background: '#ef4444' }} />
              <span className="text-[9px] md:text-[10px] font-black tracking-[0.15em] uppercase truncate" style={{ color: GOLD }}>
                CHARLIE · DYSON AI CONCIERGE
              </span>
            </div>
          </div>

          {/* Bob — bottom-right, always structurally visible (vertical) */}
          <div
            className="absolute transition-all duration-300"
            style={{
              bottom: '24px',
              right: '32px',
              width: 'clamp(104px, 14.3vw, 182px)',
              aspectRatio: '3 / 4',
              borderRadius: '10px',
              border: `2px solid ${GOLD}`,
              boxShadow: '0 12px 36px rgba(0,0,0,0.7)',
              background: '#000',
              overflow: 'hidden',
              zIndex: 10,
              opacity: 1,
            }}
          >
            {seg.speaker === 'bob' ? (
              <video
                key={seg.src + idx}
                ref={videoRef}
                src={seg.src}
                playsInline
                onEnded={handleEnded}
                onClick={togglePlay}
                className="cursor-pointer w-full h-full"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <video
                src={lastSrcFor('bob')}
                muted
                playsInline
                preload="metadata"
                onLoadedMetadata={(e) => { e.target.currentTime = 1; e.target.pause(); }}
                className="w-full h-full"
                style={{ objectFit: 'cover' }}
              />
            )}
            {/* Bob label bar */}
            <div className="absolute bottom-0 left-0 right-0 px-2 py-1 flex items-center gap-1.5"
              style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.9))' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0" style={{ background: '#ef4444' }} />
              <span className="text-[9px] md:text-[10px] font-black tracking-[0.15em] uppercase truncate" style={{ color: GOLD }}>
                BOB DYSON · FOUNDER
              </span>
            </div>
          </div>

          {/* Center floor pills — same styling as the landing page */}
          <div className="absolute left-0 right-0 flex items-center justify-center gap-4 md:gap-8 px-6"
            style={{ bottom: '120px', zIndex: 9 }}>
            {FLOOR_PILLS.map((pill) => (
              <button
                key={pill.word}
                onClick={() => navigate(pill.dest)}
                className="flex flex-col items-center justify-center px-4 md:px-6 py-2 rounded-full transition-all duration-300 ease-out hover:-translate-y-1 hover:opacity-90 cursor-pointer group"
                style={{
                  background: 'linear-gradient(135deg, rgba(212,180,106,0.12) 0%, rgba(212,180,106,0.04) 100%)',
                  border: '1px solid rgba(212,180,106,0.45)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
                  minWidth: '7rem',
                  maxWidth: '11rem',
                  height: '3rem',
                  paddingLeft: '1rem',
                  paddingRight: '1rem',
                }}
              >
                <span
                  className="uppercase whitespace-nowrap"
                  style={{
                    color: '#d4b46a',
                    fontFamily: 'Cormorant Garamond, serif',
                    fontWeight: 500,
                    letterSpacing: pill.word.length > 10 ? '0.1em' : '0.2em',
                    fontSize: pill.word.length > 10 ? 'clamp(0.75rem, 1.8vw, 0.9rem)' : pill.word.length > 6 ? 'clamp(0.9rem, 2.2vw, 1.05rem)' : 'clamp(1.1rem, 2.6vw, 1.25rem)',
                  }}
                >
                  {pill.word}
                </span>
                <span
                  className="text-[7px] tracking-[0.2em] uppercase mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{ color: '#d4b46a' }}
                >
                  {pill.sub}
                </span>
              </button>
            ))}
          </div>
        </>
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