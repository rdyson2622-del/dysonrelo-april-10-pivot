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
import CharlieAvatar from '../components/charlie/CharlieAvatar';

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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CharlieAvatar size="sm" />
            <div>
              <h1 className="font-bold text-slate-900">ReloCharlie</h1>
              <p className="text-xs text-slate-400">Your relocation dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/Chat">
              <Button variant="outline" size="sm" className="gap-2 text-xs">
                <CharlieAvatar size="sm" /> Chat with Charlie
              </Button>
            </Link>
            <Link to="/Admin">
              <Button variant="ghost" size="icon" className="h-8 w-8">
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
          <h2 className="text-2xl font-bold text-slate-900">Welcome back! 👋</h2>
          <p className="text-slate-500 mt-1">Here's what's happening with your relocation</p>
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
          className="bg-white rounded-2xl border border-slate-100 p-6 mb-8 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900">Relocation Progress</h3>
            <span className="text-sm font-medium text-orange-600">{progressPercent}%</span>
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
            className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-slate-900">Relocation Tasks</h3>
              <Link to="/Chat">
                <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700 gap-1 text-xs">
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
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <CharlieAvatar size="md" speaking={false} />
                <div>
                  <h3 className="font-semibold">Ask Charlie</h3>
                  <p className="text-xs text-slate-300">Your AI relocation buddy</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                Charlie can help you research neighborhoods, set up utilities, find schools, and much more.
              </p>
              <Link to="/Chat">
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl">
                  Start a Conversation
                </Button>
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-3">Quick Links</h3>
              <div className="space-y-2">
                <Link to="/CityGuide" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-slate-600">City Guide</span>
                </Link>
                <Link to="/Chat" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-slate-600">Find Local Pros</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}