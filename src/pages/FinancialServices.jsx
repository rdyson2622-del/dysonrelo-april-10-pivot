import React from 'react';
import { DollarSign, Shield, Building2, Lock, ChevronRight } from 'lucide-react';

const GOLD = '#D4AF37';

const COMING_FEATURES = [
  {
    icon: Building2,
    title: 'Vetted Lender Network',
    description: 'DNN-approved lenders in your destination market, pre-screened for rates, service, and compliance.',
  },
  {
    icon: Shield,
    title: 'DRE-Compliant Introductions',
    description: 'Every lender introduction meets state Department of Real Estate disclosure requirements.',
  },
  {
    icon: DollarSign,
    title: 'White-Label Rate Intelligence',
    description: 'Your lender partner delivers DNN market rate briefs co-branded with their name and credentials.',
  },
  {
    icon: Lock,
    title: 'No Steering. No Hidden Fees.',
    description: 'DNN earns a nominal subscription from the lender, never a kickback from your transaction.',
  },
];

export default function FinancialServices() {
  return (
    <div className="min-h-screen p-6" style={{ background: '#080808' }}>
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase"
            style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', color: GOLD }}>
            <DollarSign className="w-3 h-3" /> Financial Services
          </div>
          <h1 className="text-2xl font-black text-white">Financial Intelligence Network</h1>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            DNN's vetted lender network — coming to your portal soon.
          </p>
        </div>

        {/* Coming Soon Hero */}
        <div className="rounded-2xl p-8 mb-6 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.12), rgba(0,0,0,0))', border: '1px solid rgba(212,175,55,0.25)' }}>
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #D4AF37 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.4)' }}>
              <DollarSign className="w-7 h-7" style={{ color: GOLD }} />
            </div>
            <h2 className="text-xl font-black text-white mb-2">Launching Soon</h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
              DNN is finalizing partnerships with vetted lenders in the markets you're relocating to. You'll be the first to know.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-8">
          {COMING_FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="flex items-start gap-4 p-4 rounded-xl"
                style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(212,175,55,0.1)' }}>
                  <Icon className="w-4 h-4" style={{ color: GOLD }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white mb-0.5">{f.title}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{f.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notify CTA */}
        <div className="rounded-xl p-5 text-center" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}>
          <p className="text-sm font-bold text-white mb-1">Interested in early access?</p>
          <p className="text-xs text-slate-500 mb-3">Let your concierge know and we'll flag you for first notification.</p>
          <a href="/chat" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-black transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37, #b8920a)' }}>
            Message My Concierge <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}