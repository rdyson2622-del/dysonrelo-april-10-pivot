import React, { useEffect, useRef, useState } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Loader2 } from 'lucide-react';

const GOLD = '#D4AF37';
const STUDIO_BG_URL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/5f493d29d_generated_image.png';
const DNN_LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/08d73fd44_DNNOPTIONALLOGO.png';


const SPEAKER_LABELS = {
  charlie: 'CHARLIE · DYSON AI CONCIERGE',
  bob: 'BOB DYSON · FOUNDER',
};

/**
 * DnnNewsBroadcastPlayer — a FULL-SCREEN broadcast player.
 *
 * Two modes:
 *
 * 1. Single-video mode (n8n pipeline): pass `videoUrl` + `status`.
 *    - status === 'processing' → clean "Processing Broadcast in Background..." indicator
 *    - status === 'ready'      → single HTML5 <video> tag with the final 1080p MP4
 *
 * 2. Segment mode (legacy tag-team): pass `segments` (unchanged behavior).
 *    Plays: DNN sting (with sound) → Charlie/Bob news clips → DNN sting (outro).
 *
 * Props:
 *   videoUrl?: string                 — final MP4 URL (single-video mode)
 *   status?: 'processing' | 'ready'   — broadcast lifecycle (single-video mode)
 *   segments?: [{ src, speaker, bullets?, title? }]  — legacy segment mode
 *   onClose: () => void
 */
export default function DnnNewsBroadcastPlayer({ segments, onClose, videoUrl, status }) {
  const singleVideoMode = Boolean(videoUrl || status);

  // --- Single-video mode (n8n pipeline) ---
  if (singleVideoMode) {
    return (
      <SingleVideoPlayer
        videoUrl={videoUrl}
        status={status}
        onClose={onClose}
      />
    );
  }

  // --- Legacy segment mode (unchanged) ---
  return (
    <SegmentPlayer segments={segments} onClose={onClose} />
  );
}

// ---------------------------------------------------------------------------
// SingleVideoPlayer — n8n pipeline output
// ---------------------------------------------------------------------------
function SingleVideoPlayer({ videoUrl, status, onClose }) {
  const videoRef = useRef(null);
  const playPromiseRef = useRef(null);
  const hasPlayedRef = useRef(false); // strict mount-once guard
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true); // muted-first for browser autoplay policy

  const isProcessing = status === 'processing' && !videoUrl;
  const canPlay = Boolean(videoUrl) && status !== 'processing';

  // Ensure audio stops on unmount — no ghost audio after navigating away
  useEffect(() => {
    return () => {
      try { videoRef.current?.pause(); } catch (_) {}
      hasPlayedRef.current = false;
    };
  }, []);

  // AUTOPLAY — called exactly ONCE per mount. The parent uses key={videoUrl}
  // so any URL change fully remounts this component (old <video> unmounts →
  // audio stops, fresh hasPlayedRef starts false). No realtime subscription
  // re-triggers this effect. No racing play() promises. No echo.
  useEffect(() => {
    if (!canPlay) return;
    if (hasPlayedRef.current) return; // strict: play only once per mount
    hasPlayedRef.current = true;

    const v = videoRef.current;
    if (!v) return;

    // Start fresh — reset play promise and seek to beginning
    playPromiseRef.current = null;
    v.currentTime = 0;

    // Try UNMUTED autoplay first — the user already interacted by clicking
    // "Preview Studio Show", so the browser allows audio. Only fall back to
    // muted if the browser blocks it (rare on user-initiated opens).
    v.muted = false;
    const p = v.play();
    if (p) {
      playPromiseRef.current = p;
      // Optimistically set playing=true so the bottom controls show a Pause
      // button immediately — not a Play button while the video auto-plays.
      setPlaying(true);
      setMuted(false);
      p.then(() => {
        playPromiseRef.current = null;
        setPlaying(true);
        setMuted(false);
      }).catch(() => {
        // Unmuted autoplay blocked — fall back to muted + "Tap for Sound"
        playPromiseRef.current = null;
        v.muted = true;
        setMuted(true);
        const p2 = v.play();
        if (p2) {
          playPromiseRef.current = p2;
          p2.then(() => { playPromiseRef.current = null; setPlaying(true); })
            .catch(() => { playPromiseRef.current = null; setPlaying(false); });
        }
      });
    }
  }, [canPlay, videoUrl]);

  const safePlay = () => {
    const v = videoRef.current;
    if (!v || playPromiseRef.current) return; // never stack play() calls
    const p = v.play();
    if (p) {
      playPromiseRef.current = p;
      p.then(() => { playPromiseRef.current = null; setPlaying(true); })
       .catch(() => { playPromiseRef.current = null; });
    }
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { safePlay(); }
    else { v.pause(); setPlaying(false); }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  // Hard stop on end — never loop, never restart
  const handleEnded = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    setPlaying(false);
  };

  // Processing indicator
  if (isProcessing) {
    return (
      <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6"
        style={{ background: '#000', overflow: 'hidden' }}>
        <button onClick={onClose} aria-label="Close"
          className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${GOLD}`, color: GOLD }}>
          <X className="w-6 h-6" />
        </button>

        <img src={STUDIO_BG_URL} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="relative z-10 flex flex-col items-center gap-5 px-6 text-center">
          <img src={DNN_LOGO} alt="DNN" className="h-14 w-auto opacity-90" />
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin" style={{ color: GOLD }} />
            <p className="text-sm font-bold tracking-[0.25em] uppercase" style={{ color: GOLD }}>
              Processing Broadcast in Background...
            </p>
          </div>
          <p className="text-xs text-slate-500 max-w-md leading-relaxed">
            The DNN studio is rendering your daily broadcast. This will update
            automatically the moment the video is ready.
          </p>
        </div>
      </div>
    );
  }

  if (!canPlay) {
    return (
      <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-4" style={{ background: '#000' }}>
        <button onClick={onClose} aria-label="Close"
          className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${GOLD}`, color: GOLD }}>
          <X className="w-6 h-6" />
        </button>
        <img src={DNN_LOGO} alt="DNN" className="h-12 w-auto opacity-80" />
        <p className="text-xs text-slate-500">No broadcast available at this time.</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: '#000', overflow: 'hidden' }}>
      {/* Studio background — composited in-browser per design plan */}
      <img src={STUDIO_BG_URL} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ zIndex: 0 }} />

      {/* Close button */}
      <button onClick={onClose} aria-label="Close"
        className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${GOLD}`, color: GOLD }}>
        <X className="w-6 h-6" />
      </button>

      {/* DNN LIVE bug */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg"
        style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(212,175,55,0.4)' }}>
        <img src={DNN_LOGO} alt="DNN" className="h-5 w-auto" />
        <span className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>LIVE</span>
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#ef4444' }} />
      </div>

      {/* Avatar video in a black-backed framed box over the studio set.
          Black background covers the lime-green chroma-key areas per design rule. */}
      <div
        className="absolute overflow-hidden"
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
        }}
      >
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
      </div>

      {/* Tap for sound overlay when muted but playing */}
      {playing && muted && (
        <button
          onClick={toggleMute}
          aria-label="Tap for sound"
          className="absolute inset-0 flex items-center justify-center transition-all hover:bg-black/30"
          style={{ zIndex: 15 }}
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
    </div>
  );
}

// ---------------------------------------------------------------------------
// SegmentPlayer — legacy tag-team mode (unchanged behavior)
// ---------------------------------------------------------------------------
function SegmentPlayer({ segments, onClose }) {
  const videoRef = useRef(null);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [bulletPage, setBulletPage] = useState(0);

  const segmentsKey = segments.map(s => s.src).join('|');
  useEffect(() => {
    setIdx(0);
    setEnded(false);
    setBulletPage(0);
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
    setBulletPage(0);
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

  const isSting = seg.speaker === 'sting';
  const isBob = seg.speaker === 'bob';
  const hasBullets = isBob && Array.isArray(seg.bullets) && seg.bullets.length > 0;
  const bulletsPerPage = 5;
  const bulletPageCount = hasBullets ? Math.ceil(seg.bullets.length / bulletsPerPage) : 1;
  const visibleBullets = hasBullets
    ? seg.bullets.slice(bulletPage * bulletsPerPage, (bulletPage + 1) * bulletsPerPage)
    : [];
  const previousCharlie = isBob
    ? [...segments.slice(0, idx)].reverse().find(segment => segment.speaker === 'charlie')
    : null;
  const headerLabel = isSting ? 'DNN' : (SPEAKER_LABELS[seg.speaker] || 'DNN');

  const handleTimeUpdate = (event) => {
    if (!hasBullets || bulletPageCount <= 1) return;
    const { currentTime, duration } = event.currentTarget;
    if (!duration) return;
    setBulletPage(Math.min(bulletPageCount - 1, Math.floor((currentTime / duration) * bulletPageCount)));
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: '#000', overflow: 'hidden' }}>
      {/* Background layer */}
      {isSting ? (
        <div className="absolute inset-0" style={{ zIndex: 0, background: '#000' }} />
      ) : (
        <>
          <img src={STUDIO_BG_URL} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ zIndex: 0 }} />
          {hasBullets && (
            <div className="absolute left-[3vw] top-[14vh] z-[5] w-[58vw] max-w-2xl max-h-[58vh] translate-x-[27%] overflow-y-auto rounded-xl p-4 md:p-6"
              style={{ background: '#f5f0e8', border: `3px solid ${GOLD}`, boxShadow: '0 14px 40px rgba(0,0,0,0.55)' }}>
              <p className="mb-2 text-[9px] md:text-[11px] font-bold tracking-[0.25em] uppercase"
                style={{ color: GOLD }}>DNN Intelligence Bureau</p>
              {seg.title && (
                <h2 className="display-heading text-sm md:text-xl lg:text-2xl mb-3 md:mb-4"
                  style={{ color: '#1a1a1a', lineHeight: 1.15 }}>
                  {seg.title}
                </h2>
              )}
              <ul className="space-y-2 md:space-y-3">
                {visibleBullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 md:gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full flex-shrink-0"
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
        </>
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

      {/* Keep Charlie visible while Bob is speaking */}
      {previousCharlie && (
        <div
          className="absolute overflow-hidden"
          style={{
            width: 'clamp(200px, 28vw, 360px)',
            aspectRatio: '16/9',
            bottom: '8px',
            left: '4px',
            borderRadius: '10px',
            border: `2px solid ${GOLD}`,
            boxShadow: '0 12px 36px rgba(0,0,0,0.7)',
            background: '#000',
            zIndex: 10,
          }}
        >
          <video
            src={previousCharlie.src}
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
            style={{ transform: 'scale(1.18)' }}
          />
        </div>
      )}

      {/* Active video element */}
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
        <div
          className="absolute cursor-pointer overflow-hidden"
          onClick={togglePlay}
          style={{
            width: 'clamp(200px, 28vw, 360px)',
            aspectRatio: '16/9',
            bottom: '8px',
            left: seg.speaker === 'charlie' ? '4px' : 'auto',
            right: seg.speaker === 'bob' ? '4px' : 'auto',
            borderRadius: '10px',
            border: `2px solid ${GOLD}`,
            boxShadow: '0 12px 36px rgba(0,0,0,0.7)',
            background: '#000',
            zIndex: 10,
          }}
        >
          <video
            key={seg.src + idx}
            ref={videoRef}
            src={seg.src}
            playsInline
            onEnded={handleEnded}
            onTimeUpdate={handleTimeUpdate}
            className="w-full h-full object-cover transition-all duration-300"
            style={{ transform: 'scale(1.18)' }}
          />
        </div>
      )}

      {/* Play overlay when paused */}
      {!playing && !ended && (
        <button
          onClick={togglePlay}
          aria-label="Play"
          className="absolute inset-0 flex items-center justify-center transition-all hover:bg-black/20"
        >
          <span className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.65)', border: `2px solid ${GOLD}` }}>
            <Play className="w-8 h-8 ml-1" style={{ color: GOLD }} fill={GOLD} />
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
      </div>
    </div>
  );
}