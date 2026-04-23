import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Newspaper, Home, DollarSign, MessageCircle } from 'lucide-react';

const GOLD = '#D4AF37';
const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";

const PILLARS = [
  {
    icon: Newspaper,
    title: 'Real Estate News',
    subtitle: '100% Free for Buyers',
    description: 'Market intelligence curated daily',
    href: '/dnn-news',
    color: '#60a5fa',
  },
  {
    icon: Home,
    title: 'Relocation Management',
    subtitle: 'Human-Managed · AI-Assisted',
    description: 'Your personal concierge',
    href: '/dashboard',
    color: GOLD,
  },
  {
    icon: DollarSign,
    title: 'Financial Services',
    subtitle: 'International · Local Expert',
    description: 'Vetted lender network',
    href: '/financial-services',
    color: '#4ade80',
  },
];

function getYouTubeId(url) {
  if (url.includes('youtu.be')) return url.split('/').pop().split('?')[0];
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
}

export default function AdminNewLandingPage() {
  const [destination, setDestination] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=ysz5S6PUM-U');
  const [videoModalOpen, setVideoModalOpen] = useState(false); // kept for compat, not used
  const [videoInput, setVideoInput] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (destination.trim()) {
      // TODO: Route to search results or relocation intake
      console.log('Search for:', destination);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#080808' }}>
      {/* Header */}
      <div
        className="px-6 py-8 text-center border-b"
        style={{
          borderColor: 'rgba(212,175,55,0.15)',
          background: 'linear-gradient(180deg, #0d0d0d, #080808)',
        }}
      >
        <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-10 w-auto mx-auto mb-4" />
        <h1 className="display-heading text-4xl font-black tracking-[0.3em] uppercase text-white mb-2">
          Concierge
        </h1>
        <p className="text-sm tracking-[0.15em] font-bold uppercase mb-1" style={{ color: GOLD }}>
          Real Estate News and Management
        </p>
        <p className="text-sm text-white max-w-2xl mx-auto leading-relaxed italic">
          At Dyson & Dyson Companies: We don't sell real estate. We manage your entire move.
        </p>
      </div>

      {/* Search Hero */}
      <div className="px-6 py-12 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm uppercase tracking-[0.15em] font-bold text-white mb-4">
            Where does your lifestyle take you next?
          </p>
          <form onSubmit={handleSearch}>
            <div
              className="flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all"
              style={{
                borderColor: searchFocused ? GOLD : 'rgba(212,175,55,0.25)',
                background: searchFocused ? 'rgba(212,175,55,0.08)' : '#808080',
              }}
            >
              <Search className="w-4 h-4" style={{ color: GOLD }} />
              <input
                type="text"
                placeholder="Where are you moving? Schools, jobs, budget, timeline..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="flex-1 bg-transparent text-white placeholder-white focus:outline-none text-sm"
              />
              <button
                type="submit"
                className="px-4 py-1.5 rounded-full text-xs font-bold text-black transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37)' }}
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Pillars */}
      <div className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              const isNewsCard = pillar.title === 'Real Estate News';
              return (
                <div
                   key={pillar.title}
                   className="group rounded-2xl p-6 transition-all hover:shadow-lg"
                   style={{
                     background: '#808080',
                     border: `1px solid rgba(212,175,55,0.15)`,
                   }}
                 >
                  <div className="flex flex-col h-full overflow-visible">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-all"
                      style={{
                        background: `${pillar.color}18`,
                        border: `1px solid ${pillar.color}30`,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: pillar.color }} />
                    </div>
                    <h3 className="serif-heading text-lg font-bold text-white mb-1">
                       {pillar.title}
                     </h3>
                     <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: pillar.color }}>
                       {pillar.subtitle}
                     </p>
                     <p className="text-sm text-white flex-1 mb-4">{pillar.description}</p>

                     {isNewsCard && (
                       <div className="mb-4 space-y-2">
                         <label className="text-xs font-bold" style={{ color: pillar.color }}>Test Video URL:</label>
                         <div className="flex gap-1">
                           <input
                             type="text"
                             placeholder="Paste YouTube / Loom / Vimeo URL..."
                             value={videoInput}
                             onChange={(e) => setVideoInput(e.target.value)}
                             className="flex-1 px-2 py-1.5 rounded text-xs text-white bg-white/10 border border-white/20 focus:outline-none"
                           />
                           <button
                             onClick={() => { if (videoInput.trim()) { setVideoUrl(videoInput.trim()); setVideoInput(''); } }}
                             className="px-3 py-1.5 rounded text-xs font-bold text-black shrink-0"
                             style={{ background: pillar.color }}
                           >
                             Load
                           </button>
                         </div>
                         {videoUrl && (() => {
                           const isYT = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
                           const ytId = isYT ? getYouTubeId(videoUrl) : null;
                           return (
                             <a
                               href={videoUrl}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="w-full aspect-video rounded-lg overflow-hidden border border-white/20 hover:opacity-90 transition-opacity relative block"
                             >
                               {ytId ? (
                                 <img src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} alt="video thumbnail" className="w-full h-full object-cover" />
                               ) : (
                                 <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-black min-h-[80px]" />
                               )}
                               <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                 <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.9)' }}>
                                   <span className="text-black text-sm ml-0.5">▶</span>
                                 </div>
                               </div>
                             </a>
                           );
                         })()}
                       </div>
                     )}

                    <Link to={pillar.href} className="flex items-center gap-1 text-xs font-bold" style={{ color: pillar.color }}>
                      Explore <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>



      {/* Charlie CTA */}
      <div
        className="mx-6 mb-12 rounded-2xl p-6 border"
        style={{
          background: 'rgba(99,102,241,0.08)',
          borderColor: 'rgba(99,102,241,0.2)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-white font-bold mb-1">Questions about relocation?</p>
            <p className="text-sm text-white">
              Chat with Charlie, our AI concierge—available 24/7 to guide your entire move.
            </p>
          </div>
          <Link
            to="/chat"
            className="ml-4 px-4 py-2 rounded-lg text-sm font-bold text-white transition-all hover:opacity-90 flex items-center gap-2 whitespace-nowrap"
            style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' }}
          >
            <MessageCircle className="w-4 h-4" />
            Chat Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div
        className="text-center py-6 border-t"
        style={{ borderColor: 'rgba(212,175,55,0.1)' }}
      >
        <p className="text-xs text-slate-400">
          Dyson & Dyson Real Estate Concierge · CA DRE #02303118
        </p>
      </div>
    </div>
  );
}