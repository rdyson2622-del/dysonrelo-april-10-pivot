import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

const GOLD = '#D4AF37';

// Charlie's opening presentation — spoken automatically on load
const PRESENTATION_SCRIPT = [
  "Hello. I'm Charlie, your personal relocation guide from Dyson and Dyson. Thank you for taking a moment to connect with me today.",
  "I'm not a chatbot, and I'm not a sales pitch. I'm an AI concierge built to make one of the biggest transitions of your life — moving to a new city — feel completely manageable.",
  "Here's what makes us different. Most people moving to a new city are on their own. They search Zillow, they call a random agent, and they hope for the best. We don't do that.",
  "At Dyson and Dyson, we research over 20 agents in your destination market before you ever meet one. We match you based on your lifestyle, your timeline, and your personality — not just your budget.",
  "We handle the research, the coordination, the school lookups, the neighborhood comparisons, and the agent vetting — all before you pack a single box.",
  "And it costs you nothing. Our service is free to buyers. We're compensated through referral agreements with agents, so your interests and ours are perfectly aligned.",
  "Now — I'd love to learn a little about you. Where are you thinking of moving, and what's driving the decision? Just speak naturally. I'm listening."
];

// States
const STATE = {
  IDLE: 'idle',
  SPEAKING: 'speaking',
  LISTENING: 'listening',
  THINKING: 'thinking',
  ERROR: 'error',
};

export default function CharlieVoicePresentation() {
  const [status, setStatus] = useState(STATE.IDLE);
  const [currentText, setCurrentText] = useState('');
  const [transcript, setTranscript] = useState('');
  const [conversation, setConversation] = useState([]);
  const [error, setError] = useState('');
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);
  const [presentationDone, setPresentationDone] = useState(false);

  const synthRef = useRef(window.speechSynthesis);
  const recognitionRef = useRef(null);
  const scriptIndexRef = useRef(0);
  const isMountedRef = useRef(true);
  const muteRef = useRef(false);

  useEffect(() => {
    muteRef.current = muted;
  }, [muted]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      synthRef.current?.cancel();
      recognitionRef.current?.stop();
    };
  }, []);

  // Setup speech recognition
  const setupRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      const text = result[0].transcript;
      setTranscript(text);

      if (result.isFinal) {
        setTranscript('');
        handleUserSpeech(text);
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'no-speech') {
        // Restart listening if no speech detected
        if (isMountedRef.current && presentationDone) {
          setTimeout(() => startListening(), 1000);
        }
      }
    };

    recognition.onend = () => {
      // Auto-restart listening if we're in listening mode
      if (isMountedRef.current && status === STATE.LISTENING) {
        setTimeout(() => {
          if (recognitionRef.current && isMountedRef.current) {
            try { recognitionRef.current.start(); } catch (e) {}
          }
        }, 300);
      }
    };

    return recognition;
  }, [status, presentationDone]);

  // Speak a single line
  const speakLine = useCallback((text, onEnd) => {
    if (!isMountedRef.current) return;
    if (muteRef.current) {
      setCurrentText(text);
      setTimeout(onEnd, 100);
      return;
    }

    synthRef.current.cancel();
    setCurrentText(text);
    setStatus(STATE.SPEAKING);

    const utterance = new SpeechSynthesisUtterance(text);

    // Pick a warm, clear voice
    const voices = synthRef.current.getVoices();
    const preferred = voices.find(v =>
      v.name.includes('Google') && v.lang === 'en-US' && (v.name.includes('Male') || v.name.includes('Guy'))
    ) || voices.find(v => v.lang === 'en-US' && !v.name.includes('Female')) || voices[0];
    if (preferred) utterance.voice = preferred;

    utterance.rate = 0.92;
    utterance.pitch = 0.95;
    utterance.volume = 1;

    utterance.onend = () => {
      if (isMountedRef.current) onEnd();
    };

    utterance.onerror = () => {
      if (isMountedRef.current) onEnd();
    };

    synthRef.current.speak(utterance);
  }, []);

  // Run the presentation script sequentially
  const runPresentation = useCallback(() => {
    const idx = scriptIndexRef.current;
    if (idx >= PRESENTATION_SCRIPT.length) {
      // Presentation done — switch to listen mode
      setPresentationDone(true);
      startListening();
      return;
    }

    speakLine(PRESENTATION_SCRIPT[idx], () => {
      scriptIndexRef.current += 1;
      setTimeout(() => {
        if (isMountedRef.current) runPresentation();
      }, 400);
    });
  }, [speakLine]);

  // Start listening for user input
  const startListening = useCallback(() => {
    if (!isMountedRef.current) return;
    setStatus(STATE.LISTENING);
    setCurrentText('');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Voice recognition is not supported in this browser. Please use Chrome.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      const text = result[0].transcript;
      setTranscript(text);

      if (result.isFinal && text.trim().length > 2) {
        recognition.stop();
        setTranscript('');
        handleUserSpeech(text.trim());
      }
    };

    recognition.onerror = (e) => {
      if (e.error !== 'no-speech' && isMountedRef.current) {
        setTimeout(() => startListening(), 2000);
      }
    };

    recognition.onend = () => {
      if (isMountedRef.current && status === STATE.LISTENING) {
        setTimeout(() => {
          try { recognition.start(); } catch (e) {}
        }, 500);
      }
    };

    recognitionRef.current = recognition;
    try { recognition.start(); } catch (e) {}
  }, [status]);

  // Handle what the user said — call Charlie backend
  const handleUserSpeech = useCallback(async (userText) => {
    if (!isMountedRef.current) return;
    synthRef.current.cancel();
    recognitionRef.current?.stop();

    setStatus(STATE.THINKING);
    setCurrentText('');

    const updatedConvo = [...conversation, { role: 'user', content: userText }];
    setConversation(updatedConvo);

    try {
      const res = await base44.functions.invoke('charlieVoiceChat', {
        message: userText,
        conversation: updatedConvo.slice(-6), // Last 6 turns for context
      });

      const reply = res.data?.reply || "That's a great point. Let me think about that for a moment and get back to you.";
      const newConvo = [...updatedConvo, { role: 'charlie', content: reply }];
      setConversation(newConvo);

      speakLine(reply, () => {
        if (isMountedRef.current) startListening();
      });

    } catch (err) {
      const fallback = "I'm sorry, I had a brief hiccup. Could you repeat that?";
      speakLine(fallback, () => {
        if (isMountedRef.current) startListening();
      });
    }
  }, [conversation, speakLine, startListening]);

  // Auto-start on first user gesture (required by browsers for autoplay)
  const handleStart = useCallback(() => {
    if (started) return;
    setStarted(true);
    scriptIndexRef.current = 0;
    // Small delay to let browser unlock audio
    setTimeout(() => {
      if (isMountedRef.current) runPresentation();
    }, 300);
  }, [started, runPresentation]);

  // Try to auto-start immediately; if browser blocks, show tap screen
  useEffect(() => {
    // Some browsers require a gesture. We attempt auto-start and catch failure.
    const timer = setTimeout(() => {
      if (!started && isMountedRef.current) {
        // Attempt silent pre-start
        try {
          const testUtterance = new SpeechSynthesisUtterance('');
          synthRef.current.speak(testUtterance);
          handleStart();
        } catch (e) {
          // Will wait for tap
        }
      }
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const statusLabel = {
    [STATE.IDLE]: 'Initializing...',
    [STATE.SPEAKING]: 'Charlie is speaking...',
    [STATE.LISTENING]: 'Listening — speak freely',
    [STATE.THINKING]: 'Charlie is thinking...',
    [STATE.ERROR]: error,
  };

  const orbColor = {
    [STATE.IDLE]: GOLD,
    [STATE.SPEAKING]: '#60a5fa',
    [STATE.LISTENING]: '#4ade80',
    [STATE.THINKING]: '#a78bfa',
    [STATE.ERROR]: '#ef4444',
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: '#050505' }}
      onClick={handleStart}
    >
      {/* Background pulse rings */}
      <AnimatePresence>
        {status === STATE.SPEAKING && (
          <>
            {[1, 2, 3].map(i => (
              <motion.div
                key={i}
                className="absolute rounded-full border"
                style={{ borderColor: `${GOLD}${i === 1 ? '44' : i === 2 ? '22' : '11'}` }}
                initial={{ width: 120, height: 120, opacity: 0.8 }}
                animate={{ width: 120 + i * 80, height: 120 + i * 80, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: 'easeOut' }}
              />
            ))}
          </>
        )}
        {status === STATE.LISTENING && (
          <>
            {[1, 2, 3].map(i => (
              <motion.div
                key={i}
                className="absolute rounded-full border"
                style={{ borderColor: `#4ade80${i === 1 ? '55' : i === 2 ? '33' : '11'}` }}
                initial={{ width: 120, height: 120, opacity: 0.8 }}
                animate={{ width: 120 + i * 60, height: 120 + i * 60, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3, ease: 'easeOut' }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Main Orb */}
      <motion.div
        className="relative z-10 flex items-center justify-center rounded-full"
        style={{ width: 120, height: 120, background: `radial-gradient(circle, ${orbColor[status]}33, ${orbColor[status]}11)`, border: `2px solid ${orbColor[status]}66` }}
        animate={status === STATE.SPEAKING ? { scale: [1, 1.08, 1], opacity: [1, 0.85, 1] } : status === STATE.THINKING ? { rotate: 360 } : {}}
        transition={status === STATE.THINKING ? { duration: 2, repeat: Infinity, ease: 'linear' } : { duration: 0.6, repeat: Infinity }}
      >
        <span style={{ fontSize: '3rem' }}>🎩</span>
      </motion.div>

      {/* Charlie name */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-center z-10">
        <h1 className="text-2xl font-bold tracking-widest" style={{ color: GOLD, fontFamily: 'Georgia, serif' }}>CHARLIE</h1>
        <p className="text-xs tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>DYSON & DYSON AI CONCIERGE</p>
      </motion.div>

      {/* Status indicator */}
      <motion.div
        key={status}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 px-4 py-2 rounded-full z-10"
        style={{ background: `${orbColor[status]}15`, border: `1px solid ${orbColor[status]}33` }}
      >
        <p className="text-sm font-medium" style={{ color: orbColor[status] }}>
          {status === STATE.LISTENING && <span className="inline-block w-2 h-2 rounded-full mr-2 animate-pulse" style={{ background: '#4ade80' }} />}
          {statusLabel[status]}
        </p>
      </motion.div>

      {/* What Charlie is saying */}
      <AnimatePresence mode="wait">
        {currentText && (
          <motion.div
            key={currentText.slice(0, 20)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 max-w-lg text-center z-10 px-8"
          >
            <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)', fontStyle: 'italic' }}>
              "{currentText}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User transcript (live) */}
      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 max-w-md text-center z-10 px-8"
          >
            <p className="text-sm" style={{ color: '#4ade80' }}>You: "{transcript}"</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tap to start overlay — shown if autoplay was blocked */}
      {!started && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center z-50 cursor-pointer"
          style={{ background: 'rgba(0,0,0,0.92)' }}
          onClick={handleStart}
        >
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: `${GOLD}22`, border: `2px solid ${GOLD}` }}
            >
              <Volume2 className="w-10 h-10" style={{ color: GOLD }} />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: GOLD, fontFamily: 'Georgia, serif' }}>Tap to Connect with Charlie</h2>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>He'll introduce himself and guide you through everything</p>
            <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>No typing required — just listen and speak</p>
          </div>
        </motion.div>
      )}

      {/* Mute toggle */}
      {started && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={(e) => { e.stopPropagation(); setMuted(m => !m); if (!muted) synthRef.current.cancel(); }}
          className="fixed bottom-8 right-8 z-50 p-3 rounded-full"
          style={{ background: '#1a1a1a', border: `1px solid ${muted ? '#ef4444' : '#333'}` }}
        >
          {muted ? <VolumeX className="w-5 h-5" style={{ color: '#ef4444' }} /> : <Volume2 className="w-5 h-5" style={{ color: '#aaa' }} />}
        </motion.button>
      )}

      {/* Recent conversation history */}
      {conversation.length > 0 && (
        <div className="fixed bottom-8 left-8 max-w-xs z-10 space-y-1">
          {conversation.slice(-3).map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 0.6, x: 0 }}
              className="text-xs px-3 py-1.5 rounded-lg"
              style={{
                background: msg.role === 'charlie' ? 'rgba(212,175,55,0.15)' : 'rgba(74,222,128,0.1)',
                color: msg.role === 'charlie' ? GOLD : '#4ade80',
                maxWidth: '280px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {msg.role === 'charlie' ? '🎩 ' : '👤 '}{msg.content.slice(0, 60)}{msg.content.length > 60 ? '…' : ''}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}