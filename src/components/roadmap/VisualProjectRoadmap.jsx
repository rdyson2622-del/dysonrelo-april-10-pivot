import React from 'react';
import { 
  CheckCircle2, Loader2, Circle, AlertTriangle, 
  MapPin, Compass, Building2, ShieldCheck, ArrowRight,
  Sparkles, Check, ChevronRight
} from 'lucide-react';

const GOLD = '#D4AF37';

export const ROADMAP_TEMPLATES = {
  relocation: {
    id: 'relocation',
    name: 'Relocation Roadmap',
    tagline: 'End-to-End Nationwide Move Orchestration',
    color: '#D4AF37',
    phases: [
      {
        number: 1,
        id: 'intake',
        title: 'Relocation Intake & Criteria Profile',
        subtitle: 'Parameters Registered',
        status: 'completed',
        badge: 'Completed',
        desc: 'Move parameters, timeline, budget, and destination criteria registered in the Dyson network.',
        dysonDeliverable: 'Client relocation file established; fiduciary engagement initiated.',
        items: [
          'Relocation profile submitted & verified',
          'Move timeline & budget parameters registered',
          'Fiduciary representation standards acknowledged',
        ],
      },
      {
        number: 2,
        id: 'agent_vetting',
        title: 'Fiduciary Agent Match & Independent Vetting',
        subtitle: 'Manual Review & Audit',
        status: 'active',
        badge: 'In Progress • Manual Review',
        desc: 'Bob Dyson and our senior relocation desk are independently vetting top-producing local agents in your destination market.',
        dysonDeliverable: 'Vetted candidate shortlist presented directly to you with production audit & disciplinary check.',
        items: [
          'Analyzing local MLS sales volume & neighborhood specialization',
          'Direct interview & fiduciary standard verification with broker candidates',
          '3–5 top candidate dossiers prepared for client review',
        ],
      },
      {
        number: 3,
        id: 'property_search',
        title: 'Curated Property Search & On-Site Preview',
        subtitle: 'MLS & Valuation Audit',
        status: 'upcoming',
        badge: 'Upcoming',
        desc: 'Collaborative MLS listing review, AI comp analysis, and video tours coordinated with your vetted agent.',
        dysonDeliverable: 'Unbiased property valuation audits before offers are drafted.',
        items: [
          'Off-market & MLS match alerts aligned with your lifestyle criteria',
          'Preliminary tax assessment and valuation audit for candidate homes',
          'Coordination of preview tours and neighborhood drive-throughs',
        ],
      },
      {
        number: 4,
        id: 'lifestyle_tax',
        title: 'Community, School & Tax Migration Research',
        subtitle: 'Residency & Schools',
        status: 'upcoming',
        badge: 'Upcoming',
        desc: 'In-depth lifestyle intelligence, school district data, property tax analysis, and climate considerations.',
        dysonDeliverable: 'Personalized destination briefing document prepared by our research desk.',
        items: [
          'Local property tax differential and residency transition guide',
          'School ranking verification and private/public enrollment windows',
          'Commute routes, municipal services, and medical infrastructure mapping',
        ],
      },
      {
        number: 5,
        id: 'due_diligence',
        title: 'Due Diligence, Inspection & Contract Review',
        subtitle: 'Inspections & Legal',
        status: 'upcoming',
        badge: 'Upcoming',
        desc: 'Independent contract and contingency audit so you never walk into an uninspected surprise.',
        dysonDeliverable: 'Fiduciary contract audit protecting your earnest money deposit.',
        items: [
          'Independent inspection report evaluation and repair request strategy',
          'HOA covenants, CCRs, and municipal zoning compliance review',
          'Title commitment and property disclosure cross-examination',
        ],
      },
      {
        number: 6,
        id: 'escrow_closing',
        title: 'Escrow Oversight, Closing & Settlement',
        subtitle: 'Settlement & Keys',
        status: 'upcoming',
        badge: 'Upcoming',
        desc: 'Continuous tracking through closing day, key exchange, and mover coordination.',
        dysonDeliverable: 'Escrow milestone audit from acceptance through deed recordation.',
        items: [
          'Escrow milestone timeline and deadline monitoring',
          'Final walkthrough checklist and lender funding verification',
          'Utility transfer coordination and closing celebration',
        ],
      },
    ],
  },
  tax_strategy: {
    id: 'tax_strategy',
    name: '1031 & Tax Strategy',
    tagline: 'Capital Gains & State Tax Migration Defense',
    color: '#10b981',
    phases: [
      {
        number: 1,
        id: 'relinquished',
        title: 'Relinquished Property Basis & Equity Audit',
        subtitle: 'Cost Basis Verified',
        status: 'completed',
        badge: 'Completed',
        desc: 'Analysis of current property depreciation recapture and capital gains tax liabilities.',
        dysonDeliverable: 'Comprehensive 1031 equity & exchange qualification summary.',
        items: [
          'Deed and settlement statement review on current property',
          'Tax basis and depreciation schedule analyzed',
          'Net proceeds and exchange equity target established',
        ],
      },
      {
        number: 2,
        id: 'qi_escrow',
        title: 'Qualified Intermediary (QI) & Safe Harbor Setup',
        subtitle: 'Escrow Lock Initiated',
        status: 'active',
        badge: 'Active • QI Engaged',
        desc: 'Selecting and retaining a bonded Qualified Intermediary to hold sale proceeds without constructive receipt.',
        dysonDeliverable: 'Fiduciary Qualified Intermediary escrow engagement confirmed.',
        items: [
          'QI exchange agreement drafted and reviewed',
          'Closing attorney / escrow officer instructed on exchange language',
          'Dual-signoff segregated bank account opened',
        ],
      },
      {
        number: 3,
        id: 'id_window',
        title: '45-Day Identification Window Execution',
        subtitle: 'Target Replacement',
        status: 'upcoming',
        badge: 'Upcoming',
        desc: 'Fiduciary search and formal identification of up to three replacement properties in destination market.',
        dysonDeliverable: 'Strict 45-day IRS Section 1031 notification delivered and recorded.',
        items: [
          '3-property identification shortlist vetted for debt & value matching',
          'Off-market and MLS candidate homes inspected',
          'Formal legal identification paperwork filed prior to Day 45',
        ],
      },
      {
        number: 4,
        id: 'acquisition',
        title: '180-Day Acquisition & Fund Disbursement',
        subtitle: 'Closing Coordination',
        status: 'upcoming',
        badge: 'Upcoming',
        desc: 'Coordinating title, appraisal, and escrow to ensure replacement closing inside the 180-day deadline.',
        dysonDeliverable: 'Full fund disbursement authorization and settlement audit.',
        items: [
          'Purchase agreement executed with 1031 cooperation clause',
          'QI direct wire disbursement to destination escrow',
          'Title deed recorded in exchange entity name',
        ],
      },
      {
        number: 5,
        id: 'residency',
        title: 'State Residency Domicile & Audit Proofing',
        subtitle: 'Residency Shift',
        status: 'upcoming',
        badge: 'Upcoming',
        desc: 'Establishing clear statutory domicile in destination state to defend against origin state tax audits.',
        dysonDeliverable: 'Domicile audit dossier (voter, license, banking, primary residence proof).',
        items: [
          'Primary domicile timeline and 183-day physical presence tracking',
          'Driver license, vehicle registration, and homestead filings',
          'Origin state non-residency affidavit and tax filing coordination',
        ],
      },
    ],
  },
  agent_vetting: {
    id: 'agent_vetting',
    name: 'Agent Vetting Desk',
    tagline: 'Independent Fiduciary Audit of Local Broker Candidates',
    color: '#38bdf8',
    phases: [
      {
        number: 1,
        id: 'market_scan',
        title: 'Local MLS Sales Volume & Production Scan',
        subtitle: 'Top 50 Volume Scan',
        status: 'completed',
        badge: 'Completed',
        desc: 'Filtering MLS records to isolate agents with proven transaction volume in your exact target neighborhood.',
        dysonDeliverable: 'Unbiased local production ranking (excluding paid-portal ad placement).',
        items: [
          'MLS data pull of closed transactions within 3-mile radius',
          'List-to-sale ratio and median days on market benchmarked',
          'Agent vs team lead actual representation verified',
        ],
      },
      {
        number: 2,
        id: 'license_audit',
        title: 'State Licensing Board Disciplinary Audit',
        subtitle: 'Board Records Audit',
        status: 'active',
        badge: 'Active • Registry Audit',
        desc: 'Checking real estate commission registries for complaints, sanctions, arbitrations, or active lawsuits.',
        dysonDeliverable: 'Clean-license certification and compliance clearance report.',
        items: [
          'State real estate commission disciplinary record check',
          'Civil judgment and broker dispute history review',
          'Brokerage supervisory standing and insurance verified',
        ],
      },
      {
        number: 3,
        id: 'blind_interview',
        title: 'Fiduciary Blind Interview & Strategy Test',
        subtitle: 'Pricing Defense Test',
        status: 'upcoming',
        badge: 'Upcoming',
        desc: 'Our senior relocation managers interview top candidates without disclosing client identity.',
        dysonDeliverable: 'Interview evaluation scorecards comparing market grasp and fee flexibility.',
        items: [
          'Tough questions on local inventory and micro-neighborhood trends',
          'Evaluation of negotiation tactics and buyer representation loyalty',
          'Written agreement to Dyson fiduciary standards and reporting',
        ],
      },
      {
        number: 4,
        id: 'client_choice',
        title: 'Candidate Dossier Delivery & Introduction',
        subtitle: 'Client Decision',
        status: 'upcoming',
        badge: 'Upcoming',
        desc: 'Presenting top 3 vetted finalists with interview recordings and track records for your final pick.',
        dysonDeliverable: 'Warm introduction to your chosen agent with co-pilot supervision throughout.',
        items: [
          'Review 3 finalist candidate profiles with Bob Dyson',
          'Introductory consultation call scheduled with your top choice',
          'Fiduciary oversight agreement active throughout the transaction',
        ],
      },
    ],
  },
  escrow_audit: {
    id: 'escrow_audit',
    name: 'Escrow Defense',
    tagline: 'Purchase Agreement Contingency & Deposit Tracking',
    color: '#f59e0b',
    phases: [
      {
        number: 1,
        id: 'contract_review',
        title: 'Purchase Agreement & Contingency Audit',
        subtitle: 'Terms Verification',
        status: 'completed',
        badge: 'Completed',
        desc: 'Reviewing every clause of the purchase contract to protect buyer rights and earnest money deposit.',
        dysonDeliverable: 'Contract audit memo flagging unvetted seller conditions or short windows.',
        items: [
          'Earnest money forfeiture clauses scrutinized',
          'Inspection, appraisal, and loan contingency deadlines mapped',
          'Title company selection and escrow fee structure verified',
        ],
      },
      {
        number: 2,
        id: 'deposit_receipt',
        title: 'Earnest Money Verification & Escrow Opening',
        subtitle: 'Deposit Protected',
        status: 'active',
        badge: 'Active • In Escrow',
        desc: 'Verifying wire instructions directly with title officer to prevent wire fraud, confirming receipt.',
        dysonDeliverable: 'Official escrow receipt and milestone master timeline issued.',
        items: [
          'Wire instructions verbally authenticated with title officer',
          'Escrow file opened with neutral third party',
          'Critical milestone deadlines synchronized with Dyson tracking',
        ],
      },
      {
        number: 3,
        id: 'inspections',
        title: 'Physical Inspection Review & Repair Request',
        subtitle: 'Due Diligence',
        status: 'upcoming',
        badge: 'Upcoming',
        desc: 'Reviewing general home, roof, sewer, and HVAC inspections to draft prioritized repair credits.',
        dysonDeliverable: 'Independent repair credit negotiation plan.',
        items: [
          'Comprehensive inspection report reviewed by Dyson technical desk',
          'Structural vs cosmetic findings categorized',
          'Request for repair or price reduction presented to seller',
        ],
      },
      {
        number: 4,
        id: 'loan_appraisal',
        title: 'Lender Appraisal & Loan Contingency Removal',
        subtitle: 'Underwriting Signoff',
        status: 'upcoming',
        badge: 'Upcoming',
        desc: 'Monitoring appraisal valuation and lender condition signoff prior to contingency release.',
        dysonDeliverable: 'Clear-to-close lender verification document.',
        items: [
          'Appraisal report valuation verified against market comps',
          'Lender underwriting conditions cleared',
          'Contingency removal drafted only after full loan approval',
        ],
      },
      {
        number: 5,
        id: 'funding_deed',
        title: 'Closing Disclosure Audit & Deed Recordation',
        subtitle: 'Settlement & Keys',
        status: 'upcoming',
        badge: 'Upcoming',
        desc: 'Line-by-line comparison of initial Loan Estimate to final Closing Disclosure to stop junk fees.',
        dysonDeliverable: 'Audited settlement statement and confirmed deed recording.',
        items: [
          'Closing disclosure settlement charges reconciled',
          'Final walkthrough checklist completed before funds release',
          'County deed recorded and key exchange confirmed',
        ],
      },
    ],
  },
};

export default function VisualProjectRoadmap({
  selectedTemplate = 'relocation',
  onSelectTemplate,
  activePhaseNumber = 2,
  onSelectPhase,
  originCity = 'Santa Cruz',
  destinationCity = 'Austin, TX',
  customTitle,
}) {
  const currentTemplate = ROADMAP_TEMPLATES[selectedTemplate] || ROADMAP_TEMPLATES.relocation;
  const phases = currentTemplate.phases;
  const activePhase = phases.find(p => p.number === activePhaseNumber) || phases[1] || phases[0];

  const completedCount = phases.filter(p => p.number < activePhaseNumber || p.status === 'completed').length;
  const progressPercent = Math.round((completedCount / phases.length) * 100);

  return (
    <div 
      className="w-full rounded-2xl p-4 sm:p-6 bg-[#0a0a0a] text-white border-2 border-[#D4AF37] shadow-2xl space-y-4 text-left"
      style={{
        boxShadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.4)',
      }}
    >
      {/* ── TOP HEADER & PROJECT SELECTOR PILLS ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-ping" />
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#D4AF37] text-black">
              VISIBLE PROJECT ROADMAP
            </span>
            <span className="text-xs text-[#10b981] font-mono font-bold flex items-center gap-1">
              <span>●</span> Phase {activePhaseNumber} of {phases.length} Active ({progressPercent}% Complete)
            </span>
          </div>

          <h2 
            className="text-lg sm:text-2xl font-bold text-white tracking-tight leading-snug"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {customTitle || `${currentTemplate.name}: ${originCity} → ${destinationCity}`}
          </h2>
          <p className="text-xs text-white/60">
            {currentTemplate.tagline}
          </p>
        </div>

        {/* Dynamic Project Tabs — easily match exact requirements of any project */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 shrink-0">
          {Object.values(ROADMAP_TEMPLATES).map((tmpl) => {
            const isSelected = tmpl.id === currentTemplate.id;
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => {
                  onSelectTemplate?.(tmpl.id);
                  onSelectPhase?.(2);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                  isSelected 
                    ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-md scale-105'
                    : 'bg-[#141414] text-white/70 border-white/15 hover:text-white hover:border-white/40'
                }`}
              >
                {tmpl.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── THE VISIBLE ROUTE LINE (TESLA FSD / AIRLINE RADAR TRACK) ── */}
      <div className="pt-2 pb-3 overflow-x-auto">
        <div 
          className="relative py-4"
          style={{ minWidth: Math.max(phases.length * 125, 580) }}
        >
          {/* Base Background Track */}
          <div 
            className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-white/10"
          />

          {/* Active Glowing Progress Fill */}
          <div 
            className="absolute left-6 top-1/2 -translate-y-1/2 h-1.5 rounded-full transition-all duration-700"
            style={{
              width: `calc(${((activePhaseNumber - 0.5) / phases.length) * 100}% - 12px)`,
              background: 'linear-gradient(90deg, #10b981 0%, #D4AF37 100%)',
              boxShadow: '0 0 12px rgba(212,175,55,0.8)',
            }}
          />

          {/* Milestone Checkpoint Nodes */}
          <div className="relative z-10 flex items-center justify-between px-3">
            {phases.map((phase) => {
              const isPast = phase.number < activePhaseNumber;
              const isCurrent = phase.number === activePhaseNumber;

              return (
                <button
                  key={phase.number}
                  type="button"
                  onClick={() => onSelectPhase?.(phase.number)}
                  className="group flex flex-col items-center text-center cursor-pointer transition-all hover:scale-105 active:scale-95 focus:outline-none"
                  style={{ width: `${100 / phases.length}%` }}
                >
                  {/* Glowing Node Circle */}
                  <div 
                    className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                      isCurrent 
                        ? 'border-2 border-[#D4AF37] ring-4 ring-[#D4AF37]/30 scale-110' 
                        : isPast
                        ? 'border-2 border-[#10b981]'
                        : 'border border-white/20'
                    }`}
                    style={{
                      background: isCurrent 
                        ? 'linear-gradient(135deg, #2a2210 0%, #0a0a0a 100%)' 
                        : isPast 
                        ? '#0f1f15' 
                        : '#141414',
                    }}
                  >
                    {isPast ? (
                      <Check className="w-5 h-5 text-[#10b981] font-bold" />
                    ) : isCurrent ? (
                      <div className="flex items-center justify-center">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-ping absolute" />
                        <span className="font-mono font-black text-sm text-[#D4AF37]">{phase.number}</span>
                      </div>
                    ) : (
                      <span className="font-mono text-xs text-white/50">{phase.number}</span>
                    )}

                    {/* Active Pulsing Indicator Badge */}
                    {isCurrent && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D4AF37]" />
                      </span>
                    )}
                  </div>

                  {/* Node Label Below */}
                  <div className="mt-2 space-y-0.5 px-1">
                    <div 
                      className={`text-xs font-bold truncate ${
                        isCurrent 
                          ? 'text-[#D4AF37]' 
                          : isPast 
                          ? 'text-[#10b981]' 
                          : 'text-white/70'
                      }`}
                    >
                      {phase.title}
                    </div>

                    <div className="flex items-center justify-center">
                      <span 
                        className={`text-[8.5px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-full ${
                          isPast 
                            ? 'bg-[#10b981]/20 text-[#10b981]' 
                            : isCurrent 
                            ? 'bg-[#D4AF37] text-black' 
                            : 'bg-white/10 text-white/40'
                        }`}
                      >
                        {isPast ? 'DONE' : isCurrent ? 'ACTIVE' : 'UPCOMING'}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── ACTIVE PHASE SPOTLIGHT BAR ── */}
      <div 
        className="p-3.5 sm:p-4 rounded-xl bg-[#141414] border border-[#D4AF37]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
      >
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-[#D4AF37] text-black">
              PHASE {activePhase.number} FOCUS
            </span>
            <span className="font-bold text-white text-sm">
              {activePhase.title}
            </span>
          </div>
          <p className="text-white/75 text-xs">
            <strong className="text-[#D4AF37]">Fiduciary Deliverable:</strong> {activePhase.dysonDeliverable || activePhase.deliverable}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSelectPhase?.(activePhase.number)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-black shrink-0 shadow cursor-pointer hover:brightness-110 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
        >
          <span>View Phase Milestones</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}