import React from 'react';
import { Link } from 'react-router-dom';
import { Star, DollarSign, Monitor, ArrowRight, X, Check } from 'lucide-react';

const GOLD = '#D4AF37';
const TAN = '#ede0cc';

const PROCESS = [
  {
    icon: Star,
    number: '1',
    title: 'The Lead',
    body: 'You receive a high-intent, Dyson-vetted relocation lead — a client who has already completed our intake process, defined their destination, and committed to the move.',
  },
  {
    icon: DollarSign,
    number: '2',
    title: 'The Fee',
    body: 'Standard 35% total referral/management fee: 25% goes to the Sending Agent\'s brokerage, 10% to Dyson Relocation Management. Paid broker-to-broker at closing.',
  },
  {
    icon: Monitor,
    number: '3',
    title: 'The Tech',
    body: 'Use your Dyson Dashboard to update the client\'s Roadmap at each milestone. The Sending Agent stays informed in real time — building trust and protecting your reputation.',
  },
];

const COMPARISON = [
  { label: 'Client Type', boutique: 'Pre-vetted, high-intent relocation clients', bigbox: 'Cold, unqualified directory leads' },
  { label: 'Referral Fee', boutique: '25% goes to peer agent — fully protected', bigbox: '30–40% skimmed by corporate relo division' },
  { label: 'Territory', boutique: 'Exclusive per market — no competing PRN agent', bigbox: 'Shared with dozens of franchisees' },
  { label: 'Co-Marketing', boutique: 'Featured in DNN — broadcast to thousands', bigbox: 'No co-marketing infrastructure' },
  { label: 'Logistics', boutique: 'Full concierge support: AI, escrow monitoring, city guides', bigbox: 'Cookie-cutter handoffs, no follow-through' },
];

export default function AdminPartnerBenefits() {
  return (
    <div className="min-h-screen px-6 py-10" style={{ background: TAN }}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-black tracking-[0.3em] mb-2" style={{ color: GOLD }}>PRN RECEIVING AGENT PROGRAM</p>
          <h1 className="font-black text-4xl leading-tight mb-4" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#1a1a1a' }}>
            The Boutique Advantage.
          </h1>
          <p className="text-base leading-relaxed" style={{ color: '#4a3a28', maxWidth: 560 }}>
            Most relocation companies favor "Big Box" franchises — corporate-owned, fee-heavy, and impersonal. We only work with vetted independent boutique agents who compete on service, not brand name.
          </p>
        </div>

        {/* Process Steps */}
        <p className="text-xs font-black tracking-[0.25em] uppercase mb-4" style={{ color: GOLD }}>HOW IT WORKS</p>
        <div className="grid gap-4 mb-10">
          {PROCESS.map(({ icon: Icon, number, title, body }) => (
            <div key={number} className="flex gap-5 rounded-2xl p-6"
              style={{ background: '#fff8ee', border: '1px solid rgba(212,175,55,0.3)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-black text-lg"
                style={{ background: 'rgba(212,175,55,0.15)', color: GOLD }}>
                {number}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4" style={{ color: GOLD }} />
                  <p className="font-black text-sm tracking-wide" style={{ color: '#1a1a1a' }}>{title}</p>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#4a3a28' }}>{body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <p className="text-xs font-black tracking-[0.25em] uppercase mb-4" style={{ color: GOLD }}>BOUTIQUE vs. BIG BOX</p>
        <div className="rounded-2xl overflow-hidden mb-10" style={{ border: '1px solid rgba(212,175,55,0.3)' }}>
          {/* Table Header */}
          <div className="grid grid-cols-3 px-4 py-3" style={{ background: '#0d0d0d' }}>
            <div />
            <p className="text-xs font-black text-center tracking-widest" style={{ color: GOLD }}>PRN BOUTIQUE</p>
            <p className="text-xs font-black text-center tracking-widest" style={{ color: '#666' }}>BIG BOX FRANCHISE</p>
          </div>
          {COMPARISON.map((row, i) => (
            <div key={i} className="grid grid-cols-3 px-4 py-4 text-sm"
              style={{ background: i % 2 === 0 ? '#fff8ee' : 'rgba(212,175,55,0.04)', borderTop: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="font-black text-xs" style={{ color: '#1a1a1a' }}>{row.label}</p>
              <div className="flex items-start gap-1.5 px-2">
                <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: '#10b981' }} />
                <p className="text-xs leading-snug" style={{ color: '#2a1f0e' }}>{row.boutique}</p>
              </div>
              <div className="flex items-start gap-1.5 px-2">
                <X className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
                <p className="text-xs leading-snug" style={{ color: '#6b5c45' }}>{row.bigbox}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="rounded-2xl p-8 text-center" style={{ background: '#0d0d0d', border: `2px solid ${GOLD}` }}>
          <p className="text-xs font-black tracking-[0.25em] uppercase mb-2" style={{ color: GOLD }}>READY TO JOIN THE PRN?</p>
          <h2 className="font-black text-2xl text-white mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Claim Your Market Territory
          </h2>
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Only one boutique agent per market. Once your territory is claimed, no other PRN agent competes with you.
          </p>
          <Link to="/admin/roster"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-black text-sm tracking-wide transition-all hover:scale-[1.02]"
            style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}>
            <ArrowRight className="w-4 h-4" />
            View the Partner Roster
          </Link>
        </div>

        <div className="h-12" />
      </div>
    </div>
  );
}