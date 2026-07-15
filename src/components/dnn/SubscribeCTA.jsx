import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

const GOLD = '#D4AF37';

/**
 * SubscribeCTA — compact, reusable call-to-action banner.
 * Drop anywhere on the site to remind viewers that subscribing
 * gets them immediate AI-powered answers without the sweat equity.
 *
 * Props:
 *   variant: 'banner' (default) | 'compact' | 'endcard'
 *   source:  optional source label for analytics
 */
export default function SubscribeCTA({ variant = 'banner', source = 'site_cta' }) {
  if (variant === 'endcard') {
    return (
      <Link
        to="/subscribe"
        className="block w-full max-w-md mx-auto rounded-2xl overflow-hidden transition-all hover:scale-[1.02]"
        style={{ border: `2px solid ${GOLD}`, background: '#111' }}
      >
        <div className="px-6 py-5 text-center">
          <p className="text-xs font-black tracking-[0.25em] uppercase mb-2" style={{ color: GOLD }}>
            Real Estate News WITH Solutions
          </p>
          <p className="text-sm text-white mb-3 leading-relaxed">
            Subscribers get immediate AI-powered answers to real estate questions —
            no tax attorneys to chase, no sweat equity required. We do the work for you.
          </p>
          <span
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-black text-sm"
            style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}
          >
            <Sparkles className="w-4 h-4" />
            Subscribe Free
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </Link>
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
      className="flex items-center justify-between gap-4 px-5 py-3 rounded-xl transition-all hover:scale-[1.01]"
      style={{ background: 'rgba(212,175,55,0.1)', border: `1px solid rgba(212,175,55,0.35)` }}
    >
      <div className="flex items-center gap-3">
        <Sparkles className="w-5 h-5 shrink-0" style={{ color: GOLD }} />
        <div>
          <p className="text-sm font-black" style={{ color: GOLD }}>Get Answers, Not Just News</p>
          <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Subscribers get immediate AI-powered solutions — we do the sweat equity so you don't have to.
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