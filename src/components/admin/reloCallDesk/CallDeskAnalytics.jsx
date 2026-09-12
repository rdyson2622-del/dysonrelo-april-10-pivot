import React from 'react';
import { PhoneCall, Building2 } from 'lucide-react';

export default function CallDeskAnalytics({ pendingLeads = [], callOutcomes = [], hrCalls = [] }) {
  // Pending leads metrics
  const totalLeads = pendingLeads.length;
  const calledLeads = pendingLeads.filter(l => l.status !== 'new').length;
  const callbacks = pendingLeads.filter(l => l.status === 'callback').length;
  const yesMoving = pendingLeads.filter(l => l.status === 'yes_moving').length;
  const openReferrals = callOutcomes.filter(o => o.open_referral).length;

  const totalVolume = pendingLeads.reduce((acc, l) => acc + (l.list_price || 0), 0);
  const avgPrice = totalLeads > 0 ? Math.round(totalVolume / totalLeads) : 0;

  // HR metrics
  const totalHr = hrCalls.length;
  const connectedHr = hrCalls.filter(h => h.outcome === 'connected' || h.outcome === 'interested_reviewing' || h.outcome === 'scheduled_demo').length;
  const hrConnectRate = totalHr > 0 ? Math.round((connectedHr / totalHr) * 100) : 0;

  return (
    <div className="space-y-6 text-left">
      {/* Overview Banner */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
            STAGE 4 SPLIT PERFORMANCE TELEMETRY
          </span>
          <h3 className="text-lg font-bold text-white mt-0.5">
            Pending Listing Pipeline vs HR Corporate Inquiries
          </h3>
        </div>
        <div className="text-xs text-white/50">
          Independent Tracking Mandate Active
        </div>
      </div>

      {/* TRACK 1: PENDING LISTING CALL DESK */}
      <div className="p-5 rounded-3xl bg-[#0a0a0a] border border-[#D4AF37]/40 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-black border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Track A: $2M+ Pending Listing Operations</h4>
              <p className="text-[11px] text-white/50">Fiduciary inquiries conducted by relocation agents (Lisa Hurt)</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
            Pending Leads
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
            <div className="text-[10px] text-white/40 uppercase font-bold">Total Ingested</div>
            <div className="text-xl font-black text-white mt-0.5">{totalLeads}</div>
            <div className="text-[10px] text-[#D4AF37] mt-0.5">Avg ${(avgPrice / 1000000).toFixed(1)}M</div>
          </div>

          <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
            <div className="text-[10px] text-white/40 uppercase font-bold">Calls Placed</div>
            <div className="text-xl font-black text-white mt-0.5">{calledLeads}</div>
            <div className="text-[10px] text-white/50 mt-0.5">
              {totalLeads > 0 ? Math.round((calledLeads / totalLeads) * 100) : 0}% worked
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
            <div className="text-[10px] text-white/40 uppercase font-bold">Callbacks Set</div>
            <div className="text-xl font-black text-sky-400 mt-0.5">{callbacks}</div>
            <div className="text-[10px] text-white/50 mt-0.5">In follow-up</div>
          </div>

          <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
            <div className="text-[10px] text-white/40 uppercase font-bold">Confirmed Relo</div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">{yesMoving}</div>
            <div className="text-[10px] text-emerald-400/80 mt-0.5">Yes - Moving</div>
          </div>

          <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
            <div className="text-[10px] text-white/40 uppercase font-bold">Open Referrals</div>
            <div className="text-xl font-black text-[#D4AF37] mt-0.5">{openReferrals}</div>
            <div className="text-[10px] text-[#D4AF37]/80 mt-0.5">25% Co-Op ops</div>
          </div>

          <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
            <div className="text-[10px] text-white/40 uppercase font-bold">Logged Outcomes</div>
            <div className="text-xl font-black text-white mt-0.5">{callOutcomes.length}</div>
            <div className="text-[10px] text-white/50 mt-0.5">Audit history</div>
          </div>
        </div>
      </div>

      {/* TRACK 2: CORPORATE HR PROSPECTING */}
      <div className="p-5 rounded-3xl bg-[#0a0a0a] border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-black border border-white/30 flex items-center justify-center text-white">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Track B: Corporate HR Talent Onboarding Calls</h4>
              <p className="text-[11px] text-white/50">Executive relocation management outreach to corporate decision makers</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-white/10 text-white/80 border border-white/20">
            HR Prospects
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
            <div className="text-[10px] text-white/40 uppercase font-bold">HR Calls Placed</div>
            <div className="text-xl font-black text-white mt-0.5">{totalHr}</div>
            <div className="text-[10px] text-white/50 mt-0.5">Logged calls</div>
          </div>

          <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
            <div className="text-[10px] text-white/40 uppercase font-bold">Connected Rate</div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">{hrConnectRate}%</div>
            <div className="text-[10px] text-white/50 mt-0.5">{connectedHr} connected</div>
          </div>

          <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
            <div className="text-[10px] text-white/40 uppercase font-bold">Demos Scheduled</div>
            <div className="text-xl font-black text-[#D4AF37] mt-0.5">
              {hrCalls.filter(h => h.outcome === 'scheduled_demo').length}
            </div>
            <div className="text-[10px] text-[#D4AF37]/80 mt-0.5">Executive Suite</div>
          </div>

          <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
            <div className="text-[10px] text-white/40 uppercase font-bold">Corporate Review</div>
            <div className="text-xl font-black text-white mt-0.5">
              {hrCalls.filter(h => h.outcome === 'interested_reviewing').length}
            </div>
            <div className="text-[10px] text-white/50 mt-0.5">In consideration</div>
          </div>
        </div>
      </div>
    </div>
  );
}