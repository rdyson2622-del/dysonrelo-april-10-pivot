import React, { useEffect, useRef, useState } from 'react';
import { Play, Square, Volume2, VolumeX } from 'lucide-react';
import { stopAllCopilotAudio, subscribeToStopAllAudio } from '@/lib/copilotAudioController';

const pill = 'px-2.5 py-1 rounded-full border text-[9px] font-normal flex items-center gap-1 transition-colors';

export default function CopilotUniversalVoicePills({ text = '', defaultSpeaker = 'charlie', autoPlayKey, onPlayingChange }) {
  const [speaker, setSpeaker] = useState(defaultSpeaker === 'bob' ? 'bob' : 'charlie');
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const previousAutoPlayKey = useRef(autoPlayKey);

  const reportPlaying = (value, activeSpeaker = speaker) => {
    setPlaying(value);
    onPlayingChange?.(value, activeSpeaker);
  };

  useEffect(() => subscribeToStopAllAudio(() => reportPlaying(false)), [speaker]);
  useEffect(() => () => window.speechSynthesis?.cancel(), []);
  useEffect(() => setSpeaker(defaultSpeaker === 'bob' ? 'bob' : 'charlie'), [defaultSpeaker]);

  const speakText = (activeSpeaker = speaker) => {
    if (!text || muted || !window.speechSynthesis) return;
    stopAllCopilotAudio();
    const speech = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices().filter((voice) => voice.lang.startsWith('en'));
    const pattern = activeSpeaker === 'bob' ? /david|george|daniel|guy|oliver|tom|james|male/i : /alex|aaron|arthur|ryan|fred|daniel|male|en-gb/i;
    speech.voice = voices.find((voice) => pattern.test(voice.name)) || voices[0] || null;
    speech.rate = activeSpeaker === 'bob' ? 0.92 : 1;
    speech.pitch = activeSpeaker === 'bob' ? 0.86 : 1;
    speech.onstart = () => reportPlaying(true, activeSpeaker);
    speech.onend = speech.onerror = () => reportPlaying(false, activeSpeaker);
    window.speechSynthesis.speak(speech);
  };

  useEffect(() => {
    if (autoPlayKey === undefined || autoPlayKey === previousAutoPlayKey.current) return;
    previousAutoPlayKey.current = autoPlayKey;
    const activeSpeaker = defaultSpeaker === 'bob' ? 'bob' : 'charlie';
    setSpeaker(activeSpeaker);
    speakText(activeSpeaker);
  }, [autoPlayKey]);

  const choose = (next) => {
    stopAllCopilotAudio();
    setSpeaker(next);
  };
  const toggleVoice = () => playing ? stopAllCopilotAudio() : speakText();
  const toggleMute = () => {
    stopAllCopilotAudio();
    setMuted((value) => !value);
  };

  return <div className="flex items-center gap-1" aria-label="Voice controls">
    {['charlie', 'bob'].map((name) => <button key={name} type="button" onClick={() => choose(name)} className={`${pill} ${speaker === name ? (playing ? 'border-status-complete text-status-complete bg-status-complete/10' : 'border-dyson-gold text-dyson-gold bg-dyson-gold/10') : 'border-white/15 text-stone-300 bg-white/5'}`}>{name === 'bob' ? 'Bob' : 'Charlie'}</button>)}
    <button type="button" onClick={toggleVoice} disabled={!text || muted} className={`${pill} ${playing ? 'border-status-complete text-status-complete bg-status-complete/10' : 'border-white/20 text-white bg-white/5'} disabled:opacity-40`}>{playing ? <Square className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}{playing ? 'Stop' : 'Voice'}</button>
    <button type="button" onClick={toggleMute} className={`${pill} ${muted ? 'border-status-stop text-status-stop bg-status-stop/10' : 'border-white/15 text-stone-300 bg-white/5'}`}>{muted ? <VolumeX className="w-2.5 h-2.5" /> : <Volume2 className="w-2.5 h-2.5" />}{muted ? 'Off' : 'Mute'}</button>
  </div>;
}