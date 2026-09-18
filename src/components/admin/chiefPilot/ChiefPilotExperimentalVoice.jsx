import React, { useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { registerActiveMedia, stopAllCopilotAudio } from '@/lib/copilotAudioController';

export default function ChiefPilotExperimentalVoice() {
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState('idle');
  const audioRef = useRef(null);
  const stop = () => { stopAllCopilotAudio(); setStatus('idle'); };
  const toggle = () => {
    if (enabled) stop();
    setEnabled(value => !value);
  };
  const start = async () => {
    if (!enabled || status === 'loading') return;
    stopAllCopilotAudio(); setStatus('loading');
    const response = await base44.functions.invoke('charlieSpeak', { text: 'Chief Pilot experimental voice test. Manual playback is active.' });
    const url = response?.data?.audioUrl;
    if (!url) { setStatus('idle'); return; }
    const audio = new Audio(url);
    audioRef.current = audio; registerActiveMedia(audio);
    audio.onplay = () => setStatus('playing');
    audio.onended = audio.onerror = () => setStatus('idle');
    await audio.play();
  };
  return (
    <div className="flex items-center gap-2 text-xs">
      <button type="button" aria-pressed={enabled} onClick={toggle} className="rounded-full border border-white/15 px-3 py-2 text-dyson-taupe">Experimental: Voice · {enabled ? 'ON' : 'OFF'}</button>
      {enabled && <><button type="button" onClick={start} disabled={status !== 'idle'} className="text-dyson-text disabled:opacity-40">{status === 'loading' ? 'Loading…' : 'Start'}</button><button type="button" onClick={stop} disabled={status !== 'playing'} className="text-dyson-taupe disabled:opacity-40">Stop</button></>}
    </div>
  );
}