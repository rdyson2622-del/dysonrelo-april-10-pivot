import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const GOLD = '#D4AF37';

const AGENTS = [
  { icon: '💬', name: 'Charlie', role: 'Portal Concierge', color: '#B8860B' },
  { icon: '🎯', name: 'Scout', role: 'Lead Scoring', color: '#4169E1' },
  { icon: '👤', name: 'Nexus', role: 'Network Matcher', color: '#FF8C00' },
  { icon: '📈', name: 'Pulse', role: 'Market Intelligence', color: '#20B820' },
  { icon: '🛡️', name: 'Guardian', role: 'Transaction Oversight', color: '#9932CC' },
  { icon: '⏰', name: 'Relay', role: 'Follow-Up Automation', color: '#DC143C' },
  { icon: '✍️', name: 'Composer', role: 'Content Generator', color: '#20B2AA' },
  { icon: '📢', name: 'Signal', role: 'Notification Engine', color: '#FF6347' },
  { icon: '📊', name: 'Advisor', role: 'Escrower Simulator', color: '#20B820' },
  { icon: '🏠', name: 'Keeper', role: 'Homeowner Assistant', color: '#1E90FF' },
  { icon: '🚀', name: 'Bridge', role: 'Referral Coordinator', color: '#FF1493' },
  { icon: '👁️', name: 'Lens', role: 'Profile Optimizer', color: '#9932CC' },
  { icon: '📚', name: 'Curator', role: 'Education Pathways', color: '#228B22' },
  { icon: '🔧', name: 'Dispatch', role: 'Service Coordinator', color: '#DC143C' },
  { icon: '⚡', name: 'Harvest', role: 'Credit Engine', color: '#FFD700' },
  { icon: '🛡️', name: 'Anchor', role: 'Compliance Monitor', color: '#808080' },
  { icon: '🔍', name: 'Radar', role: 'Opportunity Finder', color: '#00BFFF' },
  { icon: '🎼', name: 'Conductor', role: 'Workflow Orchestrator', color: '#FF1493' },
  { icon: '📰', name: 'Herald', role: 'News & Distribution', color: '#20B820' },
  { icon: '📧', name: 'Emissary', role: 'Email Intelligence', color: '#FFB6C1' },
  { icon: '🎯', name: 'Sentinel', role: 'Admin Intelligence', color: '#DAA520' },
];

export default function AIAssistants() {
  return (
    <div className="min-h-screen py-16 px-6 md:px-14" style={{ background: '#6b6b6b', color: '#fff' }}>
      <div className="max-w-7xl mx-auto">
        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm mb-10" style={{ color: 'rgba(255,255,255,0.5)' }}>
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-4">
            <p className="text-xs font-bold tracking-[0.3em]" style={{ color: GOLD }}>INTELLIGENT ORCHESTRATION</p>
          </div>
          <h1 className="display-heading mb-4" style={{ fontSize: 'clamp(1.35rem, 3vw, 2.25rem)', letterSpacing: '0.18em', color: '#fff' }}>
            Each Assistant Specializes in One Domain
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
            but they communicate with each other — passing insights, triggering actions, and optimizing outcomes together.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {AGENTS.map((agent, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.5 }}
              className="flex flex-col items-center p-4 rounded-xl transition-all hover:scale-105"
              style={{ background: '#111', border: `1px solid ${GOLD}` }}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-2"
                style={{ background: `${agent.color}22`, border: `1px solid ${agent.color}44` }}>
                {agent.icon}
              </div>
              <p className="text-xs font-bold text-center" style={{ color: '#fff' }}>{agent.name}</p>
              <p className="text-xs text-center mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>{agent.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}