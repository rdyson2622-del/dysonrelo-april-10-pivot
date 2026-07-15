import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, ArrowRight, Zap, ShieldCheck, Clock,
  MessageCircle, TrendingUp, Home, Users
} from 'lucide-react';

const GOLD = '#D4AF37';

const FEATURES = [
  {
    icon: Zap,
    title: 'Immediate AI Answers',
    desc: 'Ask any real estate question and get an AI-powered answer instantly — no waiting for callbacks, no chasing professionals.',
  },
  {
    icon: TrendingUp,
    title: 'Daily Market Intelligence',
    desc: 'Every morning, DNN delivers the real estate stories that impact your move — with solutions, not just headlines.',
  },
  {
    icon: ShieldCheck,
    title: 'Vetted Agent Network',
    desc: 'Skip the Z roulette. We vet 20+ agents in your market and hand you 3–5 finalists matched to your needs.',
  },
  {
    icon: Clock,
    title: 'No Sweat Equity',
    desc: 'Tax questions? Lender comparisons? School zones? We research it for you — that\'s what subscribers get.',
  },
  {
    icon: MessageCircle,
    title: '24/7 Charlie Concierge',
    desc: 'Our AI concierge is always on. Ask about escrow, movers, utilities, neighborhoods — any time, any device.',
  },
  {
    icon: Home,
    title: 'Full Move Management',
    desc: 'From selling your current home to closing in your new city — one team coordinates the entire journey.',
  },
  {
    icon: Users,
    title: 'Free for Homebuyers',
    desc: 'Our service costs you nothing. We\'re funded through referral agreements — 100% DRE compliant.',
  },
  {
    icon: Sparkles,
    title: 'Solutions, Not Tasks',
    desc: 'We never hand you a to-do list. We get the answers FOR you — that\'s the Dyson difference.',
  },
];

/**
 * SubscribeCTA — reusable call-to-action promoting DNN subscription.
 *
 * Props:
 *   variant: 'banner' (default) | 'compact' | 'endcard' | 'features'
 *   source:  optional source label for analytics
 */
export default function SubscribeCTA({ variant = 'banner', source = 'site_cta' }) {
  if (variant === 'features') {
    return (
      <div className="rounded-2xl overflow-hidden" style={{ background: '#111', border: `1px solid rgba(212,175,55,0.3)` }}>
        {/* Header */}
        <div className="px-6 py-5 text-center" style={{ borderBottom: `1px solid rgba(212,175,55,0.15)` }}>
          <p className="text-xs font-black tracking-[0.25em] uppercase mb-2" style={{ color: GOLD }}>
            Why Subscribe?
          </p>
          <h3 className="text-lg font-black text-white mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Real Estate News WITH Solutions
          </h3>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Subscribers get immediate AI-powered answers — no sweat equity, no chasing professionals.
            We do the work for you.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px" style={{ background: 'rgba(212,175,55,0.1)' }}>
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="px-5 py-4" style={{ background: '#111' }}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(212,175,55,0.12)', border: `1px solid rgba(212,175,55,0.2)` }}>
                    <Icon className="w-4 h-4" style={{ color: GOLD }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white mb-0.5">{f.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{f.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="px-6 py-5 text-center" style={{ borderTop: `1px solid rgba(212,175,55,0.15)` }}>
          <Link
            to="/subscribe"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-black text-sm transition-all hover:scale-[1.03]"
            style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}
          >
            <Sparkles className="w-4 h-4" />
            Subscribe Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-[10px] mt-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
            No cost · No obligation · Unsubscribe anytime
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'endcard') {
    return (
      <div className="block w-full max-w-md mx-auto rounded-2xl overflow-hidden transition-all hover:scale-[1.01]"
        style={{ border: `2px solid ${GOLD}`, background: '#111' }}>
        <div className="px-6 py-5 text-center">
          <p className="text-xs font-black tracking-[0.25em] uppercase mb-2" style={{ color: GOLD }}>
            Real Estate News WITH Solutions
          </p>
          <p className="text-sm text-white mb-3 leading-relaxed">
            Subscribers get immediate AI-powered answers to real estate questions —
            no tax attorneys to chase, no sweat equity required. We do the work for you.
          </p>
          {/* Mini features */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {['AI Answers', 'Daily Intelligence', 'Vetted Agents', '24/7 Concierge'].map(tag => (
              <span key={tag} className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(212,175,55,0.12)', color: GOLD, border: '1px solid rgba(212,175,55,0.2)' }}>
                {tag}
              </span>
            ))}
          </div>
          <Link
            to="/subscribe"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-black text-sm"
            style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}
          >
            <Sparkles className="w-4 h-4" />
            Subscribe Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-[10px] mt-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
            No cost · No obligation · Unsubscribe anytime
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <Link
        to="/subscribe"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all hover:scale-[1.03]"
        style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}
      >
        <Sparkles className="w-3.5 h-3.5" />
        Subscribe for Answers
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    );
  }

  // banner variant
  return (
    <Link
      to="/subscribe"
      className="flex items-center justify-between gap-4 px-5 py-4 rounded-xl transition-all hover:scale-[1.01]"
      style={{ background: 'rgba(212,175,55,0.1)', border: `1px solid rgba(212,175,55,0.35)` }}
    >
      <div className="flex items-center gap-3">
        <Sparkles className="w-5 h-5 shrink-0" style={{ color: GOLD }} />
        <div>
          <p className="text-sm font-black" style={{ color: GOLD }}>Get Answers, Not Just News</p>
          <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Subscribers get immediate AI-powered solutions — daily intelligence, vetted agents, 24/7 concierge. We do the sweat equity so you don't have to.
          </p>
        </div>
      </div>
      <span
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-black text-xs whitespace-nowrap"
        style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}
      >
        Subscribe <ArrowRight className="w-3.5 h-3.5" />
      </span>
    </Link>
  );
}