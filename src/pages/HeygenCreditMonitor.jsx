import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { RefreshCw, Zap, TrendingDown, AlertTriangle } from 'lucide-react';

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

  const rendering = articles.filter(a => a.video_url && a.video_url.startsWith('heygen:pending:'));
  const completed = articles.filter(a => a.video_url && !a.video_url.startsWith('heygen:pending:'));

  const apiBalance = quota?.remaining_quota ?? 0;
  const planCredits = quota?.details?.plan_credit ?? 0;

  // HeyGen API bills per second of video (USD). Charlie uses a Photo Avatar (Avatar IV) at 720p = $0.05/sec.
  // A typical 60s news brief = $3.00, 90s = $4.50.
  const costPerSecond = 0.05;
  const avgVideoSeconds = 60;
  const costPerVideo = costPerSecond * avgVideoSeconds;
  const estimatedRenders = Math.floor(apiBalance / costPerVideo);
  const costInProgress = rendering.length * costPerVideo;

  const lowThreshold = 50;
  const isLow = apiBalance < lowThreshold;

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen p-6" style={{ background: '#0a0a0a' }}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <img src={DNN_LOGO} alt="DNN" className="h-8 w-auto" />
          <div>
            <h1 className="text-sm font-black tracking-[0.3em] uppercase" style={{ color: GOLD }}>HeyGen Credit Monitor</h1>
            <p className="text-[10px] text-slate-500">Live API credit balance — auto-refreshes every 15s</p>
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
              <p className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400 mb-2">API Balance Remaining</p>
              <div className="flex items-baseline gap-2">
                {isLoading ? (
                  <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: `${GOLD}30`, borderTopColor: GOLD }} />
                ) : (
                  <>
                    <span className="text-2xl font-bold" style={{ color: isLow ? '#ef4444' : GOLD }}>$</span>
                    <p className="text-6xl font-black" style={{ color: isLow ? '#ef4444' : GOLD, fontFamily: 'Cormorant Garamond, serif' }}>
                      {apiBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </>
                )}
                <div className="flex flex-col ml-2">
                  <Zap className="w-5 h-5 mb-1" style={{ color: isLow ? '#ef4444' : GOLD }} fill={isLow ? '#ef4444' : GOLD} />
                </div>
              </div>
              <div className="mt-3 flex gap-4 text-xs">
                <span className="text-slate-400">Plan Credits: <strong className="text-white">{planCredits.toLocaleString()}</strong></span>
              </div>
            </div>

            <button onClick={() => queryClient.invalidateQueries({ queryKey: ['heygenQuota'] })}
              className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg text-black transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37)' }}>
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Now
            </button>
          </div>

          {/* Low balance warning */}
          {isLow && !isLoading && (
            <div className="relative mt-4 flex items-center gap-2 p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-xs text-red-300">Balance is low! Each video costs ${costPerVideo.toFixed(2)} (${costPerSecond.toFixed(2)}/sec at Photo Avatar rate). Top up at <strong>heygen.com/settings/billing</strong> before continuing renders.</p>
            </div>
          )}

          {/* Estimate */}
          {!isLoading && apiBalance > 0 && (
            <div className="relative mt-4 flex items-center gap-2 text-xs text-slate-400">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>~{estimatedRenders} video renders remaining (at ${costPerVideo.toFixed(2)}/video — ${costPerSecond.toFixed(2)}/sec, avg {avgVideoSeconds}s)</span>
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
              <p className="text-3xl font-black" style={{ color: GOLD, fontFamily: 'Cormorant Garamond, serif' }}>${costInProgress.toFixed(2)}</p>
              <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mt-1">Cost In Use</p>
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

        {/* Auto-refresh note */}
        <p className="text-center text-[10px] text-slate-600">
          Page auto-refreshes every 15 seconds. Keep this tab open to watch credits in real-time.
        </p>
      </div>
    </div>
  );
}