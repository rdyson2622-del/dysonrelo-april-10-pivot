import React, { useRef, useState } from 'react';
import { Mic, Square, FlaskConical } from 'lucide-react';
import { GeminiLiveSessionClient } from '@/lib/geminiLiveClient';

// Isolated, opt-in test of the native Gemini Live bidirectional voice-to-voice
// WebSocket (no text-to-speech step). Lives only inside My Library for
// Preferred Clients — does not touch the production search bars, subject
// explainers, or front door hybrid text/voice setup.
export default function ChiefPilotLiveVoiceTest() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('idle');
  const [transcript, setTranscript] = useState([]);
  const [error, setError] = useState('');
  const clientRef = useRef(null);

  const start = () => {
    setError(''); setTranscript([]); setStatus('connecting');
    const client = new GeminiLiveSessionClient({
      onStatusChange: setStatus,
      onTranscript: entry => setTranscript(current => [...current, entry]),
      onError: err => setError(typeof err === 'string' ? err : err?.message || 'Voice connection error.'),
    });
    clientRef.current = client;
    client.start();
  };

  const stop = () => {
    clientRef.current?.stop();
    clientRef.current = null;
    setStatus('idle');
  };

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="mt-8 flex w-full items-center gap-2 rounded-xl border border-dashed border-dyson-gold-deep/50 bg-dyson-warm-paper px-4 py-3 text-left text-xs font-semibold text-dyson-gold-deep">
        <FlaskConical className="h-4 w-4 shrink-0" /> Test isolated Live Voice (Beta) — native voice-to-voice, opt-in only
      </button>
    );
  }

  return (
    <div className="mt-8 rounded-xl border border-dyson-gold-deep/40 bg-dyson-black p-5">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-xs font-semibold text-dyson-gold"><FlaskConical className="h-3.5 w-3.5" /> Live Voice Test (Beta) — isolated, does not affect any other Chief Pilot chat</p>
        <button type="button" onClick={() => { stop(); setOpen(false); }} className="text-xs text-dyson-taupe underline underline-offset-4">Close</button>
      </div>
      <p className="mt-2 text-xs text-dyson-taupe">Native bidirectional voice via Gemini Live — no text-to-speech delay. For internal latency/quality testing only.</p>
      <div className="mt-4 flex items-center gap-3">
        {status === 'idle' || status === 'ready' || status === 'error' ? (
          <button type="button" onClick={start} className="inline-flex items-center gap-2 rounded-full bg-dyson-gold-deep px-4 py-2 text-xs font-semibold text-black"><Mic className="h-3.5 w-3.5" /> Start Live Voice Test</button>
        ) : (
          <button type="button" onClick={stop} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white"><Square className="h-3.5 w-3.5" /> End Session</button>
        )}
        <span className="text-xs text-dyson-taupe">Status: {status}</span>
      </div>
      {error && <p className="mt-3 text-xs text-status-stop">{error}</p>}
      {transcript.length > 0 && (
        <div className="mt-4 max-h-60 space-y-2 overflow-y-auto border-t border-white/10 pt-3">
          {transcript.map((entry, index) => (
            <p key={index} className="text-xs leading-5 text-white"><span className="font-semibold text-dyson-gold">{entry.role === 'user' ? 'You: ' : 'Charlie: '}</span>{entry.text}</p>
          ))}
        </div>
      )}
    </div>
  );
}