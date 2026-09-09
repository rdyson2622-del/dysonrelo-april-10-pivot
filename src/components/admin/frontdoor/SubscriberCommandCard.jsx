import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Mic, Search, History, ShieldCheck, Home
} from 'lucide-react';
import RetainedDialogueModal from './RetainedDialogueModal';

const GOLD = '#D4AF37';

export default function SubscriberCommandCard({
  currentUser,
  clientRecord,
  onSearch,
  searchQuery,
  setSearchQuery,
  onSwitchToVisitorView,
}) {
  const navigate = useNavigate();
  const [isDialogueModalOpen, setIsDialogueModalOpen] = useState(false);

  // First name resolution
  const firstName = clientRecord?.full_name?.split(' ')[0] || 
                    currentUser?.full_name?.split(' ')[0] || 
                    currentUser?.email?.split('@')[0] || 
                    (typeof window !== 'undefined' ? localStorage.getItem('dyson_test_subscriber_name') : null) || 
                    'Friend';

  // Live active move line from RelocationClient city data only (no invented milestones)
  const currentCity = clientRecord?.current_city?.trim();
  const destCity = clientRecord?.destination_city?.trim();
  const hasActiveMove = Boolean(destCity || currentCity);

  let activeMoveLine = 'No active move yet — start your relocation intake';
  if (currentCity && destCity) {
    activeMoveLine = `${currentCity} → ${destCity}`;
  } else if (destCity) {
    activeMoveLine = `Destination: ${destCity}`;
  } else if (currentCity) {
    activeMoveLine = `Origin: ${currentCity}`;
  }

  const continueMoveDest = hasActiveMove ? '/RelocationRoadmap' : '/relocation-intake';

  return (
    <div 
      className="w-full h-full flex flex-col justify-between p-4 sm:p-6 rounded-2xl relative overflow-hidden text-left shadow-2xl border"
      style={{
        background: 'linear-gradient(145deg, #12100b 0%, #080808 60%, #151108 100%)',
        borderColor: `${GOLD}75`,
      }}
    >
      {/* Top Meta Bar: Recognition & Dialogue Button */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
          <span 
            className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-black shadow-sm"
            style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
          >
            VERIFIED SUBSCRIBER
          </span>
          <span className="text-[9.5px] text-white/50 font-mono hidden sm:inline">
            CA DRE #02303118 Fiduciary
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsDialogueModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-[#1c1c1c] hover:bg-[#252525] border border-white/20 hover:border-[#D4AF37] transition-all cursor-pointer shadow-sm group"
            title="Open past conversations and roadmap transcripts"
          >
            <History className="w-3 h-3 text-[#D4AF37] group-hover:rotate-[-20deg] transition-transform" />
            <span>Retained Dialogue</span>
            <span className="text-[7.5px] px-1 py-0.2 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-bold border border-[#D4AF37]/40 ml-0.5">
              History
            </span>
          </button>

          {onSwitchToVisitorView && (
            <button
              type="button"
              onClick={onSwitchToVisitorView}
              className="text-[9.5px] text-white/40 hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
            >
              Visitor View
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="py-4 sm:py-5 space-y-3.5">
        
        {/* LINE 1: Welcome back {FirstName} — Relocating Family */}
        <div className="space-y-0.5">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border shadow-md"
              style={{ background: 'rgba(212,175,55,0.15)', borderColor: GOLD }}
            >
              <Home className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <h2 
                className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Welcome back {firstName} <span className="text-[#D4AF37]">— Relocating Family</span>
              </h2>
            </div>
          </div>
        </div>

        {/* LINE 2: Active Move Line from live RelocationClient city data (no invented milestones) */}
        <div 
          className="p-3 sm:p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-inner"
          style={{
            background: 'linear-gradient(90deg, #18140c 0%, #0f0f0f 100%)',
            borderColor: `${GOLD}50`,
          }}
        >
          <div className="space-y-0.5">
            <div className="text-[9.5px] font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              <span>Active Move:</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-white tracking-wide">
              {activeMoveLine}
            </div>
          </div>

          <div className="text-[11px] text-[#fce38a] italic font-medium max-w-sm sm:text-right">
            “Welcome back — want your roadmap, or ask me anything?”
          </div>
        </div>

        {/* EXACTLY THREE BUTTONS ONLY */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          
          {/* Button 1: Continue your move -> /RelocationRoadmap or /relocation-intake */}
          <button
            type="button"
            onClick={() => navigate(continueMoveDest)}
            className="p-3 rounded-xl font-bold text-xs sm:text-sm text-black flex items-center justify-between shadow-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer group"
            style={{
              background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%)',
            }}
          >
            <div className="text-left">
              <div className="text-[8.5px] uppercase font-black tracking-wider text-black/75">Action 1</div>
              <div className="font-bold leading-tight">Continue your move</div>
            </div>
            <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform shrink-0" />
          </button>

          {/* Button 2: Talk with Charlie -> /talking-app */}
          <button
            type="button"
            onClick={() => navigate('/talking-app')}
            className="p-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#151515] hover:bg-[#1f1a10] border border-[#D4AF37]/60 hover:border-[#D4AF37] flex items-center justify-between shadow-lg active:scale-95 transition-all cursor-pointer group"
          >
            <div className="text-left">
              <div className="text-[8.5px] uppercase font-black tracking-wider text-[#D4AF37]">Action 2</div>
              <div className="font-bold leading-tight flex items-center gap-1 text-white group-hover:text-[#D4AF37] transition-colors">
                <span>Talk with Charlie</span>
              </div>
            </div>
            <Mic className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform shrink-0" />
          </button>

          {/* Button 3: Vet a listing / refer -> /refer */}
          <button
            type="button"
            onClick={() => navigate('/refer')}
            className="p-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#151515] hover:bg-[#1f1a10] border border-white/20 hover:border-[#D4AF37] flex items-center justify-between shadow-lg active:scale-95 transition-all cursor-pointer group"
          >
            <div className="text-left">
              <div className="text-[8.5px] uppercase font-black tracking-wider text-white/60">Action 3</div>
              <div className="font-bold leading-tight flex items-center gap-1 text-white group-hover:text-[#D4AF37] transition-colors">
                <span>Vet a listing / refer</span>
              </div>
            </div>
            <Search className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform shrink-0" />
          </button>
        </div>

        {/* Embedded Search & Listing Audit Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearch?.(searchQuery);
          }}
          className="flex items-center gap-2 p-1.5 rounded-full bg-[#161616] border border-[#D4AF37]/60 shadow-lg mt-2"
        >
          <div className="flex items-center gap-2 w-full pl-3.5 py-0.5">
            <Search className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <input
              id="subscriber-card-search-input"
              type="text"
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery?.(e.target.value)}
              placeholder="Paste any listing link from Realtor, Zillow, or Homes.com, or enter destination city..."
              className="w-full bg-transparent text-xs text-white placeholder:text-stone-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-1.5 rounded-full text-xs font-bold text-black transition-all hover:brightness-110 cursor-pointer shadow shrink-0"
            style={{
              background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)',
            }}
          >
            Audit Listing
          </button>
        </form>
      </div>

      {/* Footer Assurance */}
      <div className="pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[9.5px] text-white/50">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
          <span>Fiduciary relocation oversight across all 50 states — zero fees to buyers &amp; employers.</span>
        </div>
        <div className="font-mono text-white/60">
          The Dyson &amp; Dyson Companies, Inc.
        </div>
      </div>

      {/* Retained Dialogue Modal */}
      <RetainedDialogueModal
        isOpen={isDialogueModalOpen}
        onClose={() => setIsDialogueModalOpen(false)}
        subscriberRole="client"
        subscriberName={firstName}
      />
    </div>
  );
}