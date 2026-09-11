import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Sparkles, Workflow, FileSignature, Send, Users, 
  Radio, X, Search, Phone, MessageSquare, ArrowRight, ShieldCheck, Mic 
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';

export default function ReferralAgentSidebar({ slug, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [agentSlug, setAgentSlug] = useState(slug || null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (slug) {
      localStorage.setItem('referralAgentSlug', slug);
      setAgentSlug(slug);
    } else {
      const saved = localStorage.getItem('referralAgentSlug');
      if (saved) setAgentSlug(saved);
    }
    base44.auth.me().then(u => {
      if (u) setCurrentUser(u);
    }).catch(() => {});
  }, [slug]);

  const portalBase = agentSlug ? `/referral-agent/${agentSlug}` : null;
  const signedInName = currentUser?.full_name || 'Referral Partner';

  const items = [
    { 
      key: 'opportunity', 
      label: 'Opportunities', 
      sub: '25% referral payouts & network', 
      badge: '25% SPLIT',
      path: portalBase ? `${portalBase}#opportunity` : '/referral-agent-explainer' 
    },
    { 
      key: 'process', 
      label: 'The Referral Process', 
      sub: 'Independent vetting & fiduciary escrow', 
      badge: 'FIDUCIARY',
      path: portalBase ? `${portalBase}#process` : '/referral-process' 
    },
    { 
      key: 'forms', 
      label: 'Referral Forms', 
      sub: 'Agreements, W-9 & direct deposit', 
      badge: 'FORMS',
      path: portalBase ? `${portalBase}#forms` : '/referral-forms' 
    },
    { 
      key: 'contacts', 
      label: 'My Referral Contacts', 
      sub: 'Track submitted leads & pipeline', 
      badge: 'LEADS',
      path: portalBase ? `${portalBase}#contacts` : '/refer' 
    },
  ];

  return (
    <>
      {/* Desktop: fixed persistent sidebar */}
      <aside 
        className="hidden md:flex md:flex-col fixed left-0 top-0 h-screen w-[310px] sm:w-[320px] z-30 bg-[#0a0a0a] text-white border-r border-[#D4AF37]/30 shadow-2xl overflow-y-auto select-none"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(212,175,55,0.3) transparent',
        }}
      >
        <div className="p-3.5 space-y-3 flex-1">
          
          {/* TOP BRAND HEADER PILL */}
          <div className="flex items-center justify-between gap-1.5">
            <div 
              onClick={() => navigate('/portal')}
              className="flex-1 p-2.5 rounded-2xl bg-black border border-[#D4AF37]/40 shadow-lg flex items-center gap-2.5 cursor-pointer hover:border-[#D4AF37] transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-[#141414] border border-[#D4AF37]/50 flex items-center justify-center shrink-0">
                <span className="font-serif text-base font-bold text-[#D4AF37]">D</span>
              </div>
              <div className="min-w-0">
                <div 
                  className="text-sm sm:text-base font-bold text-white tracking-tight leading-tight truncate"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  DysonRelo.com
                </div>
                <div className="text-[8px] font-black uppercase tracking-[0.15em] text-[#D4AF37] truncate">
                  REFERRAL NETWORK
                </div>
              </div>
            </div>
            {onToggle && (
              <button
                type="button"
                onClick={onToggle}
                className="w-9 h-9 rounded-xl bg-black border border-white/20 text-white/70 hover:text-white hover:border-[#D4AF37] flex items-center justify-center cursor-pointer shrink-0 transition-all shadow-md active:scale-95"
                title="Close Sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* 55+ YEARS PILL */}
          <div className="flex items-center justify-center gap-2 py-1 px-3 rounded-full border border-[#D4AF37]/60 bg-black/60 text-[10px] font-black tracking-widest text-[#D4AF37] uppercase shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span>55+ YEARS • AGENT NETWORK</span>
          </div>

          {/* SEARCH / AUDIT CARD */}
          <div 
            className="p-3.5 rounded-2xl text-left text-[#0a0a0a] shadow-md border border-[#D4AF37]/40 space-y-2"
            style={{ background: '#ede0cc' }}
          >
            <div className="text-center space-y-0.5">
              <h2 
                className="text-lg font-bold tracking-tight text-[#0a0a0a] leading-tight"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Submit or Track Referral
              </h2>
              <p className="text-xs italic font-serif font-bold text-[#854d0e]">
                Earn 25% On Any Nationwide Closed Escrow.
              </p>
            </div>

            <p className="text-[11px] text-center text-[#44382c] leading-snug px-1">
              Buyers, sellers, or nationwide relocating families
            </p>

            <button
              type="button"
              onClick={() => navigate('/refer')}
              className="w-full py-2 px-3 rounded-full text-xs font-black uppercase tracking-wider text-white bg-[#0a0a0a] hover:bg-[#1a1a1a] transition-all flex items-center justify-center gap-1.5 shadow cursor-pointer active:scale-95"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>SUBMIT REFERRAL →</span>
            </button>
          </div>

          {/* SIGNED IN STATUS STRIP */}
          <div className="py-2 px-3 rounded-xl bg-[#141414] border border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate pr-2">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse shrink-0" />
              <span className="text-white/90 font-medium truncate">
                Agent: <strong className="text-white font-bold">{signedInName}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/refer')}
              className="text-[11px] font-bold text-[#D4AF37] hover:text-white transition-colors shrink-0 flex items-center gap-0.5 cursor-pointer"
            >
              <span>Referral</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* TALK WITH CHARLIE AI CONCIERGE BUTTON */}
          <div
            onClick={() => navigate(`/talking-app?from=referral_agent&slug=${encodeURIComponent(agentSlug || '')}`)}
            className="p-3 rounded-2xl bg-gradient-to-r from-[#1c1810] to-[#0d0b07] border border-[#D4AF37]/80 hover:border-[#D4AF37] transition-all cursor-pointer flex items-center gap-3 shadow-lg group active:scale-98"
            title="Talk with Charlie Simmons — 2-Way Voice AI Concierge"
          >
            <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-[#D4AF37] shrink-0 bg-black shadow">
              <img
                src="https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/6421add7d_Screenshot2026-08-31at40550PM.png"
                alt="Charlie Simmons"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10b981] border border-black animate-pulse" />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white group-hover:text-[#D4AF37] transition-colors">
                  Talk with Charlie
                </span>
                <span className="px-1.5 py-0.2 rounded-full text-[8px] font-bold bg-[#D4AF37] text-black">
                  V2V
                </span>
              </div>
              <p className="text-[10px] text-white/60 truncate mt-0.5">
                Voice Walkthrough &amp; Desk Guide
              </p>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#D4AF37] text-black flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow">
              <Mic className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* SECTION: REFERRAL TO-DO'S */}
          <div className="space-y-1.5 pt-1 text-left">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-[#D4AF37] px-1">
              <span>REFERRAL WORKSPACE:</span>
              <span className="text-white/40 normal-case font-normal text-[10px]">select one</span>
            </div>

            {items.map(item => (
              <div
                key={item.key}
                onClick={() => {
                  if (item.path) {
                    if (item.path.startsWith('/')) navigate(item.path);
                    else window.location.href = item.path;
                  }
                }}
                className="p-3 rounded-2xl bg-[#ede0cc] text-[#0a0a0a] hover:bg-[#f6efe3] transition-all cursor-pointer shadow-sm border border-black/10 group active:scale-98"
              >
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs font-bold text-[#0a0a0a] truncate">{item.label}</span>
                    <span className="px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-black text-[#D4AF37] shrink-0">
                      {item.badge}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#0a0a0a] group-hover:translate-x-0.5 transition-transform shrink-0 ml-auto" />
                </div>
                <p className="text-[10px] text-[#554433] mt-0.5 leading-tight">
                  {item.sub}
                </p>
              </div>
            ))}
          </div>

          {/* SECTION: CONCIERGE SYSTEMS: direct */}
          <div className="space-y-1.5 pt-1 text-left">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-[#D4AF37] px-1">
              <span>CONCIERGE SYSTEMS:</span>
              <span className="text-white/40 normal-case font-normal text-[10px]">direct</span>
            </div>

            <div
              onClick={() => navigate('/dnn-news')}
              className="p-3 rounded-2xl bg-[#ede0cc] text-[#0a0a0a] hover:bg-[#f6efe3] transition-all cursor-pointer shadow-sm border border-black/10 group active:scale-98"
            >
              <div className="flex items-center justify-between gap-1.5">
                <span className="text-xs font-bold text-[#0a0a0a] truncate">6AM DNN News Broadcast</span>
                <span className="text-[11px] font-bold text-[#854d0e] group-hover:translate-x-0.5 transition-transform shrink-0 ml-auto">
                  Open →
                </span>
              </div>
              <p className="text-[10px] text-[#554433] mt-0.5 leading-tight">
                AI Charlie &amp; Bob • Daily Housing Pulse
              </p>
            </div>
          </div>

        </div>

        {/* BOTTOM DOCKED: CONCIERGE DIRECT */}
        <div className="p-3 border-t border-white/15 bg-black/90 text-left space-y-2 shrink-0">
          <div 
            className="p-2.5 rounded-xl flex items-center justify-between gap-2 shadow-inner"
            style={{ background: '#ede0cc', color: '#0a0a0a' }}
          >
            <div className="min-w-0">
              <div className="text-[9px] font-black uppercase tracking-wider text-[#854d0e] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                <span>CONCIERGE DIRECT</span>
              </div>
              <div className="font-mono text-xs sm:text-sm font-bold text-[#0a0a0a] tracking-tight">
                (858) 353–1200
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href="tel:+18583531200"
                className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-[#0a0a0a] text-white hover:bg-[#1a1a1a] transition-all flex items-center gap-1"
                title="Call Fiduciary Desk"
              >
                <span>Call</span>
              </a>
              <a
                href="sms:+18583531200"
                className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-[#0a0a0a] text-white hover:bg-[#1a1a1a] transition-all flex items-center gap-1"
                title="Text Fiduciary Desk"
              >
                <span>Text</span>
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile: horizontal nav bar */}
      <div className="flex md:hidden items-center gap-2 mb-6 flex-wrap sticky top-2 z-20">
        <button
          type="button"
          onClick={() => navigate(`/talking-app?from=referral_agent&slug=${encodeURIComponent(agentSlug || '')}`)}
          className="px-3 py-1.5 rounded-full text-[10px] font-black tracking-wide uppercase flex items-center gap-1.5 cursor-pointer shadow-md"
          style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37)', color: '#000' }}
        >
          <Mic className="w-3 h-3 text-black" />
          <span>Talk with Charlie</span>
        </button>
        {items.map(({ key, label, path }) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              if (path) {
                if (path.startsWith('/')) navigate(path);
                else window.location.href = path;
              }
            }}
            className="px-3 py-1.5 rounded-full text-[10px] font-black tracking-wide uppercase cursor-pointer"
            style={{ background: '#111', border: `1px solid ${GOLD}50`, color: GOLD }}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => navigate('/portal')}
          className="px-3 py-1.5 rounded-full text-[10px] font-black tracking-wide uppercase flex items-center gap-1 cursor-pointer"
          style={{ background: '#fff8ee', border: `1px solid ${GOLD}60`, color: '#1a1a1a' }}
        >
          <X className="w-3 h-3" /> Exit
        </button>
      </div>
    </>
  );
}