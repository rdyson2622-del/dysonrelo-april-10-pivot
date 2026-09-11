import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Square, Loader2, Volume2, Compass, X } from 'lucide-react';
import { GeminiLiveSessionClient } from '@/lib/geminiLiveClient';
import { useLocation } from 'react-router-dom';
import { CHARLIE_SIMMONS_SYSTEM_PROMPT, CHARLIE_VOICE_NAME } from '@/lib/charlieSimmonsPrompt';
import { CHARLIE_PORTAL_WELCOME_SCRIPTS, getActivePortalRole } from '@/lib/charliePortalWelcomeScripts';
import CharlieActionPointer from './CharlieActionPointer';

const GOLD = '#D4AF37';

const CHARLIE_CONCIERGE_PROMPT = CHARLIE_SIMMONS_SYSTEM_PROMPT;

export default function HeroGeminiConcierge({ sidebarMode = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('ready'); // ready, connecting, listening, speaking, error
  const [errorMessage, setErrorMessage] = useState(null);
  const [liveText, setLiveText] = useState('');
  const [speakerRole, setSpeakerRole] = useState(null);
  const [navNotice, setNavNotice] = useState(null);
  const [activeAction, setActiveAction] = useState(null);
  const [textInput, setTextInput] = useState('');
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

    const currentRole = getActivePortalRole(location?.pathname, sessionStorage.getItem('dyson_role'));
    const portalConfig = CHARLIE_PORTAL_WELCOME_SCRIPTS[currentRole] || CHARLIE_PORTAL_WELCOME_SCRIPTS.client;

    const client = new GeminiLiveSessionClient({
      systemPrompt: CHARLIE_CONCIERGE_PROMPT,
      voiceName: CHARLIE_VOICE_NAME,
      openingGreetingText: portalConfig.script,
      openingGreetingAudioUrl: portalConfig.audioUrl,
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

  const handleSendText = (e) => {
    e?.preventDefault();
    if (!textInput.trim()) return;
    const msg = textInput.trim();
    setTextInput('');
    if (clientRef.current) {
      clientRef.current.sendTextMessage(msg);
    } else {
      handleStart().then(() => {
        setTimeout(() => {
          clientRef.current?.sendTextMessage(msg);
        }, 500);
      });
    }
  };

  return (
    <div className="inline-flex flex-col items-start max-w-full text-left my-2">
      {/* Discreet Gemini-style audio pill */}
      {!isActive ? (
        <button
          type="button"
          onClick={handleStart}
          className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full transition-all duration-300 shadow-lg cursor-pointer hover:scale-105 active:scale-95 select-none"
          style={{
            background: '#0d0d0d',
            border: `1.5px solid ${GOLD}`,
            boxShadow: '0 4px 18px rgba(0,0,0,0.6), 0 0 12px rgba(212,175,55,0.25)',
          }}
          title="Tap to start two-way voice conversation with Charlie"
        >
          <span
            className="w-7 h-7 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shrink-0"
            style={{ background: 'rgba(212,175,55,0.25)', border: `1px solid ${GOLD}` }}
          >
            <Mic className="w-4 h-4 text-[#D4AF37]" />
          </span>
          <span className="text-sm font-bold text-white tracking-wide">
            Talk with Charlie
          </span>
          <span
            className="text-[9.5px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full"
            style={{ background: `${GOLD}25`, color: GOLD, border: `1px solid ${GOLD}60` }}
          >
            Voice Concierge
          </span>
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse shrink-0 ml-0.5" title="Online" />
        </button>
      ) : (
        <div
          className="inline-flex flex-col items-start gap-2.5 p-3 rounded-2xl transition-all duration-300 shadow-2xl w-full max-w-lg"
          style={{
            background: 'linear-gradient(145deg, #16130d 0%, #0a0a0a 100%)',
            border: `1.5px solid ${status === 'speaking' ? GOLD : '#10b981'}`,
            boxShadow: '0 8px 30px rgba(0,0,0,0.8), 0 0 20px rgba(212,175,55,0.3)',
          }}
        >
          {/* Top Row: Speaking / Listening status & Stop button */}
          <div className="flex items-center justify-between w-full gap-3">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  background: status === 'speaking' ? GOLD : status === 'listening' ? '#22c55e' : GOLD,
                  boxShadow: status === 'speaking' ? `0 0 10px ${GOLD}` : '0 0 10px #22c55e',
                }}
              />
              <span className="text-xs font-bold text-white tracking-wide">
                {status === 'connecting' && 'Connecting to Charlie…'}
                {status === 'listening' && 'Listening to you… (speak now)'}
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

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/50 hidden sm:inline">
                {status === 'speaking' ? '(barge-in enabled)' : 'mic active'}
              </span>

              {/* End button */}
              <button
                type="button"
                onClick={handleEnd}
                className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg text-red-400 hover:text-red-300 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 cursor-pointer transition-colors shadow-sm"
                title="End voice conversation"
              >
                <Square className="w-3 h-3 fill-current" /> Stop
              </button>
            </div>
          </div>

          {/* Live transcript block */}
          {liveText && (
            <div className="w-full text-xs text-white/90 leading-relaxed bg-black/60 p-2.5 rounded-xl border border-white/10 shadow-inner">
              <strong className="text-[#D4AF37] uppercase text-[10px] mr-1.5 not-italic">
                {speakerRole === 'user' ? 'You:' : 'Charlie:'}
              </strong>
              <span>{liveText}</span>
            </div>
          )}

          {/* Quick inline text question input (so user can speak OR type) */}
          <form onSubmit={handleSendText} className="w-full flex items-center gap-1.5 pt-1">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Or type a question for Charlie…"
              className="flex-1 px-3 py-1.5 rounded-xl bg-black/70 border border-white/15 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#D4AF37]"
            />
            <button
              type="submit"
              disabled={!textInput.trim()}
              className="px-3 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#e8c84a] text-black font-bold text-xs disabled:opacity-40 transition-all cursor-pointer shrink-0 shadow"
            >
              Send
            </button>
          </form>

          {/* Navigation direct alert if Charlie triggered one */}
          {navNotice && (
            <div className="w-full text-xs text-[#fce38a] font-bold bg-[#D4AF37]/20 p-2 rounded-lg border border-[#D4AF37]/40 flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 truncate">
                <Compass className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" /> Opening {navNotice.title || navNotice.path}
              </span>
              <button
                type="button"
                onClick={() => navigate(navNotice.path)}
                className="px-2 py-0.5 rounded text-[10px] bg-[#D4AF37] text-black font-black uppercase shrink-0"
              >
                Go →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error note if any */}
      {status === 'error' && (
        <p className="text-[11px] text-amber-400 mt-1 pl-1 flex items-center gap-1">
          <span>{errorMessage || 'Connection issue. Tap button above to retry.'}</span>
        </p>
      )}

      {/* Charlie Action Pointer: Glowing Beacon + 1-Tap Action Button */}
      {activeAction && (
        <div className="w-full max-w-md mt-2">
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