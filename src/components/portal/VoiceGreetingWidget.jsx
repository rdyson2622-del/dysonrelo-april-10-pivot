import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, MessageCircle } from 'lucide-react';
import TalkingOrb from '@/components/talkingapp/TalkingOrb';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';

/**
 * VoiceGreetingWidget — Charlie speaks a welcome/welcome-back greeting out
 * loud automatically on mount using the browser's built-in speech synthesis
 * (no tap required for the greeting itself). If the browser blocks
 * autoplay speech (common on mobile/iOS without a prior gesture), a small
 * "Tap to hear Charlie" fallback appears. The two-way mic conversation
 * still requires a real tap on "Start Talking" — mobile browsers block
 * microphone access without a genuine user gesture, no way around that.
 */
export default function VoiceGreetingWidget({ onClose, isReturning = false, visitorName = null }) {
  const [status, setStatus] = useState('ready');
  const [transcript, setTranscript] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const [spoken, setSpoken] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const sessionLogIdRef = useRef(null);
  const transcriptRef = useRef([]);

  const greetingText = `${isReturning ? 'Welcome back' : 'Welcome'}${visitorName ? `, ${visitorName}` : ''}! I'm Charlie, your relocation concierge. Tap Start Talking whenever you'd like to chat.`;

  const speakGreeting = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(greetingText);
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => /male|david|mark|guy/i.test(v.name)) || voices.find(v => v.lang?.startsWith('en'));
    if (preferred) utter.voice = preferred;
    utter.rate = 1;
    utter.onstart = () => { setSpoken(true); setAutoplayBlocked(false); };
    window.speechSynthesis.speak(utter);
  };

  useEffect(() => {
    // Attempt to speak immediately on mount — works on many desktop browsers
    // without a gesture. If it hasn't started within ~800ms, the browser
    // silently blocked it (common on mobile) — show a tap-to-enable fallback.
    speakGreeting();
    const checkTimer = setTimeout(() => {
      if (!window.speechSynthesis?.speaking) setAutoplayBlocked(true);
    }, 800);
    return () => { clearTimeout(checkTimer); window.speechSynthesis?.cancel(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTranscript = (entry) => {
    if (entry.role === 'system') { setShowPanel(true); }
    if (entry.role !== 'user' && entry.role !== 'assistant' && entry.role !== 'system') return;
    const withTime = { ...entry, timestamp: new Date().toISOString() };
    transcriptRef.current = [...transcriptRef.current, withTime];
    setTranscript([...transcriptRef.current]);
    if (sessionLogIdRef.current) {
      base44.entities.TalkingSessionLog.update(sessionLogIdRef.current, { transcript: transcriptRef.current }).catch(() => {});
    }
  };

  return (
    <>
      {/* Compact voice orb — bottom-left, live while the call is active (bottom-right is reserved for Admin Charlie) */}
      <div
        className="fixed bottom-6 left-6 z-50 w-[220px] rounded-2xl overflow-hidden flex flex-col"
        style={{ background: '#0d0d0d', border: `1px solid ${GOLD}`, boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}
      >
        <div className="shrink-0 flex items-center justify-between px-3 py-2.5" style={{ borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
          <p className="text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5" style={{ color: GOLD }}>
            <Volume2 className="w-3.5 h-3.5" /> Charlie
          </p>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-5 h-5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.4)', color: GOLD }}
          >
            <X className="w-2.5 h-2.5" />
          </button>
        </div>
        {status === 'ready' && (
          <div className="px-3 pt-3">
            <div className="rounded-lg px-3 py-2 text-xs text-white" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)' }}>
              {greetingText}
            </div>
            {autoplayBlocked && !spoken && (
              <button
                onClick={speakGreeting}
                className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold"
                style={{ background: 'rgba(212,175,55,0.15)', border: `1px solid ${GOLD}`, color: GOLD }}
              >
                <Volume2 className="w-3 h-3" /> Tap to hear Charlie
              </button>
            )}
          </div>
        )}
        <div className="h-[340px]">
          <TalkingOrb
            status={status}
            setStatus={setStatus}
            onTranscript={handleTranscript}
            onSpeaker={() => {}}
            onSessionId={(id) => { sessionLogIdRef.current = id; }}
            skipGreeting={spoken}
          />
        </div>
      </div>

      {/* Right slide-out drawer — appears after a delay so Charlie speaks first */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-36 left-0 bottom-0 z-40 w-[26vw] min-w-[300px] max-w-[90vw] flex flex-col"
            style={{ background: '#0d0d0d', borderRight: `1px solid ${GOLD}55`, boxShadow: '8px 0 30px rgba(0,0,0,0.5)' }}
          >
            <div className="shrink-0 flex items-center gap-2 px-5 py-4" style={{ borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
              <MessageCircle className="w-4 h-4" style={{ color: GOLD }} />
              <p className="text-xs font-black tracking-widest uppercase" style={{ color: GOLD }}>Live Conversation</p>
            </div>
            {/* Extra bottom padding keeps the newest message from being hidden
                behind the Charlie orb widget, which sits fixed bottom-left
                on top of this drawer's bottom-left corner. */}
            <div className="flex-1 overflow-y-auto p-5 pb-[420px] space-y-3">
              {transcript.length === 0 ? (
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Say hello — what you say shows up here live, for both of you, and is saved for admin review.
                </p>
              ) : (
                transcript.map((entry, i) => (
                  <div key={i} className={`flex ${entry.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className="max-w-[85%] rounded-xl px-3 py-2 text-sm"
                      style={{
                        background: entry.role === 'user' ? 'rgba(212,175,55,0.15)' : '#1a1a1a',
                        border: entry.role === 'user' ? `1px solid ${GOLD}33` : '1px solid #333',
                        color: '#fff',
                      }}
                    >
                      <p className="text-[10px] font-bold mb-0.5" style={{ color: entry.role === 'user' ? GOLD : '#aaa' }}>
                        {entry.role === 'user' ? 'You' : 'Charlie'}
                      </p>
                      {entry.text}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}