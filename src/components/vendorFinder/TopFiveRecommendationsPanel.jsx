import React from 'react';
import { 
  Trophy, Star, ShieldCheck, CheckCircle2, ArrowRight, 
  ExternalLink, Phone, Sparkles, MapPin, Layers, Award
} from 'lucide-react';

export default function TopFiveRecommendationsPanel({
  selectedIndustry,
  selectedIndustryLabel = '',
  nationals = [],
  selectedOfferings = [],
  offerings = [],
  localMatchDispatched = false,
  onLaunchLocalTriage,
  onOpenConnectModal,
}) {
  // Build Curated Top 5 Items
  const national1 = nationals.find((v) => v.national_rank === 1) || nationals[0];
  const national2 = nationals.find((v) => v.national_rank === 2) || nationals[1];
  
  // Find chosen offerings details
  const activeOfferingsList = offerings.filter(o => 
    selectedOfferings.includes(o.id) || selectedOfferings.includes(o.title)
  );
  const primaryOffering = activeOfferingsList[0] || offerings[0];

  const recommendations = [
    {
      rank: 1,
      badge: '#1 Curated National Leader',
      badgeColor: 'bg-[#D4AF37] text-black',
      title: national1 ? national1.name : `Premier National ${selectedIndustryLabel} Partner`,
      subtitle: national1?.coverage || 'Full Nationwide 50-State Coverage',
      description: national1?.notes || `Contractually locked pricing caps, priority summer/transition reservation slots, and dedicated Dyson executive coordinator.`,
      actionLabel: 'Direct Partner Portal',
      actionUrl: national1?.website || null,
      phone: national1?.phone || null,
      fiduciaryNote: 'Zero Consumer Markup Guarantee',
    },
    {
      rank: 2,
      badge: '#2 Alternative National Network',
      badgeColor: 'bg-white/10 text-[#D4AF37] border border-[#D4AF37]/40',
      title: national2 ? national2.name : `Alternative Flexible Logistics Partner`,
      subtitle: national2?.coverage || 'Nationwide Metro Hubs',
      description: national2?.notes || `On-demand flexible logistics, container storage solutions, and customizable scope to fit shifting closing dates.`,
      actionLabel: 'Direct Partner Portal',
      actionUrl: national2?.website || null,
      phone: national2?.phone || null,
      fiduciaryNote: 'Flexible Escrow Contingency Terms',
    },
    {
      rank: 3,
      badge: 'Dedicated Local Concierge Match',
      badgeColor: 'bg-sky-500/20 text-sky-400 border border-sky-500/40',
      title: localMatchDispatched 
        ? `Local Destination Match in Review` 
        : `Vetted Local Destination Provider (${selectedIndustryLabel})`,
      subtitle: localMatchDispatched ? 'Fiduciary Desk Matching in Progress' : 'On-Demand City & ZIP Matching',
      description: localMatchDispatched
        ? `Your triage request is being processed. Our relocation team is assigning the highest-ranked local service provider based on your destination criteria.`
        : `Locals fluctuate constantly. Launch the guided triage Q&A above for instant human matching by our relocation desk — no random online directory ads.`,
      actionLabel: localMatchDispatched ? 'Triage Active' : 'Launch Local Triage',
      onClick: onLaunchLocalTriage,
      fiduciaryNote: 'Direct Inspection & License Verification',
    },
    {
      rank: 4,
      badge: 'Tailored Service Offering Package',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
      title: primaryOffering ? primaryOffering.title : `Turnkey ${selectedIndustryLabel} Scope`,
      subtitle: primaryOffering ? `Category: ${primaryOffering.kind?.toUpperCase() || 'SERVICE'}` : 'Customized Move Scope',
      description: primaryOffering?.short_description || `Structured scope of work ensuring all tasks are handled on schedule without surprise change orders.`,
      actionLabel: 'Request Custom Quote',
      onClick: onOpenConnectModal,
      fiduciaryNote: 'Clear Deliverables & Price Transparency',
    },
    {
      rank: 5,
      badge: 'Fiduciary Escrow & Roadmap Safeguard',
      badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/40',
      title: 'Dyson & Dyson Closing Milestone Integration',
      subtitle: 'Complete Milestone Accounting & Vendor Coordination',
      description: `All vendor bookings and completion sign-offs are logged directly to your Relocation Roadmap and escrow ledger to prevent closing delays.`,
      actionLabel: 'View in Relocation Roadmap',
      actionPath: '/client-roadmap',
      fiduciaryNote: '100% Free Subscriber Concierge Service',
    },
  ];

  return (
    <div 
      className="p-5 sm:p-7 rounded-3xl border text-left shadow-2xl relative space-y-5"
      style={{
        background: '#0a0a0a',
        borderColor: 'rgba(212,175,55,0.45)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
      }}
    >
      {/* Header of Top 5 Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
              CURATED TOP 5 RECOMMENDATIONS PANEL
            </span>
          </div>
          <h2 
            className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Top 5 Fiduciary Solutions ({selectedIndustryLabel})
          </h2>
          <p className="text-xs text-white/70 mt-0.5">
            Strictly curated recommendation stack tailored to your trade, selected offerings, and relocation timeline.
          </p>
        </div>

        <div className="text-[11px] text-white/50 text-right shrink-0">
          <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#D4AF37] font-semibold">
            Zero Card Wall • Ranked 1 to 5
          </span>
        </div>
      </div>

      {/* TOP 5 CURATED STACK (NOT A GIANT CARD WALL) */}
      <div className="space-y-3">
        {recommendations.map((rec) => (
          <div
            key={rec.rank}
            className="p-4 rounded-2xl bg-[#111111] border border-white/10 hover:border-[#D4AF37]/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3.5 shadow-md group"
          >
            {/* Rank Number + Details */}
            <div className="flex items-start gap-3.5">
              {/* Rank Badge */}
              <div className="w-9 h-9 rounded-2xl bg-black border-2 border-[#D4AF37] text-[#D4AF37] font-black text-base flex items-center justify-center shrink-0 shadow-inner group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
                {rec.rank}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${rec.badgeColor}`}>
                    {rec.badge}
                  </span>
                  <span className="text-[10px] text-white/40 font-mono">
                    {rec.subtitle}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                  {rec.title}
                </h3>

                <p className="text-xs text-white/70 leading-relaxed max-w-2xl">
                  {rec.description}
                </p>

                <div className="text-[10.5px] text-emerald-400 font-medium flex items-center gap-1 pt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{rec.fiduciaryNote}</span>
                  {rec.phone && (
                    <span className="text-white/60 ml-2 font-mono flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#D4AF37]" /> {rec.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Trigger */}
            <div className="shrink-0 flex items-center gap-2 self-start md:self-center">
              {rec.actionUrl ? (
                <a
                  href={rec.actionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:brightness-110 text-black text-xs font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <span>{rec.actionLabel}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : rec.actionPath ? (
                <a
                  href={rec.actionPath}
                  className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:brightness-110 text-black text-xs font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <span>{rec.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={rec.onClick}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-[#D4AF37] hover:text-black border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <span>{rec.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}