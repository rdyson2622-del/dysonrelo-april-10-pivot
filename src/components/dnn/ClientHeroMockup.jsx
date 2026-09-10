import React from 'react';
import HeroGeminiConcierge from '@/components/charlie/HeroGeminiConcierge';

const GOLD = '#D4AF37';
const DYSON_LOGO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/aa2b5389f_Screenshot2026-08-01at41912PM.png";
const STUDIO_STILL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/0f55cd52a_DNNStudioLandingPage.png';
const STUDIO_LOOP_VIDEO = 'https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/f22ec4070_charlie-desk-loop.mp4';

/**
 * MOCKUP — new client portal front page, placed ABOVE the existing
 * StudioHeroBanner/SolutionMapEntry stack in Home.jsx so nothing is lost.
 * Tan background, headline copy on the left, DNN studio video shrunk to
 * ~50% size on the right.
 */
const BOB_HEADSHOT = "https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/09d1d285a_bob_dyson_black_shirt.webp";

export default function ClientHeroMockup({
  label = 'Your Client Portal',
  quoteLine1 = '"We provide a Real Time, lifetime workspace designed to maximize your real estate opportunities.',
  quoteLine2 = 'No sales pitches, just real-time solutions and a clear path to execute results."',
  attribution = '— Bob Dyson',
  showSubscriberBox = false,
  subscriberName = 'Bob Dyson',
  subscriberRole = 'HR Relocation Director',
  subscriberPhoto = BOB_HEADSHOT,
}) {
  const isHRPortal = showSubscriberBox || (typeof label === 'string' && (label.toLowerCase().includes('corporate') || label.toLowerCase().includes('hr')));

  const [v2vState, setV2vState] = React.useState('ready'); // ready, connecting, listening, speaking, error
  const [speaker, setSpeaker] = React.useState(null); // 'user', 'assistant', null

  React.useEffect(() => {
    const handleState = (e) => {
      if (e?.detail?.status) {
        setV2vState(e.detail.status);
      }
    };
    const handleSpeaker = (e) => {
      setSpeaker(e?.detail?.speaker || null);
    };

    window.addEventListener('v2v-session-state', handleState);
    window.addEventListener('v2v-speaker-change', handleSpeaker);

    return () => {
      window.removeEventListener('v2v-session-state', handleState);
      window.removeEventListener('v2v-speaker-change', handleSpeaker);
    };
  }, []);

  const isV2VActive = v2vState === 'listening' || v2vState === 'speaking' || v2vState === 'connecting';
  const userSpeaking = isV2VActive && (speaker === 'user' || v2vState === 'listening');
  const charlieSpeaking = isV2VActive && (speaker === 'assistant' || v2vState === 'speaking');

  const toggleV2V = (e) => {
    if (e) e.stopPropagation();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('toggle-charlie-v2v'));
    }
  };

  return (
    <div className="w-full px-6 sm:px-10 py-6" style={{ background: '#ede0cc' }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
        {/* Header copy — left */}
        <div className="flex-1 text-center md:text-left">
          <p className="text-xs font-black tracking-[0.3em] uppercase mb-3" style={{ color: GOLD }}>
            {label}
          </p>
          <p
            className="italic font-semibold leading-snug"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(1.22rem, 2.45vw, 1.99rem)',
              color: '#1a1a1a',
            }}
          >
            {quoteLine1}
          </p>
          <p
            className="italic font-semibold leading-snug mt-2"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(1.22rem, 2.45vw, 1.99rem)',
              color: GOLD,
            }}
          >
            {quoteLine2}
          </p>

          {/* Discreet Gemini Live Voice Concierge — Upper Left */}
          <HeroGeminiConcierge />
        </div>

        {/* Right column: Either HR Subscriber + Charlie Two-Way V2V boxes, or Single Studio Box */}
        <div className="w-full md:w-1/2 shrink-0">
          {isHRPortal ? (
            <div className="flex flex-col items-center gap-2.5 w-full max-w-[399px] mx-auto">
              {/* 1. TOP BOX: HR SUBSCRIBER (Bob Dyson in headshot black shirt) */}
              <div 
                onClick={toggleV2V}
                className={`relative rounded-2xl overflow-hidden w-full aspect-[16/9] bg-black shadow-xl transition-all duration-300 cursor-pointer group ${
                  userSpeaking
                    ? 'border-2 border-emerald-400 ring-4 ring-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.5)] scale-[1.01]'
                    : isV2VActive
                    ? 'border-2 border-[#D4AF37] ring-2 ring-[#D4AF37]/30'
                    : 'border-2 border-[#D4AF37]/80 hover:border-[#D4AF37]'
                }`}
                title={isV2VActive ? "Connected to Charlie V2V — Click to disconnect" : "Click to start live V2V conversation with Charlie"}
              >
                {/* Top-right: V2V status */}
                <div className="absolute top-2 right-2 z-10">
                  <span 
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] font-bold tracking-wider uppercase shadow-md border ${
                      userSpeaking
                        ? 'bg-emerald-500/90 text-black border-emerald-300 animate-pulse'
                        : isV2VActive
                        ? 'bg-black/80 text-emerald-400 border-emerald-500/50'
                        : 'bg-black/75 text-white/80 border-[#D4AF37]/50 group-hover:border-[#D4AF37] group-hover:text-[#D4AF37]'
                    }`}
                  >
                    {userSpeaking ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                        <span>Speaking</span>
                        <span className="flex items-center gap-0.5 ml-0.5">
                          <span className="w-0.5 h-2 bg-black animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-0.5 h-2.5 bg-black animate-bounce" style={{ animationDelay: '150ms' }} />
                        </span>
                      </>
                    ) : isV2VActive ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>V2V Live</span>
                      </>
                    ) : (
                      <span>Tap to Talk</span>
                    )}
                  </span>
                </div>

                {/* Ambient backdrop fill to prevent pillarboxing */}
                <img 
                  src={subscriberPhoto} 
                  alt="" 
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover object-[center_30%] filter blur-lg opacity-40 scale-125 pointer-events-none"
                />
                {/* Bob Dyson headshot in black shirt - uncropped with full head, collar, and shirt */}
                <img
                  src={subscriberPhoto}
                  alt={subscriberName}
                  className={`relative z-0 h-full w-auto max-w-full object-contain transition-transform duration-500 ${
                    userSpeaking ? 'scale-105' : 'group-hover:scale-105'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent pointer-events-none z-10" />

                {/* LOWER LEFT CORNER: Name tag just like Charlie's */}
                <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/85 border border-[#D4AF37]/75 shadow-lg backdrop-blur-md">
                  <span className={`w-2 h-2 rounded-full ${userSpeaking ? 'bg-emerald-400 animate-ping' : 'bg-emerald-400'}`} />
                  <span className="text-xs font-bold text-white tracking-wide font-sans">{subscriberName}</span>
                  <span className="text-[8.5px] text-[#D4AF37] font-semibold uppercase tracking-wider">• {subscriberRole}</span>
                </div>
              </div>

              {/* 2. REAL-TIME V2V CONNECTION BRIDGE */}
              <div 
                className="w-full flex items-center justify-between px-3 py-1 rounded-full shadow-md text-[9px] font-bold"
                style={{
                  background: 'linear-gradient(90deg, #16130d 0%, #0d0b07 100%)',
                  border: `1px solid ${isV2VActive ? (charlieSpeaking ? GOLD : '#10b981') : `${GOLD}70`}`,
                }}
              >
                <div className="flex items-center gap-2">
                  <span 
                    className={`w-2 h-2 rounded-full ${
                      charlieSpeaking ? 'bg-[#D4AF37] animate-ping' : userSpeaking ? 'bg-emerald-400 animate-ping' : isV2VActive ? 'bg-emerald-400' : 'bg-[#D4AF37]'
                    }`} 
                  />
                  <span className="text-[#D4AF37] tracking-wider uppercase font-sans">
                    {charlieSpeaking ? 'Charlie Speaking…' : userSpeaking ? 'Bob Dyson Speaking…' : isV2VActive ? 'V2V Voice Channel Active' : 'Bidirectional V2V Direct Link'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={toggleV2V}
                  className={`px-2.5 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    isV2VActive
                      ? 'bg-red-500/25 text-red-300 border border-red-500/50 hover:bg-red-500/40'
                      : 'bg-[#D4AF37] text-black hover:bg-[#e8c84a] shadow-sm'
                  }`}
                >
                  {isV2VActive ? 'Stop V2V' : 'Start V2V Talk'}
                </button>
              </div>

              {/* 3. BOTTOM BOX: CHARLIE IN THE STUDIO */}
              <div 
                onClick={toggleV2V}
                className={`relative rounded-2xl overflow-hidden w-full aspect-[16/9] bg-black shadow-xl transition-all duration-300 cursor-pointer group ${
                  charlieSpeaking
                    ? 'border-2 border-[#D4AF37] ring-4 ring-[#D4AF37]/50 shadow-[0_0_30px_rgba(212,175,55,0.6)] scale-[1.01]'
                    : isV2VActive
                    ? 'border-2 border-[#D4AF37] ring-2 ring-[#D4AF37]/30'
                    : 'border-2 border-[#D4AF37]/80 hover:border-[#D4AF37]'
                }`}
                title={isV2VActive ? "Charlie in Live Session — Click to disconnect" : "Click to start live V2V conversation with Charlie"}
              >
                {/* Top-left: Live badge */}
                <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-widest shadow-md" style={{ background: 'rgba(0,0,0,0.85)', border: '1px solid #ef4444', color: '#ef4444' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE • DNN STUDIO
                </span>

                {/* Top-right: Speaking waveform */}
                <div className="absolute top-2 right-2 z-10">
                  <span 
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] font-bold tracking-wider uppercase shadow-md border ${
                      charlieSpeaking
                        ? 'bg-[#D4AF37] text-black border-black animate-pulse'
                        : isV2VActive
                        ? 'bg-black/80 text-[#D4AF37] border-[#D4AF37]/50'
                        : 'bg-black/75 text-white/80 border-[#D4AF37]/50 group-hover:border-[#D4AF37] group-hover:text-[#D4AF37]'
                    }`}
                  >
                    {charlieSpeaking ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                        <span>Charlie Speaking</span>
                        <span className="flex items-center gap-0.5 ml-0.5">
                          <span className="w-0.5 h-2 bg-black animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-0.5 h-2.5 bg-black animate-bounce" style={{ animationDelay: '150ms' }} />
                        </span>
                      </>
                    ) : isV2VActive ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                        <span>Listening to You</span>
                      </>
                    ) : (
                      <span>Tap to Talk</span>
                    )}
                  </span>
                </div>

                {/* Charlie at studio desk video */}
                <video
                  src={STUDIO_LOOP_VIDEO}
                  poster={STUDIO_STILL}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    charlieSpeaking ? 'scale-105' : 'group-hover:scale-105'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent pointer-events-none" />

                {/* LOWER LEFT CORNER: Name tag just like Bob's */}
                <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/85 border border-[#D4AF37]/75 shadow-lg backdrop-blur-md">
                  <span className={`w-2 h-2 rounded-full ${charlieSpeaking ? 'bg-[#D4AF37] animate-ping' : 'bg-emerald-400'}`} />
                  <span className="text-xs font-bold text-white tracking-wide font-sans">Charlie Simmons</span>
                  <span className="text-[8.5px] text-[#D4AF37] font-semibold uppercase tracking-wider">• AI Concierge</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden mx-auto" style={{ border: `2px solid ${GOLD}`, background: '#000', maxWidth: '399px' }}>
              <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest" style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid #ef4444', color: '#ef4444' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE
              </span>
              <video
                src={STUDIO_LOOP_VIDEO}
                poster={STUDIO_STILL}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/85 border border-[#D4AF37]/75 shadow-lg backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold text-white tracking-wide font-sans">Charlie Simmons</span>
                <span className="text-[8.5px] text-[#D4AF37] font-semibold uppercase tracking-wider">• AI Concierge</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}