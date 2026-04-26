import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Globe, ChevronDown, ChevronUp, Bell, Share2, BookOpen, TrendingUp, Shield, DollarSign, ChevronRight, Mail, MessageSquare, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import DnnAdminBar from '@/components/dnn/DnnAdminBar';


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

// --- Subscribe Banner ---
function SubscribeBanner() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await base44.functions.invoke('dnnSubscribe', { email, full_name: name, source: 'DNN News Page' });
    } catch (_) {}
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl p-6 text-center mb-8" style={{ background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.3)' }}>
        <p className="text-yellow-400 font-bold text-sm mb-1">✓ You're on the list</p>
        <p className="text-slate-500 text-xs">DNN Intelligence Briefs will be delivered directly to you. Welcome to the network.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-5 mb-8" style={{ background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.25)' }}>
      <div className="flex items-center gap-2 mb-2">
        <Bell className="w-4 h-4" style={{ color: '#D4AF37' }} />
        <p className="text-sm font-bold text-white">Get DNN Intelligence in Your Inbox</p>
      </div>
      <p className="text-xs text-slate-500 mb-3 leading-relaxed">
        Daily market-moving briefs curated by the DNN AI Bureau — relocation intelligence localized to your destination markets.
      </p>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        />
        <div className="flex gap-2">
          <input
            type="email"
            required
            placeholder="Your email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          <button type="submit" disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-bold text-black transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37)' }}>
            {loading ? '...' : 'Subscribe'}
          </button>
        </div>
      </form>
    </div>
  );
}

// --- Charlie Education Strip ---
function CharlieEducationStrip() {
  const pillars = [
    {
      icon: TrendingUp,
      color: '#60a5fa',
      title: 'Relocation Intelligence',
      description: 'DNN tracks migration data, job market shifts, and housing trends — so you relocate with confidence, not guesswork.',
      href: '/chat',
      cta: 'Ask Charlie',
    },
    {
      icon: Shield,
      color: '#D4AF37',
      title: 'Your Verified Agent',
      description: "Every DNN partner agent is vetted by Bob Dyson's team. DRE-verified, production-screened, and matched to your move.",
      href: '/my-agent',
      cta: 'Meet My Agent',
    },
    {
      icon: DollarSign,
      color: '#4ade80',
      title: 'Financial Network',
      description: 'DNN-approved lenders in your destination market — DRE-compliant introductions, white-labeled rate intelligence.',
      href: '/financial-services',
      cta: 'Coming Soon',
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-4 h-4" style={{ color: '#D4AF37' }} />
        <p className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: '#D4AF37' }}>The DNN Network</p>
      </div>
      <div className="space-y-3">
        {pillars.map((p) => {
          const Icon = p.icon;
          return (
            <Link key={p.title} to={p.href}
              className="flex items-start gap-4 p-4 rounded-xl transition-all hover:opacity-80"
              style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: `${p.color}18`, border: `1px solid ${p.color}30` }}>
                <Icon className="w-4 h-4" style={{ color: p.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white mb-0.5">{p.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{p.description}</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold shrink-0 mt-1" style={{ color: p.color }}>
                {p.cta} <ChevronRight className="w-3 h-3" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// --- Share Panel ---
function SharePanel({ article, onClose }) {
  const [copied, setCopied] = useState(false);

  const shareText = `📡 DNN Intelligence Bureau\n\n${article.headline}\n\n${article.body?.split('\n')[0]}\n\n— Read more at dysonanddyson.com/dnn-news\n\nFree relocation intelligence delivered daily. Subscribe: dysonanddyson.com`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`DNN Intelligence: ${article.headline}`);
    const body = encodeURIComponent(shareText);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleSMS = () => {
    const body = encodeURIComponent(`📡 DNN Intelligence: ${article.headline}\n\n${article.body?.split('\n')[0]}\n\nFull brief: dysonanddyson.com/dnn-news`);
    window.open(`sms:?body=${body}`);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `DNN Intelligence: ${article.headline}`,
        text: shareText,
        url: `${window.location.origin}/dnn-news`,
      });
    }
  };

  return (
    <div className="mt-3 rounded-xl p-4 space-y-3" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }} onClick={e => e.stopPropagation()}>
      <p className="text-xs font-black tracking-widest uppercase" style={{ color: '#D4AF37' }}>Share This Brief</p>
      <div className="rounded-lg p-3 text-xs text-slate-400 leading-relaxed" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-yellow-400 font-bold mb-1">📡 DNN Intelligence Bureau</p>
        <p className="text-white font-semibold mb-1">{article.headline}</p>
        <p className="text-slate-500 truncate">{article.body?.split('\n')[0]}</p>
        <p className="text-slate-600 mt-1 text-[10px]">— dysonanddyson.com/dnn-news</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={handleCopy} className="flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all"
          style={{ background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: copied ? '#4ade80' : '#fff' }}>
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy Text'}
        </button>
        <button onClick={handleEmail} className="flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all"
          style={{ background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.2)', color: '#60a5fa' }}>
          <Mail className="w-3.5 h-3.5" /> Email
        </button>
        <button onClick={handleSMS} className="flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all"
          style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ade80' }}>
          <MessageSquare className="w-3.5 h-3.5" /> Text
        </button>
        {navigator.share && (
          <button onClick={handleNativeShare} className="flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all"
            style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}>
            <Share2 className="w-3.5 h-3.5" /> More
          </button>
        )}
      </div>
      <button onClick={onClose} className="w-full text-center text-xs text-slate-600 hover:text-slate-400 transition-colors py-1">
        Close
      </button>
    </div>
  );
}

// --- Audio Player ---
function AudioPlayer({ url }) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-4 py-3 mt-3"
      style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}>
      <span className="text-xs font-black tracking-widest uppercase shrink-0" style={{ color: '#D4AF37' }}>🎙 Listen</span>
      <audio controls className="flex-1 h-8" style={{ accentColor: '#D4AF37' }}>
        <source src={url} type="audio/wav" />
      </audio>
    </div>
  );
}

// --- Compact Article Card (text briefs) ---
function CompactArticleCard({ article }) {
  const [showText, setShowText] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const bgColor = TRIGGER_COLORS[article.trigger_type] || TRIGGER_COLORS.general;
  const textColor = TRIGGER_TEXT[article.trigger_type] || TRIGGER_TEXT.general;
  const label = TRIGGER_LABELS[article.trigger_type] || 'GENERAL';

  return (
    <div className="rounded-xl p-4 transition-all"
      style={{ background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.2)' }}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <span className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full"
            style={{ background: bgColor, color: textColor }}>
            {label}
          </span>
          <p className="text-xs mt-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{article.dateline}</p>
        </div>
        <button onClick={(e) => { e.stopPropagation(); setShowShare(v => !v); }}
          className="shrink-0 text-xs font-semibold px-2 py-1 rounded-full transition-all"
          style={{ color: showShare ? '#D4AF37' : 'rgba(255,255,255,0.3)', background: showShare ? 'rgba(212,175,55,0.1)' : 'transparent' }}>
          <Share2 className="w-3 h-3" />
        </button>
      </div>

      <h3 className="font-bold text-sm leading-snug mb-2" style={{ color: '#fff' }}>
        {article.headline}
      </h3>

      {article.audio_url && <AudioPlayer url={article.audio_url} />}

      <button
        onClick={() => setShowText(v => !v)}
        className="flex items-center gap-1 text-xs font-bold tracking-widest uppercase mb-2 mt-2"
        style={{ color: showText ? '#D4AF37' : 'rgba(255,255,255,0.35)' }}>
        {showText ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {showText ? 'Hide' : 'Read'}
      </button>

      {showText && (
        <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          {article.body?.split('\n').filter(p => p.trim()).map((para, i) => (
            <p key={i} className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{para}</p>
          ))}
          {article.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {article.tags.map(t => (
                <span key={t} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)' }}>#{t}</span>
              ))}
            </div>
          )}
          <Link to="/chat"
            className="flex items-center gap-2 mt-2 px-4 py-2.5 rounded-xl text-xs font-bold text-black w-fit transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37)' }}>
            Ask Charlie About This <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {showShare && (
        <div className="mt-2 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <SharePanel article={article} onClose={() => setShowShare(false)} />
        </div>
      )}
    </div>
  );
}

// --- Get YouTube thumbnail ---
function getYouTubeThumbnail(url) {
  if (!url) return null;
  let id = null;
  if (url.includes('youtu.be/')) {
    id = url.split('youtu.be/')[1]?.split('?')[0];
  } else if (url.includes('youtube.com')) {
    try { id = new URL(url).searchParams.get('v'); } catch (_) {}
  }
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

// --- Get embeddable video src ---
function getEmbedSrc(url) {
  if (!url) return url;
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${id}?autoplay=1`;
  }
  if (url.includes('youtube.com/watch')) {
    try {
      const id = new URL(url).searchParams.get('v');
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    } catch (_) {}
  }
  return url;
}

// --- Video Thumbnail Card ---
function VideoThumbnail({ article, isFullscreen, onExpand, onClose }) {
  const thumbnail = getYouTubeThumbnail(article.video_url);

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
        <button onClick={onClose}
          className="absolute top-6 right-6 text-white hover:opacity-70 transition-opacity z-10"
          style={{ fontSize: '2rem' }}>✕</button>
        <div className="w-full max-w-4xl aspect-video">
          <iframe
            src={getEmbedSrc(article.video_url)}
            title={article.headline}
            className="w-full h-full rounded-xl"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full aspect-video rounded-xl overflow-hidden group cursor-pointer"
      style={{ background: '#111', border: '1px solid rgba(212,175,55,0.2)' }}
      onClick={onExpand}
    >
      {thumbnail ? (
        <img src={thumbnail} alt={article.headline} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #111 100%)' }} />
      )}
      <div className="absolute inset-0" style={{ background: thumbnail ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.55)' }} />
      <div className="absolute inset-0 flex items-center justify-center">
        {article.video_url ? (
          <div className="w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-2xl"
            style={{ background: 'rgba(212,175,55,0.92)', boxShadow: '0 0 40px rgba(212,175,55,0.3)' }}>
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#000', marginLeft: '3px' }}>
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}



// --- Main Page ---
export default function ConsumerDnnNews() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [fullscreenVideo, setFullscreenVideo] = useState(null);

  useEffect(() => {
    base44.auth.me().then(user => {
      if (user?.role === 'admin') setIsAdmin(true);
    }).catch(() => {});
  }, []);

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['dnnArticlesConsumer'],
    queryFn: () => base44.entities.DnnArticle.filter({ status: 'published' }, '-generated_date', 50),
  });

  const { data: blasted = [] } = useQuery({
    queryKey: ['dnnArticlesBlasted'],
    queryFn: () => base44.entities.DnnArticle.filter({ status: 'blasted' }, '-generated_date', 50),
  });

  const allArticles = [...articles, ...blasted].sort((a, b) =>
    new Date(b.generated_date || b.created_date) - new Date(a.generated_date || a.created_date)
  );

  const textArticles = allArticles.filter(a => !a.video_url);
  const videoArticles = allArticles.filter(a => !!a.video_url);

  return (
    <div className="min-h-screen" style={{ background: '#ede0cc' }}>

      {/* Header */}
      <div className="sticky top-0 z-20 px-8 py-4 flex items-center justify-between"
        style={{ background: '#1a1a1a', borderBottom: '1px solid rgba(212,175,55,0.15)', backdropFilter: 'blur(10px)' }}>
        <div className="flex items-center gap-4">
          <img src={DNN_LOGO} alt="DNN" className="h-10 w-auto" />
          <div>
            <p className="text-sm font-black tracking-[0.35em] uppercase" style={{ color: '#D4AF37' }}>DNN</p>
            <p className="text-xs tracking-widest uppercase" style={{ color: '#ffffff' }}>Real Estate Intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold tracking-widest" style={{ color: '#D4AF37' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#D4AF37' }} />
            LIVE FEED
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="w-full px-8 md:px-16 py-14 text-center"
        style={{ borderBottom: '1px solid rgba(212,175,55,0.12)', background: '#ede0cc' }}>
        <div className="inline-flex items-center gap-2 mb-5 px-5 py-2 rounded-full text-xs font-black tracking-[0.3em] uppercase"
          style={{ background: '#000', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' }}>
          <Globe className="w-3.5 h-3.5" /> Intelligence Bureau
        </div>
        <h1 className="display-heading mb-4"
          style={{ fontSize: 'clamp(1.7rem, 4.25vw, 3.4rem)', letterSpacing: '0.15em', color: '#1a1a1a', lineHeight: 1.05 }}>
          REAL ESTATE NEWS
        </h1>
        <p className="text-base leading-relaxed mx-auto" style={{ color: '#4a4a4a', maxWidth: '560px' }}>
          Market-moving news curated daily by DNN's AI Intelligence Bureau — localized to the markets that matter to your move.
        </p>
      </div>

      {/* Articles Feed */}
      <div className="w-full px-6 md:px-12 lg:px-20 py-10 max-w-7xl mx-auto">
        {isAdmin && window.location.pathname.includes('/admin') && <DnnAdminBar articles={allArticles} isAdmin={isAdmin} />}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1" style={{ background: 'rgba(212,175,55,0.15)' }} />
          <span className="display-heading" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', letterSpacing: '0.3em', color: '#D4AF37' }}>Today's Briefs</span>
          <div className="h-px flex-1" style={{ background: 'rgba(212,175,55,0.15)' }} />
        </div>

        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-slate-800 border-t-yellow-500 rounded-full animate-spin" />
          </div>
        )}

        {!isLoading && allArticles.length === 0 && (
          <div className="text-center py-24 space-y-4">
            <Globe className="w-12 h-12 mx-auto" style={{ color: 'rgba(212,175,55,0.3)' }} />
            <p className="display-heading text-lg" style={{ color: 'rgba(26,26,26,0.4)', letterSpacing: '0.15em' }}>BRIEF IN PREPARATION</p>
            <p className="text-sm" style={{ color: 'rgba(26,26,26,0.3)' }}>Our AI Bureau publishes daily — check back shortly.</p>
          </div>
        )}

        {!isLoading && allArticles.length > 0 && (
          <div className="flex gap-6">

            {/* Text briefs — flex-1 to fill available space */}
            <div className="flex-1 space-y-3">
              <p className="text-sm font-black tracking-[0.2em] uppercase px-3 py-2 text-center" style={{ color: '#1a1a1a' }}>News Briefs</p>
              {textArticles.length > 0 ? (
                <div className={videoArticles.length === 0 ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3' : 'space-y-3'}>
                  {textArticles.map(article => (
                    <CompactArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-center py-8" style={{ color: 'rgba(26,26,26,0.4)' }}>No text briefs today.</p>
              )}
            </div>

            {/* Video thumbnails — fixed 350px right sidebar, 10-stack vertical design */}
            <div className="hidden lg:block shrink-0 space-y-3 w-[350px]">
              <p className="text-sm font-black tracking-[0.2em] uppercase px-3 py-2 text-center" style={{ color: '#1a1a1a' }}>Featured Videos</p>
              <div className="space-y-3">
                {allArticles.slice(0, 10).map(article => (
                  <VideoThumbnail
                    key={article.id}
                    article={article}
                    isFullscreen={fullscreenVideo?.id === article.id}
                    onExpand={() => setFullscreenVideo(article)}
                    onClose={() => setFullscreenVideo(null)}
                  />
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Below the fold — subscribe + network */}
      <div className="w-full px-6 md:px-12 lg:px-20 pb-16 max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8" style={{ borderTop: '1px solid rgba(212,175,55,0.15)', paddingTop: '3rem' }}>
          <div className="h-px flex-1" style={{ background: 'rgba(212,175,55,0.15)' }} />
          <span className="text-xs font-black tracking-[0.3em] uppercase" style={{ color: '#D4AF37' }}>Stay Connected</span>
          <div className="h-px flex-1" style={{ background: 'rgba(212,175,55,0.15)' }} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SubscribeBanner />
          <CharlieEducationStrip />
        </div>

        {/* Footer */}
        <div className="mt-12 text-center pb-4" style={{ borderTop: '1px solid rgba(212,175,55,0.08)', paddingTop: '2rem' }}>
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-16" style={{ background: 'rgba(212,175,55,0.2)' }} />
            <img src={DNN_LOGO} alt="DNN" className="h-7 w-auto opacity-40" />
            <div className="h-px w-16" style={{ background: 'rgba(212,175,55,0.2)' }} />
          </div>
          <p className="text-xs tracking-widest uppercase" style={{ color: 'rgba(26,26,26,0.4)' }}>DNN Intelligence Bureau · AI-generated · For informational purposes only</p>
          <p className="text-xs mt-1" style={{ color: 'rgba(26,26,26,0.3)' }}>Dyson & Dyson Real Estate Concierge · CA DRE #02303118</p>
        </div>
      </div>

    </div>
  );
}