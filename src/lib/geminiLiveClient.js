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
        const chosenVoice = ['Aoede', 'Charon', 'Fenrir'].includes(this.voiceName) ? this.voiceName : 'Charon';

        const setupMessage = {
          setup: {
            model: fullModel,
            generationConfig: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: chosenVoice,
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
                    name: 'navigate_to_page',
                    description: 'Navigate the viewer directly to a specific destination page on the DysonRelo platform. Call this function whenever the user asks about or mentions HR or corporate relocation, relocation planning or moving intake, finding an agent, referring a friend or partner, broker or agent portals, real estate answers, daily news, or market transparency.',
                    parameters: {
                      type: 'OBJECT',
                      properties: {
                        path: {
                          type: 'STRING',
                          description: 'The internal application route to navigate to: "/corporate-relo" (Corporate Relocation & HR services), "/relocation-intake" (Relocation Plan & Moving Intake), "/find-agent" (Find a Vetted Agent), "/solutions" (Real Estate Solutions & Roadmaps), "/refer" (Refer a Friend, Client, Agent, or Vendor), "/broker-portal" (Broker & Agent Portal), "/dnn-news" (DNN Daily Real Estate News), "/transparency" (Real Estate Transparency Ledger), "/financial-services" (Financial Services & Vetted Lenders), "/city-guide" (City Guide), "/real-estate-answers" (Real Estate Answers & Video FAQs), "/portal" (Main Portal Home).',
                        },
                        reason: {
                          type: 'STRING',
                          description: 'Short 1-sentence reason why you are taking the viewer to this page.',
                        },
                      },
                      required: ['path'],
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

          // Case B: Handle Interruption / Barge-in immediately
          // Watch for serverContent.interrupted or root interrupted flag
          const isInterruptedSignal = Boolean(
            data.serverContent?.interrupted ||
            data.interrupted ||
            data.serverContent?.modelTurn?.interrupted
          );

          if (isInterruptedSignal) {
            this.isInterrupted = true;
            this.player.stop();
            this.transcriptTextBuffer = '';
            this.onSpeaker?.('user');
            this.onStatusChange?.('listening');
            return;
          }

          // Helper to handle navigate_to_page function calls and immediately respond
          const handleFunctionCall = (call) => {
            const fnName = call.name;
            if (fnName === 'navigate_to_page' || fnName === 'navigateToPage') {
              const targetPath = call.args?.path || call.args?.page || '/portal';
              const pageTitle = call.args?.pageTitle || call.args?.title || call.args?.reason || targetPath;
              const reason = call.args?.reason || '';

              // Trigger React Router navigation on the client
              this.onNavigate?.({ path: targetPath, title: pageTitle, reason });

              // Immediately send toolResponse back over the WebSocket so Charlie knows navigation succeeded
              if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                const responsePayload = {
                  toolResponse: {
                    functionResponses: [
                      {
                        response: {
                          output: {
                            success: true,
                            navigated_to: targetPath,
                            status: `Viewer has navigated to ${targetPath}`,
                          },
                        },
                        id: call.id,
                      },
                    ],
                  },
                };
                this.ws.send(JSON.stringify(responsePayload));
              }
            }
          };

          // Case C: toolCall event at root level
          if (data.toolCall?.functionCalls) {
            for (const call of data.toolCall.functionCalls) {
              handleFunctionCall(call);
            }
          }

          // Case D: server content from model
          if (data.serverContent) {
            const sc = data.serverContent;

            // Model turn parts (audio, text, and/or inline function calls)
            if (sc.modelTurn?.parts) {
              for (const part of sc.modelTurn.parts) {
                // Check for inline function call part
                if (part.functionCall) {
                  handleFunctionCall(part.functionCall);
                }

                if (part.text) {
                  this.transcriptTextBuffer += part.text;
                  // Also parse fallback text navigation tags [NAVIGATE: /path | Title]
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