import React from 'react';

const GOLD = '#D4AF37';

/**
 * DnnArticleBroadcastPlayer — no compositing, no autoplay tricks. Just shows
 * each rendered HeyGen clip as a plain video box with native controls.
 */
export default function DnnArticleBroadcastPlayer({ renderClips }) {
  const clips = [
    { key: 'opening', label: 'CHARLIE — OPENING', url: renderClips?.opening?.video_url },
    { key: 'body', label: 'BOB — SEGMENT', url: renderClips?.body?.video_url },
    { key: 'closing', label: 'CHARLIE — CLOSING', url: renderClips?.closing?.video_url },
  ].filter((c) => c.url);

  if (clips.length === 0) return null;

  return (
    <div className="space-y-3">
      {clips.map((clip) => (
        <div key={clip.key} className="rounded-lg overflow-hidden" style={{ border: `2px solid ${GOLD}`, background: '#000' }}>
          <div className="px-3 py-1.5 text-[10px] font-black tracking-widest uppercase" style={{ background: 'rgba(212,175,55,0.15)', color: GOLD }}>
            {clip.label}
          </div>
          <video src={clip.url} controls playsInline className="w-full max-h-[420px] bg-black" />
        </div>
      ))}
    </div>
  );
}