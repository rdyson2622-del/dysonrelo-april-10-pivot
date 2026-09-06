import React, { useRef, useEffect } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';
const SYSTEM_PROMPT = `You are Charlie, the AI voice concierge for Dyson & Dyson Companies real estate relocation. Be warm, conversational, and helpful — answer real estate and relocation questions naturally, in short spoken-style replies. If you don't know something, offer to connect the caller with the human team.`;
const GREETING_INSTRUCTION = `(The caller just connected — greet them now, out loud, then wait for their reply.) Say something like: "Good morning, this is Charlie, your real estate concierge. How can I help you today?"`;

export default function TalkingOrb({ status, setStatus, onTranscript, onSpeaker, autoStart = false, onSessionId }) {
  const wsRef = useRef(null);
  const micCtxRef = useRef(null);
  const processorRef = useRef(null);
  const streamRef = useRef(null);
  const playCtxRef = useRef(null);
  const nextPlayTimeRef = useRef(0);
  const sessionLogIdRef = useRef(null);
  const startTimeRef = useRef(null);
  const turnCountRef = useRef(0);
  const reportedRef = useRef(false);

  const startMicrophone = async (ws) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    const micCtx = new AudioContext({ sampleRate: 16000 });
    micCtxRef.current = micCtx;
    const source = micCtx.createMediaStreamSource(stream);
    const processor = micCtx.createScriptProcessor(4096, 1, 1);
    processorRef.current = processor;
    processor.onaudioprocess = (e) => {
      if (ws.readyState !== WebSocket.OPEN) return;
      const input = e.inputBuffer.getChannelData(0);
      const pcm = new Int16Array(input.length);
      for (let i = 0; i < input.length; i++) pcm[i] = Math.max(-32768, Math.min(32767, input[i] * 32768));
      const b64 = btoa(String.fromCharCode(...new Uint8Array(pcm.buffer)));
      ws.send(JSON.stringify({ realtimeInput: { mediaChunks: [{ mimeType: 'audio/pcm;rate=16000', data: b64 }] } }));
    };
    source.connect(processor);
    processor.connect(micCtx.destination);
  };

  // Schedules incoming 24kHz PCM chunks back-to-back on one AudioContext so
  // playback is gap-free instead of one new context per chunk.
  const playAudioChunk = (b64Audio) => {
    try {
      if (!playCtxRef.current || playCtxRef.current.state === 'closed') {
        playCtxRef.current = new AudioContext({ sampleRate: 24000 });
        nextPlayTimeRef.current = 0;
      }
      const ctx = playCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const raw = atob(b64Audio);
      const bytes = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
      const numSamples = bytes.buffer.byteLength / 2;
      const buffer = ctx.createBuffer(1, numSamples, 24000);
      const data = buffer.getChannelData(0);
      const view = new DataView(bytes.buffer);
      for (let i = 0; i < numSamples; i++) data[i] = view.getInt16(i * 2, true) / 32768;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      const startAt = Math.max(ctx.currentTime, nextPlayTimeRef.current);
      source.start(startAt);
      nextPlayTimeRef.current = startAt + buffer.duration;
    } catch (e) { console.error('Audio playback error:', e); }
  };

  // Barge-in: Gemini sends `interrupted` the moment the caller talks over
  // Charlie — flush anything queued so playback stops immediately.
  const stopPlayback = () => {
    try { if (playCtxRef.current) { playCtxRef.current.close(); playCtxRef.current = null; nextPlayTimeRef.current = 0; } } catch (_) {}
  };

  const cleanup = () => {
    try { streamRef.current?.getTracks().forEach((t) => t.stop()); } catch (_) {}
    try { processorRef.current?.disconnect(); } catch (_) {}
    try { if (micCtxRef.current && micCtxRef.current.state !== 'closed') micCtxRef.current.close(); } catch (_) {}
    try { if (wsRef.current?.readyState === WebSocket.OPEN) wsRef.current.close(); } catch (_) {}
    stopPlayback();
  };

  // Reports session duration/turns for admin analytics + cost tracking — fires
  // once per session however it ends (manual "End Session" or connection drop).
  const reportSessionEnd = () => {
    if (reportedRef.current || !sessionLogIdRef.current) return;
    reportedRef.current = true;
    const duration_seconds = startTimeRef.current ? Math.round((Date.now() - startTimeRef.current) / 1000) : 0;
    base44.functions.invoke('geminiLiveProxy', {
      action: 'end_session',
      sessionLogId: sessionLogIdRef.current,
      duration_seconds,
      transcript_turns: turnCountRef.current,
    }).catch(() => {});
  };

  const startSession = async () => {
    setStatus('connecting');
    try {
      const res = await base44.functions.invoke('geminiLiveProxy', {
        action: 'start_session',
        systemPrompt: SYSTEM_PROMPT,
      });
      if (!res.data?.wsUrl) throw new Error(res.data?.error || 'Could not start session');
      const { wsUrl, model, sessionLogId } = res.data;
      sessionLogIdRef.current = sessionLogId || null;
      reportedRef.current = false;
      turnCountRef.current = 0;
      onSessionId?.(sessionLogId || null);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(JSON.stringify({
          setup: {
            model: `models/${model}`,
            generationConfig: {
              responseModalities: ['AUDIO'],
              speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } },
            },
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            enableAffectiveDialog: true,
          },
        }));
      };

      ws.onmessage = async (event) => {
        const raw = typeof event.data === 'string' ? event.data : await event.data.text();
        const data = JSON.parse(raw);

        if (data.setupComplete) {
          setStatus('active');
          startTimeRef.current = Date.now();
          onTranscript({ role: 'system', text: 'Session started.' });
          try {
            await startMicrophone(ws);
          } catch (micErr) {
            onTranscript({ role: 'system', text: 'No microphone was found on this device, so I can hear myself but not you. Please try again from a phone, laptop, or a computer with a microphone connected.' });
            reportSessionEnd();
            cleanup();
            setStatus('ready');
            return;
          }
          if (autoStart) {
            ws.send(JSON.stringify({
              clientContent: { turns: [{ role: 'user', parts: [{ text: GREETING_INSTRUCTION }] }], turnComplete: true },
            }));
          }
          return;
        }

        const parts = data.serverContent?.modelTurn?.parts || [];
        for (const part of parts) {
          if (part.inlineData?.data) {
            playAudioChunk(part.inlineData.data);
            onSpeaker('assistant');
          }
        }
        if (data.serverContent?.inputTranscription?.text) {
          turnCountRef.current += 1;
          onTranscript({ role: 'user', text: data.serverContent.inputTranscription.text });
        }
        if (data.serverContent?.outputTranscription?.text) {
          turnCountRef.current += 1;
          onTranscript({ role: 'assistant', text: data.serverContent.outputTranscription.text });
        }
        if (data.serverContent?.interrupted) {
          stopPlayback();
          onSpeaker(null);
        }
        if (data.serverContent?.turnComplete) {
          onSpeaker(null);
        }
      };
      ws.onerror = () => { reportSessionEnd(); setStatus('ready'); cleanup(); };
      ws.onclose = () => { reportSessionEnd(); setStatus((s) => (s === 'active' || s === 'connecting' ? 'ready' : s)); };
    } catch (err) {
      onTranscript({ role: 'system', text: err.message || 'Failed to start session' });
      setStatus('ready');
    }
  };

  const endSession = () => {
    reportSessionEnd();
    cleanup();
    onSpeaker(null);
    setStatus('ready');
  };

  useEffect(() => {
    if (autoStart) startSession();
    return () => cleanup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6">
      <div className="w-40 h-40 rounded-full flex items-center justify-center transition-all"
        style={{
          background: status === 'active' ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)',
          border: `2px solid ${status === 'active' ? GOLD : 'rgba(212,175,55,0.3)'}`,
          boxShadow: status === 'active' ? `0 0 40px rgba(212,175,55,0.35)` : 'none',
        }}>
        {status === 'connecting' ? (
          <Loader2 className="w-12 h-12 animate-spin" style={{ color: GOLD }} />
        ) : (
          <Mic className="w-12 h-12" style={{ color: GOLD }} />
        )}
      </div>
      <p className="text-sm font-bold tracking-wide" style={{ color: '#fff' }}>
        {status === 'ready' && 'Tap to start talking'}
        {status === 'connecting' && 'Connecting…'}
        {status === 'active' && 'Live — speak naturally'}
      </p>
      {status === 'active' ? (
        <button onClick={endSession}
          className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm"
          style={{ background: '#1a1a1a', border: '1px solid #ef4444', color: '#ef4444' }}>
          <Square className="w-4 h-4" /> End Session
        </button>
      ) : (
        <button onClick={startSession} disabled={status === 'connecting'}
          className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm"
          style={{ background: GOLD, color: '#000' }}>
          <Mic className="w-4 h-4" /> Start Talking
        </button>
      )}
    </div>
  );
}