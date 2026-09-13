import React from 'react';
import { 
  Sparkles, CheckCircle2, Eye, ArrowRight, LayoutTemplate, 
  Layers, Star, ShieldCheck, Check
} from 'lucide-react';

const GOLD = '#D4AF37';

export const CANDIDATES_LIST = [
  {
    id: 'grok_candidate_a',
    title: '★ Option 1: Grok Format A — Asymmetrical Estate Split',
    badge: 'Grok Classy Split',
    concept: 'Luxury Estate Split',
    description: 'Balanced split-screen layout featuring a luxury stone estate, clean conversational search bar, 1-click sample chips, MLS source toggle, and 3-card benefit breakdown.',
    thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
    strengths: [
      'Zero visual friction with prominent search input & 1-click chips',
      'Clear fiduciary trust shield front and center',
      'Immediate property audit dossier in one smooth scroll'
    ]
  },
  {
    id: 'grok_candidate_b',
    title: '★ Option 2: Grok Format B — Symmetrical Executive Centered',
    badge: 'Grok Symmetrical',
    concept: 'Centered Luxury Vignette',
    description: 'Symmetrical centered layout with estate backdrop softly vignetted into Dyson Tan, floating pill search, 3 elevated white-and-gold cards, and connected 1-2-3 milestone steps.',
    thumbnail: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80',
    strengths: [
      'Centered focus puts the value proposition front and center',
      'Connected 1-2-3 milestone flow builds trust without sales jargon',
      'Clean card grid delivers fast scanning on both mobile and desktop'
    ]
  },
  {
    id: 'obsidian_twilight',
    title: 'Option 3: Obsidian Twilight Suite (Private Wealth)',
    badge: 'Aspirational Night',
    concept: 'Obsidian & Gold Luxury',
    description: 'Deep obsidian night aesthetic featuring hillside estate with illuminated infinity pool. Left column delivers the copilot search, fiduciary shield ("Trusted by private wealth. No agent spam"), 3 gold-accented audit cards, and 4-step execution line.',
    thumbnail: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80',
    strengths: [
      'Private banking and family-office level prestige',
      'Explicit 4-step workflow: Paste -> Analyze -> Deliver -> Decide',
      'Striking dark mode visual authority with gold accents'
    ]
  },
  {
    id: 'warm_champagne',
    title: 'Option 4: Warm Champagne Estate (Dyson Tan Signature)',
    badge: 'Dyson Tan Sunset',
    concept: 'Warm Editorial Villa',
    description: 'Bespoke cream & Dyson Tan palette with golden-hour villa & infinity pool. Features unvarnished comps, hidden risks, closing-cost credit, and 35-year brokerage legacy anchor ("35 years of high-end brokerage. Now augmented by AI").',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    strengths: [
      'Seamless alignment with brand-wide Dyson Tan (#ede0cc) palette',
      'Warm, welcoming, non-intimidating luxury aesthetic',
      '3-pillar cards: Honest comps, Hidden risks, Closing-cost credit'
    ]
  },
  {
    id: 'baseline_hero',
    title: 'Option 5: Architectural Showcase & Concierge Hybrid',
    badge: 'Current Hybrid',
    concept: 'Visual-First Hybrid',
    description: 'Prominent 16:9 full-color luxury home photography above the fold with Charlie Voice AI concierge, 1-click address pills, and live ticker.',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    strengths: [
      'Maximum color and prestige from architectural photography',
      'Keeps Charlie Simmons voice AI persona accessible immediately',
      'Deep transaction audit dossier reveals rebate, risks & comps in one scroll'
    ]
  }
];

export default function CopilotCandidatesScroll({
  activeCandidateId,
  onSelectCandidate,
  className = ''
}) {
  return (
    <div className={`space-y-4 text-left select-none ${className}`}>
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#0a0a0a] border border-[#D4AF37]/50 shadow-xl text-white">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
              ADMIN LAB CANDIDATE GALLERY
            </span>
          </div>
          <h2 
            className="text-lg sm:text-2xl font-bold text-white tracking-tight mt-0.5"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Landing Page Candidates Under Consideration
          </h2>
          <p className="text-xs text-white/70 mt-0.5">
            Compare Grok's new scenarios elevated to luxury standards. Click any candidate to test live in the frame above.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-white/40 font-mono text-[11px]">5 Designs Active</span>
        </div>
      </div>

      {/* 3 Candidate Cards in a Horizontal / Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CANDIDATES_LIST.map((c) => {
          const isActive = activeCandidateId === c.id;

          return (
            <div
              key={c.id}
              onClick={() => onSelectCandidate && onSelectCandidate(c.id)}
              className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 shadow-lg group relative overflow-hidden ${
                isActive
                  ? 'bg-[#17140b] border-[#D4AF37] ring-2 ring-[#D4AF37]/40 shadow-2xl -translate-y-1'
                  : 'bg-[#0f0f0f] border-white/15 hover:border-[#D4AF37]/60 hover:bg-[#141414]'
              }`}
            >
              {/* Active Indicator Top Tag */}
              {isActive && (
                <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-black text-[9.5px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <Check className="w-3 h-3 text-black" />
                  <span>TESTING IN LAB</span>
                </div>
              )}

              <div className="space-y-3">
                {/* Thumbnail Preview */}
                <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-black border border-white/10 shadow-inner">
                  <img 
                    src={c.thumbnail} 
                    alt={c.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md bg-black/80 text-[#D4AF37] border border-[#D4AF37]/40">
                      {c.concept}
                    </span>
                  </div>
                </div>

                {/* Candidate Title & Description */}
                <div>
                  <h3 
                    className="text-base font-bold text-white leading-snug group-hover:text-[#D4AF37] transition-colors"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    {c.title}
                  </h3>
                  <p className="text-[11.5px] text-white/70 mt-1 leading-relaxed line-clamp-3">
                    {c.description}
                  </p>
                </div>

                {/* Key Strengths */}
                <div className="space-y-1 pt-1 border-t border-white/10">
                  <span className="text-[9.5px] font-bold text-[#D4AF37] uppercase tracking-wider block">
                    Core Strengths:
                  </span>
                  <ul className="text-[10.5px] text-white/60 space-y-1">
                    {c.strengths.slice(0, 2).map((s, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 leading-snug">
                        <span className="text-[#10b981] font-bold shrink-0">✓</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectCandidate) onSelectCandidate(c.id);
                }}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                  isActive
                    ? 'bg-[#D4AF37] text-black font-black'
                    : 'bg-white/10 text-white hover:bg-[#D4AF37] hover:text-black'
                }`}
              >
                <span>{isActive ? 'Currently Testing Above' : 'Test This Candidate'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

            </div>
          );
        })}
      </div>

    </div>
  );
}