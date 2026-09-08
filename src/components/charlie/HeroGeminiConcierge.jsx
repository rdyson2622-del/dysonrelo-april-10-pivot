import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Square, Loader2, Volume2, Compass, X } from 'lucide-react';
import { GeminiLiveSessionClient } from '@/lib/geminiLiveClient';
import { CHARLIE_SIMMONS_SYSTEM_PROMPT, CHARLIE_VOICE_NAME } from '@/lib/charlieSimmonsPrompt';

const GOLD = '#D4AF37';

const CHARLIE_CONCIERGE_PROMPT = CHARLIE_SIMMONS_SYSTEM_PROMPT;

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
      voiceName: CHARLIE_VOICE_NAME,
      onStatusChange: (newStatus) => {
        setStatus(newStatus);
        if (newStatus === 'listening') {
          setErrorMessage(null);
        }
        // Auto-duck ambient background music when Charlie is listening or speaking
        if (typeof window !== 'undefined') {
          const isActive = newStatus === 'listening' || newStatus === 'speaking' || newStatus === 'connecting';
          window.dispatchEvent(new CustomEvent('charlie-speech-active', { detail: { active: isActive } }));
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
        if (nav.path.startsWith('http://') || nav.path.startsWith('https://')) {
          window.open(nav.path, '_blank', 'noopener,noreferrer');
        } else {
          navigate(nav.path);
        }
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
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('charlie-speech-active', { detail: { active: false } }));
    }
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
    <div className="inline-flex flex-col items-start max-w-full">
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