import React from 'react';
import { Users, MapPinned, ShieldCheck } from 'lucide-react';

const GOLD = '#D4AF37';

const BENEFITS = [
  {
    icon: Users,
    title: 'A Warm Referral Pipeline',
    desc: "Every relocating client needs a full team the moment they land — lenders, title & escrow officers, inspectors, appraisers, movers, stagers, and contractors. Vetted vendors of every profession get introduced directly to clients moving into the areas they serve.",
  },
  {
    icon: MapPinned,
    title: 'National + Local Coverage',
    desc: "Whether you're a local inspector or appraiser in one town, a title/escrow office covering a county, or a lender licensed nationwide, you're matched to relocating clients by the exact areas and services you provide.",
  },
  {
    icon: ShieldCheck,
    title: 'Fast, Simple Vetting',
    desc: "No lengthy onboarding, regardless of your profession. Tell us your service type and coverage area and we run a rapid vetting pass — which also strengthens the local market intel we give our relocating clients.",
  },
];

export default function VendorBenefits() {
  return (
    <div className="w-full max-w-3xl mx-auto mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
      {BENEFITS.map((b) => (
        <div
          key={b.title}
          className="p-5 rounded-2xl"
          style={{ background: '#0d0d0d', border: `1px solid rgba(212,175,55,0.25)` }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
            style={{ background: 'rgba(212,175,55,0.15)', border: `1px solid rgba(212,175,55,0.3)` }}
          >
            <b.icon className="w-4.5 h-4.5" style={{ color: GOLD }} />
          </div>
          <p className="font-black text-xs tracking-wide uppercase mb-1.5 text-white">{b.title}</p>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{b.desc}</p>
        </div>
      ))}
    </div>
  );
}