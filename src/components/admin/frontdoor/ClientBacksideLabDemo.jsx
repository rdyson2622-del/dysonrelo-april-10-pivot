import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Mic, MicOff, BookOpen, ArrowRight, ShieldCheck, 
  Phone, MessageCircle, X, FileText, Sparkles, Volume2, 
  Compass, MapPin, CheckCircle2, ChevronRight, Play, Pause
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';
const TAN_BG = '#ede0cc';

export default function ClientBacksideLabDemo({ initialClient = null }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [clientRecord, setClientRecord] = useState(initialClient);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceStatusText, setVoiceStatusText] = useState('Tap microphone to start live Voice-to-Voice with Charlie');
  const [activeSpeechWave, setActiveSpeechWave] = useState(false);

  // Fetch real auth user and matching client data
  useEffect(() => {
    let isMounted = true;
    base44.auth.me().then(async (user) => {
      if (!isMounted) return;
      if (user) {
        setCurrentUser(user);
        try {
          const clients = await base44.entities.RelocationClient.filter({ email: user.email }, '-created_date', 1);
          if (clients && clients.length > 0 && isMounted) {
            setClientRecord(clients[0]);
          } else {
            const anyClients = await base44.entities.RelocationClient.list('-created_date', 1);
            if (anyClients && anyClients.length > 0 && isMounted) {
              setClientRecord(anyClients[0]);
            }
          }
        } catch (_) {}
      }
    }).catch(() => {});

    return () => { isMounted = false; };
  }, []);

  // Personalized identity data
  const displayName = clientRecord?.full_name || currentUser?.full_name || 'Robert & Eleanor Sterling';
  const firstName = displayName.split(' ')[0] || 'Friend';
  const originCity = clientRecord?.current_city || 'Los Gatos, CA';
  const destinationCity = clientRecord?.destination_city || 'Scottsdale, AZ';
  const photoUrl = currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

  const handleVoiceToggle = () => {
    if (!isVoiceActive) {
      setIsVoiceActive(true);
      setActiveSpeechWave(true);
      setVoiceStatusText('Connecting to Charlie Voice Concierge (Live V2V)...');
      setTimeout(() => {
        setVoiceStatusText(`"Hello ${firstName}, I'm Charlie. How can I help orchestrate your move today?"`);
      }, 1000);
    } else {
      setIsVoiceActive(false);
      setActiveSpeechWave(false);
      setVoiceStatusText('Tap microphone to start live Voice-to-Voice with Charlie');
    }
  };

  const handleLaunchFullVoice = () => {
    navigate('/talking-app');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const cleanLocation = searchQuery.trim().replace(/,\s*/g, '_').replace(/\s+/g, '-');
    window.open(`https://www.realtor.com/realestateandhomes-search/${encodeURIComponent(cleanLocation)}`, '_blank', 'noopener,noreferrer');
  };

  const handleQuickPrompt = (promptText) => {
    setSearchQuery(promptText);
    if (promptText.toLowerCase().includes('roadmap') || promptText.toLowerCase().includes('escrow')) {
      navigate('/RelocationRoadmap');
    } else if (promptText.toLowerCase().includes('voice')) {
      navigate('/talking-app');
    } else if (promptText.toLowerCase().includes('vet')) {
      navigate('/refer');
    } else {
      const clean = promptText.replace(/,\s*/g, '_').replace(/\s+/g, '-');
      window.open(`https://www.realtor.com/realestateandhomes-search/${encodeURIComponent(clean)}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-2 sm:py-4 px-2 sm:px-6 text-left">
      
      {/* ========================================================
          CLEAN SHEET ON TAN BACKDROP (#ede0cc)
          Spacious, Landscape-First AI Concierge Architecture
          ======================================================== */}
      <div 
        className="w-full rounded-3xl p-4 sm:p-8 md:p-10 shadow-2xl border border-[#0a0a0a]/15 text-[#0a0a0a] space-y-6 sm:space-y-8"
        style={{
          background: TAN_BG,
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.2), 0 0 0 1px rgba(212,175,55,0.4)',
        }}
      >
        
        {/* ========================================================
            1. STREAMLINED TOP BAR: IDENTITY & LIBRARY
            Uncluttered, elegant, single-line presentation
            ======================================================== */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-[#0a0a0a]/15">
          
          {/* Subscriber Identity in One Line */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={photoUrl} 
                alt={displayName} 
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-[#D4AF37] shadow-md"
              />
              <span 
                className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#10b981] border-2 border-[#ede0cc]" 
                title="Verified Subscriber"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 
                  className="text-xl sm:text-2xl font-bold text-[#0a0a0a] leading-tight"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  Welcome back, {firstName}
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0a0a0a] text-[#D4AF37]">
                  Fiduciary Active
                </span>
              </div>
              <p className="text-xs text-[#854d0e] font-semibold flex items-center gap-1.5 mt-0.5">
                <span>{originCity}</span>
                <span className="text-[#0a0a0a]/40 font-mono">→</span>
                <span className="text-[#0a0a0a]">{destinationCity}</span>
              </p>
            </div>
          </div>

          {/* Action Header: Concierge Phone & One-Click Library */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1 text-xs">
              <a
                href="tel:+18583531200"
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#0a0a0a] text-white hover:brightness-125 text-xs font-bold transition-all shadow-sm"
              >
                <Phone className="w-3 h-3 text-[#D4AF37]" />
                <span>(858) 353-1200</span>
              </a>
            </div>

            {/* ONE-CLICK LIBRARY BUTTON */}
            <button
              type="button"
              onClick={() => setIsLibraryOpen(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
              style={{
                background: '#0a0a0a',
                color: GOLD,
                border: `1.5px solid ${GOLD}`,
              }}
              title="Click to view all stored data, properties, documents and blueprints"
            >
              <BookOpen className="w-4 h-4 text-[#D4AF37]" />
              <span>Library</span>
            </button>
          </div>
        </header>

        {/* ========================================================
            2. THE GRAND AI CENTERPIECE: V2V VOICE & REQUEST PILL
            Clean, expansive, futuristic Voice-to-Voice AI communicator
            ======================================================== */}
        <section className="space-y-4 py-2 sm:py-4 text-center">
          
          {/* Conversational V2V Voice Orb & Audio Wave */}
          <div className="flex flex-col items-center justify-center space-y-3">
            
            <div className="relative group cursor-pointer" onClick={handleVoiceToggle}>
              {/* Pulsing glow effect */}
              <div 
                className={`absolute -inset-3 rounded-full blur-xl transition-all duration-700 ${
                  isVoiceActive ? 'bg-[#10b981]/50 scale-110' : 'bg-[#D4AF37]/20 group-hover:bg-[#D4AF37]/40'
                }`}
              />

              {/* Main Orb */}
              <div 
                className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl ${
                  isVoiceActive 
                    ? 'bg-gradient-to-br from-[#10b981] to-[#047857] scale-105 ring-4 ring-[#10b981]/30' 
                    : 'bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#D4AF37]'
                }`}
              >
                {isVoiceActive ? (
                  <Volume2 className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-pulse" />
                ) : (
                  <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                )}
                <span className="text-[9px] font-black uppercase tracking-wider text-white mt-1">
                  {isVoiceActive ? 'Live V2V' : 'Tap to Talk'}
                </span>
              </div>
            </div>

            {/* Audio Wave Visualizer Simulation */}
            {activeSpeechWave ? (
              <div className="flex items-center justify-center gap-1.5 h-6">
                <span className="w-1 bg-[#10b981] rounded-full h-3 animate-pulse" />
                <span className="w-1 bg-[#10b981] rounded-full h-6 animate-pulse delay-75" />
                <span className="w-1 bg-[#10b981] rounded-full h-4 animate-pulse delay-150" />
                <span className="w-1 bg-[#10b981] rounded-full h-5 animate-pulse delay-100" />
                <span className="w-1 bg-[#10b981] rounded-full h-2 animate-pulse" />
              </div>
            ) : null}

            {/* Spoken Status or Charlie Greeting */}
            <div className="max-w-md mx-auto">
              <p 
                className={`text-sm sm:text-base font-medium leading-relaxed transition-all ${
                  isVoiceActive ? 'text-[#0a0a0a] font-bold italic' : 'text-[#854d0e]'
                }`}
              >
                {voiceStatusText}
              </p>
              {isVoiceActive && (
                <button
                  type="button"
                  onClick={handleLaunchFullVoice}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#0a0a0a] underline font-bold hover:text-[#b8920a] cursor-pointer"
                >
                  <span>Open Full Screen Studio Voice View →</span>
                </button>
              )}
            </div>
          </div>

          {/* Grand Request & Search Pill */}
          <div className="max-w-3xl mx-auto pt-2">
            <form 
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 p-2 sm:p-2.5 rounded-full bg-[#0a0a0a] border-2 border-[#D4AF37] shadow-2xl text-white transition-all focus-within:ring-2 focus-within:ring-[#D4AF37]"
            >
              <div className="flex items-center gap-2.5 w-full pl-4 sm:pl-6 py-1">
                <Search className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ask Charlie anything, audit an escrow, or search properties..."
                  className="w-full bg-transparent text-xs sm:text-sm md:text-base text-white placeholder:text-stone-400 focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 pr-1 shrink-0">
                <button
                  type="button"
                  onClick={handleVoiceToggle}
                  className="px-3 sm:px-4 py-2 rounded-full bg-[#1c1c1c] hover:bg-[#252525] border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                  title="Toggle Voice-to-Voice"
                >
                  <Mic className="w-3.5 h-3.5 text-[#10b981]" />
                  <span className="hidden sm:inline">V2V</span>
                </button>

                <button
                  type="submit"
                  className="px-5 sm:px-7 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-black transition-all hover:brightness-105 active:scale-95 shadow-md cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%)',
                  }}
                >
                  Execute
                </button>
              </div>
            </form>

            {/* Quick Strategic Prompts (3 only, minimal, clear) */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#854d0e]">
                Instant Actions:
              </span>
              <button
                type="button"
                onClick={() => handleQuickPrompt('Continue Move Roadmap')}
                className="px-3 py-1 rounded-full bg-[#0a0a0a] text-white border border-[#D4AF37]/50 hover:border-[#D4AF37] transition-all cursor-pointer font-medium shadow-sm flex items-center gap-1"
              >
                <span>📍 View Escrow Milestone</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickPrompt('Scottsdale Luxury Homes')}
                className="px-3 py-1 rounded-full bg-[#0a0a0a] text-white border border-[#D4AF37]/50 hover:border-[#D4AF37] transition-all cursor-pointer font-medium shadow-sm flex items-center gap-1"
              >
                <span>🔍 Search Scottsdale MLS</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickPrompt('Vet a Listing')}
                className="px-3 py-1 rounded-full bg-[#0a0a0a] text-white border border-[#D4AF37]/50 hover:border-[#D4AF37] transition-all cursor-pointer font-medium shadow-sm flex items-center gap-1"
              >
                <span>📑 Vet a Listing Link</span>
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================
            3. BIG PICTURE LANDSCAPE HORIZONS (2 CLEAN BARS ONLY)
            Spacious, uncrowded layout replacing dense card clutter
            ======================================================== */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          
          {/* Left Horizon: Active Relocation Journey */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0a0a0a] text-white border border-[#D4AF37]/40 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37]">
                Active Relocation Horizon
              </span>
              <span className="text-[10px] font-bold text-[#10b981] bg-[#10b981]/20 px-2 py-0.5 rounded-full">
                Phase 3 of 7 · On Schedule
              </span>
            </div>

            <div className="py-3 space-y-1.5">
              <h3 
                className="text-lg font-bold text-white leading-tight"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Inspection Release &amp; Dual Escrow Audit
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Silicon Valley sale contingency release is tracked alongside the Scottsdale target contract audit.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/RelocationRoadmap')}
              className="w-full py-2 rounded-xl text-xs font-bold text-black flex items-center justify-center gap-1.5 cursor-pointer shadow hover:brightness-110 active:scale-95 transition-all"
              style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
            >
              <span>Continue Move Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right Horizon: Fiduciary Intelligence & Direct Access */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0a0a0a] text-white border border-[#D4AF37]/40 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37]">
                Fiduciary Direct Intelligence
              </span>
              <span className="text-[10px] font-bold text-[#60a5fa] bg-[#60a5fa]/20 px-2 py-0.5 rounded-full">
                All 50 States
              </span>
            </div>

            <div className="py-3 space-y-1.5">
              <h3 
                className="text-lg font-bold text-white leading-tight"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Contract Review &amp; Agent Vetting
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Send any agent proposal or MLS listing URL to receive an independent fiduciary audit within 2 hours.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/refer')}
                className="flex-1 py-2 rounded-xl bg-[#1e1e1e] hover:bg-[#252525] border border-white/20 text-xs font-bold text-white flex items-center justify-center gap-1 cursor-pointer transition-all"
              >
                <span>Submit Listing to Vet</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]" />
              </button>

              <button
                type="button"
                onClick={() => setIsLibraryOpen(true)}
                className="px-3 py-2 rounded-xl bg-[#1e1e1e] hover:bg-[#252525] border border-[#D4AF37]/50 text-xs font-bold text-[#D4AF37] flex items-center justify-center gap-1 cursor-pointer transition-all"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Files</span>
              </button>
            </div>
          </div>

        </section>

        {/* ========================================================
            4. CLEAN FOOTER
            ======================================================== */}
        <footer className="pt-2 border-t border-[#0a0a0a]/15 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#44382c]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
            <span>Fiduciary Representation across all 50 States · Zero buyer or employer fees</span>
          </div>
          <div className="font-mono text-[#0a0a0a]">
            The Dyson &amp; Dyson Companies, Inc. · CA DRE #02303118
          </div>
        </footer>

      </div>

      {/* ========================================================
          ONE-CLICK LIBRARY MODAL / SLIDE-OUT
          Holds all stored data so the main page stays clean & uncluttered
          ======================================================== */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-2xl max-h-[90vh] rounded-3xl p-5 sm:p-7 border space-y-4 shadow-2xl text-left flex flex-col relative overflow-hidden"
            style={{
              background: '#0a0a0a',
              borderColor: GOLD,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <h2 className="text-lg font-bold text-white">Your Stored Library</h2>
                  <p className="text-xs text-white/60">Central archive for properties, contracts, blueprints &amp; history</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="w-8 h-8 rounded-full bg-[#181818] border border-white/10 flex items-center justify-center text-white/70 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Library Contents */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin text-white">
              
              {/* Stored Properties & Documents */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                  Stored Properties &amp; Escrow Documents
                </h3>
                <div className="p-3 rounded-xl bg-[#141414] border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between text-sm font-bold text-white">
                    <span>14820 Blossom Hill Rd, Los Gatos, CA (Origin)</span>
                    <span className="text-xs text-[#10b981] font-mono">Escrow Open</span>
                  </div>
                  <div className="text-xs text-white/50">4 Beds · 3.5 Baths · 3,850 sq ft</div>
                  <div className="pt-1 flex flex-wrap gap-2 text-xs text-[#D4AF37] underline">
                    <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> Executed Purchase Agreement.pdf</span>
                    <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> Preliminary Title Report.pdf</span>
                    <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> Seller Disclosures.pdf</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#141414] border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between text-sm font-bold text-white">
                    <span>20844 N 110th Way, Scottsdale, AZ (Destination Target)</span>
                    <span className="text-xs text-[#D4AF37] font-mono">Contract In Audit</span>
                  </div>
                  <div className="text-xs text-white/50">5 Beds · 6 Baths · 5,600 sq ft</div>
                  <div className="pt-1 flex flex-wrap gap-2 text-xs text-[#D4AF37] underline">
                    <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> Inspection Contingency Checklist.pdf</span>
                    <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> Silverleaf HOA Bylaws.pdf</span>
                  </div>
                </div>
              </div>

              {/* Blueprints & Intelligence Reports */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                  Relocation Blueprints &amp; Strategy Reports
                </h3>
                {[
                  { title: 'Scottsdale Unified vs Basis Charter Schools Comparison', date: 'May 18, 2026', type: 'Intelligence' },
                  { title: 'California to Arizona 1031 Exchange & Tax Shield', date: 'May 12, 2026', type: 'Tax Advisory' },
                  { title: 'Listing Agent Vetting Scorecard · Sarah Lin', date: 'April 29, 2026', type: 'Fiduciary Audit' },
                ].map((doc, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-[#141414] border border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white text-sm">{doc.title}</div>
                      <div className="text-xs text-white/50">{doc.date} · {doc.type}</div>
                    </div>
                    <FileText className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  </div>
                ))}
              </div>

              {/* Direct Shortcuts */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                  Quick Access Shortcuts
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLibraryOpen(false);
                      navigate('/dnn-news');
                    }}
                    className="p-2.5 rounded-lg bg-[#141414] border border-white/10 hover:border-[#D4AF37] text-left cursor-pointer"
                  >
                    <div className="font-bold text-white text-xs">6AM DNN News</div>
                    <div className="text-[10px] text-white/50">Daily Video Brief</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLibraryOpen(false);
                      navigate('/solutions');
                    }}
                    className="p-2.5 rounded-lg bg-[#141414] border border-white/10 hover:border-[#D4AF37] text-left cursor-pointer"
                  >
                    <div className="font-bold text-white text-xs">Solutions Map</div>
                    <div className="text-[10px] text-white/50">Strategy Blueprints</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLibraryOpen(false);
                      navigate('/refer');
                    }}
                    className="p-2.5 rounded-lg bg-[#141414] border border-white/10 hover:border-[#D4AF37] text-left cursor-pointer"
                  >
                    <div className="font-bold text-white text-xs">Vet a Listing</div>
                    <div className="text-[10px] text-white/50">Fiduciary Review</div>
                  </button>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
              <span>All Stored Data Secured Under Client Fiduciary Privilege</span>
              <span>The Dyson &amp; Dyson Companies</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}