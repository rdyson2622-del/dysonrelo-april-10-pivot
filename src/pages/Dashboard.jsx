import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { MapPin, Users, Home, ArrowRight, Settings, MessageCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";
const CHARLIE_IMG = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/626da9da8_Screenshot2026-02-06at123820PM.png";
const GOLD = '#D4AF37';

export default function Dashboard() {
  const [flaggedCount, setFlaggedCount] = useState(0);

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => base44.entities.RelocationTask.list('-created_date', 50),
    initialData: [],
  });

  useEffect(() => {
    const fetchFlaggedMessages = async () => {
      const flagged = await base44.entities.ChatMessage.filter(
        { flag_status: { $ne: 'none' } }
      );
      setFlaggedCount(flagged.length);
    };
    fetchFlaggedMessages();
  }, []);

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
        {/* Welcome Back Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20 rounded-3xl p-8"
          style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '1px solid #D4AF37' }}
        >
          <h2 className="serif-heading text-2xl mb-4" style={{ color: '#000', letterSpacing: '-0.01em' }}>Welcome Back</h2>
          <p className="text-base leading-relaxed mb-8" style={{ color: 'rgba(0,0,0,0.7)' }}>
            Your relocation journey is underway. We're here to guide you every step of the way.
          </p>
          
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <h3 className="serif-heading text-lg" style={{ color: '#000' }}>Progress</h3>
            <div className="text-right">
              <p className="text-3xl font-black" style={{ color: GOLD }}>{progressPercent}%</p>
            </div>
          </div>
        </motion.div>

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