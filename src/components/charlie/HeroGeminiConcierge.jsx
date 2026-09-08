import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Square, Loader2, Volume2, Compass, X } from 'lucide-react';
import { GeminiLiveSessionClient } from '@/lib/geminiLiveClient';

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
  const [liveText, setLiveText] = useState('');
  const [speakerRole, setSpeakerRole] = useState(null);
  const [navNotice, setNavNotice] = useState(null);
  const clientRef = useRef(null);
  const navTimerRef = useRef(null);

  const handleStart = async () => {
    setErrorMessage(null);
    setLiveText('');
    setSpeakerRole(null);
    setNavNotice(null);

    if (clientRef.current) {
      clientRef.current.stop();
    }

    const client = new GeminiLiveSessionClient({
      systemPrompt: CHARLIE_CONCIERGE_PROMPT,
      voiceName: 'storm', // Charlie's distinguished US male voice
      onStatusChange: (newStatus) => {
        setStatus(newStatus);
        if (newStatus === 'listening') {
          setErrorMessage(null);
        }
      },
      onTranscript: (t) => {
        if (t?.text) {
          setLiveText(t.text);
          setSpeakerRole(t.role);
        }
      },
      onSpeaker: (role) => {
        setSpeakerRole(role);
      },
      onError: (err) => {
        setErrorMessage(err);
      },
      onSessionLogId: () => {},
      onPendingNavigate: (nav) => {
        setNavNotice(nav);
      },
      onCancelNavigate: () => {
        setNavNotice(null);
      },
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
    setLiveText('');
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
    <div className="mt-3.5 inline-flex flex-col items-start max-w-full">
      {/* Discreet Gemini-style audio pill */}
      <div
        className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full transition-all duration-300 shadow-md"
        style={{
          background: '#0d0d0d',
          border: `1px solid ${isActive ? GOLD : 'rgba(212,175,55,0.35)'}`,
        }}
      >
        {!isActive ? (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 text-xs font-semibold text-white/90 hover:text-white cursor-pointer group"
          >
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ background: 'rgba(212,175,55,0.2)', border: `1px solid ${GOLD}` }}
            >
              <Mic className="w-3.5 h-3.5 text-[#D4AF37]" />
            </span>
            <span className="tracking-wide">Talk with Charlie</span>
            <span
              className="text-[9px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded-full"
              style={{ background: `${GOLD}20`, color: GOLD }}
            >
              Voice Concierge
            </span>
          </button>
        ) : (
          <div className="flex items-center gap-3">
            {/* Live animated waveform */}
            <div className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  background: status === 'speaking' ? GOLD : status === 'listening' ? '#22c55e' : GOLD,
                  boxShadow: status === 'speaking' ? `0 0 8px ${GOLD}` : '0 0 8px #22c55e',
                }}
              />
              <span className="text-[11px] font-bold text-white tracking-wide">
                {status === 'connecting' && 'Connecting…'}
                {status === 'listening' && 'Listening…'}
                {status === 'speaking' && 'Charlie Speaking…'}
              </span>

              {/* Minimalist 3-bar equalizer for speaking */}
              {status === 'speaking' && (
                <div className="flex items-center gap-0.5 ml-1">
                  <span className="w-0.5 h-3 bg-[#D4AF37] animate-pulse rounded-full" />
                  <span className="w-0.5 h-4 bg-[#D4AF37] animate-pulse delay-75 rounded-full" />
                  <span className="w-0.5 h-2 bg-[#D4AF37] animate-pulse delay-150 rounded-full" />
                </div>
              )}
            </div>

            <span className="text-[10px] text-gray-400 hidden sm:inline">
              (barge-in enabled)
            </span>

            {/* End button */}
            <button
              onClick={handleEnd}
              className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer transition-colors"
              title="End conversation"
            >
              <Square className="w-2.5 h-2.5" /> Stop
            </button>
          </div>
        )}
      </div>

      {/* Error note if any */}
      {status === 'error' && (
        <p className="text-[10px] text-amber-600 mt-1 pl-1">
          {errorMessage || 'Connection issue. Tap to retry.'}
        </p>
      )}

      {/* Discreet single-line caption / navigation alert */}
      {isActive && (liveText || navNotice) && (
        <div className="mt-1.5 max-w-md text-[11px] text-[#2c2217] font-medium leading-tight pl-1 flex items-center gap-1.5">
          {navNotice ? (
            <span className="inline-flex items-center gap-1 text-[#0d0d0d] font-bold bg-[#D4AF37]/30 px-2 py-0.5 rounded">
              <Compass className="w-3 h-3 text-[#b8920a]" /> Directing to {navNotice.title || navNotice.path}
            </span>
          ) : (
            <span className="truncate">
              <strong className="text-[#b8920a] uppercase text-[9px] mr-1">
                {speakerRole === 'user' ? 'You:' : 'Charlie:'}
              </strong>
              {liveText}
            </span>
          )}
        </div>
      )}
    </div>
  );
}