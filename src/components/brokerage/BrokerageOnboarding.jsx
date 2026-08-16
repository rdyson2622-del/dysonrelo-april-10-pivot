import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Briefcase, User, Shield, Check, ArrowRight, ArrowLeft, Loader2,
  Building2, Search, AlertTriangle, CheckCircle2, Lock
} from 'lucide-react';

const GOLD = '#D4AF37';

/**
 * BrokerageOnboarding — the identification gate for new Broker/Agent Portal subscribers.
 * Every new visitor must identify as a Broker or Agent, and if Broker, whether they're
 * the Managing Broker. This determines their security protocol for data review and input.
 *
 * Managing Broker → can create/claim a brokerage, gets brokerage_admin role (full access)
 * Broker (not managing) → must be linked by their managing broker (request access)
 * Agent → must be linked by their managing broker (request access)
 */
export default function BrokerageOnboarding() {
  const queryClient = useQueryClient();
  const [step, setStep] = useState('identify'); // identify → broker_type → setup_brokerage | find_brokerage | done
  const [role, setRole] = useState(null); // 'broker' | 'agent'
  const [isManaging, setIsManaging] = useState(null); // true | false
  const [firmName, setFirmName] = useState('');
  const [search, setSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const { data: brokerages = [] } = useQuery({
    queryKey: ['allBrokerages'],
    queryFn: () => base44.entities.Brokerage.list(),
  });

  const filtered = brokerages.filter(b =>
    b.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSetupBrokerage = async () => {
    if (!firmName.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const created = await base44.entities.Brokerage.create({
        name: firmName.trim(),
        plan_tier: 'basic',
        status: 'trial',
        primary_contact_name: '',
        subscribed_at: new Date().toISOString(),
      });
      await base44.auth.updateMe({
        portal_role: 'brokerage_admin',
        brokerage_id: created.id,
      });
      queryClient.invalidateQueries(['myBrokerage']);
      queryClient.invalidateQueries(['authMe']);
      setStep('done');
    } catch (e) {
      setError(e.message || 'Failed to set up brokerage');
    }
    setSubmitting(false);
  };

  const handleLinkToBrokerage = async (brokerageId, roleName) => {
    setSubmitting(true);
    setError(null);
    try {
      await base44.auth.updateMe({
        portal_role: roleName,
        brokerage_id: brokerageId,
      });
      queryClient.invalidateQueries(['myBrokerage']);
      queryClient.invalidateQueries(['authMe']);
      setStep('done');
    } catch (e) {
      setError(e.message || 'Failed to link to brokerage');
    }
    setSubmitting(false);
  };

  // ── Done screen ──
  if (step === 'done') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#0a0a0a' }}>
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)', border: '2px solid #22c55e' }}>
            <CheckCircle2 className="w-8 h-8" style={{ color: '#22c55e' }} />
          </div>
          <h1 className="text-2xl font-serif text-white mb-2">You're set up</h1>
          <p className="text-sm text-gray-400 mb-6">
            {role === 'broker' && isManaging
              ? 'Your brokerage is created. You now have full access to manage escrow, listings, agents, and marketing.'
              : 'You\'re linked to your brokerage. Your managing broker will confirm your access level.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl gold-btn text-sm font-bold"
          >
            Enter Portal <ArrowRight className="w-4 h-4 inline ml-1" />
          </button>
        </div>
      </div>
    );
  }

  // ── Main onboarding flow ──
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#0a0a0a' }}>
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: GOLD }}>
            Broker/Agent Portal
          </p>
          <h1 className="text-3xl font-serif text-white">Subscriber Identification</h1>
          <p className="text-sm text-gray-500 mt-2">
            We need to verify your role to set the right security protocol for data review and input.
          </p>
        </div>

        {/* Step: Identify — Broker or Agent? */}
        {step === 'identify' && (
          <div className="space-y-3">
            <RoleCard
              icon={Briefcase}
              title="I am a Broker"
              desc="I hold a broker license and manage or co-manage a real estate firm."
              onClick={() => { setRole('broker'); setStep('broker_type'); }}
            />
            <RoleCard
              icon={User}
              title="I am an Agent"
              desc="I hold a salesperson license and work under a managing broker."
              onClick={() => { setRole('agent'); setStep('find_brokerage'); }}
            />
          </div>
        )}

        {/* Step: Broker type — Managing or not? */}
        {step === 'broker_type' && (
          <div>
            <button onClick={() => setStep('identify')} className="text-xs text-gray-500 hover:text-white mb-4 flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Back
            </button>
            <div className="space-y-3">
              <RoleCard
                icon={Shield}
                title="I am the Managing Broker"
                desc="I hold the DRE broker license for my firm. I can review and input all brokerage data — escrow, listings, agents, marketing."
                badge="FULL ACCESS"
                onClick={() => { setIsManaging(true); setStep('setup_brokerage'); }}
              />
              <RoleCard
                icon={Building2}
                title="I am a Broker (not managing)"
                desc="I hold a broker license but work under a separate managing broker. I can input my own listings and clients."
                badge="LIMITED INPUT"
                onClick={() => { setIsManaging(false); setStep('find_brokerage'); }}
              />
            </div>
          </div>
        )}

        {/* Step: Set up brokerage (managing broker) */}
        {step === 'setup_brokerage' && (
          <div>
            <button onClick={() => setStep('broker_type')} className="text-xs text-gray-500 hover:text-white mb-4 flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Back
            </button>
            <div className="rounded-2xl p-6" style={{ background: '#111', border: `1px solid ${GOLD}30` }}>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5" style={{ color: GOLD }} />
                <h2 className="text-lg font-serif text-white">Set Up Your Brokerage</h2>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                As managing broker, you'll have full access to review and input all data for your firm. Enter your firm name to create your brokerage profile.
              </p>
              <label className="block text-[10px] font-black tracking-widest uppercase mb-1.5" style={{ color: GOLD }}>
                Firm Name
              </label>
              <input
                type="text"
                value={firmName}
                onChange={(e) => setFirmName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSetupBrokerage()}
                placeholder="e.g. Wisdom Properties"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-lg placeholder-gray-600 focus:outline-none focus:border-dyson-gold/50 mb-4"
                autoFocus
              />
              {error && <p className="text-xs text-red-400 mb-3">{error}</p>}
              <button
                onClick={handleSetupBrokerage}
                disabled={!firmName.trim() || submitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl gold-btn text-sm font-bold disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {submitting ? 'Creating…' : 'Create Brokerage & Enter'}
              </button>
            </div>
          </div>
        )}

        {/* Step: Find brokerage (broker not managing, or agent) */}
        {step === 'find_brokerage' && (
          <div>
            <button
              onClick={() => setStep(role === 'broker' ? 'broker_type' : 'identify')}
              className="text-xs text-gray-500 hover:text-white mb-4 flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" /> Back
            </button>
            <div className="rounded-2xl p-6" style={{ background: '#111', border: `1px solid ${GOLD}30` }}>
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-5 h-5" style={{ color: GOLD }} />
                <h2 className="text-lg font-serif text-white">
                  {role === 'agent' ? 'Which brokerage are you with?' : 'Find your brokerage'}
                </h2>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                {role === 'agent'
                  ? 'Select your firm. Your managing broker will confirm your access. As an agent, you can input your own clients and view your own data.'
                  : 'Select your firm. Your managing broker will confirm your access. As a broker, you can input your own listings and clients.'}
              </p>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search brokerages…"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-dyson-gold/50"
                  autoFocus
                />
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filtered.length === 0 ? (
                  <div className="text-center py-6">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-gray-700" />
                    <p className="text-sm text-gray-500">No brokerages found.</p>
                    <p className="text-xs text-gray-600 mt-1">
                      If your firm isn't listed, ask your managing broker to set up the brokerage first.
                    </p>
                  </div>
                ) : (
                  filtered.map(b => (
                    <button
                      key={b.id}
                      onClick={() => handleLinkToBrokerage(b.id, role === 'agent' ? 'agent' : 'broker')}
                      disabled={submitting}
                      className="w-full flex items-center justify-between p-3 rounded-xl transition-all hover:scale-[1.01] disabled:opacity-50"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <div className="flex items-center gap-3">
                        <Building2 className="w-4 h-4" style={{ color: GOLD }} />
                        <div className="text-left">
                          <p className="text-sm font-serif text-white">{b.name}</p>
                          <p className="text-[10px] text-gray-500">
                            {b.plan_tier === 'founder' ? 'Founder' : b.status || '—'}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-600" />
                    </button>
                  ))
                )}
              </div>
              {error && <p className="text-xs text-red-400 mt-3">{error}</p>}
            </div>
          </div>
        )}

        {/* Security protocol explainer */}
        <div className="mt-6 flex items-start gap-2 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: GOLD }} />
          <p className="text-[10px] text-gray-600 leading-relaxed">
            Your role determines your security protocol. Managing brokers can review and input all brokerage data. Brokers input their own listings and clients. Agents input their own clients only. All access is scoped to your brokerage.
          </p>
        </div>
      </div>
    </div>
  );
}

function RoleCard({ icon: Icon, title, desc, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-5 rounded-2xl transition-all hover:scale-[1.01]"
      style={{ background: '#111', border: `1px solid ${GOLD}25` }}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}30` }}>
          <Icon className="w-6 h-6" style={{ color: GOLD }} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-serif text-white">{title}</h3>
            {badge && (
              <span className="text-[8px] font-black tracking-widest px-2 py-0.5 rounded-full" style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}30`, color: GOLD }}>
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">{desc}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-700" />
      </div>
    </button>
  );
}