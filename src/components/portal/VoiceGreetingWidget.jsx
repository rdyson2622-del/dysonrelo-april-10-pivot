import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, MessageCircle, Send, Mic, Play } from 'lucide-react';
import TalkingOrb from '@/components/talkingapp/TalkingOrb';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';

const CHARLIE_WELCOME_AUDIO = "https://media.base44.com/files/public/69d905d72ff7c93b5ef050c4/ae1b2d234_speech.mp3";
const CHARLIE_WELCOME_BACK_AUDIO = "https://media.base44.com/files/public/69d905d72ff7c93b5ef050c4/558e4d44e_speech.mp3";

export default function VoiceGreetingWidget({ onClose, isReturning = false, visitorName = null }) {
  const [status, setStatus] = useState('ready');
  const [transcript, setTranscript] = useState([]);
  const [showPanel, setShowPanel] = useState(true); // Open panel so user sees the live conversation & response input
  const [typedMessage, setTypedMessage] = useState('');
  const [externalMessageToSend, setExternalMessageToSend] = useState(null);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const audioPlayerRef = useRef(null);
  const sessionLogIdRef = useRef(null);
  const transcriptRef = useRef([]);

  const greetingAudioUrl = isReturning ? CHARLIE_WELCOME_BACK_AUDIO : CHARLIE_WELCOME_AUDIO;
  const greetingText = isReturning
    ? "Welcome back! This is Charlie, your real estate concierge. How can I help you today?"
    : "Good morning, this is Charlie, your real estate concierge. How can I help you today?";

  const playCharlieGreeting = () => {
    try {
      if (!audioPlayerRef.current) {
        audioPlayerRef.current = new Audio(greetingAudioUrl);
      }
      const audio = audioPlayerRef.current;
      audio.currentTime = 0;
      setIsPlayingAudio(true);
      audio.onended = () => {
        setIsPlayingAudio(false);
      };
      audio.onerror = () => {
        setIsPlayingAudio(false);
      };
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setAutoplayBlocked(false);
          })
          .catch(() => {
            // Browser autoplay policy blocked unprompted sound — show tap button
            setAutoplayBlocked(true);
            setIsPlayingAudio(false);
          });
      }
    } catch (_) {
      setAutoplayBlocked(true);
      setIsPlayingAudio(false);
    }
  };

  useEffect(() => {
    // Add initial Charlie greeting to transcript
    const initialTurn = { role: 'assistant', text: greetingText, timestamp: new Date().toISOString() };
    transcriptRef.current = [initialTurn];
    setTranscript([initialTurn]);

    // Attempt to play Charlie's genuine voice audio on load
    playCharlieGreeting();

    return () => {
      if (audioPlayerRef.current) {
        try { audioPlayerRef.current.pause(); } catch (_) {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTranscript = (entry) => {
    if (entry.role === 'system') { setShowPanel(true); }
    if (entry.role !== 'user' && entry.role !== 'assistant') return;
    const withTime = { ...entry, timestamp: new Date().toISOString() };
    transcriptRef.current = [...transcriptRef.current, withTime];
    setTranscript([...transcriptRef.current]);
    if (sessionLogIdRef.current) {
      base44.entities.TalkingSessionLog.update(sessionLogIdRef.current, {
        transcript: transcriptRef.current,
        transcript_turns: transcriptRef.current.length,
      }).catch(() => {});
    }
  };

  const handleSendTyped = (e) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;
    const msg = typedMessage.trim();
    setTypedMessage('');

    if (status !== 'active') {
      // If session not active yet, update transcript and invoke charlieVoiceChat directly
      const userEntry = { role: 'user', text: msg, timestamp: new Date().toISOString() };
      transcriptRef.current = [...transcriptRef.current, userEntry];
      setTranscript([...transcriptRef.current]);

      base44.functions.invoke('charlieVoiceChat', {
        message: msg,
        conversation: transcriptRef.current,
      }).then(res => {
        const replyText = res.data?.reply || "I'm with you. What else can I assist with?";
        const assistantEntry = { role: 'assistant', text: replyText, timestamp: new Date().toISOString() };
        transcriptRef.current = [...transcriptRef.current, assistantEntry];
        setTranscript([...transcriptRef.current]);

        if (res.data?.audioUrl) {
          if (audioPlayerRef.current) {
            audioPlayerRef.current.pause();
          }
          const audio = new Audio(res.data.audioUrl);
          audioPlayerRef.current = audio;
          setIsPlayingAudio(true);
          audio.onended = () => setIsPlayingAudio(false);
          audio.play().catch(() => setIsPlayingAudio(false));
        }
      }).catch(() => {});
    } else {
      // Forward to active TalkingOrb session
      setExternalMessageToSend(msg);
    }
  };

  return (
    <>
      {/* Voice Orb Widget — bottom-left */}
      <div
        className="fixed bottom-6 left-6 z-50 w-[240px] rounded-2xl overflow-hidden flex flex-col"
        style={{ background: '#0d0d0d', border: `1px solid ${GOLD}`, boxShadow: '0 12px 40px rgba(0,0,0,0.7)' }}
      >
        <div className="shrink-0 flex items-center justify-between px-3 py-2.5" style={{ borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
          <p className="text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5" style={{ color: GOLD }}>
            <Volume2 className="w-3.5 h-3.5" /> Charlie Concierge
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowPanel(!showPanel)}
              className="px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer"
              style={{ background: showPanel ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.06)', color: GOLD, border: '1px solid rgba(212,175,55,0.3)' }}
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

        {/* Play greeting fallback if autoplay was prevented */}
        {autoplayBlocked && (
          <div className="px-3 pt-2.5">
            <button
              onClick={playCharlieGreeting}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black cursor-pointer transition-all hover:scale-102"
              style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}
            >
              <Play className="w-3.5 h-3.5 fill-black" /> Tap to Hear Charlie
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
            skipGreeting={true}
            externalMessage={externalMessageToSend}
            onClearExternalMessage={() => setExternalMessageToSend(null)}
          />
        </div>
      </div>

      {/* Slide-out Live Conversation Panel & Input */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed top-24 left-0 bottom-0 z-40 w-[340px] max-w-[92vw] flex flex-col"
            style={{ background: '#0a0a0a', borderRight: `1px solid ${GOLD}40`, boxShadow: '8px 0 35px rgba(0,0,0,0.6)' }}
          >
            <div className="shrink-0 flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" style={{ color: GOLD }} />
                <p className="text-xs font-black tracking-widest uppercase" style={{ color: GOLD }}>Conversation with Charlie</p>
              </div>
              <button
                onClick={() => setShowPanel(false)}
                className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded"
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
                    <p className="text-[10px] font-black uppercase tracking-wider mb-1" style={{ color: entry.role === 'user' ? GOLD : '#e8c84a' }}>
                      {entry.role === 'user' ? 'You' : 'Charlie'}
                    </p>
                    {entry.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom text response input — allows viewer to reply at any time */}
            <div className="p-3 border-t border-white/10" style={{ background: '#111' }}>
              <form onSubmit={handleSendTyped} className="flex items-center gap-2">
                <input
                  type="text"
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  placeholder="Type a message to Charlie…"
                  className="flex-1 px-3 py-2 rounded-xl text-xs outline-none focus:border-[#D4AF37]"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.3)', color: '#fff' }}
                />
                <button
                  type="submit"
                  disabled={!typedMessage.trim()}
                  className="p-2 rounded-xl disabled:opacity-40 cursor-pointer transition-all hover:scale-105"
                  style={{ background: GOLD, color: '#000' }}
                  title="Send message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
              <p className="text-[10px] text-gray-500 mt-1.5 text-center">
                Speak via the orb or type your reply above
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}