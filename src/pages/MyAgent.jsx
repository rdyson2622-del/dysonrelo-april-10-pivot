import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Shield, Phone, Mail, MapPin, Star, Clock, CheckCircle, Globe,
  ChevronRight, ChevronDown, ChevronUp, BookOpen, Award, Search,
  FileCheck, UserCheck, Mic, Volume2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const GOLD = '#D4AF37';
const DNN_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";

const VETTING_STEPS = [
  {
    icon: Search,
    title: 'Market Research',
    detail: 'We identify the top 20 active agents in your destination market by production volume, DOM performance, and neighborhood specialization.',
  },
  {
    icon: FileCheck,
    title: 'DRE Verification',
    detail: 'Every agent\'s California (or state) DRE license is verified as current, in good standing, and free of disciplinary actions.',
  },
  {
    icon: Award,
    title: 'Production Screening',
    detail: 'We review closed transaction history — minimum 12 closings per year, buyer-side experience, and price point alignment to your budget.',
  },
  {
    icon: UserCheck,
    title: 'Personality Interview',
    detail: 'Bob Dyson\'s team conducts a direct interview. Communication style, responsiveness, and cultural fit are evaluated personally — not by algorithm.',
  },
  {
    icon: Shield,
    title: 'Bureau Agreement',
    detail: 'Every partner agent signs our Bureau Partnership Agreement — protecting your referral and ensuring they receive no fee until you close.',
  },
];

// Charlie speak helper
async function speakText(text) {
  try {
    const res = await base44.functions.invoke('charlieSpeak', { text });
    if (res?.data?.audio_url) {
      const audio = new Audio(res.data.audio_url);
      audio.play();
    }
  } catch {}
}

// Vetting process section
function VettingProcess() {
  const [open, setOpen] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const fullText = VETTING_STEPS.map((s, i) => `Step ${i + 1}: ${s.title}. ${s.detail}`).join(' ');

  const handleSpeak = async () => {
    setSpeaking(true);
    await speakText(`Here is how we vet every DNN partner agent. ${fullText} That's the Dyson standard. Zero shortcuts.`);
    setSpeaking(false);
  };

  return (
    <div className="rounded-2xl overflow-hidden mb-5" style={{ background: '#0d0d0d', border: '1px solid rgba(212,175,55,0.2)' }}>
      {/* Header — always visible */}
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between px-5 py-4 text-left">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4" style={{ color: GOLD }} />
          <p className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>Our 5-Step Vetting Process</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={e => { e.stopPropagation(); handleSpeak(); }}
            className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full transition-all"
            style={{ background: 'rgba(212,175,55,0.1)', color: speaking ? '#4ade80' : GOLD, border: '1px solid rgba(212,175,55,0.2)' }}
          >
            {speaking ? <Volume2 className="w-3 h-3 animate-pulse" /> : <Mic className="w-3 h-3" />}
            {speaking ? 'Speaking...' : 'Hear This'}
          </button>
          {open ? <ChevronUp className="w-4 h-4" style={{ color: GOLD }} /> : <ChevronDown className="w-4 h-4" style={{ color: GOLD }} />}
        </div>
      </button>

      {/* Collapsed preview — always show step titles */}
      {!open && (
        <div className="px-5 pb-4 flex flex-wrap gap-2">
          {VETTING_STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.15)', color: 'rgba(255,255,255,0.7)' }}>
                <Icon className="w-3 h-3" style={{ color: GOLD }} /> {s.title}
              </div>
            );
          })}
        </div>
      )}

      {/* Expanded steps */}
      {open && (
        <div className="px-5 pb-5 space-y-3 border-t" style={{ borderColor: 'rgba(212,175,55,0.1)' }}>
          {VETTING_STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="flex items-start gap-3 pt-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <Icon className="w-4 h-4" style={{ color: GOLD }} />
                </div>
                <div>
                  <p className="font-bold text-white mb-0.5" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', letterSpacing: '0.03em' }}>Step {i + 1}: {s.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Inter, sans-serif' }}>{s.detail}</p>
                </div>
              </div>
            );
          })}
          <div className="mt-3 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <p className="text-xs italic leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
              "I've been vetting agents for 54 years. Every Bureau agent has passed my personal review. This is not a directory — it's a guarantee." — Bob Dyson
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Individual agent profile card
function AgentProfileCard({ agent }) {
  const [open, setOpen] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const profileText = `${agent.agent_name} is a DNN-verified partner agent${agent.brokerage ? ` with ${agent.brokerage}` : ''}. ${agent.markets?.length ? `They specialize in ${agent.markets.join(', ')}.` : ''} ${agent.notes || ''}`;

  const handleSpeak = async (e) => {
    e.stopPropagation();
    setSpeaking(true);
    await speakText(profileText);
    setSpeaking(false);
  };

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}>
      {/* Profile header — always visible */}
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center gap-4 px-5 py-4 text-left">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center overflow-hidden"
          style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}>
          {agent.photo_url
            ? <img src={agent.photo_url} alt={agent.agent_name} className="w-full h-full object-cover" />
            : <span className="text-xl font-black" style={{ color: GOLD }}>{agent.agent_name?.[0]}</span>
          }
        </div>

        {/* Name + badges */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-black text-white">{agent.agent_name}</p>
            <span className="flex items-center gap-1 text-[9px] font-black px-1.5 py-0.5 rounded-full"
              style={{ background: 'rgba(34,197,94,0.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}>
              <Shield className="w-2.5 h-2.5" /> DNN VERIFIED
            </span>
          </div>
          {agent.brokerage && <p className="text-xs mt-0.5 font-semibold" style={{ color: GOLD }}>{agent.brokerage}</p>}
          {agent.markets?.length > 0 && (
            <p className="text-xs mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>
              <MapPin className="w-3 h-3 inline mr-1" />{agent.markets.join(', ')}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button onClick={handleSpeak}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
            style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
            {speaking ? <Volume2 className="w-3.5 h-3.5 animate-pulse" style={{ color: '#4ade80' }} /> : <Mic className="w-3.5 h-3.5" style={{ color: GOLD }} />}
          </button>
          {open ? <ChevronUp className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} /> : <ChevronDown className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />}
        </div>
      </button>

      {/* Expanded profile */}
      {open && (
        <div className="px-5 pb-5 border-t space-y-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          {/* Vetting badges */}
          <div className="flex flex-wrap gap-2 pt-4">
            {[
              'DRE Verified',
              '12+ Closings/yr',
              'Bureau Agreement Signed',
              'Personally Interviewed',
              'Production Screened',
            ].map(badge => (
              <span key={badge} className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(212,175,55,0.08)', color: GOLD, border: '1px solid rgba(212,175,55,0.2)' }}>
                <CheckCircle className="w-2.5 h-2.5" /> {badge}
              </span>
            ))}
          </div>

          {/* DRE */}
          {agent.dre_number && (
            <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <FileCheck className="w-3.5 h-3.5 shrink-0" style={{ color: GOLD }} />
              DRE #{agent.dre_number} · {agent.state}
            </div>
          )}

          {/* Notes / bio */}
          {agent.notes && (
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{agent.notes}</p>
          )}

          {/* Contact */}
          <div className="flex flex-col gap-2 pt-1">
            {agent.phone && (
              <a href={`tel:${agent.phone}`} className="flex items-center gap-2 text-sm font-semibold text-white hover:text-yellow-400 transition-colors">
                <Phone className="w-4 h-4 shrink-0" style={{ color: GOLD }} /> {agent.phone}
              </a>
            )}
            {agent.email && (
              <a href={`mailto:${agent.email}`} className="flex items-center gap-2 text-sm text-white hover:text-yellow-400 transition-colors">
                <Mail className="w-4 h-4 shrink-0" style={{ color: GOLD }} /> {agent.email}
              </a>
            )}
          </div>

          {/* Bureau seal */}
          <div className="rounded-xl p-3 flex items-start gap-2" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <img src={DNN_LOGO} alt="DNN" className="h-4 w-auto opacity-60 mt-0.5 shrink-0" />
            <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
              This agent has been personally reviewed, licensed-verified, and accepted into the DNN Bureau Partnership Program. Your referral is protected. You owe nothing — this service is always free to buyers.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Pending card
function PendingCard() {
  return (
    <div className="rounded-2xl p-8 text-center space-y-4 mb-5" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
        style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)' }}>
        <Star className="w-7 h-7" style={{ color: GOLD }} />
      </div>
      <div>
        <h2 className="serif-heading text-white mb-2" style={{ fontSize: '1.3rem' }}>Your Personal Agent Match Is Pending</h2>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem' }}>
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

// Assigned agent (featured at top)
function AssignedAgentBanner({ agent }) {
  return (
    <div className="rounded-2xl p-5 mb-5"
      style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.04))', border: '1px solid rgba(212,175,55,0.35)' }}>
      <div className="flex items-center gap-2 mb-3">
        <img src={DNN_LOGO} alt="DNN" className="h-5 w-auto opacity-80" />
        <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>Your Assigned DNN Bureau Agent</span>
      </div>
      <p className="serif-heading text-white" style={{ fontSize: '1.4rem' }}>{agent.co_brand_label || agent.agent_name}</p>
      {agent.brokerage && <p className="text-sm font-semibold mt-0.5" style={{ color: GOLD }}>{agent.brokerage}</p>}
      {agent.markets?.length > 0 && <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{agent.markets.join(', ')}</p>}
    </div>
  );
}

// Charlie teaser
function CharlieTeaser() {
  return (
    <div className="rounded-xl p-4 mt-5" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(99,102,241,0.15)' }}>
          <Globe className="w-4 h-4" style={{ color: '#818cf8' }} />
        </div>
        <div className="flex-1">
          <p className="serif-heading text-white mb-1" style={{ fontSize: '1rem' }}>Questions about your agent match?</p>
          <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '0.9rem' }}>
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
  });

  const myAgent = agents.find(a =>
    a.agent_name === client?.agent_name ||
    a.email === client?.assigned_agent
  );

  // Other agents (the "bureau" — show all active agents as browseable profiles)
  const bureauAgents = agents.filter(a => !myAgent || a.id !== myAgent.id);

  return (
    <div className="min-h-screen p-6" style={{ background: '#080808' }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4" style={{ color: GOLD }} />
            <p className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>DNN Agent Bureau</p>
          </div>
          <h1 className="display-heading text-white" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)', letterSpacing: '0.12em' }}>VETTED REAL ESTATE AGENTS</h1>
          <p className="text-sm mt-2 leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '1rem' }}>
            Every agent below has passed Bob Dyson's personal 5-step vetting process. Zero shortcuts. Your referral is always free.
          </p>
        </div>

        {/* Vetting Process — collapsible */}
        <VettingProcess />

        {/* Assigned agent (if any) */}
        {myAgent && <AssignedAgentBanner agent={myAgent} />}
        {myAgent && <AgentProfileCard agent={myAgent} />}

        {/* Pending state (if no assignment yet) */}
        {!myAgent && <PendingCard />}

        {/* Bureau — all active agents */}
        {bureauAgents.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px flex-1" style={{ background: 'rgba(212,175,55,0.15)' }} />
              <p className="text-[10px] font-black tracking-[0.3em] uppercase" style={{ color: GOLD, fontFamily: 'Inter, sans-serif' }}>The DNN Bureau</p>
              <div className="h-px flex-1" style={{ background: 'rgba(212,175,55,0.15)' }} />
            </div>
            <div className="space-y-3">
              {bureauAgents.map(agent => (
                <AgentProfileCard key={agent.id} agent={agent} />
              ))}
            </div>
          </div>
        )}

        {/* Charlie teaser */}
        <CharlieTeaser />

      </div>
    </div>
  );
}