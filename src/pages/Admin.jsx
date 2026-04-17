import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, Home, UserCheck, Search, SendHorizontal, Flag,
  BookOpen, MessageCircle, FileText, Link as LinkIcon, ScrollText, ArrowRight, Download,
  Brain, AlertTriangle, Sparkles, Zap
} from 'lucide-react';

const GOLD = '#D4AF37';

const adminSections = [
  {
    heading: 'QUICK SEARCHES',
    color: GOLD,
    modules: [
      { name: 'Search Listing Profiles', path: '/admin/search-profiles', icon: Search, description: 'Find and manage property search profiles', color: '#3B82F6' },
      { name: 'Skip Trace Lookup', path: '/admin/skip-trace', icon: Search, description: 'Find owner name & contact info by property address via BatchData', color: '#D4AF37' },
      { name: 'Outreach Pipeline', path: '/admin/outreach-pipeline', icon: SendHorizontal, description: 'Monitor outreach workflow stages', color: '#F59E0B' },
      { name: 'Compose SMS', path: '/admin/compose-sms', icon: MessageCircle, description: 'Send SMS campaigns to owners', color: '#06B6D4' },
      { name: 'Owner Response Board', path: '/admin/owner-kanban', icon: Home, description: 'View owner responses and engagement', color: '#10B981' },
      { name: 'Batch SMS Logs', path: '/admin/batch-sms-log', icon: Download, description: 'View sent batch SMS history', color: '#22C55E' },
    ]
  },
  {
    heading: 'MARKETING CAMPAIGNS',
    color: GOLD,
    modules: [
      { name: 'Scheduled Campaigns', path: '/admin/scheduled-campaigns', icon: ScrollText, description: 'Schedule and manage SMS campaigns', color: '#F97316' },
      { name: 'Outreach Analytics', path: '/admin/outreach-analytics', icon: Sparkles, description: 'Track campaign performance metrics', color: '#EC4899' },
      { name: 'SMS Sequences', path: '/admin/sms-sequences', icon: SendHorizontal, description: 'Build multi-step SMS sequences', color: '#06B6D4' },
    ]
  },
  {
    heading: 'RESULTS',
    color: GOLD,
    modules: [
      { name: 'Listing Owners Info', path: '/admin/owners', icon: Home, description: 'View and manage listing owner database', color: '#10B981' },
      { name: 'Clients', path: '/admin/clients', icon: UserCheck, description: 'View relocation leads and track progress', color: '#8B5CF6' },
    ]
  },
  {
    heading: 'OPERATIONS',
    color: GOLD,
    modules: [
      { name: 'Presentation Library', path: '/admin/presentation-library', icon: FileText, description: 'Manage presentations and slide decks', color: '#EC4899' },
      { name: 'Flagged Messages', path: '/admin/flagged-conversations', icon: Flag, description: 'Review flagged conversations', color: '#EF4444' },
      { name: 'Referral Management', path: '/admin/referrals', icon: LinkIcon, description: 'Track agent referrals and fees', color: '#14B8A6' },
    ]
  },
];

export default function Admin() {
  return (
    <div className="min-h-screen p-6" style={{ background: '#0a0a0a' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-xs font-bold tracking-[0.3em] mb-2" style={{ color: GOLD }}>ADMIN COMMAND CENTER</p>
          <h1 className="display-heading mb-2 whitespace-nowrap" style={{ fontSize: 'clamp(1.5rem, 3.4vw, 2.55rem)', color: '#fff' }}>Dyson & Dyson Admin</h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Manage your relocation business operations
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Active Clients', value: '12', icon: UserCheck },
            { label: 'Listing Owners', value: '48', icon: Home },
            { label: 'Active Campaigns', value: '3', icon: SendHorizontal },
            { label: 'Pending Referrals', value: '5', icon: LinkIcon },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded-2xl p-4"
              style={{ background: '#000', border: '1px solid rgba(212,175,55,0.2)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="w-4 h-4" style={{ color: GOLD }} />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{stat.label}</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: '#fff' }}>{stat.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Admin Sections with Grouped Headers */}
        {adminSections.map((section, sectionIdx) => (
          <motion.div
            key={section.heading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + sectionIdx * 0.05 }}
            className="mt-8"
          >
            {/* Gold Section Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6" style={{ background: GOLD }} />
              <p className="text-xs font-bold tracking-[0.3em]" style={{ color: GOLD }}>{section.heading}</p>
            </div>

            {/* Modules Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.modules.map((module) => {
                const Icon = module.icon;
                return (
                  <Link
                    key={module.path}
                    to={module.path}
                    className="group rounded-2xl p-5 transition-all hover:scale-[1.02]"
                    style={{
                      background: '#000',
                      border: '1px solid rgba(212,175,55,0.2)',
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: `${module.color}22`, border: `1px solid ${module.color}44` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: module.color }} />
                      </div>
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" style={{ color: GOLD }} />
                    </div>
                    <h3 className="font-bold mb-1" style={{ color: '#fff' }}>{module.name}</h3>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{module.description}</p>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        ))}

        {/* Charlie Command Center */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-8 rounded-2xl p-6"
          style={{ background: '#000', border: `1px solid #A78BFA44` }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#A78BFA22', border: '1px solid #A78BFA44' }}>
              <Brain className="w-5 h-5" style={{ color: '#A78BFA' }} />
            </div>
            <div>
              <p className="text-xs font-bold tracking-[0.3em]" style={{ color: '#A78BFA' }}>CHARLIE'S BRAIN</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Build, train & monitor your AI advisor</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { label: "Scripts", sub: "What Charlie says", path: '/admin/charlie-scripts', icon: ScrollText, color: '#F97316' },
              { label: "Knowledge Base", sub: "What Charlie knows", path: '/admin/charlie-knowledge-base', icon: Brain, color: '#A78BFA' },
              { label: "Escalations", sub: "What Charlie missed", path: '/admin/charlie-escalations', icon: AlertTriangle, color: '#EF4444' },
            ].map(item => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}
                  className="group rounded-xl p-4 transition-all hover:scale-[1.02]"
                  style={{ background: '#0d0d0d', border: `1px solid ${item.color}33` }}>
                  <Icon className="w-5 h-5 mb-2" style={{ color: item.color }} />
                  <p className="font-bold text-sm" style={{ color: '#fff' }}>{item.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{item.sub}</p>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 rounded-2xl p-6"
          style={{ background: '#000', border: `1px solid ${GOLD}` }}
        >
          <p className="text-xs font-bold tracking-[0.3em] mb-4" style={{ color: GOLD }}>QUICK ACTIONS</p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/outreach-campaigns"
              className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
              style={{ background: GOLD, color: '#000' }}
            >
              + New Campaign
            </Link>
            <Link
              to="/admin/clients"
              className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
              style={{ background: 'rgba(212,175,55,0.2)', color: GOLD, border: '1px solid rgba(212,175,55,0.3)' }}
            >
              View All Clients
            </Link>
            <Link
              to="/admin/charlie-scripts"
              className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
              style={{ background: 'rgba(212,175,55,0.2)', color: GOLD, border: '1px solid rgba(212,175,55,0.3)' }}
            >
              Edit Charlie Scripts
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}