import { base44 } from '@/api/base44Client';
import { 
  CHARLIE_SIMMONS_SYSTEM_PROMPT, 
  CHARLIE_VOICE_NAME, 
  CHARLIE_VOICE_LANGUAGE 
} from '@/lib/charlieSimmonsPrompt';

/**
 * StreamingPcmPlayer
 * Plays incoming raw PCM audio chunks (24000Hz 16-bit mono) from Gemini Live
 * serverContent.modelTurn.parts inlineData using Algieba voice.
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
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playChunk(base64Data, { onStart, onEnded } = {}) {
    const ctx = this.ensureContext();
    if (!ctx) return;

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

      const buffer = ctx.createBuffer(1, float32.length, this.sampleRate);
      buffer.copyToChannel(float32, 0);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);

      const currentTime = ctx.currentTime;
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
 * Convert Float32 audio to 16-bit PCM ArrayBuffer
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
 * Native Audio Duplex streaming via Google Multimodal Live BidiGenerateContent:
 * - Handshakes with backend geminiLiveProxy (returns wsUrl, model: "gemini-2.5-flash-preview-native-audio-dialog", sessionLogId)
 * - Sends setup on WebSocket open (model, voiceName: 'Algieba')
 * - Awaits setupComplete before starting mic stream / transitioning status
 * - Streams mic audio via realtimeInput.mediaChunks ONLY after _setupDone
 * - Receives and plays serverContent.modelTurn.parts inlineData (24kHz PCM mono) via Algieba voice
 * - Real-time barge-in support (serverContent.interrupted)
 * - Strict DysonRelo portal routing directives
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
    this._setupDone = false;
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
      this._setupDone = false;
      this.turnCount = 0;
      this.startTime = Date.now();
      this.onStatusChange?.('connecting');
      this.dispatchGlobalState('connecting', true);

      // Tap-to-start gesture audio context unlock
      this.pcmPlayer.ensureContext();

      // 1. Await start_session from proxy
      const res = await base44.functions.invoke('geminiLiveProxy', {
        action: 'start_session',
        systemPrompt: this.systemPrompt,
      });

      if (!res?.data?.wsUrl) {
        throw new Error(res?.data?.error || 'Failed to initialize Gemini Live session');
      }

      const { wsUrl, model, systemPrompt, voiceName, sessionLogId } = res.data;
      this.sessionLogId = sessionLogId;
      if (sessionLogId) {
        this.onSessionLogId?.(sessionLogId);
      }

      const rawModel = model || 'models/gemini-2.5-flash-preview-native-audio-dialog';
      const resolvedModel = rawModel.startsWith('models/') ? rawModel : `models/${rawModel}`;
      const resolvedVoiceName = voiceName || this.voiceName || 'Algieba';

      // 2. Open WebSocket
      const ws = new WebSocket(wsUrl);
      this.ws = ws;

      ws.onopen = () => {
        if (!this.active) {
          ws.close();
          return;
        }

        // 3. Send setup message
        const setupMessage = {
          setup: {
            model: resolvedModel,
            generationConfig: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: resolvedVoiceName,
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
        // Keep status connecting until setupComplete is received
      };

      ws.onmessage = async (event) => {
        if (!this.active) return;

        try {
          let rawData = event.data;
          if (rawData instanceof Blob) {
            rawData = await rawData.text();
          }
          const msg = JSON.parse(rawData);

          // Handle setupComplete first
          if (msg.setupComplete) {
            this._setupDone = true;
            await this.startMicrophoneStream();
            this.onStatusChange?.('listening');
            this.dispatchGlobalState('listening', true);

            // Optional passive speech recognition solely for user-side text transcript
            this.startPassiveSpeechRecognition();

            // Prompt Charlie in Algieba voice
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
              const initialTurn = {
                clientContent: {
                  turns: [
                    {
                      role: 'user',
                      parts: [
                        { text: 'Hello Charlie. In one short friendly sentence, introduce yourself as Charlie Simmons, fiduciary AI relocation concierge at DysonRelo, and ask how you can assist.' },
                      ],
                    },
                  ],
                  turnComplete: true,
                },
              };
              this.ws.send(JSON.stringify(initialTurn));
            }
            return;
          }

          // Handle server barge-in / interruption
          if (msg.serverContent?.interrupted) {
            this.pcmPlayer.stop();
            this.accumulatedTurnText = '';
            this.onSpeaker?.('user');
            this.dispatchGlobalSpeaker('user');
            this.onStatusChange?.('listening');
            this.dispatchGlobalState('listening', true);
            return;
          }

          // Handle incoming audio parts from Gemini Live
          if (msg.serverContent?.modelTurn?.parts) {
            for (const part of msg.serverContent.modelTurn.parts) {
              // Play inline PCM 24kHz audio via Algieba native voice
              if (part.inlineData && part.inlineData.mimeType?.startsWith('audio/pcm') && part.inlineData.data) {
                this.pcmPlayer.playChunk(part.inlineData.data, {
                  onStart: () => {
                    if (!this.active) return;
                    this.onSpeaker?.('assistant');
                    this.onStatusChange?.('speaking');
                    this.dispatchGlobalSpeaker('assistant');
                    this.dispatchGlobalState('speaking', true);
                  },
                  onEnded: () => {
                    if (!this.active) return;
                    this.onSpeaker?.(null);
                    this.onStatusChange?.('listening');
                    this.dispatchGlobalSpeaker(null);
                    this.dispatchGlobalState('listening', true);
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
          console.warn('Error processing Gemini Live message:', e);
        }
      };

      ws.onerror = (e) => {
        console.warn('Gemini Live WebSocket error:', e);
        this.onError?.('Voice connection error. Tap to retry.');
        this.onStatusChange?.('error');
        this.dispatchGlobalState('error', false);
      };

      ws.onclose = () => {
        if (this.active) {
          this.onStatusChange?.('ready');
          this.dispatchGlobalState('ready', false);
        }
      };

    } catch (err) {
      console.warn('Gemini Live start error:', err);
      this.onError?.(err?.message || 'Could not connect to Gemini Live.');
      this.onStatusChange?.('error');
      this.dispatchGlobalState('error', false);
    }
  }

  /**
   * Captures microphone audio, downsamples to 16kHz, encodes to 16-bit PCM,
   * and streams directly over WebSocket via realtimeInput.mediaChunks ONLY after _setupDone.
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
      const processor = ctx.createScriptProcessor(2048, 1, 1);
      this.scriptProcessor = processor;

      processor.onaudioprocess = (e) => {
        // MUST send mediaChunks ONLY after _setupDone
        if (!this.active || !this._setupDone || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;

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
      if (this.passiveSpeechRec) {
        try { this.passiveSpeechRec.stop(); } catch (_) {}
      }

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
          this.dispatchGlobalSpeaker('user');
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

  /**
   * Send text turn over Gemini Live WebSocket
   */
  sendTextMessage(text) {
    if (!text || !this.active || !this._setupDone || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.pcmPlayer.stop();
    this.ws.send(
      JSON.stringify({
        clientContent: {
          turns: [
            {
              role: 'user',
              parts: [{ text }],
            },
          ],
          turnComplete: true,
        },
      })
    );
  }

  dispatchGlobalState(status, isActive) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('charlie-speech-active', { detail: { active: isActive && status === 'speaking' } }));
      window.dispatchEvent(new CustomEvent('v2v-session-state', { detail: { status, isActive } }));
    }
  }

  dispatchGlobalSpeaker(speaker) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('v2v-speaker-change', { detail: { speaker } }));
    }
  }

  stop() {
    this.active = false;
    this._setupDone = false;

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
    this.dispatchGlobalSpeaker(null);
    this.dispatchGlobalState('ready', false);

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