import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Sparkles, CheckCircle, ShieldCheck } from 'lucide-react';

/**
 * CopilotThreeWayDemo
 * 
 * Interactive "How to / What to Expect" 3-way conversational audio demo:
 * 1. Consumer asks about bluff risk and closing credit on La Jolla property
 * 2. Charlie (AI Concierge) pulls zoning/setbacks and hands off to Bob
 * 3. Bob Dyson (Broker) steps in with legal contingencies and HUD-1 credit verification
 * 
 * Manages audio playback sequentially using synthesized voices with distinct pitches/rates,
 * ensuring zero audio collisions or overlapping streams.
 */
export const THREE_WAY_SCRIPT = [
  {
    turn: 1,
    speaker: 'consumer',
    speakerName: 'You (Buyer)',
    role: 'Verified Buyer',
    text: "We're looking at 7414 Fay Ave in La Jolla. Is the bluff setback going to be a problem, and can we structure a closing rebate?",
    voiceConfig: { pitch: 1.05, rate: 1.02, voiceType: 'consumer' },
    delayMs: 3800
  },
  {
    turn: 2,
    speaker: 'charlie',
    speakerName: 'Charlie Simmons',
    role: 'AI Voice Concierge',
    text: "Charlie here: On 7414 Fay Ave, coastal zoning requires a mandatory 25-foot bluff setback and geotechnical soil report. Comps show the property is listed at an 18% premium. Let me bring in Bob Dyson to structure your contingency shield.",
    voiceConfig: { pitch: 1.15, rate: 1.05, voiceType: 'charlie' },
    delayMs: 6500
  },
  {
    turn: 3,
    speaker: 'bob',
    speakerName: 'Bob Dyson',
    role: 'Principal Broker · DRE #00609384',
    text: "Bob Dyson here. In California coastal transactions, we never let you write an offer without an un-waivable soil stability inspection. And under our zero-fee protocol, your estimated $16,800 closing rebate is locked directly on line 204 of your HUD-1.",
    voiceConfig: { pitch: 0.88, rate: 0.95, voiceType: 'bob' },
    delayMs: 6800
  }
];

export default function CopilotThreeWayDemo({ onTurnChange, onResetDemo, onMessagePosted }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0 = idle, 1 = consumer, 2 = charlie, 3 = bob, 4 = done
  const [hasAudioSupport, setHasAudioSupport] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setHasAudioSupport(false);
    }
  }, []);

  // Helper to speak a turn with distinct voice profile
  const speakTurn = (turnData, onEndCallback) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEndCallback) onEndCallback();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(turnData.text);
      utterance.pitch = turnData.voiceConfig.pitch || 1.0;
      utterance.rate = turnData.voiceConfig.rate || 1.0;

      // Select distinct system voices if available
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        if (turnData.speaker === 'bob') {
          // Look for deeper/male sounding English voice
          const maleVoice = voices.find(v => v.lang.startsWith('en') && /male|david|george|alex|daniel/i.test(v.name));
          if (maleVoice) utterance.voice = maleVoice;
        } else if (turnData.speaker === 'charlie') {
          // Look for clean/bright voice
          const charlieVoice = voices.find(v => v.lang.startsWith('en') && /natural|aaron|samantha|karen|fred/i.test(v.name));
          if (charlieVoice) utterance.voice = charlieVoice;
        } else {
          // Consumer voice
          const consumerVoice = voices.find(v => v.lang.startsWith('en') && /susan|victoria|zoe|steffi/i.test(v.name));
          if (consumerVoice) utterance.voice = consumerVoice;
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
      setCurrentStep(4); // Completed
      if (onTurnChange) onTurnChange(null);
      return;
    }

    const turn = THREE_WAY_SCRIPT[stepIndex];
    setCurrentStep(stepIndex + 1);

    // Notify parent to visually enlarge the active speaker box
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

    // Play spoken voice with fallback timer in case utterance finishes early/late
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="rounded-xl p-2 bg-gradient-to-r from-[#18150c] via-[#121212] to-[#141818] border border-[#D4AF37]/50 shadow-md flex items-center justify-between gap-2 text-left">
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
          {isPlaying ? (
            <Volume2 className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="text-[10px] font-bold text-white tracking-wide truncate">
              {isPlaying 
                ? currentStep === 1 
                  ? 'Step 1/3: You Ask (Buyer)' 
                  : currentStep === 2 
                  ? 'Step 2/3: Charlie Analyzes' 
                  : 'Step 3/3: Bob Dyson Directs'
                : currentStep === 4
                ? 'Demo Complete · Try Live Question'
                : 'What To Expect: 3-Way Live Audio Discussion'
              }
            </span>
            <span className="text-[7.5px] px-1 py-0.2 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-mono uppercase font-bold shrink-0">
              AUDIO DEMO
            </span>
          </div>
          <p className="text-[8.5px] text-stone-400 truncate mt-0.5">
            {isPlaying 
              ? 'Hear real-time speaker turn-taking between Buyer, AI Concierge & Broker'
              : 'Listen to a sample 3-way turn between You, Charlie Simmons & Bob Dyson'
            }
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={handleStartDemo}
          className={`px-2.5 py-1 rounded-lg text-[9.5px] font-bold transition-all flex items-center gap-1 shadow-sm cursor-pointer ${
            isPlaying 
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
              : 'bg-[#D4AF37] hover:bg-[#e8c84a] text-black border border-[#D4AF37]'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-2.5 h-2.5" />
              <span>Stop</span>
            </>
          ) : (
            <>
              <Play className="w-2.5 h-2.5 fill-black" />
              <span>{currentStep === 4 ? 'Replay' : 'Play Audio'}</span>
            </>
          )}
        </button>

        {currentStep > 0 && !isPlaying && (
          <button
            type="button"
            onClick={stopDemo}
            className="p-1 rounded-md text-stone-400 hover:text-white bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
            title="Reset conversation"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}