import React, { useRef, useState, useEffect } from 'react';
import { Mic, Square, Loader2, Volume2, AlertCircle } from 'lucide-react';
import { GeminiLiveSessionClient } from '@/lib/geminiLiveClient';

const GOLD = '#D4AF37';

const DEFAULT_SYSTEM_PROMPT = `You are Charlie, the distinguished American male AI real estate concierge for Dyson & Dyson Companies relocation.
You speak with a natural, warm, mature American accent. Do NOT speak with a British accent or use British phrases.

CRITICAL CONVERSATION RULES:
1. NO RAMBLING: Keep every answer EXTREMELY concise — strictly 1 to 2 short sentences (under 30 words maximum).
2. ALLOW INTERRUPTION: If the visitor speaks while you are talking, yield immediately.
3. DIRECT THE VIEWER TO THE RIGHT PAGE: Whenever the visitor mentions a topic, need, or question, tell them in 1 sentence that you are taking them there, and call navigateToPage or append [NAVIGATE: /path | Page Title].

DIRECTORIES:
- Finding / hiring a vetted agent: [NAVIGATE: /find-agent | Find a Vetted Agent]
- Relocation planning / moving intake: [NAVIGATE: /relocation-intake | Relocation Plan & Intake]
- Questions, issues, advice, or intelligence roadmap: [NAVIGATE: /solutions | Real Estate Solutions]
- Corporate relocation / HR services: [NAVIGATE: /corporate-relo | Corporate Relocation]
- Daily news, market broadcasts: [NAVIGATE: /dnn-news | DNN Daily News]
- Real estate transparency & live ledger: [NAVIGATE: /transparency | Real Estate Transparency]
- Refer a client, friend, agent, or vendor: [NAVIGATE: /refer | Refer Someone]
- Mortgages, financing, vetted lenders: [NAVIGATE: /financial-services | Financial Services & Lenders]
- City guides & neighborhoods: [NAVIGATE: /city-guide | City Guide]
- Real estate answers & video FAQs: [NAVIGATE: /real-estate-answers | Real Estate Answers]
- Broker & agent portal: [NAVIGATE: /broker-portal | Broker Portal]`;

export default function TalkingOrb({
  status = 'ready',
  setStatus,
  onTranscript,
  onSpeaker,
  onSessionId,
  onNavigate,
  systemPrompt = DEFAULT_SYSTEM_PROMPT,
  buttonLabel = 'Talk with Charlie',
}) {
  const [errorMessage, setErrorMessage] = useState(null);
  const clientRef = useRef(null);

  const handleStart = async () => {
    setErrorMessage(null);
    if (clientRef.current) {
      clientRef.current.stop();
    }

    const client = new GeminiLiveSessionClient({
      systemPrompt,
      voiceName: 'storm', // Charlie's distinguished American male voice
      onStatusChange: (newStatus) => {
        setStatus?.(newStatus);
        if (newStatus === 'listening') {
          setErrorMessage(null);
        }
      },
      onTranscript: (t) => {
        onTranscript?.(t);
      },
      onSpeaker: (spk) => {
        onSpeaker?.(spk);
      },
      onError: (err) => {
        setErrorMessage(err);
      },
      onSessionLogId: (id) => {
        onSessionId?.(id);
      },
      onNavigate: (nav) => {
        onNavigate?.(nav);
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
    setStatus?.('ready');
  };

  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.stop();
        clientRef.current = null;
      }
    };
  }, []);

  const isActive = status === 'listening' || status === 'speaking';
  const isConnecting = status === 'connecting';
  const isSpeaking = status === 'speaking';
  const isListening = status === 'listening';

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 p-4">
      {/* Orb Visualizer */}
      <div
        className="w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all duration-300 relative"
        style={{
          background: isSpeaking
            ? 'radial-gradient(circle, rgba(212,175,55,0.35) 0%, rgba(13,13,13,0.95) 70%)'
            : isListening
            ? 'radial-gradient(circle, rgba(34,197,94,0.3) 0%, rgba(13,13,13,0.95) 70%)'
            : isConnecting
            ? 'radial-gradient(circle, rgba(212,175,55,0.2) 0%, rgba(13,13,13,0.95) 70%)'
            : 'rgba(255,255,255,0.03)',
          border: `2px solid ${isSpeaking ? GOLD : isListening ? '#22c55e' : 'rgba(212,175,55,0.3)'}`,
          boxShadow: isSpeaking
            ? '0 0 35px rgba(212,175,55,0.45)'
            : isListening
            ? '0 0 35px rgba(34,197,94,0.4)'
            : 'none',
        }}
      >
        {isConnecting ? (
          <Loader2 className="w-10 h-10 animate-spin" style={{ color: GOLD }} />
        ) : isSpeaking ? (
          <div className="flex items-center gap-1">
            <Volume2 className="w-8 h-8" style={{ color: GOLD }} />
            <div className="flex items-center gap-0.5">
              <span className="w-1 h-4 bg-[#D4AF37] animate-pulse rounded-full" />
              <span className="w-1 h-7 bg-[#D4AF37] animate-pulse delay-75 rounded-full" />
              <span className="w-1 h-3 bg-[#D4AF37] animate-pulse delay-150 rounded-full" />
            </div>
          </div>
        ) : isListening ? (
          <div className="flex flex-col items-center">
            <Mic className="w-9 h-9 animate-pulse" style={{ color: '#22c55e' }} />
            <span className="text-[10px] font-bold text-green-400 mt-1">Listening</span>
          </div>
        ) : (
          <Mic className="w-10 h-10" style={{ color: GOLD }} />
        )}
      </div>

      {/* Status label */}
      <div className="text-center px-2 max-w-xs">
        <p className="text-xs font-bold tracking-wide" style={{ color: '#fff' }}>
          {status === 'ready' && 'Tap below to connect with Charlie'}
          {status === 'connecting' && 'Connecting Gemini Live…'}
          {status === 'listening' && 'Listening… speak naturally'}
          {status === 'speaking' && 'Charlie is speaking…'}
          {status === 'error' && (errorMessage || 'Connection interrupted. Tap below to retry.')}
        </p>
        {errorMessage && status !== 'error' && (
          <p className="text-[11px] text-amber-400 mt-1 leading-tight flex items-center justify-center gap-1">
            <AlertCircle className="w-3 h-3 shrink-0" /> {errorMessage}
          </p>
        )}
      </div>

      {/* Control Buttons */}
      {isActive || isConnecting ? (
        <button
          onClick={handleEnd}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-full font-bold text-xs cursor-pointer transition-all hover:scale-105 active:scale-95"
          style={{ background: '#1a1a1a', border: '1px solid #ef4444', color: '#ef4444' }}
        >
          <Square className="w-3.5 h-3.5" /> End Call
        </button>
      ) : (
        <button
          onClick={handleStart}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-xs tracking-wider uppercase cursor-pointer transition-all hover:scale-105 active:scale-95"
          style={{
            background: `linear-gradient(135deg, #e8c84a, ${GOLD})`,
            color: '#000',
            boxShadow: '0 4px 15px rgba(212,175,55,0.3)',
          }}
        >
          <Mic className="w-3.5 h-3.5" /> {buttonLabel}
        </button>
      )}
    </div>
  );
}