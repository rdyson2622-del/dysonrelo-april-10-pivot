import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, Square, Volume2, Sparkles, Check, Loader2, 
  RotateCcw, Send, AlertCircle, Radio, UserCheck
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';
const CHARLIE_DESK_PHOTO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/2e7121744_Screenshot2026-09-09at25842PM.png";

// Authentic HeyGen Ruben voice audio for Charlie's referral greeting (instant 0ms CDN playback, authoritative American male)
const CHARLIE_RUBEN_REFERRAL_GREETING_AUDIO = "https://resource2.heygen.ai/text_to_speech/33dec76283f44f80b7d658cc9060acbb/cc5fb6c924064712ba9f690852aa4646/id=0f04d227-dac5-4059-9a22-d4bcb18ce92a.wav";

/**
 * CharlieVoiceReferralAssistant
 * Allows hands-free voice intake where Charlie converses with the user
 * using his authentic HeyGen Ruben voice and transcribes their spoken words to auto-populate the referral form.
 */
export default function CharlieVoiceReferralAssistant({ 
  form, 
  onUpdateFields, 
  onSubmitReferral,
  isSubmitting = false 
}) {
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [capturedSummary, setCapturedSummary] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Tap to speak your referral hands-free');
  const [browserSupported, setBrowserSupported] = useState(true);

  const recognitionRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const activeSessionRef = useRef(false);
  const transcriptBufferRef = useRef('');

  // Check speech recognition support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setBrowserSupported(false);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      activeSessionRef.current = false;
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
      if (audioPlayerRef.current) {
        try {
          audioPlayerRef.current.pause();
          audioPlayerRef.current = null;
        } catch {}
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('charlie-speech-active', { detail: { active: false } }));
      }
    };
  }, []);

  // Plays Charlie's authentic Ruben voice from an audio URL
  const playCharlieAudio = (audioUrl, onComplete) => {
    try {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }

      const audio = new Audio(audioUrl);
      audioPlayerRef.current = audio;

      audio.onplay = () => {
        setIsSpeaking(true);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('charlie-speech-active', { detail: { active: true } }));
        }
      };

      audio.onended = () => {
        setIsSpeaking(false);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('charlie-speech-active', { detail: { active: false } }));
        }
        if (onComplete) onComplete();
      };

      audio.onerror = (e) => {
        console.warn('Charlie audio playback error:', e);
        setIsSpeaking(false);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('charlie-speech-active', { detail: { active: false } }));
        }
        if (onComplete) onComplete();
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Autoplay prevented or interrupted:', err);
          setIsSpeaking(false);
          if (onComplete) onComplete();
        });
      }
    } catch (err) {
      console.warn('Error initiating audio playback:', err);
      setIsSpeaking(false);
      if (onComplete) onComplete();
    }
  };

  // Charlie Voice Synthesizer — ALWAYS uses authentic HeyGen Ruben voice, NEVER browser female TTS!
  const speakText = async (text, onComplete, isInitialGreeting = false) => {
    // 1. If it's the initial referral greeting, use the pre-rendered 0ms CDN HeyGen Ruben audio
    if (isInitialGreeting || text.includes("Hello! I'm Charlie Simmons. Just speak naturally")) {
      playCharlieAudio(CHARLIE_RUBEN_REFERRAL_GREETING_AUDIO, onComplete);
      return;
    }

    // 2. For custom spoken text, invoke Charlie's authentic Ruben voice synthesizer backend function
    try {
      setIsSpeaking(true);
      const res = await base44.functions.invoke('charlieSpeak', { text });
      const audioUrl = res?.data?.audioUrl;
      if (audioUrl) {
        playCharlieAudio(audioUrl, onComplete);
        return;
      }
    } catch (err) {
      console.warn('charlieSpeak invocation error, using male voice fallback:', err);
    }

    // 3. Fallback: Generate speech with authoritative male voice (never browser Samantha/female!)
    try {
      const ttsRes = await base44.integrations.Core.GenerateSpeech({
        text,
        voice: 'storm', // Authoritative American male voice
      });
      if (ttsRes?.url) {
        playCharlieAudio(ttsRes.url, onComplete);
        return;
      }
    } catch (fallbackErr) {
      console.warn('Fallback male TTS error:', fallbackErr);
    }

    setIsSpeaking(false);
    if (onComplete) onComplete();
  };

  // Start Speech Recognition
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onstart = () => {
      setIsListening(true);
      setStatusMessage('Listening to you speak…');
    };

    rec.onresult = (e) => {
      let full = '';
      for (let i = 0; i < e.results.length; i++) {
        full += e.results[i][0].transcript + ' ';
      }
      const trimmed = full.trim();
      setLiveTranscript(trimmed);
      transcriptBufferRef.current = trimmed;
    };

    rec.onerror = (e) => {
      if (e.error !== 'no-speech') {
        console.warn('Speech recognition error:', e.error);
      }
    };

    rec.onend = () => {
      // If session is still active, process the audio buffer
      if (activeSessionRef.current) {
        setIsListening(false);
        if (transcriptBufferRef.current.length > 5) {
          processSpokenTranscript(transcriptBufferRef.current);
        } else {
          // Restart if nothing said yet
          try { rec.start(); } catch {}
        }
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = rec;
    try {
      rec.start();
    } catch (err) {
      console.warn('Could not start recognition:', err);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setIsListening(false);
  };

  // Process the spoken text with AI to populate fields
  const processSpokenTranscript = async (rawText) => {
    if (!rawText || rawText.trim().length < 4) return;
    setIsParsing(true);
    setStatusMessage('Charlie is extracting referral details…');

    try {
      const prompt = `You are Charlie Simmons, AI Relocation Concierge for DysonRelo.
A user just spoke the following referral information:
"${rawText}"

Extract and structure this into referral data. Current form values:
- referred_name: "${form.referred_name || ''}"
- referred_email: "${form.referred_email || ''}"
- referred_phone: "${form.referred_phone || ''}"
- destination_city: "${form.destination_city || ''}"
- destination_state: "${form.destination_state || ''}"
- referred_company: "${form.referred_company || ''}"
- referrer_name: "${form.referrer_name || ''}"
- referrer_email: "${form.referrer_email || ''}"
- notes: "${form.notes || ''}"
- referral_type: "${form.referral_type || 'relocation_client'}"

Rules:
1. Extract any mentioned names, email addresses, phone numbers, cities, states, and notes.
2. If the user mentions a state (e.g. Arizona, California, Texas), convert to 2-letter uppercase abbreviation (AZ, CA, TX).
3. If they say "submit", "send it", "looks good", or "go ahead", set should_submit=true.
4. If referral type is an agent, lender, or vendor, set referral_type appropriately ('relocation_client', 'agent', 'vendor', 'other').
5. Create a short 1-sentence verbal confirmation Charlie should speak back to the user.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            referred_name: { type: "string" },
            referred_email: { type: "string" },
            referred_phone: { type: "string" },
            referred_company: { type: "string" },
            destination_city: { type: "string" },
            destination_state: { type: "string" },
            referrer_name: { type: "string" },
            referrer_email: { type: "string" },
            referral_type: { type: "string", enum: ["relocation_client", "agent", "vendor", "other"] },
            notes: { type: "string" },
            should_submit: { type: "boolean" },
            charlie_spoken_response: { type: "string" }
          }
        }
      });

      if (response) {
        const updates = {};
        if (response.referred_name) updates.referred_name = response.referred_name;
        if (response.referred_email) updates.referred_email = response.referred_email;
        if (response.referred_phone) updates.referred_phone = response.referred_phone;
        if (response.referred_company) updates.referred_company = response.referred_company;
        if (response.destination_city) updates.destination_city = response.destination_city;
        if (response.destination_state) updates.destination_state = response.destination_state;
        if (response.referrer_name) updates.referrer_name = response.referrer_name;
        if (response.referrer_email) updates.referrer_email = response.referrer_email;
        if (response.referral_type) updates.referral_type = response.referral_type;
        if (response.notes) updates.notes = response.notes;

        // Populate fields in parent form
        onUpdateFields(updates);

        setCapturedSummary({
          name: updates.referred_name || form.referred_name,
          email: updates.referred_email || form.referred_email,
          destination: updates.destination_city ? `${updates.destination_city}, ${updates.destination_state || ''}` : form.destination_city,
          phone: updates.referred_phone || form.referred_phone,
        });

        // Verbal feedback from Charlie
        const replyText = response.charlie_spoken_response || 
          `I have captured ${updates.referred_name || 'your referral'}. Ready to submit to Bob Dyson's desk.`;
        
        setStatusMessage(replyText);

        speakText(replyText, () => {
          if (response.should_submit && onSubmitReferral) {
            setStatusMessage('Submitting referral to Bob Dyson’s desk…');
            onSubmitReferral();
          } else {
            // Keep listening if user wants to add more
            if (activeSessionRef.current) {
              startListening();
            }
          }
        });
      }
    } catch (err) {
      console.error('Error parsing speech:', err);
      setStatusMessage('Details captured. You can review and edit below.');
    } finally {
      setIsParsing(false);
    }
  };

  // Launch Hands-Free Charlie V2V Session
  const toggleHandsFreeSession = () => {
    if (isActive) {
      // Disconnect
      activeSessionRef.current = false;
      stopListening();
      if (audioPlayerRef.current) {
        try {
          audioPlayerRef.current.pause();
          audioPlayerRef.current = null;
        } catch {}
      }
      setIsActive(false);
      setIsSpeaking(false);
      setStatusMessage('Voice intake paused. Tap to restart anytime.');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('charlie-speech-active', { detail: { active: false } }));
      }
      return;
    }

    // Connect & start
    activeSessionRef.current = true;
    setIsActive(true);
    setLiveTranscript('');
    transcriptBufferRef.current = '';

    const greeting = "Hello! I'm Charlie Simmons. Just speak naturally—tell me who you'd like to refer, their email or phone, and where they're moving, and I'll fill out the file for you.";
    setStatusMessage(greeting);

    speakText(greeting, () => {
      if (activeSessionRef.current) {
        startListening();
      }
    }, true);
  };

  // Single Quick-Mic Dictation toggle (finish dictating)
  const handleStopAndParse = () => {
    stopListening();
    if (transcriptBufferRef.current) {
      processSpokenTranscript(transcriptBufferRef.current);
    }
  };

  if (!browserSupported) {
    return null;
  }

  return (
    <div 
      className="w-full rounded-2xl p-4 sm:p-5 border shadow-xl relative overflow-hidden transition-all duration-300"
      style={{
        background: 'linear-gradient(145deg, #16130e 0%, #0c0b08 100%)',
        borderColor: isActive ? (isSpeaking ? GOLD : '#10b981') : 'rgba(212,175,55,0.45)',
        boxShadow: isActive 
          ? '0 0 25px rgba(212,175,55,0.3), 0 8px 24px rgba(0,0,0,0.8)' 
          : '0 4px 16px rgba(0,0,0,0.6)',
      }}
    >
      {/* Top Gold Subtle Trim */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        
        {/* Charlie Avatar with interactive speaking/listening state */}
        <div 
          onClick={toggleHandsFreeSession}
          className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 shrink-0 cursor-pointer group shadow-lg transition-transform duration-300 ${
            isSpeaking 
              ? 'border-[#D4AF37] ring-4 ring-[#D4AF37]/40 scale-105' 
              : isListening 
              ? 'border-emerald-400 ring-4 ring-emerald-500/40 scale-105 animate-pulse' 
              : 'border-[#D4AF37]/60 hover:border-[#D4AF37]'
          }`}
          title="Click to talk with Charlie hands-free"
        >
          <img 
            src={CHARLIE_DESK_PHOTO} 
            alt="Charlie Simmons AI Concierge" 
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
          
          <div className="absolute bottom-1 inset-x-1 flex items-center justify-center">
            <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full flex items-center gap-1 shadow ${
              isSpeaking 
                ? 'bg-[#D4AF37] text-black' 
                : isListening 
                ? 'bg-emerald-400 text-black' 
                : 'bg-black/80 text-white border border-[#D4AF37]/50'
            }`}>
              {isSpeaking ? (
                <>
                  <Volume2 className="w-2 h-2 fill-black" />
                  <span>Speaking</span>
                </>
              ) : isListening ? (
                <>
                  <Mic className="w-2 h-2 fill-black" />
                  <span>Listening</span>
                </>
              ) : (
                <>
                  <Mic className="w-2 h-2 text-[#D4AF37]" />
                  <span>Talk</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Content & Voice Controls */}
        <div className="flex-1 min-w-0 text-left space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[10px] font-black tracking-widest uppercase text-[#D4AF37]">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                <span>Hands-Free Voice-to-Form Intake</span>
              </span>
              {isActive && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live V2V Active
                </span>
              )}
            </div>

            {/* Main Action Trigger */}
            <button
              type="button"
              onClick={toggleHandsFreeSession}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md cursor-pointer ${
                isActive
                  ? 'bg-red-500/25 text-red-300 border border-red-500/50 hover:bg-red-500/40'
                  : 'bg-[#D4AF37] text-black hover:bg-[#e8c84a] active:scale-95'
              }`}
            >
              {isActive ? (
                <>
                  <Square className="w-3 h-3 fill-current" />
                  <span>Stop Voice Intake</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-black" />
                  <span>Talk with Charlie</span>
                </>
              )}
            </button>
          </div>

          {/* Status Message / What Charlie is saying */}
          <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white/90 leading-relaxed font-sans min-h-[42px] flex items-center">
            {isParsing ? (
              <span className="flex items-center gap-2 text-[#D4AF37] font-semibold">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Extracting contact details and filling form…</span>
              </span>
            ) : isSpeaking ? (
              <span className="flex items-center gap-2 text-[#D4AF37] font-medium">
                <Volume2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 animate-pulse" />
                <span>"{statusMessage}"</span>
              </span>
            ) : isListening ? (
              <div className="space-y-1 w-full">
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Listening to your voice… (Speak now)</span>
                </span>
                {liveTranscript && (
                  <p className="text-white text-xs italic bg-white/5 p-1.5 rounded border border-white/10">
                    "{liveTranscript}"
                  </p>
                )}
              </div>
            ) : (
              <span className="text-white/70 text-xs">
                {statusMessage}
              </span>
            )}
          </div>

          {/* Quick Action Buttons while recording */}
          {isActive && isListening && (
            <div className="flex items-center gap-2 pt-0.5">
              <button
                type="button"
                onClick={handleStopAndParse}
                disabled={!liveTranscript || isParsing}
                className="px-3 py-1 rounded-lg text-[10px] font-bold bg-[#D4AF37] text-black hover:bg-[#e8c84a] disabled:opacity-40 flex items-center gap-1 cursor-pointer shadow-sm transition-all"
              >
                <Check className="w-3 h-3" />
                <span>Done Speaking · Populate Form</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLiveTranscript('');
                  transcriptBufferRef.current = '';
                }}
                className="px-2 py-1 rounded-lg text-[10px] font-bold text-white/60 hover:text-white bg-white/5 border border-white/10 transition-colors"
              >
                Clear
              </button>
            </div>
          )}

          {/* Live Extracted Summary Badges */}
          {capturedSummary && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
              <span className="text-white/50 font-bold uppercase tracking-wider text-[9px]">Captured:</span>
              {capturedSummary.name && (
                <span className="px-2 py-0.5 rounded-md bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 font-semibold flex items-center gap-1">
                  <Check className="w-2.5 h-2.5" />
                  <span>{capturedSummary.name}</span>
                </span>
              )}
              {capturedSummary.email && (
                <span className="px-2 py-0.5 rounded-md bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 font-semibold">
                  {capturedSummary.email}
                </span>
              )}
              {capturedSummary.destination && (
                <span className="px-2 py-0.5 rounded-md bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 font-semibold">
                  📍 {capturedSummary.destination}
                </span>
              )}
              {capturedSummary.phone && (
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-white/80 border border-white/20 font-mono">
                  {capturedSummary.phone}
                </span>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}