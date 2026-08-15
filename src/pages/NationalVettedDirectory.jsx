import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Search, MapPin, Shield, Clock, ArrowRight, TrendingUp, Users } from 'lucide-react';
import SendingAgentModal from '@/components/directory/SendingAgentModal';

const GOLD = '#D4AF37';
const TARGET_AGENTS = 1000;
const TARGET_STATES = 50;

function fmt(n) {
  if (!n && n !== 0) return '—';
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function slugify(city) {
  return city.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// ── Progress Tracker ──────────────────────────────────────────────
function ProgressTracker({ totalAgents, statesCovered }) {
  const agentPct = Math.min(100, (totalAgents / TARGET_AGENTS) * 100);
  const statePct = Math.min(100, (statesCovered / TARGET_STATES) * 100);

  return (
    <div className="max-w-4xl mx-auto px-6 pb-6">
      <div className="rounded-2xl overflow-hidden" style={{ background: '#fff8ee', border: `1px solid rgba(212,175,55,0.3)` }}>
        <div className="px-6 py-5" style={{ borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
          <p className="text-[10px] font-black tracking-[0.3em] uppercase mb-3" style={{ color: GOLD }}>
            NATIONAL COVERAGE PROGRESS
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Agents */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4" style={{ color: GOLD }} />
                <span className="text-sm font-black" style={{ color: '#1a1a1a' }}>
                  {totalAgents} / {TARGET_AGENTS} Agents
                </span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(212,175,55,0.15)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${agentPct}%`, background: `linear-gradient(90deg, #e8c84a, ${GOLD})` }} />
              </div>
              <p className="text-[11px] mt-1" style={{ color: '#9b8a70' }}>
                {Math.round(agentPct)}% of target — full-time agents meeting production requirements
              </p>
            </div>
            {/* States */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4" style={{ color: GOLD }} />
                <span className="text-sm font-black" style={{ color: '#1a1a1a' }}>
                  {statesCovered} / {TARGET_STATES} States
                </span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(212,175,55,0.15)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${statePct}%`, background: `linear-gradient(90deg, #e8c84a, ${GOLD})` }} />
              </div>
              <p className="text-[11px] mt-1" style={{ color: '#9b8a70' }}>
                {Math.round(statePct)}% of US markets with at least one vetted partner
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── City Row ──────────────────────────────────────────────────────
function CityRow({ city, state, agents, slug }) {
  const activeCount = agents.filter(a => a.status === 'active').length;
  const pendingCount = agents.length - activeCount;
  const topAgent = agents[0];

  return (
    <Link to={`/vetted-agents/${slug}`}
      className="block rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:scale-[1.005]"
      style={{ background: '#fff8ee', border: '1px solid rgba(212,175,55,0.25)' }}>
      <div className="px-5 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)' }}>
            <MapPin className="w-4 h-4" style={{ color: GOLD }} />
          </div>
          <div className="min-w-0">
            <p className="font-black text-base truncate" style={{ color: '#1a1a1a' }}>{city}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-semibold" style={{ color: '#9b8a70' }}>
                {agents.length} Partner{agents.length !== 1 ? 's' : ''}
              </span>
              {activeCount > 0 && (
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(16,185,129,0.12)', color: '#059669' }}>
                  <Shield className="w-2.5 h-2.5" /> {activeCount} Active
                </span>
              )}
              {pendingCount > 0 && (
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(251,191,36,0.15)', color: '#b45309' }}>
                  <Clock className="w-2.5 h-2.5" /> {pendingCount} Pending
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {topAgent?.sales_volume_2025 && (
            <div className="hidden sm:block text-right">
              <p className="text-[10px] font-semibold" style={{ color: '#9b8a70' }}>Top Volume</p>
              <p className="font-black text-sm" style={{ color: GOLD }}>{fmt(topAgent.sales_volume_2025)}</p>
            </div>
          )}
          <ArrowRight className="w-4 h-4" style={{ color: GOLD }} />
        </div>
      </div>
    </Link>
  );
}

// ── State Group ───────────────────────────────────────────────────
function StateGroup({ state, cities }) {
  const totalAgents = cities.reduce((sum, c) => sum + c.agents.length, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-black tracking-[0.3em] uppercase" style={{ color: GOLD }}>
          {state}
        </p>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(212,175,55,0.1)', color: '#6b5c45', border: '1px solid rgba(212,175,55,0.2)' }}>
          {totalAgents} Agent{totalAgents !== 1 ? 's' : ''} · {cities.length} Market{cities.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="space-y-3">
        {cities.map(c => (
          <CityRow key={c.city} {...c} />
        ))}
      </div>
    </div>
  );
}

const EXODUS_CITIES = ['Los Angeles', 'San Francisco', 'Seattle', 'Chicago', 'New York', 'San Diego', 'Oakland', 'Portland'];

// ── Main Page ─────────────────────────────────────────────────────
export default function NationalVettedDirectory() {
  const [search, setSearch] = useState('');
  const [showSendingModal, setShowSendingModal] = useState(false);

  const { data: agents = [], isLoading } = useQuery({
    queryKey: ['vetted_partners_directory'],
    queryFn: () => base44.entities.VettedPartner.list('-sales_count_2025', 500),
  });

  // Group by state → city
  const grouped = useMemo(() => {
    const stateMap = {};
    agents.forEach(a => {
      if (!a.city || !a.state) return;
      if (!stateMap[a.state]) stateMap[a.state] = {};
      if (!stateMap[a.state][a.city]) stateMap[a.state][a.city] = [];
      stateMap[a.state][a.city].push(a);
    });

    return Object.entries(stateMap)
      .map(([state, cities]) => ({
        state,
        cities: Object.entries(cities).map(([city, cityAgents]) => ({
          city,
          state,
          agents: cityAgents.sort((a, b) => (b.sales_count_2025 || 0) - (a.sales_count_2025 || 0)),
          slug: cityAgents[0]?.city_slug || slugify(city),
        })).sort((a, b) => b.agents.length - a.agents.length),
      }))
      .sort((a, b) => {
        const aTotal = a.cities.reduce((s, c) => s + c.agents.length, 0);
        const bTotal = b.cities.reduce((s, c) => s + c.agents.length, 0);
        return bTotal - aTotal;
      });
  }, [agents]);

  const filtered = grouped.map(sg => ({
    ...sg,
    cities: sg.cities.filter(c =>
      c.city.toLowerCase().includes(search.toLowerCase()) ||
      sg.state.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(s => s.cities.length > 0);

  const totalAgents = agents.length;
  const statesCovered = grouped.length;

  return (
    <div className="min-h-screen" style={{ background: '#ede0cc' }}>
      {/* Header */}
      <div className="px-8 pt-12 pb-8 text-center" style={{ background: '#0d0d0d' }}>
        <p className="text-[10px] font-black tracking-[0.35em] uppercase mb-3" style={{ color: GOLD }}>DYSON & DYSON · PRN</p>
        <h1 className="display-heading mb-3"
          style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', color: '#fff', letterSpacing: '0.12em' }}>
          NATIONAL VETTED DIRECTORY
        </h1>
        <p className="text-sm max-w-xl mx-auto leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'Georgia, serif' }}>
          Dyson-curated Performance Partners across top US relocation markets. All contact inquiries are processed by our Relocation Team first.
        </p>

        {/* Search */}
        <div className="max-w-md mx-auto flex items-center gap-3 px-4 py-3 rounded-full"
          style={{ background: 'rgba(255,255,255,0.07)', border: `1px solid rgba(212,175,55,0.4)` }}>
          <Search className="w-4 h-4 shrink-0" style={{ color: GOLD }} />
          <input
            type="text"
            placeholder="Search city or state…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-white/40"
          />
        </div>

        {/* Sending Agent CTA */}
        <div className="mt-6">
          <button onClick={() => setShowSendingModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-black text-sm transition-all hover:scale-105"
            style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}>
            I Am a Sending Agent — Request Destination Vetting <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.45)' }}>Protect your 25% referral fee. We vet the boots-on-the-ground for you.</p>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <Shield className="w-3.5 h-3.5" style={{ color: '#10b981' }} />
            Dyson Vetted — Active PRN Member
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <Clock className="w-3.5 h-3.5" style={{ color: '#f59e0b' }} />
            Pending Final Approval
          </div>
        </div>
      </div>

      {/* Progress Tracker */}
      <ProgressTracker totalAgents={totalAgents} statesCovered={statesCovered} />

      {/* Directory */}
      <div className="px-6 py-6 max-w-4xl mx-auto space-y-8">
        {isLoading ? (
          <div className="text-center py-16" style={{ color: GOLD }}>
            <div className="w-8 h-8 border-2 rounded-full animate-spin mx-auto mb-3" style={{ borderColor: `${GOLD}40`, borderTopColor: GOLD }} />
            Loading directory…
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 rounded-2xl" style={{ background: '#fff8ee', border: '1px solid rgba(212,175,55,0.2)' }}>
            <p className="text-2xl mb-2">🗺️</p>
            <p className="font-bold text-base mb-1" style={{ color: '#1a1a1a' }}>
              {search ? `No results for "${search}"` : 'No agents loaded yet'}
            </p>
            <p className="text-sm" style={{ color: '#6b5c45' }}>
              {search ? 'Try a different city or state.' : 'Agents will appear here once imported.'}
            </p>
          </div>
        ) : (
          filtered.map(sg => <StateGroup key={sg.state} {...sg} />)
        )}

        {showSendingModal && <SendingAgentModal onClose={() => setShowSendingModal(false)} />}

        {/* Disclaimer */}
        <div className="rounded-2xl px-6 py-5 text-center"
          style={{ background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.2)' }}>
          <p className="text-xs leading-relaxed" style={{ color: '#6b5c45', fontFamily: 'Georgia, serif' }}>
            All agents listed as "Pending Final Approval" are currently under review by the Dyson vetting team. Performance data is sourced from public MLS records and third-party analytics. Contact inquiries are routed through Dyson & Dyson prior to agent introduction.
          </p>
        </div>
      </div>
    </div>
  );
}