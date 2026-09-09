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
  className = '',
  compact = false,
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
    <div 
      className={`flex flex-col items-center justify-center bg-black/85 backdrop-blur-md border border-[#D4AF37]/50 shadow-2xl ${
        compact 
          ? 'gap-1.5 p-2 rounded-2xl w-[124px]' 
          : 'gap-3 p-3.5 rounded-3xl max-w-[220px]'
      } ${className}`}
    >
      {/* Orb Visualizer - Clickable */}
      <button
        type="button"
        onClick={isActive || isConnecting ? handleEnd : handleStart}
        className={`${
          compact 
            ? 'w-13 h-13 sm:w-14 sm:h-14 border-[1.5px]' 
            : 'w-24 h-24 sm:w-28 sm:h-28 border-2'
        } rounded-full flex flex-col items-center justify-center transition-all duration-300 relative cursor-pointer hover:scale-105 active:scale-95 group focus:outline-none`}
        title={isActive || isConnecting ? 'Tap to end call' : 'Tap to start talking with Charlie'}
        style={{
          background: isSpeaking
            ? 'radial-gradient(circle, rgba(212,175,55,0.4) 0%, rgba(13,13,13,0.95) 70%)'
            : isListening
            ? 'radial-gradient(circle, rgba(34,197,94,0.35) 0%, rgba(13,13,13,0.95) 70%)'
            : isConnecting
            ? 'radial-gradient(circle, rgba(212,175,55,0.25) 0%, rgba(13,13,13,0.95) 70%)'
            : 'radial-gradient(circle, rgba(212,175,55,0.18) 0%, rgba(12,12,12,0.92) 75%)',
          backdropFilter: 'blur(10px)',
          borderColor: isSpeaking ? GOLD : isListening ? '#22c55e' : 'rgba(212,175,55,0.7)',
          boxShadow: isSpeaking
            ? compact ? '0 0 16px rgba(212,175,55,0.5)' : '0 0 35px rgba(212,175,55,0.5)'
            : isListening
            ? compact ? '0 0 16px rgba(34,197,94,0.45)' : '0 0 35px rgba(34,197,94,0.45)'
            : compact ? '0 4px 15px rgba(0,0,0,0.8), 0 0 10px rgba(212,175,55,0.2)' : '0 8px 30px rgba(0,0,0,0.9), 0 0 20px rgba(212,175,55,0.2)',
        }}
      >
        {isConnecting ? (
          <Loader2 className={`${compact ? 'w-4 h-4' : 'w-8 h-8'} animate-spin`} style={{ color: GOLD }} />
        ) : isSpeaking ? (
          <div className="flex items-center gap-1">
            <Volume2 className={compact ? 'w-3.5 h-3.5' : 'w-7 h-7'} style={{ color: GOLD }} />
            <div className="flex items-center gap-0.5">
              <span className={`${compact ? 'w-0.5 h-2' : 'w-1 h-3.5'} bg-[#D4AF37] animate-pulse rounded-full`} />
              <span className={`${compact ? 'w-0.5 h-3.5' : 'w-1 h-6'} bg-[#D4AF37] animate-pulse delay-75 rounded-full`} />
              <span className={`${compact ? 'w-0.5 h-1.5' : 'w-1 h-2.5'} bg-[#D4AF37] animate-pulse delay-150 rounded-full`} />
            </div>
          </div>
        ) : isListening ? (
          <div className="flex flex-col items-center">
            <Mic className={`${compact ? 'w-4 h-4' : 'w-8 h-8'} animate-pulse`} style={{ color: '#22c55e' }} />
            <span className={`${compact ? 'text-[7px]' : 'text-[9.5px]'} font-bold text-green-400 mt-0.5`}>Listening</span>
          </div>
        ) : (
          <Mic className={`${compact ? 'w-4 h-4 sm:w-5 sm:h-5' : 'w-8 h-8 sm:w-9 sm:h-9'} group-hover:scale-110 transition-transform`} style={{ color: GOLD }} />
        )}
      </button>

      {/* Status label with frosted backdrop */}
      <div className={`text-center ${compact ? 'px-0.5 w-full' : 'px-1 max-w-[200px]'}`}>
        <div className={`inline-block bg-black/90 ${compact ? 'px-1.5 py-0.5' : 'px-3 py-0.5'} rounded-full border border-white/10 shadow-sm w-full truncate`}>
          <p className={`${compact ? 'text-[8px]' : 'text-[10.5px]'} font-bold tracking-tight text-white truncate`}>
            {status === 'ready' && (compact ? 'Tap to connect' : 'Tap below to connect')}
            {status === 'connecting' && 'Connecting…'}
            {status === 'listening' && (compact ? 'Listening…' : 'Listening… speak now')}
            {status === 'speaking' && (compact ? 'Speaking…' : 'Charlie speaking…')}
            {status === 'error' && (errorMessage || 'Retry')}
          </p>
        </div>
        {errorMessage && status !== 'error' && (
          <p className="text-[8px] text-amber-400 mt-0.5 leading-tight flex items-center justify-center gap-1 bg-black/90 px-1 py-0.5 rounded-full border border-amber-500/30 truncate">
            <AlertCircle className="w-2.5 h-2.5 shrink-0" /> {errorMessage}
          </p>
        )}
      </div>

      {/* Control Buttons (Mic Pill) */}
      {isActive || isConnecting ? (
        <button
          type="button"
          onClick={handleEnd}
          className={`flex items-center justify-center gap-1.5 ${
            compact ? 'px-2 py-1.5 rounded-xl text-[9px]' : 'px-5 py-2.5 rounded-full text-xs'
          } font-bold cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-xl w-full`}
          style={{ background: '#1c1c1c', border: '1.5px solid #ef4444', color: '#ef4444' }}
        >
          <Square className={compact ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} /> End Call
        </button>
      ) : (
        <button
          type="button"
          onClick={handleStart}
          className={`flex items-center justify-center gap-1.5 ${
            compact ? 'px-2 py-1.5 rounded-xl text-[9px] tracking-tight' : 'px-5 py-2.5 rounded-full text-xs tracking-wider uppercase'
          } font-black cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-2xl w-full truncate`}
          style={{
            background: `linear-gradient(135deg, #e8c84a, ${GOLD})`,
            color: '#000',
            boxShadow: compact ? '0 2px 10px rgba(212,175,55,0.3)' : '0 4px 18px rgba(212,175,55,0.4)',
          }}
        >
          <Mic className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} text-black shrink-0`} />
          <span className="truncate">{buttonLabel}</span>
        </button>
      )}
    </div>
  );
}