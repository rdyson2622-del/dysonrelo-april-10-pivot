import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Square, Loader2, Volume2, Compass, AlertCircle } from 'lucide-react';
import { GeminiLiveSessionClient } from '@/lib/geminiLiveClient';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';

const CHARLIE_CONCIERGE_PROMPT = `You are Charlie, the distinguished American male AI voice concierge for Dyson & Dyson Companies real estate relocation.
You speak with a natural, warm, mature American accent. Do NOT use British pronunciation, British phrases, or British idioms.

CRITICAL CONVERSATIONAL RULES:
1. NO RAMBLING: Keep every answer EXTREMELY concise — strictly 1 to 2 short sentences (under 30 words maximum). Get straight to the point.
2. ALLOW INTERRUPTION: Stop speaking instantly whenever the visitor speaks.
3. DIRECT THE VIEWER TO THE PAGE: Never let the visitor hunt and peck. When they ask about a service or subject, tell them in 1 sentence that you are taking them there and call navigateToPage or append [NAVIGATE: /path | Page Title].

DIRECTORIES:
- Finding / hiring a vetted agent: [NAVIGATE: /find-agent | Find a Vetted Agent]
- Relocation planning / moving intake: [NAVIGATE: /relocation-intake | Relocation Plan & Intake]
- Questions, issues, advice, or custom roadmap: [NAVIGATE: /solutions | Real Estate Solutions]
- Corporate relocation / HR services: [NAVIGATE: /corporate-relo | Corporate Relocation]
- Daily real estate news & broadcasts: [NAVIGATE: /dnn-news | DNN Daily News]
- Real estate transparency & live ledger: [NAVIGATE: /transparency | Real Estate Transparency]
- Refer a client, friend, agent, or vendor: [NAVIGATE: /refer | Refer Someone]
- Mortgages, financing, vetted lenders: [NAVIGATE: /financial-services | Financial Services & Lenders]
- City guides & neighborhoods: [NAVIGATE: /city-guide | City Guide]
- Real estate answers & video FAQs: [NAVIGATE: /real-estate-answers | Real Estate Answers]
- Broker & agent portal: [NAVIGATE: /broker-portal | Broker Portal]`;

export default function HeroGeminiConcierge() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('ready'); // ready, connecting, listening, speaking, error
  const [errorMessage, setErrorMessage] = useState(null);
  const [lastTranscript, setLastTranscript] = useState(null);
  const [navNotice, setNavNotice] = useState(null);
  const clientRef = useRef(null);
  const navTimerRef = useRef(null);

  const handleStart = async () => {
    setErrorMessage(null);
    setLastTranscript(null);
    setNavNotice(null);

    if (clientRef.current) {
      clientRef.current.stop();
    }

    const client = new GeminiLiveSessionClient({
      systemPrompt: CHARLIE_CONCIERGE_PROMPT,
      voiceName: 'Charon', // Deep, natural US male voice
      onStatusChange: (newStatus) => {
        setStatus(newStatus);
        if (newStatus === 'listening') {
          setErrorMessage(null);
        }
      },
      onTranscript: (t) => {
        if (t?.text) {
          setLastTranscript(t);
        }
      },
      onSpeaker: () => {},
      onError: (err) => {
        setErrorMessage(err);
      },
      onSessionLogId: () => {},
      onNavigate: (nav) => {
        if (!nav?.path) return;
        setNavNotice(nav);
        navigate(nav.path);
        if (navTimerRef.current) clearTimeout(navTimerRef.current);
        navTimerRef.current = setTimeout(() => {
          setNavNotice(null);
        }, 4000);
      },
    });

    clientRef.current = client;
    await client.start();
  };

  const handleEnd = () => {
    if (clientRef.current) {
      clientRef.current.stop();
      clientRef.current = null;
    }
    setStatus('ready');
  };

  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.stop();
        clientRef.current = null;
      }
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    };
  }, []);

  const isActive = status === 'listening' || status === 'speaking' || status === 'connecting';

  return (
    <div className="mt-4 pt-3 border-t border-[rgba(212,175,55,0.35)] w-full max-w-xl">
      <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-3 bg-[#0d0d0d] p-3 rounded-2xl border border-[rgba(212,175,55,0.4)] shadow-xl">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: status === 'speaking'
                ? 'radial-gradient(circle, rgba(212,175,55,0.4) 0%, #1a1a1a 70%)'
                : status === 'listening'
                ? 'radial-gradient(circle, rgba(34,197,94,0.35) 0%, #1a1a1a 70%)'
                : 'rgba(212,175,55,0.15)',
              border: `1.5px solid ${status === 'speaking' ? GOLD : status === 'listening' ? '#22c55e' : GOLD}`,
            }}
          >
            {status === 'connecting' ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
            ) : status === 'speaking' ? (
              <Volume2 className="w-4 h-4 text-[#D4AF37] animate-pulse" />
            ) : status === 'listening' ? (
              <Mic className="w-4 h-4 text-[#22c55e] animate-pulse" />
            ) : (
              <Mic className="w-4 h-4 text-[#D4AF37]" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black tracking-widest uppercase text-[#D4AF37]">
                Gemini Live Concierge
              </span>
              {isActive && (
                <span
                  className="px-1.5 py-0.2 rounded text-[8px] font-black uppercase tracking-wider"
                  style={{
                    background: status === 'speaking' ? 'rgba(212,175,55,0.2)' : 'rgba(34,197,94,0.2)',
                    color: status === 'speaking' ? GOLD : '#4ade80',
                    border: `1px solid ${status === 'speaking' ? GOLD : '#22c55e'}`,
                  }}
                >
                  {status === 'speaking' ? 'Charlie Speaking' : status === 'listening' ? 'Listening' : 'Connecting'}
                </span>
              )}
            </div>

            <p className="text-xs text-white/90 truncate font-medium">
              {status === 'ready' && 'US Male Voice • Voice Navigation • Live V2V'}
              {status === 'connecting' && 'Connecting live session...'}
              {status === 'listening' && 'Listening... ask anything or name any service'}
              {status === 'speaking' && 'Speaking (you can interrupt anytime)'}
              {status === 'error' && (errorMessage || 'Connection interrupted')}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0">
          {isActive ? (
            <button
              onClick={handleEnd}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs cursor-pointer transition-all hover:scale-105 active:scale-95 text-red-400 bg-red-950/40 border border-red-500/50"
            >
              <Square className="w-3 h-3" /> End Call
            </button>
          ) : (
            <button
              onClick={handleStart}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full font-black text-xs tracking-wider uppercase cursor-pointer transition-all hover:scale-105 active:scale-95"
              style={{
                background: `linear-gradient(135deg, #e8c84a, ${GOLD})`,
                color: '#000',
                boxShadow: '0 4px 15px rgba(212,175,55,0.3)',
              }}
            >
              <Mic className="w-3.5 h-3.5" /> Talk with Charlie
            </button>
          )}
        </div>
      </div>

      {/* Navigation notification banner */}
      {navNotice && (
        <div className="mt-2 p-2 rounded-xl bg-black/80 border border-[#D4AF37] flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#D4AF37]" />
            <span>
              Navigating to <strong className="text-[#e8c84a]">{navNotice.title || navNotice.path}</strong>
            </span>
          </div>
          <button
            onClick={() => setNavNotice(null)}
            className="text-[10px] text-gray-400 hover:text-white px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Live Transcript Snippet */}
      {isActive && lastTranscript && (
        <div className="mt-2 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-[11px] text-white/80 flex items-start gap-2">
          <span className="font-bold text-[#D4AF37] uppercase text-[9px] shrink-0 mt-0.5">
            {lastTranscript.role === 'user' ? 'You' : 'Charlie'}:
          </span>
          <p className="line-clamp-2 leading-tight">{lastTranscript.text}</p>
        </div>
      )}
    </div>
  );
}