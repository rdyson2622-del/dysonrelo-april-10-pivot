import React, { useEffect, useRef, useState } from 'react';
import { X, RotateCcw, Play } from 'lucide-react';

const GOLD = '#D4AF37';

const SPEAKER_LABELS = {
  charlie: 'CHARLIE · DYSON AI CONCIERGE',
  bob: 'BOB DYSON · FOUNDER',
};

/**
 * QADuoPresenter — frosted-glass overlay that plays a sequence of clips in a
 * circular "talk box", switching between Charlie and Bob as speakers change.
 *
 * Props:
 *   segments: [{ src, speaker: 'charlie'|'bob' }]
 *   onClose: () => void
 */
export default function QADuoPresenter({ segments, onClose }) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Frosted backdrop */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        style={{
          background: 'rgba(10,10,10,0.35)',
          backdropFilter: 'blur(18px) saturate(140%)',
          WebkitBackdropFilter: 'blur(18px) saturate(140%)',
        }}
      />
      <div
        className="relative rounded-3xl px-8 pt-4 pb-6 flex flex-col items-center"
        style={{
          background: 'rgba(20,20,20,0.55)',
          backdropFilter: 'blur(30px) saturate(160%)',
          WebkitBackdropFilter: 'blur(30px) saturate(160%)',
          border: '1px solid rgba(255,255,255,0.18)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="self-end -mr-4 w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
          style={{ color: GOLD }}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Circular talk box — switches between Charlie and Bob */}
        <div className="relative">
          <div
            className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden"
            style={{ border: `4px solid ${GOLD}`, background: '#0d0d0d', boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}
          >
            <video
              key={seg.src}
              ref={videoRef}
              src={seg.src}
              autoPlay
              playsInline
              onEnded={handleEnded}
              className="w-full h-full object-cover"
              style={{ transform: 'scale(1.35)' }}
            />
          </div>
          {ended && (
            <button
              onClick={replay}
              aria-label="Replay"
              className="absolute inset-0 rounded-full flex items-center justify-center transition-all hover:bg-black/30"
            >
              <span className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.65)', border: `2px solid ${GOLD}` }}>
                <RotateCcw className="w-6 h-6" style={{ color: GOLD }} />
              </span>
            </button>
          )}
        </div>

        {/* Speaker label */}
        <p className="mt-4 text-[11px] font-black tracking-[0.25em] uppercase" style={{ color: GOLD }}>
          {SPEAKER_LABELS[seg.speaker] || ''}
        </p>
        {segments.length > 1 && (
          <div className="flex gap-1.5 mt-3">
            {segments.map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full"
                style={{ background: i <= idx ? GOLD : 'rgba(255,255,255,0.25)' }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}