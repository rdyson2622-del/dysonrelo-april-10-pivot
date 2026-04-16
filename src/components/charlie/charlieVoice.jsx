// Charlie voice using Web Speech API (browser TTS) — reliable, no lag
// Falls back silently if browser doesn't support it

let currentUtterance = null;

export function speakAsCharlie(text, onEnd) {
  if (!window.speechSynthesis) return;

  // Stop anything already playing
  stopCharlie();

  // Strip markdown symbols for cleaner speech
  const clean = text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/#+\s/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links → just text
    .replace(/👉|👋|🎙️|🗺️|🤝|🎉/g, '')
    .trim();

  const utterance = new SpeechSynthesisUtterance(clean);

  // Pick best available voice — prefer a natural US English voice
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v =>
    v.name.includes('Samantha') ||
    v.name.includes('Karen') ||
    v.name.includes('Google US English') ||
    (v.lang === 'en-US' && !v.name.includes('Zira'))
  ) || voices.find(v => v.lang === 'en-US') || voices[0];

  if (preferred) utterance.voice = preferred;
  utterance.rate = 0.95;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  if (onEnd) utterance.onend = onEnd;

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function stopCharlie() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
}

export function isCharlieSpeaking() {
  return window.speechSynthesis?.speaking || false;
}