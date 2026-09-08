import { base44 } from '@/api/base44Client';

/**
 * Charlie V2V Real-Time Voice Concierge Client
 *
 * Architecture:
 * 1. Deep Brain Intelligence: Powered by Gemini with full verified company knowledge
 *    (Bob Dyson 55+ years, 20+ agent vetting, relocation milestones, transparency, etc.),
 *    multi-turn conversational memory, and platform navigation tools.
 * 2. True Charlie Voice: Audio output is 100% Charlie's authoritative American male voice ('storm').
 *    Never plays the generic British/English man voice.
 * 3. Instant Real-Time Interruption (Barge-In): The browser microphone monitors speech in real time.
 *    The millisecond the user speaks while Charlie is talking, active playback is instantly paused,
 *    audio buffers are flushed, and any pending requests are canceled.
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
      onPendingNavigate,
      onCancelNavigate,
      onNavigate,
    } = options;

    this.systemPrompt = systemPrompt || 'You are Charlie, the distinguished American male AI real estate concierge for Dyson & Dyson.';
    this.onStatusChange = onStatusChange;
    this.onTranscript = onTranscript;
    this.onSpeaker = onSpeaker;
    this.onError = onError;
    this.onSessionLogId = onSessionLogId;
    this.onPendingNavigate = onPendingNavigate;
    this.onCancelNavigate = onCancelNavigate;
    this.onNavigate = onNavigate;
    this.pendingNav = null;

    this.sessionLogId = null;
    this.startTime = null;
    this.turnCount = 0;
    this.micStream = null;
    this.micCtx = null;
    this.micAnalyser = null;
    this.charlieAudioPlayer = new CharlieAudioPlayer();
    this.active = false;
    this.isInterrupted = false;
    this.pendingSpeakId = 0;
    this.conversationHistory = [];
    this.recognition = null;
    this.isProcessingTurn = false;
    this.vadInterval = null;
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

      // 1. Initialize or log session in backend
      try {
        const res = await base44.functions.invoke('geminiLiveProxy', {
          action: 'start_session',
          systemPrompt: this.systemPrompt,
        });
        if (res.data?.sessionLogId) {
          this.sessionLogId = res.data.sessionLogId;
          this.onSessionLogId?.(res.data.sessionLogId);
        }
      } catch (_) {}

      // 2. Start hardware microphone listener for real-time barge-in detection
      await this.startMicrophoneVAD();

      // 3. Start continuous Speech Recognition engine
      this.startSpeechRecognition();

      this.onStatusChange?.('listening');
      this.onSpeaker?.('user');
    } catch (err) {
      console.warn('V2V session start error:', err);
      this.onError?.(err?.message || 'Could not start voice session.');
      this.onStatusChange?.('error');
    }
  }

  /**
   * High-sensitivity hardware microphone monitor:
   * Continuously measures audio RMS energy. If Charlie is speaking and user talks,
   * instantly stops and flushes Charlie's audio mid-sentence.
   */
  async startMicrophoneVAD() {
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
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      this.micAnalyser = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      // Continuous high-frequency VAD check (every 30ms)
      this.vadInterval = setInterval(() => {
        if (!this.active || !this.micAnalyser) return;

        analyser.getByteTimeDomainData(dataArray);
        let sumSquares = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const norm = (dataArray[i] - 128) / 128;
          sumSquares += norm * norm;
        }
        const rms = Math.sqrt(sumSquares / dataArray.length);

        // Sensitive voice detection threshold
        const isSpeaking = rms > 0.035;

        if (isSpeaking) {
          // INSTANT BARGE-IN: If Charlie is playing audio, cut him off instantly!
          if (this.charlieAudioPlayer.isPlaying) {
            this.handleInterruption();
          }
        }
      }, 30);
    } catch (e) {
      console.warn('Microphone VAD setup error:', e);
    }
  }

  startSpeechRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      this.onError?.('Your browser does not support SpeechRecognition. Please use Chrome, Edge, or Safari.');
      this.onStatusChange?.('error');
      return;
    }

    try {
      const rec = new SpeechRec();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';
      this.recognition = rec;

      rec.onstart = () => {
        if (this.active) {
          this.onStatusChange?.('listening');
        }
      };

      rec.onsoundstart = () => {
        if (this.charlieAudioPlayer.isPlaying) {
          this.handleInterruption();
        }
      };

      rec.onspeechstart = () => {
        if (this.charlieAudioPlayer.isPlaying) {
          this.handleInterruption();
        }
      };

      rec.onaudiostart = () => {
        if (this.charlieAudioPlayer.isPlaying) {
          this.handleInterruption();
        }
      };

      rec.onresult = async (event) => {
        if (!this.active) return;

        // Cut off Charlie immediately if user begins speaking
        if (this.charlieAudioPlayer.isPlaying) {
          this.handleInterruption();
        }

        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            final += res[0].transcript;
          } else {
            interim += res[0].transcript;
          }
        }

        const userText = (final || interim).trim();
        if (userText) {
          this.onSpeaker?.('user');
        }

        if (final.trim() && !this.isProcessingTurn) {
          await this.processUserTurn(final.trim());
        }
      };

      rec.onerror = (e) => {
        if (e?.error === 'not-allowed') {
          this.onError?.('Microphone permission denied. Please allow microphone access in your browser.');
          this.onStatusChange?.('error');
        }
      };

      rec.onend = () => {
        // Automatically restart speech recognition while session is active
        if (this.active) {
          try {
            rec.start();
          } catch (_) {}
        }
      };

      rec.start();
    } catch (e) {
      console.warn('SpeechRecognition start error:', e);
    }
  }

  // Real-time barge-in handler: instantly cuts off audio and flushes state
  handleInterruption() {
    this.isInterrupted = true;
    this.pendingSpeakId++;
    this.pendingNav = null;
    this.charlieAudioPlayer.stop();
    this.onCancelNavigate?.();
    this.onSpeaker?.('user');
    this.onStatusChange?.('listening');
  }

  async processUserTurn(text) {
    if (!text || !this.active) return;
    this.isProcessingTurn = true;
    this.isInterrupted = false;

    this.turnCount++;
    this.conversationHistory.push({ role: 'user', text });
    this.onTranscript?.({ role: 'user', text });
    this.onSpeaker?.('assistant');
    this.onStatusChange?.('speaking');

    try {
      const currentReq = ++this.pendingSpeakId;

      // Call Gemini deep-brain backend with full conversation memory & verified knowledge base
      const res = await base44.functions.invoke('charlieVoiceChat', {
        message: text,
        conversation: this.conversationHistory,
      });

      if (currentReq !== this.pendingSpeakId || !this.active || this.isInterrupted) {
        this.isProcessingTurn = false;
        return; // User interrupted while Gemini was thinking
      }

      const reply = res.data?.reply || '';
      const audioUrl = res.data?.audioUrl;

      // Check for navigation directives (tool calling)
      let turnNav = null;
      const navMatch = reply.match(/\[NAVIGATE:\s*([^\]|]+)(?:\|\s*([^\]]+))?\]/i) ||
                       reply.match(/navigate_to_page\s*\(?['"]?([\/a-z0-9_-]+)['"]?(?:,\s*['"]?([^'")]*)['"]?)?\)?/i) ||
                       reply.match(/navigate_to_page:\s*([\/a-z0-9_-]+)/i);
      if (navMatch) {
        const navPath = navMatch[1].trim();
        const navTitle = (navMatch[2] || navPath).trim();
        turnNav = { path: navPath, title: navTitle };
        this.pendingNav = turnNav;
        this.onPendingNavigate?.(turnNav);
      }

      const cleanReply = reply
        .replace(/\[NAVIGATE:\s*[^\]]+\]/gi, '')
        .replace(/navigate_to_page\s*\(?['"]?[\/a-z0-9_-]+['"]?(?:,\s*['"]?[^'")]*['"]?)?\)?/gi, '')
        .replace(/navigate_to_page:\s*[\/a-z0-9_-]+/gi, '')
        .trim();
      if (cleanReply) {
        this.conversationHistory.push({ role: 'assistant', text: cleanReply });
        this.onTranscript?.({ role: 'assistant', text: cleanReply });
      }

      const executeNavigationIfValid = () => {
        if (turnNav && !this.isInterrupted && currentReq === this.pendingSpeakId && this.active) {
          const navTarget = turnNav;
          this.pendingNav = null;
          this.onNavigate?.(navTarget);
        }
      };

      // Play Charlie's custom authoritative American voice ('storm')
      if (audioUrl && !this.isInterrupted) {
        // Safety timeout so navigation doesn't hang if audio event stalls
        const navTimeout = turnNav ? setTimeout(() => {
          executeNavigationIfValid();
        }, 5500) : null;

        this.charlieAudioPlayer.play(audioUrl, {
          onStart: () => {
            if (currentReq === this.pendingSpeakId && !this.isInterrupted) {
              this.onSpeaker?.('assistant');
              this.onStatusChange?.('speaking');
            }
          },
          onEnded: () => {
            if (navTimeout) clearTimeout(navTimeout);
            if (currentReq === this.pendingSpeakId && !this.isInterrupted) {
              this.onSpeaker?.(null);
              this.onStatusChange?.('listening');
              executeNavigationIfValid();
            }
          },
        });
      } else {
        this.onSpeaker?.(null);
        this.onStatusChange?.('listening');
        if (turnNav) {
          setTimeout(() => executeNavigationIfValid(), 800);
        }
      }
    } catch (err) {
      console.warn('Error processing turn:', err);
      this.onSpeaker?.(null);
      this.onStatusChange?.('listening');
    } finally {
      this.isProcessingTurn = false;
    }
  }

  stop() {
    this.active = false;
    this.pendingSpeakId++;

    if (this.vadInterval) {
      clearInterval(this.vadInterval);
      this.vadInterval = null;
    }

    // Immediately stop Charlie's audio and flush queue
    this.charlieAudioPlayer.stop();

    if (this.recognition) {
      try {
        this.recognition.onend = null;
        this.recognition.stop();
      } catch (_) {}
      this.recognition = null;
    }

    try {
      if (this.micStream) {
        this.micStream.getTracks().forEach((t) => t.stop());
        this.micStream = null;
      }
    } catch (_) {}

    try {
      if (this.micCtx && this.micCtx.state !== 'closed') {
        this.micCtx.close().catch(() => {});
        this.micCtx = null;
      }
    } catch (_) {}

    this.onSpeaker?.(null);
    this.onStatusChange?.('ready');

    // End session log
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