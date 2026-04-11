import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, Home, UserCheck, Search, SendHorizontal, Flag,
  BookOpen, MessageCircle, FileText, Link as LinkIcon, ScrollText, ArrowRight, Download
} from 'lucide-react';

const GOLD = '#D4AF37';

const adminModules = [
  { name: 'Search Listing Profiles', path: '/admin/search-profiles', icon: Search, description: 'Find and manage property search profiles', color: '#3B82F6' },
  { name: 'Skip Trace Lookup', path: '/admin/skip-trace', icon: Search, description: 'Find owner name & contact info by property address via BatchData', color: '#D4AF37' },
  { name: 'Bulk Skip Trace Builder', path: '/admin/bulk-skip-trace', icon: Download, description: 'Search active listings by city/price → download CSV for BatchData bulk upload', color: '#22C55E' },
  { name: 'Listing Owners Info', path: '/admin/owners', icon: Home, description: 'View and manage listing owner database', color: '#10B981' },
  { name: 'Listing Outreach Campaigns', path: '/admin/outreach-campaigns', icon: SendHorizontal, description: 'Manage seller outreach campaigns', color: '#F59E0B' },
  { name: 'Clients', path: '/admin/clients', icon: UserCheck, description: 'View relocation leads and track progress', color: '#8B5CF6' },
  { name: 'Presentation Library', path: '/admin/presentation-library', icon: FileText, description: 'Manage presentations and slide decks', color: '#EC4899' },
  { name: 'Communications', path: '/admin/communications', icon: MessageCircle, description: 'Review outreach and emails', color: '#06B6D4' },
  { name: 'Flagged Messages', path: '/admin/flagged-conversations', icon: Flag, description: 'Review flagged conversations', color: '#EF4444' },
  { name: 'Referral Management', path: '/admin/referrals', icon: LinkIcon, description: 'Track agent referrals and fees', color: '#14B8A6' },
  { name: "Charlie's Scripts", path: '/admin/charlie-scripts', icon: ScrollText, description: 'Edit AI advisor scripts and responses', color: '#F97316' },
  { name: 'Business Plan', path: '/business-plan', icon: BookOpen, description: 'View business plan and projections', color: '#6366F1' },
];

export default function Admin() {
  return (
    <div className="min-h-screen p-6" style={{ background: '#808080' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-xs font-bold tracking-[0.3em] mb-2" style={{ color: GOLD }}>ADMIN COMMAND CENTER</p>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#fff' }}>Dyson & Dyson Admin</h1>
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

        {/* Admin Modules Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {adminModules.map((module, i) => {
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