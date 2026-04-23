import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Home, DollarSign, MessageCircle, Maximize2, X, ExternalLink } from 'lucide-react';
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

// --- Fullscreen Video Modal ---
function FullscreenModal({ videoUrl, onClose }) {
  const ytId = getYouTubeId(videoUrl);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.95)' }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center z-10"
        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
      >
        <X className="w-5 h-5 text-white" />
      </button>
      <div className="w-full max-w-5xl px-4" onClick={e => e.stopPropagation()}>
        <div className="w-full aspect-video rounded-xl overflow-hidden">
          {ytId ? (
            <iframe
              width="100%" height="100%"
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
              frameBorder="0" allowFullScreen allow="autoplay"
              className="w-full h-full"
            />
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

// --- News TV Card (live video face) ---
function NewsTVCard({ article }) {
  const [fullscreen, setFullscreen] = useState(false);
  const ytId = article?.video_url ? getYouTubeId(article.video_url) : null;
  const color = '#60a5fa';

  return (
    <>
      {fullscreen && article?.video_url && (
        <FullscreenModal videoUrl={article.video_url} onClose={() => setFullscreen(false)} />
      )}

      <div
        className="rounded-2xl overflow-hidden flex flex-col"
        style={{ background: '#0d0d0d', border: `1px solid ${color}25` }}
      >
        {/* 16:9 video face */}
        <div className="relative w-full aspect-video bg-black group">
          {article?.video_url ? (
            ytId ? (
              <iframe
                width="100%" height="100%"
                src={`https://www.youtube.com/embed/${ytId}`}
                frameBorder="0" allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <video controls className="w-full h-full bg-black">
                <source src={article.video_url} type="video/mp4" />
              </video>
            )
          ) : (
            /* No video — show branded placeholder */
            <div className="w-full h-full flex flex-col items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #0a0a0a, #111)' }}>
              <span className="text-4xl mb-2">📡</span>
              <p className="text-xs font-black tracking-widest uppercase" style={{ color }}>Live Feed Loading</p>
            </div>
          )}

          {/* Fullscreen button overlay */}
          {article?.video_url && (
            <button
              onClick={() => setFullscreen(true)}
              className="absolute top-2 right-2 w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <Maximize2 className="w-3.5 h-3.5 text-white" />
            </button>
          )}

          {/* LIVE badge */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-full"
            style={{ background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(96,165,250,0.3)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: color }} />
            <span className="text-[10px] font-black tracking-widest uppercase" style={{ color }}>DNN Live</span>
          </div>
        </div>

        {/* Card info bar */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="min-w-0 flex-1 mr-3">
            <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color }}>Real Estate News</p>
            <p className="text-white text-sm font-semibold leading-snug truncate">
              {article?.headline || 'Daily Intelligence Brief'}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {article?.video_url && (
              <button onClick={() => setFullscreen(true)}
                className="px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1"
                style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
                <Maximize2 className="w-3 h-3" /> Expand
              </button>
            )}
            <Link to="/dnn-news"
              className="px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1"
              style={{ background: 'rgba(255,255,255,0.06)', color: '#ccc', border: '1px solid rgba(255,255,255,0.1)' }}>
              <ExternalLink className="w-3 h-3" /> Full Feed
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

// --- Static TV Card (Relo / Finance) ---
function StaticTVCard({ icon: Icon, title, subtitle, description, href, color, bg }) {
  return (
    <Link to={href} className="block group">
      <div
        className="rounded-2xl overflow-hidden flex flex-col transition-all group-hover:scale-[1.01]"
        style={{ background: '#0d0d0d', border: `1px solid ${color}25` }}
      >
        {/* 16:9 face — branded graphic */}
        <div className="relative w-full aspect-video flex flex-col items-center justify-center"
          style={{ background: bg || 'linear-gradient(135deg, #0a0a0a, #111)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3"
            style={{ background: `${color}18`, border: `1px solid ${color}35` }}>
            <Icon className="w-8 h-8" style={{ color }} />
          </div>
          <p className="text-white font-black text-lg tracking-wide text-center px-4">{title}</p>
          <p className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color }}>{subtitle}</p>

          {/* Subtle corner glow */}
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10 blur-3xl"
            style={{ background: color, transform: 'translate(-40%, 40%)' }} />
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 blur-3xl"
            style={{ background: color, transform: 'translate(40%, -40%)' }} />
        </div>

        {/* Info bar */}
        <div className="px-4 py-3 flex items-center justify-between">
          <p className="text-slate-400 text-sm">{description}</p>
          <span className="flex items-center gap-1 text-xs font-bold" style={{ color }}>
            Explore <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// --- Main Page ---
export default function AdminNewLandingPage() {
  const [destination, setDestination] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

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

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen" style={{ background: '#080808' }}>
      {/* Header */}
      <div className="px-6 py-8 text-center border-b"
        style={{ borderColor: 'rgba(212,175,55,0.15)', background: 'linear-gradient(180deg, #0d0d0d, #080808)' }}>
        <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-10 w-auto mx-auto mb-4" />
        <h1 className="display-heading text-4xl font-black tracking-[0.3em] uppercase text-white mb-2">Concierge</h1>
        <p className="text-sm tracking-[0.15em] font-bold uppercase mb-1" style={{ color: GOLD }}>
          Real Estate News and Management
        </p>
        <p className="text-sm text-white max-w-2xl mx-auto leading-relaxed italic">
          At Dyson & Dyson Companies: We don't sell real estate. We manage your entire move.
        </p>
      </div>

      {/* Search */}
      <div className="px-6 py-10 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm uppercase tracking-[0.15em] font-bold text-white mb-4">
            Where does your lifestyle take you next?
          </p>
          <form onSubmit={handleSearch}>
            <div className="flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all"
              style={{
                borderColor: searchFocused ? GOLD : 'rgba(212,175,55,0.25)',
                background: searchFocused ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.04)',
              }}>
              <Search className="w-4 h-4" style={{ color: GOLD }} />
              <input
                type="text"
                placeholder="Where are you moving? Schools, jobs, budget, timeline..."
                value={destination}
                onChange={e => setDestination(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm"
              />
              <button type="submit"
                className="px-4 py-1.5 rounded-full text-xs font-bold text-black"
                style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37)' }}>
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Three TV Cards */}
      <div className="px-6 pb-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* News — live video face */}
          <NewsTVCard article={article} />

          {/* Relocation Management */}
          <StaticTVCard
            icon={Home}
            title="Relocation Management"
            subtitle="Human-Managed · AI-Assisted"
            description="Your personal concierge"
            href="/dashboard"
            color={GOLD}
            bg="linear-gradient(135deg, #0d0b00, #1a1400)"
          />

          {/* Financial Services */}
          <StaticTVCard
            icon={DollarSign}
            title="Financial Services"
            subtitle="International · Local Expert"
            description="Vetted lender network"
            href="/financial-services"
            color="#4ade80"
            bg="linear-gradient(135deg, #000d04, #001a08)"
          />
        </div>
      </div>

      {/* Charlie CTA */}
      <div className="mx-6 mb-12 rounded-2xl p-6 border"
        style={{ background: 'rgba(99,102,241,0.08)', borderColor: 'rgba(99,102,241,0.2)' }}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-white font-bold mb-1">Questions about relocation?</p>
            <p className="text-sm text-slate-400">Chat with Charlie, our AI concierge — available 24/7 to guide your entire move.</p>
          </div>
          <Link to="/chat"
            className="ml-4 px-4 py-2 rounded-lg text-sm font-bold text-white flex items-center gap-2 whitespace-nowrap"
            style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' }}>
            <MessageCircle className="w-4 h-4" /> Chat Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 border-t" style={{ borderColor: 'rgba(212,175,55,0.1)' }}>
        <p className="text-xs text-slate-600">Dyson & Dyson Real Estate Concierge · CA DRE #02303118</p>
      </div>
    </div>
  );
}