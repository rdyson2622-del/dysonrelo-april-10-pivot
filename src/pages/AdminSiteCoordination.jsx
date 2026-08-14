import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Activity, AlertTriangle, ArrowRight, CheckCircle2, ChevronDown, ChevronUp,
  Clock, Layers, Radio, RefreshCw, Users, Zap
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { COORDINATION_RHYTHM, SITE_ACTIVITY_DOMAINS } from '@/lib/siteActivityDomains';

const GOLD = '#D4AF37';

function safeList(entity, order, limit) {
  return entity.list(order, limit).catch(() => []);
}

function PulseCard({ label, value, hint, accent, loading, path }) {
  const content = (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-2xl p-4 h-full transition-all"
      style={{
        background: '#000',
        border: `1px solid ${accent}33`,
        boxShadow: `inset 0 0 0 1px ${accent}11`,
      }}
    >
      <p className="text-[10px] font-black tracking-[0.2em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
        {label}
      </p>
      {loading ? (
        <div className="h-8 w-12 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.08)' }} />
      ) : (
        <p className="text-3xl font-bold tabular-nums" style={{ color: accent }}>{value}</p>
      )}
      {hint && (
        <p className="text-[11px] mt-2 leading-snug" style={{ color: 'rgba(255,255,255,0.45)' }}>{hint}</p>
      )}
    </motion.div>
  );

  if (!path) return content;
  return <Link to={path} className="block h-full hover:opacity-95">{content}</Link>;
}

function DomainCard({ domain, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: '#000', border: `1px solid ${domain.accent}33` }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start gap-3 p-5 text-left"
      >
        <div
          className="mt-1 h-2.5 w-2.5 rounded-full shrink-0"
          style={{ background: domain.accent, boxShadow: `0 0 12px ${domain.accent}` }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-bold" style={{ color: '#fff' }}>{domain.title}</h3>
            {open ? (
              <ChevronUp className="w-4 h-4 shrink-0" style={{ color: domain.accent }} />
            ) : (
              <ChevronDown className="w-4 h-4 shrink-0" style={{ color: domain.accent }} />
            )}
          </div>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>{domain.purpose}</p>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="pt-4">
            <p className="text-[10px] font-black tracking-[0.2em] uppercase mb-2" style={{ color: domain.accent }}>
              Daily focus
            </p>
            <ul className="space-y-1.5">
              {domain.dailyFocus.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: domain.accent }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-black tracking-[0.2em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Jump to hubs
            </p>
            <div className="flex flex-wrap gap-2">
              {domain.hubs.map((hub) => (
                <Link
                  key={hub.path + hub.label}
                  to={hub.path}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-opacity hover:opacity-80"
                  style={{
                    background: `${domain.accent}14`,
                    color: domain.accent,
                    border: `1px solid ${domain.accent}44`,
                  }}
                >
                  {hub.label}
                  <ArrowRight className="w-3 h-3" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminSiteCoordination() {
  const { data: clients = [], isLoading: loadingClients, refetch: refetchClients, isFetching } = useQuery({
    queryKey: ['coord-clients'],
    queryFn: () => safeList(base44.entities.RelocationClient, '-created_date', 500),
    refetchInterval: 30000,
  });

  const { data: owners = [], isLoading: loadingOwners } = useQuery({
    queryKey: ['coord-owners'],
    queryFn: () => safeList(base44.entities.ListingOwner, '-created_date', 2000),
    refetchInterval: 30000,
  });

  const { data: optIns = [], isLoading: loadingOptIns } = useQuery({
    queryKey: ['coord-optins'],
    queryFn: () => safeList(base44.entities.OptIn, '-created_date', 300),
    refetchInterval: 30000,
  });

  const { data: escalations = [], isLoading: loadingEscalations } = useQuery({
    queryKey: ['coord-escalations'],
    queryFn: () => safeList(base44.entities.CharlieEscalation, '-created_date', 200),
    refetchInterval: 15000,
  });

  const { data: broadcasts = [], isLoading: loadingBroadcasts } = useQuery({
    queryKey: ['coord-broadcasts'],
    queryFn: () => safeList(base44.entities.DnnBroadcast, '-created_date', 50),
    refetchInterval: 30000,
  });

  const { data: scheduled = [], isLoading: loadingScheduled } = useQuery({
    queryKey: ['coord-scheduled'],
    queryFn: () => safeList(base44.entities.ScheduledCampaign, '-scheduled_for', 200),
    refetchInterval: 30000,
  });

  const { data: partners = [], isLoading: loadingPartners } = useQuery({
    queryKey: ['coord-partners'],
    queryFn: () => safeList(base44.entities.VettedPartner, '-created_date', 500),
    refetchInterval: 60000,
  });

  const { data: outreachTasks = [], isLoading: loadingTasks } = useQuery({
    queryKey: ['coord-outreach-tasks'],
    queryFn: () => safeList(base44.entities.OutreachTask, '-created_date', 300),
    refetchInterval: 30000,
  });

  const pulse = useMemo(() => {
    const openEscalations = escalations.filter((e) => e.status === 'open' || e.status === 'in_progress');
    const newOptIns = optIns.filter((o) => o.status === 'new');
    const notContacted = owners.filter((o) => o.contact_status === 'not_contacted');
    const openTasks = outreachTasks.filter((t) => t.status !== 'completed' && t.status !== 'done');
    const pendingBroadcasts = broadcasts.filter((b) =>
      ['draft', 'rendering', 'ready'].includes(b.status)
    );
    const queuedCampaigns = scheduled.filter((s) => s.status === 'scheduled' || s.status === 'queued');

    return {
      clients: clients.length,
      owners: owners.length,
      notContacted: notContacted.length,
      newOptIns: newOptIns.length,
      openEscalations: openEscalations.length,
      pendingBroadcasts: pendingBroadcasts.length,
      queuedCampaigns: queuedCampaigns.length,
      partners: partners.length,
      openTasks: openTasks.length,
      attention: [
        ...openEscalations.slice(0, 5).map((e) => ({
          id: e.id,
          kind: 'Charlie escalation',
          title: e.consumer_question || 'Open escalation',
          meta: e.consumer_name || e.consumer_email || e.status,
          path: '/admin/charlie-escalations',
          accent: '#EF4444',
        })),
        ...newOptIns.slice(0, 5).map((o) => ({
          id: o.id,
          kind: 'New opt-in',
          title: o.full_name || o.email || o.phone || 'Untitled opt-in',
          meta: o.source || o.status,
          path: '/admin/opt-ins',
          accent: '#22C55E',
        })),
        ...pendingBroadcasts.slice(0, 4).map((b) => ({
          id: b.id,
          kind: 'DNN broadcast',
          title: b.show_name || `Show ${b.show_number || ''}`.trim() || 'Broadcast',
          meta: b.status,
          path: '/admin/dnn/show-pipeline',
          accent: GOLD,
        })),
        ...openTasks.slice(0, 4).map((t) => ({
          id: t.id,
          kind: 'Outreach task',
          title: t.title || t.task_type || 'Open task',
          meta: t.owner_name || t.property_address || t.status,
          path: '/admin/outreach-pipeline',
          accent: '#F59E0B',
        })),
      ].slice(0, 12),
    };
  }, [clients, owners, optIns, escalations, broadcasts, scheduled, partners, outreachTasks]);

  const loadingPulse =
    loadingClients || loadingOwners || loadingOptIns || loadingEscalations ||
    loadingBroadcasts || loadingScheduled || loadingPartners || loadingTasks;

  const hubCount = SITE_ACTIVITY_DOMAINS.reduce((n, d) => n + d.hubs.length, 0);

  return (
    <div className="min-h-screen p-6 pb-16" style={{ background: '#0a0a0a' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] mb-2" style={{ color: GOLD }}>
                OVERALL SITE COORDINATION
              </p>
              <h1 className="display-heading mb-2" style={{ fontSize: 'clamp(1.2rem, 2.4vw, 1.75rem)', color: '#fff' }}>
                Coordinate every activity on 1dnn.com
              </h1>
              <p className="text-sm max-w-2xl" style={{ color: 'rgba(255,255,255,0.65)' }}>
                One command surface for DysonRelo — {SITE_ACTIVITY_DOMAINS.length} operational domains,
                {' '}{hubCount} admin hubs, live pulse counts, and the daily rhythm that keeps client,
                outreach, DNN, PRN, PR, and Charlie work in sync.
              </p>
            </div>
            <button
              type="button"
              onClick={() => refetchClients()}
              className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full transition-opacity hover:opacity-80"
              style={{
                background: 'rgba(212,175,55,0.12)',
                color: GOLD,
                border: '1px solid rgba(212,175,55,0.35)',
              }}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
              Refresh pulse
            </button>
          </div>
        </motion.div>

        {/* Live pulse */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4" style={{ color: GOLD }} />
            <h2 className="text-sm font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>
              Live pulse
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <PulseCard label="Clients" value={pulse.clients} hint="RelocationClient records" accent="#8B5CF6" loading={loadingPulse} path="/admin/clients" />
            <PulseCard label="Listing owners" value={pulse.owners} hint={`${pulse.notContacted} not contacted`} accent="#10B981" loading={loadingPulse} path="/admin/owners" />
            <PulseCard label="New opt-ins" value={pulse.newOptIns} hint="Awaiting first contact" accent="#22C55E" loading={loadingPulse} path="/admin/opt-ins" />
            <PulseCard label="Open escalations" value={pulse.openEscalations} hint="Charlie needs humans" accent="#EF4444" loading={loadingPulse} path="/admin/charlie-escalations" />
            <PulseCard label="DNN in flight" value={pulse.pendingBroadcasts} hint="draft / rendering / ready" accent={GOLD} loading={loadingPulse} path="/admin/dnn/show-pipeline" />
            <PulseCard label="Queued SMS" value={pulse.queuedCampaigns} hint="Scheduled campaigns" accent="#F97316" loading={loadingPulse} path="/admin/scheduled-campaigns" />
            <PulseCard label="Open outreach tasks" value={pulse.openTasks} hint="Pipeline follow-ups" accent="#F59E0B" loading={loadingPulse} path="/admin/outreach-pipeline" />
            <PulseCard label="Vetted partners" value={pulse.partners} hint="PRN / affiliate roster" accent="#34D399" loading={loadingPulse} path="/admin/roster" />
            <PulseCard label="Domains" value={SITE_ACTIVITY_DOMAINS.length} hint={`${hubCount} linked hubs`} accent="#06B6D4" loading={false} />
            <PulseCard label="Attention queue" value={pulse.attention.length} hint="Items needing eyes now" accent="#EC4899" loading={loadingPulse} />
          </div>
        </section>

        {/* Needs attention */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4" style={{ color: '#EF4444' }} />
            <h2 className="text-sm font-black tracking-[0.2em] uppercase" style={{ color: '#EF4444' }}>
              Needs attention now
            </h2>
          </div>
          {loadingPulse ? (
            <div className="rounded-2xl p-6" style={{ background: '#000', border: '1px solid rgba(239,68,68,0.2)' }}>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>Loading live queues…</p>
            </div>
          ) : pulse.attention.length === 0 ? (
            <div className="rounded-2xl p-6" style={{ background: '#000', border: '1px solid rgba(34,197,94,0.25)' }}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" style={{ color: '#22C55E' }} />
                <p className="text-sm font-semibold" style={{ color: '#22C55E' }}>
                  No urgent items in the sampled queues — stay on the daily rhythm below.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pulse.attention.map((item) => (
                <Link
                  key={`${item.kind}-${item.id}`}
                  to={item.path}
                  className="rounded-2xl p-4 transition-opacity hover:opacity-90"
                  style={{ background: '#000', border: `1px solid ${item.accent}33` }}
                >
                  <p className="text-[10px] font-black tracking-[0.18em] uppercase mb-1" style={{ color: item.accent }}>
                    {item.kind}
                  </p>
                  <p className="text-sm font-semibold line-clamp-2" style={{ color: '#fff' }}>{item.title}</p>
                  {item.meta && (
                    <p className="text-xs mt-1 truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>{item.meta}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Daily rhythm */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4" style={{ color: GOLD }} />
            <h2 className="text-sm font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>
              Daily coordination rhythm
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COORDINATION_RHYTHM.map((block) => (
              <div
                key={block.window}
                className="rounded-2xl p-5"
                style={{ background: '#000', border: '1px solid rgba(212,175,55,0.18)' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4" style={{ color: GOLD }} />
                  <h3 className="text-sm font-bold" style={{ color: '#fff' }}>{block.window}</h3>
                </div>
                <ul className="space-y-2">
                  {block.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: GOLD }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Domains */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4" style={{ color: GOLD }} />
            <h2 className="text-sm font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>
              Activity domains
            </h2>
          </div>
          <div className="space-y-3">
            {SITE_ACTIVITY_DOMAINS.map((domain, idx) => (
              <DomainCard key={domain.id} domain={domain} defaultOpen={idx < 2} />
            ))}
          </div>
        </section>

        {/* Agent handoff note */}
        <section
          className="rounded-2xl p-5"
          style={{ background: '#000', border: '1px solid rgba(212,175,55,0.2)' }}
        >
          <div className="flex items-start gap-3">
            <Radio className="w-5 h-5 shrink-0 mt-0.5" style={{ color: GOLD }} />
            <div>
              <h3 className="text-sm font-bold mb-1" style={{ color: '#fff' }}>Cloud Agent handoff</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                This page is the overall site coordination board. The sibling <strong style={{ color: GOLD }}>Base44 coordinator</strong> agent
                owns Base44 publish / function / entity work. Use this hub to pick the next operational lane,
                then send a concrete task (page number, domain id, or entity) to the right agent or staff owner.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(212,175,55,0.12)', color: GOLD, border: '1px solid rgba(212,175,55,0.35)' }}
                >
                  <Users className="w-3.5 h-3.5" />
                  Admin Command Center
                </Link>
                <Link
                  to="/admin/business-plan"
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  Business Plan
                  <ArrowRight className="w-3 h-3" />
                </Link>
                <Link
                  to="/admin/campaign-roadmap"
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  Campaign Roadmap
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
