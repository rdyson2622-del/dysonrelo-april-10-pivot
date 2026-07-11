import React, { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Play, Pause, Volume2, VolumeX, RotateCcw, X } from 'lucide-react';

const GOLD = '#D4AF37';

/**
 * CharliePagePresenter — Shard2 in-app presentation layer.
 *
 * Floats a small Charlie Simmons video box in the upper-right corner of a
 * client-facing explainer page. Loads the CharliePageExplainer record for the
 * given pageKey and plays its finalVideoUrl when the render is completed.
 * Falls back to a clean "overview coming soon" card otherwise.
 *
 * Usage: <CharliePagePresenter pageKey="relocation-services" />
 */
export default function CharliePagePresenter({ pageKey }) {
  const [explainer, setExplainer] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [dismissed, setDismissed] = useState(false);
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

  if (!loaded || dismissed) return null;

  // Per-page placement + size, driven by the explainer record (adjustable per page in Shard 2)
  const posClasses = {
    upper_right: 'top-44 right-3 md:top-52 md:right-5',
    upper_left: 'top-44 left-3 md:top-52 md:left-5',
    lower_right: 'bottom-6 right-3 md:bottom-8 md:right-5',
    lower_left: 'bottom-6 left-3 md:bottom-8 md:left-5',
  }[explainer?.charliePosition || 'upper_right'];

  // Prefer the Charlie-only presenter clip; the composed full-screen video
  // (finalVideoUrl) is a demo/render artifact and is NOT shown in the widget.
  const presenterSrc = explainer?.renderStatus === 'completed' ? explainer?.presenterVideoUrl : null;
  const hasVideo = Boolean(presenterSrc);

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

  return (
    <div
      className={`fixed z-40 ${posClasses} w-[160px] sm:w-[190px] md:w-[220px]`}
      style={{ maxWidth: 'calc(100vw - 2rem)' }}
    >
      <div
        className="rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#0d0d0d', border: '1px solid rgba(212,175,55,0.4)' }}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-3 py-1.5"
          style={{ background: 'rgba(212,175,55,0.12)', borderBottom: '1px solid rgba(212,175,55,0.25)' }}>
          <p className="text-[9px] font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>
            Charlie · Page Overview
          </p>
          <button onClick={() => setDismissed(true)} aria-label="Close Charlie overview"
            className="p-0.5 hover:opacity-70" style={{ color: GOLD }}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {hasVideo ? (
          <div className="relative">
            <video
              ref={videoRef}
              src={presenterSrc}
              preload="auto"
              muted
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