import React from 'react';
import { 
  ShieldCheck, AlertTriangle, UserCheck, 
  Scale, MessageSquare, ArrowRight, FileText, Check
} from 'lucide-react';

const GOLD = '#D4AF37';

export default function CopilotVettingView({
  propertyAddress,
  onPromptClick,
  onOpenCaptureModal
}) {
  const shortAddr = propertyAddress ? propertyAddress.split(',')[0] : 'Subject Property';

  const standards = [
    {
      title: 'Undivided Buyer Representation',
      desc: 'Ensuring your agent works exclusively for your interests, with no dual obligations to the property seller.',
      tag: 'Dedicated Loyalty'
    },
    {
      title: 'Local Sales Track Record',
      desc: 'Proven recent transaction history and pricing familiarity in the immediate neighborhood.',
      tag: 'Neighborhood Experience'
    },
    {
      title: 'Contingency & Deposit Diligence',
      desc: 'Careful guidance through inspection, appraisal, and financing milestones to safeguard your earnest money.',
      tag: 'Deposit Care'
    },
    {
      title: 'Clear, Transparent Terms',
      desc: 'A straightforward written agreement outlining services, broker compensation, and potential closing credits where permitted by law.',
      tag: 'Written Agreement'
    }
  ];

  const interviewQuestions = [
    {
      q: "Bob, what are the key differences between using the listing agent versus an independent buyer's agent?",
      label: "Understanding Representation Risks",
      asker: "bob"
    },
    {
      q: "Charlie, how does CoPilot stay involved through the referral agreement after an agent is selected?",
      label: "How CoPilot Supports Your Process",
      asker: "charlie"
    },
    {
      q: `Bob, what questions should I ask when interviewing local agents for ${shortAddr}?`,
      label: "Agent Interview Checklist",
      asker: "bob"
    }
  ];

  return (
    <div className="space-y-4 text-white text-left animate-in fade-in duration-200">
      
      {/* Concierge Advisory Header */}
      <div className="rounded-xl border border-white/10 bg-[#121212] p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
              Agent Advisory &amp; Partnership
            </span>
          </div>
          <h2 className="text-sm sm:text-base font-semibold text-white tracking-wide">
            Independent Agent Selection
          </h2>
          <p className="text-xs text-stone-300 leading-relaxed font-sans">
            Guiding your search for dedicated buyer representation for <span className="text-[#D4AF37] font-medium">{shortAddr}</span>, equipped with independent market intelligence.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (onOpenCaptureModal) onOpenCaptureModal();
            else onPromptClick?.("I would like to explore independent buyer agent matching for this property");
          }}
          className="px-4 py-2 rounded-full bg-white hover:bg-stone-200 text-black font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer shrink-0"
        >
          <span>Connect with an Agent</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Structural Anchor: How CoPilot Remains Involved via the Referral Agreement */}
      <div className="rounded-xl border border-[#D4AF37]/30 bg-[#141310] p-4 sm:p-5 space-y-2">
        <div className="flex items-center gap-2 text-[#D4AF37]">
          <FileText className="w-4 h-4 shrink-0" />
          <h3 className="text-xs sm:text-[13px] font-semibold tracking-wide">
            Our Role Alongside Your Agent: Supported by the Referral Agreement
          </h3>
        </div>
        <p className="text-xs text-stone-300 leading-relaxed font-sans">
          CoPilot is not just a passive search tool, nor do we replace your licensed agent or make final transaction decisions. When you match with a top local specialist through Dyson, our formal <strong className="text-white font-medium">referral agreement</strong> establishes CoPilot as your ongoing intelligence partner. We remain actively involved throughout your purchase—providing second-opinion comps, contingency tracking, and strategic analysis alongside your agent, at zero additional cost to you.
        </p>
      </div>

      {/* Recommended Standards Grid: Calm, breathable cards without neon colors */}
      <div className="bg-[#111111] border border-white/10 rounded-xl p-4 sm:p-5 space-y-3.5">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-xs sm:text-sm font-semibold text-white">
              Key Standards to Look for in a Buyer's Agent
            </h3>
          </div>
          <span className="text-[10px] text-stone-400 font-sans">Advisory Benchmarks</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
          {standards.map((std, idx) => (
            <div key={idx} className="p-3.5 rounded-lg bg-[#161616] border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>{std.title}</span>
                </h4>
                <span className="text-[9px] text-stone-400 bg-white/5 px-2 py-0.5 rounded font-sans">
                  {std.tag}
                </span>
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed font-sans">
                {std.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Advisory Guidance: Understanding Representation Perspectives */}
      <div className="bg-[#111111] border border-white/10 rounded-xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center gap-2 border-b border-white/10 pb-2.5">
          <Scale className="w-4 h-4 text-[#D4AF37]" />
          <h3 className="text-xs sm:text-sm font-semibold text-white">
            Understanding Dual Agency vs. Independent Representation
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-[#161616] border border-white/5 space-y-2">
            <div className="text-stone-300 font-medium text-xs flex items-center gap-1.5">
              <span>Working with the Listing Agent</span>
            </div>
            <ul className="space-y-1.5 text-stone-400 text-[11px] leading-relaxed">
              <li>• The listing agent owes existing contractual duties to the seller.</li>
              <li>• They cannot advocate exclusively for a lower price or concessions.</li>
              <li>• Negotiations on repairs and credits may be naturally constrained.</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-lg bg-[#161616] border border-[#D4AF37]/20 space-y-2">
            <div className="text-[#D4AF37] font-medium text-xs flex items-center gap-1.5">
              <span>Independent Buyer Representation</span>
            </div>
            <ul className="space-y-1.5 text-stone-300 text-[11px] leading-relaxed">
              <li>• 100% undivided fiduciary commitment exclusively to you.</li>
              <li>• Rigorous comps analysis to test whether the asking price is justified.</li>
              <li>• CoPilot remains actively involved alongside your agent through closing.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Advisory Dialogue Prompts */}
      <div className="bg-[#111111] border border-white/10 rounded-xl p-4 space-y-2.5">
        <span className="text-[10px] text-stone-400 block font-medium">
          Ask Charlie &amp; Bob About Agent Selection:
        </span>
        <div className="flex flex-wrap gap-2">
          {interviewQuestions.map((item, qIdx) => (
            <button
              key={qIdx}
              type="button"
              onClick={() => onPromptClick?.(item.q)}
              className="px-3 py-1.5 rounded-lg bg-[#161616] hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white text-xs font-normal flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <MessageSquare className="w-3 h-3 text-[#D4AF37]" />
              <span>{item.label}</span>
              <span className="text-[10px] text-stone-500 font-mono">({item.asker})</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}