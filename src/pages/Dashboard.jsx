import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { MapPin, Users, Settings, ArrowRight, Home, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import TaskTimeline from '../components/dashboard/TaskTimeline';
import AccomplishmentsModal from '../components/dashboard/AccomplishmentsModal';

const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";

export default function Dashboard() {
  const [showAccomplishments, setShowAccomplishments] = useState(false);
  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => base44.entities.RelocationTask.list('-created_date', 50),
    initialData: [],
  });

  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen" style={{ background: '#080808' }}>
      {/* Header */}
      <header className="sticky top-0 z-40 frosted-dark" style={{ borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/Home">
            <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-12 w-auto cursor-pointer" />
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/Chat">
              <button className="gold-btn gap-2 text-xs font-bold rounded-full px-4 py-2">
                Talk to Charlie
              </button>
            </Link>
            <Link to="/Admin">
              <Button variant="ghost" size="icon" className="h-8 w-8" style={{ color: '#D4AF37' }}>
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Welcome + Stats Compact */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <h2 className="text-xl font-black mb-1" style={{ color: '#fff' }}>Welcome back! ✨</h2>
            <p className="text-xs mb-4" style={{ color: '#666' }}>Your relocation progress</p>
            
            {/* Compact stats grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg p-3" style={{ background: '#111', border: '1px solid #222' }}>
                <p className="text-xs" style={{ color: '#888' }}>Total</p>
                <p className="text-lg font-bold" style={{ color: '#fff' }}>{totalTasks}</p>
              </div>
              <div className="rounded-lg p-3" style={{ background: '#111', border: '1px solid #2a2' }}>
                <p className="text-xs" style={{ color: '#888' }}>Completed</p>
                <p className="text-lg font-bold" style={{ color: '#4f4' }}>{completedTasks}</p>
              </div>
              <div className="rounded-lg p-3" style={{ background: '#111', border: '1px solid #D4AF3733' }}>
                <p className="text-xs" style={{ color: '#888' }}>Progress</p>
                <p className="text-lg font-bold" style={{ color: '#D4AF37' }}>{progressPercent}%</p>
              </div>
            </div>
          </motion.div>

          {/* Charlie card - right side */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-lg p-4" 
            style={{ background: '#111', border: '1px solid #D4AF3744' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <img src={DYSON_LOGO} alt="Charlie" className="h-8 w-auto" />
              <div>
                <h3 className="text-xs font-bold" style={{ color: '#D4AF37' }}>Charlie</h3>
                <p className="text-xs" style={{ color: '#666' }}>AI Concierge</p>
              </div>
            </div>
            <p className="text-xs mb-3 leading-relaxed" style={{ color: '#888' }}>
              Questions about your move? Ask Charlie.
            </p>
            <Link to="/Chat">
              <button className="w-full py-2 rounded-lg font-bold text-xs" style={{ background: '#D4AF37', color: '#000' }}>
                Talk to Charlie
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Progress bar - compact */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-lg p-3 mb-6"
          style={{ background: '#111', border: '1px solid #D4AF3733' }}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold" style={{ color: '#fff' }}>Relocation Progress</h3>
            <button
              onClick={() => setShowAccomplishments(true)}
              className="text-xs font-semibold px-2 py-1 rounded transition-all hover:opacity-90"
              style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: `1px solid rgba(212,175,55,0.3)` }}
            >
              <Zap className="w-2.5 h-2.5 inline mr-0.5" /> View
            </button>
          </div>
          <Progress value={progressPercent} className="h-1.5" />
        </motion.div>

        <AccomplishmentsModal open={showAccomplishments} onClose={() => setShowAccomplishments(false)} tasks={tasks} />

        {/* Main content - Tasks only */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-lg p-4"
          style={{ background: '#111', border: '1px solid #222' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold" style={{ color: '#fff' }}>Relocation Tasks</h3>
            <Link to="/Chat">
              <Button variant="ghost" size="sm" className="gap-1 text-xs" style={{ color: '#D4AF37', padding: '0.25rem 0.5rem', height: 'auto' }}>
                Add tasks <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
          <TaskTimeline tasks={tasks} />
        </motion.div>

        {/* Quick Links - Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-4 rounded-lg p-4"
          style={{ background: '#111', border: '1px solid #222' }}
        >
          <h3 className="text-xs font-bold mb-3" style={{ color: '#fff' }}>Quick Links</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            <Link to="/CityGuide" className="flex flex-col items-center gap-1 p-2 rounded text-center transition-colors hover:bg-white/5">
              <MapPin className="w-4 h-4" style={{ color: '#D4AF37' }} />
              <span className="text-xs" style={{ color: '#aaa' }}>Guide</span>
            </Link>
            <Link to="/Chat" className="flex flex-col items-center gap-1 p-2 rounded text-center transition-colors hover:bg-white/5">
              <Users className="w-4 h-4" style={{ color: '#D4AF37' }} />
              <span className="text-xs" style={{ color: '#aaa' }}>Agent</span>
            </Link>
            <Link to="/Search" className="flex flex-col items-center gap-1 p-2 rounded text-center transition-colors hover:bg-white/5">
              <Home className="w-4 h-4" style={{ color: '#D4AF37' }} />
              <span className="text-xs" style={{ color: '#aaa' }}>Search</span>
            </Link>
            <a href="https://www.zillow.com" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 p-2 rounded text-center transition-colors hover:bg-white/5">
              <span className="w-4 h-4 flex items-center justify-center text-xs font-black" style={{ color: '#006AFF' }}>Z</span>
              <span className="text-xs" style={{ color: '#aaa' }}>Zillow</span>
            </a>
            <a href="https://www.realtor.com" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 p-2 rounded text-center transition-colors hover:bg-white/5">
              <span className="w-4 h-4 flex items-center justify-center text-xs font-black" style={{ color: '#D92228' }}>R</span>
              <span className="text-xs" style={{ color: '#aaa' }}>Realtor</span>
            </a>
          </div>
        </motion.div>
      </main>
    </div>
  );
}