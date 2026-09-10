import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { 
  Building2, Star, Briefcase, Handshake, Wrench, Home,
  CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Lock, Clock
} from 'lucide-react';

const GOLD = '#D4AF37';

const ROLES = [
  {
    id: 'hr',
    label: 'Corporate HR & Relo',
    icon: Building2,
    badge: 'Enterprise Relo Program',
    headline: 'Zero-Fee Corporate Relocation Suite',
    description: 'Empower your talent acquisition with seamless employee moving packages. We manage 100% of the destination search, local school orientations, moving logistics, and closing milestones with zero management fees charged to your company.',
    perks: [
      'Zero corporate management fees (brokerage-funded concierge)',
      'Real-time executive dashboard tracking employee move milestones',
      'Destination neighborhood & school district guidance in 50 states',
      'Direct line to Charlie Voice Concierge & dedicated human relocation manager',
      'Strict corporate policy compliance & expense tracking',
    ],
    dest: '/corporate-relo',
    companyLabel: 'Company / Organization',
    detailLabel: 'Estimated Annual Moves',
    detailPlaceholder: 'e.g. 5-25 relocations/year',
  },
  {
    id: 'agent',
    label: 'Active Relo Agent',
    icon: Star,
    badge: 'Vetted Receiving Agent',
    headline: 'Receive Pre-Qualified Relocation Clients',
    description: 'Join our strictly capped national network of boutique, independent agents. We hand off fully vetted buyers and sellers who are already in our relocation management pipeline.',
    perks: [
      'Pre-qualified corporate and consumer relocation buyer & seller handoffs',
      'Exclusive market territory allocation (never saturated)',
      'Progressive transaction milestone tracking via our AGI portal',
      'Daily 6AM DNN National & Local Real Estate News broadcast',
      'Direct client communication via verified Dyson portal channels',
    ],
    dest: '/agent-command-center',
    companyLabel: 'Brokerage Firm Name',
    detailLabel: 'DRE / State License #',
    detailPlaceholder: 'e.g. DRE #01234567',
  },
  {
    id: 'broker',
    label: 'Broker / Owner',
    icon: Briefcase,
    badge: 'Firm Partnership',
    headline: 'Institutional Brokerage Gateway',
    description: 'Connect your entire office to our relocation ecosystem. Leverage our transaction audit tools, compliance oversight, and national referral syndication without franchise royalties.',
    perks: [
      'Multi-agent pipeline and referral volume tracking',
      'Brokermint / BackOffice sync & proactive friction audits',
      'Co-branded luxury presence tools for your top producers',
      'Private-label daily news broadcasts for client distribution',
      'Guaranteed referral escrow accounting & rapid payment',
    ],
    dest: '/broker-portal',
    companyLabel: 'Brokerage Name & Location',
    detailLabel: 'Office Agent Roster Count',
    detailPlaceholder: 'e.g. 45 producing agents',
  },
  {
    id: 'inactive_agent',
    label: 'Inactive Agent',
    icon: Handshake,
    badge: '25% Protected Referrals',
    headline: 'Monetize Your Real Estate License',
    description: 'Keep your license profitable without holding open houses, chasing leads, or managing paperwork. Introduce relocating family, friends, or past clients — we handle the transaction from start to finish.',
    perks: [
      'Guaranteed 25% referral fee contractually locked in writing',
      'Zero active sales work or weekend showings required',
      'Full visibility into your client’s live escrow roadmap',
      'Dyson & Dyson manages compliance, inspections, and closing',
      'Complimentary access to DNN daily market news',
    ],
    dest: '/partner-benefits',
    companyLabel: 'Current Status or Affiliation',
    detailLabel: 'State of Licensure',
    detailPlaceholder: 'e.g. CA (Active or Inactive)',
  },
  {
    id: 'vendor',
    label: 'Vetted Vendor',
    icon: Wrench,
    badge: 'Certified Service Partner',
    headline: 'Preferred Relocation Supplier Hub',
    description: 'Connect with relocating homebuyers and corporate transferees at the exact moment they need movers, inspections, title insurance, lending, repairs, and staging.',
    perks: [
      'Direct inclusion in custom relocation roadmaps for moving clients',
      'No bidding wars or spam inquiries — qualified client introductions',
      'Direct integration into the client’s milestone action ledger',
      'Verified partner status badge across the national platform',
      'Long-term relationships with top relocating families',
    ],
    dest: '/search',
    companyLabel: 'Company / Business Name',
    detailLabel: 'Trade or Specialty',
    detailPlaceholder: 'e.g. Moving & Storage, Home Inspection, Title',
  },
  {
    id: 'client',
    label: 'Buyer / Client',
    icon: Home,
    badge: 'Client Concierge',
    headline: 'Lifetime Relocation Management Workspace',
    description: 'Whether moving across town or across the country, access vetted top-tier agents, custom escrow milestones, and real-time guidance. 100% free to relocating buyers and sellers.',
    perks: [
      'Zero cost — paid through standard cooperating brokerage splits',
      'Top 1% local agent research & unbiased vetting',
      'Step-by-step moving checklist from packing to utility activation',
      '24/7 Charlie Voice Concierge for city data and answers',
      'Full transparency live ledger protecting your closing',
    ],
    dest: '/relocation-intake',
    companyLabel: 'Current City / Location',
    detailLabel: 'Target Destination City',
    detailPlaceholder: 'e.g. Moving from San Jose to Scottsdale, AZ',
  },
];

export default function RoleSubscriptionDeck({ activeRole, onSelectRole }) {
  const [selectedRoleId, setSelectedRoleId] = useState(activeRole || 'hr');
  const [form, setForm] = useState({
    full_name: 'Bob Dyson',
    email: 'rdyson2622@gmail.com',
    phone: '(858) 353-1200',
    company: 'The Dyson & Dyson Companies, Inc.',
    detail: 'CA DRE #02303118',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const currentRole = ROLES.find(r => r.id === selectedRoleId) || ROLES[0];
  const Icon = currentRole.icon;

  const handleTabClick = (id) => {
    setSelectedRoleId(id);
    setSuccess(false);
    onSelectRole?.(id);

    // Context-specific defaults for Bob Dyson
    if (id === 'hr') {
      setForm(prev => ({ ...prev, company: 'The Dyson & Dyson Companies, Inc.', detail: '5-25 corporate moves/yr' }));
    } else if (id === 'agent') {
      setForm(prev => ({ ...prev, company: 'The Dyson & Dyson Companies, Inc.', detail: 'CA DRE #02303118' }));
    } else if (id === 'broker') {
      setForm(prev => ({ ...prev, company: 'The Dyson & Dyson Companies / Wisdom Properties', detail: '45 producing agents' }));
    } else if (id === 'inactive_agent') {
      setForm(prev => ({ ...prev, company: 'The Dyson & Dyson Companies, Inc.', detail: 'CA DRE #02303118' }));
    } else if (id === 'vendor') {
      setForm(prev => ({ ...prev, company: 'Dyson Relocation Concierge Services', detail: 'Concierge Moving & Fiduciary Management' }));
    } else if (id === 'client') {
      setForm(prev => ({ ...prev, company: 'Del Mar, CA', detail: 'Del Mar, CA → Scottsdale, AZ' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // 1. Create DnnSubscriber record
      await base44.entities.DnnSubscriber.create({
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        source: `Subscription Deck: ${currentRole.label}`,
      });

      // 2. Update user portal role in session
      try {
        const user = await base44.auth.me();
        if (user && !user.portal_role) {
          await base44.auth.updateMe({ portal_role: selectedRoleId });
        }
      } catch (_) {}

      localStorage.setItem('dyson_portal', JSON.stringify({ roleKey: selectedRoleId, dest: currentRole.dest }));
      sessionStorage.setItem('dyson_role', selectedRoleId);
      window.dispatchEvent(new Event('dyson_role_change'));

      setSuccess(true);
    } catch (err) {
      console.error('Subscription error:', err);
    }
    setSubmitting(false);
  };

  return (
    <div id="portal-subscribe-section" className="w-full max-w-6xl mx-auto py-10 scroll-mt-6">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black tracking-widest uppercase shadow-sm mb-3"
          style={{ background: '#0a0a0a', border: `1.5px solid ${GOLD}`, color: GOLD }}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          PORTAL SUBSCRIPTION &amp; ENROLLMENT SUITE
        </div>

        <h2
          className="text-3xl sm:text-4xl font-bold text-[#0a0a0a] leading-tight"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          Select Your Workspace &amp; Activate Immediate Access.
        </h2>
        <p className="text-sm sm:text-base text-[#44382c] mt-2">
          Choose your organizational role below to explore customized deliverables and subscribe for immediate access to your workspace.
        </p>
      </div>

      {/* Role Selector Tabs (High Contrast Gold-Bordered Tabs on Tan) */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {ROLES.map((role) => {
          const TabIcon = role.icon;
          const isSelected = role.id === selectedRoleId;
          return (
            <button
              key={role.id}
              onClick={() => handleTabClick(role.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-md ${
                isSelected
                  ? 'scale-105 shadow-xl'
                  : 'hover:scale-[1.02] opacity-80 hover:opacity-100'
              }`}
              style={{
                background: isSelected ? '#0a0a0a' : '#1a1a1a',
                border: isSelected ? `2px solid ${GOLD}` : '1px solid rgba(212,175,55,0.3)',
                color: isSelected ? GOLD : '#fff',
              }}
            >
              <TabIcon className="w-4 h-4 shrink-0" style={{ color: isSelected ? GOLD : 'rgba(255,255,255,0.7)' }} />
              <span>{role.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Two-Column Interactive Console */}
      <div
        className="rounded-3xl p-6 sm:p-8 shadow-2xl"
        style={{
          background: '#0a0a0a',
          border: `2px solid ${GOLD}`,
          boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Role Pitch & Entitlements (7 Cols) */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner shrink-0"
                style={{ background: '#181818', border: `1.5px solid ${GOLD}` }}
              >
                <Icon className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <span
                  className="text-[9px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full"
                  style={{ background: 'rgba(212,175,55,0.2)', color: GOLD, border: `1px solid ${GOLD}` }}
                >
                  {currentRole.badge}
                </span>
                <h3
                  className="text-2xl sm:text-3xl font-bold text-white mt-1 leading-tight"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  {currentRole.headline}
                </h3>
              </div>
            </div>

            <p className="text-sm text-white/80 leading-relaxed font-sans">
              {currentRole.description}
            </p>

            {/* Perks Bullet List */}
            <div className="space-y-2.5 pt-2">
              <p className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">
                Included in Your {currentRole.label} Subscription:
              </p>
              {currentRole.perks.map((perk, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-white/90">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>

            {/* Reassurance Footer */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-4 text-[11px] text-white/50">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#D4AF37]" /> No credit card required to enroll
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> Instant workspace activation
              </span>
            </div>
          </div>

          {/* Right Column: Fast Onboarding Subscription Card (5 Cols) */}
          <div className="lg:col-span-5">
            <div
              className="rounded-2xl p-5 sm:p-6 text-left"
              style={{
                background: '#121212',
                border: '1.5px solid rgba(212,175,55,0.4)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
              }}
            >
              {success ? (
                <div className="text-center py-6 space-y-4">
                  <CheckCircle2 className="w-14 h-14 mx-auto text-[#10b981]" />
                  <h4 className="text-2xl font-bold text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    Welcome to the {currentRole.label} Workspace
                  </h4>
                  <p className="text-xs text-white/70">
                    Your subscription has been activated. You can now access your dedicated workspace and all relocation tools.
                  </p>
                  <a
                    href={currentRole.dest}
                    className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-full text-xs font-black uppercase tracking-wider cursor-pointer shadow-lg hover:brightness-110"
                    style={{
                      background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%)',
                      color: '#0a0a0a',
                    }}
                  >
                    <span>Enter {currentRole.label} Portal Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="border-b border-white/10 pb-2">
                    <h4 className="text-base font-bold text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                      Activate {currentRole.label} Subscription
                    </h4>
                    <p className="text-[11px] text-white/50">
                      Zero cost • Morning news included • Instant portal routing
                    </p>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] block mb-1">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={form.full_name}
                      onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                      placeholder="e.g. Jane Doe"
                      className="w-full bg-[#1c1c1c] border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] block mb-1">
                        Work Email *
                      </label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@company.com"
                        className="w-full bg-[#1c1c1c] border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] block mb-1">
                        Direct Phone
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="(555) 000-0000"
                        className="w-full bg-[#1c1c1c] border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] block mb-1">
                      {currentRole.companyLabel}
                    </label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="Organization or Brokerage"
                      className="w-full bg-[#1c1c1c] border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] block mb-1">
                      {currentRole.detailLabel}
                    </label>
                    <input
                      type="text"
                      value={form.detail}
                      onChange={(e) => setForm({ ...form, detail: e.target.value })}
                      placeholder={currentRole.detailPlaceholder}
                      className="w-full bg-[#1c1c1c] border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-full text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-110 active:scale-95 transition-all mt-2"
                    style={{
                      background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%)',
                      color: '#0a0a0a',
                    }}
                  >
                    <span>{submitting ? 'Activating…' : `Subscribe & Open ${currentRole.label}`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[10px] text-center text-white/40">
                    Complimentary subscription • Unsubscribe anytime • Privacy protected
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}