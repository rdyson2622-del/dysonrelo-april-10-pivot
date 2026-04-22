import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Globe, ChevronDown, ChevronUp, Zap } from 'lucide-react';

const DNN_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";

const TRIGGER_LABELS = {
  tax_policy: 'TAX POLICY',
  housing_market: 'HOUSING MARKET',
  job_market: 'JOB MARKET',
  interest_rates: 'INTEREST RATES',
  migration_data: 'MIGRATION DATA',
  employer_news: 'EMPLOYER NEWS',
  general: 'GENERAL',
};

const TRIGGER_COLORS = {
  tax_policy: 'rgba(239,68,68,0.15)',
  housing_market: 'rgba(59,130,246,0.15)',
  job_market: 'rgba(168,85,247,0.15)',
  interest_rates: 'rgba(245,158,11,0.15)',
  migration_data: 'rgba(34,197,94,0.15)',
  employer_news: 'rgba(99,102,241,0.15)',
  general: 'rgba(255,255,255,0.07)',
};

const TRIGGER_TEXT = {
  tax_policy: '#f87171',
  housing_market: '#60a5fa',
  job_market: '#c084fc',
  interest_rates: '#fbbf24',
  migration_data: '#4ade80',
  employer_news: '#818cf8',
  general: '#94a3b8',
};

export default function ConsumerDnnNews() {
  const [expandedId, setExpandedId] = useState(null);

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['dnnArticlesConsumer'],
    queryFn: () => base44.entities.DnnArticle.filter({ status: 'published' }, '-generated_date', 50),
  });

  // Also show blasted articles
  const { data: blasted = [] } = useQuery({
    queryKey: ['dnnArticlesBlasted'],
    queryFn: () => base44.entities.DnnArticle.filter({ status: 'blasted' }, '-generated_date', 50),
  });

  const allArticles = [...articles, ...blasted].sort((a, b) =>
    new Date(b.generated_date || b.created_date) - new Date(a.generated_date || a.created_date)
  );

  return (
    <div className="min-h-screen" style={{ background: '#080808' }}>
      {/* Header */}
      <div className="sticky top-0 z-20 px-6 py-4 flex items-center justify-between" style={{ background: 'rgba(8,8,8,0.95)', borderBottom: '1px solid rgba(212,175,55,0.15)', backdropFilter: 'blur(10px)' }}>
        <div className="flex items-center gap-3">
          <img src={DNN_LOGO} alt="DNN" className="h-8 w-auto" />
          <div>
            <p className="text-xs font-black tracking-[0.3em] uppercase" style={{ color: '#D4AF37' }}>DNN</p>
            <p className="text-[10px] tracking-widest text-slate-500 uppercase">Real Estate Intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: '#D4AF37' }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#D4AF37' }} />
          LIVE FEED
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Intro */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
            style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', color: '#D4AF37' }}>
            <Globe className="w-3 h-3" /> Intelligence Bureau
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Real Estate Intelligence</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Market-moving news curated daily by DNN's AI Intelligence Bureau — localized to the markets that matter to your move.
          </p>
        </div>

        {/* Articles */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-slate-800 border-t-yellow-500 rounded-full animate-spin" />
          </div>
        )}

        {!isLoading && allArticles.length === 0 && (
          <div className="text-center py-24 space-y-3">
            <Globe className="w-10 h-10 mx-auto text-slate-700" />
            <p className="text-slate-500 font-medium">Today's intelligence brief is being prepared.</p>
            <p className="text-slate-600 text-sm">Check back shortly — our AI Bureau publishes daily.</p>
          </div>
        )}

        <div className="space-y-4">
          {allArticles.map((article) => {
            const isExpanded = expandedId === article.id;
            const bgColor = TRIGGER_COLORS[article.trigger_type] || TRIGGER_COLORS.general;
            const textColor = TRIGGER_TEXT[article.trigger_type] || TRIGGER_TEXT.general;
            const label = TRIGGER_LABELS[article.trigger_type] || 'GENERAL';

            return (
              <div key={article.id}
                className="rounded-2xl overflow-hidden cursor-pointer transition-all"
                style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}
                onClick={() => setExpandedId(isExpanded ? null : article.id)}>

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-black tracking-widest px-2 py-0.5 rounded-full uppercase"
                      style={{ background: bgColor, color: textColor }}>
                      {label}
                    </span>
                    <span className="text-[10px] text-slate-600">
                      {article.generated_date
                        ? new Date(article.generated_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : ''}
                    </span>
                  </div>

                  <h2 className="text-white font-bold text-base leading-snug mb-1">{article.headline}</h2>
                  {article.dateline && (
                    <p className="text-[11px] text-slate-600 font-mono">{article.dateline}</p>
                  )}

                  {!isExpanded && (
                    <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {article.body?.split('\n')[0]}
                    </p>
                  )}

                  {isExpanded && (
                    <div className="mt-4 border-t pt-4 space-y-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      {article.body?.split('\n').filter(p => p.trim()).map((para, i) => (
                        <p key={i} className="text-sm text-slate-300 leading-relaxed">{para}</p>
                      ))}
                      {article.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {article.tags.map(t => (
                            <span key={t} className="text-[10px] bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">#{t}</span>
                          ))}
                        </div>
                      )}
                      <p className="text-[10px] text-slate-700 pt-1 italic">Published by DNN Intelligence Bureau · Dyson & Dyson Real Estate Concierge</p>
                    </div>
                  )}
                </div>

                <div className="px-5 pb-3 flex items-center justify-between">
                  <span className="text-[11px] text-slate-600">
                    {isExpanded ? 'Tap to collapse' : 'Tap to read full brief'}
                  </span>
                  {isExpanded
                    ? <ChevronUp className="w-4 h-4 text-slate-600" />
                    : <ChevronDown className="w-4 h-4 text-slate-600" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer brand */}
        <div className="mt-12 text-center pb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-px flex-1 max-w-16" style={{ background: 'rgba(212,175,55,0.2)' }} />
            <img src={DNN_LOGO} alt="DNN" className="h-6 w-auto opacity-40" />
            <div className="h-px flex-1 max-w-16" style={{ background: 'rgba(212,175,55,0.2)' }} />
          </div>
          <p className="text-[11px] text-slate-700">DNN Intelligence Bureau · AI-generated content · For informational purposes only</p>
        </div>
      </div>
    </div>
  );
}