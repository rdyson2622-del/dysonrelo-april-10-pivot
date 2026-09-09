import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Radio, Phone } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import TalkingOrb from '@/components/talkingapp/TalkingOrb';
import LiveDiscussionBox from '@/components/talkingapp/LiveDiscussionBox';

const GOLD = '#D4AF37';
const CHARLIE_DNN_DESK_PHOTO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/6421add7d_Screenshot2026-08-31at40550PM.png';

const SUGGESTED_QUESTIONS = [
  'Compare CA vs AZ state taxes and savings',
  'How do you vet the top 1% of agents?',
  'What are the key milestones in an escrow?',
  'Explain the zero-fee relocation model',
];

export default function TalkingApp() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('ready');
  const [transcript, setTranscript] = useState([]);
  const [currentSpeaker, setCurrentSpeaker] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);
  const [navTarget, setNavTarget] = useState(null);

  const prevStatusRef = useRef(status);
  const sessionLogIdRef = useRef(null);

  const addTranscript = (entry) => {
    setTranscript((prev) => [
      ...prev,
      {
        ...entry,
        id: entry.id || Date.now() + Math.random(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // When call ends, generate a roadmap from discussion
  useEffect(() => {
    const wasLive = ['active', 'connecting', 'listening', 'speaking'].includes(prevStatusRef.current);
    if (wasLive && status === 'ready') {
      const userText = transcript
        .filter((t) => t.role === 'user')
        .map((t) => t.text)
        .join(' ')
        .trim();

      if (userText.length > 10) {
        setGeneratingRoadmap(true);
        base44.functions
          .invoke('realEstateIssueRoadmap', { request_text: userText, context: 'general' })
          .then((res) => {
            setRoadmap(res.data?.request || null);
            if (sessionLogIdRef.current) {
              base44.entities.TalkingSessionLog.update(sessionLogIdRef.current, { roadmap_generated: true }).catch(() => {});
            }
          })
          .catch(() => {})
          .finally(() => setGeneratingRoadmap(false));
      }
    }
    prevStatusRef.current = status;
  }, [status, transcript]);

  return (
    <div className="min-h-full p-3 sm:p-6 md:p-8 space-y-6 text-[#0a0a0a]" style={{ background: '#ede0cc' }}>
      
      {/* ========================================================
          PAGE HEADER: CHARLIE CONCIERGE IDENTITY
          ======================================================== */}
      <header className="p-4 sm:p-5 rounded-3xl bg-[#111111] border border-[#D4AF37]/50 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-xl bg-black">
              <img 
                src="https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/6421add7d_Screenshot2026-08-31at40550PM.png"
                alt="Charlie Simmons - Voice AI Concierge"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#10b981] border-2 border-black animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 
                className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Charlie Simmons
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-[#D4AF37] text-black">
                VOICE AI CONCIERGE
              </span>
              <span className="px-2 py-0.5 rounded-full text-[8.5px] font-bold text-[#10b981] bg-black border border-[#10b981]/50">
                GEMINI LIVE 2-WAY V2V
              </span>
            </div>
            <p className="text-xs text-white/70 mt-1 max-w-xl">
              Fiduciary relocation intelligence across all 50 states. Tap the microphone to talk naturally about tax savings, vetted local agents, and relocation roadmaps.
            </p>
          </div>
        </div>

        {/* Quick Phone Line Dock */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          <a
            href="tel:+18583531200"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black border border-[#D4AF37]/50 text-[#D4AF37] hover:border-[#D4AF37] text-xs font-bold transition-all shadow-sm"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>(858) 353-1200</span>
          </a>
        </div>
      </header>

      {/* ========================================================
          MAIN 2-COLUMN STAGE:
          Left: Voice Mic Station + Settings Gallery
          Right: Live Discussion Capture Text Box
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── LEFT COLUMN (7 COLS): MIC ORB WITH CHARLIE STUDIO COLLAGE BACKDROP ── */}
        <div className="lg:col-span-7">

          {/* ACTIVE MIC & VOICE CONVERSATION STATION WITH SINGLE CHARLIE & DNN LOGO STILL */}
          <div 
            className="p-4 sm:p-6 rounded-3xl border border-[#D4AF37]/60 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[540px]"
          >
            {/* SINGLE SHOT OF CHARLIE NEXT TO THE DNN LOGO */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
              <img
                src={CHARLIE_DNN_DESK_PHOTO}
                alt="Charlie Simmons at the DNN Desk"
                className="w-full h-full object-cover object-top sm:object-center brightness-105 saturate-105"
              />
              <div className="absolute inset-0 border border-[#D4AF37]/50 pointer-events-none rounded-3xl" />
            </div>

            {/* FOREGROUND INTERACTION LAYER */}
            <div className="relative z-10 w-full flex flex-col justify-between h-full min-h-[500px]">
              
              {/* Top Bar Indicator */}
              <div className="flex items-center justify-between w-full text-xs text-white/80">
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#D4AF37] bg-black/80 px-3 py-1 rounded-full border border-[#D4AF37]/50 shadow-md backdrop-blur-md">
                  <Radio className="w-3.5 h-3.5 text-[#10b981] animate-pulse" />
                  <span>Charlie Studio Voice Channel</span>
                </span>
                <span className="text-[10px] text-white/80 font-mono bg-black/80 px-3 py-1 rounded-full border border-white/15 backdrop-blur-md shadow-md">
                  Gemini Live • Spoken 2-Way AI
                </span>
              </div>

              {/* In-Call Navigation Suggestion Pill */}
              {navTarget && (
                <div 
                  className="mx-auto z-20 flex items-center gap-2.5 px-4 py-2 rounded-full border shadow-2xl animate-bounce"
                  style={{
                    background: 'rgba(20,20,20,0.95)',
                    borderColor: GOLD,
                    boxShadow: '0 4px 25px rgba(212,175,55,0.4)',
                  }}
                >
                  <Compass className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-xs font-bold text-white">
                    Charlie suggests: <span className="text-[#e8c84a]">{navTarget.title}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate(navTarget.path)}
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#D4AF37] text-black hover:scale-105 transition-all cursor-pointer"
                  >
                    Go Now →
                  </button>
                </div>
              )}

              {/* Bottom Dock: Suggested Questions (Left) & Compact Mic Box (Tucked into Lower Right Corner) */}
              <div className="mt-auto pt-6 flex items-end justify-between gap-3 w-full relative">
                
                {/* Suggested Questions (Bottom Left) */}
                <div className="w-full max-w-[calc(100%-140px)] sm:max-w-xs md:max-w-sm text-left bg-black/80 p-3 sm:p-3.5 rounded-2xl backdrop-blur-md border border-white/15 shadow-2xl space-y-1.5">
                  <div className="flex items-center justify-between text-[9.5px] font-black uppercase tracking-wider text-[#D4AF37]">
                    <span>Suggested questions:</span>
                    <span className="text-white/50 lowercase font-normal">tap mic &amp; speak</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {SUGGESTED_QUESTIONS.map((q, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-full text-[10px] sm:text-[10.5px] bg-[#141414]/90 border border-white/15 text-white/90 hover:text-white hover:border-[#D4AF37] transition-all select-none shadow-sm"
                      >
                        “{q}”
                      </span>
                    ))}
                  </div>
                </div>

                {/* 50% Reduced Mic Box Tucked into the Lower Right Corner */}
                <div className="absolute bottom-0 right-0 z-20 shrink-0">
                  <TalkingOrb
                    status={status}
                    setStatus={setStatus}
                    onTranscript={addTranscript}
                    onSpeaker={setCurrentSpeaker}
                    onSessionId={(id) => { sessionLogIdRef.current = id; }}
                    onNavigate={(nav) => setNavTarget(nav)}
                    buttonLabel="Talk with Charlie"
                    compact={true}
                  />
                </div>

              </div>

            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN (5 COLS): LIVE DISCUSSION TEXT BOX ── */}
        <div className="lg:col-span-5 flex flex-col h-full min-h-[500px]">
          <LiveDiscussionBox
            transcript={transcript}
            currentSpeaker={currentSpeaker}
            generatingRoadmap={generatingRoadmap}
            roadmap={roadmap}
            onClear={() => {
              setTranscript([]);
              setRoadmap(null);
            }}
          />
        </div>

      </div>

    </div>
  );
}