import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sections } from '@/lib/businessPlanSections';

const GOLD = '#D4AF37';

export default function BusinessPlan() {
  const [expandedSection, setExpandedSection] = useState('executive-summary');
  const [localSections] = useState(sections);

  const exportToPDF = () => {
    alert('PDF export coming soon. For now, use browser Print to PDF.');
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8" style={{ background: '#ede0cc' }}>
      <main className="max-w-6xl mx-auto space-y-6 text-left">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-1 font-sans" style={{ color: '#854d0e' }}>
              STRATEGIC ARCHITECTURE &amp; TIMELINE
            </p>
            <h1 className="display-heading mb-1 text-2xl sm:text-3xl" style={{ color: '#0a0a0a' }}>
              DysonRelo Business Plan
            </h1>
            <p className="text-xs sm:text-sm text-[#44382c] font-medium leading-relaxed">
              Executive business model, unit economics, fiduciary moat, and technology roadmaps.
            </p>
          </div>
          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-md self-start sm:self-auto cursor-pointer"
            style={{ background: GOLD, color: '#000' }}
          >
            <Download className="w-4 h-4" /> Export Plan
          </button>
        </div>

        {/* Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { label: 'Market Size', value: '8-9M Relocations/Year', color: '#4169E1' },
            { label: 'Target Penetration', value: '5% = Transformational', color: '#20B820' },
            { label: 'Revenue Model', value: 'Agent Referral Fees', color: '#FF8C00' },
            { label: 'Competitive Moat', value: 'Data Aggregation + Network', color: '#9932CC' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-2xl shadow-xl" style={{ background: '#0a0a0a', border: `1.5px solid ${item.color}80` }}>
              <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: item.color }}>
                {item.label}
              </p>
              <p className="text-base font-bold mt-1 text-white">{item.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-1.5">
              {localSections.map((section) => {
                const Icon = section.icon;
                const isSelected = expandedSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setExpandedSection(section.id)}
                    className={`w-full text-left flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all text-xs font-bold shadow-sm cursor-pointer ${
                      isSelected
                        ? 'bg-[#0a0a0a] text-[#D4AF37] border-2 border-[#D4AF37] shadow-md scale-102'
                        : 'bg-[#14120b] hover:bg-[#1f190e] text-white/80 hover:text-white border border-[#D4AF37]/35'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-[#D4AF37]" />
                    <span className="truncate">{section.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {localSections.map((section) => (
              expandedSection === section.id && (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 sm:p-8 rounded-3xl shadow-2xl"
                  style={{ background: '#0a0a0a', border: '1.5px solid rgba(212,175,55,0.45)' }}
                >
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                    {React.createElement(section.icon, { className: 'w-6 h-6', style: { color: GOLD } })}
                    <h2 className="serif-heading text-2xl text-white">{section.title}</h2>
                  </div>
                  <div className="space-y-4 text-white/85">
                    {section.content.split('\n\n').map((para, i) => (
                      <p key={i} className="leading-relaxed whitespace-pre-wrap text-sm">{para}</p>
                    ))}
                  </div>
                </motion.div>
              )
            ))}
          </div>
        </div>

        {/* Version Control */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-4 rounded-2xl text-center text-xs shadow-md"
          style={{ background: '#0a0a0a', border: '1px solid rgba(212,175,55,0.3)', color: 'rgba(255,255,255,0.7)' }}
        >
          <p>Business Plan v8.1 • Last Updated: August 31, 2026 • NEW: Pending Sales Campaign — MLS listing agent referral outreach, sourced via Wisdom Properties IDX access (pending Mike West), multi-inbox Resend rotation (~150-200 emails/day, 40/day cap per address). Previously v8.0 • HeyGen Production Cost Optimization — Three-tier strategy (Evergreen Library + Frontend-Assembled Shows + Rare Fresh Renders). Combined render consolidation: Charlie's question + Bob's answer now rendered as ONE HeyGen API call instead of two (50% render reduction). Ongoing production costs reduced from ~$100/day to ~$5-10/day. Evergreen clips rendered once and reused forever. Standardized opens/closes rendered once per show type. Frontend overlays handle all aesthetic changes at zero HeyGen cost. Previously v7.0 • 3-Shard Automated Video Pipeline (Base44 ➔ Make.com ➔ HeyGen) — Shard 1 (Daily News, Solo Charlie), Shard 2 (Site Education, Solo Charlie Walkthrough), Shard 3 (Premium Interview, "Donut" 3-Scene Template). Previously v6.5 • Twilio remains fully intact; SimpleTexting.com reinstated for Top 200 Independent Agent outreach; Gemini 3.1 Flash Live API deployment post-Google I/O.</p>
        </motion.div>
      </main>
    </div>
  );
}