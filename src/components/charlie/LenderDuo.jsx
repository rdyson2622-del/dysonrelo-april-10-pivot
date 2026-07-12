import React, { useState, useRef, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { X, Play, RotateCcw, Volume2 } from 'lucide-react';

const GOLD = '#D4AF37';

const CHARLIE_PHOTO = null;

const SPEAKER_LABELS = {
  charlie: 'CHARLIE · DYSON AI CONCIERGE',
};

const SCRIPTS = [
  {
    speaker: 'charlie',
    text: `When it comes to choosing a lender, there's more to it than just finding the lowest rate. Bob Dyson has guided families through every lending scenario imaginable over his 55-year career — and he knows that the type of lender you choose can shape your entire loan experience. Let me walk you through the two lending configurations you'll encounter, and why we stay involved in the selection process.`,
  },
  {
    speaker: 'charlie',
    text: `Basically, in the lending process you have two different lending configurations. The first is proprietary lenders — these are lenders that only sell their own mortgage products. That limits your selection of loans, types of loans, and various other options. There's usually no wiggle room in pricing or lending fees either. Now, if you are in private backing at a large bank, your weight could change things — but for most buyers, a proprietary lender narrows your choices. That's why we always shop the market. And to best do that, we recommend a loan brokerage — a brokerage that offers and processes loans for various third-party lenders. That really opens up so many ways to select a loan that best works for you and your situation. As part of our services, we stay involved in the selection process and vet the lenders based on not only the loan itself, but their service history and knowledge of specific communities and loan products. It's an art, if you do it right!`,
  },
  {
    speaker: 'charlie',
    text: `And that's exactly why every lender on this page has been through our 5-step vetting process. Bob's team doesn't just check rates — they evaluate service history, community knowledge, and relocation fit. When you choose a DNN-vetted lender, you're getting the benefit of that artistry. If you have any questions about which lending configuration is right for your move, just ask — I'm here to help.`,
  },
];

export default function LenderDuo() {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ended, setEnded] = useState(false);
  const audioRef = useRef(null);

  const playSegment = useCallback(async (segmentIdx) => {
    const seg = SCRIPTS[segmentIdx];
    if (!seg) { setEnded(true); setPlaying(false); return; }
    setLoading(true);
    setPlaying(true);
    setEnded(false);
    try {
      const res = await base44.functions.invoke('charlieSpeak', { text: seg.text });
      const { audio, mimeType } = res?.data || {};
      if (audio && audioRef.current) {
        const binary = atob(audio);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const blob = new Blob([bytes], { type: mimeType || 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        audioRef.current.src = url;
        audioRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.error('TTS error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setIdx(0);
    setEnded(false);
    setTimeout(() => playSegment(0), 200);
  };

  const handleAudioEnded = () => {
    if (idx < SCRIPTS.length - 1) {
      const next = idx + 1;
      setIdx(next);
      playSegment(next);
    } else {
      setEnded(true);
      setPlaying(false);
    }
  };

  const replay = () => {
    setIdx(0);
    setEnded(false);
    playSegment(0);
  };

  const seg = SCRIPTS[idx];

  if (!open) {
    return (
      <button
        onClick={handleOpen}
        aria-label="Hear Charlie and Bob explain the lending process"
        className="fixed bottom-6 right-6 z-40 w-[126px] h-[126px] md:w-36 md:h-36 transition-all hover:scale-105 active:scale-95"
      >
        <span className="absolute inset-0 rounded-full overflow-hidden shadow-xl"
          style={{ background: '#0d0d0d', border: `3px solid ${GOLD}` }}>
          <span className="w-full h-full flex items-center justify-center text-4xl">🎩</span>
        </span>
        <span className="absolute bottom-2 right-2 w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: GOLD, border: '2px solid #0d0d0d' }}>
          <Play className="w-5 h-5 ml-0.5" style={{ color: '#000' }} />
        </span>
        <span className="absolute -top-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-black tracking-widest px-2 py-0.5 rounded-full"
          style={{ background: '#0d0d0d', color: GOLD, border: `1px solid ${GOLD}` }}>
          MEET CHARLIE
        </span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0"
        onClick={() => { setOpen(false); setPlaying(false); if (audioRef.current) audioRef.current.pause(); }}
        style={{ background: 'rgba(10,10,10,0.35)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)' }}
      />
      <div
        className="relative rounded-3xl px-8 pt-4 pb-6 flex flex-col items-center"
        style={{
          background: 'rgba(20,20,20,0.55)',
          backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255,255,255,0.18)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        }}
      >
        <button
          onClick={() => { setOpen(false); setPlaying(false); if (audioRef.current) audioRef.current.pause(); }}
          aria-label="Close"
          className="self-end -mr-4 w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
          style={{ color: GOLD }}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative">
          <div
            className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden"
            style={{ border: `4px solid ${GOLD}`, background: '#0d0d0d', boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}
          >
            <div className="w-full h-full flex items-center justify-center text-6xl">🎩</div>
          </div>
          {(loading || playing) && (
            <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center animate-pulse"
              style={{ background: 'rgba(0,0,0,0.7)', border: `2px solid ${GOLD}` }}>
              <Volume2 className="w-5 h-5" style={{ color: GOLD }} />
            </div>
          )}
          {ended && (
            <button onClick={replay} aria-label="Replay"
              className="absolute inset-0 rounded-full flex items-center justify-center transition-all hover:bg-black/30">
              <span className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.65)', border: `2px solid ${GOLD}` }}>
                <RotateCcw className="w-6 h-6" style={{ color: GOLD }} />
              </span>
            </button>
          )}
        </div>

        <p className="mt-4 text-[11px] font-black tracking-[0.25em] uppercase" style={{ color: GOLD }}>
          {SPEAKER_LABELS[seg?.speaker] || ''}
        </p>

        <div className="flex gap-1.5 mt-3">
          {SCRIPTS.map((_, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full"
              style={{ background: i <= idx ? GOLD : 'rgba(255,255,255,0.25)' }} />
          ))}
        </div>

        <audio ref={audioRef} onEnded={handleAudioEnded} />
      </div>
    </div>
  );
}