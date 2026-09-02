import React from 'react';
import { Users, Home, TrendingUp, DollarSign } from 'lucide-react';

const GOLD = '#D4AF37';

const POINTS = [
  {
    icon: Users,
    title: 'Meet People Wherever They Live',
    body: "Your sphere of influence isn't limited to your local MLS. Anyone you've ever helped — no matter where they've since moved — is still your relationship to keep.",
  },
  {
    icon: Home,
    title: 'Real Relocation Support, Under Your Name',
    body: 'We match your people with a vetted destination agent, handle the moving logistics, and guide them through a new city — all while you stay the face of the referral.',
  },
  {
    icon: TrendingUp,
    title: 'Ongoing Homeowner Help, Not Just a Closing',
    body: "We stay useful to your clients long after they move in — refinancing timing, maintenance reminders, market updates — so you remain their trusted resource for life, not just the transaction.",
  },
];

export default function AgentOpportunityPitch({ preferredName }) {
  return (
    <div className="rounded-2xl p-6" style={{ background: '#111', border: `1px solid ${GOLD}30` }}>
      <p className="text-[10px] font-black tracking-[0.2em] uppercase mb-2" style={{ color: GOLD }}>Your Referral Network Opportunity</p>
      <p className="text-sm text-gray-300 leading-relaxed mb-5">
        Hi {preferredName || 'there'} — wherever your clients and friends are headed next, across town or across the
        country, you don't have to let go of that relationship. Here's how the Dyson &amp; Dyson Relocation Network
        keeps you connected and paid.
      </p>

      <div className="space-y-4 mb-5">
        {POINTS.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.title} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}40` }}>
                <Icon className="w-4 h-4" style={{ color: GOLD }} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{p.title}</p>
                <p className="text-xs text-gray-400 leading-relaxed mt-0.5">{p.body}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid ${GOLD}40` }}>
        <DollarSign className="w-5 h-5 shrink-0 mt-0.5" style={{ color: GOLD }} />
        <p className="text-xs text-white leading-relaxed">
          <span className="font-bold">Every buyer or seller you refer earns you a referral fee</span> when their
          transaction closes — no extra work on your part. We handle the vetting, the matching, and the transaction
          coordination. Watch for our weekly market broadcasts and tip sheets — practical talking points to keep the
          conversation going with your sphere so the referrals keep flowing.
        </p>
      </div>
    </div>
  );
}