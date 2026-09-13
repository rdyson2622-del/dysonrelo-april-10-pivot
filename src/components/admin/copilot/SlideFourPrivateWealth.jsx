import React, { useState } from 'react';
import { 
  ShieldCheck, ArrowRight, TrendingUp, ShieldAlert, Percent, 
  MapPin, Volume2, Sparkles, HelpCircle, ArrowLeft, RefreshCw
} from 'lucide-react';
import CopilotCanvasChat from './CopilotCanvasChat';
import CopilotPropertyDossier from '@/components/copilot/CopilotPropertyDossier';

const GOLD = '#D4AF37';
const DYSON_LOGO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/c04428737_DYSONDYSONLOGO2026.png";
const NIGHT_HILLSIDE_ESTATE = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/a57180df3_Screenshot2026-09-13at43243AM.png";

const SAMPLE_PROPERTIES = {
  '742 Vista Del Mar, La Jolla, CA 92037': {
    address: '742 Vista Del Mar, La Jolla, CA 92037',
    price: 3450000,
    beds: 4,
    baths: 4.5,
    sqft: 3820,
    dom: 64,
    compsPrice: 3200000,
    rebate: 21562,
    risks: [
      '64 days on market — seller price reduction of $150k pending',
      'Coastal Commission permitting boundary: strict exterior remodel restrictions',
      'Recent neighborhood comp sold 7.2% below asking price'
    ],
    listingOffice: 'Independent Coastal Brokerage',
    lastSoldPrice: 2100000,
    lastSoldYear: 2019
  },
  '1844 Mountain Shadow Way, Scottsdale, AZ 85253': {
    address: '1844 Mountain Shadow Way, Scottsdale, AZ 85253',
    price: 2150000,
    beds: 4,
    baths: 3,
    sqft: 3240,
    dom: 18,
    compsPrice: 2125000,
    rebate: 13437,
    risks: [
      'HOA rental restriction: minimum 12-month lease required',
      'Dual A/C units are 14 years old — nearing replacement'
    ],
    listingOffice: 'Southwest Luxury Realty',
    lastSoldPrice: 1420000,
    lastSoldYear: 2021
  },
  '4220 Oak Hollow Terrace, Austin, TX 78746': {
    address: '4220 Oak Hollow Terrace, Austin, TX 78746',
    price: 1850000,
    beds: 3,
    baths: 3.5,
    sqft: 2890,
    dom: 42,
    compsPrice: 1775000,
    rebate: 11562,
    risks: [
      'Travis County reassessment triggers property tax escalation',
      'Flash flood zone buffer near greenbelt easement'
    ],
    listingOffice: 'Westlake Premier Estates',
    lastSoldPrice: 1150000,
    lastSoldYear: 2018
  }
};

const PROMPT_PILLS = [
  {
    id: 'rebate',
    label: 'How do I get thousands back at closing?',
    answer: "Through our fiduciary buyer rebate, we credit up to 50% of our standard brokerage referral fee directly to your HUD-1 closing settlement statement (or toward an interest rate buy-down) where allowed by law. On a $1.5M home, that's ~$21,500 back in your pocket. Type or paste any address above and I'll calculate the exact rebate for that home!"
  },
  {
    id: 'risks',
    label: 'How do you find hidden property risks?',
    answer: "I instantly cross-reference municipal permit databases for unpermitted additions, scan flood zones and coastal commission boundaries, and calculate whether the list price matches true closed neighborhood comps. Bob Dyson (Broker DRE #00609384) then verifies the findings before you make an offer."
  },
  {
    id: 'bob',
    label: 'Who is Bob Dyson?',
    answer: "Bob Dyson is our licensed California Broker (DRE #00609384) with over 35 years of fiduciary luxury transaction experience. Unlike online aggregators who sell your info to 5 competing agents, Bob works solely for you as the buyer—protecting your escrow deposit and ensuring your closing cash rebate."
  }
];

export default function SlideFourPrivateWealth({ onRunAudit }) {
  const [address, setAddress] = useState('742 Vista Del Mar, La Jolla, CA 92037');
  const [viewMode, setViewMode] = useState('resting'); // 'resting' | 'canvas'
  const [isAuditing, setIsAuditing] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [currentProperty, setCurrentProperty] = useState(SAMPLE_PROPERTIES['742 Vista Del Mar, La Jolla, CA 92037']);
  const [chatMessages, setChatMessages] = useState([]);

  // Trigger search / audit
  const handleTriggerAudit = (targetAddr) => {
    const finalAddr = (targetAddr || address).trim();
    if (!finalAddr) return;

    setIsAuditing(true);
    if (onRunAudit) onRunAudit(finalAddr);

    const matchedProp = SAMPLE_PROPERTIES[finalAddr] || {
      address: finalAddr,
      price: 2450000,
      beds: 4,
      baths: 3.5,
      sqft: 3350,
      dom: 45,
      compsPrice: 2280000,
      rebate: 15312,
      risks: [
        'List price is ~7% above 90-day closed comps in this tract',
        'Title review recommended for municipal utility easement',
        'Tax basis will reset to purchase price upon escrow completion'
      ],
      listingOffice: 'Syndicated Listing Office',
      lastSoldPrice: 1650000,
      lastSoldYear: 2020
    };

    setCurrentProperty(matchedProp);
    setAddress(finalAddr);

    setTimeout(() => {
      setIsAuditing(false);
      setViewMode('canvas');
      setChatMessages([
        {
          role: 'assistant',
          speaker: 'charlie',
          text: `I just audited ${finalAddr.split(',')[0]}. It is currently listed for $${matchedProp.price.toLocaleString()}, but recent closed comps point to ~$${matchedProp.compsPrice.toLocaleString()}.\n\nThrough our fiduciary representation, I can secure you +$${matchedProp.rebate.toLocaleString()} cash back credited directly to your closing HUD-1 statement. See the full dossier artifact on the right.`
        },
        {
          role: 'assistant',
          speaker: 'bob',
          text: `Bob Dyson here (DRE #00609384). I've reviewed the preliminary comps. When you tour or negotiate, never click 'Contact Agent' on MLS portals—let us protect your deposit and rebate. Drop your mobile number so we can text you this verified dossier!`
        }
      ]);
    }, 450);
  };

  // Handle clicking one of the 3 conversational prompt pills
  const handlePromptPillClick = (pill) => {
    setViewMode('canvas');
    setChatMessages([
      {
        role: 'user',
        text: pill.label
      },
      {
        role: 'assistant',
        speaker: pill.id === 'bob' ? 'bob' : 'charlie',
        text: pill.answer
      }
    ]);
  };

  const handleSendMessage = (userText) => {
    setChatMessages(prev => [
      ...prev,
      { role: 'user', text: userText },
      {
        role: 'assistant',
        speaker: 'charlie',
        text: `Got it. For ${currentProperty.address.split(',')[0]}, I've logged that. Bob and I can also audit property disclosures, HOA documents, or draft an unvarnished offer recommendation whenever you're ready.`
      }
    ]);
  };

  const handleSendSms = (phone) => {
    setSmsSent(true);
    setChatMessages(prev => [
      ...prev,
      {
        role: 'assistant',
        speaker: 'charlie',
        text: `Thanks! We just dispatched the private audit brief for ${currentProperty.address.split(',')[0]} to ${phone}. Zero telemarketing spam guaranteed.`
      }
    ]);
  };

  return (
    <div className="w-full text-left select-none bg-[#050505] text-[#f5f5f5]">
      {/* ── TOP HEADER BAR ── */}
      <div className="px-6 sm:px-10 pt-5 pb-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3.5">
          <div className="shrink-0 flex items-center">
            <img 
              src={DYSON_LOGO} 
              alt="Dyson & Dyson" 
              className="h-[50px] sm:h-[54px] w-auto object-contain" 
            />
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-baseline gap-2">
              <span 
                className="font-serif text-base sm:text-lg font-bold tracking-widest text-white uppercase leading-none"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                DYSON HOMES
              </span>
              <span 
                className="font-serif italic text-2xl sm:text-[26px] text-[#D4AF37] leading-none inline-block drop-shadow-[0_2px_8px_rgba(212,175,55,0.35)]"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                copilot
              </span>
            </div>
            <span className="hidden sm:inline text-white/30 text-xs">|</span>
            <span className="hidden sm:inline text-[9.5px] tracking-widest text-[#D4AF37] uppercase font-bold">
              PRIVATE REAL ESTATE INTELLIGENCE
            </span>
          </div>
        </div>

        {viewMode === 'canvas' && (
          <button
            type="button"
            onClick={() => setViewMode('resting')}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#D4AF37] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          1. RESTING STATE (NO SCROLLING BELOW THE CREASE)
          Grok/Gemini Style Clean Conversational Canvas
          ───────────────────────────────────────────────────────────── */}
      {viewMode === 'resting' ? (
        <div className="px-6 sm:px-10 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start min-h-[580px]">
          {/* Left Column (7 cols): Hero + Search + Prompt Pills */}
          <div className="lg:col-span-7 space-y-5">
            <h1 
              className="font-normal text-white leading-[1.15] tracking-tight text-center"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              <span className="block text-4xl sm:text-5xl lg:text-[54px] font-medium leading-tight">
                Meet <span className="italic text-[#D4AF37]">copilot</span>
              </span>
              <span className="block text-lg sm:text-2xl lg:text-[25px] text-white/90 font-normal tracking-normal mt-2">
                The First Personal Human &amp; AI Real Estate Assistant
              </span>
            </h1>

            {/* Main Search Bar */}
            <div className="pt-4 space-y-2 text-center">
              <form onSubmit={(e) => { e.preventDefault(); handleTriggerAudit(address); }}>
                <div className="flex items-center bg-[#ede0cc] rounded-2xl border-2 border-[#D4AF37]/80 shadow-[0_4px_24px_rgba(212,175,55,0.25)] p-1.5 pl-4 transition-all focus-within:border-[#D4AF37]">
                  <MapPin className="w-4 h-4 text-[#854d0e] shrink-0 mr-1.5" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Paste property address for comps, risks &amp; rebate"
                    className="flex-1 bg-transparent text-[#0a0a0a] text-xs sm:text-sm outline-none placeholder:text-[#554c40] font-medium"
                  />
                  <button
                    type="submit"
                    disabled={isAuditing}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d89f38] via-[#e2b755] to-[#c7922d] hover:brightness-105 text-black font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all cursor-pointer shrink-0"
                  >
                    <span>{isAuditing ? 'AUDITING...' : 'SEND'}</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>
                </div>
              </form>

              <p className="text-xs sm:text-sm text-white/70 leading-normal font-normal">
                Paste address for comps, risks, closing rebate where allowed by law.
              </p>
            </div>

            {/* ── THE 3 CONVERSATIONAL PROMPT PILLS (GROK / GEMINI MODEL) ── */}
            <div className="pt-1 space-y-2 text-center">
              <span className="text-[10px] text-[#D4AF37] uppercase font-bold tracking-wider block">
                Ask Charlie &amp; Bob in 1-Click:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {PROMPT_PILLS.map((pill) => (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => handlePromptPillClick(pill)}
                    className="px-3.5 py-2 rounded-xl bg-[#141414] hover:bg-[#202020] border border-[#D4AF37]/50 hover:border-[#D4AF37] text-white hover:text-[#D4AF37] text-xs font-medium shadow-md transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>&ldquo;{pill.label}&rdquo;</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Try Sample Chips */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              <span className="text-[10px] text-white/50 uppercase font-semibold">Try sample:</span>
              {Object.keys(SAMPLE_PROPERTIES).map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleTriggerAudit(chip)}
                  className="text-[10.5px] px-2.5 py-1 rounded-lg bg-[#ede0cc] hover:bg-[#f6ebd9] border border-[#d8cab6] hover:border-[#D4AF37] text-[#0a0a0a] font-medium transition-all cursor-pointer truncate max-w-[200px] shadow-sm"
                >
                  {chip.split(',')[0]}
                </button>
              ))}
            </div>

            {/* MLS Guidance Warning Pill */}
            <div className="pt-2 flex flex-col items-center space-y-2 text-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161208] border-2 border-[#D4AF37] text-[11px] sm:text-[12.5px] text-white shadow-lg">
                <ShieldAlert className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>
                  When searching MLS: <strong className="text-amber-300">Do not request an agent on portal sites</strong> &bull; <strong className="text-white">Vet the property here first</strong> to save thousands &amp; choose vetted representation.
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-[#D4AF37]/30 text-[11px] text-[#D4AF37] italic font-medium shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 not-italic" />
                <span>Trusted by private wealth. No agent spam or auctioning. Instant comps &amp; closing rebate.</span>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Night Luxury Villa */}
          <div className="lg:col-span-5 rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-[16/11] bg-black relative group">
            <img 
              src={NIGHT_HILLSIDE_ESTATE} 
              alt="Hillside Estate at Night" 
              className="w-full h-full object-cover origin-bottom-left scale-[1.18] translate-y-[2%] -translate-x-[2%] transition-transform duration-700"
            />
            <div className="absolute top-0 right-0 w-36 h-16 bg-gradient-to-bl from-[#0a0d14]/95 via-[#0d121c]/70 to-transparent pointer-events-none rounded-tr-2xl" />
            
            <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/90 backdrop-blur-md border border-[#D4AF37]/40 text-white text-xs flex items-center justify-between shadow-xl">
              <div>
                <span className="text-[#D4AF37] font-bold block text-[11px]">Charlie &amp; Bob Fiduciary Duo</span>
                <span className="text-white/70 text-[10px]">Zero UI &bull; No forms &bull; Drop any address</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] text-[9px] font-bold uppercase">
                ACTIVE 24/7
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* ─────────────────────────────────────────────────────────────
            2. SPLIT-SCREEN CANVAS MODE (THE GROK / CLAUDE ARTIFACT MODEL)
            Left: Sticky Chat with Charlie & Bob
            Right: Interactive Post-Search Audit Dossier Document
            ───────────────────────────────────────────────────────────── */
        <div className="px-4 sm:px-8 py-6 space-y-4 animate-in fade-in duration-300">
          {/* Sub-header Context Bar */}
          <div className="p-3 rounded-2xl bg-[#111111] border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-white text-sm">
                Active Audit Workspace: <span className="text-[#D4AF37]">{currentProperty.address}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleTriggerAudit(address); }}
                className="flex items-center gap-1.5"
              >
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Switch address..."
                  className="px-3 py-1.5 rounded-xl bg-black border border-white/20 text-white text-xs outline-none focus:border-[#D4AF37] w-48 sm:w-64"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs hover:brightness-110 transition-all cursor-pointer"
                >
                  Audit
                </button>
              </form>
            </div>
          </div>

          {/* ── SIDE-BY-SIDE SPLIT SCREEN: LEFT 35% CHAT / RIGHT 65% ARTIFACT DOSSIER ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column (4 cols / ~35% width): Persistent Chat with Charlie */}
            <div className="lg:col-span-5 h-[620px] sticky top-4">
              <CopilotCanvasChat
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                onSendSms={handleSendSms}
                smsSent={smsSent}
                activePropertyAddress={currentProperty.address}
                onReset={() => setViewMode('resting')}
              />
            </div>

            {/* Right Column (7 cols / ~65% width): The Dossier Artifact */}
            <div className="lg:col-span-7 space-y-4">
              <div className="text-left pb-1 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block">
                  DELIVERABLE ARTIFACT · POST-SEARCH AUDIT DOSSIER
                </span>
                <span className="text-[10px] text-white/50">
                  Updated in real-time
                </span>
              </div>

              <CopilotPropertyDossier property={currentProperty} />
            </div>
          </div>
        </div>
      )}

      {/* ── SLOGAN QUOTE IN FOOTER (CLEAN & ELEGANT) ── */}
      <div className="text-center py-4 border-t border-white/10 space-y-1 bg-[#050505]">
        <p 
          className="text-sm sm:text-base font-serif italic font-bold text-[#D4AF37] tracking-wider"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          &ldquo;IF YOU DON&rsquo;T HAVE A REAL ESTATE COPILOT YOU ARE SIMPLY FLYING BLIND!&rdquo;
        </p>
        <p 
          className="text-[11px] font-serif font-medium text-white/50 tracking-wide"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          &mdash; Bob Dyson, Founder &amp; Licensed Broker (DRE #00609384)
        </p>
      </div>
    </div>
  );
}