import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2, ArrowRight, ChevronDown, ChevronUp,
  UserCheck, MapPin, Home, Search, ClipboardCheck,
  FileText, Key, Truck, Sparkles
} from 'lucide-react';

const GOLD = '#D4AF37';

const PHASES = [
  {
    number: 1,
    icon: UserCheck,
    title: 'Onboarding & Profile',
    status: 'active',
    tagline: 'You are here — Welcome aboard.',
    steps: [
      'Relocation profile submitted ✓',
      'Intro call with Bob\'s team scheduled',
      'Private Gemini session assigned',
      'Relocation plan begins building',
    ],
    dyson_role: 'We review your profile, assign your relocation manager, and schedule your private session.',
  },
  {
    number: 2,
    icon: UserCheck,
    title: 'Agent Match',
    status: 'upcoming',
    tagline: 'Your vetted local expert, hand-picked.',
    steps: [
      'Agent personality interview with you',
      'Top 20 local agents evaluated',
      'DRE records & production checked',
      '3–5 finalists presented — you choose',
    ],
    dyson_role: 'Bob\'s team personally vets every candidate. No cold handoffs. No "I love me" agents.',
  },
  {
    number: 3,
    icon: Search,
    title: 'Property Search & Selection',
    status: 'upcoming',
    tagline: 'AI-powered matching to your exact criteria.',
    steps: [
      'Active listings matched to your profile',
      'Virtual and in-person tours coordinated',
      'Market comp analysis for each property',
      'Offer strategy developed with your agent',
    ],
    dyson_role: 'Charlie surfaces listings daily. Your agent handles showings. We stay in the loop on every step.',
  },
  {
    number: 4,
    icon: MapPin,
    title: 'Community & Neighborhood Research',
    status: 'upcoming',
    tagline: 'Zeroing in on the right neighborhoods.',
    steps: [
      'AI-driven neighborhood research',
      'School district deep-dives',
      'Commute & lifestyle analysis',
      'Shortlist of 3–5 communities presented',
    ],
    dyson_role: 'Charlie and our team research your destination using your priorities — schools, commute, safety, lifestyle.',
  },
  {
    number: 5,
    icon: ClipboardCheck,
    title: 'Environmental & Property Due Diligence',
    status: 'upcoming',
    tagline: 'Know exactly what you\'re buying.',
    steps: [
      'Neighborhood & environmental research',
      'Property inspection coordination',
      'HOA & community review',
      'Flood, fire, and hazard zone analysis',
    ],
    dyson_role: 'We coordinate inspectors, review reports, and flag anything that deserves your attention before you commit.',
  },
  {
    number: 6,
    icon: FileText,
    title: 'Purchase Agreement Review & Selection of Service Providers',
    status: 'upcoming',
    tagline: 'Negotiate with confidence.',
    steps: [
      'Offer drafted with your agent',
      'Contingency strategy reviewed',
      'Counter-offer guidance',
      'Purchase agreement executed',
    ],
    dyson_role: 'Your agent leads negotiations. Bob\'s team provides strategy. You make the final call.',
  },
  {
    number: 7,
    icon: Key,
    title: 'Negotiating the Offer, Escrow & Closing',
    status: 'upcoming',
    tagline: 'The finish line — handled for you.',
    steps: [
      'Title company selected & engaged',
      'Escrow opened & timeline set',
      'Lending & appraisal coordinated',
      'Final walkthrough & close of escrow',
    ],
    dyson_role: 'We track every escrow milestone and make sure nothing falls through the cracks before you get your keys.',
  },
  {
    number: 8,
    icon: Truck,
    title: 'Move-In & Settlement',
    status: 'upcoming',
    tagline: 'Arrive ready. Settle in fast.',
    steps: [
      'Moving company vetted & booked',
      'Utilities transferred & activated',
      'Internet, electric, gas, water — set up',
      'Travel & packing coordination',
    ],
    dyson_role: 'Charlie manages your moving checklist end-to-end. You arrive to a ready home.',
  },
];

export default function RelocationRoadmap({ clientName, destinationCity }) {
  const [expanded, setExpanded] = useState(1);

  return (
    <div className="min-h-screen" style={{ background: '#808080' }}>
      {/* Header */}
      <div className="text-center px-6 pt-16 pb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(212,175,55,0.15)', border: `2px solid ${GOLD}` }}>
            <Sparkles className="w-8 h-8" style={{ color: GOLD }} />
          </div>
          <p className="text-xs font-bold tracking-[0.3em] mb-2" style={{ color: GOLD }}>YOU'RE IN — WHAT HAPPENS NEXT</p>
          <h1 className="display-heading mb-3" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '0.18em', color: '#fff' }}>
            Your Relocation Roadmap
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.8)' }}>
            {clientName ? `${clientName}, here` : 'Here'} is every step of your journey to {destinationCity || 'your new home'} — and exactly what Dyson & Dyson handles for you at each stage.
          </p>
          <p className="text-sm mt-3 font-semibold" style={{ color: GOLD }}>
            ✦ All 8 phases. Completely managed. Always free to you.
          </p>
        </motion.div>
      </div>

      {/* Phases */}
      <div className="max-w-2xl mx-auto px-6 pb-10 space-y-3">
        {PHASES.map((phase, i) => {
          const Icon = phase.icon;
          const isActive = phase.status === 'active';
          const isOpen = expanded === phase.number;

          return (
            <motion.div
              key={phase.number}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="rounded-2xl overflow-hidden"
              style={{
                border: isActive ? `2px solid ${GOLD}` : '1px solid rgba(255,255,255,0.1)',
                background: isActive ? 'rgba(212,175,55,0.07)' : '#000',
              }}
            >
              {/* Phase Header */}
              <button
                className="w-full flex items-center gap-4 px-5 py-4 text-left"
                onClick={() => setExpanded(isOpen ? null : phase.number)}
              >
                {/* Number / Icon */}
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: isActive ? GOLD : 'rgba(255,255,255,0.07)',
                    border: isActive ? 'none' : '1px solid rgba(255,255,255,0.15)',
                  }}>
                  {isActive
                    ? <Icon className="w-5 h-5" style={{ color: '#000' }} />
                    : <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>{phase.number}</span>
                  }
                </div>

                {/* Title */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm" style={{ color: isActive ? GOLD : '#fff' }}>
                      Phase {phase.number}: {phase.title}
                    </span>
                    {isActive && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                        style={{ background: GOLD, color: '#000' }}>
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {phase.tagline}
                  </p>
                </div>

                {/* Chevron */}
                {isOpen
                  ? <ChevronUp className="w-4 h-4 shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }} />
                  : <ChevronDown className="w-4 h-4 shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }} />
                }
              </button>

              {/* Expanded Detail */}
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="px-5 pb-5"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Steps */}
                    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <p className="text-xs font-bold tracking-widest mb-3" style={{ color: GOLD }}>WHAT HAPPENS</p>
                      <ul className="space-y-2">
                        {phase.steps.map((step, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                            <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: isActive ? GOLD : 'rgba(255,255,255,0.3)' }} />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* D&D Role */}
                    <div className="rounded-xl p-4" style={{ background: 'rgba(212,175,55,0.05)', border: `1px solid rgba(212,175,55,0.15)` }}>
                      <p className="text-xs font-bold tracking-widest mb-3" style={{ color: GOLD }}>DYSON & DYSON'S ROLE</p>
                      <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
                        {phase.dyson_role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="max-w-2xl mx-auto px-6 pb-16 text-center">
        <div className="rounded-2xl p-8" style={{ background: '#000', border: `1px solid ${GOLD}` }}>
          <p className="text-xs font-bold tracking-[0.3em] mb-2" style={{ color: GOLD }}>YOUR NEXT STEP</p>
          <h3 className="text-xl font-bold mb-2" style={{ color: '#fff' }}>Check Your Dashboard</h3>
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Your relocation profile is live. Bob's team will be in touch shortly to begin Phase 1. Meanwhile, Charlie is available 24/7 in your dashboard.
          </p>
          <Link to="/Dashboard">
            <button className="gold-btn w-full py-3 rounded-xl text-sm font-bold tracking-wide flex items-center justify-center gap-2">
              Go to My Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}