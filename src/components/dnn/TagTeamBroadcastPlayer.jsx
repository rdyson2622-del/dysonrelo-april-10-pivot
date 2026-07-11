import React, { useState, useMemo } from 'react';
import ChromaKeyVideo from '@/components/dnn/ChromaKeyVideo';

const GOLD = '#D4AF37';
const STUDIO_BG = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/5f493d29d_generated_image.png';

// Plays a clip sequence over the full studio background: Charlie appears in a
// bordered box in the lower left; Bob clips appear in a remote-correspondent
// box in the upper right while Charlie holds his last frame.
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
      {/* Studio background — full frame so the national wall map stays visible */}
      <img src={STUDIO_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />

      {/* Charlie — green-screen cutout, lower left, in the room with the map behind him */}
      <div className="absolute" style={{ bottom: '3%', left: '2%', width: '40%' }}>
        <ChromaKeyVideo
          src={charlieUrl}
          className="w-full block"
          onEnded={() => { if (!isBobPhase) advance(); }}
        />
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded"
          style={{ background: 'rgba(0,0,0,0.75)', border: `1px solid rgba(212,175,55,0.5)` }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0" style={{ background: '#ef4444' }} />
          <span className="text-[9px] md:text-[10px] font-black tracking-[0.15em] uppercase" style={{ color: GOLD }}>
            CHARLIE SIMMONS · DNN NEWS DESK
          </span>
        </div>
      </div>

      {/* Bob — remote correspondent box, upper right */}
      {isBobPhase && (
        <div className="absolute dnn-remote-box" style={{ top: '7%', right: '4%', width: '26%' }}>
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