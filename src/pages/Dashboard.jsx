import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { MapPin, CheckCircle2, Clock, Users, Settings, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import StatCard from '../components/dashboard/StatCard';
import TaskTimeline from '../components/dashboard/TaskTimeline';
import DnDLogo from '../components/brand/DnDLogo';

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
    <div className="min-h-screen" style={{ background: '#080808' }}>
      {/* Header */}
      <header className="sticky top-0 z-40" style={{ background: '#0a0a0a', borderBottom: '1px solid #D4AF3733' }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DnDLogo size="sm" />
            <div>
              <h1 className="font-black text-sm tracking-tight" style={{ color: '#D4AF37' }}>CONCIERGE RELOCATION SERVICES</h1>
              <p className="text-xs" style={{ color: '#555' }}>Your personal AI dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/Chat">
              <Button size="sm" className="gap-2 text-xs font-bold rounded-lg" style={{ background: '#D4AF37', color: '#000' }}>
                Talk to Charlie
              </Button>
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
            <span className="text-sm font-bold" style={{ color: '#D4AF37' }}>{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
          <p className="text-xs text-slate-400 mt-2">
            {completedTasks} of {totalTasks} tasks completed
          </p>
        </motion.div>

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
                <DnDLogo size="md" speaking={false} />
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
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}