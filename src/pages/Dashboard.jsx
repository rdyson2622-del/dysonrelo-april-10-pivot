import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { MapPin, Users, Home, ArrowRight, Settings, MessageCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";
const CHARLIE_IMG = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/626da9da8_Screenshot2026-02-06at123820PM.png";
const GOLD = '#D4AF37';

export default function Dashboard() {
  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => base44.entities.RelocationTask.list('-created_date', 50),
    initialData: [],
  });

  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen" style={{ background: '#A9A9A9' }}>
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4" style={{ background: 'rgba(255,255,255,0.8)', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        <Link to="/Home">
          <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-10 w-auto cursor-pointer" />
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/Chat">
            <button className="px-6 py-2 rounded-full font-semibold text-sm transition-all" style={{ background: GOLD, color: '#000' }}>
              Talk to Charlie
            </button>
          </Link>
          <Link to="/Admin">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="display-heading mb-4" style={{ fontSize: '3.5rem', letterSpacing: '0.22em', color: '#000' }}>
            Welcome Back
          </h1>
          <p className="text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: 'rgba(0,0,0,0.6)' }}>
            Your relocation journey is underway. We're here to guide you every step of the way.
          </p>
        </motion.div>

        {/* Three Column Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {/* Progress Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl p-8"
            style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '1px solid #D4AF37' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="serif-heading text-lg" style={{ color: '#000' }}>Progress</h3>
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: `${GOLD}22` }}>
                <span className="text-2xl font-black" style={{ color: GOLD }}>{progressPercent}%</span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: 'rgba(0,0,0,0.6)' }}>COMPLETED</p>
                <p className="text-3xl font-black" style={{ color: GOLD }}>{completedTasks}</p>
              </div>
              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: 'rgba(0,0,0,0.6)' }}>TOTAL TASKS</p>
                <p className="text-3xl font-black" style={{ color: '#000' }}>{totalTasks}</p>
              </div>
            </div>
          </motion.div>

          {/* Charlie Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl p-8 md:col-span-2"
            style={{ background: `linear-gradient(135deg, ${GOLD}15 0%, ${GOLD}08 100%)`, border: `1px solid ${GOLD}30` }}
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img src={DYSON_LOGO} alt="Charlie" className="h-8 w-auto" />
                  <div>
                    <p className="text-sm font-black" style={{ color: GOLD }}>CHARLIE</p>
                    <p className="text-xs" style={{ color: 'rgba(0,0,0,0.5)' }}>Your AI Concierge</p>
                  </div>
                </div>
                <p className="text-lg leading-relaxed mb-6" style={{ color: 'rgba(0,0,0,0.7)' }}>
                  Have questions about your move? Charlie is available 24/7 to help with everything from neighborhood research to logistics.
                </p>
                <Link to="/Chat">
                  <button className="px-6 py-3 rounded-full font-bold text-sm transition-all hover:shadow-lg flex items-center gap-2" style={{ background: GOLD, color: '#000' }}>
                    <MessageCircle className="w-4 h-4" />
                    Chat with Charlie
                  </button>
                </Link>
              </div>
              <div className="flex justify-center">
                <img src={CHARLIE_IMG} alt="Charlie" className="h-32 w-auto" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Explore Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-20"
        >
          <h2 className="serif-heading text-2xl mb-8" style={{ color: '#000' }}>Quick Access</h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/CityGuide" className="flex items-center gap-2 px-6 py-3 rounded-full transition-all hover:shadow-lg" style={{ background: 'rgba(255,255,255,0.8)' }}>
              <MapPin className="w-4 h-4" style={{ color: GOLD }} />
              <span className="text-sm font-semibold" style={{ color: '#000' }}>City Guide</span>
            </Link>

            <Link to="/Chat" className="flex items-center gap-2 px-6 py-3 rounded-full transition-all hover:shadow-lg" style={{ background: 'rgba(255,255,255,0.8)' }}>
              <Users className="w-4 h-4" style={{ color: GOLD }} />
              <span className="text-sm font-semibold" style={{ color: '#000' }}>Find Agent</span>
            </Link>

            <Link to="/Search" className="flex items-center gap-2 px-6 py-3 rounded-full transition-all hover:shadow-lg" style={{ background: 'rgba(255,255,255,0.8)' }}>
              <Home className="w-4 h-4" style={{ color: GOLD }} />
              <span className="text-sm font-semibold" style={{ color: '#000' }}>Search Homes</span>
            </Link>

            <Link to="/Dashboard" className="flex items-center gap-2 px-6 py-3 rounded-full transition-all hover:shadow-lg" style={{ background: 'rgba(255,255,255,0.8)' }}>
              <CheckCircle2 className="w-4 h-4" style={{ color: GOLD }} />
              <span className="text-sm font-semibold" style={{ color: '#000' }}>My Tasks</span>
            </Link>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl p-8"
          style={{ background: 'rgba(255,255,255,0.7)', border: `1px solid ${GOLD}30` }}
        >
          <h3 className="serif-heading text-xl mb-8" style={{ color: '#000' }}>Next Steps</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '📍', title: 'Research Your Destination', desc: 'Explore neighborhoods and neighborhoods that match your lifestyle' },
              { icon: '🏠', title: 'Find Your Perfect Home', desc: 'Browse listings and get expert recommendations' },
              { icon: '👤', title: 'Connect with an Agent', desc: 'Meet a local real estate professional who specializes in relocations' },
            ].map((step, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-3xl">{step.icon}</span>
                <div>
                  <h4 className="font-bold mb-1" style={{ color: '#000' }}>{step.title}</h4>
                  <p className="text-sm" style={{ color: 'rgba(0,0,0,0.6)' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}