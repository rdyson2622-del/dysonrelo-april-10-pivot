import React from 'react';
import { Link } from 'react-router-dom';
import { Video, Users, MessagesSquare, Activity, Layers, ArrowRight } from 'lucide-react';

const GOLD = '#D4AF37';

const ALREADY_COVERED = ['Base44 app Admin, user/roles (Loraine/Mike)', 'Secrets (BatchData)', 'Legal & disclosures', 'Unsubscribe / stop-contact', 'Refer a Friend stubs', 'Prior Copilot visitor/workfile pieces', 'Experimental voice toggle'];

const NEW_PANELS = [
  { name: 'Explainer Library', icon: Video, description: 'Assign which Bob/Charlie videos + static copy sit on each Level 3 subject.', path: null, status: 'Coming soon' },
  { name: 'Preferred Client Roster', icon: Users, description: 'Who claimed Library; vault item counts; last active (no Subscribe).', path: '/admin/preferred-clients', status: 'Open' },
  { name: 'Team Thread Admin', icon: MessagesSquare, description: 'Selected agent attached to a client/property; thread visibility.', path: null, status: 'Coming soon' },
  { name: 'Active Property / Field-Test Log', icon: Activity, description: 'Recent searches that failed or looked empty (catch runaround).', path: null, status: 'Coming soon' },
  { name: 'Use Tiers (Level 3 Monetization)', icon: Layers, description: 'Not required for weekend field test.', path: null, status: 'Later' },
];

export default function ChiefPilotAdminNeeds() {
  return (
    <div className="mt-4 rounded-2xl p-5 shadow-xl" style={{ background: '#000', border: `1px solid ${GOLD}55` }}>
      <p className="text-xs font-bold tracking-[0.3em] mb-1" style={{ color: GOLD }}>CHIEF PILOT — ADMIN NEEDS</p>
      <p className="text-xs text-white/50 mb-4">Chief Pilot stays the design lab beside live. These panels extend Base44 Admin for the locked CoPilot.</p>

      <div className="mb-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1.5">Already covered</p>
        <p className="text-xs text-white/60 leading-relaxed">{ALREADY_COVERED.join(' · ')}</p>
      </div>

      <p className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">New / extend</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {NEW_PANELS.map(panel => {
          const Icon = panel.icon;
          const content = (
            <>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5">
                  <Icon className="w-4 h-4 text-white" style={{ color: GOLD }} />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5" style={{ color: panel.status === 'Open' ? '#10B981' : 'rgba(255,255,255,0.5)' }}>{panel.status}</span>
              </div>
              <h3 className="font-bold text-sm text-white mb-1">{panel.name}</h3>
              <p className="text-xs text-white/60">{panel.description}</p>
              {panel.path && <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold" style={{ color: GOLD }}>Open <ArrowRight className="w-3 h-3" /></span>}
            </>
          );
          return panel.path ? (
            <Link key={panel.name} to={panel.path} className="p-4 rounded-xl border border-white/10 hover:border-[#D4AF37] transition-all block" style={{ background: '#0f0f0f' }}>{content}</Link>
          ) : (
            <div key={panel.name} className="p-4 rounded-xl border border-white/10 opacity-70" style={{ background: '#0f0f0f' }}>{content}</div>
          );
        })}
      </div>
    </div>
  );
}