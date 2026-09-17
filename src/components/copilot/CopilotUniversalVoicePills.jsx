import React, { useEffect, useState } from 'react';
import { Play, Square, Volume2, VolumeX } from 'lucide-react';
import { stopAllCopilotAudio, subscribeToStopAllAudio } from '@/lib/copilotAudioController';

const pill = 'px-2 py-1 rounded-full border text-[9px] font-normal flex items-center gap-1 transition-colors';

export default function CopilotUniversalVoicePills({ text = '', defaultSpeaker = 'charlie' }) {
  const [speaker, setSpeaker] = useState(defaultSpeaker === 'bob' ? 'bob' : 'charlie');
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => subscribeToStopAllAudio(() => setPlaying(false)), []);
  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const choose = (next) => {
    stopAllCopilotAudio();
    setSpeaker(next);
  };
  const toggleVoice = () => {
    if (playing) return stopAllCopilotAudio();
    if (!text || muted || !window.speechSynthesis) return;
    stopAllCopilotAudio();
    const speech = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices().filter((v) => v.lang.startsWith('en'));
    const pattern = speaker === 'bob' ? /david|george|daniel|guy|oliver|tom|james|male/i : /alex|aaron|arthur|ryan|fred|daniel|male|en-gb/i;
    speech.voice = voices.find((v) => pattern.test(v.name)) || voices[0] || null;
    speech.rate = speaker === 'bob' ? 0.92 : 1;
    speech.pitch = speaker === 'bob' ? 0.86 : 1;
    speech.onstart = () => setPlaying(true);
    speech.onend = speech.onerror = () => setPlaying(false);
    window.speechSynthesis.speak(speech);
  };
  const toggleMute = () => {
    stopAllCopilotAudio();
    setMuted((value) => !value);
  };

  return <div className="flex items-center gap-1" aria-label="Voice controls">
    {['charlie', 'bob'].map((name) => <button key={name} type="button" onClick={() => choose(name)} className={`${pill} ${speaker === name ? 'border-dyson-gold text-dyson-gold bg-dyson-gold/10' : 'border-white/15 text-stone-300 bg-white/5'}`}>{name === 'bob' ? 'Bob' : 'Charlie'}</button>)}
    <button type="button" onClick={toggleVoice} disabled={!text || muted} className={`${pill} border-white/20 text-white bg-white/5 disabled:opacity-40`}>{playing ? <Square className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}{playing ? 'Stop' : 'Voice'}</button>
    <button type="button" onClick={toggleMute} className={`${pill} ${muted ? 'border-status-stop text-status-stop bg-status-stop/10' : 'border-white/15 text-stone-300 bg-white/5'}`}>{muted ? <VolumeX className="w-2.5 h-2.5" /> : <Volume2 className="w-2.5 h-2.5" />}{muted ? 'Off' : 'Mute'}</button>
  </div>;
}