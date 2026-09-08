import { base44 } from '@/api/base44Client';

/**
 * Gemini Live Client with Deep-Brain Intelligence & Charlie Voice ('storm')
 *
 * Architecture:
 * 1. Deep Brain Intelligence: Gemini LLM engine powers all conversation reasoning,
 *    multi-turn conversational memory, intent recognition, and tool calling (`navigate_to_page`).
 * 2. Voice Generation: Charlie's custom authoritative male voice (`charlieSpeak` with voice `storm`)
 *    provides the spoken audio.
 * 3. Instant Real-Time Interruption (Barge-In): The browser microphone monitors user speech
 *    continuously. The millisecond the user speaks while Charlie is talking, active playback
 *    is instantly paused, the audio buffer is flushed, and any pending speech requests are canceled.
 */

class CharlieAudioPlayer {
  constructor() {
    this.audio = null;
    this.currentRequestId = 0;
    this.isPlaying = false;
  }

  play(url, { onStart, onEnded } = {}) {
    this.stop();
    const reqId = ++this.currentRequestId;
    const audio = new Audio(url);
    audio.preload = 'auto';
    this.audio = audio;
    this.isPlaying = true;

    audio.onplay = () => {
      if (reqId !== this.currentRequestId) {
        audio.pause();
        return;
      }
      this.isPlaying = true;
      onStart?.();
    };

    audio.onended = () => {
      if (reqId === this.currentRequestId) {
        this.isPlaying = false;
        this.audio = null;
        onEnded?.();
      }
    };

    audio.onerror = () => {
      if (reqId === this.currentRequestId) {
        this.isPlaying = false;
        this.audio = null;
        onEnded?.();
      }
    };

    audio.play().catch(() => {
      if (reqId === this.currentRequestId) {
        this.isPlaying = false;
        this.audio = null;
        onEnded?.();
      }
    });

    return reqId;
  }

  // Instant pause and flush of active audio queue
  stop() {
    this.currentRequestId++;
    if (this.audio) {
      try {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.audio.src = '';
      } catch (_) {}
      this.audio = null;
    }
    this.isPlaying = false;
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
    } = options;

    this.systemPrompt = systemPrompt || 'You are Charlie, the distinguished American male AI real estate concierge for Dyson & Dyson. Speak warmly and concisely in real-time.';
    this.onStatusChange = onStatusChange;
    this.onTranscript = onTranscript;
    this.onSpeaker = onSpeaker;
    this.onError = onError;
    this.onSessionLogId = onSessionLogId;
    this.onNavigate = onNavigate;

    this.ws = null;
    this.sessionLogId = null;
    this.startTime = null;
    this.turnCount = 0;
    this.micStream = null;
    this.micCtx = null;
    this.micProcessor = null;
    this.charlieAudioPlayer = new CharlieAudioPlayer();
    this.active = false;
    this.transcriptTextBuffer = '';
    this.isInterrupted = false;
    this.pendingSpeakId = 0;
    this.conversationHistory = [];
    this.fallbackRecognition = null;
  }

  async start() {
    try {
      this.active = true;
      this.turnCount = 0;
      this.startTime = Date.now();
      this.isInterrupted = false;
      this.pendingSpeakId = 0;
      this.conversationHistory = [];
      this.onStatusChange?.('connecting');

      // 1. Obtain Gemini session credentials from proxy
      const res = await base44.functions.invoke('geminiLiveProxy', {
        action: 'start_session',
        systemPrompt: this.systemPrompt,
      });

      if (res.data?.error) {
        throw new Error(res.data.error);
      }

      const { wsUrl, model, sessionLogId } = res.data || {};
      this.sessionLogId = sessionLogId;
      this.onSessionLogId?.(sessionLogId);

      if (!wsUrl) {
        throw new Error('Could not obtain Gemini Live WebSocket URL.');
      }

      // 2. Open WebSocket
      const ws = new WebSocket(wsUrl);
      this.ws = ws;

      ws.onopen = () => {
        const fullModel = model?.startsWith('models/') ? model : `models/${model || 'gemini-2.5-flash-preview-native-audio-dialog'}`;

        // Gemini Tools & Function calling layer: navigate_to_page
        const setupMessage = {
          setup: {
            model: fullModel,
            generationConfig: {
              responseModalities: ['TEXT'], // Gemini powers deep brain intelligence & tools; Charlie powers speech
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

          // Case A: setup complete confirmation
          if (data.setupComplete) {
            this.onStatusChange?.('listening');
            await this.startMicrophone();
            return;
          }

          // Case B: Handle Interruption / Barge-in immediately
          const isInterruptedSignal = Boolean(
            data.serverContent?.interrupted ||
            data.interrupted ||
            data.serverContent?.modelTurn?.interrupted
          );

          if (isInterruptedSignal) {
            this.handleInterruption();
            return;
          }

          // Helper to handle navigate_to_page function calls
          const handleFunctionCall = (call) => {
            const fnName = call.name;
            if (fnName === 'navigate_to_page' || fnName === 'navigateToPage') {
              const targetPath = call.args?.path || call.args?.page || '/portal';
              const pageTitle = call.args?.pageTitle || call.args?.title || call.args?.reason || targetPath;
              const reason = call.args?.reason || '';

              // Trigger React Router navigation on the client
              this.onNavigate?.({ path: targetPath, title: pageTitle, reason });

              // Send toolResponse back over the WebSocket
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

            // Model turn parts (text and/or inline function calls)
            if (sc.modelTurn?.parts) {
              for (const part of sc.modelTurn.parts) {
                if (part.functionCall) {
                  handleFunctionCall(part.functionCall);
                }

                if (part.text) {
                  this.transcriptTextBuffer += part.text;
                  const navMatch = part.text.match(/\[NAVIGATE:\s*([^\]|]+)(?:\|\s*([^\]]+))?\]/i);
                  if (navMatch) {
                    const navPath = navMatch[1].trim();
                    const navTitle = (navMatch[2] || navPath).trim();
                    this.onNavigate?.({ path: navPath, title: navTitle });
                  }
                }
              }
            }

            // When turn is complete, route Gemini's answer to Charlie's custom speech engine
            if (sc.turnComplete) {
              this.isInterrupted = false;
              const rawText = this.transcriptTextBuffer.trim();
              if (rawText) {
                const cleanedText = rawText
                  .replace(/\[NAVIGATE:\s*[^\]]+\]/gi, '')
                  .replace(/[*_#`]/g, '')
                  .trim();

                if (cleanedText) {
                  this.turnCount++;
                  this.conversationHistory.push({ role: 'assistant', text: cleanedText });
                  this.onTranscript?.({
                    role: 'assistant',
                    text: cleanedText,
                  });

                  // Voice synthesis via Charlie ('storm')
                  this.speakWithCharlie(cleanedText);
                }
                this.transcriptTextBuffer = '';
              }
            }
          }
        } catch (e) {
          console.error('Error handling Gemini message:', e);
        }
      };

      ws.onerror = () => {
        this.initiateSpeechFallback();
      };

      ws.onclose = () => {
        if (this.active && !this.micStream) {
          this.initiateSpeechFallback();
        }
      };
    } catch (err) {
      console.warn('Gemini Live session error:', err);
      this.initiateSpeechFallback();
    }
  }

  // Real-time barge-in handler: instantly cuts off audio and flushes state
  handleInterruption() {
    this.isInterrupted = true;
    this.pendingSpeakId++;
    this.charlieAudioPlayer.stop();
    this.transcriptTextBuffer = '';
    this.onSpeaker?.('user');
    this.onStatusChange?.('listening');
  }

  async speakWithCharlie(text) {
    if (this.isInterrupted || !this.active || !text) return;

    const currentReq = ++this.pendingSpeakId;
    this.onSpeaker?.('assistant');
    this.onStatusChange?.('speaking');

    try {
      const res = await base44.functions.invoke('charlieSpeak', { text });
      if (currentReq !== this.pendingSpeakId || this.isInterrupted || !this.active) {
        return; // User interrupted mid-synthesis
      }

      const audioUrl = res.data?.audioUrl;
      if (audioUrl) {
        this.charlieAudioPlayer.play(audioUrl, {
          onStart: () => {
            if (currentReq === this.pendingSpeakId && !this.isInterrupted) {
              this.onSpeaker?.('assistant');
              this.onStatusChange?.('speaking');
            }
          },
          onEnded: () => {
            if (currentReq === this.pendingSpeakId) {
              this.onSpeaker?.(null);
              this.onStatusChange?.('listening');
            }
          },
        });
      } else {
        this.onSpeaker?.(null);
        this.onStatusChange?.('listening');
      }
    } catch (err) {
      console.warn('Charlie voice generation error:', err);
      this.onSpeaker?.(null);
      this.onStatusChange?.('listening');
    }
  }

  async startMicrophone() {
    if (!this.active) return;

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
      const processor = micCtx.createScriptProcessor(4096, 1, 1);
      this.micProcessor = processor;

      processor.onaudioprocess = (e) => {
        if (!this.active) return;

        const input = e.inputBuffer.getChannelData(0);
        const pcm = new Int16Array(input.length);
        let sumSquares = 0;

        for (let i = 0; i < input.length; i++) {
          const s = Math.max(-1, Math.min(1, input[i]));
          sumSquares += s * s;
          pcm[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }

        const rms = Math.sqrt(sumSquares / input.length);
        // Sensitive threshold to catch speech at the earliest millisecond
        const isUserVoice = rms > 0.02;

        // INSTANT BARGE-IN INTERRUPTION:
        // The instant the microphone detects the user speaking, flush active Charlie audio immediately!
        if (isUserVoice && this.charlieAudioPlayer.isPlaying) {
          this.handleInterruption();
        } else if (isUserVoice && !this.charlieAudioPlayer.isPlaying) {
          this.onSpeaker?.('user');
        }

        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          const bytes = new Uint8Array(pcm.buffer);
          let binary = '';
          for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const b64 = btoa(binary);

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
        }
      };

      source.connect(processor);
      processor.connect(micCtx.destination);
    } catch (e) {
      const errMsg = e?.name === 'NotAllowedError'
        ? 'Microphone permission denied. Please allow microphone access.'
        : 'Could not access microphone.';
      this.onError?.(errMsg);
      this.onStatusChange?.('error');
    }
  }

  /**
   * Resilient speech fallback:
   * Uses browser SpeechRecognition for speech input + Gemini deep brain reasoning with conversation memory,
   * tool navigation, and Charlie's voice.
   */
  initiateSpeechFallback() {
    if (!this.active) return;

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      this.onStatusChange?.('listening');
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      this.fallbackRecognition = recognition;

      recognition.onstart = () => {
        this.onStatusChange?.('listening');
      };

      recognition.onresult = async (event) => {
        if (!this.active) return;

        // Cut off Charlie audio immediately if user speaks (instant barge-in)
        if (this.charlieAudioPlayer.isPlaying) {
          this.handleInterruption();
        }

        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }

        const text = finalTranscript.trim();
        if (text) {
          this.turnCount++;
          this.conversationHistory.push({ role: 'user', text });
          this.onTranscript?.({ role: 'user', text });
          this.onSpeaker?.('assistant');
          this.onStatusChange?.('speaking');

          try {
            // Process Gemini intent, memory, tool navigation & Charlie voice
            const res = await base44.functions.invoke('charlieVoiceChat', {
              message: text,
              conversation: this.conversationHistory,
            });

            const reply = res.data?.reply || '';
            const audioUrl = res.data?.audioUrl;

            // Check for navigation directives in Gemini's response
            const navMatch = reply.match(/\[NAVIGATE:\s*([^\]|]+)(?:\|\s*([^\]]+))?\]/i);
            if (navMatch) {
              const navPath = navMatch[1].trim();
              const navTitle = (navMatch[2] || navPath).trim();
              this.onNavigate?.({ path: navPath, title: navTitle });
            }

            const cleanReply = reply.replace(/\[NAVIGATE:\s*[^\]]+\]/gi, '').trim();
            if (cleanReply) {
              this.conversationHistory.push({ role: 'assistant', text: cleanReply });
              this.onTranscript?.({ role: 'assistant', text: cleanReply });
            }

            if (audioUrl && !this.isInterrupted) {
              this.charlieAudioPlayer.play(audioUrl, {
                onEnded: () => {
                  this.onSpeaker?.(null);
                  this.onStatusChange?.('listening');
                },
              });
            } else {
              this.onSpeaker?.(null);
              this.onStatusChange?.('listening');
            }
          } catch (_) {
            this.onSpeaker?.(null);
            this.onStatusChange?.('listening');
          }
        }
      };

      recognition.onerror = () => {
        this.onStatusChange?.('listening');
      };

      recognition.onend = () => {
        if (this.active) {
          try { recognition.start(); } catch (_) {}
        }
      };

      recognition.start();
    } catch (_) {
      this.onStatusChange?.('listening');
    }
  }

  stop() {
    this.active = false;
    this.pendingSpeakId++;

    // Immediately stop Charlie's audio and flush queue
    this.charlieAudioPlayer.stop();

    if (this.fallbackRecognition) {
      try { this.fallbackRecognition.stop(); } catch (_) {}
      this.fallbackRecognition = null;
    }

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