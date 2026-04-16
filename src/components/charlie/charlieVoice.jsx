// Charlie voice using Web Speech API — male voice, no repeat
let currentUtterance = null;
let voicesLoaded = false;

function getVoices() {
  return window.speechSynthesis?.getVoices() || [];
}

function pickMaleVoice() {
  const voices = getVoices();
  // Prefer known male US English voices
  const preferred = voices.find(v => v.name === 'Google US English Male') ||
    voices.find(v => v.name === 'Microsoft David Desktop') ||
    voices.find(v => v.name === 'Microsoft David - English (United States)') ||
    voices.find(v => v.name.toLowerCase().includes('david')) ||
    voices.find(v => v.name.toLowerCase().includes('male') && v.lang.startsWith('en')) ||
    voices.find(v => v.name === 'Alex') ||  // macOS male
    voices.find(v => v.name === 'Fred') ||  // macOS male
    voices.find(v => v.name === 'Daniel') || // UK male but better than female
    voices.find(v => v.lang === 'en-US' && !['Samantha','Karen','Victoria','Susan','Zira','Hazel','Moira'].some(f => v.name.includes(f)));
  return preferred || voices.find(v => v.lang.startsWith('en')) || voices[0];
}

export function speakAsCharlie(text, onEnd) {
  if (!window.speechSynthesis) return;

  // Do NOT speak if already speaking — prevents repeats
  if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
    return;
  }

  const clean = text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/#+\s/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[👉👋🎙️🗺️🤝🎉]/g, '')
    .trim();

  if (!clean) return;

  const utterance = new SpeechSynthesisUtterance(clean);
  const voice = pickMaleVoice();
  if (voice) utterance.voice = voice;
  utterance.rate = 0.92;
  utterance.pitch = 0.85; // lower pitch = more masculine
  utterance.volume = 1.0;
  if (onEnd) utterance.onend = onEnd;

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function stopCharlie() {
  window.speechSynthesis?.cancel();
  currentUtterance = null;
}

export function isCharlieSpeaking() {
  return window.speechSynthesis?.speaking || false;
}