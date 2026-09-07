import { base44 } from '@/api/base44Client';

/**
 * Standard Gemini Live WebSocket Client adhering to Google's BidiGenerateContent protocol:
 * 1. setup handshake with model, responseModalities: ["AUDIO"], voice Puck, systemInstruction
 * 2. wait for setupComplete before starting microphone
 * 3. send PCM 16kHz audio as realtimeInput.mediaChunks[].mimeType = "audio/pcm;rate=16000"
 * 4. receive serverContent.modelTurn.parts[].inlineData.data (PCM 24kHz)
 * 5. handle serverContent.interrupted for natural conversational barge-in
 */

class PcmPlayer {
  constructor() {
    this.ctx = null;
    this.nextPlayTime = 0;
    this.activeSources = [];
    this.isPlaying = false;
  }

  ensureContext() {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx({ sampleRate: 24000 });
      this.nextPlayTime = this.ctx.currentTime;
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  queueChunk(base64Data, onStart, onFinish) {
    try {
      const ctx = this.ensureContext();
      const raw = atob(base64Data);
      const bytes = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
      const view = new DataView(bytes.buffer);
      const numSamples = Math.floor(bytes.buffer.byteLength / 2);
      if (numSamples <= 0) return;

      const buffer = ctx.createBuffer(1, numSamples, 24000);
      const channel = buffer.getChannelData(0);
      for (let i = 0; i < numSamples; i++) {
        channel[i] = view.getInt16(i * 2, true) / 32768;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);

      const now = ctx.currentTime;
      if (this.nextPlayTime < now) {
        this.nextPlayTime = now;
      }
      source.start(this.nextPlayTime);
      this.nextPlayTime += buffer.duration;

      this.activeSources.push(source);
      this.isPlaying = true;
      onStart?.();

      source.onended = () => {
        const idx = this.activeSources.indexOf(source);
        if (idx !== -1) this.activeSources.splice(idx, 1);
        if (this.activeSources.length === 0) {
          this.isPlaying = false;
          onFinish?.();
        }
      };
    } catch (e) {
      console.error('PCM playback error:', e);
    }
  }

  // Instant interruption / barge-in cancellation:
  // Stops all queued audio sources immediately and prevents stale callbacks from firing
  stop() {
    for (const src of this.activeSources) {
      try {
        src.onended = null;
        src.stop(0);
        src.disconnect();
      } catch (_) {}
    }
    this.activeSources = [];
    if (this.ctx) {
      this.nextPlayTime = this.ctx.currentTime;
    }
    this.isPlaying = false;
  }

  destroy() {
    this.stop();
    if (this.ctx && this.ctx.state !== 'closed') {
      try { this.ctx.close(); } catch (_) {}
      this.ctx = null;
    }
  }
}

export class GeminiLiveSessionClient {
  constructor(options = {}) {
    const {
      systemPrompt,
      onStatusChange,
      onTranscript,
      onSpeaker,
      onError,
      onSessionLogId,
      onNavigate,
      voiceName = 'Charon', // Deep, mature, authoritative American male voice (not British Puck)
    } = options;
    this.systemPrompt = systemPrompt || 'You are Charlie, the distinguished American male AI real estate concierge for Dyson & Dyson. Speak warmly and concisely in real-time.';
    this.onStatusChange = onStatusChange;
    this.onTranscript = onTranscript;
    this.onSpeaker = onSpeaker;
    this.onError = onError;
    this.onSessionLogId = onSessionLogId;
    this.onNavigate = onNavigate;
    this.voiceName = voiceName;

    this.ws = null;
    this.sessionLogId = null;
    this.startTime = null;
    this.turnCount = 0;
    this.micStream = null;
    this.micCtx = null;
    this.micProcessor = null;
    this.player = new PcmPlayer();
    this.active = false;
    this.transcriptTextBuffer = '';
    this.isInterrupted = false;
    this.consecutiveVoiceFrames = 0;
  }

  async start() {
    try {
      this.active = true;
      this.turnCount = 0;
      this.startTime = Date.now();
      this.isInterrupted = false;
      this.onStatusChange?.('connecting');

      // 1. Get wsUrl and model from geminiLiveProxy
      const res = await base44.functions.invoke('geminiLiveProxy', {
        action: 'start_session',
        systemPrompt: this.systemPrompt,
      });

      if (res.data?.error) {
        throw new Error(res.data.error);
      }

      const { wsUrl, model, sessionLogId } = res.data || {};
      if (!wsUrl) {
        throw new Error('Failed to obtain Gemini Live WebSocket URL.');
      }

      this.sessionLogId = sessionLogId;
      this.onSessionLogId?.(sessionLogId);

      // Pre-warm audio player context during user gesture
      this.player.ensureContext();

      // 2. Open WebSocket
      const ws = new WebSocket(wsUrl);
      this.ws = ws;

      ws.onopen = () => {
        // Send setup handshake according to Google Gemini Live protocol
        const fullModel = model?.startsWith('models/') ? model : `models/${model || 'gemini-2.5-flash-preview-native-audio-dialog'}`;
        const setupMessage = {
          setup: {
            model: fullModel,
            generationConfig: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: this.voiceName || 'Charon',
                  },
                },
              },
            },
            systemInstruction: {
              parts: [{ text: this.systemPrompt }],
            },
            tools: [
              {
                functionDeclarations: [
                  {
                    name: 'navigateToPage',
                    description: 'Directs the user to a specific destination page on the DysonRelo platform instead of hunting and pecking.',
                    parameters: {
                      type: 'OBJECT',
                      properties: {
                        path: {
                          type: 'STRING',
                          description: 'The internal application route, e.g. /find-agent, /solutions, /relocation-intake, /corporate-relo, /dnn-news, /transparency, /refer, /financial-services, /city-guide, /portal',
                        },
                        pageTitle: {
                          type: 'STRING',
                          description: 'Human-friendly title of the destination page, e.g. "Find a Vetted Agent", "Real Estate Solutions", "Relocation Intake", "Corporate Relocation", "DNN Daily News", "Transparency Ledger", "Refer Someone"',
                        },
                        reason: {
                          type: 'STRING',
                          description: 'Brief reason for navigating to this page',
                        },
                      },
                      required: ['path', 'pageTitle'],
                    },
                  },
                ],
              },
            ],
          },
        };
        ws.send(JSON.stringify(setupMessage));
      };

      ws.onmessage = async (event) => {
        try {
          let data;
          if (typeof event.data === 'string') {
            data = JSON.parse(event.data);
          } else if (event.data instanceof Blob) {
            const text = await event.data.text();
            data = JSON.parse(text);
          } else {
            return;
          }

          // Case A: setup complete confirmation from server
          if (data.setupComplete) {
            this.onStatusChange?.('listening');
            await this.startMicrophone();
            return;
          }

          // Case B: Tool call from model (navigation action)
          if (data.toolCall?.functionCalls) {
            for (const call of data.toolCall.functionCalls) {
              if (call.name === 'navigateToPage') {
                const { path, pageTitle, reason } = call.args || {};
                if (path) {
                  this.onNavigate?.({ path, title: pageTitle || path, reason: reason || '' });
                }
                // Send confirmation back so the model turn finishes cleanly
                if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                  this.ws.send(JSON.stringify({
                    toolResponse: {
                      functionResponses: [
                        {
                          response: { output: { success: true, navigatedTo: path } },
                          id: call.id,
                        },
                      ],
                    },
                  }));
                }
              }
            }
          }

          // Case C: server content from model
          if (data.serverContent) {
            const sc = data.serverContent;

            // Handle interruption (server-side conversational barge-in confirmation)
            if (sc.interrupted) {
              this.isInterrupted = true;
              this.player.stop();
              this.transcriptTextBuffer = '';
              this.onSpeaker?.('user');
              this.onStatusChange?.('listening');
              return;
            }

            // Model turn parts (audio and/or text)
            if (sc.modelTurn?.parts) {
              for (const part of sc.modelTurn.parts) {
                // Check for inline function call
                if (part.functionCall?.name === 'navigateToPage') {
                  const { path, pageTitle, reason } = part.functionCall.args || {};
                  if (path) {
                    this.onNavigate?.({ path, title: pageTitle || path, reason: reason || '' });
                  }
                }

                if (part.text) {
                  this.transcriptTextBuffer += part.text;
                  // Parse text navigation tags [NAVIGATE: /path | Title]
                  const navMatch = part.text.match(/\[NAVIGATE:\s*([^\]|]+)(?:\|\s*([^\]]+))?\]/i);
                  if (navMatch) {
                    const navPath = navMatch[1].trim();
                    const navTitle = (navMatch[2] || navPath).trim();
                    this.onNavigate?.({ path: navPath, title: navTitle });
                  }
                }

                if (part.inlineData?.data && !this.isInterrupted) {
                  this.turnCount += 1;
                  this.player.queueChunk(
                    part.inlineData.data,
                    () => {
                      if (!this.isInterrupted) {
                        this.onSpeaker?.('assistant');
                        this.onStatusChange?.('speaking');
                      }
                    },
                    () => {
                      this.onSpeaker?.(null);
                      this.onStatusChange?.('listening');
                    }
                  );
                }
              }
            }

            if (sc.turnComplete) {
              this.isInterrupted = false;
              if (this.transcriptTextBuffer.trim()) {
                const cleanedText = this.transcriptTextBuffer
                  .replace(/\[NAVIGATE:\s*[^\]]+\]/gi, '')
                  .trim();
                if (cleanedText) {
                  this.onTranscript?.({
                    role: 'assistant',
                    text: cleanedText,
                  });
                }
                this.transcriptTextBuffer = '';
              }
            }
          }
        } catch (e) {
          console.error('Error handling Gemini Live message:', e);
        }
      };

      ws.onerror = (e) => {
        const errMsg = 'Connection error on voice live stream';
        this.onError?.(errMsg);
        this.logFailure(errMsg);
        this.onStatusChange?.('error');
      };

      ws.onclose = () => {
        if (this.active) {
          this.stop();
        }
      };
    } catch (err) {
      const errMsg = err?.message || 'Failed to start Gemini Live session';
      this.onError?.(errMsg);
      this.logFailure(errMsg);
      this.onStatusChange?.('error');
    }
  }

  async startMicrophone() {
    if (!this.active || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      this.micStream = stream;

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const micCtx = new AudioCtx({ sampleRate: 16000 });
      this.micCtx = micCtx;

      const source = micCtx.createMediaStreamSource(stream);
      // ScriptProcessor node captures 16kHz PCM chunks
      const processor = micCtx.createScriptProcessor(4096, 1, 1);
      this.micProcessor = processor;

      processor.onaudioprocess = (e) => {
        if (!this.active || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;

        const input = e.inputBuffer.getChannelData(0);
        const pcm = new Int16Array(input.length);
        let sumSquares = 0;

        for (let i = 0; i < input.length; i++) {
          const s = Math.max(-1, Math.min(1, input[i]));
          sumSquares += s * s;
          pcm[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }

        const rms = Math.sqrt(sumSquares / input.length);
        const isUserVoice = rms > 0.035;

        if (isUserVoice) {
          this.consecutiveVoiceFrames += 1;
        } else {
          this.consecutiveVoiceFrames = Math.max(0, this.consecutiveVoiceFrames - 1);
        }

        // INSTANT CLIENT-SIDE BARGE-IN / INTERRUPTION:
        // If Charlie is rambling/speaking and user starts talking (2+ frames of voice):
        if (this.player.isPlaying && this.consecutiveVoiceFrames >= 2) {
          this.isInterrupted = true;
          this.player.stop();
          this.transcriptTextBuffer = '';
          this.onSpeaker?.('user');
          this.onStatusChange?.('listening');
        } else if (isUserVoice && !this.player.isPlaying) {
          this.onSpeaker?.('user');
        }

        const bytes = new Uint8Array(pcm.buffer);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const b64 = btoa(binary);

        // Send realtimeInput PCM to Gemini
        this.ws.send(
          JSON.stringify({
            realtimeInput: {
              mediaChunks: [
                {
                  mimeType: 'audio/pcm;rate=16000',
                  data: b64,
                },
              ],
            },
          })
        );
      };

      source.connect(processor);
      processor.connect(micCtx.destination);
    } catch (e) {
      const errMsg = e?.name === 'NotAllowedError'
        ? 'Microphone permission denied. Please allow microphone access.'
        : 'Could not access microphone.';
      this.onError?.(errMsg);
      this.logFailure(errMsg);
      this.onStatusChange?.('error');
    }
  }

  logFailure(errorMsg) {
    if (this.sessionLogId) {
      base44.functions.invoke('geminiLiveProxy', {
        action: 'log_failure',
        sessionLogId: this.sessionLogId,
        error: errorMsg,
      }).catch(() => {});
    }
  }

  stop() {
    this.active = false;

    // Clean up mic
    try {
      if (this.micStream) {
        this.micStream.getTracks().forEach((t) => t.stop());
        this.micStream = null;
      }
    } catch (_) {}

    try {
      if (this.micProcessor) {
        this.micProcessor.disconnect();
        this.micProcessor = null;
      }
    } catch (_) {}

    try {
      if (this.micCtx && this.micCtx.state !== 'closed') {
        this.micCtx.close().catch(() => {});
        this.micCtx = null;
      }
    } catch (_) {}

    // Clean up player
    this.player.stop();

    // Clean up websocket
    if (this.ws) {
      try {
        if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
          this.ws.close();
        }
      } catch (_) {}
      this.ws = null;
    }

    this.onSpeaker?.(null);
    this.onStatusChange?.('ready');

    // Report session end
    if (this.sessionLogId && this.startTime) {
      const duration_seconds = Math.round((Date.now() - this.startTime) / 1000);
      base44.functions.invoke('geminiLiveProxy', {
        action: 'end_session',
        sessionLogId: this.sessionLogId,
        duration_seconds,
        transcript_turns: this.turnCount,
      }).catch(() => {});
    }
  }
}