import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Send, CheckCircle2, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const STAGES = [
  {
    id: 1,
    title: 'Daily Property Search',
    description: 'Automated searches run daily based on your criteria',
    icon: Search,
    details: 'Set search profiles for specific cities, price ranges, and property types. The system automatically finds new listings matching your criteria every day.',
    partner: 'Zillow / Realtor / Redfin',
    why: 'Identifying new listings daily to find high-intent sellers.',
    links: [
      { label: 'Zillow', url: 'https://www.zillow.com' },
      { label: 'Realtor.com', url: 'https://www.realtor.com' },
      { label: 'Redfin', url: 'https://www.redfin.com' },
    ],
  },
  {
    id: 2,
    title: 'Obtain Owner Contact Info',
    description: 'Extract contact details from search results',
    icon: Users,
    details: 'Use data enrichment services to identify property owners and get their contact information (phone, email, address).',
    partner: 'BatchData',
    why: 'Skip-tracing the listing address to find the owner\'s phone and email.',
    links: [
      { label: 'BatchData.com', url: 'https://www.batchdata.com' },
    ],
  },
  {
    id: 3,
    title: 'Admin Sends Outreach',
    description: 'SMS, direct contact, or listing agent outreach',
    icon: Send,
    details: 'Reach out to owners with personalized messages. Try direct contact first, then listing agent if no response.',
    partner: 'GoHighLevel / Twilio',
    why: 'Automated SMS and initial "human-touch" text to offer relocation services.',
    links: [
      { label: 'GoHighLevel.com', url: 'https://www.gohighlevel.com' },
    ],
  },
  {
    id: 4,
    title: 'Outcome & Tracking',
    description: 'Active lead or mark as dead file',
    icon: CheckCircle2,
    details: 'Track responses and categorize: active leads move to relocation clients, non-responders go to dead file for later follow-up.',
    partner: 'DysonRelo Internal',
    why: 'Tagging the lead status and moving them into the Gemini Interview pipeline.',
    links: null, // internal link — handled separately
  },
];

const GOLD = '#D4AF37';

export default function SearchProfilesProcessGuide() {
  const [activeStep, setActiveStep] = useState(0);

  const currentStage = STAGES[activeStep];
  const CurrentIcon = currentStage.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
    >
      {/* Header */}
      <div id="202" className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200 p-6" style={{ position: 'relative' }}>
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-blue-600 text-white">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">HOW IT WORKS — BULK SEARCH WORKFLOW</h3>
            <p className="text-sm text-slate-600 mt-1">Click any step to see partner details and access links.</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap gap-2">
        {STAGES.map((stage, idx) => (
          <button
            key={stage.id}
            onClick={() => setActiveStep(idx)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              idx === activeStep
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {stage.id}. {stage.title}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="grid md:grid-cols-2 gap-8 p-6">
        {/* Left — Stage Detail */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <CurrentIcon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-slate-900">{currentStage.title}</h4>
              <p className="text-sm text-slate-600 mt-1">{currentStage.description}</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-sm text-slate-700 leading-relaxed">{currentStage.details}</p>
          </div>

          {/* The Why */}
          <div className="rounded-lg p-4 border" style={{ background: 'rgba(212,175,55,0.06)', borderColor: 'rgba(212,175,55,0.3)' }}>
            <p className="text-xs font-bold mb-1" style={{ color: '#8B6914' }}>THE WHY</p>
            <p className="text-sm text-slate-700 leading-relaxed">{currentStage.why}</p>
          </div>
        </motion.div>

        {/* Right — Partner Access Portal */}
        <motion.div
          key={`side-${activeStep}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          {/* Partner Badge */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-xs font-semibold text-blue-900 mb-1">STEP {currentStage.id} PARTNER</p>
            <p className="font-bold text-blue-900 text-base">{currentStage.partner}</p>
          </div>

          {/* Access Links */}
          <div id="203" className="rounded-xl border border-slate-200 overflow-hidden" style={{ position: 'relative' }}>
            <div className="px-4 py-2.5 bg-slate-800">
              <p className="text-xs font-bold text-white tracking-wider">PARTNER ACCESS PORTAL</p>
            </div>
            <div className="p-4 space-y-2">
              {currentStage.links ? (
                currentStage.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full px-4 py-3 rounded-lg font-bold text-sm transition-all hover:opacity-90"
                    style={{ background: GOLD, color: '#000' }}
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="w-4 h-4 shrink-0" />
                  </a>
                ))
              ) : (
                /* Card 4 — internal link */
                <Link
                  to="/AdminClients"
                  className="flex items-center justify-between w-full px-4 py-3 rounded-lg font-bold text-sm transition-all hover:opacity-90"
                  style={{ background: GOLD, color: '#000' }}
                >
                  <span>Open Clients Tab</span>
                  <ChevronRight className="w-4 h-4 shrink-0" />
                </Link>
              )}
            </div>
          </div>

          {/* Next Step */}
          {activeStep < STAGES.length - 1 && (
            <Button
              onClick={() => setActiveStep(activeStep + 1)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Next Step <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 text-xs text-slate-600">
        Once you create search profiles, new listings will flow through this workflow automatically. Track responses and outcomes in your Listing Outreach Campaigns dashboard.
      </div>
    </motion.div>
  );
}