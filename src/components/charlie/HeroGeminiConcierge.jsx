import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Square, Loader2, Volume2, Compass, X } from 'lucide-react';
import { GeminiLiveSessionClient } from '@/lib/geminiLiveClient';
import { CHARLIE_SIMMONS_SYSTEM_PROMPT, CHARLIE_VOICE_NAME } from '@/lib/charlieSimmonsPrompt';
import CharlieActionPointer from './CharlieActionPointer';

const GOLD = '#D4AF37';

const CHARLIE_CONCIERGE_PROMPT = CHARLIE_SIMMONS_SYSTEM_PROMPT;

export default function HeroGeminiConcierge({ sidebarMode = false }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState('ready'); // ready, connecting, listening, speaking, error
  const [errorMessage, setErrorMessage] = useState(null);
  const [liveText, setLiveText] = useState('');
  const [speakerRole, setSpeakerRole] = useState(null);
  const [navNotice, setNavNotice] = useState(null);
  const [activeAction, setActiveAction] = useState(null);
  const clientRef = useRef(null);
  const navTimerRef = useRef(null);

  const handleStart = async () => {
    setErrorMessage(null);
    setLiveText('');
    setSpeakerRole(null);
    setNavNotice(null);
    setActiveAction(null);

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
          window.dispatchEvent(new CustomEvent('v2v-session-state', { detail: { status: newStatus, isActive } }));
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
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('v2v-speaker-change', { detail: { speaker: role } }));
        }
      },
      onError: (err) => {
        setErrorMessage(err);
      },
      onSessionLogId: () => {},
      onPendingNavigate: (nav) => {
        setNavNotice(nav);
        setActiveAction(nav);
      },
      onCancelNavigate: () => {
        setNavNotice(null);
      },
      onNavigate: (nav) => {
        if (!nav?.path && !nav?.url) return;
        setNavNotice(nav);
        setActiveAction(nav);
        const target = nav.url || nav.path;
        if (target.startsWith('http://') || target.startsWith('https://')) {
          try {
            window.open(target, '_blank', 'noopener,noreferrer');
          } catch (_) {}
        } else {
          navigate(nav.path);
        }
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
      window.dispatchEvent(new CustomEvent('v2v-session-state', { detail: { status: 'ready', isActive: false } }));
      window.dispatchEvent(new CustomEvent('v2v-speaker-change', { detail: { speaker: null } }));
    }
  };

  useEffect(() => {
    const handleToggleV2V = () => {
      if (clientRef.current) {
        handleEnd();
      } else {
        handleStart();
      }
    };
    window.addEventListener('toggle-charlie-v2v', handleToggleV2V);

    return () => {
      window.removeEventListener('toggle-charlie-v2v', handleToggleV2V);
      if (clientRef.current) {
        clientRef.current.stop();
        clientRef.current = null;
      }
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    };
  }, []);

  const isActive = status === 'listening' || status === 'speaking' || status === 'connecting';

  if (sidebarMode) {
    return (
      <div className="w-full text-left">
        {!isActive ? (
          <button
            type="button"
            onClick={handleStart}
            className="w-full group p-2 rounded-lg border border-[#D4AF37] hover:brightness-105 active:scale-95 transition-all text-left cursor-pointer flex items-center justify-between shadow-md"
            style={{
              background: '#ede0cc',
            }}
          >
            <div className="flex items-center gap-2 min-w-0 pr-1">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-sm"
                style={{ background: '#0a0a0a', border: `1px solid ${GOLD}` }}
              >
                <Mic className="w-3 h-3 text-[#D4AF37]" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-1 mb-0.2">
                  <span className="text-[10.5px] font-bold text-[#0a0a0a]">
                    Talk with Charlie
                  </span>
                  <span
                    className="text-[7px] px-1.5 py-0.2 rounded-full font-black uppercase tracking-wider text-white bg-[#0a0a0a]"
                  >
                    Voice AI
                  </span>
                </div>
                <p className="text-[9px] text-[#44382c] font-medium leading-tight truncate">
                  Ask anything, vet agents &amp; navigate
                </p>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse shrink-0" title="Online" />
          </button>
        ) : (
          <div
            className="w-full p-2.5 rounded-xl border border-[#D4AF37] shadow-xl space-y-2 text-left"
            style={{ background: '#12100a' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: status === 'speaking' ? GOLD : status === 'listening' ? '#22c55e' : GOLD,
                    boxShadow: status === 'speaking' ? `0 0 8px ${GOLD}` : '0 0 8px #22c55e',
                  }}
                />
                <span className="text-[11px] font-bold text-white">
                  {status === 'connecting' && 'Connecting to Charlie…'}
                  {status === 'listening' && 'Listening (Speak now)…'}
                  {status === 'speaking' && 'Charlie Speaking…'}
                </span>

                {status === 'speaking' && (
                  <div className="flex items-center gap-0.5 ml-1">
                    <span className="w-0.5 h-3 bg-[#D4AF37] animate-pulse rounded-full" />
                    <span className="w-0.5 h-4 bg-[#D4AF37] animate-pulse delay-75 rounded-full" />
                    <span className="w-0.5 h-2 bg-[#D4AF37] animate-pulse delay-150 rounded-full" />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleEnd}
                className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30 cursor-pointer transition-colors"
                title="End session"
              >
                <Square className="w-2.5 h-2.5" /> Stop
              </button>
            </div>

            {/* Live speech turn */}
            {(liveText || navNotice) && !activeAction && (
              <div className="text-[10px] text-white/80 leading-relaxed bg-black/60 p-2 rounded-lg border border-white/10">
                {navNotice ? (
                  <span className="inline-flex items-center gap-1 text-[#fce38a] font-bold">
                    <Compass className="w-3 h-3 text-[#D4AF37]" /> Opening {navNotice.title || navNotice.path}
                  </span>
                ) : (
                  <span>
                    <strong className="text-[#D4AF37] uppercase text-[9px] mr-1">
                      {speakerRole === 'user' ? 'You:' : 'Charlie:'}
                    </strong>
                    {liveText}
                  </span>
                )}
              </div>
            )}

            {/* Charlie Action Pointer */}
            {activeAction && (
              <div className="w-full pt-1">
                <CharlieActionPointer
                  action={activeAction}
                  onDismiss={() => {
                    setActiveAction(null);
                    setNavNotice(null);
                  }}
                />
              </div>
            )}
          </div>
        )}

        {status === 'error' && (
          <p className="text-[9.5px] text-amber-400 mt-1 pl-1">
            {errorMessage || 'Connection issue. Tap to retry.'}
          </p>
        )}
      </div>
    );
  }

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
        <p className="text-[10px] text-amber-400 mt-1 pl-1">
          {errorMessage || 'Connection issue. Tap to retry.'}
        </p>
      )}

      {/* Discreet single-line caption / navigation alert */}
      {isActive && (liveText || navNotice) && !activeAction && (
        <div className="mt-1.5 max-w-md text-[11px] text-white/80 font-medium leading-tight pl-1 flex items-center gap-1.5">
          {navNotice ? (
            <span className="inline-flex items-center gap-1 text-[#fce38a] font-bold bg-[#D4AF37]/30 px-2 py-0.5 rounded">
              <Compass className="w-3 h-3 text-[#b8920a]" /> Directing to {navNotice.title || navNotice.path}
            </span>
          ) : (
            <span className="truncate">
              <strong className="text-[#D4AF37] uppercase text-[9px] mr-1">
                {speakerRole === 'user' ? 'You:' : 'Charlie:'}
              </strong>
              {liveText}
            </span>
          )}
        </div>
      )}

      {/* Charlie Action Pointer: Glowing Beacon + 1-Tap Action Button */}
      {activeAction && (
        <div className="w-full max-w-md">
          <CharlieActionPointer
            action={activeAction}
            onDismiss={() => {
              setActiveAction(null);
              setNavNotice(null);
            }}
          />
        </div>
      )}
    </div>
  );
}