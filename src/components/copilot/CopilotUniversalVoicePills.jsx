import React, { useEffect, useRef, useState } from 'react';
import { Play, Square, Volume2, VolumeX } from 'lucide-react';
import { stopAllCopilotAudio, subscribeToStopAllAudio, registerActiveMedia } from '@/lib/copilotAudioController';
import { base44 } from '@/api/base44Client';

const pill = 'px-2.5 py-1 rounded-full border text-[9px] font-normal flex items-center gap-1 transition-colors';

export default function CopilotUniversalVoicePills({ text = '', defaultSpeaker = 'charlie', audioUrl = null, autoPlayKey, onPlayingChange }) {
  const [speaker, setSpeaker] = useState(defaultSpeaker === 'bob' ? 'bob' : 'charlie');
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const previousAutoPlayKey = useRef(undefined);
  const studioAudioRef = useRef(null);
  const requestVersionRef = useRef(0);
  const latestTextRef = useRef(text);

  const reportPlaying = (value, activeSpeaker = speaker) => {
    setPlaying(value);
    onPlayingChange?.(value, activeSpeaker);
  };

  useEffect(() => subscribeToStopAllAudio(() => {
    requestVersionRef.current += 1;
    studioAudioRef.current?.pause();
    reportPlaying(false);
  }), [speaker]);
  useEffect(() => {
    latestTextRef.current = text;
    requestVersionRef.current += 1;
    studioAudioRef.current?.pause();
    setLoading(false);
    reportPlaying(false);
  }, [text]);
  useEffect(() => () => {
    studioAudioRef.current?.pause();
  }, []);
  useEffect(() => setSpeaker(defaultSpeaker === 'bob' ? 'bob' : 'charlie'), [defaultSpeaker]);

  const speakText = async (activeSpeaker = speaker) => {
    if (!text || muted) return;
    stopAllCopilotAudio();
    const spokenText = text;
    const requestVersion = ++requestVersionRef.current;

    setLoading(true);
    try {
      const defaultVoice = defaultSpeaker === 'bob' ? 'bob' : 'charlie';
      let resolvedAudioUrl = activeSpeaker === defaultVoice ? audioUrl : null;
      if (!resolvedAudioUrl) {
        const functionName = activeSpeaker === 'bob' ? 'bobSpeak' : 'charlieSpeak';
        const response = await base44.functions.invoke(functionName, { text: spokenText });
        resolvedAudioUrl = response?.data?.audioUrl;
      }
      if (requestVersion !== requestVersionRef.current || spokenText !== latestTextRef.current) return;
      if (!resolvedAudioUrl) return;

      const audio = studioAudioRef.current || new Audio();
      studioAudioRef.current = audio;
      registerActiveMedia(audio);
      audio.pause();
      audio.src = resolvedAudioUrl;
      audio.currentTime = 0;
      audio.volume = 0.72;
      audio.onplay = () => {
        if (requestVersion === requestVersionRef.current) reportPlaying(true, activeSpeaker);
      };
      audio.onended = audio.onerror = () => {
        if (requestVersion === requestVersionRef.current) reportPlaying(false, activeSpeaker);
      };
      await audio.play();
    } catch (error) {
      if (requestVersion === requestVersionRef.current) {
        console.warn(`${activeSpeaker === 'bob' ? 'Bob' : 'Charlie'} studio voice unavailable:`, error);
        reportPlaying(false, activeSpeaker);
      }
    } finally {
      if (requestVersion === requestVersionRef.current) setLoading(false);
    }
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