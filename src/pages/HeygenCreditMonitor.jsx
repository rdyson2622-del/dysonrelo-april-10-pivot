import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  RefreshCw, Zap, TrendingDown, AlertTriangle, Film, MessageSquare,
  Sparkles, Music, ExternalLink
} from 'lucide-react';

const GOLD = '#D4AF37';
const DNN_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";

export default function HeygenCreditMonitor() {
  const queryClient = useQueryClient();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    base44.auth.me().then(user => {
      if (user?.role !== 'admin') {
        window.location.href = '/';
      } else {
        setIsAdmin(true);
      }
    }).catch(() => window.location.href = '/');
  }, []);

  // Poll HeyGen quota every 15 seconds
  const { data: quota, isLoading } = useQuery({
    queryKey: ['heygenQuota'],
    queryFn: async () => {
      const res = await base44.functions.invoke('heygenQuota', {});
      return res.data?.data || res.data;
    },
    refetchInterval: 15000,
    enabled: isAdmin,
  });

  // Count rendering articles
  const { data: articles = [] } = useQuery({
    queryKey: ['heygenRenderCount'],
    queryFn: () => base44.entities.DnnArticle.filter({ status: 'published' }, '-generated_date', 50),
    refetchInterval: 15000,
    enabled: isAdmin,
  });

  // Aggregate balances + usage for all paid pipeline nodes
  const { data: pipeline, isLoading: pipelineLoading } = useQuery({
    queryKey: ['pipelineCredits'],
    queryFn: async () => {
      const res = await base44.functions.invoke('pipelineCreditsMonitor', {});
      return res.data || res;
    },
    refetchInterval: 30000,
    enabled: isAdmin,
  });

  const rendering = articles.filter(a => a.video_url && a.video_url.startsWith('heygen:pending:'));
  const completed = articles.filter(a => a.video_url && !a.video_url.startsWith('heygen:pending:'));

  const apiCredits = quota?.remaining_quota ?? 0;
  const planCredits = quota?.details?.plan_credit ?? 0;
  const totalCredits = apiCredits + planCredits;

  // HeyGen reports "remaining_quota" — the exact unit (credits vs USD) depends on your plan type.
  // Verify your actual balance and plan at heygen.com/settings/billing.
  const avgCostPerVideo = 30;
  const estimatedRenders = Math.floor(apiCredits / avgCostPerVideo);
  const creditsInUse = rendering.length * avgCostPerVideo;

  const lowThreshold = 200;
  const isLow = apiCredits < lowThreshold;

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen p-6" style={{ background: '#0a0a0a' }}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <img src={DNN_LOGO} alt="DNN" className="h-8 w-auto" />
          <div>
            <h1 className="text-sm font-black tracking-[0.3em] uppercase" style={{ color: GOLD }}>Pipeline Credit Monitor</h1>
            <p className="text-[10px] text-slate-500">Live balances across every paid n8n node — HeyGen, Twilio, Creatomate, Gemini & Epidemic</p>
          </div>
        </div>

        {/* Main credit display */}
        <div className="rounded-3xl p-8 mb-6 relative overflow-hidden"
          style={{ background: isLow ? 'rgba(239,68,68,0.08)' : 'rgba(212,175,55,0.06)', border: `1px solid ${isLow ? 'rgba(239,68,68,0.3)' : 'rgba(212,175,55,0.2)'}` }}>

          {/* Glow effect */}
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-20"
            style={{ background: isLow ? '#ef4444' : GOLD }} />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400 mb-2">API Credits Remaining</p>
              <div className="flex items-baseline gap-3">
                {isLoading ? (
                  <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: `${GOLD}30`, borderTopColor: GOLD }} />
                ) : (
                  <p className="text-6xl font-black" style={{ color: isLow ? '#ef4444' : GOLD, fontFamily: 'Cormorant Garamond, serif' }}>
                    {apiCredits.toLocaleString()}
                  </p>
                )}
                <div className="flex flex-col">
                  <Zap className="w-5 h-5 mb-1" style={{ color: isLow ? '#ef4444' : GOLD }} fill={isLow ? '#ef4444' : GOLD} />
                </div>
              </div>
              <div className="mt-3 flex gap-4 text-xs">
                <span className="text-slate-400">Plan Credits: <strong className="text-white">{planCredits.toLocaleString()}</strong></span>
                <span className="text-slate-400">Total: <strong className="text-white">{totalCredits.toLocaleString()}</strong></span>
              </div>
            </div>

            <button onClick={() => queryClient.invalidateQueries({ queryKey: ['heygenQuota'] })}
              className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg text-black transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37)' }}>
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Now
            </button>
          </div>

          {/* Low credit warning */}
          {isLow && !isLoading && (
            <div className="relative mt-4 flex items-center gap-2 p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-xs text-red-300">Credits are low! Top up at <strong>heygen.com/settings/billing</strong> before continuing renders.</p>
            </div>
          )}

          {/* Estimate */}
          {!isLoading && apiCredits > 0 && (
            <div className="relative mt-4 flex items-center gap-2 text-xs text-slate-400">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>~{estimatedRenders} video renders remaining (est. {avgCostPerVideo} credits per video — verify actual cost at heygen.com/settings/billing)</span>
            </div>
          )}
        </div>

        {/* Active renders */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400 mb-4">Active Render Queue</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(251,191,36,0.08)' }}>
              <p className="text-3xl font-black text-yellow-400" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{rendering.length}</p>
              <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mt-1">Rendering</p>
            </div>
            <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(74,222,128,0.08)' }}>
              <p className="text-3xl font-black text-green-400" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{completed.length}</p>
              <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mt-1">Completed</p>
            </div>
            <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(212,175,55,0.08)' }}>
              <p className="text-3xl font-black" style={{ color: GOLD, fontFamily: 'Cormorant Garamond, serif' }}>{creditsInUse}</p>
              <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mt-1">Credits In Use</p>
            </div>
          </div>

          {/* Rendering articles */}
          {rendering.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-[10px] font-bold tracking-widest uppercase text-slate-600">Currently Rendering:</p>
              {rendering.slice(0, 5).map(a => (
                <div key={a.id} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="w-4 h-4 border-2 rounded-full animate-spin shrink-0" style={{ borderColor: `${GOLD}30`, borderTopColor: GOLD }} />
                  <p className="text-xs text-slate-400 truncate">{a.headline}</p>
                </div>
              ))}
              {rendering.length > 5 && <p className="text-[10px] text-slate-600 pl-6">+{rendering.length - 5} more...</p>}
            </div>
          )}
        </div>

        {/* Pipeline services — other paid n8n nodes */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400">Other Paid Pipeline Nodes</p>
            <button
              onClick={() => queryClient.invalidateQueries({ queryKey: ['pipelineCredits'] })}
              className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1.5 rounded-lg text-black"
              style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37)' }}
            >
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ServiceCard
              icon={MessageSquare}
              color="#f22f46"
              title="Twilio (SMS)"
              tag="Live Balance"
              live={pipeline?.twilio?.available}
              loading={pipelineLoading}
              error={pipeline?.twilio?.error}
              primary={pipeline?.twilio?.available ? `$${Number(pipeline.twilio.balance).toFixed(2)}` : '—'}
              secondary={pipeline?.twilio?.available ? `${pipeline.twilio.currency} · B2B SMS outreach` : 'No balance'}
              dashboardUrl="https://console.twilio.com/us1/develop/console/billing"
            />
            <ServiceCard
              icon={Film}
              color="#8b5cf6"
              title="Creatomate (Studio Composite)"
              tag="Usage Tracked"
              live={false}
              loading={pipelineLoading}
              primary={`${pipeline?.creatomate?.in_progress ?? 0} baking`}
              secondary={`${pipeline?.creatomate?.completed_this_month ?? 0} completed this month`}
              note={pipeline?.creatomate?.note}
              dashboardUrl={pipeline?.creatomate?.dashboard_url}
            />
            <ServiceCard
              icon={Sparkles}
              color="#4285f4"
              title="Gemini (Scripting LLM)"
              tag="Usage Tracked"
              live={false}
              loading={pipelineLoading}
              primary={`${pipeline?.gemini?.articles_today ?? 0} today`}
              secondary="articles generated"
              note={pipeline?.gemini?.note}
              dashboardUrl={pipeline?.gemini?.dashboard_url}
            />
            <ServiceCard
              icon={Music}
              color="#22c55e"
              title="Epidemic Sound (Music)"
              tag="Subscription"
              live={false}
              loading={pipelineLoading}
              primary="Flat plan"
              secondary="no per-call balance"
              note={pipeline?.epidemic?.note}
              dashboardUrl={pipeline?.epidemic?.dashboard_url}
            />
          </div>
        </div>

        {/* Auto-refresh note */}
        <p className="text-center text-[10px] text-slate-600">
          HeyGen + Twilio balances auto-refresh every 15–30s. Creatomate, Gemini & Epidemic have no balance API — usage counts are pulled from the pipeline database instead.
        </p>
      </div>
    </div>
  );
}

// ─── Pipeline Service Card ─────────────────────────────────────────────────
function ServiceCard({ icon: Icon, color, title, tag, live, loading, error, primary, secondary, note, dashboardUrl }) {
  return (
    <div className="rounded-xl p-4 flex flex-col" style={{ background: '#0a0a0a', border: `1px solid ${color}33` }}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}1a` }}>
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <div>
            <p className="text-xs font-bold text-white leading-tight">{title}</p>
            <p className="text-[9px] font-bold tracking-widest uppercase mt-0.5" style={{ color }}>
              {live ? '● Live' : tag}
            </p>
          </div>
        </div>
        {dashboardUrl && (
          <a href={dashboardUrl} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors">
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {loading ? (
        <div className="w-8 h-8 border-2 rounded-full animate-spin mx-auto my-2" style={{ borderColor: `${color}30`, borderTopColor: color }} />
      ) : error ? (
        <p className="text-[11px] text-red-400 leading-snug">{error}</p>
      ) : (
        <>
          <p className="text-2xl font-black" style={{ color, fontFamily: 'Cormorant Garamond, serif' }}>{primary}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">{secondary}</p>
          {note && <p className="text-[10px] text-slate-600 mt-2 leading-snug">{note}</p>}
        </>
      )}
    </div>
  );
}