import { base44 } from '@/api/base44Client';

let currentSource = null;
let currentCtx = null;

// Stop any currently playing Charlie audio
export function stopCharlie() {
  try {
    if (currentSource) {
      currentSource.onended = null;
      currentSource.stop();
      currentSource = null;
    }
    if (currentCtx) {
      currentCtx.close();
      currentCtx = null;
    }
  } catch (e) {
    // ignore
  }
}

// Plays text using Charlie's Enceladus voice via backend TTS
export async function speakAsCharlie(text, onStart, onEnd) {
  // Stop any previous audio first
  stopCharlie();

  if (onStart) onStart();
  try {
    const res = await base44.functions.invoke('charlieSpeak', { text });
    const { audio } = res.data;
    if (!audio) throw new Error('No audio');

    // Decode base64 LINEAR16 PCM and play via Web Audio API
    const raw = atob(audio);
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    currentCtx = audioCtx;

    const sampleRate = 22050;
    const numSamples = bytes.buffer.byteLength / 2;
    const audioBuffer = audioCtx.createBuffer(1, numSamples, sampleRate);
    const channelData = audioBuffer.getChannelData(0);
    const dataView = new DataView(bytes.buffer);
    for (let i = 0; i < numSamples; i++) {
      channelData[i] = dataView.getInt16(i * 2, true) / 32768;
    }

    const source = audioCtx.createBufferSource();
    currentSource = source;
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.onended = () => {
      currentSource = null;
      currentCtx = null;
      if (onEnd) onEnd();
      audioCtx.close();
    };
    source.start();
  } catch (e) {
    console.error('Charlie TTS error:', e);
    currentSource = null;
    currentCtx = null;
    if (onEnd) onEnd();
  }
}