import { base44 } from '@/api/base44Client';
import { 
  CHARLIE_SIMMONS_SYSTEM_PROMPT, 
  CHARLIE_VOICE_NAME, 
  CHARLIE_VOICE_LANGUAGE 
} from '@/lib/charlieSimmonsPrompt';

/**
 * Gemini Live Duplex Audio Streaming Player
 * Plays incoming raw PCM audio chunks (24000Hz 16-bit mono) from Gemini Live serverContent.modelTurn.parts inlineData.
 */
class StreamingPcmPlayer {
  constructor(sampleRate = 24000) {
    this.sampleRate = sampleRate;
    this.ctx = null;
    this.nextPlayTime = 0;
    this.activeNodes = [];
    this.isPlaying = false;
  }

  ensureContext() {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playChunk(base64Data, { onStart, onEnded } = {}) {
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const binary = atob(base64Data);
      const len = binary.length - (binary.length % 2);
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      // Convert 16-bit signed PCM (little endian) to Float32
      const pcm16 = new Int16Array(bytes.buffer, 0, len / 2);
      const float32 = new Float32Array(pcm16.length);
      for (let i = 0; i < pcm16.length; i++) {
        float32[i] = pcm16[i] / 32768.0;
      }

      const buffer = this.ctx.createBuffer(1, float32.length, this.sampleRate);
      buffer.copyToChannel(float32, 0);

      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(this.ctx.destination);

      const currentTime = this.ctx.currentTime;
      const startTime = Math.max(currentTime, this.nextPlayTime);
      source.start(startTime);
      this.nextPlayTime = startTime + buffer.duration;
      this.activeNodes.push(source);

      if (!this.isPlaying) {
        this.isPlaying = true;
        onStart?.();
      }

      source.onended = () => {
        const idx = this.activeNodes.indexOf(source);
        if (idx !== -1) {
          this.activeNodes.splice(idx, 1);
        }
        if (this.activeNodes.length === 0) {
          this.isPlaying = false;
          onEnded?.();
        }
      };
    } catch (err) {
      console.warn('PCM audio playback error:', err);
    }
  }

  stop() {
    this.activeNodes.forEach((node) => {
      try {
        node.stop();
      } catch (_) {}
    });
    this.activeNodes = [];
    if (this.ctx) {
      this.nextPlayTime = this.ctx.currentTime;
    }
    this.isPlaying = false;
  }

  close() {
    this.stop();
    if (this.ctx && this.ctx.state !== 'closed') {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}

/**
 * Helper to convert Float32 audio to 16-bit PCM ArrayBuffer
 */
function convertFloat32ToInt16(float32Array) {
  const pcm16 = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return pcm16;
}

/**
 * Downsample audio buffer to 16000Hz for Gemini Live
 */
function downsampleBuffer(buffer, inputSampleRate, outputSampleRate = 16000) {
  if (inputSampleRate === outputSampleRate) {
    return buffer;
  }
  const sampleRateRatio = inputSampleRate / outputSampleRate;
  const newLength = Math.round(buffer.length / sampleRateRatio);
  const result = new Float32Array(newLength);
  let offsetResult = 0;
  let offsetBuffer = 0;
  while (offsetResult < result.length) {
    const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
    let accum = 0;
    let count = 0;
    for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
      accum += buffer[i];
      count++;
    }
    result[offsetResult] = count > 0 ? accum / count : 0;
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }
  return result;
}

/**
 * Base64 encode an Int16Array PCM buffer
 */
function base64EncodePCM(pcm16Array) {
  let binary = '';
  const bytes = new Uint8Array(pcm16Array.buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Gemini Live Duplex Session Client
 * 
 * True duplex streaming over Google's Multimodal Live WebSocket:
 * - Client sends setup on open (model, voiceName: 'Algieba', language: 'en-US')
 * - Client streams microphone PCM audio via realtimeInput.mediaChunks
 * - Client receives and plays serverContent.modelTurn.parts inlineData (24kHz PCM)
 * - Immediate interruption handling (serverContent.interrupted)
 * - Navigation parsing: household to /relocation-intake, HR/corporate to /corporate-relo, ambiguous ask once
 */
export class GeminiLiveSessionClient {
  constructor(options = {}) {
    const {
      systemPrompt,
      voiceName,
      language,
      onStatusChange,
      onTranscript,
      onSpeaker,
      onError,
      onSessionLogId,
      onPendingNavigate,
      onCancelNavigate,
      onNavigate,
    } = options;

    this.systemPrompt = systemPrompt || CHARLIE_SIMMONS_SYSTEM_PROMPT;
    this.voiceName = voiceName || CHARLIE_VOICE_NAME || 'Algieba';
    this.language = language || CHARLIE_VOICE_LANGUAGE || 'en-US';

    this.onStatusChange = onStatusChange;
    this.onTranscript = onTranscript;
    this.onSpeaker = onSpeaker;
    this.onError = onError;
    this.onSessionLogId = onSessionLogId;
    this.onPendingNavigate = onPendingNavigate;
    this.onCancelNavigate = onCancelNavigate;
    this.onNavigate = onNavigate;

    this.ws = null;
    this.sessionLogId = null;
    this.startTime = null;
    this.turnCount = 0;
    this.active = false;
    this.pendingNav = null;
    this.accumulatedTurnText = '';

    // Audio input/output
    this.micStream = null;
    this.micCtx = null;
    this.scriptProcessor = null;
    this.pcmPlayer = new StreamingPcmPlayer(24000);
    this.passiveSpeechRec = null;
  }

  async start() {
    try {
      this.active = true;
      this.turnCount = 0;
      this.startTime = Date.now();
      this.onStatusChange?.('connecting');

      // Unlock AudioContext immediately within user tap gesture
      this.pcmPlayer.ensureContext();

      // 1. Handshake with backend to validate session & get secure Google WebSocket URL
      const res = await base44.functions.invoke('geminiLiveProxy', {
        action: 'start_session',
        systemPrompt: this.systemPrompt,
      });

      if (!res.data?.wsUrl) {
        throw new Error(res.data?.error || 'Failed to initialize Gemini Live session');
      }

      const { wsUrl, model, systemPrompt, voiceName, language, sessionLogId } = res.data;
      this.sessionLogId = sessionLogId;
      if (sessionLogId) {
        this.onSessionLogId?.(sessionLogId);
      }

      const resolvedVoiceName = voiceName || this.voiceName || 'Algieba';
      const resolvedModel = model 
        ? (model.startsWith('models/') ? model : `models/${model}`) 
        : 'models/gemini-2.0-flash-exp';

      // 2. Establish Google Multimodal Live WebSocket
      const ws = new WebSocket(wsUrl);
      this.ws = ws;

      ws.onopen = async () => {
        if (!this.active) {
          ws.close();
          return;
        }

        // 3. Client sends setup message
        const setupMessage = {
          setup: {
            model: resolvedModel,
            generationConfig: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: 'Algieba',
                  },
                },
              },
            },
            systemInstruction: {
              parts: [
                {
                  text: systemPrompt || this.systemPrompt,
                },
              ],
            },
          },
        };

        ws.send(JSON.stringify(setupMessage));

        // 4. Start microphone duplex streaming
        await this.startMicrophoneStream();

        // 5. Start passive speech recognition for local transcript display
        this.startPassiveSpeechRecognition();

        // 6. Prompt Charlie to speak his opening voice greeting over Algieba
        const greetingPrompt = {
          clientContent: {
            turns: [
              {
                role: 'user',
                parts: [{ text: 'Hello Charlie. Please introduce yourself in one short sentence and ask how you can assist.' }],
              },
            ],
            turnComplete: true,
          },
        };
        ws.send(JSON.stringify(greetingPrompt));

        this.onStatusChange?.('listening');
      };

      ws.onmessage = async (event) => {
        if (!this.active) return;

        try {
          let rawData = event.data;
          if (rawData instanceof Blob) {
            rawData = await rawData.text();
          }
          const msg = JSON.parse(rawData);

          // Real-time interruption by user
          if (msg.serverContent?.interrupted) {
            this.pcmPlayer.stop();
            this.accumulatedTurnText = '';
            this.onSpeaker?.('user');
            this.onStatusChange?.('listening');
            return;
          }

          // Handle serverContent model turn parts
          if (msg.serverContent?.modelTurn?.parts) {
            for (const part of msg.serverContent.modelTurn.parts) {
              // Play incoming raw PCM audio chunk
              if (part.inlineData?.data) {
                this.onSpeaker?.('assistant');
                this.onStatusChange?.('speaking');

                this.pcmPlayer.playChunk(part.inlineData.data, {
                  onStart: () => {
                    this.onSpeaker?.('assistant');
                    this.onStatusChange?.('speaking');
                  },
                  onEnded: () => {
                    if (this.active) {
                      this.onSpeaker?.(null);
                      this.onStatusChange?.('listening');
                    }
                  },
                });
              }

              // Process transcript text and navigation directives
              if (part.text) {
                this.handleIncomingText(part.text);
              }
            }
          }

          if (msg.serverContent?.turnComplete) {
            this.turnCount++;
            this.accumulatedTurnText = '';
          }
        } catch (e) {
          console.warn('Error parsing Gemini Live message:', e);
        }
      };

      ws.onerror = (e) => {
        console.warn('Gemini Live WebSocket error:', e);
        this.onError?.('Voice connection error. Tap to retry.');
        this.onStatusChange?.('error');
      };

      ws.onclose = () => {
        if (this.active) {
          this.onStatusChange?.('ready');
        }
      };

    } catch (err) {
      console.warn('Gemini Live start error:', err);
      this.onError?.(err?.message || 'Could not connect to Gemini Live.');
      this.onStatusChange?.('error');
    }
  }

  /**
   * Captures microphone audio, downsamples to 16kHz, encodes to 16-bit PCM,
   * and streams directly over WebSocket via realtimeInput.mediaChunks
   */
  async startMicrophoneStream() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      this.micStream = stream;

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        await ctx.resume().catch(() => {});
      }
      this.micCtx = ctx;

      const source = ctx.createMediaStreamSource(stream);
      // ScriptProcessor buffer size of 2048 (~40ms-120ms chunk depending on hardware sample rate)
      const processor = ctx.createScriptProcessor(2048, 1, 1);
      this.scriptProcessor = processor;

      processor.onaudioprocess = (e) => {
        if (!this.active || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;

        const inputChannelData = e.inputBuffer.getChannelData(0);
        const downsampled = downsampleBuffer(inputChannelData, ctx.sampleRate, 16000);
        const pcm16 = convertFloat32ToInt16(downsampled);
        const base64Data = base64EncodePCM(pcm16);

        // Stream real-time media chunk to Gemini Live
        this.ws.send(
          JSON.stringify({
            realtimeInput: {
              mediaChunks: [
                {
                  mimeType: 'audio/pcm;rate=16000',
                  data: base64Data,
                },
              ],
            },
          })
        );
      };

      source.connect(processor);
      processor.connect(ctx.destination);
    } catch (err) {
      console.warn('Microphone stream setup error:', err);
      this.onError?.('Microphone access was denied or unavailable.');
    }
  }

  /**
   * Passive local SpeechRecognition solely to populate the user's side
   * of the transcript in the UI while Gemini Live processes duplex audio.
   */
  startPassiveSpeechRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return;

    try {
      const rec = new SpeechRec();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';
      this.passiveSpeechRec = rec;

      rec.onresult = (event) => {
        if (!this.active) return;
        let final = '';
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) final += res[0].transcript;
          else interim += res[0].transcript;
        }
        const userText = (final || interim).trim();
        if (userText) {
          this.onSpeaker?.('user');
          if (final.trim()) {
            this.onTranscript?.({ role: 'user', text: final.trim() });
          }
        }
      };

      rec.onerror = () => {};
      rec.onend = () => {
        if (this.active && this.passiveSpeechRec) {
          try {
            this.passiveSpeechRec.start();
          } catch (_) {}
        }
      };

      rec.start();
    } catch (_) {}
  }

  /**
   * Handles incoming text and executes navigation according to strict routing rules:
   * 1. Household/consumer move -> /relocation-intake
   * 2. Corporate/HR move -> /corporate-relo
   * 3. Ambiguous -> ask once before navigating
   */
  handleIncomingText(text) {
    if (!text) return;
    this.accumulatedTurnText += text;
    const fullText = this.accumulatedTurnText;

    const navMatch =
      fullText.match(/\[NAVIGATE:\s*([^\]|]+)(?:\|\s*([^\]]+))?\]/i) ||
      fullText.match(/navigate_to_page\s*\(?['"]?([\/a-z0-9_:-]+)['"]?(?:,\s*['"]?([^'")]*)['"]?)?\)?/i);

    if (navMatch) {
      let navPath = navMatch[1].trim();
      let navTitle = (navMatch[2] || navPath).trim();

      // Enforce strict relocation routing
      if (navPath.includes('corporate') || navPath.includes('hr')) {
        navPath = '/corporate-relo';
        navTitle = 'Corporate Relocation';
      } else if (navPath.includes('relocation') || navPath.includes('intake') || navPath.includes('household')) {
        navPath = '/relocation-intake';
        navTitle = 'Relocation Plan & Intake';
      }

      const isMls = navPath.includes('realtor.com') || navPath.includes('homes.com');
      let location = null;
      if (isMls) {
        const locMatch = navPath.match(/realestateandhomes-search\/([^\/?#]+)/i) || navPath.match(/for-sale\/([^\/?#]+)/i);
        if (locMatch) {
          let raw = decodeURIComponent(locMatch[1]).replace(/_/g, ', ').replace(/-/g, ' ');
          const stateMatch = raw.match(/^(.*)([A-Z]{2})$/);
          if (stateMatch && !raw.includes(',')) {
            raw = `${stateMatch[1].trim()}, ${stateMatch[2]}`;
          }
          location = raw;
        }
      }

      const navTarget = {
        type: isMls ? 'mls_search' : 'navigate',
        path: navPath,
        url: navPath.startsWith('http') ? navPath : null,
        title: navTitle,
        location,
      };

      this.pendingNav = navTarget;
      this.onPendingNavigate?.(navTarget);
      this.onNavigate?.(navTarget);

      if (typeof window !== 'undefined') {
        if (navTarget.type === 'mls_search' || navTarget.location) {
          window.dispatchEvent(new CustomEvent('charlie-mls-search', { detail: navTarget }));
        }
        window.dispatchEvent(new CustomEvent('charlie-action', { detail: navTarget }));
      }
    }

    const cleanText = fullText
      .replace(/\[NAVIGATE:\s*[^\]]+\]/gi, '')
      .replace(/navigate_to_page\s*\(?['"]?[\/a-z0-9_-]+['"]?(?:,\s*['"]?[^'")]*['"]?)?\)?/gi, '')
      .trim();

    if (cleanText) {
      this.onTranscript?.({ role: 'assistant', text: cleanText });
    }
  }

  stop() {
    this.active = false;

    // 1. Close WebSocket connection
    if (this.ws) {
      try {
        this.ws.close();
      } catch (_) {}
      this.ws = null;
    }

    // 2. Stop audio player
    this.pcmPlayer.close();

    // 3. Stop microphone
    if (this.scriptProcessor) {
      try {
        this.scriptProcessor.disconnect();
      } catch (_) {}
      this.scriptProcessor = null;
    }

    if (this.micStream) {
      try {
        this.micStream.getTracks().forEach((track) => track.stop());
      } catch (_) {}
      this.micStream = null;
    }

    if (this.micCtx && this.micCtx.state !== 'closed') {
      try {
        this.micCtx.close();
      } catch (_) {}
      this.micCtx = null;
    }

    // 4. Stop passive speech recognition
    if (this.passiveSpeechRec) {
      try {
        this.passiveSpeechRec.onend = null;
        this.passiveSpeechRec.stop();
      } catch (_) {}
      this.passiveSpeechRec = null;
    }

    this.onSpeaker?.(null);
    this.onStatusChange?.('ready');

    // 5. End session in backend log
    if (this.sessionLogId && this.startTime) {
      const duration_seconds = Math.round((Date.now() - this.startTime) / 1000);
      base44.functions
        .invoke('geminiLiveProxy', {
          action: 'end_session',
          sessionLogId: this.sessionLogId,
          duration_seconds,
          transcript_turns: this.turnCount,
        })
        .catch(() => {});
    }
  }
}