import React, { useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';
const SYSTEM_PROMPT = `You are Charlie, the AI voice concierge for Dyson & Dyson Companies. Be warm, conversational, and helpful — answer real estate and relocation questions naturally. If you don't know something, offer to connect the caller with the human team.`;

export default function TalkingOrb({ status, setStatus, onTranscript, onSpeaker }) {
  const wsRef = useRef(null);
  const audioCtxRef = useRef(null);
  const processorRef = useRef(null);
  const streamRef = useRef(null);

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
      for (let i = 0; i < input.length; i++) pcm[i] = Math.max(-32768, Math.min(32767, input[i] * 32768));
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
      for (let i = 0; i < numSamples; i++) data[i] = view.getInt16(i * 2, true) / 32768;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start();
    } catch (e) { console.error('Audio playback error:', e); }
  };

  const cleanup = () => {
    try { streamRef.current?.getTracks().forEach(t => t.stop()); } catch (_) {}
    try { processorRef.current?.disconnect(); } catch (_) {}
    try { if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') audioCtxRef.current.close(); } catch (_) {}
    try { if (wsRef.current?.readyState === WebSocket.OPEN) wsRef.current.close(); } catch (_) {}
  };

  const startSession = async () => {
    setStatus('connecting');
    try {
      const res = await base44.functions.invoke('geminiLiveProxy', {
        action: 'start_session',
        systemPrompt: SYSTEM_PROMPT,
      });
      if (!res.data?.wsUrl) throw new Error('Could not start session');
      const ws = new WebSocket(res.data.wsUrl);
      wsRef.current = ws;

      ws.onopen = async () => {
        setStatus('active');
        onTranscript({ role: 'system', text: 'Session started — speak naturally.' });
        await startMicrophone(ws);
      };
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'audio') {
          playAudio(data.audio);
          onSpeaker('assistant');
        } else if (data.type === 'transcript') {
          onTranscript({ role: data.role === 'user' ? 'user' : 'assistant', text: data.text });
          onSpeaker(data.role === 'user' ? 'user' : 'assistant');
        } else if (data.type === 'turn_complete') {
          onSpeaker(null);
        }
      };
      ws.onerror = () => { setStatus('ready'); cleanup(); };
      ws.onclose = () => { setStatus((s) => (s === 'active' ? 'ready' : s)); };
    } catch (err) {
      onTranscript({ role: 'system', text: err.message || 'Failed to start session' });
      setStatus('ready');
    }
  };

  const endSession = () => {
    cleanup();
    onSpeaker(null);
    setStatus('ready');
  };

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