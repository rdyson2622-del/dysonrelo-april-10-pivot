import React from 'react';
import { Users, MapPinned, ShieldCheck } from 'lucide-react';

const GOLD = '#D4AF37';

const BENEFITS = [
  {
    icon: Users,
    title: 'A Warm Referral Pipeline',
    desc: "Our relocating clients need title, lending, inspection, moving, staging, and repair help the moment they land in your area. Vetted vendors get introduced directly to clients moving into the towns they serve.",
  },
  {
    icon: MapPinned,
    title: 'National + Local Coverage',
    desc: "Whether you're a local inspector in one town or a national title company covering dozens of markets, you can be matched to relocating clients by the exact areas you serve.",
  },
  {
    icon: ShieldCheck,
    title: 'Fast, Simple Vetting',
    desc: "No lengthy onboarding. Tell us your service area and we run a rapid vetting pass — which also strengthens the local market intel we give our relocating clients.",
  },
];

export default function VendorBenefits() {
  return (
    <div className="w-full max-w-3xl mx-auto mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
      {BENEFITS.map((b) => (
        <div
          key={b.title}
          className="p-5 rounded-2xl"
          style={{ background: '#111', border: `1px solid rgba(212,175,55,0.25)` }}
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