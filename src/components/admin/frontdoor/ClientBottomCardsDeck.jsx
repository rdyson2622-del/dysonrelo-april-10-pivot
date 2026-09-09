import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, MapPin, BookOpen, FileText, 
  Compass, ArrowRight, CheckCircle2,
  ChevronLeft, ChevronRight
} from 'lucide-react';

const GOLD = '#D4AF37';

export default function ClientBottomCardsDeck({
  originAddress = '14820 Blossom Hill Rd, Los Gatos, CA',
  destinationCity = 'Scottsdale',
  destinationState = 'AZ',
  onOpenLibrary = () => {},
}) {
  const navigate = useNavigate();
  // In portrait mode: 0 = Properties Owned, 1 = Stored Archives, 2 = Relocation
  const [activeTab, setActiveTab] = useState(0);

  const TABS = [
    { id: 0, label: 'Properties Owned', icon: Home, badge: '1 Verified' },
    { id: 1, label: 'Data & Archives', icon: BookOpen, badge: 'My Library' },
    { id: 2, label: 'Relocation', icon: Compass, badge: 'Active Roadmap' },
  ];

  const goNext = () => setActiveTab((prev) => (prev + 1) % 3);
  const goPrev = () => setActiveTab((prev) => (prev - 1 + 3) % 3);

  // Card 1: Properties Owned
  const renderCard1 = (isPortraitSingle = false) => (
    <div className={`rounded-2xl bg-[#0a0a0a] text-white border border-[#D4AF37]/50 shadow-xl overflow-hidden flex flex-col justify-between group ${isPortraitSingle ? 'w-full ring-1 ring-[#D4AF37]/40' : ''}`}>
      <div>
        <div 
          onClick={() => navigate('/refer')}
          className={`relative w-full overflow-hidden cursor-pointer ${isPortraitSingle ? 'h-56 sm:h-64' : 'h-44 sm:h-48'}`}
          title="Click to view Property & Ownership Details"
        >
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80" 
            alt="Current Residence"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/80 text-[#D4AF37] border border-[#D4AF37]/60 backdrop-blur-sm">
            <Home className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Properties Owned</span>
          </div>
          <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#10b981] text-black">
            1 Verified
          </span>
          <div className="absolute bottom-3 left-3 right-3">
            <div className="text-sm font-bold text-white flex items-center gap-1.5 drop-shadow">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span className="truncate">{originAddress}</span>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-3">
          <div className="text-xs sm:text-sm font-semibold text-white/80">
            Single Family Residence • 4,850 sq ft
          </div>

          <div className="space-y-1.5 text-xs text-white/75 pt-1.5 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-white/60">Ownership Data:</span>
              <span className="text-[#10b981] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Title &amp; Deed on File
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60">Estimated Equity:</span>
              <span className="text-white font-mono font-semibold">~$2,450,000</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60">1031 Exchange:</span>
              <span className="text-[#D4AF37] font-semibold">Profile Prepared</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 pt-0">
        <button
          type="button"
          onClick={() => navigate('/refer')}
          className="w-full py-2.5 px-4 rounded-xl bg-[#181818] hover:bg-[#222222] border border-[#D4AF37]/60 text-xs sm:text-sm font-bold text-[#D4AF37] flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95"
        >
          <span>Audit Listing / Vet Sale Agent</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  // Card 2: Stored Data & Archives
  const renderCard2 = (isPortraitSingle = false) => (
    <div className={`rounded-2xl bg-[#0a0a0a] text-white border border-[#D4AF37]/50 shadow-xl overflow-hidden flex flex-col justify-between group ${isPortraitSingle ? 'w-full ring-1 ring-[#D4AF37]/40' : ''}`}>
      <div>
        <div 
          onClick={onOpenLibrary}
          className={`relative w-full overflow-hidden cursor-pointer ${isPortraitSingle ? 'h-56 sm:h-64' : 'h-44 sm:h-48'}`}
          title="Click to Open Stored Data & Archives"
        >
          <img 
            src="https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80" 
            alt="Stored Files & Data"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/80 text-[#D4AF37] border border-[#D4AF37]/60 backdrop-blur-sm">
            <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Stored Data &amp; Archives</span>
          </div>
          <span className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
            My Library
          </span>
          <div className="absolute bottom-3 left-3 right-3">
            <div className="text-sm font-bold text-white drop-shadow">
              All Signed Contracts, Deeds &amp; Blueprints
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-3">
          <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
            All signed fiduciary agreements, inspection notes, transcripts, and transaction documents are archived here.
          </p>

          <div className="space-y-1.5 text-xs text-white/75 pt-1.5 border-t border-white/10">
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span className="truncate">Fiduciary Advisory Agreement (Signed)</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span className="truncate">Property Tax &amp; Deed Record Archive</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span className="truncate">Saved MLS Listings &amp; Search Profiles</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 pt-0">
        <button
          type="button"
          onClick={onOpenLibrary}
          className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-black flex items-center justify-center gap-2 cursor-pointer shadow-md hover:brightness-110 active:scale-95 transition-all"
          style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
        >
          <BookOpen className="w-4 h-4" />
          <span>Open Stored Archives</span>
        </button>
      </div>
    </div>
  );

  // Card 3: Relocation
  const renderCard3 = (isPortraitSingle = false) => (
    <div className={`rounded-2xl bg-[#0a0a0a] text-white border border-[#D4AF37]/50 shadow-xl overflow-hidden flex flex-col justify-between group ${isPortraitSingle ? 'w-full ring-1 ring-[#D4AF37]/40' : ''}`}>
      <div>
        <div 
          onClick={() => navigate('/client-roadmap')}
          className={`relative w-full overflow-hidden cursor-pointer ${isPortraitSingle ? 'h-56 sm:h-64' : 'h-44 sm:h-48'}`}
          title="Click to View Active Relocation Roadmap"
        >
          <img 
            src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80" 
            alt="Destination City"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/80 text-[#10b981] border border-[#10b981]/60 backdrop-blur-sm">
            <Compass className="w-3.5 h-3.5 text-[#10b981]" />
            <span>Relocation</span>
          </div>
          <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#10b981]/30 text-[#10b981] border border-[#10b981] backdrop-blur-sm">
            Active Roadmap
          </span>
          <div className="absolute bottom-3 left-3 right-3">
            <div className="text-sm font-bold text-white drop-shadow">
              Target: {destinationCity}, {destinationState}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-3">
          <div className="text-xs sm:text-sm font-semibold text-white/80">
            Timeline: Fall Relocation • Stage 2 of 6
          </div>

          <div className="space-y-1.5 text-xs text-white/75 pt-1.5 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-white/60">Receiving Agent Vetting:</span>
              <span className="text-[#10b981] font-semibold">Underway</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60">Tax Differential:</span>
              <span className="text-white font-mono font-semibold">CA to AZ (-8.8%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60">Next Action:</span>
              <span className="text-[#D4AF37] font-semibold">Review Candidate Vetting</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 pt-0">
        <button
          type="button"
          onClick={() => navigate('/client-roadmap')}
          className="w-full py-2.5 px-4 rounded-xl bg-[#181818] hover:bg-[#222222] border border-[#10b981] text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95"
        >
          <span>View Full Roadmap</span>
          <ArrowRight className="w-4 h-4 text-[#10b981]" />
        </button>
      </div>
    </div>
  );

  return (
    <section className="pt-2">
      {/* ========================================================
          PORTRAIT VIEW (AND VIEWPORTS < 1024PX):
          POSTED ONE AT A TIME FULL SCREEN / FULL WIDTH
          WITH 3 NAVIGATION TABS & PREV/NEXT CONTROLS
          ======================================================== */}
      <div className="block lg:landscape:hidden space-y-3">
        {/* Top Control Bar: Tab selector buttons */}
        <div className="p-1 rounded-2xl bg-black/10 border border-[#0a0a0a]/15 shadow-inner flex items-center gap-1.5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-2 sm:px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isActive 
                    ? 'bg-[#0a0a0a] text-[#D4AF37] shadow-md border border-[#D4AF37]/50 scale-[1.02]' 
                    : 'text-[#44382c] hover:bg-black/5 hover:text-[#0a0a0a]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D4AF37]' : 'text-[#854d0e]'}`} />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Indicator & Next/Prev Controls */}
        <div className="flex items-center justify-between px-1 text-xs text-[#554433]">
          <span className="font-bold text-[#854d0e]">
            {activeTab === 0 && 'Card 1 of 3: Properties Owned'}
            {activeTab === 1 && 'Card 2 of 3: Stored Archives & Files'}
            {activeTab === 2 && 'Card 3 of 3: Active Relocation Roadmap'}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={goPrev}
              className="p-1.5 rounded-lg bg-black/5 hover:bg-black/10 border border-black/10 text-[#0a0a0a] cursor-pointer"
              title="Previous card"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1 px-1">
              {[0, 1, 2].map((i) => (
                <span 
                  key={i} 
                  onClick={() => setActiveTab(i)}
                  className={`cursor-pointer rounded-full transition-all ${
                    activeTab === i ? 'w-4 h-1.5 bg-[#854d0e]' : 'w-1.5 h-1.5 bg-black/20'
                  }`} 
                />
              ))}
            </div>
            <button
              type="button"
              onClick={goNext}
              className="p-1.5 rounded-lg bg-black/5 hover:bg-black/10 border border-black/10 text-[#0a0a0a] cursor-pointer"
              title="Next card"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ONE AT A TIME FULL SCREEN / FULL WIDTH */}
        <div className="w-full">
          {activeTab === 0 && renderCard1(true)}
          {activeTab === 1 && renderCard2(true)}
          {activeTab === 2 && renderCard3(true)}
        </div>
      </div>

      {/* ========================================================
          DESKTOP LANDSCAPE VIEW (ONLY FOR WIDE LANDSCAPE >= 1024PX):
          3 IN A ROW
          ======================================================== */}
      <div className="hidden lg:landscape:grid lg:landscape:grid-cols-3 gap-4">
        {renderCard1(false)}
        {renderCard2(false)}
        {renderCard3(false)}
      </div>
    </section>
  );
}