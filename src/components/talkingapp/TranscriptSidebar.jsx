import React, { useEffect, useRef } from 'react';

const GOLD = '#D4AF37';

export default function TranscriptSidebar({ transcript, currentSpeaker }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript.length]);

  return (
    <aside className="w-80 shrink-0 flex flex-col h-full" style={{ background: '#111', borderRight: '1px solid rgba(212,175,55,0.2)' }}>
      <div className="px-4 py-3 shrink-0" style={{ borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
        <p className="text-xs font-black tracking-[0.25em] uppercase" style={{ color: GOLD }}>Live Transcript</p>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {transcript.length === 0 ? (
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Your conversation text will appear here as you speak.
          </p>
        ) : (
          transcript.map((entry, i) => (
            <div key={i}>
              <p className="text-[10px] font-black tracking-widest uppercase mb-0.5"
                style={{ color: entry.role === 'user' ? GOLD : 'rgba(255,255,255,0.5)' }}>
                {entry.role === 'user' ? 'You' : entry.role === 'assistant' ? 'Assistant' : 'System'}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: entry.role === 'system' ? 'rgba(255,255,255,0.4)' : '#fff' }}>
                {entry.text}
              </p>
            </div>
          ))
        )}
        {currentSpeaker && (
          <p className="text-xs italic" style={{ color: GOLD }}>
            {currentSpeaker === 'assistant' ? 'Assistant is speaking…' : 'Listening…'}
          </p>
        )}
        <div ref={bottomRef} />
      </div>
    </aside>
  );
}