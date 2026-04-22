import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Shield, Phone, Mail, MapPin, Star, Clock } from 'lucide-react';

const GOLD = '#D4AF37';

export default function MyAgent() {
  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['myClientRecord', user?.email],
    queryFn: () => base44.entities.RelocationClient.filter({ email: user.email }, '-created_date', 1),
    enabled: !!user?.email,
  });

  const client = clients[0];

  // Try to find partner agent if assigned
  const { data: agents = [] } = useQuery({
    queryKey: ['partnerAgents'],
    queryFn: () => base44.entities.PartnerAgent.filter({ status: 'active' }, '-created_date', 50),
    enabled: !!client,
  });

  // Match by agent_name or assigned_agent
  const myAgent = agents.find(a =>
    a.agent_name === client?.agent_name ||
    a.email === client?.assigned_agent
  );

  return (
    <div className="min-h-screen p-6" style={{ background: '#080808' }}>
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase"
            style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', color: GOLD }}>
            <Shield className="w-3 h-3" /> My Agent
          </div>
          <h1 className="text-2xl font-black text-white">Your Relocation Agent</h1>
          <p className="text-sm text-slate-500 mt-1">Your personally vetted, DNN-verified real estate partner.</p>
        </div>

        {myAgent ? (
          <>
            {/* Co-brand banner */}
            <div className="rounded-2xl p-5 mb-4" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))', border: '1px solid rgba(212,175,55,0.3)' }}>
              <p className="text-xs text-slate-400 mb-1">Intelligence brought to you by DNN in partnership with</p>
              <p className="text-xl font-black text-white">{myAgent.co_brand_label || myAgent.agent_name}</p>
              {myAgent.brokerage && <p className="text-sm mt-1" style={{ color: GOLD }}>{myAgent.brokerage}</p>}
            </div>

            {/* Agent card */}
            <div className="rounded-2xl p-5 space-y-4" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">{myAgent.agent_name}</h2>
                  {myAgent.dre_number && (
                    <p className="text-xs text-slate-500 mt-0.5">DRE #{myAgent.dre_number} · {myAgent.state}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold"
                  style={{ background: 'rgba(34,197,94,0.12)', color: '#4ade80' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> VERIFIED
                </div>
              </div>

              {myAgent.markets?.length > 0 && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: GOLD }} />
                  <p className="text-sm text-slate-300">{myAgent.markets.join(', ')}</p>
                </div>
              )}
              {myAgent.phone && (
                <a href={`tel:${myAgent.phone}`} className="flex items-center gap-2 text-sm text-white hover:text-yellow-400 transition-colors">
                  <Phone className="w-4 h-4 shrink-0" style={{ color: GOLD }} />
                  {myAgent.phone}
                </a>
              )}
              {myAgent.email && (
                <a href={`mailto:${myAgent.email}`} className="flex items-center gap-2 text-sm text-white hover:text-yellow-400 transition-colors">
                  <Mail className="w-4 h-4 shrink-0" style={{ color: GOLD }} />
                  {myAgent.email}
                </a>
              )}
            </div>

            {/* DNN Seal */}
            <div className="mt-4 rounded-xl p-4 text-center" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
              <p className="text-xs text-slate-500 leading-relaxed">
                This agent has been vetted and approved by Dyson & Dyson Real Estate Concierge. Your referral is protected under our Bureau Partnership Agreement.
              </p>
            </div>
          </>
        ) : (
          /* No agent assigned yet */
          <div className="rounded-2xl p-8 text-center space-y-4" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
              style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)' }}>
              <Star className="w-7 h-7" style={{ color: GOLD }} />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg mb-2">Agent Assignment Pending</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Your Dyson & Dyson concierge is in the process of identifying your ideal vetted agent. You'll be notified the moment your match is confirmed.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs" style={{ color: GOLD }}>
              <Clock className="w-3.5 h-3.5" />
              <span>Typically assigned within 24 hours of intake</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}