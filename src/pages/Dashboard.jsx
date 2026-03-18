import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { MapPin, Users, Home, ArrowRight, Settings, MessageCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PlanVoiceNote from '@/components/dashboard/PlanVoiceNote';
import RelocationProfileCard from '@/components/dashboard/RelocationProfileCard';

const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";
const CHARLIE_IMG = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/626da9da8_Screenshot2026-02-06at123820PM.png";
const GOLD = '#D4AF37';

export default function Dashboard() {
  const [flaggedCount, setFlaggedCount] = useState(0);
  const [clientId, setClientId] = useState(null);

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => base44.entities.RelocationTask.list('-created_date', 50),
    initialData: [],
  });

  useEffect(() => {
    const fetchClientAndFlags = async () => {
      try {
        // Get current user's client profile
        const user = await base44.auth.me();
        if (user?.email) {
          const clients = await base44.entities.RelocationClient.filter({ email: user.email }, '-created_date', 1);
          if (clients.length > 0) {
            setClientId(clients[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching client:', err);
      }

      const flagged = await base44.entities.ChatMessage.filter(
        { flag_status: { $ne: 'none' } }
      );
      setFlaggedCount(flagged.length);
    };
    fetchClientAndFlags();
  }, []);

  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen" style={{ background: '#A9A9A9' }}>
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4" style={{ background: '#000', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
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

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Landing Hero Section */}
        <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
          {/* Left Column */}
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

            <div className="flex flex-col gap-3 mb-12">
              <Link to="/Chat">
                <button className="px-6 py-3 rounded-full text-sm font-bold transition-all hover:shadow-lg" 
                  style={{ background: GOLD, color: '#000' }}>
                  Talk to Charlie
                </button>
              </Link>
              <Link to="/Dashboard">
                <button className="px-6 py-3 rounded-full text-sm font-semibold transition-all flex items-center gap-2"
                  style={{ background: '#000', color: '#fff' }}>
                  My Dashboard <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>

            {/* Welcome Back Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl p-6"
              style={{ background: 'rgba(255,255,255,0.95)', border: '2px solid #D4AF37' }}
            >
              <h3 className="serif-heading text-lg mb-3" style={{ color: '#000', letterSpacing: '-0.01em' }}>Welcome Back</h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: '#666' }}>
                Your relocation journey is underway. We're here to guide you every step of the way.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-300">
                <span className="font-semibold" style={{ color: '#000' }}>Progress</span>
                <span className="text-2xl font-black" style={{ color: GOLD }}>{progressPercent}%</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="rounded-3xl p-8"
            style={{ background: '#3a3a3a', border: `2px solid ${GOLD}` }}
          >
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest"
                style={{ background: GOLD, color: '#000' }}>
                AI-POWERED
              </div>
            </div>

            <div className="flex justify-center mb-8">
              <img src={CHARLIE_IMG} alt="Charlie" className="h-40 w-auto" />
            </div>

            <p className="text-center text-xs font-bold tracking-widest mb-6" style={{ color: '#fff' }}>
              CHARLIE — YOUR AI CONCIERGE
            </p>

            <div className="space-y-4 mb-6">
              <div className="rounded-lg px-4 py-3 text-sm leading-relaxed"
                style={{ background: '#000', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                Hello! I'm Charlie. Moving somewhere you don't know anyone? I've got you. Where are you headed? 🏙️
              </div>
              <div className="rounded-lg px-4 py-3 text-sm font-semibold ml-auto w-fit" style={{ background: GOLD, color: '#000' }}>
                We're moving to Austin, TX in June!
              </div>
              <div className="rounded-lg px-4 py-3 text-sm leading-relaxed"
                style={{ background: '#000', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                Perfect! Austin's booming. I'll research the best neighborhoods, connect you with a top local agent, and build your complete moving plan — all free. ✨
              </div>
            </div>

            <Link to="/Chat" className="block w-full">
              <button className="w-full py-3 rounded-full text-sm font-bold tracking-wider transition-all hover:shadow-lg"
                style={{ background: GOLD, color: '#000' }}>
                START FREE CONSULTATION
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Relocation Profile Card */}
        {clientId && (
          <RelocationProfileCard clientId={clientId} />
        )}

        {/* Voice Note Section */}
        {clientId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <PlanVoiceNote clientId={clientId} />
          </motion.div>
        )}

        {/* Quick Access Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-20 rounded-3xl p-8"
          style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid #D4AF37' }}
        >
          <h2 className="serif-heading text-2xl mb-6" style={{ color: '#000' }}>Quick Access</h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/CityGuide" className="flex items-center gap-2 px-6 py-3 rounded-full transition-all hover:shadow-lg" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid #D4AF37' }}>
              <MapPin className="w-4 h-4" style={{ color: GOLD }} />
              <span className="text-sm font-semibold" style={{ color: '#000' }}>City Guide</span>
            </Link>

            <Link to="/Chat" className="flex items-center gap-2 px-6 py-3 rounded-full transition-all hover:shadow-lg" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid #D4AF37' }}>
              <Users className="w-4 h-4" style={{ color: GOLD }} />
              <span className="text-sm font-semibold" style={{ color: '#000' }}>Find Agent</span>
            </Link>

            <Link to="/Search" className="flex items-center gap-2 px-6 py-3 rounded-full transition-all hover:shadow-lg" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid #D4AF37' }}>
              <Home className="w-4 h-4" style={{ color: GOLD }} />
              <span className="text-sm font-semibold" style={{ color: '#000' }}>Search Homes</span>
            </Link>

            <Link to="/Dashboard" className="flex items-center gap-2 px-6 py-3 rounded-full transition-all hover:shadow-lg" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid #D4AF37' }}>
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
          style={{ background: 'rgba(255,255,255,0.7)', border: `1px solid ${GOLD}` }}
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