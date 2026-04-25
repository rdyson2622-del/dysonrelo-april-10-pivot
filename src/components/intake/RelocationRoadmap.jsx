import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import {
  CheckCircle2, ArrowRight, ChevronDown, ChevronUp,
  UserCheck, MapPin, Home, Search, ClipboardCheck,
  FileText, Key, Truck, Sparkles, ArrowLeft
} from 'lucide-react';
import ReadyToStart from '../dashboard/ReadyToStart';

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
      'Property inspection coordinated & scheduled',
      'Final walkthrough & close of escrow',
    ],
    dyson_role: 'We track every escrow milestone and make sure nothing falls through the cracks before you get your keys.',
  },
  {
    number: 8,
    icon: Truck,
    title: 'Upon Property Settlement — Complete All Move & Move-In Checklist Action Steps',
    status: 'upcoming',
    tagline: 'Arrive ready. Every detail handled.',
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
  const [expanded, setExpanded] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const roadmapRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(location.search);
  const city = destinationCity || urlParams.get('city') || '';

  useEffect(() => {
    const checkClient = async () => {
      try {
        const user = await base44.auth.me();
        if (user?.email) {
          const clients = await base44.entities.RelocationClient.filter({ email: user.email });
          if (clients.length > 0) {
            setClientId(clients[0].id);
          }
        }
      } catch (err) {
        console.error('Error checking client:', err);
      } finally {
        setLoading(false);
      }
    };
    checkClient();
  }, []);

  useEffect(() => {
    // Roadmap always visible
    setShowRoadmap(true);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#ede0cc' }}>
      {/* Header with Back Button and Commit CTA */}
      <nav ref={roadmapRef} className="flex items-center justify-between px-6 md:px-14 py-4" style={{ background: '#1a1a1a', borderBottom: '1px solid rgba(212,175,55,0.12)' }}>
            <button onClick={() => window.history.back()} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <p className="hidden md:block text-xs font-bold tracking-[0.3em]" style={{ color: GOLD }}>YOUR ROADMAP</p>
            <Link to="/RelocationIntake">
              <button className="gold-btn px-4 py-2 rounded-full text-xs font-bold tracking-wide">
                Commit to Start
              </button>
            </Link>
          </nav>



      <div className="text-center px-6 pt-10 pb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(212,175,55,0.15)', border: `2px solid ${GOLD}` }}>
            <Sparkles className="w-8 h-8" style={{ color: GOLD }} />
          </div>
          <p className="text-xs font-bold tracking-[0.3em] mb-2" style={{ color: GOLD }}>THE COMPLETE RELOCATION PROCESS</p>
          <h1 className="display-heading mb-3" style={{ fontSize: 'clamp(1.62rem, 3.6vw, 2.7rem)', letterSpacing: '0.18em', color: '#1a1a1a' }}>
            {city ? `Your ${city} Roadmap` : 'Your Relocation Roadmap'}
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: '#1a1a1a' }}>
            Here's every step of your journey — and exactly what Dyson & Dyson handles for you at each stage.
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
             className="rounded-2xl overflow-hidden relative"
             style={{
               border: isActive ? `2px solid ${GOLD}` : '1px solid rgba(0,0,0,0.1)',
               background: '#1a1a1a',
               opacity: clientId ? 1 : 0.6,
             }}
            >
              {/* Phase Header */}
              <button
                className="w-full flex items-center gap-4 px-5 py-4 text-left"
                onClick={() => {
                  if (phase.number === 1 && !clientId) {
                    navigate('/RelocationIntake');
                  } else {
                    setExpanded(isOpen ? null : phase.number);
                  }
                }}
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
                      10{String.fromCharCode(64 + phase.number)} • Phase {phase.number}: {phase.title}
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

              {/* Lock overlay for Phase 1 only */}
              {!clientId && phase.number === 1 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl z-10">
                  <p className="text-xs font-bold text-center px-4" style={{ color: 'rgba(255,255,255,0.8)' }}>Submit your info to unlock</p>
                </div>
              )}

              {/* Expanded Detail - Show content only if clientId exists OR if phase > 1 */}
              {isOpen && clientId && (
                <ExpandedPhaseContent phase={phase} isActive={isActive} GOLD={GOLD} />
              )}
              {isOpen && !clientId && phase.number > 1 && (
                <LockedPhaseContent phase={phase} isActive={isActive} GOLD={GOLD} />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="max-w-2xl mx-auto px-6 pb-16 text-center">
        <div className="rounded-2xl p-8" style={{ background: '#1a1a1a', border: `1px solid ${GOLD}` }}>
          <p className="text-xs font-bold tracking-[0.3em] mb-2" style={{ color: GOLD }}>YOUR NEXT STEP</p>
          <h3 className="text-xl font-bold mb-2 text-white">Ready to Start?</h3>
          <p className="text-sm mb-6 text-white">
            {clientId ? 'Your relocation profile is live. Bob\'s team will be in touch shortly to begin Phase 1. Meanwhile, Charlie is available 24/7 in your dashboard.' : 'Submit your information to unlock your complete roadmap and personalized relocation plan.'}
          </p>
          <Link to={clientId ? '/Dashboard' : '/RelocationIntake'}>
            <button className="gold-btn w-full py-3 rounded-xl text-sm font-bold tracking-wide flex items-center justify-center gap-2">
              {clientId ? 'Go to My Dashboard' : 'Start Your Relocation'} <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          </div>
          </div>
          </div>
          );
          }

// Phase content when user has completed intake
function ExpandedPhaseContent({ phase, isActive, GOLD }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25 }}
      className="px-5 pb-5"
    >
      <div className="grid sm:grid-cols-2 gap-4">
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
        <div className="rounded-xl p-4" style={{ background: 'rgba(212,175,55,0.05)', border: `1px solid rgba(212,175,55,0.15)` }}>
          <p className="text-xs font-bold tracking-widest mb-3" style={{ color: GOLD }}>DYSON & DYSON'S ROLE</p>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
            {phase.dyson_role}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Locked phase content for users who haven't completed Phase 1
function LockedPhaseContent({ phase, isActive, GOLD }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25 }}
      className="px-5 pb-5 space-y-4"
    >
      <div className="grid sm:grid-cols-2 gap-4">
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
        <div className="rounded-xl p-4" style={{ background: 'rgba(212,175,55,0.05)', border: `1px solid rgba(212,175,55,0.15)` }}>
          <p className="text-xs font-bold tracking-widest mb-3" style={{ color: GOLD }}>DYSON & DYSON'S ROLE</p>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
            {phase.dyson_role}
          </p>
        </div>
      </div>
      <div className="rounded-xl p-4 border-l-2" style={{ background: 'rgba(212,175,55,0.08)', borderColor: GOLD }}>
        <p className="text-xs font-bold tracking-widest mb-2" style={{ color: GOLD }}>UNLOCK THIS PHASE</p>
        <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>
          You've seen what Phase {phase.number} involves. Return to Phase 1 and submit your information to unlock the full roadmap.
        </p>
        <Link to="/RelocationIntake">
          <button className="w-full px-4 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all hover:opacity-90" style={{ background: GOLD, color: '#000' }}>
            Return to Phase 1
          </button>
        </Link>
      </div>
    </motion.div>
  );
}