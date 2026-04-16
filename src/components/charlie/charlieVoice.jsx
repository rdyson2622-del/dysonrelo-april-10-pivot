// Charlie voice — routed exclusively through Google Cloud TTS via charlieSpeak backend function
// Voice: en-US-Chirp3-HD-Charon (deep, authoritative male)
// No browser TTS. No Web Speech API. One voice. One source.

import { base44 } from '@/api/base44Client';

let currentAudio = null;

function cleanText(text) {
  return text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/#+\s/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[👉👋🎙️🗺️🤝🎉]/g, '')
    .replace(/\n+/g, ' ')
    .trim();
}

export async function speakAsCharlie(text, onEnd, onStart) {
  stopCharlie(); // always cancel previous before starting new

  const clean = cleanText(text);
  if (!clean) return;

  try {
    const res = await base44.functions.invoke('charlieSpeak', { text: clean });
    const { audio, mimeType } = res.data;
    if (!audio) return;

    const binary = atob(audio);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: mimeType || 'audio/wav' });
    const url = URL.createObjectURL(blob);

    const audioEl = new Audio(url);
    currentAudio = audioEl;
    if (onStart) onStart();
    audioEl.onended = () => {
      URL.revokeObjectURL(url);
      currentAudio = null;
      if (onEnd) onEnd();
    };
    audioEl.onerror = () => {
      URL.revokeObjectURL(url);
      currentAudio = null;
      if (onEnd) onEnd();
    };
    audioEl.play();
  } catch (e) {
    console.warn('Charlie TTS failed:', e.message);
    if (onEnd) onEnd();
  }
}

export function stopCharlie() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
}

export function isCharlieSpeaking() {
  return currentAudio !== null && !currentAudio.paused;
}