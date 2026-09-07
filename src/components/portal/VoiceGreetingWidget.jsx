import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, MessageCircle, ExternalLink, ArrowRight } from 'lucide-react';
import TalkingOrb from '@/components/talkingapp/TalkingOrb';
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

export default function VoiceGreetingWidget({ onClose, isReturning = false }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState('ready');
  const [transcript, setTranscript] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const [navDirective, setNavDirective] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const sessionLogIdRef = useRef(null);
  const countdownTimerRef = useRef(null);

  const handleNavigate = (nav) => {
    if (!nav?.path) return;
    setNavDirective(nav);
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      if (navDirective?.path) {
        navigate(navDirective.path);
        setNavDirective(null);
        setCountdown(null);
      }
      return;
    }
    countdownTimerRef.current = setTimeout(() => {
      setCountdown((c) => (c !== null ? c - 1 : null));
    }, 1000);
    return () => clearTimeout(countdownTimerRef.current);
  }, [countdown, navDirective, navigate]);

  const cancelNavigation = () => {
    if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
    setNavDirective(null);
    setCountdown(null);
  };

  const executeNavigation = () => {
    if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
    if (navDirective?.path) {
      navigate(navDirective.path);
      setNavDirective(null);
      setCountdown(null);
    }
  };

  const handleTranscript = (entry) => {
    if (!entry?.text) return;
    setTranscript((prev) => [...prev, { ...entry, timestamp: new Date().toISOString() }]);
    setShowPanel(true);

    if (sessionLogIdRef.current) {
      base44.entities.TalkingSessionLog.update(sessionLogIdRef.current, {
        transcript: [...transcript, entry],
        transcript_turns: transcript.length + 1,
      }).catch(() => {});
    }
  };

  return (
    <>
      {/* Voice Concierge Widget — bottom-left */}
      <div
        className="fixed bottom-6 left-6 z-50 w-[240px] rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: '#0d0d0d',
          border: `1px solid ${GOLD}`,
          boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
        }}
      >
        <div
          className="shrink-0 flex items-center justify-between px-3 py-2.5"
          style={{ borderBottom: '1px solid rgba(212,175,55,0.2)' }}
        >
          <p
            className="text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5"
            style={{ color: GOLD }}
          >
            <Volume2 className="w-3.5 h-3.5" /> Charlie Concierge
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowPanel(!showPanel)}
              className="px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer"
              style={{
                background: showPanel ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.06)',
                color: GOLD,
                border: '1px solid rgba(212,175,55,0.3)',
              }}
              title="Toggle transcript panel"
            >
              Chat
            </button>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-5 h-5 rounded-full cursor-pointer hover:bg-white/10"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.4)', color: GOLD }}
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>

        {/* Directing Alert Card */}
        {navDirective && (
          <div
            className="shrink-0 p-2.5 mx-2 my-1.5 rounded-xl text-left border"
            style={{
              background: 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(20,20,20,0.95) 100%)',
              borderColor: GOLD,
            }}
          >
            <div className="flex items-start justify-between gap-1 mb-1">
              <span className="text-[9px] font-black tracking-wider uppercase text-[#e8c84a]">
                Directing to {navDirective.title || 'Page'}
              </span>
              <button
                onClick={cancelNavigation}
                className="text-[10px] text-gray-400 hover:text-white px-1 cursor-pointer"
                title="Cancel navigation"
              >
                ✕
              </button>
            </div>
            <p className="text-[11px] font-bold text-white mb-2 leading-tight">
              Taking you there in {countdown}s…
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={executeNavigation}
                className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black cursor-pointer hover:scale-105 active:scale-95 transition-all"
                style={{ background: GOLD, color: '#000' }}
              >
                Go Now <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={cancelNavigation}
                className="px-2.5 py-1 rounded-full text-[10px] text-gray-300 hover:text-white border border-white/20 cursor-pointer"
              >
                Stay Here
              </button>
            </div>
          </div>
        )}

        <div className="h-[270px]">
          <TalkingOrb
            status={status}
            setStatus={setStatus}
            onTranscript={handleTranscript}
            onSpeaker={() => {}}
            onSessionId={(id) => { sessionLogIdRef.current = id; }}
            onNavigate={handleNavigate}
            systemPrompt={CHARLIE_CONCIERGE_PROMPT}
            buttonLabel="Talk with Charlie"
          />
        </div>
      </div>

      {/* Slide-out Live Conversation Panel */}
      <AnimatePresence>
        {showPanel && transcript.length > 0 && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed top-24 left-0 bottom-0 z-40 w-[340px] max-w-[92vw] flex flex-col"
            style={{
              background: '#0a0a0a',
              borderRight: `1px solid ${GOLD}40`,
              boxShadow: '8px 0 35px rgba(0,0,0,0.6)',
            }}
          >
            <div
              className="shrink-0 flex items-center justify-between px-4 py-3"
              style={{ borderBottom: '1px solid rgba(212,175,55,0.2)' }}
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" style={{ color: GOLD }} />
                <p className="text-xs font-black tracking-widest uppercase" style={{ color: GOLD }}>
                  Live with Charlie
                </p>
              </div>
              <button
                onClick={() => setShowPanel(false)}
                className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded cursor-pointer"
              >
                Hide
              </button>
            </div>

            {/* Messages area — scrollable */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {transcript.map((entry, i) => (
                <div key={i} className={`flex ${entry.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className="max-w-[88%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed"
                    style={{
                      background: entry.role === 'user' ? 'rgba(212,175,55,0.2)' : '#161616',
                      border: entry.role === 'user' ? `1px solid ${GOLD}50` : '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                    }}
                  >
                    <p
                      className="text-[10px] font-black uppercase tracking-wider mb-1"
                      style={{ color: entry.role === 'user' ? GOLD : '#e8c84a' }}
                    >
                      {entry.role === 'user' ? 'You' : 'Charlie'}
                    </p>
                    {entry.text}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}