import React, { useEffect, useRef, useState } from 'react';
import { X, RotateCcw } from 'lucide-react';

const GOLD = '#D4AF37';

/**
 * InlineCharliePlayer — a small, non-blocking talking-head box that stays
 * pinned in the top-right corner. The page beneath remains fully visible
 * and scrollable. Plays through segments sequentially.
 *
 * Props:
 *   segments: [{ src, speaker }]
 *   onClose: () => void
 */
export default function InlineCharliePlayer({ segments, onClose }) {
  const [idx, setIdx] = useState(0);
  const [ended, setEnded] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    setIdx(0);
    setEnded(false);
  }, [segments]);

  const seg = segments[idx];
  if (!seg) return null;

  const handleEnded = () => {
    if (idx < segments.length - 1) {
      setIdx(i => i + 1);
    } else {
      setEnded(true);
    }
  };

  const replay = () => {
    setIdx(0);
    setEnded(false);
  };

  return (
    <div className="fixed top-32 right-6 z-50">
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          width: 180,
          height: 240,
          background: '#0d0d0d',
          border: `3px solid ${GOLD}`,
          boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-1.5 right-1.5 z-10 w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/15 transition-colors"
          style={{ background: 'rgba(0,0,0,0.6)', color: GOLD }}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Video */}
        <video
          key={seg.src}
          ref={videoRef}
          src={seg.src}
          autoPlay
          playsInline
          onEnded={handleEnded}
          className="w-full h-full object-cover"
        />

        {/* Replay overlay */}
        {ended && (
          <button
            onClick={replay}
            aria-label="Replay"
            className="absolute inset-0 flex items-center justify-center transition-all hover:bg-black/30"
          >
            <span className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.65)', border: `2px solid ${GOLD}` }}>
              <RotateCcw className="w-5 h-5" style={{ color: GOLD }} />
            </span>
          </button>
        )}

        {/* Label bar */}
        <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 flex items-center justify-between"
          style={{ background: 'rgba(0,0,0,0.75)' }}>
          <span className="text-[8px] font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>
            CHARLIE
          </span>
          {segments.length > 1 && (
            <div className="flex gap-1">
              {segments.map((_, i) => (
                <span key={i} className="w-1 h-1 rounded-full"
                  style={{ background: i <= idx ? GOLD : 'rgba(255,255,255,0.25)' }} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}