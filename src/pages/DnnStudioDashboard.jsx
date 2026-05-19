import React, { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { ArrowLeft, Video, Mic, FileText, RefreshCw, Play, Clock, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const DNN_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";

const STATUS_STYLE = {
  published:  { color: '#4ade80', bg: 'rgba(74,222,128,0.12)', label: 'Published' },
  blasted:    { color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', label: 'Blasted' },
  staged:     { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', label: 'Staged' },
  archived:   { color: '#6b7280', bg: 'rgba(107,114,128,0.12)', label: 'Archived' },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.staged;
  return (
    <span className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full"
      style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

function VideoAssetCard({ article }) {
  const isPending = article.video_url?.startsWith('heygen:pending:');
  const hasVideo = article.video_url && !isPending;

  return (
    <div className="rounded-xl p-4 flex gap-4 items-start"
      style={{ background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.15)' }}>
      {/* Thumbnail */}
      <div className="w-28 h-16 rounded-lg shrink-0 flex items-center justify-center overflow-hidden"
        style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}>
        {hasVideo ? (
          <a href={article.video_url} target="_blank" rel="noreferrer"
            className="w-full h-full flex items-center justify-center hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(212,175,55,0.9)' }}>
              <Play className="w-4 h-4 text-black ml-0.5" />
            </div>
          </a>
        ) : isPending ? (
          <div className="flex flex-col items-center gap-1">
            <Loader className="w-5 h-5 animate-spin" style={{ color: '#D4AF37' }} />
            <p className="text-[9px] text-slate-600">Rendering</p>
          </div>
        ) : (
          <p className="text-[9px] text-slate-700 text-center px-1">No video</p>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <StatusBadge status={article.status} />
          {isPending && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24' }}>
              ⏳ HeyGen Rendering
            </span>
          )}
          {hasVideo && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80' }}>
              ✓ Video Ready
            </span>
          )}
        </div>
        <p className="text-sm font-bold text-white leading-snug mb-1 truncate">{article.headline}</p>
        <p className="text-[10px] text-slate-500">{article.dateline}</p>
        {isPending && (
          <p className="text-[10px] mt-1 font-mono" style={{ color: '#D4AF37' }}>
            ID: {article.video_url?.replace('heygen:pending:', '')}
          </p>
        )}
      </div>
    </div>
  );
}

function AudioScriptCard({ article }) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = React.useRef(null);

  const handlePlay = async () => {
    if (playing) { audioRef.current?.pause(); setPlaying(false); return; }
    setLoading(true);
    const scriptText = `${article.headline}. ${article.body}`.slice(0, 800);
    const res = await base44.functions.invoke('charlieSpeak', { text: scriptText });
    const audioContent = res.data?.audio;
    if (audioContent) {
      const blob = new Blob([Uint8Array.from(atob(audioContent), c => c.charCodeAt(0))], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => setPlaying(false);
      audio.play();
      setPlaying(true);
    }
    setLoading(false);
  };

  return (
    <div className="rounded-xl p-4" style={{ background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.15)' }}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <StatusBadge status={article.status} />
          <p className="text-sm font-bold text-white mt-1 leading-snug">{article.headline}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {article.trigger_type?.replace(/_/g, ' ')} · {new Date(article.generated_date || article.created_date).toLocaleDateString()}
          </p>
        </div>
        <button onClick={handlePlay} disabled={loading}
          className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-50"
          style={{ background: playing ? 'rgba(212,175,55,0.3)' : 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.4)' }}>
          {loading ? <Loader className="w-4 h-4 animate-spin" style={{ color: '#D4AF37' }} />
            : playing ? <span style={{ color: '#D4AF37', fontSize: '10px', fontWeight: 900 }}>■</span>
            : <Play className="w-4 h-4 ml-0.5" style={{ color: '#D4AF37' }} />}
        </button>
      </div>
      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{article.body?.split('\n')[0]}</p>
      {article.audio_url && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[10px] font-bold" style={{ color: '#4ade80' }}>✓ Audio Cached</span>
          <audio controls className="h-6 flex-1" style={{ accentColor: '#D4AF37' }}>
            <source src={article.audio_url} />
          </audio>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="rounded-xl p-4 flex items-center gap-4"
      style={{ background: '#1a1a1a', border: `1px solid ${color}30` }}>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${color}18` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-black text-white">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}

export default function DnnStudioDashboard() {
  const { data: allArticles = [], isLoading, refetch } = useQuery({
    queryKey: ['dnnStudioAll'],
    queryFn: () => base44.entities.DnnArticle.list('-generated_date', 100),
    refetchInterval: 30000,
  });

  const published = allArticles.filter(a => a.status === 'published' || a.status === 'blasted');
  const staged = allArticles.filter(a => a.status === 'staged');
  const withVideo = allArticles.filter(a => a.video_url && !a.video_url.startsWith('heygen:pending:'));
  const pending = allArticles.filter(a => a.video_url?.startsWith('heygen:pending:'));
  const withAudio = allArticles.filter(a => a.audio_url);

  return (
    <div className="min-h-screen" style={{ background: '#0d0d0d' }}>
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(13,13,13,0.95)', borderBottom: '1px solid rgba(212,175,55,0.15)', backdropFilter: 'blur(10px)' }}>
        <div className="flex items-center gap-4">
          <Link to="/admin">
            <button className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:opacity-70"
              style={{ background: 'rgba(255,255,255,0.07)' }}>
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>
          </Link>
          <img src={DNN_LOGO} alt="DNN" className="h-8 w-auto" />
          <div>
            <p className="text-sm font-black tracking-[0.3em] uppercase" style={{ color: '#D4AF37' }}>Studio Dashboard</p>
            <p className="text-[10px] tracking-widest uppercase text-slate-600">Production · Audio · Video</p>
          </div>
        </div>
        <button onClick={() => refetch()}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-80"
          style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)', color: '#D4AF37' }}>
          <RefreshCw className="w-3 h-3" /> Refresh
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={FileText} label="Total Articles" value={allArticles.length} color="#D4AF37" />
          <StatCard icon={CheckCircle} label="Published / Blasted" value={published.length} color="#4ade80" />
          <StatCard icon={Video} label="Videos Ready" value={withVideo.length} color="#60a5fa" />
          <StatCard icon={Mic} label="Audio Cached" value={withAudio.length} color="#c084fc" />
        </div>

        {/* Pending renders alert */}
        {pending.length > 0 && (
          <div className="rounded-xl px-5 py-4 flex items-center gap-3"
            style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.3)' }}>
            <Loader className="w-5 h-5 animate-spin shrink-0" style={{ color: '#fbbf24' }} />
            <div>
              <p className="text-sm font-bold" style={{ color: '#fbbf24' }}>{pending.length} HeyGen render{pending.length > 1 ? 's' : ''} in progress</p>
              <p className="text-xs text-slate-500">Dashboard auto-refreshes every 30s. Run <code className="text-yellow-600">heygenCheckVideo</code> to poll manually.</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Video Assets */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Video className="w-4 h-4" style={{ color: '#60a5fa' }} />
              <p className="text-sm font-black tracking-[0.2em] uppercase text-white">Video Assets</p>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold ml-auto"
                style={{ background: 'rgba(96,165,250,0.12)', color: '#60a5fa' }}>
                {withVideo.length + pending.length} total
              </span>
            </div>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader className="w-6 h-6 animate-spin" style={{ color: '#D4AF37' }} />
              </div>
            ) : (
              <div className="space-y-3">
                {[...pending, ...withVideo].length > 0
                  ? [...pending, ...withVideo].slice(0, 10).map(a => <VideoAssetCard key={a.id} article={a} />)
                  : (
                    <div className="rounded-xl p-8 text-center" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <Video className="w-8 h-8 mx-auto mb-3 opacity-20 text-white" />
                      <p className="text-sm text-slate-600">No video assets yet.</p>
                      <p className="text-xs text-slate-700 mt-1">Run <code>heygenRenderVideo</code> with an article ID + HeyGen avatar ID to generate the first video.</p>
                    </div>
                  )}
              </div>
            )}
          </div>

          {/* Audio / Script Status */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Mic className="w-4 h-4" style={{ color: '#c084fc' }} />
              <p className="text-sm font-black tracking-[0.2em] uppercase text-white">Scripts & Audio</p>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold ml-auto"
                style={{ background: 'rgba(192,132,252,0.12)', color: '#c084fc' }}>
                {allArticles.length} scripts
              </span>
            </div>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader className="w-6 h-6 animate-spin" style={{ color: '#D4AF37' }} />
              </div>
            ) : (
              <div className="space-y-3">
                {allArticles.slice(0, 10).map(a => <AudioScriptCard key={a.id} article={a} />)}
                {allArticles.length === 0 && (
                  <div className="rounded-xl p-8 text-center" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <FileText className="w-8 h-8 mx-auto mb-3 opacity-20 text-white" />
                    <p className="text-sm text-slate-600">No articles found.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Staged Queue */}
        {staged.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4" style={{ color: '#fbbf24' }} />
              <p className="text-sm font-black tracking-[0.2em] uppercase text-white">Staged Queue</p>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold ml-auto"
                style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24' }}>
                {staged.length} pending publish
              </span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {staged.map(a => (
                <div key={a.id} className="rounded-xl p-4" style={{ background: '#1a1a1a', border: '1px solid rgba(251,191,36,0.15)' }}>
                  <StatusBadge status="staged" />
                  <p className="text-sm font-bold text-white mt-2 leading-snug">{a.headline}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{a.trigger_type?.replace(/_/g, ' ')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pipeline Status */}
        <div className="rounded-xl p-6" style={{ background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.15)' }}>
          <p className="text-sm font-black tracking-[0.2em] uppercase mb-4" style={{ color: '#D4AF37' }}>Pipeline Status</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { step: '1. Charon Audio', fn: 'charlieSpeak', status: 'live', color: '#4ade80' },
              { step: '2. HeyGen Render', fn: 'heygenRenderVideo', status: 'pending key', color: '#fbbf24' },
              { step: '3. Video Playback', fn: 'DNN News Feed', status: 'live', color: '#4ade80' },
            ].map(p => (
              <div key={p.step} className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${p.color}25` }}>
                <p className="text-[10px] font-black tracking-widest uppercase mb-1" style={{ color: p.color }}>
                  {p.status === 'live' ? '✓ LIVE' : '⚠ PENDING KEY'}
                </p>
                <p className="text-sm font-bold text-white">{p.step}</p>
                <p className="text-[10px] text-slate-600 mt-0.5 font-mono">{p.fn}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}