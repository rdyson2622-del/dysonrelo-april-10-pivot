import React, { useState, useMemo } from 'react';

const GOLD = '#D4AF37';

// Plays a clip sequence: Charlie clips full-screen; Bob clips appear in a
// remote-correspondent box in the upper right while Charlie holds his last frame.
export default function TagTeamBroadcastPlayer({ clips, onEnded }) {
  const [phase, setPhase] = useState(0);
  const current = clips[phase];

  // The Charlie video shown full-screen: current clip if Charlie, otherwise the last Charlie clip
  const charlieUrl = useMemo(() => {
    for (let i = phase; i >= 0; i--) {
      if (clips[i].role === 'charlie') return clips[i].videoUrl;
    }
    return clips.find(c => c.role === 'charlie')?.videoUrl;
  }, [phase, clips]);

  const advance = () => {
    if (phase + 1 < clips.length) setPhase(phase + 1);
    else onEnded?.();
  };

  const isBobPhase = current?.role === 'bob';

  return (
    <div className="relative w-full h-full">
      {/* Charlie — full frame. Holds his last frame while Bob reports. */}
      <video
        key={charlieUrl}
        src={charlieUrl}
        autoPlay
        playsInline
        className="w-full h-full object-contain"
        onEnded={() => { if (!isBobPhase) advance(); }}
      />

      {/* Bob — remote correspondent box, upper right */}
      {isBobPhase && (
        <div className="absolute dnn-remote-box" style={{ top: '7%', right: '4%', width: '20%' }}>
          <div className="rounded-lg overflow-hidden"
            style={{ border: `2px solid ${GOLD}`, boxShadow: '0 8px 40px rgba(0,0,0,0.7), 0 0 24px rgba(212,175,55,0.35)', background: '#000' }}>
            <video
              src={current.videoUrl}
              autoPlay
              playsInline
              className="w-full block"
              onEnded={advance}
            />
            <div className="px-2 py-1 flex items-center gap-1.5"
              style={{ background: 'linear-gradient(135deg, #1a1a1a, #000)', borderTop: `1px solid rgba(212,175,55,0.5)` }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0" style={{ background: '#ef4444' }} />
              <span className="text-[9px] md:text-[10px] font-black tracking-[0.15em] uppercase truncate" style={{ color: GOLD }}>
                BOB DYSON · REPORTING
              </span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes dnnRemoteIn {
          0% { opacity: 0; transform: scale(0.7); }
          100% { opacity: 1; transform: scale(1); }
        }
        .dnn-remote-box { animation: dnnRemoteIn 0.35s ease-out; transform-origin: top right; }
      `}</style>
    </div>
  );
}