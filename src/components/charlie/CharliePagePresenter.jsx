import React, { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Play, Pause, Volume2, VolumeX, RotateCcw, X, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { CHARLIE_PAGE_EXPLAINER_SCRIPTS } from '@/lib/charliePageExplainerScripts';

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
export default function CharliePagePresenter({ pageKey, topOffsetClass, inline = false, positionClass }) {
  const [explainer, setExplainer] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [ended, setEnded] = useState(false);
  const videoRef = useRef(null);

  const staticFallback = CHARLIE_PAGE_EXPLAINER_SCRIPTS[pageKey] || null;

  useEffect(() => {
    let cancelled = false;
    base44.entities.CharliePageExplainer.filter({ pageKey })
      .then((arr) => {
        if (!cancelled) {
          const completedWithVideo = arr?.find(a => a.renderStatus === 'completed' && a.presenterVideoUrl);
          const withScript = arr?.find(a => a.finalScript);
          setExplainer(completedWithVideo || withScript || arr?.[0] || null);
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoaded(true); });
    return () => { cancelled = true; };
  }, [pageKey]);

  if (!loaded) return null;

  const activeScript = explainer?.finalScript || staticFallback?.finalScript || null;
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
        className={`${inline ? 'absolute' : 'fixed'} z-40 ${positionClass || `${topOffsetClass || 'top-32 md:top-36'} right-3 md:right-5`} w-[126px] h-[126px] md:w-36 md:h-36 transition-all hover:scale-105 active:scale-95`}
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
            <span className="w-full h-full flex items-center justify-center">
              <Play className="w-8 h-8" style={{ color: GOLD }} />
            </span>
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

  /* ── Expanded: rectangular video box pinned upper-right, page stays visible ── */
  return (
    <div className="fixed top-32 right-4 md:top-36 md:right-6 z-50">
      <div
        className="relative rounded-xl overflow-hidden transition-all duration-200"
        style={{
          width: hasVideo ? 150 : (activeScript ? 280 : 160),
          background: '#1a1a1a',
          border: `2px solid ${GOLD}`,
          boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-3 py-2"
          style={{ background: '#262626', borderBottom: '1px solid rgba(212,175,55,0.25)' }}>
          <p className="text-[9px] font-black tracking-[0.15em] uppercase truncate" style={{ color: GOLD }}>
            Charlie · Page Overview
          </p>
          <button onClick={collapse} aria-label="Minimize Charlie overview"
            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
            style={{ color: GOLD }}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {hasVideo ? (
          <>
            <div className="relative" style={{ height: 170, background: '#0d0d0d' }}>
              <video
                ref={videoRef}
                src={presenterSrc}
                preload="auto"
                playsInline
                onEnded={() => { setPlaying(false); setEnded(true); }}
                onClick={togglePlay}
                className="w-full h-full object-cover cursor-pointer"
              />
              {/* Big play overlay when not playing */}
              {!playing && (
                <button
                  onClick={ended ? replay : togglePlay}
                  aria-label={ended ? 'Replay' : 'Play'}
                  className="absolute inset-0 flex items-center justify-center transition-all hover:bg-black/20"
                >
                  <span className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.65)', border: `2px solid ${GOLD}` }}>
                    {ended
                      ? <RotateCcw className="w-5 h-5" style={{ color: GOLD }} />
                      : <Play className="w-5 h-5 ml-0.5" style={{ color: GOLD }} />}
                  </span>
                </button>
              )}
            </div>
            {/* Footer controls bar */}
            <div className="flex items-center justify-center gap-3 px-3 py-2"
              style={{ background: '#262626', borderTop: '1px solid rgba(212,175,55,0.15)' }}>
              <button onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ color: GOLD }}>
                {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <button onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ color: GOLD }}>
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button onClick={replay} aria-label="Replay"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ color: GOLD }}>
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          /* Fallback: approved script text view if video not yet rendered */
          <div className="p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'rgba(212,175,55,0.15)', border: `1px solid ${GOLD}` }}>
                <FileText className="w-3.5 h-3.5" style={{ color: GOLD }} />
              </div>
              <div className="leading-tight">
                <span className="text-[8.5px] font-black uppercase tracking-wider text-[#D4AF37] block">
                  Approved Script
                </span>
                <span className="text-xs font-bold text-white block">
                  {explainer?.pageTitle || staticFallback?.pageTitle || 'Charlie Explainer'}
                </span>
              </div>
            </div>

            {activeScript ? (
              <div 
                className="p-2.5 rounded-lg bg-black/60 border border-white/10 text-[11px] text-white/80 leading-relaxed max-h-48 overflow-y-auto"
                style={{ scrollbarWidth: 'thin' }}
              >
                {activeScript}
              </div>
            ) : (
              <p className="text-[10px] text-white/60 text-center py-2">
                A short video walkthrough of this page is on its way.
              </p>
            )}

            <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[9px] text-white/40">
              <span>Status: Video queued</span>
              <span className="text-[#D4AF37] font-semibold">Script Ready</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}