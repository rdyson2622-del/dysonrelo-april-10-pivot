import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Users, Home, ArrowRight } from 'lucide-react';
import ChatInterface from '@/components/charlie/ChatInterface';

const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";
const GOLD = '#D4AF37';

export default function Home() {
  const [chatExpanded, setChatExpanded] = useState(false);

  const services = [
    { icon: '🏙️', title: 'City & Neighborhood Research', desc: 'Explore lifestyle fit, commute, culture, and community in your destination.' },
    { icon: '🏠', title: 'Home Search & Agent Match', desc: 'Find the perfect property and connect with a vetted top-performing local agent.' },
    { icon: '📦', title: 'Moving Logistics', desc: 'Packing timelines, movers coordination, checklists — all handled.' },
    { icon: '⚡', title: 'Utilities & Services Setup', desc: 'Internet, electric, gas, water — all set up before you arrive.' },
    { icon: '🎓', title: 'School Research & Enrollment', desc: 'District research, school tours, enrollment paperwork guidance.' },
    { icon: '🏥', title: 'Healthcare Setup', desc: 'Find doctors, dentists, specialists in your new area.' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#A9A9A9' }}>
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4" style={{ background: '#000', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-10 w-auto" />
        <Link to="/Explainers">
          <button className="px-6 py-2 rounded-full font-semibold text-sm transition-all" style={{ background: GOLD, color: '#000' }}>
            Learn Our Story
          </button>
        </Link>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
          {/* Left Column - Services */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-8 tracking-widest"
              style={{ background: GOLD, color: '#000' }}>
              ✨ POWERED BY AI
            </div>

            <h1 className="display-heading mb-6" style={{ lineHeight: 1.15, letterSpacing: '0.22em' }}>
              <span style={{ display: 'block', color: '#D4AF37', fontSize: 'clamp(1.4rem, 5vw, 2.8rem)' }}>CONCIERGE</span>
              <span style={{ display: 'block', color: '#000', fontSize: 'clamp(1.2rem, 4vw, 2.4rem)' }}>REAL ESTATE</span>
            </h1>

            <p className="text-lg leading-relaxed mb-4" style={{ color: '#000' }}>
              Meet Charlie — AI that handles every aspect of your relocation.
            </p>
            <p className="font-semibold mb-8" style={{ color: '#000' }}>
              ✦ Completely free to you.
            </p>

            {/* Services Grid */}
            <div className="grid gap-4 mb-12">
              {services.map((service, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-3 p-3 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(212,175,55,0.2)' }}
                >
                  <span className="text-2xl flex-shrink-0">{service.icon}</span>
                  <div>
                    <h4 className="font-bold text-sm" style={{ color: '#000' }}>{service.title}</h4>
                    <p className="text-xs mt-1" style={{ color: 'rgba(0,0,0,0.7)' }}>{service.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link to="/Chat">
              <button className="px-6 py-3 rounded-full text-sm font-bold transition-all hover:shadow-lg"
                style={{ background: GOLD, color: '#000' }}>
                Start Free Consultation
              </button>
            </Link>
          </motion.div>

          {/* Right Column - Charlie Chat */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <ChatInterface
              expanded={chatExpanded}
              onToggleExpand={() => setChatExpanded(!chatExpanded)}
              initialMessage=""
            />
          </motion.div>
        </div>
      </main>
    </div>
  );
}