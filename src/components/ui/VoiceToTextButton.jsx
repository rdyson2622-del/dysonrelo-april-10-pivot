import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square } from 'lucide-react';

const GOLD = '#D4AF37';

/**
 * VoiceToTextButton — a small mic toggle that uses the browser's native
 * Web Speech API to transcribe speech and append it to a target value.
 *
 * Props:
 *   value     — current text value (string)
 *   onChange  — fn(nextValue) called with the appended transcript
 *   disabled  — optional
 *
 * Browser support: Chrome, Edge, Safari (webkitSpeechRecognition).
 * If unsupported, the button renders disabled with a tooltip.
 */
export default function VoiceToTextButton({ value = '', onChange, disabled = false }) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recRef = useRef(null);
  const bufferRef = useRef('');
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setSupported(false); return; }

    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onresult = (e) => {
      let interim = '';
      let final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) final += r[0].transcript;
        else interim += r[0].transcript;
      }
      if (final) {
        const sep = bufferRef.current && !bufferRef.current.endsWith(' ') ? ' ' : '';
        bufferRef.current = bufferRef.current + sep + final.trim();
        onChangeRef.current?.(bufferRef.current);
      }
    };

    rec.onend = () => {
      // Auto-restart while user still wants to listen (Chrome stops after pauses)
      if (listening) {
        try { rec.start(); } catch {}
      } else {
        setListening(false);
      }
    };

    rec.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        setListening(false);
      }
    };

    recRef.current = rec;
    return () => { try { rec.abort(); } catch {} };
  }, []);

  const toggle = () => {
    if (!supported || disabled || !recRef.current) return;
    if (!listening) {
      bufferRef.current = value || '';
      try {
        recRef.current.start();
        setListening(true);
      } catch {}
    } else {
      try { recRef.current.stop(); } catch {}
      setListening(false);
    }
  };

  if (!supported) {
    return (
      <button
        type="button"
        disabled
        title="Voice input not supported in this browser"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold opacity-40 cursor-not-allowed"
        style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', color: '#888' }}
      >
        <Mic className="w-3.5 h-3.5" /> Voice
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={disabled}
      title={listening ? 'Stop voice input' : 'Start voice input'}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all hover:scale-105 active:scale-95"
      style={{
        background: listening ? `${GOLD}22` : '#1a1a1a',
        border: `1px solid ${listening ? GOLD : 'rgba(212,175,55,0.4)'}`,
        color: listening ? GOLD : 'rgba(255,255,255,0.7)',
        boxShadow: listening ? `0 0 12px ${GOLD}66` : 'none',
      }}
    >
      {listening
        ? <><span className="w-2 h-2 rounded-full animate-pulse" style={{ background: GOLD }} /><Square className="w-3 h-3" /> Stop</>
        : <><Mic className="w-3.5 h-3.5" /> Voice</>}
    </button>
  );
}