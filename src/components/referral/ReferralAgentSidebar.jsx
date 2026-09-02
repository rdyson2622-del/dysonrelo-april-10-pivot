import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles, Workflow, FileSignature, Send, Megaphone, X } from 'lucide-react';

const GOLD = '#D4AF37';

export default function ReferralAgentSidebar({ slug }) {
  const location = useLocation();
  const [agentSlug, setAgentSlug] = useState(slug || null);

  useEffect(() => {
    if (slug) {
      localStorage.setItem('referralAgentSlug', slug);
      setAgentSlug(slug);
    } else {
      const saved = localStorage.getItem('referralAgentSlug');
      if (saved) setAgentSlug(saved);
    }
  }, [slug]);

  const portalBase = agentSlug ? `/referral-agent/${agentSlug}` : null;

  const items = [
    { key: 'opportunity', label: 'Opportunity', icon: Sparkles, path: portalBase ? `${portalBase}#opportunity` : '/referral-agent-explainer' },
    { key: 'process', label: 'Process', icon: Workflow, path: portalBase ? `${portalBase}#process` : '/referral-process' },
    { key: 'forms', label: 'Forms', icon: FileSignature, path: portalBase ? `${portalBase}#forms` : '/referral-forms' },
    { key: 'contacts', label: 'Refer Contacts', icon: Send, path: portalBase ? `${portalBase}#contacts` : null },
    { key: 'campaign', label: 'Campaign', icon: Megaphone, path: portalBase ? `${portalBase}#campaign` : null },
  ];

  const NavItems = () => (
    <>
      {items.map(({ key, label, icon: Icon, path }) => (
        path ? (
          <a key={key} href={path}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-white/5"
            style={{ color: '#ddd' }}>
            <Icon className="w-4 h-4 shrink-0" style={{ color: GOLD }} /> {label}
          </a>
        ) : (
          <div key={key} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm opacity-40 cursor-not-allowed" style={{ color: '#888' }}>
            <Icon className="w-4 h-4 shrink-0" /> {label}
          </div>
        )
      ))}
    </>
  );

  return (
    <>
      {/* Desktop: fixed persistent sidebar */}
      <aside className="hidden md:flex md:flex-col fixed left-0 top-0 h-screen w-56 z-20 px-4 py-6"
        style={{ background: '#0a0a0a', borderRight: `1px solid ${GOLD}30` }}>
        <p className="text-[10px] font-black tracking-[0.2em] uppercase mb-6 px-2" style={{ color: GOLD }}>
          Referral Network
        </p>
        <nav className="flex-1 space-y-1">
          <NavItems />
        </nav>
        <a href="/studio-landing"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold mt-4"
          style={{ background: '#fff8ee', border: `1px solid ${GOLD}60`, color: '#1a1a1a' }}>
          <X className="w-3.5 h-3.5" /> Exit
        </a>
      </aside>

      {/* Mobile: horizontal nav bar */}
      <div className="flex md:hidden items-center gap-2 mb-6 flex-wrap sticky top-2 z-20">
        {items.map(({ key, label, path }) => (
          path ? (
            <a key={key} href={path}
              className="px-3 py-1.5 rounded-full text-[10px] font-black tracking-wide uppercase"
              style={{ background: '#111', border: `1px solid ${GOLD}50`, color: GOLD }}>
              {label}
            </a>
          ) : (
            <span key={key} className="px-3 py-1.5 rounded-full text-[10px] font-black tracking-wide uppercase opacity-40"
              style={{ background: '#111', border: `1px solid ${GOLD}30`, color: '#888' }}>
              {label}
            </span>
          )
        ))}
        <a href="/studio-landing"
          className="px-3 py-1.5 rounded-full text-[10px] font-black tracking-wide uppercase flex items-center gap-1"
          style={{ background: '#fff8ee', border: `1px solid ${GOLD}60`, color: '#1a1a1a' }}>
          <X className="w-3 h-3" /> Exit
        </a>
      </div>
    </>
  );
}