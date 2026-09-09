import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Radio, Phone } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import TalkingOrb from '@/components/talkingapp/TalkingOrb';
import CharlieCollageBackdrop, { CHARLIE_PHOTOS } from '@/components/charlie/CharlieCollageBackdrop';
import LiveDiscussionBox from '@/components/talkingapp/LiveDiscussionBox';

const GOLD = '#D4AF37';

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

          {/* ACTIVE MIC & VOICE CONVERSATION STATION WITH CHARLIE PHOTO COLLAGE BACKDROP */}
          <div 
            className="p-5 sm:p-6 rounded-3xl border border-[#D4AF37]/60 shadow-2xl relative overflow-hidden flex flex-col items-center text-center justify-between min-h-[520px]"
          >
            {/* CHARLIE PHOTOS COLLAGE BACKDROP (IN THE SAME BOX, NO SEPARATE BOX) */}
            <CharlieCollageBackdrop />

            {/* FOREGROUND INTERACTION LAYER */}
            <div className="relative z-10 w-full flex flex-col items-center justify-between h-full space-y-4">
              
              {/* Top Bar Indicator */}
              <div className="flex items-center justify-between w-full text-xs text-white/80 mb-1">
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#D4AF37] bg-black/70 px-2.5 py-1 rounded-full border border-[#D4AF37]/40 shadow-sm backdrop-blur-md">
                  <Radio className="w-3.5 h-3.5 text-[#10b981] animate-pulse" />
                  <span>Charlie Studio Voice Channel</span>
                </span>
                <span className="text-[10px] text-white/70 font-mono bg-black/70 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-md">
                  Gemini Live • Spoken 2-Way AI
                </span>
              </div>

              {/* In-Call Navigation Suggestion Pill */}
              {navTarget && (
                <div 
                  className="z-20 flex items-center gap-2.5 px-4 py-2 rounded-full border shadow-2xl animate-bounce"
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

              {/* THE MIC VISUALIZER & BUTTON (CENTERED OVER THE CHARLIE COLLAGE) */}
              <div className="my-auto py-4">
                <TalkingOrb
                  status={status}
                  setStatus={setStatus}
                  onTranscript={addTranscript}
                  onSpeaker={setCurrentSpeaker}
                  onSessionId={(id) => { sessionLogIdRef.current = id; }}
                  onNavigate={(nav) => setNavTarget(nav)}
                  buttonLabel="Talk with Charlie"
                />
              </div>

              {/* Suggested Questions & Studio Settings Strip in that same box */}
              <div className="w-full pt-3 border-t border-white/15 space-y-2 bg-black/60 p-3 rounded-2xl backdrop-blur-md border border-white/10 shadow-lg">
                <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-wider text-[#D4AF37]">
                  <span>Suggested questions to ask Charlie:</span>
                  <span className="text-white/50 lowercase font-normal">tap mic &amp; speak naturally</span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full text-[10.5px] bg-[#121212]/90 border border-white/15 text-white/90 hover:text-white hover:border-[#D4AF37] transition-all select-none shadow-sm"
                    >
                      “{q}”
                    </span>
                  ))}
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