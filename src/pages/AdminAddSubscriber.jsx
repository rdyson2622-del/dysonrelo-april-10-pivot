import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  UserPlus, Search, Loader2, CheckCircle2, Building2, Newspaper,
  Layers, MapPin, Sparkles, ArrowRight, X
} from 'lucide-react';

const GOLD = '#D4AF37';

const TIERS = [
  { id: 'tier1', label: 'Tier 1 — Free', desc: 'Daily news + portal access', color: '#888' },
  { id: 'tier2', label: 'Tier 2 — Paid', desc: 'Roadmaps + AI issue resolution', color: GOLD },
  { id: 'tier3', label: 'Tier 3 — VIP / Agent', desc: 'Private-label + concierge', color: '#a78bfa' },
];

const PORTAL_ROLES = [
  { id: 'client', label: 'Client' },
  { id: 'agent', label: 'Agent' },
  { id: 'broker', label: 'Broker' },
  { id: 'brokerage_admin', label: 'Brokerage Admin' },
];

export default function AdminAddSubscriber() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [brokerageId, setBrokerageId] = useState('');
  const [tier, setTier] = useState('tier2');
  const [portalRole, setPortalRole] = useState('client');
  const [inviteUser, setInviteUser] = useState(true);
  const [building, setBuilding] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const { data: contacts = [], isLoading: contactsLoading } = useQuery({
    queryKey: ['bobDysonContacts', search],
    queryFn: () => base44.entities.BobDysonContact.filter(
      search ? { status: 'active' } : { status: 'active' },
      '-created_date',
      100
    ),
  });

  const { data: brokerages = [] } = useQuery({
    queryKey: ['brokeragesList'],
    queryFn: () => base44.entities.Brokerage.list('-subscribed_at', 50),
  });

  const filtered = useMemo(() => {
    if (!search.trim()) return contacts.slice(0, 30);
    const q = search.toLowerCase();
    return contacts.filter(c =>
      (c.full_name || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.company || '').toLowerCase().includes(q) ||
      (c.city || '').toLowerCase().includes(q)
    ).slice(0, 30);
  }, [contacts, search]);

  const buildInitialSite = async () => {
    if (!selectedContact) { setError('Select a contact first.'); return; }
    if (!brokerageId) { setError('Select a brokerage/portal.'); return; }
    setBuilding(true);
    setError('');
    setResult(null);
    try {
      const c = selectedContact;
      const built = {};

      // 1. Build their initial site — RelocationClient roadmap record scoped to the brokerage
      const client = await base44.entities.RelocationClient.create({
        full_name: c.full_name,
        email: c.email || '',
        phone: c.phone || '',
        current_city: c.city || '',
        destination_city: '',
        status: 'new_lead',
        notes: `Pre-loaded from contact records by admin. Tier: ${tier}, Portal role: ${portalRole}.`,
      });
      built.client = client.id;

      // 2. Subscribe them to daily news — DnnSubscriber with tier
      let subscriber = null;
      if (c.email) {
        try {
          subscriber = await base44.entities.DnnSubscriber.create({
            full_name: c.full_name,
            email: c.email,
            phone: c.phone || '',
            tier,
            source: 'admin_preload',
            subscribed_at: new Date().toISOString(),
          });
          built.subscriber = subscriber.id;
        } catch (e) { built.subscriberError = e.message; }
      }

      // 3. Invite the user to the portal + link to brokerage (optional)
      if (inviteUser && c.email) {
        try {
          const inv = await base44.users.inviteUser(c.email, 'user');
          built.invite = inv;
          // Link the new user to the brokerage + portal_role
          const users = await base44.asServiceRole.entities.User.list();
          const newUser = users.find(u => u.email === c.email);
          if (newUser) {
            await base44.asServiceRole.entities.User.update(newUser.id, {
              brokerage_id: brokerageId,
              portal_role: portalRole,
            });
            built.linkedUser = newUser.id;
          }
        } catch (e) { built.inviteError = e.message; }
      }

      setResult({ contact: c, built, tier, portalRole, brokerageId });
      queryClient.invalidateQueries({ queryKey: ['brokeragesList'] });
    } catch (e) {
      setError(e.message);
    } finally {
      setBuilding(false);
    }
  };

  return (
    <div className="p-6 md:p-8 min-h-screen" style={{ background: '#0a0a0a' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.35)' }}>
          <UserPlus className="w-6 h-6" style={{ color: GOLD }} />
        </div>
        <div>
          <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: GOLD }}>Admin · Subscriber Management</p>
          <h1 className="text-3xl font-serif text-white">Add Subscriber to Any Portal</h1>
        </div>
      </div>

      <p className="text-sm text-stone-400 max-w-3xl mb-6">
        Pre-load clients from your contact records, build their initial site (relocation roadmap), subscribe them to daily news,
        set their tier, and invite them to the portal — all in one action. This is the management tool brokers get with Dyson real estate roadmaps.
      </p>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: contact picker */}
        <div>
          <h2 className="text-xs font-bold tracking-widest uppercase text-stone-400 mb-3">1. Select a contact</h2>
          <div className="relative mb-3">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search contacts by name, email, company, city…"
              className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm text-white outline-none"
              style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)' }}
            />
          </div>
          <div className="rounded-xl max-h-[420px] overflow-y-auto" style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.08)' }}>
            {contactsLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" style={{ color: GOLD }} /></div>
            ) : filtered.length === 0 ? (
              <p className="text-xs text-stone-600 text-center py-8">No contacts found.</p>
            ) : filtered.map(c => {
              const active = selectedContact?.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedContact(c)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all"
                  style={{ background: active ? `${GOLD}12` : 'transparent', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                >
                  {active ? <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: GOLD }} /> : <div className="w-4 h-4 rounded-full border border-white/20 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{c.full_name}</p>
                    <p className="text-[10px] text-stone-500 truncate">{c.email || 'no email'} · {c.city || ''}{c.state ? `, ${c.state}` : ''} · {c.company || ''}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: config + build */}
        <div>
          <h2 className="text-xs font-bold tracking-widest uppercase text-stone-400 mb-3">2. Configure & build</h2>
          {selectedContact ? (
            <div className="rounded-xl p-4 mb-3" style={{ background: '#0d0d0d', border: `1px solid ${GOLD}30` }}>
              <p className="text-sm text-white">{selectedContact.full_name}</p>
              <p className="text-[10px] text-stone-500">{selectedContact.email} · {selectedContact.phone || 'no phone'}</p>
            </div>
          ) : (
            <p className="text-xs text-stone-600 mb-3">← Pick a contact to begin</p>
          )}

          {/* Portal / brokerage */}
          <label className="text-[10px] font-bold tracking-widest uppercase text-stone-500 block mb-1.5">Portal (Brokerage)</label>
          <select
            value={brokerageId}
            onChange={(e) => setBrokerageId(e.target.value)}
            className="w-full mb-3 px-3 py-2.5 rounded-lg text-sm text-white outline-none"
            style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <option value="">Select a brokerage…</option>
            {brokerages.map(b => (
              <option key={b.id} value={b.id}>{b.name} ({b.plan_tier})</option>
            ))}
          </select>

          {/* Tier */}
          <label className="text-[10px] font-bold tracking-widest uppercase text-stone-500 block mb-1.5">Subscriber Tier</label>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {TIERS.map(t => (
              <button
                key={t.id}
                onClick={() => setTier(t.id)}
                className="rounded-lg p-2.5 text-left transition-all"
                style={{
                  background: tier === t.id ? `${t.color}15` : '#111',
                  border: `1px solid ${tier === t.id ? t.color : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                <p className="text-[10px] font-bold" style={{ color: tier === t.id ? t.color : '#888' }}>{t.label.split('—')[0]}</p>
                <p className="text-[9px] text-stone-500 leading-tight">{t.desc}</p>
              </button>
            ))}
          </div>

          {/* Portal role */}
          <label className="text-[10px] font-bold tracking-widest uppercase text-stone-500 block mb-1.5">Portal Role</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {PORTAL_ROLES.map(r => (
              <button
                key={r.id}
                onClick={() => setPortalRole(r.id)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  background: portalRole === r.id ? `${GOLD}15` : '#111',
                  border: `1px solid ${portalRole === r.id ? GOLD : 'rgba(255,255,255,0.08)'}`,
                  color: portalRole === r.id ? GOLD : '#888',
                }}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Invite toggle */}
          <label className="flex items-center gap-2 mb-4 cursor-pointer">
            <input type="checkbox" checked={inviteUser} onChange={(e) => setInviteUser(e.target.checked)} className="accent-yellow-500" />
            <span className="text-xs text-stone-400">Also send portal invite & link user to brokerage</span>
          </label>

          {error && <p className="text-xs mb-2" style={{ color: '#ef4444' }}>{error}</p>}

          <button
            onClick={buildInitialSite}
            disabled={building || !selectedContact || !brokerageId}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
            style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD}cc)`, color: '#000' }}
          >
            {building ? <><Loader2 className="w-4 h-4 animate-spin" /> Building initial site…</> : <><Sparkles className="w-4 h-4" /> Build Initial Site + Subscribe to Daily News</>}
          </button>

          {/* Result */}
          {result && (
            <div className="mt-4 rounded-xl p-4" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)' }}>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5" style={{ color: '#22c55e' }} />
                <p className="text-sm font-bold text-white">Initial site built for {result.contact.full_name}</p>
              </div>
              <div className="space-y-1.5 text-xs">
                <ResultRow icon={MapPin} label="Relocation roadmap created" ok={!!result.built.client} id={result.built.client} />
                <ResultRow icon={Newspaper} label="Daily news subscription (DNN)" ok={!!result.built.subscriber} id={result.built.subscriber} error={result.built.subscriberError} />
                <ResultRow icon={Layers} label={`Tier set: ${result.tier}`} ok={!!result.built.subscriber} />
                {result.built.linkedUser && <ResultRow icon={Building2} label="User invited & linked to portal" ok={!!result.built.linkedUser} id={result.built.linkedUser} />}
                {result.built.inviteError && <ResultRow icon={X} label={`Invite: ${result.built.inviteError}`} ok={false} />}
              </div>
              <button
                onClick={() => { setResult(null); setSelectedContact(null); }}
                className="mt-3 text-xs text-stone-400 hover:text-white"
              >
                Add another subscriber →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultRow({ icon: Icon, label, ok, id, error }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: ok ? '#22c55e' : '#ef4444' }} />
      <span className={ok ? 'text-stone-300' : 'text-red-400'}>{label}</span>
      {id && <span className="text-stone-600 ml-auto truncate max-w-[120px]">#{id.slice(-6)}</span>}
    </div>
  );
}