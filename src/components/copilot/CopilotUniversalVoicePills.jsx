import React, { useEffect, useRef, useState } from 'react';
import { Play, Square, Volume2, VolumeX } from 'lucide-react';
import { stopAllCopilotAudio, subscribeToStopAllAudio, registerActiveMedia } from '@/lib/copilotAudioController';
import { base44 } from '@/api/base44Client';

const pill = 'px-2.5 py-1 rounded-full border text-[9px] font-normal flex items-center gap-1 transition-colors';

export default function CopilotUniversalVoicePills({ text = '', defaultSpeaker = 'charlie', autoPlayKey, onPlayingChange }) {
  const [speaker, setSpeaker] = useState(defaultSpeaker === 'bob' ? 'bob' : 'charlie');
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const previousAutoPlayKey = useRef(undefined);
  const studioAudioRef = useRef(null);

  const reportPlaying = (value, activeSpeaker = speaker) => {
    setPlaying(value);
    onPlayingChange?.(value, activeSpeaker);
  };

  useEffect(() => subscribeToStopAllAudio(() => {
    studioAudioRef.current?.pause();
    reportPlaying(false);
  }), [speaker]);
  useEffect(() => () => {
    studioAudioRef.current?.pause();
    window.speechSynthesis?.cancel();
  }, []);
  useEffect(() => setSpeaker(defaultSpeaker === 'bob' ? 'bob' : 'charlie'), [defaultSpeaker]);

  const speakText = async (activeSpeaker = speaker) => {
    if (!text || muted) return;
    stopAllCopilotAudio();

    if (activeSpeaker === 'charlie') {
      setLoading(true);
      try {
        const response = await base44.functions.invoke('charlieSpeak', { text });
        const audioUrl = response?.data?.audioUrl;
        if (!audioUrl) return;

        const audio = studioAudioRef.current || new Audio();
        studioAudioRef.current = audio;
        registerActiveMedia(audio);
        audio.pause();
        audio.src = audioUrl;
        audio.currentTime = 0;
        audio.volume = 0.72;
        audio.onplay = () => reportPlaying(true, 'charlie');
        audio.onended = audio.onerror = () => reportPlaying(false, 'charlie');
        await audio.play();
      } catch (error) {
        console.warn('Charlie studio voice unavailable:', error);
        reportPlaying(false, 'charlie');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!window.speechSynthesis) return;
    const voices = window.speechSynthesis.getVoices().filter((voice) => voice.lang.startsWith('en'));
    const trustedBobVoice = voices.find((voice) => /david|george|daniel|guy|oliver|tom|james|male/i.test(voice.name));
    if (!trustedBobVoice) return;
    const speech = new SpeechSynthesisUtterance(text);
    speech.voice = trustedBobVoice;
    speech.rate = 0.92;
    speech.pitch = 0.86;
    speech.onstart = () => reportPlaying(true, 'bob');
    speech.onend = speech.onerror = () => reportPlaying(false, 'bob');
    window.speechSynthesis.speak(speech);
  };

  useEffect(() => {
    if (autoPlayKey === undefined || !text || muted || autoPlayKey === previousAutoPlayKey.current) return;
    previousAutoPlayKey.current = autoPlayKey;
    const activeSpeaker = defaultSpeaker === 'bob' ? 'bob' : 'charlie';
    setSpeaker(activeSpeaker);
    const startTimer = window.setTimeout(() => speakText(activeSpeaker), 80);
    return () => window.clearTimeout(startTimer);
  }, [autoPlayKey, text, defaultSpeaker, muted]);

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
    <button type="button" onClick={toggleVoice} disabled={!text || muted || loading} className={`${pill} ${playing ? 'border-status-complete text-status-complete bg-status-complete/10' : 'border-white/20 text-white bg-white/5'} disabled:opacity-40`}>{playing ? <Square className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}{loading ? 'Loading' : playing ? 'Stop' : 'Voice'}</button>
    <button type="button" onClick={toggleMute} className={`${pill} ${muted ? 'border-status-stop text-status-stop bg-status-stop/10' : 'border-white/15 text-stone-300 bg-white/5'}`}>{muted ? <VolumeX className="w-2.5 h-2.5" /> : <Volume2 className="w-2.5 h-2.5" />}{muted ? 'Off' : 'Mute'}</button>
  </div>;
}