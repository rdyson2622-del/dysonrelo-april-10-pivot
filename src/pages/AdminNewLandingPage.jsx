import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X, Play, Search } from 'lucide-react';
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

// Sample front-line report cards (will be augmented by real articles)
const SAMPLE_REPORTS = [
  {
    id: 'sample-1',
    tag: 'RELOCATION',
    tagColor: '#D4AF37',
    headline: 'The 48-Hour Relocation',
    summary: 'How we moved a family of 5 when the movers bailed — zero downtime, new school enrolled by day three.',
    link: '/dnn-news',
  },
  {
    id: 'sample-2',
    tag: 'EQUITY',
    tagColor: '#60a5fa',
    headline: 'Equity Unlocked in 11 Days',
    summary: 'Client was stuck with $340K in equity and couldn\'t qualify for a bridge loan. We solved it.',
    link: '/financial-services',
  },
  {
    id: 'sample-3',
    tag: 'AGENT MATCH',
    tagColor: '#4ade80',
    headline: 'The Remote Buyer Close',
    summary: 'Executive relocating from NYC closed on a San Diego home without ever stepping foot in California.',
    link: '/find-agent',
  },
];

export default function AdminNewLandingPage() {
  const [fullscreen, setFullscreen] = useState(false);
  const [situation, setSituation] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { data: published = [] } = useQuery({
    queryKey: ['landingDnnPublished'],
    queryFn: () => base44.entities.DnnArticle.filter({ status: 'published' }, '-generated_date', 3),
  });
  const { data: blasted = [] } = useQuery({
    queryKey: ['landingDnnBlasted'],
    queryFn: () => base44.entities.DnnArticle.filter({ status: 'blasted' }, '-generated_date', 3),
  });

  const articles = [...published, ...blasted].sort(
    (a, b) => new Date(b.generated_date || b.created_date) - new Date(a.generated_date || a.created_date)
  ).slice(0, 3);

  const latestArticle = articles[0] || null;
  const ytId = latestArticle?.video_url ? getYouTubeId(latestArticle.video_url) : null;

  // Build report cards: use real articles if available, fallback to samples
  const reportCards = articles.length > 0
    ? articles.map(a => ({
        id: a.id,
        tag: (a.trigger_type || 'INTEL').replace(/_/g, ' ').toUpperCase(),
        tagColor: GOLD,
        headline: a.headline,
        summary: a.body?.split('\n').find(p => p.trim())?.slice(0, 120) + '...' || '',
        link: '/dnn-news',
        videoUrl: a.video_url,
      }))
    : SAMPLE_REPORTS;

  const handleSituationSubmit = (e) => {
    e.preventDefault();
    if (!situation.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>

      {fullscreen && latestArticle?.video_url && (
        <FullscreenModal videoUrl={latestArticle.video_url} onClose={() => setFullscreen(false)} />
      )}

      {/* ── BLACK HEADER (unchanged) ── */}
      <div className="px-6 pt-10 pb-8 text-center border-b"
        style={{ borderColor: 'rgba(212,175,55,0.2)', background: '#000' }}>
        <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-12 w-auto mx-auto mb-4" />
        <p className="text-[10px] font-black tracking-[0.4em] uppercase mb-1" style={{ color: GOLD }}>
          The Dyson & Dyson Companies, Inc.
        </p>

      </div>

      {/* ── SECTION 1: THE PILL (Above the Fold) ── */}
      <div className="px-6 py-16 text-center max-w-4xl mx-auto">
        {/* H.O.M.E. Badge */}

        <h2 className="display-heading text-xl md:text-2xl font-black text-white mb-4 leading-tight tracking-wide">
          Home Ownership Management Enterprise
        </h2>

        <p className="text-lg text-white mb-10 max-w-xl mx-auto leading-relaxed">
          <span className="text-white font-semibold">Real Estate Story-Solvers.</span>{' '}
          Because every move has a conflict. We provide the resolution.
        </p>

        {/* The Pill Search Bar */}
        <form className="relative max-w-2xl mx-auto mb-6">
          <div className="flex items-center rounded-2xl px-5 py-4 gap-3"
            style={{ background: '#1a1a1a', border: '2px solid rgba(212,175,55,0.4)', boxShadow: '0 0 40px rgba(212,175,55,0.08)' }}>
            <Search className="w-5 h-5 shrink-0" style={{ color: GOLD }} />
            <input
              type="text"
              placeholder="Describe your situation... (e.g., 'Relocating to Austin,' 'Equity is stuck,' 'Need a bridge loan')"
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder-white"
            />
            <button type="submit"
              className="px-5 py-2 rounded-xl text-sm font-bold text-black shrink-0 transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37)' }}>
              Solve It
            </button>
          </div>
        </form>

        {/* Secondary CTA */}
        <Link to="/dnn-news"
          className="inline-flex items-center gap-2 text-sm font-bold transition-all hover:opacity-80"
          style={{ color: GOLD }}>
          <Play className="w-4 h-4" />
          Watch Today's Story-Solve
        </Link>
      </div>

      {/* ── SECTION 2: FRONT LINE REPORTS ── */}
      <div className="px-6 pb-16 max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1" style={{ background: 'rgba(212,175,55,0.15)' }} />
          <div className="text-center">
            <p className="text-[10px] font-black tracking-[0.3em] uppercase mb-0.5" style={{ color: GOLD }}>Front Line Reports</p>
            <p className="text-white font-bold text-lg">The Latest Situations We've Resolved.</p>
          </div>
          <div className="h-px flex-1" style={{ background: 'rgba(212,175,55,0.15)' }} />
        </div>

        {/* Report Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reportCards.map((card, i) => (
            <Link key={card.id} to={card.link}
              className="group block rounded-2xl p-5 transition-all hover:border-opacity-60"
              style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)' }}>

              {/* Video thumbnail if available */}
              {card.videoUrl && (
                <div className="w-full aspect-video rounded-xl overflow-hidden mb-4 relative"
                  style={{ background: '#000' }}>
                  {getYouTubeId(card.videoUrl) ? (
                    <img
                      src={`https://img.youtube.com/vi/${getYouTubeId(card.videoUrl)}/mqdefault.jpg`}
                      alt={card.headline}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  ) : null}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(212,175,55,0.9)' }}>
                      <Play className="w-4 h-4 text-black ml-0.5" />
                    </div>
                  </div>
                </div>
              )}

              <span className="text-[10px] font-black tracking-widest px-2 py-0.5 rounded-full"
                style={{ background: `${card.tagColor}18`, color: card.tagColor, border: `1px solid ${card.tagColor}30` }}>
                {card.tag}
              </span>

              <p className="text-white font-bold text-sm mt-3 mb-2 leading-snug group-hover:text-yellow-300 transition-colors">
                {card.headline}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">{card.summary}</p>

              <span className="flex items-center gap-1 mt-4 text-xs font-bold" style={{ color: GOLD }}>
                Read Full Report <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── SECTION 3: THE SITUATION ROOM ── */}
      <div className="px-6 pb-20 max-w-2xl mx-auto">
        <div className="rounded-3xl p-8 md:p-12"
          style={{ background: '#111', border: '1px solid rgba(212,175,55,0.2)' }}>

          {/* Section Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full text-[10px] font-black tracking-[0.25em] uppercase"
              style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: GOLD }}>
              Situation Room
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Tell us your story.</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Our enterprise team reviews every situation.<br />
              <span className="text-slate-400 font-semibold">We'll give you a roadmap, not a sales pitch.</span>
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)' }}>
                <span className="text-2xl">✓</span>
              </div>
              <p className="text-white font-bold mb-1">Situation received.</p>
              <p className="text-slate-500 text-sm">Our team will reach out with your roadmap within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSituationSubmit} className="space-y-4">
              <textarea
                value={situation}
                onChange={e => setSituation(e.target.value)}
                rows={5}
                placeholder="Tell us what's going on... Are you relocating? Stuck on equity? Need a bridge loan? Vent here — we've heard it all."
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 outline-none resize-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Your name"
                  className="flex-1 px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                <input
                  type="email"
                  placeholder="Email or phone"
                  className="flex-1 px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>
              <button type="submit"
                className="w-full py-4 rounded-xl text-sm font-black tracking-[0.1em] uppercase text-black transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37)' }}>
                Submit My Situation
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="text-center py-6 border-t" style={{ borderColor: '#1a1a1a' }}>
        <p className="text-[11px] text-slate-600">
          The Dyson & Dyson Companies, Inc. · DNN · Dyson Relo · Torrey Pines Escrow · Wisdom Properties
        </p>
        <p className="text-[10px] text-slate-700 mt-1">CA DRE #02303118</p>
      </div>

    </div>
  );
}