import React, { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Play, Pause, Volume2, VolumeX, RotateCcw, X } from 'lucide-react';

const GOLD = '#D4AF37';

/**
 * CharliePagePresenter — Shard2 in-app presentation layer.
 *
 * Collapsed: a small Charlie pill pinned near the top of the page — no page
 * content needs to move. Clicking it expands into the video box and Charlie
 * begins speaking (unmuted, since it's a user gesture).
 *
 * Built as a single self-contained widget so the one-way video can later be
 * swapped for a live voice-to-voice session without touching any page.
 *
 * Usage: <CharliePagePresenter pageKey="relocation-services" />
 */
export default function CharliePagePresenter({ pageKey, topOffsetClass, inline = false }) {
  const [explainer, setExplainer] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [ended, setEnded] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    base44.entities.CharliePageExplainer.filter({ pageKey })
      .then((arr) => {
        if (!cancelled) setExplainer(arr?.[0] || null);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoaded(true); });
    return () => { cancelled = true; };
  }, [pageKey]);

  if (!loaded) return null;

  // Prefer the Charlie-only presenter clip; the composed full-screen video
  // (finalVideoUrl) is a demo/render artifact and is NOT shown in the widget.
  const presenterSrc = explainer?.renderStatus === 'completed' ? explainer?.presenterVideoUrl : null;
  const hasVideo = Boolean(presenterSrc);

  const openAndSpeak = () => {
    setExpanded(true);
    setEnded(false);
    // Start speaking on the click gesture — unmuted playback is allowed here
    setTimeout(() => {
      const v = videoRef.current;
      if (v) {
        v.muted = false;
        setMuted(false);
        v.play().then(() => setPlaying(true)).catch(() => {});
      }
    }, 50);
  };

  const collapse = () => {
    const v = videoRef.current;
    if (v) v.pause();
    setPlaying(false);
    setExpanded(false);
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
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play();
    setPlaying(true);
    setEnded(false);
  };

  const ControlBtn = ({ onClick, children, label }) => (
    <button
      onClick={onClick}
      aria-label={label}
      className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
      style={{ background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(212,175,55,0.4)', color: GOLD }}
    >
      {children}
    </button>
  );

  /* ── Collapsed: round Charlie headshot in the upper right — never covers page copy ── */
  if (!expanded) {
    return (
      <button
        onClick={openAndSpeak}
        aria-label="Hear Charlie explain this page"
        className={`${inline ? 'absolute' : 'fixed'} z-40 ${topOffsetClass || 'top-16 md:top-[4.5rem]'} right-3 md:right-5 w-[126px] h-[126px] md:w-36 md:h-36 transition-all hover:scale-105 active:scale-95`}
      >
        <span className="absolute inset-0 rounded-full overflow-hidden shadow-xl"
          style={{ background: '#0d0d0d', border: `3px solid ${GOLD}` }}>
          {explainer?.thumbnailUrl ? (
            <img
              src={explainer.thumbnailUrl}
              alt="Charlie — Dyson AI Concierge"
              className="w-full h-full object-cover pointer-events-none"
            />
          ) : hasVideo ? (
            <video
              src={presenterSrc}
              muted
              playsInline
              preload="auto"
              onLoadedMetadata={(e) => { e.target.currentTime = 1.5; }}
              onLoadedData={(e) => { if (e.target.currentTime < 1) e.target.currentTime = 1.5; }}
              className="w-full h-full object-cover pointer-events-none"
            />
          ) : (
            <span className="w-full h-full flex items-center justify-center text-4xl">🎩</span>
          )}
        </span>
        {/* Play badge */}
        <span className="absolute bottom-2 right-2 w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: GOLD, border: '2px solid #0d0d0d' }}>
          <Play className="w-5 h-5 ml-0.5" style={{ color: '#000' }} />
        </span>
      </button>
    );
  }

  /* ── Expanded: centered frosted-glass stage over the blurred page ── */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Frozen-glass backdrop — the page stays visible but blurred behind Charlie */}
      <div
        className="absolute inset-0"
        onClick={collapse}
        style={{
          background: 'rgba(10,10,10,0.35)',
          backdropFilter: 'blur(18px) saturate(140%)',
          WebkitBackdropFilter: 'blur(18px) saturate(140%)',
        }}
      />
      <div
        className="relative w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: 'rgba(20,20,20,0.55)',
          backdropFilter: 'blur(30px) saturate(160%)',
          WebkitBackdropFilter: 'blur(30px) saturate(160%)',
          border: '1px solid rgba(255,255,255,0.18)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
        }}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-2.5"
          style={{ background: 'rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
          <p className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>
            Charlie · Page Overview
          </p>
          <button onClick={collapse} aria-label="Minimize Charlie overview"
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
            style={{ color: GOLD }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {hasVideo ? (
          <div className="relative">
            <video
              ref={videoRef}
              src={presenterSrc}
              preload="auto"
              playsInline
              onEnded={() => { setPlaying(false); setEnded(true); }}
              className="w-full block aspect-video object-cover cursor-pointer"
              onClick={togglePlay}
            />
            {/* Big play overlay when not playing */}
            {!playing && (
              <button
                onClick={ended ? replay : togglePlay}
                aria-label="Play Charlie overview"
                className="absolute inset-0 flex items-center justify-center transition-all hover:bg-black/20"
              >
                <span className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.6)', border: `2px solid ${GOLD}` }}>
                  {ended
                    ? <RotateCcw className="w-5 h-5" style={{ color: GOLD }} />
                    : <Play className="w-5 h-5 ml-0.5" style={{ color: GOLD }} />}
                </span>
              </button>
            )}
            {/* Controls */}
            <div className="absolute bottom-2 right-2 flex gap-1.5">
              <ControlBtn onClick={togglePlay} label={playing ? 'Pause' : 'Play'}>
                {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </ControlBtn>
              <ControlBtn onClick={toggleMute} label={muted ? 'Unmute' : 'Mute'}>
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </ControlBtn>
              <ControlBtn onClick={replay} label="Replay">
                <RotateCcw className="w-4 h-4" />
              </ControlBtn>
            </div>
          </div>
        ) : (
          /* Fallback: no completed video yet */
          <div className="px-4 py-5 flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
              style={{ background: 'rgba(212,175,55,0.15)', border: `1px solid ${GOLD}` }}>
              🎩
            </div>
            <p className="text-xs font-bold text-white">Charlie overview coming soon</p>
            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
              A short video walkthrough of this page is on its way.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}