import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap, BookOpen, Users, MapPin, Home } from 'lucide-react';
import ChatInterface from '@/components/charlie/ChatInterface';

const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";
const GOLD = '#D4AF37';

const pages = [
  {
    id: 'hero',
    title: 'CONCIERGE',
    subtitle: 'REAL ESTATE',
    description: 'Meet Charlie — AI that handles every aspect of your relocation.',
    tagline: '✦ Completely free to you.',
    services: [
      { icon: '🏙️', title: 'City & Neighborhood Research', desc: 'Explore lifestyle fit, commute, culture, and community in your destination.' },
      { icon: '🏠', title: 'Home Search & Agent Match', desc: 'Find the perfect property and connect with a vetted top-performing local agent.' },
      { icon: '📦', title: 'Moving Logistics', desc: 'Packing timelines, movers coordination, checklists — all handled.' },
      { icon: '⚡', title: 'Utilities & Services Setup', desc: 'Internet, electric, gas, water — all set up before you arrive.' },
      { icon: '🎓', title: 'School Research & Enrollment', desc: 'District research, school tours, enrollment paperwork guidance.' },
    ]
  },
  {
    id: '21-assistants',
    title: 'Meet Our',
    subtitle: '21 AI Assistants',
    description: 'Each specialized for every aspect of your relocation journey.',
    icon: '🤖',
    items: [
      '✓ City Research AI',
      '✓ Neighborhood Scout',
      '✓ School Finder',
      '✓ Healthcare Locator',
      '✓ Moving Coordinator',
      '✓ Utilities Setup',
      '✓ Market Analyst',
      '✓ Budget Planner',
      '✓ Timeline Manager',
    ]
  },
  {
    id: 'charlie',
    title: 'Charlie:',
    subtitle: 'Your Personal Concierge',
    description: 'Your 24/7 AI guide coordinating everything.',
    icon: '🎭',
    highlights: [
      'Smart enough to understand your needs',
      'Powerful enough to handle logistics',
      'Friendly enough to feel human',
    ]
  },
  {
    id: 'process',
    title: 'How It Works',
    description: 'Simple steps to your perfect relocation.',
    steps: [
      { num: '1', title: 'Start Chatting', desc: 'Tell Charlie about your move' },
      { num: '2', title: 'Gemini Session', desc: 'Build your relocation profile' },
      { num: '3', title: 'Agent Match', desc: 'We select your local expert' },
      { num: '4', title: 'City Guide', desc: 'Deep-dive research unlocks' },
      { num: '5', title: 'Move Day', desc: 'Everything coordinated, stress-free' },
    ]
  },
  {
    id: 'commitment',
    title: "Why You'll",
    subtitle: 'Commit to Us',
    description: 'The full relocation package, 100% free to buyers.',
    benefits: [
      { icon: '💎', text: 'Expert agent matching' },
      { icon: '🎯', text: 'Personalized city research' },
      { icon: '📋', text: 'Complete logistics coordination' },
      { icon: '🏡', text: 'Home search support' },
      { icon: '✨', text: 'White-glove service' },
    ]
  },
];

export default function Landing() {
  const [currentPage, setCurrentPage] = useState(0);
  const containerRef = useRef(null);
  const [showChat, setShowChat] = useState(true);

  useEffect(() => {
    const handleWheel = (e) => {
      if (!containerRef.current) return;
      e.preventDefault();
      
      if (e.deltaY > 0 && currentPage < pages.length - 1) {
        setCurrentPage(prev => prev + 1);
      } else if (e.deltaY < 0 && currentPage > 0) {
        setCurrentPage(prev => prev - 1);
      }
    };

    containerRef.current?.addEventListener('wheel', handleWheel, { passive: false });
    return () => containerRef.current?.removeEventListener('wheel', handleWheel);
  }, [currentPage]);

  const page = pages[currentPage];

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden" style={{ background: '#A9A9A9' }}>
      {/* Header */}
      <header className="fixed top-0 z-40 w-full flex items-center justify-between px-6 py-4" style={{ background: '#000', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-10 w-auto" />
        <Link to="/Explainers">
          <button className="px-6 py-2 rounded-full font-semibold text-sm transition-all" style={{ background: GOLD, color: '#000' }}>
            Learn Our Story
          </button>
        </Link>
      </header>

      {/* Pages */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.6 }}
          className="pt-20 pb-12 min-h-screen flex items-center"
        >
          <div className="max-w-7xl mx-auto px-6 w-full">
            {/* HERO PAGE */}
            {page.id === 'hero' && (
              <div className="grid md:grid-cols-2 gap-12 items-start">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-8 tracking-widest"
                    style={{ background: GOLD, color: '#000' }}>
                    ✨ POWERED BY AI
                  </div>
                  <h1 className="display-heading mb-6" style={{ lineHeight: 1.15, letterSpacing: '0.22em' }}>
                    <span style={{ display: 'block', color: GOLD, fontSize: 'clamp(1.4rem, 5vw, 2.8rem)' }}>{page.title}</span>
                    <span style={{ display: 'block', color: '#000', fontSize: 'clamp(1.2rem, 4vw, 2.4rem)' }}>{page.subtitle}</span>
                  </h1>
                  <p className="text-lg leading-relaxed mb-4" style={{ color: '#000' }}>{page.description}</p>
                  <p className="font-semibold mb-8" style={{ color: '#000' }}>{page.tagline}</p>
                  <div className="grid gap-4 mb-8">
                    {page.services.map((s, i) => (
                      <div key={i} className="flex gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(212,175,55,0.2)' }}>
                        <span className="text-2xl flex-shrink-0">{s.icon}</span>
                        <div>
                          <h4 className="font-bold text-sm" style={{ color: '#000' }}>{s.title}</h4>
                          <p className="text-xs mt-1" style={{ color: 'rgba(0,0,0,0.7)' }}>{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>{showChat && <ChatInterface expanded={false} initialMessage="" />}</div>
              </div>
            )}

            {/* 21 ASSISTANTS PAGE */}
            {page.id === '21-assistants' && (
              <div className="text-center">
                <div className="text-6xl mb-6">{page.icon}</div>
                <h2 className="display-heading mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '0.22em', color: '#000' }}>
                  {page.title}<br /><span style={{ color: GOLD }}>{page.subtitle}</span>
                </h2>
                <p className="text-lg mb-12 max-w-2xl mx-auto" style={{ color: '#000' }}>{page.description}</p>
                <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  {page.items.map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                      className="p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(212,175,55,0.2)' }}>
                      <p className="text-base font-semibold" style={{ color: '#000' }}>{item}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* CHARLIE PAGE */}
            {page.id === 'charlie' && (
              <div className="text-center">
                <div className="text-6xl mb-6">{page.icon}</div>
                <h2 className="display-heading mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '0.22em', color: '#000' }}>
                  {page.title}<br /><span style={{ color: GOLD }}>{page.subtitle}</span>
                </h2>
                <p className="text-lg mb-12 max-w-2xl mx-auto" style={{ color: '#000' }}>{page.description}</p>
                <div className="flex flex-col items-center gap-4 max-w-2xl mx-auto">
                  {page.highlights.map((h, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                      className="p-4 rounded-lg w-full" style={{ background: 'rgba(255,255,255,0.6)', border: `2px solid ${GOLD}` }}>
                      <p className="text-base font-semibold" style={{ color: '#000' }}>{h}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* PROCESS PAGE */}
            {page.id === 'process' && (
              <div className="text-center">
                <h2 className="display-heading mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '0.22em', color: '#000' }}>
                  {page.title}
                </h2>
                <p className="text-lg mb-12 max-w-2xl mx-auto" style={{ color: '#000' }}>{page.description}</p>
                <div className="grid sm:grid-cols-5 gap-4">
                  {page.steps.map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className="p-6 rounded-lg" style={{ background: 'rgba(255,255,255,0.7)', border: `2px solid ${GOLD}` }}>
                      <div className="text-3xl font-bold mb-3" style={{ color: GOLD }}>{s.num}</div>
                      <h4 className="font-bold mb-2" style={{ color: '#000' }}>{s.title}</h4>
                      <p className="text-sm" style={{ color: 'rgba(0,0,0,0.7)' }}>{s.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* COMMITMENT PAGE */}
            {page.id === 'commitment' && (
              <div className="text-center">
                <h2 className="display-heading mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '0.22em', color: '#000' }}>
                  {page.title}<br /><span style={{ color: GOLD }}>{page.subtitle}</span>
                </h2>
                <p className="text-lg mb-12 max-w-2xl mx-auto" style={{ color: '#000' }}>{page.description}</p>
                <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
                  {page.benefits.map((b, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                      className="p-6 rounded-lg" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(212,175,55,0.2)' }}>
                      <div className="text-4xl mb-3">{b.icon}</div>
                      <p className="text-base font-semibold" style={{ color: '#000' }}>{b.text}</p>
                    </motion.div>
                  ))}
                </div>
                <Link to="/Chat">
                  <button className="px-8 py-3 rounded-full font-bold text-base transition-all hover:shadow-lg" style={{ background: GOLD, color: '#000' }}>
                    Start Free Consultation
                  </button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Page Indicator & Navigation */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4">
        <div className="flex gap-2">
          {pages.map((_, i) => (
            <button key={i} onClick={() => setCurrentPage(i)}
              className="w-2 h-2 rounded-full transition-all" 
              style={{ background: i === currentPage ? GOLD : 'rgba(255,255,255,0.4)', width: i === currentPage ? 24 : 8 }} />
          ))}
        </div>
      </div>

      {/* Scroll Hint */}
      {currentPage < pages.length - 1 && (
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-20 text-center">
          <div className="text-xs font-semibold mb-2" style={{ color: '#000' }}>Scroll down</div>
          <ChevronDown className="w-5 h-5 mx-auto" style={{ color: '#000' }} />
        </motion.div>
      )}
    </div>
  );
}