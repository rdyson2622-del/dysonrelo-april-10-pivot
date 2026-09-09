import React, { useRef, useState, useEffect } from 'react';
import { Mic, Square, Loader2, Volume2, AlertCircle } from 'lucide-react';
import { GeminiLiveSessionClient } from '@/lib/geminiLiveClient';

const GOLD = '#D4AF37';

import { CHARLIE_SIMMONS_SYSTEM_PROMPT, CHARLIE_VOICE_NAME } from '@/lib/charlieSimmonsPrompt';

const DEFAULT_SYSTEM_PROMPT = CHARLIE_SIMMONS_SYSTEM_PROMPT;

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
  const voiceName = CHARLIE_VOICE_NAME;

  const handleStart = async () => {
    setErrorMessage(null);
    if (clientRef.current) {
      clientRef.current.stop();
    }

    const client = new GeminiLiveSessionClient({
      systemPrompt,
      voiceName: CHARLIE_VOICE_NAME,
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
      onPendingNavigate: (nav) => {
        onNavigate?.(nav);
      },
      onCancelNavigate: () => {},
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
            : 'rgba(12,12,12,0.85)',
          backdropFilter: 'blur(10px)',
          border: `2px solid ${isSpeaking ? GOLD : isListening ? '#22c55e' : 'rgba(212,175,55,0.6)'}`,
          boxShadow: isSpeaking
            ? '0 0 35px rgba(212,175,55,0.45)'
            : isListening
            ? '0 0 35px rgba(34,197,94,0.4)'
            : '0 8px 30px rgba(0,0,0,0.85)',
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

      {/* Status label with frosted backdrop for perfect legibility over full-color photos */}
      <div className="text-center px-2 max-w-xs">
        <div className="inline-block bg-black/80 px-3.5 py-1 rounded-full border border-white/10 backdrop-blur-md shadow-lg">
          <p className="text-xs font-bold tracking-wide" style={{ color: '#fff' }}>
            {status === 'ready' && 'Tap below to connect with Charlie'}
            {status === 'connecting' && 'Connecting Gemini Live…'}
            {status === 'listening' && 'Listening… speak naturally'}
            {status === 'speaking' && 'Charlie is speaking…'}
            {status === 'error' && (errorMessage || 'Connection interrupted. Tap below to retry.')}
          </p>
        </div>
        {errorMessage && status !== 'error' && (
          <p className="text-[11px] text-amber-400 mt-1 leading-tight flex items-center justify-center gap-1 bg-black/85 px-3 py-1 rounded-full border border-amber-500/30 backdrop-blur-md">
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