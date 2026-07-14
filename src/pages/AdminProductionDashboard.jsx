import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { RefreshCw, Zap, DollarSign, TrendingDown, AlertTriangle, CheckCircle2, XCircle, Clock, Video, Linkedin, BarChart3 } from 'lucide-react';

const GOLD = '#D4AF37';
const COST_PER_RENDER = 30; // HeyGen credits per video render
const COST_PER_COMBINED = 60; // Combined Charlie+Bob render (one call, two characters)

const PIPELINES = [
  { entity: 'CorporateReloClip', label: 'Corporate Relo / HR', fn: 'corporateReloQARender' },
  { entity: 'RealEstateQAClip', label: 'Real Estate Answers', fn: 'realEstateQARender' },
  { entity: 'PortalLeadInClip', label: 'Portal Lead-In Duo', fn: 'portalLeadInRender' },
  { entity: 'DnnNewsClip', label: 'DNN News Clips', fn: 'dnnNewsRender' },
  { entity: 'LenderClip', label: 'Lender FAQ', fn: 'lenderRender' },
  { entity: 'VettingDeskClip', label: 'Vetting Desk', fn: 'vettingDeskQARender' },
  { entity: 'ReceivingAgentClip', label: 'Receiving Agent', fn: 'receivingAgentQARender' },
  { entity: 'RoadmapClip', label: 'Relocation Roadmap', fn: 'roadmapQARender' },
  { entity: 'SolveMyStoryClip', label: 'Solve My Story', fn: 'solveMyStoryRender' },
  { entity: 'DnnComparisonClip', label: 'DNN Comparison', fn: null },
];

export default function AdminProductionDashboard() {
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

  // Fetch all clip entities in parallel
  const pipelineQueries = useQuery({
    queryKey: ['productionDashboard'],
    queryFn: async () => {
      const results = {};
      for (const p of PIPELINES) {
        try {
          const clips = await base44.entities[p.entity].list(undefined, 200);
          results[p.entity] = { clips, pipeline: p };
        } catch (err) {
          results[p.entity] = { error: err.message, pipeline: p };
        }
      }

      // Also fetch DnnArticle video readiness
      try {
        const articles = await base44.entities.DnnArticle.list(undefined, 100);
        results._articles = articles;
      } catch (err) {
        results._articles = [];
      }

      // Fetch DnnBroadcast status
      try {
        const broadcasts = await base44.entities.DnnBroadcast.list(undefined, 50);
        results._broadcasts = broadcasts;
      } catch (err) {
        results._broadcasts = [];
      }

      // Fetch HeyGen quota
      try {
        const res = await base44.functions.invoke('heygenQuota', {});
        results._quota = res.data?.data || res.data;
      } catch (err) {
        results._quota = null;
      }

      return results;
    },
    enabled: isAdmin,
    refetchInterval: 30000,
  });

  const data = pipelineQueries.data || {};
  const articles = data._articles || [];
  const broadcasts = data._broadcasts || [];
  const quota = data._quota;

  // Build pipeline stats
  const pipelineStats = PIPELINES.map(p => {
    const entry = data[p.entity];
    if (!entry || entry.error) return { ...p, error: true, total: 0, charlieDone: 0, bobDone: 0, failed: 0, notStarted: 0, combinedDone: 0 };
    const clips = entry.clips || [];
    const charlieDone = clips.filter(c => c.charlieStatus === 'completed').length;
    const bobDone = clips.filter(c => c.bobStatus === 'completed').length;
    const charlieFailed = clips.filter(c => c.charlieStatus === 'failed').length;
    const bobFailed = clips.filter(c => c.bobStatus === 'failed').length;
    const charlieNotStarted = clips.filter(c => c.charlieScript && (!c.charlieStatus || c.charlieStatus === 'not_started')).length;
    const bobNotStarted = clips.filter(c => c.bobScript && (!c.bobStatus || c.bobStatus === 'not_started')).length;
    const combinedDone = clips.filter(c => c.combinedStatus === 'completed').length;
    const combinedRendering = clips.filter(c => c.combinedStatus === 'rendering').length;
    const combinedFailed = clips.filter(c => c.combinedStatus === 'failed').length;
    const totalRenders = charlieDone + bobDone;
    const totalFailed = charlieFailed + bobFailed;
    const totalNotStarted = charlieNotStarted + bobNotStarted;
    return {
      ...p,
      total: clips.length,
      charlieDone, bobDone, totalRenders,
      charlieFailed, bobFailed, totalFailed,
      charlieNotStarted, bobNotStarted, totalNotStarted,
      combinedDone, combinedRendering, combinedFailed,
      clips,
    };
  });

  // Cost calculations
  const totalCompletedRenders = pipelineStats.reduce((s, p) => s + p.charlieDone + p.bobDone, 0);
  const totalFailedRenders = pipelineStats.reduce((s, p) => s + p.totalFailed, 0);
  const totalNotStarted = pipelineStats.reduce((s, p) => s + p.totalNotStarted, 0);
  const totalCombinedDone = pipelineStats.reduce((s, p) => s + p.combinedDone, 0);

  const creditsSpent = (totalCompletedRenders * COST_PER_RENDER) + (totalCombinedDone * COST_PER_COMBINED);
  const creditsWasted = totalFailedRenders * COST_PER_RENDER;
  const creditsNeeded = totalNotStarted * COST_PER_RENDER;

  // LinkedIn readiness
  const publishedWithVideo = articles.filter(a => a.status === 'published' && a.video_url && !a.video_url.startsWith('heygen:'));
  const stagedWithVideo = articles.filter(a => a.status === 'staged' && a.video_url && !a.video_url.startsWith('heygen:'));
  const completedBroadcasts = broadcasts.filter(b => b.status === 'completed');
  const linkedInReady = publishedWithVideo.length + stagedWithVideo.length + completedBroadcasts.length;

  // Daily/weekly/monthly projections (based on current pipeline patterns)
  const dailyArticleRenders = 3; // estimated daily article video renders
  const dailyCost = dailyArticleRenders * COST_PER_RENDER;
  const weeklyCost = dailyCost * 7;
  const monthlyCost = dailyCost * 30;

  const apiCredits = quota?.remaining_quota ?? 0;
  const planCredits = quota?.details?.plan_credit ?? 0;

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen p-6" style={{ background: '#0a0a0a' }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.15)', border: `1px solid ${GOLD}` }}>
              <BarChart3 className="w-5 h-5" style={{ color: GOLD }} />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-[0.3em] uppercase" style={{ color: GOLD }}>Production Cost Dashboard</h1>
              <p className="text-[10px] text-slate-500">HeyGen render costs, pipeline status & LinkedIn readiness</p>
            </div>
          </div>
          <button onClick={() => queryClient.invalidateQueries({ queryKey: ['productionDashboard'] })}
            className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg text-black transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37)' }}>
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <KpiCard icon={DollarSign} label="Credits Spent" value={creditsSpent.toLocaleString()} sub="on completed renders" color={GOLD} />
          <KpiCard icon={Zap} label="API Credits Left" value={apiCredits.toLocaleString()} sub={`Plan: ${planCredits.toLocaleString()}`} color={apiCredits < 200 ? '#ef4444' : '#4ade80'} />
          <KpiCard icon={AlertTriangle} label="Credits Wasted" value={creditsWasted.toLocaleString()} sub={`${totalFailedRenders} failed renders`} color="#ef4444" />
          <KpiCard icon={Linkedin} label="LinkedIn Ready" value={linkedInReady} sub="videos ready to post" color="#0a66c2" />
        </div>

        {/* Cost Projections */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400 mb-4">Cost Projections</p>
          <div className="grid grid-cols-3 gap-4">
            <ProjectionCard label="Daily" cost={dailyCost} sub={`${dailyArticleRenders} renders/day`} />
            <ProjectionCard label="Weekly" cost={weeklyCost} sub="7-day projection" />
            <ProjectionCard label="Monthly" cost={monthlyCost} sub="30-day projection" />
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Combined render strategy saves ~50% — Charlie+Bob in one API call instead of two.</span>
          </div>
        </div>

        {/* Pipeline Status Table */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400 mb-4">Pipeline Render Status</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-white/10">
                  <th className="text-left py-2 px-2 font-bold uppercase tracking-wider">Pipeline</th>
                  <th className="text-center py-2 px-2 font-bold uppercase tracking-wider">Total</th>
                  <th className="text-center py-2 px-2 font-bold uppercase tracking-wider">Done</th>
                  <th className="text-center py-2 px-2 font-bold uppercase tracking-wider">Failed</th>
                  <th className="text-center py-2 px-2 font-bold uppercase tracking-wider">Not Started</th>
                  <th className="text-center py-2 px-2 font-bold uppercase tracking-wider">Combined</th>
                  <th className="text-right py-2 px-2 font-bold uppercase tracking-wider">Credits Spent</th>
                </tr>
              </thead>
              <tbody>
                {pipelineStats.map(p => (
                  <tr key={p.entity} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-2 px-2 font-semibold text-white">{p.label}</td>
                    <td className="text-center py-2 px-2 text-slate-400">{p.total}</td>
                    <td className="text-center py-2 px-2">
                      <span className="text-green-400 font-bold">{p.charlieDone + p.bobDone}</span>
                    </td>
                    <td className="text-center py-2 px-2">
                      {p.totalFailed > 0 ? <span className="text-red-400 font-bold">{p.totalFailed}</span> : <span className="text-slate-600">0</span>}
                    </td>
                    <td className="text-center py-2 px-2">
                      {p.totalNotStarted > 0 ? <span className="text-yellow-400 font-bold">{p.totalNotStarted}</span> : <span className="text-slate-600">0</span>}
                    </td>
                    <td className="text-center py-2 px-2">
                      {p.combinedDone > 0 ? <span className="font-bold" style={{ color: GOLD }}>{p.combinedDone}</span> : <span className="text-slate-600">—</span>}
                    </td>
                    <td className="text-right py-2 px-2 font-bold" style={{ color: GOLD }}>
                      {((p.charlieDone + p.bobDone) * COST_PER_RENDER + p.combinedDone * COST_PER_COMBINED).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-white/20">
                  <td className="py-3 px-2 font-black text-white uppercase tracking-wider text-[10px]">TOTALS</td>
                  <td className="text-center py-3 px-2 font-black text-slate-400">{pipelineStats.reduce((s, p) => s + p.total, 0)}</td>
                  <td className="text-center py-3 px-2 font-black text-green-400">{totalCompletedRenders}</td>
                  <td className="text-center py-3 px-2 font-black text-red-400">{totalFailedRenders}</td>
                  <td className="text-center py-3 px-2 font-black text-yellow-400">{totalNotStarted}</td>
                  <td className="text-center py-3 px-2 font-black" style={{ color: GOLD }}>{totalCombinedDone}</td>
                  <td className="text-right py-3 px-2 font-black" style={{ color: GOLD }}>{creditsSpent.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Attention Required */}
        {(totalFailedRenders > 0 || totalNotStarted > 0) && (
          <div className="rounded-2xl p-6 mb-6" style={{ background: '#1a1a1a', border: '1px solid rgba(239,68,68,0.2)' }}>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <p className="text-[10px] font-black tracking-[0.3em] uppercase text-red-400">Attention Required</p>
            </div>
            <div className="space-y-3">
              {pipelineStats.filter(p => p.totalFailed > 0 || p.totalNotStarted > 0).map(p => (
                <div key={p.entity} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-white">{p.label}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    {p.totalFailed > 0 && (
                      <span className="flex items-center gap-1 text-red-400">
                        <XCircle className="w-3 h-3" /> {p.totalFailed} failed
                      </span>
                    )}
                    {p.totalNotStarted > 0 && (
                      <span className="flex items-center gap-1 text-yellow-400">
                        <Clock className="w-3 h-3" /> {p.totalNotStarted} not started
                      </span>
                    )}
                    {p.fn && (
                      <span className="text-slate-500 text-[10px]">fn: {p.fn}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[10px] text-slate-500">
              Failed clips need re-rendering. Not-started clips need credits or script approval. Use the Q&A Script Studio to approve scripts, then trigger renders from each pipeline's function.
            </p>
          </div>
        )}

        {/* LinkedIn Readiness */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: '#1a1a1a', border: '1px solid rgba(10,102,194,0.2)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Linkedin className="w-4 h-4" style={{ color: '#0a66c2' }} />
            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400">LinkedIn Posting Readiness</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <ReadinessCard icon={Video} label="Articles with Video" value={publishedWithVideo.length + stagedWithVideo.length} sub={`${articles.length} total articles`} />
            <ReadinessCard icon={CheckCircle2} label="Completed Broadcasts" value={completedBroadcasts.length} sub={`${broadcasts.length} total broadcasts`} />
            <ReadinessCard icon={Linkedin} label="Total Ready" value={linkedInReady} sub="ready to post now" />
          </div>
          {linkedInReady > 0 && (
            <div className="mt-4 p-3 rounded-lg flex items-center gap-2" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}>
              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
              <p className="text-xs text-green-300">
                {linkedInReady} video{linkedInReady !== 1 ? 's' : ''} ready for LinkedIn posting. Use the DNN Video Preview & Blast page to post.
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-[10px] text-slate-600 mt-6">
          Auto-refreshes every 30 seconds · Cost estimates based on ~{COST_PER_RENDER} credits per render · Verify actual costs at heygen.com/settings/billing
        </p>
      </div>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[9px] font-black tracking-[0.25em] uppercase text-slate-500">{label}</p>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <p className="text-3xl font-black" style={{ color, fontFamily: 'Cormorant Garamond, serif' }}>{value}</p>
      <p className="text-[10px] text-slate-500 mt-1">{sub}</p>
    </div>
  );
}

function ProjectionCard({ label, cost, sub }) {
  return (
    <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(212,175,55,0.06)' }}>
      <p className="text-[9px] font-black tracking-[0.25em] uppercase text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-black" style={{ color: GOLD, fontFamily: 'Cormorant Garamond, serif' }}>{cost.toLocaleString()}</p>
      <p className="text-[10px] text-slate-500 mt-1">{sub}</p>
    </div>
  );
}

function ReadinessCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(10,102,194,0.06)' }}>
      <Icon className="w-5 h-5 mx-auto mb-2" style={{ color: '#0a66c2' }} />
      <p className="text-2xl font-black text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{value}</p>
      <p className="text-[10px] font-bold text-slate-400 mt-1">{label}</p>
      <p className="text-[9px] text-slate-600">{sub}</p>
    </div>
  );
}