import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Square, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';

const SESSION_TIME_LIMIT = 5 * 60; // 5 minutes in seconds

const SESSION_SYSTEM = `You are a warm, professional relocation interview specialist working for Dyson & Dyson Concierge Relocation Services. Your job is to conduct a thorough but conversational intake interview to build the client's relocation profile.

Cover these topics naturally in conversation (don't make it feel like a checklist):
1. Destination city and specific neighborhoods of interest
2. Timeline for the move
3. Family details (spouse, children ages, pets)
4. Budget range for the new home
5. Buying vs renting
6. Top priorities: schools, commute, religious community, safety, nightlife, healthcare, nature, walkability
7. Current home — are they selling? Do they need agent help on both ends?
8. Employment situation — remote work, transferring, job searching
9. Special needs — elderly parents, medical specialists, accessibility
10. Personality and lifestyle — city vs suburbs, walkable vs car-dependent
11. Any action items they mention — flights, school tours, utility setup, community research

Be warm, conversational, and thorough. Ask follow-up questions. Take your time. This conversation will be used by our human staff to match them with the perfect agent and build their complete move plan.

When the conversation feels complete (all major topics covered), wrap up naturally: "I think I have everything I need to start building your relocation profile. Our team will review this and reach out shortly to introduce you to your matched agent."`;

export default function GeminiLiveSession({ clientInfo, onSessionComplete }) {
  const [status, setStatus] = useState('ready'); // ready | connecting | active | processing | complete
  const [transcript, setTranscript] = useState([]);
  const [currentSpeaker, setCurrentSpeaker] = useState(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [error, setError] = useState(null);

  const wsRef = useRef(null);
  const audioCtxRef = useRef(null);
  const processorRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const transcriptRef = useRef([]);

  const addToTranscript = useCallback((role, text) => {
    const entry = { role, text, timestamp: new Date().toISOString() };
    transcriptRef.current = [...transcriptRef.current, entry];
    setTranscript([...transcriptRef.current]);
  }, []);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setSessionDuration(d => {
        const next = d + 1;
        if (next >= SESSION_TIME_LIMIT) {
          // Auto-end session at time limit
          setTimeout(() => endSession(), 100);
        }
        return next;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const startSession = async () => {
    setStatus('connecting');
    setError(null);

    try {
      // Get session token from backend
      const res = await base44.functions.invoke('geminiLiveProxy', {
        action: 'start_session',
        clientInfo,
        systemPrompt: SESSION_SYSTEM,
      });

      if (res.data?.limit_reached) throw new Error(res.data.error);
      if (!res.data?.wsUrl) throw new Error('Could not start session');

      // Connect to Gemini Live WebSocket via our proxy
      const ws = new WebSocket(res.data.wsUrl);
      wsRef.current = ws;

      ws.onopen = async () => {
        setStatus('active');
        startTimer();
        addToTranscript('system', 'Session started. Gemini is ready to speak with you.');
        await startMicrophone(ws);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'audio') {
          playAudio(data.audio);
          setCurrentSpeaker('gemini');
        } else if (data.type === 'transcript') {
          if (data.role === 'user') {
            addToTranscript('user', data.text);
            setCurrentSpeaker('user');
          } else if (data.role === 'model') {
            addToTranscript('gemini', data.text);
            setCurrentSpeaker('gemini');
          }
        } else if (data.type === 'turn_complete') {
          setCurrentSpeaker(null);
        }
      };

      ws.onerror = (e) => {
        setError('Connection error. Please try again.');
        setStatus('ready');
        stopTimer();
        cleanup();
      };

      ws.onclose = () => {
        if (status === 'active') {
          endSession();
        }
      };

    } catch (err) {
      setError(err.message || 'Failed to start session');
      setStatus('ready');
    }
  };

  const startMicrophone = async (ws) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const audioCtx = new AudioContext({ sampleRate: 16000 });
    audioCtxRef.current = audioCtx;

    const source = audioCtx.createMediaStreamSource(stream);
    const processor = audioCtx.createScriptProcessor(4096, 1, 1);
    processorRef.current = processor;

    processor.onaudioprocess = (e) => {
      if (ws.readyState !== WebSocket.OPEN) return;
      const input = e.inputBuffer.getChannelData(0);
      const pcm = new Int16Array(input.length);
      for (let i = 0; i < input.length; i++) {
        pcm[i] = Math.max(-32768, Math.min(32767, input[i] * 32768));
      }
      const b64 = btoa(String.fromCharCode(...new Uint8Array(pcm.buffer)));
      ws.send(JSON.stringify({ type: 'audio_chunk', data: b64 }));
    };

    source.connect(processor);
    processor.connect(audioCtx.destination);
  };

  const playAudio = (b64Audio) => {
    try {
      const raw = atob(b64Audio);
      const bytes = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);

      const ctx = new AudioContext({ sampleRate: 24000 });
      const numSamples = bytes.buffer.byteLength / 2;
      const buffer = ctx.createBuffer(1, numSamples, 24000);
      const data = buffer.getChannelData(0);
      const view = new DataView(bytes.buffer);
      for (let i = 0; i < numSamples; i++) {
        data[i] = view.getInt16(i * 2, true) / 32768;
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start();
    } catch (e) {
      console.error('Audio playback error:', e);
    }
  };

  const cleanup = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    processorRef.current?.disconnect();
    audioCtxRef.current?.close();
    wsRef.current?.close();
  };

  const endSession = async () => {
    cleanup();
    stopTimer();
    setStatus('processing');
    setCurrentSpeaker(null);

    // Send transcript to backend for debrief extraction
    const res = await base44.functions.invoke('geminiDebrief', {
      transcript: transcriptRef.current,
      clientInfo,
    });

    setStatus('complete');
    if (onSessionComplete) {
      onSessionComplete({
        transcript: transcriptRef.current,
        profile: res.data?.profile || {},
        tasks: res.data?.tasks || [],
        duration: sessionDuration,
      });
    }
  };

  useEffect(() => {
    return () => {
      cleanup();
      stopTimer();
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Status Bar */}
      <div className="px-4 pt-3 pb-2 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: status === 'active' ? '#22c55e' : status === 'connecting' ? GOLD : '#444' }} />
          <span className="text-xs font-bold" style={{ color: '#888' }}>
            {status === 'ready' && 'Ready to begin'}
            {status === 'connecting' && 'Connecting to Gemini...'}
            {status === 'active' && `Live Session — ${formatTime(sessionDuration)} / 5:00`}
            {status === 'processing' && 'Building your profile...'}
            {status === 'complete' && 'Session complete'}
          </span>
        </div>
        {status === 'active' && (
          <span className="text-xs font-bold" style={{ color: sessionDuration >= 240 ? '#ef4444' : '#555' }}>
            {SESSION_TIME_LIMIT - sessionDuration}s left
          </span>
        )}
      </div>

      {/* Transcript */}
      <div className="flex-1 overflow-y-auto px-4 space-y-3 min-h-0 pb-4">
        <AnimatePresence>
          {transcript.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${entry.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {entry.role === 'system' ? (
                <p className="text-xs text-center w-full" style={{ color: '#444' }}>{entry.text}</p>
              ) : (
                <div className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm"
                  style={{
                    background: entry.role === 'user' ? 'rgba(212,175,55,0.15)' : '#1a1a1a',
                    border: entry.role === 'user' ? `1px solid ${GOLD}33` : '1px solid #2a2a2a',
                    color: entry.role === 'user' ? '#fff' : '#ddd',
                  }}>
                  <p className="text-xs font-bold mb-1" style={{ color: entry.role === 'user' ? GOLD : '#888' }}>
                    {entry.role === 'user' ? 'You' : '✨ Gemini'}
                  </p>
                  {entry.text}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Speaking indicator */}
        {currentSpeaker && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
            <div className="flex gap-1">
              {[0, 0.15, 0.3].map((delay, i) => (
                <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
                  style={{ background: currentSpeaker === 'gemini' ? GOLD : '#22c55e' }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay }} />
              ))}
            </div>
            <span className="text-xs" style={{ color: '#666' }}>
              {currentSpeaker === 'gemini' ? 'Gemini is speaking...' : 'Listening...'}
            </span>
          </motion.div>
        )}

        {/* Processing state */}
        {status === 'processing' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-3 py-8">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: GOLD }} />
            <p className="text-sm text-center" style={{ color: '#888' }}>
              Gemini is analyzing your conversation and building your relocation profile...
            </p>
          </motion.div>
        )}

        {/* Complete state */}
        {status === 'complete' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3 py-8">
            <CheckCircle2 className="w-10 h-10" style={{ color: '#22c55e' }} />
            <p className="text-base font-bold text-center" style={{ color: '#fff' }}>Profile Built Successfully</p>
            <p className="text-sm text-center" style={{ color: '#888' }}>
              Your Dyson concierge team has been notified and will reach out shortly.
            </p>
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 shrink-0" style={{ borderTop: '1px solid #1a1a1a' }}>
        {error && (
          <p className="text-xs text-center mb-3" style={{ color: '#ef4444' }}>{error}</p>
        )}

        {status === 'ready' && (
          <div className="space-y-3">
            <div className="rounded-xl p-3 text-xs" style={{ background: '#111', border: '1px solid #222' }}>
              <p style={{ color: '#888' }}>
                🎤 Make sure your microphone is enabled. Speak naturally — Gemini will guide the conversation.
                Sessions typically last 10–20 minutes.
              </p>
            </div>
            <Button onClick={startSession} className="w-full h-12 font-bold gap-2 rounded-xl text-base"
              style={{ background: GOLD, color: '#000' }}>
              <Mic className="w-5 h-5" /> Begin Live Interview
            </Button>
          </div>
        )}

        {status === 'connecting' && (
          <Button disabled className="w-full h-12 rounded-xl opacity-60"
            style={{ background: '#222', color: '#888' }}>
            <Loader2 className="w-4 h-4 animate-spin mr-2" /> Connecting...
          </Button>
        )}

        {status === 'active' && (
          <Button onClick={endSession}
            className="w-full h-12 font-bold gap-2 rounded-xl"
            style={{ background: '#1a1a1a', border: '1px solid #ef4444', color: '#ef4444' }}>
            <Square className="w-4 h-4" /> End Session & Build Profile
          </Button>
        )}
      </div>
    </div>
  );
}