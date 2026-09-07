import React, { useRef, useState, useEffect } from 'react';
import { Mic, Square, Loader2, Volume2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';

const CHARLIE_OPENING_AUDIO = "https://media.base44.com/files/public/69d905d72ff7c93b5ef050c4/ae1b2d234_speech.mp3";
const CHARLIE_OPENING_TEXT = "Good morning, this is Charlie, your real estate concierge. How can I help you today?";

export default function TalkingOrb({
  status,
  setStatus,
  onTranscript,
  onSpeaker,
  onSessionId,
  skipGreeting = false,
  externalMessage = null,
  onClearExternalMessage = null,
}) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [micError, setMicError] = useState(null);

  const recognitionRef = useRef(null);
  const audioRef = useRef(null);
  const sessionLogIdRef = useRef(null);
  const startTimeRef = useRef(null);
  const turnCountRef = useRef(0);
  const conversationHistoryRef = useRef([]);
  const activeRef = useRef(false);

  // Initialize SpeechRecognition
  const getRecognition = () => {
    if (typeof window === 'undefined') return null;
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return null;
    const rec = new SpeechRec();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-US';
    return rec;
  };

  const playCharlieAudio = (url, onEnd) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      const audio = new Audio(url);
      audioRef.current = audio;
      setIsSpeaking(true);
      onSpeaker?.('assistant');

      audio.onended = () => {
        setIsSpeaking(false);
        onSpeaker?.(null);
        audioRef.current = null;
        onEnd?.();
      };
      audio.onerror = () => {
        setIsSpeaking(false);
        onSpeaker?.(null);
        audioRef.current = null;
        onEnd?.();
      };
      audio.play().catch(() => {
        setIsSpeaking(false);
        onSpeaker?.(null);
        onEnd?.();
      });
    } catch (_) {
      setIsSpeaking(false);
      onSpeaker?.(null);
      onEnd?.();
    }
  };

  const listenToUser = () => {
    if (!activeRef.current) return;
    const rec = getRecognition();
    if (!rec) {
      setMicError('Speech recognition not supported in this browser. You can type your question in the box below.');
      return;
    }

    try {
      rec.onstart = () => {
        setIsListening(true);
        onSpeaker?.('user');
        setMicError(null);
      };

      rec.onresult = (event) => {
        setIsListening(false);
        onSpeaker?.(null);
        const transcript = event.results?.[0]?.[0]?.transcript?.trim();
        if (transcript) {
          handleUserUtterance(transcript);
        } else {
          // Restart listening if empty
          if (activeRef.current) setTimeout(listenToUser, 500);
        }
      };

      rec.onerror = (e) => {
        setIsListening(false);
        onSpeaker?.(null);
        if (e.error === 'not-allowed') {
          setMicError('Microphone permission blocked. Please allow mic access or type your question below.');
        } else if (e.error === 'no-speech') {
          // Keep listening
          if (activeRef.current && !isSpeaking && !isThinking) {
            setTimeout(listenToUser, 600);
          }
        }
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (_) {
      setIsListening(false);
    }
  };

  const handleUserUtterance = async (userText) => {
    if (!userText?.trim()) return;
    turnCountRef.current += 1;
    conversationHistoryRef.current.push({ role: 'user', text: userText });
    onTranscript?.({ role: 'user', text: userText });

    setIsThinking(true);

    try {
      const res = await base44.functions.invoke('charlieVoiceChat', {
        message: userText,
        conversation: conversationHistoryRef.current,
      });

      setIsThinking(false);

      const replyText = res.data?.reply || "I'm with you. What else can I assist with?";
      const audioUrl = res.data?.audioUrl;

      turnCountRef.current += 1;
      conversationHistoryRef.current.push({ role: 'assistant', text: replyText });
      onTranscript?.({ role: 'assistant', text: replyText });

      if (audioUrl) {
        playCharlieAudio(audioUrl, () => {
          if (activeRef.current) {
            setTimeout(listenToUser, 400);
          }
        });
      } else {
        if (activeRef.current) {
          setTimeout(listenToUser, 400);
        }
      }
    } catch (err) {
      setIsThinking(false);
      const fallback = "I'm right here. Could you say that once more?";
      onTranscript?.({ role: 'assistant', text: fallback });
      if (activeRef.current) {
        setTimeout(listenToUser, 500);
      }
    }
  };

  // React to typed messages from the drawer
  useEffect(() => {
    if (externalMessage && activeRef.current) {
      handleUserUtterance(externalMessage);
      onClearExternalMessage?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalMessage]);

  const startSession = async () => {
    setMicError(null);
    setStatus('connecting');
    activeRef.current = true;
    startTimeRef.current = Date.now();
    turnCountRef.current = 0;
    conversationHistoryRef.current = [];

    // Create a TalkingSessionLog
    try {
      const me = await base44.auth.me().catch(() => null);
      const log = await base44.entities.TalkingSessionLog.create({
        user_id: me ? me.id : `guest_${Date.now()}`,
        user_name: me ? (me.full_name || '') : 'Portal Visitor',
        user_email: me ? (me.email || '') : '',
        model: 'charlie-voice-storm',
        started_at: new Date().toISOString(),
      });
      sessionLogIdRef.current = log?.id || null;
      onSessionId?.(log?.id || null);
    } catch (_) {}

    setStatus('active');
    onTranscript?.({ role: 'system', text: 'Voice concierge active. Charlie is speaking.' });

    if (!skipGreeting) {
      // Charlie speaks first in his genuine male voice
      onTranscript?.({ role: 'assistant', text: CHARLIE_OPENING_TEXT });
      playCharlieAudio(CHARLIE_OPENING_AUDIO, () => {
        if (activeRef.current) {
          listenToUser();
        }
      });
    } else {
      listenToUser();
    }
  };

  const endSession = () => {
    activeRef.current = false;
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (_) {}
      recognitionRef.current = null;
    }
    if (audioRef.current) {
      try { audioRef.current.pause(); } catch (_) {}
      audioRef.current = null;
    }
    setIsListening(false);
    setIsSpeaking(false);
    setIsThinking(false);
    onSpeaker?.(null);
    setStatus('ready');

    // Report session end
    if (sessionLogIdRef.current && startTimeRef.current) {
      const duration_seconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      base44.entities.TalkingSessionLog.update(sessionLogIdRef.current, {
        ended_at: new Date().toISOString(),
        duration_seconds,
        transcript_turns: turnCountRef.current,
        transcript: conversationHistoryRef.current.map(c => ({
          role: c.role,
          text: c.text,
          timestamp: new Date().toISOString()
        })),
      }).catch(() => {});
    }
  };

  useEffect(() => {
    return () => {
      activeRef.current = false;
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (_) {}
      }
      if (audioRef.current) {
        try { audioRef.current.pause(); } catch (_) {}
      }
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 p-4">
      {/* Orb Visualizer */}
      <div
        className="w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all duration-300 relative"
        style={{
          background: isSpeaking
            ? 'radial-gradient(circle, rgba(212,175,55,0.3) 0%, rgba(13,13,13,0.95) 70%)'
            : isListening
            ? 'radial-gradient(circle, rgba(34,197,94,0.3) 0%, rgba(13,13,13,0.95) 70%)'
            : 'rgba(255,255,255,0.03)',
          border: `2px solid ${isSpeaking ? GOLD : isListening ? '#22c55e' : 'rgba(212,175,55,0.3)'}`,
          boxShadow: isSpeaking
            ? `0 0 35px rgba(212,175,55,0.4)`
            : isListening
            ? `0 0 35px rgba(34,197,94,0.4)`
            : 'none',
        }}
      >
        {isThinking ? (
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
        ) : status === 'connecting' ? (
          <Loader2 className="w-10 h-10 animate-spin" style={{ color: GOLD }} />
        ) : (
          <Mic className="w-10 h-10" style={{ color: GOLD }} />
        )}
      </div>

      {/* Status label */}
      <div className="text-center">
        <p className="text-xs font-bold tracking-wide" style={{ color: '#fff' }}>
          {status === 'ready' && 'Tap below to speak with Charlie'}
          {status === 'connecting' && 'Connecting Charlie…'}
          {status === 'active' && isSpeaking && 'Charlie is speaking…'}
          {status === 'active' && isListening && 'Listening… speak now'}
          {status === 'active' && isThinking && 'Charlie is thinking…'}
          {status === 'active' && !isSpeaking && !isListening && !isThinking && 'Connected — tap to speak'}
        </p>
        {micError && (
          <p className="text-[11px] text-amber-400 mt-1 max-w-[200px] leading-tight">
            {micError}
          </p>
        )}
      </div>

      {/* Control Buttons */}
      {status === 'active' ? (
        <div className="flex items-center gap-2">
          {!isListening && !isSpeaking && !isThinking && (
            <button
              onClick={listenToUser}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs cursor-pointer transition-all hover:scale-105"
              style={{ background: '#22c55e', color: '#000' }}
            >
              <Mic className="w-3.5 h-3.5" /> Tap to Speak
            </button>
          )}
          <button
            onClick={endSession}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs cursor-pointer transition-all hover:scale-105"
            style={{ background: '#1a1a1a', border: '1px solid #ef4444', color: '#ef4444' }}
          >
            <Square className="w-3 h-3" /> End Call
          </button>
        </div>
      ) : (
        <button
          onClick={startSession}
          disabled={status === 'connecting'}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-xs tracking-wider uppercase cursor-pointer transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000', boxShadow: '0 4px 15px rgba(212,175,55,0.3)' }}
        >
          <Mic className="w-3.5 h-3.5" /> Start Talking
        </button>
      )}
    </div>
  );
}