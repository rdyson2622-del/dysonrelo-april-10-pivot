import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { MapPin, CheckCircle2, Clock, Users, Settings, ArrowRight, FileText, Church, Home, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import StatCard from '../components/dashboard/StatCard';
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
          <Link to="/Home"><img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-12 w-auto cursor-pointer" /></Link>
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

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-black" style={{ color: '#fff' }}>Welcome back! ✨</h2>
          <p className="mt-1 text-sm" style={{ color: '#666' }}>Your AI-powered relocation command center</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Tasks" value={totalTasks} icon={CheckCircle2} color="orange" delay={0} />
          <StatCard title="Completed" value={completedTasks} icon={CheckCircle2} color="green" delay={0.05} />
          <StatCard title="In Progress" value={tasks.filter((t) => t.status === 'in_progress').length} icon={Clock} color="blue" delay={0.1} />
          <StatCard title="Progress" value={`${progressPercent}%`} icon={MapPin} color="purple" delay={0.15} />
        </div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-6 mb-8"
          style={{ background: '#111', border: '1px solid #D4AF3733' }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold" style={{ color: '#fff' }}>Relocation Progress</h3>
            <button
              onClick={() => setShowAccomplishments(true)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-90"
              style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: `1px solid rgba(212,175,55,0.3)` }}
            >
              <Zap className="w-3 h-3 inline mr-1" /> See Results
            </button>
          </div>
          <Progress value={progressPercent} className="h-2" />
          <p className="text-xs text-slate-400 mt-2">
            {completedTasks} of {totalTasks} tasks completed
          </p>
        </motion.div>

        <AccomplishmentsModal open={showAccomplishments} onClose={() => setShowAccomplishments(false)} tasks={tasks} />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Tasks */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="lg:col-span-2 rounded-2xl p-6"
            style={{ background: '#111', border: '1px solid #222' }}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold" style={{ color: '#fff' }}>Relocation Tasks</h3>
              <Link to="/Chat">
                <Button variant="ghost" size="sm" className="gap-1 text-xs font-semibold" style={{ color: '#D4AF37' }}>
                  Ask Charlie to add tasks <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
            <TaskTimeline tasks={tasks} />
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="rounded-2xl p-6" style={{ background: '#111', border: '1px solid #D4AF3744' }}>
              <div className="flex items-center gap-3 mb-4">
                <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-14 w-auto" />
                <div>
                  <h3 className="font-bold text-sm" style={{ color: '#D4AF37' }}>Charlie</h3>
                  <p className="text-xs" style={{ color: '#666' }}>AI Concierge • Free</p>
                </div>
              </div>
              <p className="text-sm mb-4 leading-relaxed" style={{ color: '#888' }}>
                Charlie handles neighborhoods, agent matching, utilities, schools, and every detail of your relocation — completely free.
              </p>
              <Link to="/Chat">
                <button className="w-full py-2.5 rounded-xl font-bold text-sm" style={{ background: '#D4AF37', color: '#000' }}>
                  Talk to Charlie
                </button>
              </Link>
            </div>

            <div className="rounded-2xl p-5" style={{ background: '#111', border: '1px solid #222' }}>
              <h3 className="font-bold text-sm mb-3" style={{ color: '#fff' }}>Quick Links</h3>
              <div className="space-y-1">
                <Link to="/CityGuide" className="flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-white/5">
                  <MapPin className="w-4 h-4" style={{ color: '#D4AF37' }} />
                  <span className="text-sm" style={{ color: '#aaa' }}>City Guide</span>
                </Link>
                <Link to="/Chat" className="flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-white/5">
                  <Users className="w-4 h-4" style={{ color: '#D4AF37' }} />
                  <span className="text-sm" style={{ color: '#aaa' }}>Find My Agent</span>
                </Link>
                <Link to="/Chat" className="flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-white/5">
                  <FileText className="w-4 h-4" style={{ color: '#D4AF37' }} />
                  <span className="text-sm" style={{ color: '#aaa' }}>My Move Plan</span>
                </Link>

                <div className="pt-2 pb-1">
                  <p className="text-xs font-bold tracking-widest px-2 mb-1" style={{ color: '#444' }}>PROPERTY SEARCH</p>
                </div>
                <Link to="/Search" className="flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-white/5">
                  <Home className="w-4 h-4" style={{ color: '#D4AF37' }} />
                  <span className="text-sm" style={{ color: '#aaa' }}>Search Listings</span>
                </Link>

                <div className="pt-2 pb-1">
                  <p className="text-xs font-bold tracking-widest px-2 mb-1" style={{ color: '#444' }}>FIND A CHURCH</p>
                </div>
                <a href="https://www.churchfinder.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-white/5">
                  <Church className="w-4 h-4" style={{ color: '#D4AF37' }} />
                  <span className="text-sm" style={{ color: '#aaa' }}>ChurchFinder</span>
                </a>
                <a href="https://www.findachurch.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-white/5">
                  <Church className="w-4 h-4" style={{ color: '#D4AF37' }} />
                  <span className="text-sm" style={{ color: '#aaa' }}>FindAChurch</span>
                </a>
                <Link to="/Chat" className="flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-white/5">
                  <Users className="w-4 h-4" style={{ color: '#D4AF37' }} />
                  <span className="text-sm" style={{ color: '#aaa' }}>Ask Charlie to Find One</span>
                </Link>

                <div className="pt-2 pb-1">
                  <p className="text-xs font-bold tracking-widest px-2 mb-1" style={{ color: '#444' }}>SEARCH HOMES</p>
                </div>
                <a href="https://www.zillow.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-white/5">
                  <span className="w-4 h-4 flex items-center justify-center text-xs font-black" style={{ color: '#006AFF' }}>Z</span>
                  <span className="text-sm" style={{ color: '#aaa' }}>Zillow</span>
                </a>
                <a href="https://www.realtor.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-white/5">
                  <span className="w-4 h-4 flex items-center justify-center text-xs font-black" style={{ color: '#D92228' }}>R</span>
                  <span className="text-sm" style={{ color: '#aaa' }}>Realtor.com</span>
                </a>
                <a href="https://www.redfin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-white/5">
                  <span className="w-4 h-4 flex items-center justify-center text-xs font-black" style={{ color: '#CC2943' }}>RF</span>
                  <span className="text-sm" style={{ color: '#aaa' }}>Redfin</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}