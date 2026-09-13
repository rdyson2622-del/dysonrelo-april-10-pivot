import React, { useState } from 'react';
import { 
  X, Compass, Home, Brain, FileText, Gem, ExternalLink, 
  Chrome, CheckCircle2, ArrowRight, ShieldCheck, AlertTriangle, 
  Clock, DollarSign, TrendingUp, Percent, ShieldAlert, Sparkles, 
  HelpCircle, Copy, Phone, UserCheck, Scale
} from 'lucide-react';

export default function CopilotWorkflowExplainerModal({ 
  isOpen, 
  onClose, 
  initialStep = 1,
  onLaunchAudit
}) {
  const [activeStep, setActiveStep] = useState(initialStep);
  const [copiedAddress, setCopiedAddress] = useState(false);

  if (!isOpen) return null;

  const sampleAddress = "742 Vista Del Mar, La Jolla, CA 92037";

  const handleCopySample = () => {
    navigator.clipboard.writeText(sampleAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-[#0d0d0d] border border-[#D4AF37]/50 shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden text-[#f5f5f5]"
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#141414]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] font-serif font-bold">
              D
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block">
                DYSON HOMES COPILOT · WORKFLOW GUIDE &amp; EXPLAINER
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white">
                How Our Zero-UI Fiduciary System Works
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Navigation Tabs */}
        <div className="grid grid-cols-5 border-b border-white/10 bg-[#111111] text-xs">
          {[
            { step: 1, label: '1. Browse MLS', icon: Compass },
            { step: 2, label: '2. Paste Address', icon: Home },
            { step: 3, label: '3. How We Audit', icon: Brain },
            { step: 4, label: '4. What We Deliver', icon: FileText },
            { step: 5, label: '5. Rebate & Escrow', icon: Gem },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeStep === tab.step;
            return (
              <button
                key={tab.step}
                type="button"
                onClick={() => setActiveStep(tab.step)}
                className={`py-2.5 px-2 flex items-center justify-center gap-1.5 font-bold transition-all border-b-2 cursor-pointer ${
                  isActive 
                    ? 'border-[#D4AF37] text-[#D4AF37] bg-[#1a1a1a]' 
                    : 'border-transparent text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.step}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          
          {/* ──────────────── STEP 1: BROWSE MLS & REALTOR PORTALS ──────────────── */}
          {activeStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block">
                    STEP 1 EXPLAINER · PORTAL CHOICES &amp; WORKFLOW
                  </span>
                  <h4 className="text-xl font-bold text-white">
                    Browse Any Real Estate Portal Freely — Then Bring It Home
                  </h4>
                  <p className="text-xs sm:text-sm text-white/70 mt-1 leading-relaxed">
                    You don&rsquo;t need to change where you like to browse homes. Search on your favorite MLS syndication site, but <span className="text-[#D4AF37] font-semibold">never click &ldquo;Contact Agent&rdquo;</span>. Instead, copy the listing address or URL and bring it back here.
                  </p>
                </div>
              </div>

              {/* The Three Vertical Choices */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-white/90">
                  Select A Portal To Search In A New Tab:
                </h5>

                <div className="flex flex-col gap-2.5">
                  {/* Choice 1: Realtor.com */}
                  <div className="p-3.5 rounded-2xl bg-[#141414] border border-white/10 hover:border-[#D4AF37]/60 flex items-center justify-between gap-4 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#ede0cc] text-[#0a0a0a] font-black text-xs flex items-center justify-center shrink-0">
                        R
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                            Realtor.com
                          </span>
                          <span className="text-[9.5px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold uppercase">
                            Fastest MLS Updates
                          </span>
                        </div>
                        <p className="text-[11px] text-white/60 mt-0.5">
                          Direct NAR MLS feed. Shows official tax assessments, school boundaries, and price change history.
                        </p>
                      </div>
                    </div>
                    <a
                      href="https://www.realtor.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-[#ede0cc] hover:bg-white text-[#0a0a0a] font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-md transition-all cursor-pointer"
                    >
                      <span>Open Realtor.com</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Choice 2: Homes.com */}
                  <div className="p-3.5 rounded-2xl bg-[#141414] border border-white/10 hover:border-[#D4AF37]/60 flex items-center justify-between gap-4 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#ede0cc] text-[#0a0a0a] font-black text-xs flex items-center justify-center shrink-0">
                        H
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                            Homes.com
                          </span>
                          <span className="text-[9.5px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold uppercase">
                            Deep Neighborhood Data
                          </span>
                        </div>
                        <p className="text-[11px] text-white/60 mt-0.5">
                          Clean media layout, drone perspectives, and granular neighborhood video profiles.
                        </p>
                      </div>
                    </div>
                    <a
                      href="https://www.homes.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-[#ede0cc] hover:bg-white text-[#0a0a0a] font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-md transition-all cursor-pointer"
                    >
                      <span>Open Homes.com</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Choice 3: Zillow */}
                  <div className="p-3.5 rounded-2xl bg-[#141414] border border-white/10 hover:border-[#D4AF37]/60 flex items-center justify-between gap-4 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#ede0cc] text-[#0a0a0a] font-black text-xs flex items-center justify-center shrink-0">
                        Z
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                            Zillow
                          </span>
                          <span className="text-[9.5px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold uppercase">
                            Broad Consumer Inventory
                          </span>
                        </div>
                        <p className="text-[11px] text-white/60 mt-0.5">
                          High photo density, 3D walkthroughs, and Zestimate trend lines (note: we audit the true comps).
                        </p>
                      </div>
                    </div>
                    <a
                      href="https://www.zillow.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-[#ede0cc] hover:bg-white text-[#0a0a0a] font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-md transition-all cursor-pointer"
                    >
                      <span>Open Zillow</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Power Browser Tip: Suggest Google Chrome */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#181818] to-[#121212] border border-[#D4AF37]/40 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#4285F4]/20 border border-[#4285F4]/50 flex items-center justify-center text-[#4285F4] shrink-0">
                  <Chrome className="w-5 h-5 text-white" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Pro-Tip: We Recommend Using Google Chrome
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-bold">
                      SMOOTH TOGGLING
                    </span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed">
                    Opening your MLS search in <strong>Google Chrome</strong> makes it effortless to switch tabs: keep <strong>DysonHomes.com</strong> on one tab, and your home search on the other. Simply copy the address bar URL or property address (Cmd+C / Ctrl+C), switch tabs with <strong>Ctrl+Tab</strong>, and paste into Dyson Copilot!
                  </p>
                </div>
              </div>

              {/* Step By Step Instructions On How To Return */}
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
                <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block">
                  3-Step Return Workflow:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/5 space-y-1">
                    <span className="text-white font-bold block">1. Copy</span>
                    <p className="text-white/60 text-[11px]">
                      Highlight and copy the property street address or MLS web URL from your browser tab.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 space-y-1">
                    <span className="text-white font-bold block">2. Return &amp; Paste</span>
                    <p className="text-white/60 text-[11px]">
                      Switch back to the DysonHomes tab and paste directly into the search bar.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 space-y-1">
                    <span className="text-white font-bold block">3. Click Send</span>
                    <p className="text-white/60 text-[11px]">
                      Copilot immediately runs your unvarnished comps, risk audit, and closing rebate breakdown!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────── STEP 2: WHAT WE PROVIDE, HOW & WHEN ──────────────── */}
          {activeStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Home className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block">
                    STEP 2 EXPLAINER · WHAT WE PROVIDE, HOW &amp; WHEN
                  </span>
                  <h4 className="text-xl font-bold text-white">
                    Instant Zero-UI Transparency: No Forms, No Waiting, No Spam
                  </h4>
                  <p className="text-xs sm:text-sm text-white/70 mt-1 leading-relaxed">
                    Aggregator sites force you to submit your name and phone number to 5 aggressive lead-generation agents. Dyson Homes Copilot completely flips this model.
                  </p>
                </div>
              </div>

              {/* What / How / When Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-[#D4AF37]">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">WHAT WE PROVIDE</span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed">
                    • <strong>Real neighborhood comps:</strong> Closed sales prices, not wishful listing numbers.<br />
                    • <strong>Critical due diligence:</strong> Permitting red flags, coastal restrictions, flood zones, HOA lease limits.<br />
                    • <strong>Exact Closing Rebate:</strong> Guaranteed dollar amount credited back to your HUD-1 closing statement.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-[#D4AF37]">
                    <Home className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">HOW WE PROVIDE IT</span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed">
                    • <strong>Zero UI Architecture:</strong> No account signup, no passwords, no forced phone entry.<br />
                    • <strong>One-Click Address Drop:</strong> Simply paste any address or MLS #.<br />
                    • <strong>Private Screen Delivery:</strong> Results appear right in front of you on your screen instantly.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-[#D4AF37]">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">WHEN YOU GET IT</span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed">
                    • <strong>Instant (0–30 Seconds):</strong> Full on-screen preliminary valuation, comps spread, and rebate calculation.<br />
                    • <strong>Within Minutes:</strong> Human fiduciary cross-check by Bob Dyson (Broker DRE #00609384).<br />
                    • <strong>Optional SMS Dossier:</strong> Sent only if you request text delivery.
                  </p>
                </div>
              </div>

              {/* Sample Address Try-It Pill */}
              <div className="p-4 rounded-2xl bg-[#ede0cc] text-[#0a0a0a] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wide block">
                    Ready to test with a real luxury estate?
                  </span>
                  <span className="text-xs text-[#554c40]">
                    Try our featured sample: <strong>{sampleAddress}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (onLaunchAudit) onLaunchAudit(sampleAddress);
                    onClose();
                  }}
                  className="px-5 py-2 rounded-xl bg-[#0a0a0a] hover:bg-[#222] text-[#D4AF37] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all shrink-0"
                >
                  <span>Simulate Audit Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ──────────────── STEP 3: HOW WE AUDIT (NO COMMITMENT) ──────────────── */}
          {activeStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block">
                    STEP 3 EXPLAINER · OUR AUDIT ENGINE &amp; FIDUCIARY INTEGRITY
                  </span>
                  <h4 className="text-xl font-bold text-white">
                    How We Audit Any Home — With Zero Commitment Required
                  </h4>
                  <p className="text-xs sm:text-sm text-white/70 mt-1 leading-relaxed">
                    Most real estate agents tell you what you want to hear to get a commission. We are legally bound fiduciaries who tell you the truth about what a home is really worth before you make an offer.
                  </p>
                </div>
              </div>

              {/* The Two Pillars of the Audit */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* AI Model Intelligence */}
                <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#D4AF37]/20 text-[#D4AF37] font-bold text-xs flex items-center justify-center">
                      AI
                    </span>
                    <h5 className="text-sm font-bold text-white">Algorithmic Precision (Charlie AI)</h5>
                  </div>
                  <ul className="text-xs text-white/70 space-y-1.5 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] shrink-0 mt-0.5" />
                      <span><strong>Closed Sale Reconciliation:</strong> Pulls deed-recorded closed comps within 0.5 miles, normalizing price-per-square-foot against recent market appreciation curves.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] shrink-0 mt-0.5" />
                      <span><strong>Zoning &amp; Permit Audit:</strong> Cross-references municipal building departments for unpermitted room additions or pending code citations.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] shrink-0 mt-0.5" />
                      <span><strong>Environmental Hazard Scans:</strong> Checks flood plain designations, fire hazard severity zones, and coastal commission exterior restrictions.</span>
                    </li>
                  </ul>
                </div>

                {/* Licensed Human Fiduciary */}
                <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#ede0cc] text-[#0a0a0a] font-bold text-xs flex items-center justify-center">
                      35+
                    </span>
                    <h5 className="text-sm font-bold text-white">Broker Fiduciary Oversight (Bob Dyson)</h5>
                  </div>
                  <ul className="text-xs text-white/70 space-y-1.5 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span><strong>California Broker License DRE #00609384:</strong> 35+ years of real-world luxury transaction experience backing every valuation.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span><strong>Listing Agent Separation:</strong> We never represent the seller on your transaction. Complete fiduciary loyalty to you as the buyer.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span><strong>No Commitment Ever:</strong> Run 1 property or 50. You owe nothing until and unless you close on a home with our fiduciary network.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Fiduciary Guarantee Banner */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-[#10b981]/40 flex items-center gap-3 text-xs text-white/80">
                <ShieldCheck className="w-5 h-5 text-[#10b981] shrink-0" />
                <span>
                  <strong>Strict Confidentiality:</strong> Your search history and property queries are never sold to mortgage brokers or aggressive telemarketers.
                </span>
              </div>
            </div>
          )}

          {/* ──────────────── STEP 4: WHAT WE DELIVER (INTERACTIVE DOSSIER PREVIEW) ──────────────── */}
          {activeStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block">
                    STEP 4 EXPLAINER · WHAT YOU ACTUALLY RECEIVE
                  </span>
                  <h4 className="text-xl font-bold text-white">
                    The Complete Post-Search Audit Dossier
                  </h4>
                  <p className="text-xs sm:text-sm text-white/70 mt-1 leading-relaxed">
                    Here is an exact live preview of the unvarnished intelligence report you receive the second you paste any address or MLS number:
                  </p>
                </div>
              </div>

              {/* EXACT REPLICA OF SCREENSHOT 2 (POST-SEARCH AUDIT DOSSIER) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-black border border-[#D4AF37]/60 space-y-4 shadow-2xl">
                <div className="text-center">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#D4AF37]">
                    POST-SEARCH AUDIT DOSSIER PREVIEW
                  </span>
                </div>

                {/* Header Section */}
                <div className="p-4 rounded-xl bg-[#111111] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base sm:text-lg font-bold text-white">
                        742 Vista Del Mar, La Jolla, CA 92037
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[9.5px] font-bold uppercase bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                        VERIFIED LISTING
                      </span>
                    </div>
                    <p className="text-xs text-white/60 mt-1">
                      4 Beds &bull; 4.5 Baths &bull; 3,820 SqFt &bull; 64 Days on Market &bull; Office: Independent Coastal Brokerage
                    </p>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[10px] text-white/50 uppercase block font-semibold">CURRENT LIST PRICE</span>
                    <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">$3,450,000</span>
                  </div>
                </div>

                {/* 3 Core Dossier Boxes (Matching Screenshot 2 exactly) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Card 1: Cash Back at Closing */}
                  <div className="p-4 rounded-xl bg-[#141414] border border-[#D4AF37]/50 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[#D4AF37]">
                        <span className="text-xs font-bold uppercase tracking-wider">YOUR CASH BACK AT CLOSING</span>
                        <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-xs font-bold text-[#D4AF37]">$</div>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-[#D4AF37] font-mono">
                        +$21,562
                      </div>
                      <p className="text-[10.5px] text-white/70 leading-relaxed">
                        Up to 50% of our brokerage referral fee credited directly to your closing settlement statement or mortgage rate buy-down.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/10 text-[10.5px] space-y-1">
                      <div className="flex justify-between text-white/50">
                        <span>Listing Side Fee (2.5%):</span>
                        <span>$86,250</span>
                      </div>
                      <div className="flex justify-between text-white/50">
                        <span>Dyson 25% Referral:</span>
                        <span>$21,563</span>
                      </div>
                      <div className="flex justify-between text-[#D4AF37] font-bold">
                        <span>Your 50% Rebate:</span>
                        <span>+$21,562</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Unbiased Comps Valuation */}
                  <div className="p-4 rounded-xl bg-[#141414] border border-blue-500/50 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-blue-400">
                        <span className="text-xs font-bold uppercase tracking-wider">UNBIASED COMPS VALUATION</span>
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                        $3,200,000
                      </div>
                      <p className="text-[10.5px] text-white/70 leading-relaxed">
                        Estimated fair market value based on actual closed neighborhood sales, not asking prices or algorithmic sales pitch.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/10 text-[10.5px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-white/60">Spread vs Ask:</span>
                        <span className="text-amber-400 font-bold">-$250,000 (Overpriced)</span>
                      </div>
                      <div className="flex justify-between text-white/50">
                        <span>Last Sold (2019):</span>
                        <span>$2,100,000</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Hidden Risks & Audit */}
                  <div className="p-4 rounded-xl bg-[#141414] border border-red-500/50 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-red-400">
                        <span className="text-xs font-bold uppercase tracking-wider">HIDDEN RISKS &amp; AUDIT</span>
                        <ShieldAlert className="w-4 h-4 text-red-400" />
                      </div>
                      <ul className="text-[10.5px] text-white/80 space-y-1.5 pt-1">
                        <li className="flex items-start gap-1.5">
                          <span className="text-red-400 font-bold">•</span>
                          <span>64 days on market — seller price reduction of $150k pending</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-red-400 font-bold">•</span>
                          <span>Coastal Commission permitting boundary: strict exterior remodel restrictions</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-red-400 font-bold">•</span>
                          <span>Recent neighborhood comp sold 7.2% below asking price</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center gap-1.5 text-[9.5px] text-emerald-400 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>Deed, zoning &amp; title audit by Dyson Copilot</span>
                    </div>
                  </div>
                </div>

                {/* SMS Opt-in Strip Replica */}
                <div className="p-3 rounded-xl bg-[#111] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <div>
                      <span className="font-bold text-white block">PRIVATE DOSSIER &bull; NO AGENT HARASSMENT</span>
                      <span className="text-white/50 text-[10.5px]">We don't auction your phone number to 5 competing agents.</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      disabled
                      placeholder="(555) 000-0000"
                      className="px-3 py-1.5 rounded-lg bg-black border border-white/20 text-white/60 text-xs w-full sm:w-36 font-mono"
                    />
                    <button
                      type="button"
                      disabled
                      className="px-4 py-1.5 rounded-lg bg-[#D4AF37] text-black font-bold text-xs uppercase shrink-0 opacity-90"
                    >
                      Text Me Dossier
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ──────────────── STEP 5: THE OFFER, REBATE & ESCROW MONITORING ──────────────── */}
          {activeStep === 5 && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Gem className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block">
                    STEP 5 EXPLAINER · CASH REBATE &amp; ESCROW ADVOCACY
                  </span>
                  <h4 className="text-xl font-bold text-white">
                    The Offer, Features, Benefits &amp; Complete Escrow Monitoring
                  </h4>
                  <p className="text-xs sm:text-sm text-white/70 mt-1 leading-relaxed">
                    Once you decide to buy, we pair you with a top vetted independent fiduciary agent in your city, oversee the entire escrow, and credit thousands in cash back directly to your closing statement.
                  </p>
                </div>
              </div>

              {/* The 4 Escrow Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-[#D4AF37]">
                    <Percent className="w-4 h-4 text-[#D4AF37]" />
                    <h5 className="text-xs font-bold uppercase tracking-wider text-white">
                      Up To 50% Closing Fee Rebate
                    </h5>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    On a $1.5M home with a typical 2.5% commission ($37,500), Dyson collects our 25% referral ($9,375) and credits <strong>50% ($4,687) directly back to you</strong> at closing on your settlement statement (HUD-1) or towards a permanent mortgage rate buy-down where allowed by law.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-[#D4AF37]">
                    <ShieldCheck className="w-4 h-4 text-[#10b981]" />
                    <h5 className="text-xs font-bold uppercase tracking-wider text-white">
                      Proactive Escrow Milestone Monitoring
                    </h5>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    We track every deadline: earnest money deposit, title review, physical inspection contingency, appraisal contingency, loan approval, and final walkthrough. You never risk forfeiting your earnest money deposit.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-[#D4AF37]">
                    <FileText className="w-4 h-4 text-[#D4AF37]" />
                    <h5 className="text-xs font-bold uppercase tracking-wider text-white">
                      Transaction Doc &amp; Fee Auditing
                    </h5>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Our brokerage audits the preliminary title report, HOA resale disclosure packets, and escrow closing statements to flag inflated administration charges, unexpected transfer fees, or surprise assessments before you sign.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-[#D4AF37]">
                    <UserCheck className="w-4 h-4 text-[#D4AF37]" />
                    <h5 className="text-xs font-bold uppercase tracking-wider text-white">
                      Independent Fiduciary Representation
                    </h5>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Never trust the listing agent to negotiate against themselves. We match you with an elite, vetted local buyer specialist who advocates solely for your financial interests and negotiates repairs, credits, and price reductions.
                  </p>
                </div>
              </div>

              {/* Legal Attribution Box */}
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-white/50 uppercase block font-semibold">LICENSED CALIFORNIA BROKERAGE</span>
                  <span className="text-white font-medium">The Dyson &amp; Dyson Companies, Inc. &bull; DRE #00609384</span>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-[#D4AF37] uppercase block font-bold">LEGAL REBATE COMPLIANCE</span>
                  <span className="text-white/60">Credited pursuant to DOJ and RESPA compliance standards.</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#141414] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-white/60">
            <span>Step {activeStep} of 5</span>
            <span>&bull;</span>
            <span className="text-[#D4AF37] font-medium">Click any tab above to jump</span>
          </div>

          <div className="flex items-center gap-2">
            {activeStep > 1 && (
              <button
                type="button"
                onClick={() => setActiveStep(prev => prev - 1)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all cursor-pointer"
              >
                Back
              </button>
            )}

            {activeStep < 5 ? (
              <button
                type="button"
                onClick={() => setActiveStep(prev => prev + 1)}
                className="px-5 py-2 rounded-xl bg-[#D4AF37] hover:brightness-110 text-black font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#d89f38] via-[#e2b755] to-[#c7922d] text-black font-bold transition-all cursor-pointer shadow-md"
              >
                Got It &bull; Return to Search
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}