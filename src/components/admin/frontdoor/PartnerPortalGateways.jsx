import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Briefcase, Star, Handshake, Wrench, ShieldCheck, ArrowRight } from 'lucide-react';

const GOLD = '#D4AF37';

const GATEWAYS = [
  {
    icon: Building2,
    role: 'Corporate Relocation & HR',
    badge: 'Enterprise Solutions',
    headline: 'Corporate HR & Employee Moves',
    description: 'White-glove executive and employee relocation with zero management fees. Dedicated concierge tracking and full policy compliance.',
    cta: 'Enter HR Portal',
    path: '/corporate-relo',
    highlight: true,
  },
  {
    icon: Star,
    role: 'Active Relocation Agents',
    badge: 'Agent Network',
    headline: 'Vetted National Agent Bureau',
    description: 'Receive pre-qualified buyers and sellers from our corporate and consumer relocation pipeline. 20+ vetting standards.',
    cta: 'Join Agent Network',
    path: '/find-agent',
    highlight: false,
  },
  {
    icon: Briefcase,
    role: 'Brokerage Owners & Managers',
    badge: 'Broker Workspace',
    headline: 'Broker & Office Management',
    description: 'Institutional referral pipeline management, transaction oversight, and co-branded concierge tools for your entire firm.',
    cta: 'Open Broker Portal',
    path: '/broker-portal',
    highlight: false,
  },
  {
    icon: Handshake,
    role: 'Inactive Licensed Agents',
    badge: '25% Referral Program',
    headline: 'Inactive & Non-Practicing Agents',
    description: 'Protect and monetize your real estate license. Introduce out-of-market clients — we manage every milestone while your 25% fee is secure.',
    cta: 'Monetize License',
    path: '/partner-benefits',
    highlight: false,
  },
  {
    icon: Wrench,
    role: 'Certified Service Vendors',
    badge: 'Partner Directory',
    headline: 'Relocation Vendors & Lenders',
    description: 'Movers, inspectors, title officers, appraisers, and home service providers integrated directly into active client roadmaps.',
    cta: 'Explore Vendor Hub',
    path: '/search',
    highlight: false,
  },
];

export default function PartnerPortalGateways() {
  return (
    <section className="w-full max-w-6xl mx-auto py-8">
      {/* Header Line */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 pb-4 border-b border-[#0a0a0a]/15">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-1.5"
            style={{ background: '#0a0a0a', color: GOLD, border: `1px solid ${GOLD}` }}>
            <ShieldCheck className="w-3 h-3 text-[#D4AF37]" /> Institutional &amp; Professional Gateways
          </div>
          <h2
            className="text-2xl sm:text-3xl font-bold text-[#0a0a0a]"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Not a Buyer or Seller? Access Your Specialized Portal.
          </h2>
          <p className="text-xs sm:text-sm text-[#44382c] max-w-2xl mt-0.5">
            DysonHomes provides dedicated workspaces tailored specifically for Corporate HR leaders, vetted relocation agents, managing brokers, and service partners.
          </p>
        </div>

        <Link
          to="/portal"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0a0a0a] hover:text-[#b8920a] transition-colors shrink-0"
        >
          <span>View Master Role Selector</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid of Black Cards on Tan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {GATEWAYS.map((gateway, idx) => {
          const Icon = gateway.icon;
          return (
            <div
              key={idx}
              className={`rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 shadow-xl text-left ${
                gateway.highlight ? 'lg:col-span-2' : ''
              }`}
              style={{
                background: '#0a0a0a',
                border: gateway.highlight ? `2px solid ${GOLD}` : '1px solid rgba(212,175,55,0.4)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner"
                    style={{ background: '#181818', border: `1px solid ${GOLD}` }}
                  >
                    <Icon className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <span
                    className="text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full"
                    style={{
                      background: gateway.highlight ? 'linear-gradient(135deg, #e8c84a, #D4AF37)' : 'rgba(212,175,55,0.15)',
                      color: gateway.highlight ? '#0a0a0a' : GOLD,
                      border: `1px solid ${GOLD}`,
                    }}
                  >
                    {gateway.badge}
                  </span>
                </div>

                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#D4AF37] mb-1">
                  {gateway.role}
                </p>

                <h3
                  className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  {gateway.headline}
                </h3>

                <p className="text-xs text-white/70 leading-relaxed mb-4">
                  {gateway.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-white/40">Secure Role Access</span>
                <Link
                  to={gateway.path}
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg transition-transform active:scale-95"
                  style={{
                    background: gateway.highlight ? 'linear-gradient(135deg, #e8c84a, #D4AF37)' : '#181818',
                    color: gateway.highlight ? '#0a0a0a' : GOLD,
                    border: gateway.highlight ? 'none' : `1px solid ${GOLD}`,
                  }}
                >
                  <span>{gateway.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}