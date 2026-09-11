import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  PhoneCall, Users, FileText, Database, ShieldAlert,
  Plus, CheckCircle, Clock, Calendar, Search, Filter,
  Phone, Building2, User, ArrowRight
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';

export default function AdminRelocationCallDesk() {
  const [activeTab, setActiveTab] = useState('pending_leads'); // pending_leads | batches | hr_calls | scripts
  const [selectedMarket, setSelectedMarket] = useState('all');

  // Fetch Pending Leads
  const { data: pendingLeads = [], isLoading: isLoadingLeads } = useQuery({
    queryKey: ['pendingLeads', selectedMarket],
    queryFn: async () => {
      const query = selectedMarket === 'all' ? {} : { market: selectedMarket };
      return await base44.entities.PendingLead.filter(query, '-created_date', 50).catch(() => []);
    },
  });

  // Fetch Lead List Batches
  const { data: batches = [], isLoading: isLoadingBatches } = useQuery({
    queryKey: ['leadListBatches'],
    queryFn: async () => {
      return await base44.entities.LeadListBatch.list('-created_date', 20).catch(() => []);
    },
  });

  // Fetch Relocation Agents (including Lisa Hurt)
  const { data: agents = [] } = useQuery({
    queryKey: ['relocationAgents'],
    queryFn: async () => {
      return await base44.entities.RelocationAgent.list('-created_date', 10).catch(() => []);
    },
  });

  // Fetch Scripts
  const { data: scripts = [] } = useQuery({
    queryKey: ['agentScripts'],
    queryFn: async () => {
      return await base44.entities.AgentScript.list('-created_date', 10).catch(() => []);
    },
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto text-left select-none">
      {/* Top Banner / Notice */}
      <div 
        className="p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #18140c 0%, #0a0a0a 100%)',
          borderColor: 'rgba(212,175,55,0.4)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black border border-[#D4AF37] flex items-center justify-center shrink-0 shadow-md">
            <PhoneCall className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Relocation Call Desk
              </h1>
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50">
                STEP 1 STUB ONLY • PREVIEW
              </span>
            </div>
            <p className="text-xs text-white/60 mt-0.5">
              Fiduciary listing lead tracking &amp; prospect call execution. Link &amp; button placeholders only.
            </p>
          </div>
        </div>

        {/* Assigned Relocation Agent Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs">
          <User className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-white/60">Lead Agent:</span>
          <span className="font-bold text-white">
            {agents.find(a => a.email === 'lisa@lisahurt.com')?.name || 'Lisa Hurt'}
          </span>
          <span className="text-[10px] text-[#10b981] font-bold">(Assigned)</span>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        {[
          { key: 'pending_leads', label: 'Pending Leads', count: pendingLeads.length },
          { key: 'batches', label: 'Lead List Batches', count: batches.length },
          { key: 'hr_calls', label: 'HR Prospect Calls' },
          { key: 'scripts', label: 'Agent Scripts', count: scripts.length },
        ].map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === tab.key
                ? 'bg-[#D4AF37] text-black shadow-md'
                : 'text-white/70 hover:text-white bg-white/5 border border-white/10'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeTab === tab.key ? 'bg-black text-[#D4AF37]' : 'bg-white/10 text-white/80'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: PENDING LEADS */}
      {activeTab === 'pending_leads' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-white/50 text-[11px] font-semibold flex items-center gap-1">
                <Filter className="w-3 h-3 text-[#D4AF37]" /> Market:
              </span>
              {['all', 'LA', 'SF_Bay', 'SD', 'other'].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedMarket(m)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    selectedMarket === m
                      ? 'bg-[#D4AF37] text-black'
                      : 'bg-black/50 text-white/70 border border-white/10 hover:border-white/30'
                  }`}
                >
                  {m.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Action Button Placeholders Only */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl bg-black border border-[#D4AF37]/50 text-[#D4AF37] hover:border-[#D4AF37] text-xs font-bold transition-all flex items-center gap-1.5 cursor-not-allowed opacity-80"
                title="Placeholder only — no MLS wiring"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Import Pending Leads (Placeholder)</span>
              </button>
            </div>
          </div>

          {/* Table / List View */}
          <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden shadow-xl">
            <div className="p-4 border-b border-white/10 flex items-center justify-between text-xs text-white/60">
              <span>Showing {pendingLeads.length} leads in queue</span>
              <span className="italic">Link/Button Placeholders Only • No Live MLS or SMS</span>
            </div>

            {pendingLeads.length === 0 ? (
              <div className="p-8 text-center text-white/50 space-y-2">
                <PhoneCall className="w-8 h-8 mx-auto text-[#D4AF37]/50" />
                <p className="text-sm font-medium">No pending leads currently in this market view.</p>
                <p className="text-xs text-white/40">
                  PendingLead schema is ready for record ingest.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/10 text-xs">
                {pendingLeads.map(lead => (
                  <div key={lead.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-white/5 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{lead.address}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                          {lead.market}
                        </span>
                        <span className="text-white/50 text-xs">({lead.city})</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-white/60 text-[11px]">
                        <span>Price: <strong className="text-white">${lead.list_price?.toLocaleString() || 'N/A'}</strong></span>
                        <span>Pending Date: {lead.pending_date || '—'}</span>
                        <span>Office: {lead.listing_office || '—'}</span>
                        <span>Agent: {lead.listing_agent_name || '—'}</span>
                        <span>Status: <strong className="uppercase text-[#10b981]">{lead.status || 'new'}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold cursor-not-allowed opacity-80"
                        title="Placeholder only — no phone dispatch"
                      >
                        Call Lead
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-xs font-bold cursor-not-allowed opacity-80"
                        title="Placeholder only"
                      >
                        Log Outcome
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: LEAD LIST BATCHES */}
      {activeTab === 'batches' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-white/60">
              Batch definitions and query parameters for pending relocation leads.
            </p>
            <button
              type="button"
              className="px-3 py-1.5 rounded-xl bg-black border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-bold cursor-not-allowed opacity-80"
              title="Placeholder only"
            >
              <Plus className="w-3.5 h-3.5 inline mr-1" />
              New Batch (Placeholder)
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden divide-y divide-white/10">
            {batches.length === 0 ? (
              <div className="p-8 text-center text-white/50 space-y-1">
                <Database className="w-8 h-8 mx-auto text-[#D4AF37]/50" />
                <p className="text-sm font-medium">No lead batches created yet.</p>
                <p className="text-xs text-white/40">LeadListBatch entity initialized.</p>
              </div>
            ) : (
              batches.map(b => (
                <div key={b.id} className="p-4 flex items-center justify-between text-xs">
                  <div>
                    <h3 className="font-bold text-white text-sm">{b.label}</h3>
                    <p className="text-white/60 text-[11px] mt-0.5">
                      Market: {b.market} • Min Price: ${b.min_price?.toLocaleString() || 0} • Window: {b.pending_window_days} days
                    </p>
                  </div>
                  <span className="text-white/40 text-[11px]">{b.list_date || '—'}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: HR PROSPECT CALLS */}
      {activeTab === 'hr_calls' && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl border border-white/10 bg-black/40 text-center space-y-2">
            <Building2 className="w-8 h-8 mx-auto text-[#D4AF37]/50" />
            <h3 className="text-sm font-bold text-white">HR Prospect Call Queue</h3>
            <p className="text-xs text-white/60 max-w-md mx-auto">
              HrProspectCall entity is initialized. Placeholder controls only; direct calling and logging workflows will connect here.
            </p>
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-bold text-xs cursor-not-allowed opacity-75 mt-2"
              title="Placeholder only"
            >
              Log HR Call (Placeholder)
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: AGENT SCRIPTS */}
      {activeTab === 'scripts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-[#D4AF37]/40 bg-black/40 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#D4AF37]">Pending Listing Script (pending_listing)</h3>
                <span className="text-[9px] font-black uppercase bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded">Active</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed italic bg-black/60 p-3 rounded-xl border border-white/10">
                "Hello, I am calling from Dyson &amp; Dyson Relocation Services. We noticed your property recently went into pending escrow and wanted to verify if your clients require fiduciary relocation concierge services for their destination market."
              </p>
              <div className="text-[10px] text-white/40 flex justify-between">
                <span>Version: 2026-09-11</span>
                <span>AgentScript Entity</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-[#D4AF37]/40 bg-black/40 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#D4AF37]">Corporate HR Relocation Script (hr)</h3>
                <span className="text-[9px] font-black uppercase bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded">Active</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed italic bg-black/60 p-3 rounded-xl border border-white/10">
                "Good morning, this is the Dyson &amp; Dyson Corporate Relocation Desk. We assist human resource executives with comprehensive executive talent onboarding and employee home transition logistics across all 50 states."
              </p>
              <div className="text-[10px] text-white/40 flex justify-between">
                <span>Version: 2026-09-11</span>
                <span>AgentScript Entity</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}