import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  FileSearch, Loader2, AlertTriangle, ShieldCheck, PenLine, CalendarClock,
  Flame, ArrowRight, CheckCircle2, XCircle, ChevronDown, ChevronUp, RefreshCw,
  FileText, Clock
} from 'lucide-react';
import BrokerageCommPill from '@/components/brokerage/BrokerageCommPill';

const GOLD = '#D4AF37';

const SEVERITY_COLORS = {
  critical: '#ef4444',
  high: '#f59e0b',
  medium: GOLD,
  low: '#64748b',
};

const STATUS_META = {
  pending:   { label: 'Pending',   color: '#64748b', icon: Clock },
  analyzing: { label: 'Analyzing', color: GOLD,      icon: Loader2 },
  analyzed:  { label: 'Analyzed',   color: '#22c55e', icon: CheckCircle2 },
  failed:    { label: 'Failed',     color: '#ef4444', icon: XCircle },
};

export default function TransactionAudit() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [pulling, setPulling] = useState(false);
  const [pullEscrow, setPullEscrow] = useState('');
  const [pullResult, setPullResult] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);
  const userBrokerageId = user?.brokerage_id || user?.data?.brokerage_id;

  const { data: brokerage } = useQuery({
    queryKey: ['brokeragePortal', user?.id, userBrokerageId],
    queryFn: async () => {
      if (user?.role === 'admin') {
        const list = await base44.entities.Brokerage.filter({ plan_tier: 'founder' }, '-subscribed_at', 1);
        return list?.[0] || null;
      }
      if (userBrokerageId) return await base44.entities.Brokerage.get(userBrokerageId);
      return null;
    },
    enabled: !!user,
  });

  // Real-time document analyses — refresh every 15s (analyzing ones update as LLM completes)
  const { data: analyses = [], isLoading } = useQuery({
    queryKey: ['transactionDocAnalyses'],
    queryFn: () => base44.entities.TransactionDocAnalysis.list('-analyzed_at', 100),
    refetchInterval: 15000,
  });

  const { data: boldtrailHealth } = useQuery({
    queryKey: ['boldtrailHealthCheck'],
    queryFn: async () => {
      const res = await base44.functions.invoke('boldtrailHealthCheck', {});
      return res.data || res;
    },
    enabled: !!user,
    retry: false,
  });

  const runPull = async () => {
    if (!pullEscrow.trim()) return;
    setPulling(true);
    setPullResult(null);
    try {
      const res = await base44.functions.invoke('boldtrailPullTransactionDocs', {
        escrow_number: pullEscrow.trim(),
        brokerage_id: brokerage?.id,
      });
      setPullResult({ ok: true, data: res.data });
      queryClient.invalidateQueries({ queryKey: ['transactionDocAnalyses'] });
    } catch (e) {
      setPullResult({ ok: false, error: e.message });
    }
    setPulling(false);
  };

  // Summary stats for the broker report
  const analyzed = analyses.filter(a => a.status === 'analyzed');
  const totalHotspots = analyzed.reduce((n, a) => n + (a.friction_hotspots?.length || 0), 0);
  const criticalHotspots = analyzed.reduce((n, a) =>
    n + (a.friction_hotspots || []).filter(h => h.severity === 'critical' || h.severity === 'high').length, 0);
  const avgScore = analyzed.length > 0
    ? Math.round(analyzed.reduce((s, a) => s + (a.hotspot_score || 0), 0) / analyzed.length)
    : 0;

  return (
    <div className="p-6 md:p-8 min-h-screen" style={{ background: '#0a0a0a' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.35)' }}>
          <FileSearch className="w-6 h-6" style={{ color: GOLD }} />
        </div>
        <div>
          <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: GOLD }}>Managing Broker Library</p>
          <h1 className="text-3xl font-serif text-white">Transaction Document Audit</h1>
          <p className="text-xs text-gray-500 mt-1">Real-time LLM review of RPA, counters & addenda — friction reported before deadlines slip</p>
        </div>
      </div>

      <BrokerageCommPill />

      {boldtrailHealth && (
        <p className="text-xs mb-4" style={{ color: boldtrailHealth.link_live ? '#22c55e' : '#f59e0b' }}>
          BoldTrail: {boldtrailHealth.link_live ? 'link live' : (boldtrailHealth.next_steps?.[0] || 'secrets incomplete')}
          {' · '}host {boldtrailHealth.resolved_base_url}
        </p>
      )}

      {/* Pull new analysis */}
      <div className="rounded-xl p-4 mb-6" style={{ background: '#111', border: '1px solid rgba(212,175,55,0.2)' }}>
        <div className="flex items-center gap-2 mb-3">
          <RefreshCw className="w-4 h-4" style={{ color: GOLD }} />
          <span className="text-sm font-serif text-white">Pull & Audit New Transaction Docs</span>
        </div>
        <div className="flex gap-2">
          <input
            value={pullEscrow}
            onChange={e => setPullEscrow(e.target.value)}
            placeholder="Escrow # (e.g. 25-12345)"
            className="flex-1 px-3 py-2 rounded-lg text-sm text-white outline-none"
            style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)' }}
            onKeyDown={e => e.key === 'Enter' && runPull()}
          />
          <button
            onClick={runPull}
            disabled={pulling || !pullEscrow.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
            style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.35)', color: GOLD }}
          >
            {pulling ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSearch className="w-4 h-4" />}
            {pulling ? 'Pulling & Analyzing…' : 'Pull + Audit'}
          </button>
        </div>
        {pullResult && (
          <p className="text-xs mt-2" style={{ color: pullResult.ok ? '#22c55e' : '#ef4444' }}>
            {pullResult.ok
              ? `✓ ${pullResult.data.message || 'Docs pulled — analysis queued. Refresh in ~30s to see results.'}`
              : `✗ ${pullResult.error}`}
          </p>
        )}
      </div>

      {/* Report stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatBox label="Docs Analyzed" value={analyzed.length} color={GOLD} />
        <StatBox label="Friction Hotspots" value={totalHotspots} color="#f59e0b" />
        <StatBox label="High/Critical" value={criticalHotspots} color="#ef4444" />
        <StatBox label="Avg Friction Score" value={avgScore} color={avgScore > 60 ? '#ef4444' : avgScore > 30 ? '#f59e0b' : '#22c55e'} />
      </div>

      {/* Analysis list — the broker's real-time library */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: GOLD }} />
        </div>
      ) : analyses.length === 0 ? (
        <div className="rounded-xl p-8 text-center" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)' }}>
          <FileText className="w-10 h-10 mx-auto mb-3 text-gray-600" />
          <p className="text-gray-400 text-sm mb-2">No document audits yet.</p>
          <p className="text-gray-600 text-xs">Enter an escrow # above to pull transaction docs from BoldTrail and run a real-time LLM audit. Results appear here automatically.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-[10px] font-black tracking-widest uppercase text-center" style={{ color: GOLD }}>
            ● {analyses.length} Document Audit{analyses.length !== 1 ? 's' : ''} — Real-Time Broker Review
          </p>
          {analyses.map((a, i) => {
            const isExpanded = expandedId === a.id;
            const meta = STATUS_META[a.status] || STATUS_META.pending;
            const StatusIcon = meta.icon;
            const hotspots = a.friction_hotspots || [];
            const deadlines = a.extracted_deadlines || [];
            const sigs = a.signature_requirements || [];
            return (
              <div
                key={a.id}
                className="rounded-xl transition-all cursor-pointer"
                style={{
                  background: '#111',
                  border: isExpanded ? `1.5px solid ${GOLD}` : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: isExpanded ? `0 0 16px ${GOLD}20` : 'none',
                }}
                onClick={() => setExpandedId(isExpanded ? null : a.id)}
              >
                {/* Summary row */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${meta.color}15`, border: `1px solid ${meta.color}40` }}>
                      <StatusIcon className="w-4 h-4" style={{ color: meta.color }} spin={a.status === 'analyzing'} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-serif text-white truncate">{a.doc_name || a.doc_type?.toUpperCase() || 'Document'}</h3>
                      <p className="text-xs text-gray-500 truncate">
                        {a.property_address || '—'} · Escrow #{a.escrow_number || '—'}
                        {a.analyzed_at && ` · ${new Date(a.analyzed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {a.hotspot_score != null && a.status === 'analyzed' && (
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: `${SEVERITY_COLORS[a.hotspot_score > 60 ? 'critical' : a.hotspot_score > 30 ? 'high' : 'low']}20`, border: `1px solid ${SEVERITY_COLORS[a.hotspot_score > 60 ? 'critical' : a.hotspot_score > 30 ? 'high' : 'low']}40`, color: SEVERITY_COLORS[a.hotspot_score > 60 ? 'critical' : a.hotspot_score > 30 ? 'high' : 'low'] }}>
                        Score: {a.hotspot_score}
                      </span>
                    )}
                    {hotspots.length > 0 && (
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>
                        <Flame className="w-3 h-3" /> {hotspots.length}
                      </span>
                    )}
                    <span className="text-[9px] font-bold px-2 py-1 rounded-full" style={{ background: `${meta.color}15`, border: `1px solid ${meta.color}40`, color: meta.color }}>
                      {meta.label.toUpperCase()}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                  </div>
                </div>

                {/* Expanded report */}
                {isExpanded && a.status === 'analyzed' && (
                  <div className="px-4 pb-4 border-t border-white/5 space-y-4">
                    {/* Terms summary */}
                    {a.terms_summary && (
                      <Section icon={FileText} title="Terms Summary">
                        <p className="text-xs text-gray-300 leading-relaxed">{a.terms_summary}</p>
                      </Section>
                    )}

                    {/* Extracted deadlines */}
                    {deadlines.length > 0 && (
                      <Section icon={CalendarClock} title={`Extracted Deadlines (${deadlines.length})`}>
                        <div className="grid md:grid-cols-2 gap-2">
                          {deadlines.map((d, di) => (
                            <div key={di} className="rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                              <p className="text-xs text-white font-medium">{d.label}</p>
                              <p className="text-[10px] text-gray-500">
                                {d.date ? new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                                {d.responsible_party && ` · ${d.responsible_party}`}
                                {d.days_from_acceptance != null && ` · ${d.days_from_acceptance}d from acceptance`}
                              </p>
                            </div>
                          ))}
                        </div>
                      </Section>
                    )}

                    {/* Signature requirements */}
                    {sigs.length > 0 && (
                      <Section icon={PenLine} title={`Signature Requirements (${sigs.length})`}>
                        <div className="space-y-1.5">
                          {sigs.map((s, si) => {
                            const sigColor = s.status === 'signed' ? '#22c55e' : s.status === 'missing' ? '#ef4444' : '#64748b';
                            return (
                              <div key={si} className="flex items-center gap-2 rounded-lg px-3 py-1.5" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${sigColor}30` }}>
                                {s.status === 'signed' ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: sigColor }} /> : s.status === 'missing' ? <XCircle className="w-3.5 h-3.5 shrink-0" style={{ color: sigColor }} /> : <PenLine className="w-3.5 h-3.5 shrink-0" style={{ color: sigColor }} />}
                                <p className="text-xs text-white flex-1">{s.party} — {s.document_section || 'signature required'}</p>
                                {s.deadline_date && <p className="text-[10px] text-gray-500">by {new Date(s.deadline_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>}
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${sigColor}20`, color: sigColor }}>{s.status?.toUpperCase()}</span>
                              </div>
                            );
                          })}
                        </div>
                      </Section>
                    )}

                    {/* Friction hotspots — the key broker report */}
                    {hotspots.length > 0 && (
                      <Section icon={Flame} title={`Friction Hotspots (${hotspots.length})`} accent>
                        <div className="space-y-2">
                          {hotspots.map((h, hi) => {
                            const sc = SEVERITY_COLORS[h.severity] || GOLD;
                            return (
                              <div key={hi} className="rounded-lg px-3 py-2.5" style={{ background: `${sc}08`, border: `1px solid ${sc}30` }}>
                                <div className="flex items-start gap-2 mb-1">
                                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded shrink-0 mt-0.5" style={{ background: `${sc}20`, color: sc }}>
                                    {h.severity?.toUpperCase()}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs text-white font-medium">{h.hotspot_type?.replace(/_/g, ' ')}</p>
                                    {h.related_deadline && <p className="text-[10px] text-gray-500">↳ Threatens: {h.related_deadline}</p>}
                                  </div>
                                </div>
                                <p className="text-xs text-gray-300 leading-relaxed mb-1.5">{h.description}</p>
                                {h.recommended_action && (
                                  <div className="flex items-start gap-1.5 mt-1.5 pt-1.5 border-t border-white/5">
                                    <ArrowRight className="w-3 h-3 shrink-0 mt-0.5" style={{ color: GOLD }} />
                                    <p className="text-[11px] leading-relaxed" style={{ color: GOLD }}><span className="font-bold">Action: </span>{h.recommended_action}</p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </Section>
                    )}

                    {/* Linked alerts */}
                    {a.alert_milestone_ids?.length > 0 && (
                      <div className="flex items-center gap-2 text-[10px] text-gray-500 pt-1">
                        <ShieldCheck className="w-3.5 h-3.5" style={{ color: '#22c55e' }} />
                        {a.alert_milestone_ids.length} real-time friction alert{a.alert_milestone_ids.length !== 1 ? 's' : ''} generated from this audit — visible in the Escrow alert banner.
                      </div>
                    )}
                  </div>
                )}

                {/* Expanded — still analyzing */}
                {isExpanded && a.status === 'analyzing' && (
                  <div className="px-4 pb-4 border-t border-white/5 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" style={{ color: GOLD }} />
                    <p className="text-xs text-gray-500">LLM is reviewing document terms — check back in ~30s.</p>
                  </div>
                )}

                {/* Expanded — failed */}
                {isExpanded && a.status === 'failed' && (
                  <div className="px-4 pb-4 border-t border-white/5 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" style={{ color: '#ef4444' }} />
                    <p className="text-xs text-gray-500">Analysis failed: {a.error_message || 'Unknown error'}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, color }) {
  return (
    <div className="rounded-xl p-3" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)' }}>
      <p className="text-2xl font-serif" style={{ color }}>{value}</p>
      <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
}

function Section({ icon: Icon, title, children, accent }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-3.5 h-3.5" style={{ color: accent ? '#ef4444' : GOLD }} />
        <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: accent ? '#ef4444' : GOLD }}>{title}</p>
      </div>
      {children}
    </div>
  );
}