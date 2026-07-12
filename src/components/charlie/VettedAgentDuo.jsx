import React, { useState, useRef, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { X, Play, RotateCcw, Volume2 } from 'lucide-react';

const GOLD = '#D4AF37';

const CHARLIE_PHOTO = null; // Charlie uses initials
const BOB_PHOTO = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png';

const SPEAKER_LABELS = {
  charlie: 'CHARLIE · DYSON AI CONCIERGE',
  bob: 'BOB DYSON · FOUNDER',
};

const SCRIPTS = [
  {
    speaker: 'charlie',
    text: `Welcome. If you're wondering why agent selection matters so much — let me put it plainly. Bob Dyson has spent 55 years in real estate at the national level. Not just local deals — national. He's seen every market cycle, every agent archetype, and every way a bad match can derail a move. That experience is why we don't just list agents on a directory. We personally vet every single one. Agent selection is the single most important decision in your relocation — more than the house, more than the lender. The right agent protects your time, your money, and your peace of mind. Let me hand this to Bob — he'll explain how our approach works and what it reveals about the agents we choose.`,
  },
  {
    speaker: 'bob',
    text: `Thank you, Charlie. Here's what every prospective bureau agent learns in our discovery process — and it tells us everything about how they think. First: our relocation management costs — the vetting, the coordination, the daily oversight of your move — are funded from the commission that's already built into every real estate transaction. Not a fee on top. Not a markup. The commission exists whether we're involved or not. We simply share in it to fund the management layer that protects you. Now, here's the test. We ask the agent: does it take the same equity — the same time, the same skill, the same effort — to sell a three hundred thousand dollar house as a three million dollar house? The answer is yes. It does. The work is identical. Yet for 75 years, this industry has clung to a percentage-based commission formula that punishes affordability and rewards price-gouging. If an agent can't recognize that — if they're looking at the percentage rather than the qualified lead we're handing them, connected to corporate relocation contacts and a managed pipeline — then they're looking at the wrong formula. The smart agents, the ones who hold their client's experience above all else — they get it immediately. And those are the only agents who make it into our bureau.`,
  },
];

export default function VettedAgentDuo() {
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
  const photo = seg?.speaker === 'bob' ? BOB_PHOTO : CHARLIE_PHOTO;

  /* ── Collapsed: Charlie circle ── */
  if (!open) {
    return (
      <button
        onClick={handleOpen}
        aria-label="Hear Charlie and Bob explain the vetting process"
        className="fixed top-20 right-6 z-40 w-[126px] h-[126px] md:w-36 md:h-36 transition-all hover:scale-105 active:scale-95"
      >
        <span className="absolute inset-0 rounded-full overflow-hidden shadow-xl"
          style={{ background: '#0d0d0d', border: `3px solid ${GOLD}` }}>
          {CHARLIE_PHOTO ? (
            <img src={CHARLIE_PHOTO} alt="Charlie" className="w-full h-full object-cover" />
          ) : (
            <span className="w-full h-full flex items-center justify-center text-4xl">🎩</span>
          )}
        </span>
        <span className="absolute bottom-2 right-2 w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: GOLD, border: '2px solid #0d0d0d' }}>
          <Play className="w-5 h-5 ml-0.5" style={{ color: '#000' }} />
        </span>
        <span className="absolute -top-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-black tracking-widest px-2 py-0.5 rounded-full"
          style={{ background: '#0d0d0d', color: GOLD, border: `1px solid ${GOLD}` }}>
          CHARLIE & BOB
        </span>
      </button>
    );
  }

  /* ── Expanded: duo overlay ── */
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

        {/* Circular avatar */}
        <div className="relative">
          <div
            className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden"
            style={{ border: `4px solid ${GOLD}`, background: '#0d0d0d', boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}
          >
            {photo ? (
              <img src={photo} alt={seg?.speaker} className="w-full h-full object-cover"
                style={{ transform: seg?.speaker === 'bob' ? 'scale(1.25) translateY(8%)' : 'scale(1.35)' }} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">🎩</div>
            )}
          </div>
          {/* Loading / playing indicator */}
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

        {/* Progress dots */}
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