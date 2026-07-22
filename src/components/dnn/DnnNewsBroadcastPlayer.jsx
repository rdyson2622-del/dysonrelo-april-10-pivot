import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import SubscribeCTA from '@/components/dnn/SubscribeCTA';

const GOLD = '#D4AF37';
const STUDIO_BG_URL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/027a3b3fc_DNN.png';
const DNN_POSTER = "https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/fe0a2ddb0_dnn_studio_1200x627.png";

const SPEAKER_LABELS = {
  charlie: 'CHARLIE · DYSON AI CONCIERGE',
  bob: 'BOB DYSON · FOUNDER'
};

/**
 * DnnNewsBroadcastPlayer — a FULL-SCREEN broadcast player.
 *
 * Plays through the segment array EXACTLY ONCE, then hard-redirects to /?choose=1.
 * No looping. No reset-to-zero. The terminal clip triggers a raw browser escape hatch.
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
  { word: 'Intelligence', dest: '/real-estate-answers', sub: 'Tell Your Story' }];


  const videoRef = useRef(null);
  const terminatedRef = useRef(false);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  const segmentsKey = segments.map((s) => s.src).join('|');

  // Initial playback kick — runs once per segment set. Does NOT reset on idx changes.
  useEffect(() => {
    setIdx(0);
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

  // NOTE: No useEffect on [idx]. Segment advancement is driven solely by the
  // native onEnded handler below + onCanPlay auto-play. This eliminates the
  // state race where an effect re-triggered play() after onEnded bumped idx.

  const seg = segments[idx];
  if (!seg) return null;

  // ── HARD TERMINAL EXIT ──
  // No complex state logic. No reset to zero. Raw, un-interceptable browser redirect.
  const handleEnded = () => {
    if (terminatedRef.current) return;
    const nextIndex = idx + 1;
    if (nextIndex < segments.length) {
      setIdx(nextIndex);
      return;
    }
    console.log("Terminal clip reached. Executing hard exit.");
    terminatedRef.current = true;
    window.location.replace('/?choose=1');
    return;
  };

  // ── RUNTIME DURATION TRACKER + DEFENSIVE ESCAPE HATCH ──
  // Logs currentTime/duration on every tick. The escape hatch fires ONLY on the
  // absolute final segment — middle clips advance to the next index naturally.
  const handleTimeUpdate = (e) => {
    const v = e.currentTarget;
    if (!v || !v.duration || isNaN(v.duration) || terminatedRef.current) return;
    const isLastSegment = idx === segments.length - 1;
    console.log(`[DNN PLAYER] clip ${idx}/${segments.length - 1} | currentTime=${v.currentTime.toFixed(2)}s duration=${v.duration.toFixed(2)}s | ${(v.currentTime / v.duration * 100).toFixed(1)}%${isLastSegment ? ' [FINAL]' : ''}`);
    if (isLastSegment && v.currentTime >= v.duration - 0.3) {
      console.log("Defensive duration escape hatch triggered on FINAL clip. Executing hard exit.");
      terminatedRef.current = true;
      window.location.replace('/?choose=1');
    }
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {v.play();setPlaying(true);} else
    {v.pause();setPlaying(false);}
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const replay = () => {
    if (terminatedRef.current) return;
    setIdx(0);
    setTimeout(() => {
      const v = videoRef.current;
      if (v) {v.currentTime = 0;v.muted = false;setMuted(false);v.play().then(() => setPlaying(true)).catch(() => {});}
    }, 50);
  };

  // Find the last video src for a given speaker (for still-shot display when not active)
  const lastSrcFor = (speaker) => {
    for (let i = idx; i >= 0; i--) {
      if (segments[i]?.speaker === speaker) return segments[i].src;
    }
    return segments.find((s) => s?.speaker === speaker)?.src;
  };

  const isSting = seg.speaker === 'sting';
  const isBob = seg.speaker === 'bob';
  const hasBullets = isBob && Array.isArray(seg.bullets) && seg.bullets.length > 0;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: '#000', overflow: 'hidden' }}>
      {/* Background layer */}
      {isSting ?
      <div className="absolute inset-0" style={{ zIndex: 0, background: '#000' }} /> :
      hasBullets ? (
      /* Studio backdrop with bordered Solution Panel inside the monitor screen */
      <>
          <img src={STUDIO_BG_URL} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ zIndex: 0 }} />
          <div
          className="absolute flex flex-col items-center justify-center text-center"
          style={{
            top: '8%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'min(52vw, 640px)',
            zIndex: 5,
            padding: 'clamp(12px, 2.2vh, 22px) clamp(14px, 2.2vw, 28px)'
          }}>
          
            {seg.title &&
          <h2 className="serif-heading mb-2 md:mb-3"
          style={{ color: '#ffffff', lineHeight: '1.15', fontSize: 'clamp(1.3rem, 3.2vh, 2rem)', textAlign: 'center', WebkitTextStroke: '1.5px #ffffff', textShadow: '0 0 6px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.9), -1px -1px 2px rgba(0,0,0,0.9), 1px 1px 2px rgba(0,0,0,0.9)' }}>
                {seg.title}
              </h2>
          }
            <ul className="space-y-2.5 md:space-y-4 flex-1 flex flex-col items-center">
              {seg.bullets.map((b, i) =>
            <li key={i} className="flex items-start gap-2 md:gap-2.5 justify-center">
                  <span className="mt-1.5 md:mt-2 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full flex-shrink-0"
              style={{ background: '#ffffff', boxShadow: '0 0 4px rgba(0,0,0,0.9)' }} />
                  <span
                style={{ color: '#ffffff', fontWeight: 500, lineHeight: 1.45, fontSize: 'clamp(1rem, 2.4vh, 1.5rem)', textAlign: 'center', WebkitTextStroke: '1px #ffffff', textShadow: '0 0 6px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.9), -1px -1px 2px rgba(0,0,0,0.9), 1px 1px 2px rgba(0,0,0,0.9)' }}>
                    {b}
                  </span>
                </li>
            )}
            </ul>
          </div>
        </>) : (

      /* Studio backdrop for Charlie (and Bob without bullets) */
      <img src={STUDIO_BG_URL} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ zIndex: 0 }} />)
      }

      {/* Close button */}
      <button onClick={onClose} aria-label="Close"
      className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
      style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${GOLD}`, color: GOLD }}>
        <X className="w-6 h-6" />
      </button>

      {/* Video element */}
      {isSting ?
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden" style={{ zIndex: 10, background: '#000' }}>
          <video
          key={seg.src + idx}
          ref={videoRef}
          src={seg.src}
          poster={DNN_POSTER}
          playsInline
          onEnded={handleEnded}
          onTimeUpdate={handleTimeUpdate}
          onCanPlay={(e) => {e.currentTarget.muted = muted;e.currentTarget.play().then(() => setPlaying(true)).catch(() => {e.currentTarget.muted = true;setMuted(true);e.currentTarget.play().then(() => setPlaying(true)).catch(() => {});});}}
          onClick={togglePlay}
          className="cursor-pointer w-full h-full"
          style={{ objectFit: 'cover', transform: 'translate(-0.5%, 10%)' }} />
        
        </div> :

      <>
          {/* The clip is cropped to the face and blended into the matching photo placeholder. */}
          <div
          className="absolute overflow-hidden"
          style={seg.speaker === 'charlie' ? {
            left: '11.2%',
            top: '32%',
            width: '5.8%',
            height: '10.8%',
            zIndex: 10,
            clipPath: 'ellipse(43% 48% at 50% 50%)'
          } : {
            left: '77.2%',
            top: '26.8%',
            width: '5.5%',
            height: '10.5%',
            zIndex: 10,
            clipPath: 'ellipse(43% 48% at 50% 50%)'
          }}>
          
            <video
            key={seg.src + idx}
            ref={videoRef}
            src={seg.src}
            playsInline
            onEnded={handleEnded}
            onTimeUpdate={handleTimeUpdate}
            onCanPlay={(e) => {e.currentTarget.muted = muted;e.currentTarget.play().then(() => setPlaying(true)).catch(() => {e.currentTarget.muted = true;setMuted(true);e.currentTarget.play().then(() => setPlaying(true)).catch(() => {});});}}
            onClick={togglePlay}
            className="cursor-pointer w-full h-full rounded-[10px_4px_4px_12px]"
            style={{
              objectFit: 'cover',
              objectPosition: seg.speaker === 'charlie' ? '50% 18%' : '72% 20%',
              transform: 'scale(3)',
              transformOrigin: seg.speaker === 'charlie' ? '50% 20%' : '72% 20%'
            }} />
          
          </div>

          {/* Center floor pills — same styling as the landing page */}
          <div className="absolute left-0 right-0 flex items-center justify-center gap-4 md:gap-8 px-6"
        style={{ bottom: '120px', zIndex: 9 }}>
            {FLOOR_PILLS.map((pill) =>
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
              paddingRight: '1rem'
            }}>
            
                <span
              className="uppercase whitespace-nowrap"
              style={{
                color: '#d4b46a',
                fontFamily: 'Cormorant Garamond, serif',
                fontWeight: 500,
                letterSpacing: pill.word.length > 10 ? '0.1em' : '0.2em',
                fontSize: pill.word.length > 10 ? 'clamp(0.75rem, 1.8vw, 0.9rem)' : pill.word.length > 6 ? 'clamp(0.9rem, 2.2vw, 1.05rem)' : 'clamp(1.1rem, 2.6vw, 1.25rem)'
              }}>
              
                  {pill.word}
                </span>
                <span
              className="text-[7px] tracking-[0.2em] uppercase mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity"
              style={{ color: '#d4b46a' }}>
              
                  {pill.sub}
                </span>
              </button>
          )}
          </div>
        </>
      }

      {/* Poster + CTA overlay — shown before first play */}
      {!playing && idx === 0 &&
      <button
        onClick={togglePlay}
        aria-label="Click to watch the live show"
        className="absolute inset-0 z-15 flex flex-col items-center justify-center transition-all"
        style={{ background: '#000' }}>
        
          <img src={DNN_POSTER} alt="DNN Intelligence Bureau" className="absolute inset-0 w-full h-full object-cover opacity-60" />
          <div className="relative z-10 flex flex-col items-center gap-4">
            <span className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.65)', border: `2px solid ${GOLD}` }}>
              <Play className="w-8 h-8 ml-1" style={{ color: GOLD }} fill={GOLD} />
            </span>
            <span className="text-sm md:text-base font-black tracking-[0.2em] uppercase px-5 py-2 rounded-full"
          style={{ color: GOLD, border: `1px solid ${GOLD}`, background: 'rgba(0,0,0,0.6)' }}>
              Click to the Live Show
            </span>
          </div>
        </button>
      }

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
      {!playing && terminatedRef.current === false && segments.length === 0 &&
      <div className="absolute inset-0 z-30 flex items-center justify-center px-6" style={{ background: 'rgba(0,0,0,0.85)' }}>
          <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <SubscribeCTA variant="endcard" />
            <button onClick={replay} className="mx-auto mt-4 flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full"
          style={{ color: GOLD, border: `1px solid ${GOLD}`, background: 'transparent' }}>
              <RotateCcw className="w-3.5 h-3.5" /> Replay Broadcast
            </button>
          </div>
        </div>
      }
    </div>);

}