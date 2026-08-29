import React, { useState } from 'react';
import { PlayCircle } from 'lucide-react';

const GOLD = '#D4AF37';
// Same locked, real studio photo backdrop used everywhere else (landing page,
// DnnStudioComposite) — no baked-in AI stock photo of a stranger at a desk.
const STUDIO_BG = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/16260cf0d_generated_image.png';

function Box({ label, videoUrl, active, onEnded, playing }) {
  return (
    <div className="absolute" style={{ bottom: '4%', left: label === 'CHARLIE SIMMONS' ? '3%' : undefined, right: label === 'BOB DYSON' ? '3%' : undefined, width: '19.5%' }}>
      <div className="rounded-lg overflow-hidden" style={{ border: `2px solid ${active ? GOLD : 'rgba(212,175,55,0.4)'}`, boxShadow: '0 10px 40px rgba(0,0,0,0.7)', background: '#000' }}>
        <div className="w-full overflow-hidden" style={{ aspectRatio: '9 / 16', background: '#000' }}>
          {videoUrl ? (
            <video
              key={videoUrl}
              src={videoUrl}
              autoPlay={playing}
              playsInline
              muted={!active}
              onEnded={active ? onEnded : undefined}
              className="w-full h-full block object-cover"
            />
          ) : (
            <div className="w-full h-full" />
          )}
        </div>
        <div className="px-2 py-1" style={{ background: '#0d0d0d', borderTop: '1px solid rgba(212,175,55,0.3)' }}>
          <span className="text-[9px] font-black tracking-[0.15em] uppercase" style={{ color: GOLD }}>{label}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * DnnArticleBroadcastPlayer — plays the 3-clip broadcast (Charlie opens, Bob
 * reports, Charlie closes) over the real studio backdrop with both presenter
 * boxes always visible, matching the locked studio composite look.
 */
export default function DnnArticleBroadcastPlayer({ renderClips }) {
  const [stage, setStage] = useState(null); // null | 'opening' | 'body' | 'closing'
  const opening = renderClips?.opening?.video_url;
  const bodyClip = renderClips?.body?.video_url;
  const closing = renderClips?.closing?.video_url;

  const hasAny = opening || bodyClip || closing;
  if (!hasAny) return null;

  const charlieSrc = stage === 'closing' ? closing : opening;
  const activeSpeaker = stage === 'body' ? 'bob' : (stage ? 'charlie' : null);

  const handleEnded = () => {
    if (stage === 'opening') setStage(bodyClip ? 'body' : (closing ? 'closing' : null));
    else if (stage === 'body') setStage(closing ? 'closing' : null);
    else setStage(null);
  };

  const start = () => setStage(opening ? 'opening' : (bodyClip ? 'body' : 'closing'));

  return (
    <div className="rounded-lg overflow-hidden" style={{ border: '2px solid #4ade80', background: '#000' }}>
      <div className="px-3 py-1.5 text-[10px] font-black tracking-widest uppercase flex items-center justify-between" style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80' }}>
        <span>▶ Finished Broadcast — Studio Preview</span>
        {!stage && (
          <button onClick={start} className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold" style={{ background: GOLD, color: '#000' }}>
            <PlayCircle className="w-3 h-3" /> Play
          </button>
        )}
      </div>
      <div className="relative w-full aspect-video overflow-hidden" style={{ background: '#000' }}>
        <img src={STUDIO_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <Box label="CHARLIE SIMMONS" videoUrl={charlieSrc} active={activeSpeaker === 'charlie'} playing={!!stage} onEnded={handleEnded} />
        <Box label="BOB DYSON" videoUrl={bodyClip} active={activeSpeaker === 'bob'} playing={!!stage} onEnded={handleEnded} />
      </div>
    </div>
  );
}