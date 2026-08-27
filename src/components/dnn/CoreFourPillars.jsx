import React from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, MapPinned, Brain, ShieldCheck } from 'lucide-react';

const GOLD = '#D4AF37';

const PILLARS = [
  { icon: Newspaper, title: 'News', desc: 'Daily, market-moving briefs.', path: null },
  { icon: MapPinned, title: 'Relocation', desc: 'End-to-end move tracking and management.', path: '/relocation-intake' },
  { icon: Brain, title: 'Intelligence', desc: 'Migration data, job market shifts, and interest rate trends.', path: '/solutions' },
  { icon: ShieldCheck, title: 'Transparency', desc: 'Clear roadmaps, vetted partners, and open communication.', path: '/transparency' },
];

export default function CoreFourPillars() {
  return (
    <div className="w-full" style={{ background: '#0d0d0d' }}>
      <div className="max-w-4xl mx-auto px-6 pt-14">
        <p className="text-[10px] font-black tracking-[0.3em] uppercase text-center mb-6" style={{ color: GOLD }}>
          What Is Dyson &amp; Dyson?
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {PILLARS.map((p) => {
            const Card = (
              <div
                className="h-full p-4 rounded-2xl text-center transition-all hover:scale-105"
                style={{ background: '#161616', border: '1px solid rgba(212,175,55,0.25)' }}
              >
                <div
                  className="w-9 h-9 mx-auto rounded-xl flex items-center justify-center mb-2"
                  style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}
                >
                  <p.icon className="w-4.5 h-4.5" style={{ color: GOLD }} />
                </div>
                <p className="font-black text-xs tracking-wide uppercase mb-1 text-white">{p.title}</p>
                <p className="text-[11px] leading-snug" style={{ color: 'rgba(255,255,255,0.6)' }}>{p.desc}</p>
              </div>
            );
            return p.path ? (
              <Link key={p.title} to={p.path}>{Card}</Link>
            ) : (
              <div key={p.title}>{Card}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
}