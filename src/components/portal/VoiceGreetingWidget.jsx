import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, MessageCircle, ExternalLink, ArrowRight } from 'lucide-react';
import TalkingOrb from '@/components/talkingapp/TalkingOrb';
import { base44 } from '@/api/base44Client';
import { CHARLIE_SIMMONS_SYSTEM_PROMPT } from '@/lib/charlieSimmonsPrompt';

const GOLD = '#D4AF37';

const CHARLIE_CONCIERGE_PROMPT = CHARLIE_SIMMONS_SYSTEM_PROMPT;

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
    navigate(nav.path);
    if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
    countdownTimerRef.current = setTimeout(() => {
      setNavDirective(null);
    }, 3500);
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
            className="shrink-0 p-2 mx-2 my-1.5 rounded-xl text-left border flex items-center justify-between gap-2"
            style={{
              background: 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(20,20,20,0.95) 100%)',
              borderColor: GOLD,
            }}
          >
            <div>
              <span className="text-[9px] font-black tracking-wider uppercase text-[#e8c84a] block">
                Navigated
              </span>
              <p className="text-[11px] font-bold text-white leading-tight">
                Viewing {navDirective.title || navDirective.path}
              </p>
            </div>
            <button
              onClick={() => setNavDirective(null)}
              className="text-[10px] text-gray-400 hover:text-white px-1.5 py-0.5 rounded cursor-pointer"
            >
              ✕
            </button>
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