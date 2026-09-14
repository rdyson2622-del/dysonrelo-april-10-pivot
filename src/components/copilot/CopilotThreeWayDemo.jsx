import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Sparkles, CheckCircle, Radio } from 'lucide-react';

/**
 * CopilotThreeWayDemo
 * 
 * Interactive 3-way conversational audio demo:
 * 1. Consumer speaks -> Client box lights up in vibrant RED
 * 2. Charlie speaks -> Charlie box lights up in EMERALD GREEN
 * 3. Bob Dyson speaks -> Bob box lights up in DYSON GOLD
 * 
 * Demonstrates real-time 3-way verbal and visual dialogue.
 */
export const THREE_WAY_SCRIPT = [
  {
    turn: 1,
    speaker: 'consumer',
    speakerName: 'You (Buyer)',
    role: 'Verified Buyer',
    colorName: 'Red Ring',
    colorHex: '#ef4444',
    text: "We're looking at 7414 Fay Ave in La Jolla. Is the bluff setback going to be a problem, and can we structure a closing rebate?",
    audioUrl: "https://media.base44.com/files/public/69d905d72ff7c93b5ef050c4/9417a119e_speech.mp3",
    voiceConfig: { pitch: 1.05, rate: 1.02, voiceType: 'consumer' },
    delayMs: 3800
  },
  {
    turn: 2,
    speaker: 'charlie',
    speakerName: 'Charlie Simmons',
    role: 'AI Voice Concierge',
    colorName: 'Green Ring',
    colorHex: '#10b981',
    text: "Charlie here: On 7414 Fay Ave, coastal zoning requires a mandatory 25-foot bluff setback and geotechnical soil report. Comps show the property is listed at an 18% premium. Let me bring in Bob Dyson to structure your contingency shield.",
    audioUrl: "https://media.base44.com/files/public/69d905d72ff7c93b5ef050c4/bbe89eee0_speech.mp3",
    voiceConfig: { pitch: 1.15, rate: 1.05, voiceType: 'charlie' },
    delayMs: 6500
  },
  {
    turn: 3,
    speaker: 'bob',
    speakerName: 'Bob Dyson',
    role: 'Principal Broker · DRE #00609384',
    colorName: 'Gold Ring',
    colorHex: '#D4AF37',
    text: "Bob Dyson here. In California coastal transactions, we never let you write an offer without an un-waivable soil stability inspection. And under our zero-fee protocol, your estimated $16,800 closing rebate is locked directly on line 204 of your HUD-1.",
    audioUrl: "https://media.base44.com/files/public/69d905d72ff7c93b5ef050c4/1270ef2d9_speech.mp3",
    voiceConfig: { pitch: 0.88, rate: 0.95, voiceType: 'bob' },
    delayMs: 6800
  }
];

export default function CopilotThreeWayDemo({ onTurnChange, onResetDemo, onMessagePosted }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0 = idle, 1 = consumer (red), 2 = charlie (green), 3 = bob (gold), 4 = done
  const timerRef = useRef(null);
  const audioPlayerRef = useRef(null);

  // Helper to speak a turn with studio-grade audio or distinct fallback
  const speakTurn = (turnData, onEndCallback) => {
    // 1. First priority: Play studio-recorded MP3
    if (turnData.audioUrl && typeof Audio !== 'undefined') {
      try {
        if (audioPlayerRef.current) {
          audioPlayerRef.current.pause();
          audioPlayerRef.current = null;
        }
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }

        const audio = new Audio(turnData.audioUrl);
        audioPlayerRef.current = audio;

        let hasFinished = false;
        const finish = () => {
          if (!hasFinished) {
            hasFinished = true;
            if (onEndCallback) onEndCallback();
          }
        };

        audio.onended = finish;
        audio.onerror = () => {
          console.warn('Audio playback error, falling back to speech synthesis');
          fallbackSpeak(turnData, onEndCallback);
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('Audio autoplay prevented, using speech synthesis fallback:', err);
            fallbackSpeak(turnData, onEndCallback);
          });
        }
        return;
      } catch (e) {
        console.warn('Audio element error:', e);
      }
    }

    fallbackSpeak(turnData, onEndCallback);
  };

  // Browser Speech Synthesis Fallback with modern voices
  const fallbackSpeak = (turnData, onEndCallback) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEndCallback) onEndCallback();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(turnData.text);
      utterance.pitch = turnData.voiceConfig?.pitch || 1.0;
      utterance.rate = turnData.voiceConfig?.rate || 1.0;

      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        if (turnData.speaker === 'bob') {
          const maleVoice = voices.find(v => v.lang.startsWith('en') && /daniel|george|oliver|alex|david|guy/i.test(v.name));
          if (maleVoice) utterance.voice = maleVoice;
        } else if (turnData.speaker === 'charlie') {
          const charlieVoice = voices.find(v => v.lang.startsWith('en') && /natural|aaron|evan|alex|google us english/i.test(v.name));
          if (charlieVoice) utterance.voice = charlieVoice;
        } else {
          // Modern, warm woman voice for buyer
          const buyerVoice = voices.find(v => v.lang.startsWith('en') && /samantha|ava|allison|jenny|victoria|zoe/i.test(v.name));
          if (buyerVoice) utterance.voice = buyerVoice;
        }
      }

      utterance.onend = () => {
        if (onEndCallback) onEndCallback();
      };

      utterance.onerror = () => {
        if (onEndCallback) onEndCallback();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error in demo:', e);
      if (onEndCallback) onEndCallback();
    }
  };

  const stopDemo = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
      audioPlayerRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsPlaying(false);
    setCurrentStep(0);
    if (onTurnChange) onTurnChange(null);
    if (onResetDemo) onResetDemo();
  };

  const playTurn = (stepIndex) => {
    if (stepIndex >= THREE_WAY_SCRIPT.length) {
      setIsPlaying(false);
      setCurrentStep(4);
      if (onTurnChange) onTurnChange(null);
      return;
    }

    const turn = THREE_WAY_SCRIPT[stepIndex];
    setCurrentStep(stepIndex + 1);

    // Notify parent to visually enlarge and light up the active speaker box
    if (onTurnChange) onTurnChange(turn.speaker);

    // Post turn to chat message feed
    if (onMessagePosted) {
      onMessagePosted({
        id: Date.now() + stepIndex,
        sender: turn.speaker,
        speakerName: turn.speakerName,
        text: turn.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }

    // Play spoken voice with fallback timer
    speakTurn(turn, () => {
      timerRef.current = setTimeout(() => {
        playTurn(stepIndex + 1);
      }, 700);
    });
  };

  const handleStartDemo = () => {
    if (isPlaying) {
      stopDemo();
      return;
    }

    setIsPlaying(true);
    setCurrentStep(1);
    if (onResetDemo) onResetDemo();
    playTurn(0);
  };

  useEffect(() => {
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="rounded-xl p-2.5 bg-gradient-to-r from-[#18150c] via-[#121212] to-[#141818] border border-[#D4AF37]/50 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-left">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
          {isPlaying ? (
            <Volume2 className="w-4 h-4 text-[#D4AF37] animate-pulse" />
          ) : (
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 leading-none">
            <span className="text-[10.5px] font-bold text-white tracking-wide">
              {isPlaying 
                ? currentStep === 1 
                  ? 'Step 1/3: Buyer Speaking' 
                  : currentStep === 2 
                  ? 'Step 2/3: Charlie Simmons Speaking' 
                  : 'Step 3/3: Bob Dyson Directing'
                : currentStep === 4
                ? 'Demo Complete · Try Live Question'
                : 'Interactive 3-Way Dialogue Stage'
              }
            </span>
            <span className="text-[7.5px] px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-mono uppercase font-bold shrink-0">
              AUDIO &amp; VISUAL DEMO
            </span>
          </div>

          {/* Color Indicators Pill */}
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-flex items-center gap-1 text-[8px] font-mono ${currentStep === 1 ? 'text-rose-400 font-bold' : 'text-stone-400'}`}>
              <span className={`w-2 h-2 rounded-full bg-rose-500 ${currentStep === 1 ? 'animate-ping' : ''}`} />
              Buyer (Red)
            </span>
            <span className="text-stone-600 text-[8px]">·</span>
            <span className={`inline-flex items-center gap-1 text-[8px] font-mono ${currentStep === 2 ? 'text-emerald-400 font-bold' : 'text-stone-400'}`}>
              <span className={`w-2 h-2 rounded-full bg-emerald-400 ${currentStep === 2 ? 'animate-ping' : ''}`} />
              Charlie (Green)
            </span>
            <span className="text-stone-600 text-[8px]">·</span>
            <span className={`inline-flex items-center gap-1 text-[8px] font-mono ${currentStep === 3 ? 'text-[#D4AF37] font-bold' : 'text-stone-400'}`}>
              <span className={`w-2 h-2 rounded-full bg-[#D4AF37] ${currentStep === 3 ? 'animate-ping' : ''}`} />
              Bob (Gold)
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
        <button
          type="button"
          onClick={handleStartDemo}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
            isPlaying 
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 hover:bg-rose-500/30'
              : 'bg-[#D4AF37] hover:bg-[#e8c84a] text-black border border-[#D4AF37]'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3 h-3" />
              <span>Stop Demo</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 fill-black" />
              <span>{currentStep === 4 ? 'Replay 3-Way Demo' : 'Play 3-Way Demo'}</span>
            </>
          )}
        </button>

        {currentStep > 0 && !isPlaying && (
          <button
            type="button"
            onClick={stopDemo}
            className="p-1.5 rounded-md text-stone-400 hover:text-white bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}