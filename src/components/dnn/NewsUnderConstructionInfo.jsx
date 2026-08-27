import React from 'react';
import { Newspaper, TrendingUp, Users, Mic2, Building2 } from 'lucide-react';
import PortalSubscribeForm from '@/components/portal/PortalSubscribeForm';

const GOLD = '#D4AF37';

const COVERAGE = [
  {
    icon: Newspaper,
    title: 'Daily Headlines',
    desc: 'A quick, anchored rundown of the real estate stories that actually move markets — curated every day, not buried in a feed.',
  },
  {
    icon: TrendingUp,
    title: 'Market Data',
    desc: 'Rates, inventory, and price trends translated into plain English — so you know what it means for your move, not just the number.',
  },
  {
    icon: Users,
    title: 'Agent & Broker Intel',
    desc: 'Who is producing, who is vetted, and what is happening inside the brokerages we work with — the intelligence side of the news.',
  },
  {
    icon: Building2,
    title: 'Corporate Relocations',
    desc: 'What major employers and transferees need to know as relocation activity shifts across markets.',
  },
];

export default function NewsUnderConstructionInfo() {
  return (
    <div className="w-full" style={{ background: '#0d0d0d' }}>
      <div className="max-w-4xl mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.25em] uppercase"
            style={{ background: 'rgba(212,175,55,0.1)', border: `1px solid ${GOLD}40`, color: GOLD }}
          >
            <Mic2 className="w-3.5 h-3.5" /> DNN News Department
          </div>
          <h2 className="display-heading text-2xl sm:text-3xl mb-3" style={{ color: '#fff', letterSpacing: '0.1em' }}>
            WHAT DNN NEWS WILL BRING YOU
          </h2>
          <p className="text-sm sm:text-base max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Our AI-anchored daily broadcast — Charlie and Bob at the desk — is still in production. Here's what it
            covers once it's live.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-14">
          {COVERAGE.map((c) => (
            <div
              key={c.title}
              className="p-5 rounded-2xl"
              style={{ background: '#161616', border: '1px solid rgba(212,175,55,0.2)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}
              >
                <c.icon className="w-5 h-5" style={{ color: GOLD }} />
              </div>
              <p className="font-bold text-sm mb-1.5 text-white">{c.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{c.desc}</p>
            </div>
          ))}
        </div>

        {/* Meet the Anchors */}
        <div className="text-center mb-12">
          <p className="text-[10px] font-black tracking-[0.25em] uppercase mb-4" style={{ color: GOLD }}>
            Meet the Anchors
          </p>
          <div className="flex items-center justify-center gap-10">
            <div>
              <div
                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 text-lg font-black"
                style={{ background: 'rgba(212,175,55,0.15)', border: `2px solid ${GOLD}`, color: GOLD }}
              >
                C
              </div>
              <p className="text-sm font-bold text-white">Charlie</p>
              <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.55)' }}>Lead Anchor</p>
            </div>
            <div>
              <div
                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 text-lg font-black"
                style={{ background: 'rgba(212,175,55,0.15)', border: `2px solid ${GOLD}`, color: GOLD }}
              >
                B
              </div>
              <p className="text-sm font-bold text-white">Bob</p>
              <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.55)' }}>Market Correspondent</p>
            </div>
          </div>
        </div>

        <p className="text-center text-sm font-semibold mb-4" style={{ color: '#fff' }}>
          Get notified the moment we go live. Join the intelligence list.
        </p>
        <PortalSubscribeForm
          portalName="DNN Daily News"
          source="Broadcast Show Under Construction"
          roleKey="client"
          dest="/dnn-news"
        />
      </div>
    </div>
  );
}