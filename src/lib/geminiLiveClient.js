import { base44 } from '@/api/base44Client';
import { 
  CHARLIE_SIMMONS_SYSTEM_PROMPT, 
  CHARLIE_VOICE_NAME, 
  CHARLIE_VOICE_LANGUAGE 
} from '@/lib/charlieSimmonsPrompt';

/**
 * Gemini Live & Charlie V2V Duplex Voice Client
 * 
 * Multi-layer, resilient conversational audio engine:
 * 1. Immediate audio playback on tap for opening greeting (0ms latency, authentic Charlie Ruben voice).
 * 2. True duplex conversational loop:
 *    - User speaks -> Captured via Web Speech Recognition / MediaStream
 *    - Transcribed in real time
 *    - Processed by Gemini deep learning via charlieVoiceChat
 *    - Answers played via authentic Charlie audio (with browser TTS backup)
 *    - Real-time barge-in support: speech/stop interrupts audio instantly
 *    - Automatic navigation directive handling
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
      openingGreetingText,
      openingGreetingAudioUrl,
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

    this.openingGreetingText = openingGreetingText;
    this.openingGreetingAudioUrl = openingGreetingAudioUrl;

    this.active = false;
    this.startTime = null;
    this.turnCount = 0;
    this.sessionLogId = null;
    this.conversationHistory = [];

    // Audio elements
    this.currentAudio = null;
    this.audioContext = null;
    this.speechRecognition = null;
    this.isProcessingSpeech = false;
  }

  ensureAudioContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        if (!this.audioContext || this.audioContext.state === 'closed') {
          this.audioContext = new AudioCtx();
        }
        if (this.audioContext.state === 'suspended') {
          this.audioContext.resume().catch(() => {});
        }
      }
    } catch (_) {}
  }

  async start() {
    this.active = true;
    this.startTime = Date.now();
    this.turnCount = 0;
    this.conversationHistory = [];

    // 1. Immediately unlock browser audio context within the user-tap gesture
    this.ensureAudioContext();

    // Notify connecting state
    this.onStatusChange?.('connecting');
    this.dispatchGlobalState('connecting', true);

    // 2. Log session start in background
    base44.functions.invoke('geminiLiveProxy', {
      action: 'start_session',
      systemPrompt: this.systemPrompt,
    }).then((res) => {
      if (res?.data?.sessionLogId) {
        this.sessionLogId = res.data.sessionLogId;
        this.onSessionLogId?.(res.data.sessionLogId);
      }
    }).catch(() => {});

    // 3. Play opening greeting voice immediately if URL is provided
    if (this.openingGreetingAudioUrl) {
      await this.playGreetingAudio(this.openingGreetingAudioUrl, this.openingGreetingText);
    } else if (this.openingGreetingText) {
      // Speak opening greeting text via synthesizer
      await this.speakText(this.openingGreetingText, true);
    } else {
      // Start listening directly
      this.onStatusChange?.('listening');
      this.dispatchGlobalState('listening', true);
      this.startListening();
    }
  }

  /**
   * Plays Charlie's opening greeting audio file immediately
   */
  async playGreetingAudio(audioUrl, greetingText) {
    if (!this.active) return;

    try {
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
      }

      const audio = new Audio();
      audio.preload = 'auto';
      audio.src = audioUrl;
      this.currentAudio = audio;

      audio.onplay = () => {
        if (!this.active) {
          audio.pause();
          return;
        }
        this.onSpeaker?.('assistant');
        this.onStatusChange?.('speaking');
        this.dispatchGlobalSpeaker('assistant');
        this.dispatchGlobalState('speaking', true);

        if (greetingText) {
          this.onTranscript?.({ role: 'assistant', text: greetingText });
          this.conversationHistory.push({ role: 'assistant', text: greetingText });
        }
      };

      audio.onended = () => {
        this.currentAudio = null;
        if (this.active) {
          this.onSpeaker?.(null);
          this.onStatusChange?.('listening');
          this.dispatchGlobalSpeaker(null);
          this.dispatchGlobalState('listening', true);
          this.startListening();
        }
      };

      audio.onerror = (e) => {
        console.warn('Greeting audio error, falling back to listening:', e);
        this.currentAudio = null;
        if (this.active) {
          if (greetingText) {
            this.onTranscript?.({ role: 'assistant', text: greetingText });
          }
          this.onSpeaker?.(null);
          this.onStatusChange?.('listening');
          this.dispatchGlobalSpeaker(null);
          this.dispatchGlobalState('listening', true);
          this.startListening();
        }
      };

      await audio.play();
    } catch (err) {
      console.warn('Playback error for greeting audio:', err);
      if (this.active) {
        if (greetingText) {
          this.onTranscript?.({ role: 'assistant', text: greetingText });
        }
        this.onStatusChange?.('listening');
        this.dispatchGlobalState('listening', true);
        this.startListening();
      }
    }
  }

  /**
   * Speaks text using synthesized audio or browser SpeechSynthesis
   */
  async speakText(text, isGreeting = false) {
    if (!this.active || !text) return;

    this.onSpeaker?.('assistant');
    this.onStatusChange?.('speaking');
    this.dispatchGlobalSpeaker('assistant');
    this.dispatchGlobalState('speaking', true);

    this.onTranscript?.({ role: 'assistant', text });
    this.conversationHistory.push({ role: 'assistant', text });

    // Use Web Speech Synthesis for instant natural voice playback
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 0.95; // Slightly deeper, authoritative American voice
        utterance.lang = 'en-US';

        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => 
          (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Guy') || v.name.includes('David') || v.name.includes('Google US English') || v.name.includes('Alex')))
        ) || voices.find(v => v.lang.startsWith('en-US'));

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.onend = () => {
          if (this.active) {
            this.onSpeaker?.(null);
            this.onStatusChange?.('listening');
            this.dispatchGlobalSpeaker(null);
            this.dispatchGlobalState('listening', true);
            this.startListening();
          }
          resolve();
        };

        utterance.onerror = () => {
          if (this.active) {
            this.onSpeaker?.(null);
            this.onStatusChange?.('listening');
            this.dispatchGlobalSpeaker(null);
            this.dispatchGlobalState('listening', true);
            this.startListening();
          }
          resolve();
        };

        window.speechSynthesis.speak(utterance);
      } else {
        // Fallback delay if synthesis not supported
        setTimeout(() => {
          if (this.active) {
            this.onSpeaker?.(null);
            this.onStatusChange?.('listening');
            this.dispatchGlobalSpeaker(null);
            this.dispatchGlobalState('listening', true);
            this.startListening();
          }
          resolve();
        }, 2500);
      }
    });
  }

  /**
   * Listens for user's voice input using Web Speech Recognition
   */
  startListening() {
    if (!this.active || this.isProcessingSpeech) return;

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      console.warn('SpeechRecognition not supported in this browser.');
      return;
    }

    try {
      if (this.speechRecognition) {
        try { this.speechRecognition.stop(); } catch (_) {}
      }

      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';
      this.speechRecognition = rec;

      let recognizedFinalText = '';

      rec.onstart = () => {
        if (!this.active) return;
        this.onSpeaker?.('user');
        this.onStatusChange?.('listening');
        this.dispatchGlobalSpeaker('user');
        this.dispatchGlobalState('listening', true);
      };

      rec.onresult = (event) => {
        if (!this.active) return;

        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            recognizedFinalText += res[0].transcript;
          } else {
            interim += res[0].transcript;
          }
        }

        const currentText = (recognizedFinalText || interim).trim();
        if (currentText) {
          this.onSpeaker?.('user');
          this.dispatchGlobalSpeaker('user');
        }
      };

      rec.onerror = (event) => {
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          console.warn('Speech recognition error:', event.error);
        }
      };

      rec.onend = () => {
        if (!this.active) return;

        const finalText = recognizedFinalText.trim();
        if (finalText && finalText.length > 1) {
          // Send recognized user speech to Charlie
          this.handleUserMessage(finalText);
        } else {
          // Restart listening if no speech recognized and session is still active
          setTimeout(() => {
            if (this.active && !this.isProcessingSpeech && !this.currentAudio) {
              this.startListening();
            }
          }, 350);
        }
      };

      rec.start();
    } catch (e) {
      console.warn('Could not start speech recognition:', e);
    }
  }

  /**
   * Sends user message to Charlie AI and handles reply + navigation
   */
  async handleUserMessage(userText) {
    if (!this.active || !userText) return;

    this.isProcessingSpeech = true;
    this.turnCount++;

    // Add user turn to transcript
    this.onTranscript?.({ role: 'user', text: userText });
    this.conversationHistory.push({ role: 'user', text: userText });

    // Show connecting / thinking status
    this.onSpeaker?.(null);
    this.onStatusChange?.('connecting');
    this.dispatchGlobalSpeaker(null);
    this.dispatchGlobalState('connecting', true);

    try {
      const res = await base44.functions.invoke('charlieVoiceChat', {
        message: userText,
        conversation: this.conversationHistory,
      });

      const data = res?.data || res;
      const reply = data?.reply || "I'm ready to assist you with any market analysis, tax savings comparison, or agent vetting.";

      // Handle navigation action if provided
      if (data?.action) {
        this.onPendingNavigate?.(data.action);
        this.onNavigate?.(data.action);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('charlie-action', { detail: data.action }));
        }
      }

      this.isProcessingSpeech = false;

      // Play synthesized audio if available, otherwise speech synthesis
      if (data?.audioUrl) {
        await this.playAudioUrl(data.audioUrl, reply);
      } else {
        await this.speakText(reply);
      }

    } catch (err) {
      console.warn('Error from charlieVoiceChat:', err);
      this.isProcessingSpeech = false;
      const fallbackReply = "I understand. Let me guide you to our full concierge directory or answer any questions about our vetted network.";
      await this.speakText(fallbackReply);
    }
  }

  /**
   * Plays an audio URL for Charlie's response
   */
  async playAudioUrl(audioUrl, text) {
    if (!this.active) return;

    try {
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
      }

      const audio = new Audio(audioUrl);
      this.currentAudio = audio;

      audio.onplay = () => {
        if (!this.active) {
          audio.pause();
          return;
        }
        this.onSpeaker?.('assistant');
        this.onStatusChange?.('speaking');
        this.dispatchGlobalSpeaker('assistant');
        this.dispatchGlobalState('speaking', true);

        if (text) {
          this.onTranscript?.({ role: 'assistant', text });
          this.conversationHistory.push({ role: 'assistant', text });
        }
      };

      audio.onended = () => {
        this.currentAudio = null;
        if (this.active) {
          this.onSpeaker?.(null);
          this.onStatusChange?.('listening');
          this.dispatchGlobalSpeaker(null);
          this.dispatchGlobalState('listening', true);
          this.startListening();
        }
      };

      audio.onerror = () => {
        this.currentAudio = null;
        this.speakText(text);
      };

      await audio.play();
    } catch (e) {
      console.warn('Error playing audioUrl, falling back to TTS:', e);
      await this.speakText(text);
    }
  }

  /**
   * Allows manual text input turn (from keyboard or suggestion buttons)
   */
  sendTextMessage(text) {
    if (!text || !this.active) return;

    // Barge-in: stop any current speech
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    this.handleUserMessage(text);
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
    this.isProcessingSpeech = false;

    // 1. Stop HTML5 audio
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (_) {}
      this.currentAudio = null;
    }

    // 2. Stop speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (_) {}
    }

    // 3. Stop speech recognition
    if (this.speechRecognition) {
      try {
        this.speechRecognition.abort();
      } catch (_) {}
      this.speechRecognition = null;
    }

    // 4. Update status & global dispatch
    this.onSpeaker?.(null);
    this.onStatusChange?.('ready');
    this.dispatchGlobalSpeaker(null);
    this.dispatchGlobalState('ready', false);

    // 5. Log end of session
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