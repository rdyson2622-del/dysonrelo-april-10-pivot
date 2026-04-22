import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Shield, Phone, Mail, MapPin, Star, Clock, CheckCircle, Globe, ChevronRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const GOLD = '#D4AF37';
const DNN_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";

// DNN Bureau Education block
function DnnBureauBlock() {
  const points = [
    'Every partner agent is personally reviewed by Bob Dyson — 54 years of industry expertise.',
    'DRE license verified, production record screened, and personality-matched to your move.',
    'Your referral is protected under our Bureau Partnership Agreement — you owe nothing at closing.',
    'DNN earns a nominal referral fee from the agent at close. You pay zero. Always.',
  ];

  return (
    <div className="rounded-2xl p-5 mb-4" style={{ background: '#0d0d0d', border: '1px solid rgba(212,175,55,0.15)' }}>
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="w-4 h-4" style={{ color: GOLD }} />
        <p className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>How the Agent Bureau Works</p>
      </div>
      <div className="space-y-2.5">
        {points.map((pt, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <CheckCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: GOLD }} />
            <p className="text-xs text-slate-400 leading-relaxed">{pt}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          The DNN Agent Bureau is a co-branded lead partnership network. Each Bureau Chief serves an exclusive market territory and delivers DNN intelligence to their client network — bringing you vetted guidance without the noise.
        </p>
      </div>
    </div>
  );
}

// Charlie integration teaser
function CharlieTeaser() {
  return (
    <div className="rounded-xl p-4 mt-4" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(99,102,241,0.15)' }}>
          <Globe className="w-4 h-4" style={{ color: '#818cf8' }} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-white mb-1">Questions about your agent match?</p>
          <p className="text-xs text-slate-500 leading-relaxed mb-3">
            Charlie can explain the vetting process, help you prepare questions for your first agent call, and walk you through what to expect in your relocation timeline.
          </p>
          <Link to="/chat"
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
            style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)' }}>
            Chat with Charlie <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Agent card when assigned
function AgentCard({ myAgent }) {
  return (
    <>
      {/* Co-brand banner */}
      <div className="rounded-2xl p-5 mb-4"
        style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.04))', border: '1px solid rgba(212,175,55,0.3)' }}>
        <div className="flex items-center gap-2 mb-2">
          <img src={DNN_LOGO} alt="DNN" className="h-5 w-auto opacity-80" />
          <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Intelligence Bureau</span>
        </div>
        <p className="text-xs text-slate-400 mb-1">Real estate intelligence brought to you by DNN in partnership with</p>
        <p className="text-xl font-black text-white">{myAgent.co_brand_label || myAgent.agent_name}</p>
        {myAgent.brokerage && <p className="text-sm mt-1 font-semibold" style={{ color: GOLD }}>{myAgent.brokerage}</p>}
      </div>

      {/* Agent card */}
      <div className="rounded-2xl p-5 space-y-4 mb-4" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)' }}>
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
      <div className="rounded-xl p-4 text-center mb-4" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
        <p className="text-xs text-slate-500 leading-relaxed">
          This agent has been vetted and approved by Dyson & Dyson Real Estate Concierge under our Bureau Partnership Agreement. Your referral is protected. You owe nothing — the service is always free to buyers.
        </p>
      </div>
    </>
  );
}

// Pending state
function PendingCard() {
  return (
    <div className="rounded-2xl p-8 text-center space-y-4 mb-4" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
        style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)' }}>
        <Star className="w-7 h-7" style={{ color: GOLD }} />
      </div>
      <div>
        <h2 className="text-white font-bold text-lg mb-2">Agent Assignment Pending</h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          Your Dyson & Dyson concierge is identifying your ideal vetted agent based on your destination market, priorities, and personality fit. You'll be notified the moment your match is confirmed.
        </p>
      </div>
      <div className="flex items-center justify-center gap-2 text-xs" style={{ color: GOLD }}>
        <Clock className="w-3.5 h-3.5" />
        <span>Typically assigned within 24 hours of intake</span>
      </div>
      <Link to="/chat"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-black transition-all hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37)' }}>
        Ask Charlie for an Update <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

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

  const { data: agents = [] } = useQuery({
    queryKey: ['partnerAgents'],
    queryFn: () => base44.entities.PartnerAgent.filter({ status: 'active' }, '-created_date', 50),
    enabled: !!client,
  });

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

        {myAgent ? <AgentCard myAgent={myAgent} /> : <PendingCard />}

        {/* DNN Bureau Education */}
        <DnnBureauBlock />

        {/* Charlie Teaser */}
        <CharlieTeaser />
      </div>
    </div>
  );
}