import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  PhoneCall, Users, FileText, Database, ShieldAlert,
  Plus, CheckCircle, Clock, Calendar, Search, Filter,
  Phone, Building2, User, ArrowRight, Lock, FileSpreadsheet,
  UserCheck, LayoutDashboard, BookOpen, BarChart3, ShieldCheck,
  CheckCircle2, AlertCircle, ChevronDown, Sparkles
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import LisaAssignedLeadsTable from '@/components/admin/reloCallDesk/LisaAssignedLeadsTable';

const GOLD = '#D4AF37';

export default function RelocationAgentDesk() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedMarket, setSelectedMarket] = useState('all');
  const [activeTab, setActiveTab] = useState('call_board'); // call_board | scripts | outcomes
  const [selectedLeadForCall, setSelectedLeadForCall] = useState(null);
  const [outcomeForm, setOutcomeForm] = useState({
    outcome: 'connected',
    notes: '',
    follow_up_date: '',
    open_referral: false,
    update_status: 'called',
  });
  const [submittingOutcome, setSubmittingOutcome] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch Relocation Agent Profile (Lisa Hurt)
  const { data: agents = [] } = useQuery({
    queryKey: ['relocationAgents'],
    queryFn: async () => {
      return await base44.entities.RelocationAgent.list('-created_date', 10).catch(() => []);
    },
  });

  const currentAgent = agents.find(a => a.email === 'lisa@lisahurt.com') || {
    name: 'Lisa Hurt',
    email: 'lisa@lisahurt.com',
    brokerage: 'The Dyson & Dyson Companies',
    city: 'San Diego / Los Angeles',
    status: 'Relocation Agent',
  };

  // Fetch Batches to find Lisa's latest or today's batch
  const { data: batches = [] } = useQuery({
    queryKey: ['agentBatchesView'],
    queryFn: async () => {
      return await base44.entities.LeadListBatch.list('-created_date', 50).catch(() => []);
    },
  });

  // Fetch Pending Leads
  const { data: allPendingLeads = [], isLoading: isLoadingLeads } = useQuery({
    queryKey: ['pendingLeadsAgentView'],
    queryFn: async () => {
      return await base44.entities.PendingLead.list('-created_date', 150).catch(() => []);
    },
  });

  // Find Lisa's assigned batch for today or latest assigned batch
  const today = new Date().toISOString().slice(0, 10);
  const lisaBatches = React.useMemo(() => {
    return batches.filter(b => 
      b.assigned_agent?.toLowerCase().includes('lisa') ||
      b.assigned_email?.toLowerCase() === 'lisa@lisahurt.com' ||
      b.assigned_relocation_agent === currentAgent.id
    ).sort((a, b) => {
      const aToday = a.list_date === today || a.created_date?.startsWith(today);
      const bToday = b.list_date === today || b.created_date?.startsWith(today);
      if (aToday && !bToday) return -1;
      if (!aToday && bToday) return 1;
      return new Date(b.created_date || b.list_date || 0) - new Date(a.created_date || a.list_date || 0);
    });
  }, [batches, today, currentAgent.id]);

  const latestAssignedBatch = lisaBatches[0] || null;

  // Filter Lisa's assigned PendingLead for today or latest assigned batch
  const assignedToLisa = React.useMemo(() => {
    if (!allPendingLeads || allPendingLeads.length === 0) return [];

    let pool = [];
    if (latestAssignedBatch) {
      pool = allPendingLeads.filter(l => 
        l.batch_id === latestAssignedBatch.id &&
        (l.assigned_agent?.toLowerCase().includes('lisa') ||
         l.assigned_email?.toLowerCase() === 'lisa@lisahurt.com' ||
         l.assigned_relocation_agent === currentAgent.id ||
         !l.assigned_agent)
      );
    }

    if (pool.length === 0) {
      pool = allPendingLeads.filter(l => 
        l.assigned_email?.toLowerCase() === 'lisa@lisahurt.com' ||
        l.assigned_agent?.toLowerCase().includes('lisa') ||
        l.assigned_relocation_agent === currentAgent.id
      );
    }

    if (selectedMarket !== 'all') {
      return pool.filter(l => l.market === selectedMarket);
    }
    return pool;
  }, [allPendingLeads, latestAssignedBatch, selectedMarket, currentAgent.id]);

  // Fetch Scripts
  const { data: scripts = [] } = useQuery({
    queryKey: ['agentScriptsAgentView'],
    queryFn: async () => {
      return await base44.entities.AgentScript.list('-created_date', 10).catch(() => []);
    },
  });

  // Fetch recent call outcomes
  const { data: recentOutcomes = [] } = useQuery({
    queryKey: ['callOutcomesAgentView'],
    queryFn: async () => {
      return await base44.entities.CallOutcome.list('-created_date', 20).catch(() => []);
    },
  });

  const handleOpenCallModal = (lead) => {
    setSelectedLeadForCall(lead);
    setOutcomeForm({
      outcome: 'connected',
      notes: '',
      follow_up_date: '',
      open_referral: false,
      update_status: 'called',
    });
  };

  const handleSaveOutcome = async (e) => {
    e.preventDefault();
    if (!selectedLeadForCall) return;
    setSubmittingOutcome(true);
    try {
      // 1. Record call outcome
      await base44.entities.CallOutcome.create({
        pending_lead: selectedLeadForCall.id,
        called_by: user?.full_name || currentAgent.name || 'Lisa Hurt',
        called_at: new Date().toISOString(),
        outcome: outcomeForm.outcome,
        notes: outcomeForm.notes,
        follow_up_date: outcomeForm.follow_up_date || undefined,
        open_referral: outcomeForm.open_referral,
      });

      // 2. Update lead status if selected
      if (outcomeForm.update_status) {
        await base44.entities.PendingLead.update(selectedLeadForCall.id, {
          status: outcomeForm.update_status,
        });
      }

      setSuccessMessage(`Logged outcome for ${selectedLeadForCall.address}`);
      setTimeout(() => setSuccessMessage(null), 3000);
      setSelectedLeadForCall(null);
      queryClient.invalidateQueries({ queryKey: ['pendingLeadsAgentView'] });
      queryClient.invalidateQueries({ queryKey: ['callOutcomesAgentView'] });
    } catch (err) {
      console.error('Failed to log outcome:', err);
    } finally {
      setSubmittingOutcome(false);
    }
  };

  const handleQuickStatusChange = async (leadId, newStatus) => {
    try {
      await base44.entities.PendingLead.update(leadId, { status: newStatus });
      queryClient.invalidateQueries({ queryKey: ['pendingLeadsAgentView'] });
      setSuccessMessage(`Updated lead status to "${newStatus.replace('_', ' ').toUpperCase()}"`);
      setTimeout(() => setSuccessMessage(null), 2500);
    } catch (err) {
      console.error('Failed to update lead status:', err);
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto space-y-6 text-left select-none">
      {/* Top Banner: Relocation Agent Identification & Working Board Header */}
      <div 
        className="p-5 sm:p-6 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #18140c 0%, #0a0a0a 100%)',
          borderColor: 'rgba(212,175,55,0.45)',
          boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
        }}
      >
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-black border-2 border-[#D4AF37] flex items-center justify-center shrink-0 shadow-lg">
            <PhoneCall className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Relocation Agent Working Board
              </h1>
              <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-black font-sans">
                DAILY CALL DESK
              </span>
            </div>
            <p className="text-xs text-white/70 mt-1">
              Fiduciary listing lead tracking &amp; prospect call execution • Dedicated relocation desk
            </p>
          </div>
        </div>

        {/* Assigned Agent Profile Badge */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-black/80 border border-[#D4AF37]/40 text-xs">
            <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-black">
              LH
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-white">{currentAgent.name}</span>
                <span className="text-[9px] font-bold text-[#10b981] bg-[#10b981]/20 px-1.5 py-0.2 rounded-full">
                  Assigned Agent
                </span>
              </div>
              <span className="text-[10px] text-white/50 block font-mono">{currentAgent.email}</span>
            </div>
          </div>

          {user?.role === 'admin' && (
            <Link
              to="/admin/relocation-call-desk"
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/20 text-[#D4AF37] text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
              title="Open full admin console view"
            >
              Admin Master View →
            </Link>
          )}
        </div>
      </div>

      {/* SUCCESS FLASH */}
      {successMessage && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* OPERATIONAL GOVERNANCE & BOUNDARIES */}
      <div 
        className="p-4 rounded-2xl border space-y-3 shadow-md"
        style={{
          background: '#0d0d0d',
          borderColor: 'rgba(212,175,55,0.3)',
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2 border-b border-white/10">
          <div>
            <div className="text-[9.5px] font-black uppercase tracking-widest text-[#D4AF37]">
              GOVERNANCE MANDATE &amp; OPERATIONAL RULES
            </div>
            <p className="text-xs sm:text-sm font-semibold text-white/90 mt-0.5">
              Daily verified $2M+ pending listing calls for assigned relocation agents. Strict separation from referral agents.
            </p>
          </div>
        </div>

        {/* 3 Dedicated Lock Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black border border-amber-500/60 text-amber-400 text-xs font-bold shadow-sm">
            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>No blast email/SMS</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black border border-[#D4AF37] text-[#D4AF37] text-xs font-bold shadow-sm">
            <Lock className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span>Relocation agent ≠ referral agent</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black border border-sky-500/60 text-sky-400 text-xs font-bold shadow-sm">
            <Lock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>Manual import until MLS feed</span>
          </div>
        </div>
      </div>

      {/* METRIC STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#0a0a0a] border border-[#D4AF37]/30 text-left">
          <div className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Lisa's Assigned Leads</div>
          <div className="text-2xl font-black text-white mt-1">{assignedToLisa.length}</div>
          <div className="text-[10px] text-[#D4AF37] mt-0.5 font-medium">
            {latestAssignedBatch ? (latestAssignedBatch.list_date === today ? "Today's Batch" : latestAssignedBatch.label) : 'Assigned queue'}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0a0a0a] border border-[#D4AF37]/30 text-left">
          <div className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Outcomes Logged</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{recentOutcomes.length}</div>
          <div className="text-[10px] text-white/40 mt-0.5 font-medium">Recorded calls</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0a0a0a] border border-[#D4AF37]/30 text-left">
          <div className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Assigned Markets</div>
          <div className="text-2xl font-black text-white mt-1">3</div>
          <div className="text-[10px] text-white/40 mt-0.5 font-medium">LA • SF Bay • SD</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0a0a0a] border border-[#D4AF37]/30 text-left">
          <div className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Active Scripts</div>
          <div className="text-2xl font-black text-[#D4AF37] mt-1">{scripts.length || 2}</div>
          <div className="text-[10px] text-white/40 mt-0.5 font-medium">Pending + HR ready</div>
        </div>
      </div>

      {/* TABS ROW */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        {[
          { key: 'call_board', label: 'Daily Call Queue', count: assignedToLisa.length },
          { key: 'scripts', label: 'Relocation Scripts', count: scripts.length || 2 },
          { key: 'outcomes', label: 'Call Log History', count: recentOutcomes.length },
        ].map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === tab.key
                ? 'bg-[#D4AF37] text-black shadow-lg font-black'
                : 'text-white/70 hover:text-white bg-black/60 border border-white/10'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === tab.key ? 'bg-black text-[#D4AF37]' : 'bg-white/10 text-white/80'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: DAILY CALL BOARD */}
      {activeTab === 'call_board' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-white/50 text-[11px] font-semibold flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-[#D4AF37]" /> Market:
              </span>
              {['all', 'LA', 'SF_Bay', 'SD', 'other'].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedMarket(m)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    selectedMarket === m
                      ? 'bg-[#D4AF37] text-black font-black'
                      : 'bg-black/60 text-white/70 border border-white/10 hover:border-white/30'
                  }`}
                >
                  {m.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="text-xs text-white/50 italic">
              Lisa Hurt Calling Board • Fiduciary 1-on-1 calls only • No blast email/SMS
            </div>
          </div>

          {/* Lisa's Assigned Leads Table with Exact Empty State */}
          <LisaAssignedLeadsTable
            leads={assignedToLisa}
            activeBatch={latestAssignedBatch}
            isLoading={isLoadingLeads}
            onOpenCallModal={handleOpenCallModal}
            onQuickStatusChange={handleQuickStatusChange}
          />
        </div>
      )}

      {/* TAB 2: RELOCATION SCRIPTS */}
      {activeTab === 'scripts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 rounded-3xl border border-[#D4AF37]/40 bg-[#0a0a0a] space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[9px] font-black uppercase text-[#D4AF37] tracking-widest block">Script 1</span>
                <h3 className="text-base font-bold text-white">Pending Listing Inquiry Script</h3>
              </div>
              <span className="text-[9px] font-black uppercase bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded">Active</span>
            </div>

            <p className="text-xs text-white/90 leading-relaxed italic bg-black/60 p-4 rounded-2xl border border-white/10">
              "Hello, I am calling from Dyson &amp; Dyson Relocation Services. We noticed your property recently went into pending escrow and wanted to verify if your clients require fiduciary relocation concierge services for their destination market."
            </p>

            <div className="space-y-1.5 text-xs text-white/60 pt-2 border-t border-white/10">
              <p className="font-bold text-white">Key Talk Tracks:</p>
              <ul className="list-disc pl-4 space-y-1 text-[11px]">
                <li>Confirm whether sellers are moving out-of-area or purchasing locally.</li>
                <li>Offer zero-fee fiduciary destination concierge to protect their transition.</li>
                <li>Highlight 25% co-op protection if referred through our affiliate desk.</li>
              </ul>
            </div>
          </div>

          <div className="p-5 rounded-3xl border border-[#D4AF37]/40 bg-[#0a0a0a] space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[9px] font-black uppercase text-[#D4AF37] tracking-widest block">Script 2</span>
                <h3 className="text-base font-bold text-white">Corporate HR Relocation Script</h3>
              </div>
              <span className="text-[9px] font-black uppercase bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded">Active</span>
            </div>

            <p className="text-xs text-white/90 leading-relaxed italic bg-black/60 p-4 rounded-2xl border border-white/10">
              "Good morning, this is the Dyson &amp; Dyson Corporate Relocation Desk. We assist human resource executives with comprehensive executive talent onboarding and employee home transition logistics across all 50 states."
            </p>

            <div className="space-y-1.5 text-xs text-white/60 pt-2 border-t border-white/10">
              <p className="font-bold text-white">Key Talk Tracks:</p>
              <ul className="list-disc pl-4 space-y-1 text-[11px]">
                <li>Zero-cost employer relocation management suite.</li>
                <li>Complete home search, vetted top 1% local agents, moving logistics.</li>
                <li>Direct access to Charlie Simmons Voice Concierge for transferees.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OUTCOME HISTORY */}
      {activeTab === 'outcomes' && (
        <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-bold text-white text-base">Recorded Call Outcomes</h3>
            <span className="text-xs text-white/50">{recentOutcomes.length} total calls recorded</span>
          </div>

          {recentOutcomes.length === 0 ? (
            <div className="p-8 text-center text-white/40 text-xs">
              No call outcomes logged yet. Use "Log Outcome" on the call queue board to record conversations.
            </div>
          ) : (
            <div className="divide-y divide-white/10 text-xs">
              {recentOutcomes.map(rec => (
                <div key={rec.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white capitalize">{rec.outcome}</span>
                      {rec.open_referral && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-400">
                          Open Referral
                        </span>
                      )}
                    </div>
                    <p className="text-white/60 text-[11px] mt-0.5">{rec.notes || 'No notes added.'}</p>
                  </div>
                  <div className="text-[10px] text-white/40 text-right">
                    <div>{rec.called_by}</div>
                    <div>{rec.called_at ? new Date(rec.called_at).toLocaleString() : '—'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: LOG OUTCOME */}
      {selectedLeadForCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-[#0a0a0a] border-2 border-[#D4AF37] p-6 shadow-2xl text-left space-y-4">
            <div className="flex items-start justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                  Log Call Outcome
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {selectedLeadForCall.address}
                </h3>
                <p className="text-xs text-white/60">
                  {selectedLeadForCall.city} • {selectedLeadForCall.listing_agent_name || 'Agent'} ({selectedLeadForCall.listing_office || 'Office'})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLeadForCall(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveOutcome} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block mb-1">
                  Call Result / Outcome *
                </label>
                <select
                  value={outcomeForm.outcome}
                  onChange={e => setOutcomeForm({ ...outcomeForm, outcome: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="connected">Connected / Spoke with Agent</option>
                  <option value="voicemail">Left Voicemail</option>
                  <option value="callback">Scheduled Callback</option>
                  <option value="no_answer">No Answer</option>
                  <option value="wrong_number">Wrong Number</option>
                  <option value="do_not_call">Do Not Call</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block mb-1">
                  Lead Status Update
                </label>
                <select
                  value={outcomeForm.update_status}
                  onChange={e => setOutcomeForm({ ...outcomeForm, update_status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="called">Called</option>
                  <option value="yes_moving">Yes - Confirmed Moving / Relocating</option>
                  <option value="callback">Callback Scheduled</option>
                  <option value="no">Not Relocating / Closed</option>
                  <option value="wrong_number">Wrong Number</option>
                  <option value="do_not_call">Do Not Call</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block mb-1">
                  Conversation Notes
                </label>
                <textarea
                  rows={3}
                  value={outcomeForm.notes}
                  onChange={e => setOutcomeForm({ ...outcomeForm, notes: e.target.value })}
                  placeholder="Details of the conversation, destination city, client requirements..."
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white focus:outline-none focus:border-[#D4AF37] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block mb-1">
                    Follow-Up Date
                  </label>
                  <input
                    type="date"
                    value={outcomeForm.follow_up_date}
                    onChange={e => setOutcomeForm({ ...outcomeForm, follow_up_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="open_referral_check"
                    checked={outcomeForm.open_referral}
                    onChange={e => setOutcomeForm({ ...outcomeForm, open_referral: e.target.checked })}
                    className="w-4 h-4 accent-[#D4AF37]"
                  />
                  <label htmlFor="open_referral_check" className="text-white font-semibold cursor-pointer">
                    Open Referral Opportunity
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedLeadForCall(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingOutcome}
                  className="px-5 py-2 rounded-xl bg-[#D4AF37] text-black font-black hover:brightness-110 cursor-pointer disabled:opacity-50"
                >
                  {submittingOutcome ? 'Saving...' : 'Save Call Outcome'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}