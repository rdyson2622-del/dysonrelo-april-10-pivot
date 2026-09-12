import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, Search, Filter, Phone, Database, Building2,
  CheckCircle2, Edit2, UserCheck
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import CharliePagePresenter from '@/components/charlie/CharliePagePresenter';
import AdminDeskHeader from '@/components/admin/reloCallDesk/AdminDeskHeader';
import WorkflowModuleCards from '@/components/admin/reloCallDesk/WorkflowModuleCards';
import PendingLeadImportModal from '@/components/admin/reloCallDesk/PendingLeadImportModal';
import AssignBatchModal from '@/components/admin/reloCallDesk/AssignBatchModal';
import LogHrCallModal from '@/components/admin/reloCallDesk/LogHrCallModal';
import CallDeskAnalytics from '@/components/admin/reloCallDesk/CallDeskAnalytics';
import OutcomeModal from '@/components/admin/reloCallDesk/OutcomeModal';

export default function AdminRelocationCallDesk() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('pending_leads'); // pending_leads | batches | hr_calls | scripts | analytics
  const [selectedMarket, setSelectedMarket] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isAssignBatchOpen, setIsAssignBatchOpen] = useState(false);
  const [isLogHrOpen, setIsLogHrOpen] = useState(false);
  const [selectedLeadForOutcome, setSelectedLeadForOutcome] = useState(null);
  const [editingScriptId, setEditingScriptId] = useState(null);
  const [editingScriptBody, setEditingScriptBody] = useState('');
  const [flashMessage, setFlashMessage] = useState(null);

  // Queries
  const { data: pendingLeads = [] } = useQuery({
    queryKey: ['adminPendingLeads', selectedMarket],
    queryFn: async () => {
      const query = selectedMarket === 'all' ? {} : { market: selectedMarket };
      return await base44.entities.PendingLead.filter(query, '-created_date', 100).catch(() => []);
    },
  });

  const { data: batches = [] } = useQuery({
    queryKey: ['adminLeadListBatches'],
    queryFn: async () => {
      return await base44.entities.LeadListBatch.list('-created_date', 50).catch(() => []);
    },
  });

  const { data: agents = [] } = useQuery({
    queryKey: ['adminRelocationAgents'],
    queryFn: async () => {
      return await base44.entities.RelocationAgent.list('-created_date', 10).catch(() => []);
    },
  });

  const { data: scripts = [] } = useQuery({
    queryKey: ['adminAgentScripts'],
    queryFn: async () => {
      return await base44.entities.AgentScript.list('-created_date', 10).catch(() => []);
    },
  });

  const { data: callOutcomes = [] } = useQuery({
    queryKey: ['adminCallOutcomes'],
    queryFn: async () => {
      return await base44.entities.CallOutcome.list('-created_date', 50).catch(() => []);
    },
  });

  const { data: hrCalls = [] } = useQuery({
    queryKey: ['adminHrProspectCalls'],
    queryFn: async () => {
      return await base44.entities.HrProspectCall.list('-created_date', 50).catch(() => []);
    },
  });

  const leadAgent = agents.find(a => a.email === 'lisa@lisahurt.com') || agents[0] || {
    name: 'Lisa Hurt',
    email: 'lisa@lisahurt.com',
  };

  const handleSaveScript = async (scriptId) => {
    try {
      await base44.entities.AgentScript.update(scriptId, {
        body: editingScriptBody,
        version_date: new Date().toISOString().slice(0, 10),
      });
      setEditingScriptId(null);
      queryClient.invalidateQueries({ queryKey: ['adminAgentScripts'] });
      setFlashMessage('Script updated successfully in database');
      setTimeout(() => setFlashMessage(null), 3000);
    } catch (err) {
      console.error('Failed to update script:', err);
    }
  };

  const filteredLeads = pendingLeads.filter(l => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      l.address?.toLowerCase().includes(q) ||
      l.city?.toLowerCase().includes(q) ||
      l.listing_agent_name?.toLowerCase().includes(q) ||
      l.listing_office?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto text-left select-none">
      {/* Top Banner, Agent Pill & Operational Governance Lock Badges */}
      <AdminDeskHeader leadAgent={leadAgent} />

      {/* FLASH MESSAGE */}
      {flashMessage && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{flashMessage}</span>
        </div>
      )}

      {/* REPLACED COMING NEXT: WORKING 5 OPERATIONAL MODULE CARDS */}
      <WorkflowModuleCards
        onOpenImport={() => setIsImportOpen(true)}
        onOpenAssignBatch={() => setIsAssignBatchOpen(true)}
        onSelectTab={(tab) => setActiveTab(tab)}
        pendingCount={pendingLeads.length}
        scriptsCount={scripts.length || 2}
      />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        {[
          { key: 'pending_leads', label: 'Pending Leads', count: pendingLeads.length },
          { key: 'batches', label: 'Lead List Batches', count: batches.length },
          { key: 'hr_calls', label: 'HR Prospect Calls', count: hrCalls.length },
          { key: 'scripts', label: 'Agent Scripts', count: scripts.length || 2 },
          { key: 'analytics', label: 'Split Telemetry' },
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
            <div className="flex flex-wrap items-center gap-2 text-xs">
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
                      ? 'bg-[#D4AF37] text-black font-black'
                      : 'bg-black/50 text-white/70 border border-white/10 hover:border-white/30'
                  }`}
                >
                  {m.toUpperCase()}
                </button>
              ))}

              <div className="relative ml-1">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search address, agent, office..."
                  className="pl-8 pr-3 py-1 rounded-lg bg-black/60 border border-white/10 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37] w-48 sm:w-60"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsImportOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Import Pending Leads</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAssignBatchOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-black border border-[#D4AF37]/50 text-[#D4AF37] hover:border-[#D4AF37] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Assign Batch</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden shadow-xl">
            <div className="p-4 border-b border-white/10 flex items-center justify-between text-xs text-white/60">
              <span>Showing {filteredLeads.length} leads in queue</span>
              <span className="text-[#D4AF37]">Click "Log Outcome" to record call telemetry</span>
            </div>

            {filteredLeads.length === 0 ? (
              <div className="p-8 text-center text-white/50 space-y-2">
                <p className="text-sm font-medium">No pending leads found matching your criteria.</p>
                <p className="text-xs text-white/40">
                  Click "Import Pending Leads" above to load today's batch.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/10 text-xs">
                {filteredLeads.map(lead => (
                  <div key={lead.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-white/5 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
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
                      {lead.listing_agent_phone && (
                        <div className="text-[11px] text-white/50 flex items-center gap-1.5 pt-0.5">
                          <Phone className="w-3 h-3 text-[#D4AF37]" />
                          <span>Phone: <strong className="text-white">{lead.listing_agent_phone}</strong></span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {lead.listing_agent_phone && (
                        <a
                          href={`tel:${lead.listing_agent_phone}`}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 text-xs font-bold transition-all flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call</span>
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => setSelectedLeadForOutcome(lead)}
                        className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer"
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
              Allocated batches for relocation agents (LeadListBatch).
            </p>
            <button
              type="button"
              onClick={() => setIsAssignBatchOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#D4AF37] text-black text-xs font-bold hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Assign Batch to Agent</span>
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden divide-y divide-white/10">
            {batches.length === 0 ? (
              <div className="p-8 text-center text-white/50 space-y-1">
                <Database className="w-8 h-8 mx-auto text-[#D4AF37]/50" />
                <p className="text-sm font-medium">No lead batches created yet.</p>
                <p className="text-xs text-white/40">Use "Create New Batch" to define an allocation.</p>
              </div>
            ) : (
              batches.map(b => (
                <div key={b.id} className="p-4 flex items-center justify-between text-xs hover:bg-white/5 transition-colors">
                  <div>
                    <h3 className="font-bold text-white text-sm">{b.label}</h3>
                    <p className="text-white/60 text-[11px] mt-0.5">
                      Market: {b.market} • Min Price: ${b.min_price?.toLocaleString() || '2,000,000'} • Window: {b.pending_window_days} days
                    </p>
                    {b.notes && <p className="text-white/40 text-[10px] mt-1">{b.notes}</p>}
                  </div>
                  <div className="text-right">
                    <span className="text-white/40 text-[11px] block">{b.list_date || '—'}</span>
                    <span className="text-[10px] text-[#D4AF37] font-semibold">Assigned: Lisa Hurt</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: HR PROSPECT CALLS */}
      {activeTab === 'hr_calls' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Corporate HR Talent Inquiries Queue</h3>
              <p className="text-xs text-white/60">
                Track B: Fiduciary corporate employer outreach logged in HrProspectCall.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsLogHrOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs hover:brightness-110 cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log HR Call</span>
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden divide-y divide-white/10">
            {hrCalls.length === 0 ? (
              <div className="p-10 text-center text-white/50 space-y-2">
                <Building2 className="w-8 h-8 mx-auto text-[#D4AF37]/50" />
                <p className="text-sm font-medium">No HR prospect calls recorded yet.</p>
                <p className="text-xs text-white/40">
                  Click "Log HR Call" to record employer talent onboarding conversations.
                </p>
              </div>
            ) : (
              hrCalls.map(hr => (
                <div key={hr.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-2 hover:bg-white/5 transition-colors text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{hr.company}</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                        {hr.outcome}
                      </span>
                    </div>
                    <p className="text-white/60 text-[11px] mt-0.5">
                      Contact: {hr.contact_name || 'HR Executive'} • {hr.title || 'Director'} • {hr.phone || 'No phone'}
                    </p>
                    {hr.notes && <p className="text-white/50 text-[11px] mt-1 italic">"{hr.notes}"</p>}
                  </div>
                  <div className="text-right text-[10px] text-white/40">
                    <div>Called by: {hr.called_by || 'Lisa Hurt'}</div>
                    <div>{hr.called_at ? new Date(hr.called_at).toLocaleDateString() : '—'}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: AGENT SCRIPTS */}
      {activeTab === 'scripts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Live Script Management (AgentScript)</h3>
              <p className="text-xs text-white/60">
                Fiduciary talk tracks synchronized live with the Relocation Agent Desk.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scripts.map(s => (
              <div key={s.id} className="p-4 rounded-2xl border border-[#D4AF37]/40 bg-black/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#D4AF37] block">
                      {s.script_key}
                    </span>
                    <h3 className="text-sm font-bold text-white">{s.title}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (editingScriptId === s.id) {
                        setEditingScriptId(null);
                      } else {
                        setEditingScriptId(s.id);
                        setEditingScriptBody(s.body);
                      }
                    }}
                    className="flex items-center gap-1 text-[10px] font-bold text-[#D4AF37] hover:underline cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>{editingScriptId === s.id ? 'Cancel' : 'Edit Script'}</span>
                  </button>
                </div>

                {editingScriptId === s.id ? (
                  <div className="space-y-2">
                    <textarea
                      rows={5}
                      value={editingScriptBody}
                      onChange={e => setEditingScriptBody(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black border border-[#D4AF37] text-white text-xs leading-relaxed focus:outline-none"
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleSaveScript(s.id)}
                        className="px-3 py-1 rounded-lg bg-[#D4AF37] text-black font-black text-xs hover:brightness-110 cursor-pointer"
                      >
                        Save Script Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-white/90 leading-relaxed italic bg-black/60 p-3 rounded-xl border border-white/10">
                    "{s.body}"
                  </p>
                )}

                <div className="text-[10px] text-white/40 flex justify-between pt-1 border-t border-white/10">
                  <span>Version Date: {s.version_date || '2026-09-12'}</span>
                  <span className="text-[#10b981] font-bold">Active in Agent Desk</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SPLIT ANALYTICS */}
      {activeTab === 'analytics' && (
        <CallDeskAnalytics
          pendingLeads={pendingLeads}
          callOutcomes={callOutcomes}
          hrCalls={hrCalls}
        />
      )}

      {/* MODALS */}
      <OutcomeModal
        isOpen={Boolean(selectedLeadForOutcome)}
        lead={selectedLeadForOutcome}
        callerName="Admin / Relocation Desk"
        onClose={() => setSelectedLeadForOutcome(null)}
        onSaveSuccess={() => {
          setFlashMessage(`Recorded outcome for ${selectedLeadForOutcome?.address}`);
          setTimeout(() => setFlashMessage(null), 3500);
          queryClient.invalidateQueries({ queryKey: ['adminPendingLeads'] });
          queryClient.invalidateQueries({ queryKey: ['adminCallOutcomes'] });
        }}
      />

      <PendingLeadImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        agents={agents}
        onImportSuccess={(count, batchId) => {
          setFlashMessage(batchId ? `Successfully imported ${count} pending listings (Batch ID: ${batchId}).` : `Successfully imported ${count} pending listings.`);
          setTimeout(() => setFlashMessage(null), 3500);
          queryClient.invalidateQueries({ queryKey: ['adminPendingLeads'] });
          queryClient.invalidateQueries({ queryKey: ['adminLeadListBatches'] });
        }}
      />

      <AssignBatchModal
        isOpen={isAssignBatchOpen}
        onClose={() => setIsAssignBatchOpen(false)}
        agents={agents}
        onAssignSuccess={({ agentName, count, bannerText }) => {
          const msg = bannerText || `Assigned ${count} leads to ${agentName || 'Lisa Hurt'}.`;
          setFlashMessage(msg);
          setTimeout(() => setFlashMessage(null), 5000);
          queryClient.invalidateQueries({ queryKey: ['adminPendingLeads'] });
          queryClient.invalidateQueries({ queryKey: ['adminLeadListBatches'] });
        }}
      />

      <LogHrCallModal
        isOpen={isLogHrOpen}
        onClose={() => setIsLogHrOpen(false)}
        callerName="Admin / Relocation Desk"
        onSaveSuccess={(record) => {
          setFlashMessage(`Logged corporate HR call for ${record.company}.`);
          setTimeout(() => setFlashMessage(null), 3500);
          queryClient.invalidateQueries({ queryKey: ['adminHrProspectCalls'] });
        }}
      />

      <CharliePagePresenter pageKey="relocation-call-desk" />
    </div>
  );
}