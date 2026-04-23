import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Maximize2, X, ExternalLink, Radio, Home, Landmark } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';
const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";

function getYouTubeId(url) {
  if (!url) return null;
  if (url.includes('youtu.be')) return url.split('/').pop().split('?')[0];
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
}

function FullscreenModal({ videoUrl, onClose }) {
  const ytId = getYouTubeId(videoUrl);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.97)' }} onClick={onClose}>
      <button onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center z-10"
        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
        <X className="w-5 h-5 text-white" />
      </button>
      <div className="w-full max-w-5xl px-4" onClick={e => e.stopPropagation()}>
        <div className="w-full aspect-video rounded-xl overflow-hidden">
          {ytId ? (
            <iframe width="100%" height="100%"
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
              frameBorder="0" allowFullScreen allow="autoplay"
              className="w-full h-full" />
          ) : (
            <video controls autoPlay className="w-full h-full bg-black">
              <source src={videoUrl} type="video/mp4" />
            </video>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminNewLandingPage() {
  const [fullscreen, setFullscreen] = useState(false);

  const { data: published = [] } = useQuery({
    queryKey: ['landingDnnPublished'],
    queryFn: () => base44.entities.DnnArticle.filter({ status: 'published' }, '-generated_date', 1),
  });
  const { data: blasted = [] } = useQuery({
    queryKey: ['landingDnnBlasted'],
    queryFn: () => base44.entities.DnnArticle.filter({ status: 'blasted' }, '-generated_date', 1),
  });

  const article = [...published, ...blasted].sort(
    (a, b) => new Date(b.generated_date || b.created_date) - new Date(a.generated_date || a.created_date)
  )[0] || null;

  const ytId = article?.video_url ? getYouTubeId(article.video_url) : null;
  const firstPara = article?.body?.split('\n').find(p => p.trim()) || '';
  const teaser = firstPara.length > 160 ? firstPara.slice(0, 160) + '...' : firstPara;

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>

      {fullscreen && article?.video_url && (
        <FullscreenModal videoUrl={article.video_url} onClose={() => setFullscreen(false)} />
      )}

      {/* ── HEADER ── */}
      <div className="px-6 pt-10 pb-8 text-center border-b"
        style={{ borderColor: 'rgba(212,175,55,0.12)', background: 'linear-gradient(180deg, #111 0%, #0a0a0a 100%)' }}>
        <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-12 w-auto mx-auto mb-4" />
        <p className="text-[10px] font-black tracking-[0.4em] uppercase mb-1" style={{ color: GOLD }}>
          The Dyson & Dyson Companies, Inc.
        </p>
        <h1 className="display-heading text-5xl font-black tracking-[0.25em] uppercase text-white mb-3">
          D&D Network
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
          Real estate intelligence, relocation management, and financial services —
          broadcast to consumers, agents, and lenders nationwide.
        </p>
      </div>

      {/* ── HERO VIDEO (DNN) ── */}
      <div className="px-6 pt-10 pb-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: GOLD }} />
          <p className="text-[10px] font-black tracking-[0.3em] uppercase" style={{ color: GOLD }}>DNN · Live Broadcast</p>
          <div className="h-px flex-1" style={{ background: 'rgba(212,175,55,0.12)' }} />
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(212,175,55,0.18)' }}>
          {/* Video */}
          <div className="relative w-full aspect-video bg-black group">
            {article?.video_url ? (
              ytId ? (
                <iframe width="100%" height="100%"
                  src={`https://www.youtube.com/embed/${ytId}`}
                  frameBorder="0" allowFullScreen className="w-full h-full" />
              ) : (
                <video controls className="w-full h-full bg-black">
                  <source src={article.video_url} type="video/mp4" />
                </video>
              )
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #111, #0d0d0d)' }}>
                <Radio className="w-10 h-10 mb-3 opacity-20 text-white" />
                <p className="text-xs font-black tracking-widest uppercase text-slate-600">Broadcast Standby</p>
              </div>
            )}
            {article?.video_url && (
              <button onClick={() => setFullscreen(true)}
                className="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <Maximize2 className="w-3.5 h-3.5 text-white" />
              </button>
            )}
          </div>

          {/* Article bar */}
          <div className="px-5 py-4" style={{ background: '#111' }}>
            {article ? (
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-base leading-snug mb-1">{article.headline}</p>
                  {teaser && <p className="text-sm text-slate-500 leading-relaxed">{teaser}</p>}
                </div>
                <Link to="/dnn-news"
                  className="flex items-center gap-1.5 text-xs font-bold shrink-0 mt-0.5"
                  style={{ color: GOLD }}>
                  Full Feed <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <p className="text-slate-600 text-sm">Today's brief is being prepared by the DNN Intelligence Bureau.</p>
            )}
          </div>
        </div>
      </div>

      {/* ── THREE CHANNELS ── */}
      <div className="px-6 pb-10 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <p className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-600">Our Companies</p>
          <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* DNN */}
          <Link to="/dnn-news" className="group block rounded-xl p-5 transition-all hover:border-opacity-60"
            style={{ background: '#111', border: '1px solid rgba(96,165,250,0.2)' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.25)' }}>
                <Radio className="w-4 h-4" style={{ color: '#60a5fa' }} />
              </div>
              <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: '#60a5fa' }}>DNN</span>
            </div>
            <p className="text-white font-bold mb-1">Real Estate News</p>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Daily market intelligence broadcast to consumers, agents & lenders nationwide.
            </p>
            <span className="flex items-center gap-1 text-xs font-bold" style={{ color: '#60a5fa' }}>
              Watch Now <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          {/* Dyson Relo */}
          <Link to="/dashboard" className="group block rounded-xl p-5 transition-all hover:border-opacity-60"
            style={{ background: '#111', border: `1px solid rgba(212,175,55,0.2)` }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(212,175,55,0.12)', border: `1px solid rgba(212,175,55,0.25)` }}>
                <Home className="w-4 h-4" style={{ color: GOLD }} />
              </div>
              <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: GOLD }}>Dyson Relo</span>
            </div>
            <p className="text-white font-bold mb-1">Relocation Management</p>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Human-managed, AI-assisted concierge service for your entire move — start to finish.
            </p>
            <span className="flex items-center gap-1 text-xs font-bold" style={{ color: GOLD }}>
              Get Started <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          {/* Torrey Pines Escrow */}
          <Link to="/financial-services" className="group block rounded-xl p-5 transition-all hover:border-opacity-60"
            style={{ background: '#111', border: '1px solid rgba(74,222,128,0.2)' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.25)' }}>
                <Landmark className="w-4 h-4" style={{ color: '#4ade80' }} />
              </div>
              <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: '#4ade80' }}>Torrey Pines Escrow</span>
            </div>
            <p className="text-white font-bold mb-1">Financial Services</p>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Vetted lender network and escrow services — DRE-compliant, white-labeled for your market.
            </p>
            <span className="flex items-center gap-1 text-xs font-bold" style={{ color: '#4ade80' }}>
              Learn More <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

        </div>
      </div>

      {/* ── AGENT / LENDER CTA ── */}
      <div className="px-6 pb-12 max-w-4xl mx-auto">
        <div className="rounded-xl px-6 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          style={{ background: '#111', border: '1px solid rgba(212,175,55,0.15)' }}>
          <div>
            <p className="text-[10px] font-black tracking-[0.25em] uppercase mb-1" style={{ color: GOLD }}>
              Agents & Lenders
            </p>
            <p className="text-white font-bold mb-0.5">Partner with the D&D Media Network</p>
            <p className="text-xs text-slate-500">
              Media placement, co-branded content & client list management — outside SD North County.
            </p>
          </div>
          <Link to="/admin/dnn/agent-bureau"
            className="px-5 py-2.5 rounded-lg text-sm font-bold text-black shrink-0 transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37)' }}>
            Partner With Us
          </Link>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="text-center py-6 border-t" style={{ borderColor: 'rgba(212,175,55,0.08)' }}>
        <p className="text-[11px] text-slate-700">
          The Dyson & Dyson Companies, Inc. · DNN · Dyson Relo · Torrey Pines Escrow · Wisdom Properties
        </p>
        <p className="text-[10px] text-slate-800 mt-1">CA DRE #02303118</p>
      </div>

    </div>
  );
}