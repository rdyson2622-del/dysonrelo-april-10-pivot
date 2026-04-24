import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ClientSidebar from '@/components/layout/ClientSidebar';

const GOLD = '#D4AF37';
const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";

const QUICK_STARTS = [
  { label: "I'm moving and need a plan.", desc: "Relo Prong", link: "/relocation-intake" },
  { label: "I'm stuck in a deal.", desc: "Story-Solving / Escrow", link: "/chat" },
  { label: "I'm an Agent or Lender.", desc: "Enterprise Portal", link: "/find-agent" },
];

export default function AdminNewLandingPage() {
  const [pillFocused, setPillFocused] = useState(false);
  const [situation, setSituation] = useState('');
  const [story, setStory] = useState('');
  const [storySubmitted, setStorySubmitted] = useState(false);

  // Fetch latest DNN article for bottom corner card
  const { data: articles = [] } = useQuery({
    queryKey: ['landingDnnBrief'],
    queryFn: () => base44.entities.DnnArticle.filter(
      { status: 'published' }, '-generated_date', 1
    ),
  });
  const brief = articles[0] || null;
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="flex min-h-screen flex-col" style={{ background: '#0a0a0a' }}>
      {/* Main Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden" style={{ background: 'transparent' }}>

        {/* ── DARK TOP SECTION: Logo + Title ── */}
        <div className="flex flex-col items-center justify-center px-8 pt-16 pb-12 text-center"
          style={{ background: '#0a0a0a' }}>

          {/* Logo */}
          <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-14 w-auto mb-6" />

          {/* H.O.M.E. Title */}
          <div className="mb-1" style={{
            color: GOLD,
            fontSize: '4rem',
            fontFamily: 'Cormorant Garamond, serif',
            fontWeight: 600,
            letterSpacing: '0.15em',
            lineHeight: 1
          }}>
            HOME
          </div>
          <p className="text-xs font-black tracking-[0.25em] uppercase text-white mb-0">
            Home Ownership Management Ecosystem
          </p>
        </div>

        {/* ── WHITE BOTTOM SECTION: Pill + Story ── */}
        <div className="flex flex-col items-center px-8 py-14 text-center" style={{ background: '#e8d5b0' }}>

          {/* ── THE PILL ── */}
          <div className="w-full max-w-2xl">
            <div
              className="flex items-center rounded-2xl px-5 py-4 gap-3 transition-all duration-300"
              style={{
                background: '#2a2a2a',
                border: `2px solid ${pillFocused ? GOLD : 'rgba(212,175,55,0.3)'}`,
                boxShadow: pillFocused ? `0 0 40px rgba(212,175,55,0.15)` : 'none',
              }}
            >
              <Search className="w-5 h-5 shrink-0" style={{ color: GOLD }} />
              <input
                type="text"
                value={situation}
                onChange={e => setSituation(e.target.value)}
                onFocus={() => setPillFocused(true)}
                onBlur={() => setTimeout(() => setPillFocused(false), 200)}
                placeholder="What is your real estate situation?"
                className="flex-1 bg-transparent text-white text-base outline-none placeholder-white"
                style={{ caretColor: GOLD }}
                />
                <button
                className="px-5 py-2.5 rounded-xl text-sm font-black text-black shrink-0 transition-all hover:opacity-90"
                style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})` }}
              >
                Solve My Story
              </button>
            </div>

            {/* ── QUICK STARTS (appear on focus) ── */}
            <div className={`transition-all duration-300 overflow-hidden ${pillFocused ? 'max-h-60 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {QUICK_STARTS.map((qs, i) => (
                  <Link key={i} to={qs.link}
                    className="flex flex-col items-start px-4 py-3 rounded-xl text-left transition-all hover:border-yellow-400/60 group"
                    style={{ background: '#f0f0f0', border: '1px solid rgba(0,0,0,0.08)' }}>
                    <span className="text-gray-900 text-sm font-semibold group-hover:text-yellow-600 transition-colors leading-snug">{qs.label}</span>
                    <span className="text-[10px] mt-1 font-bold tracking-widest uppercase" style={{ color: GOLD }}>{qs.desc}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── STORY BOX ── */}
          <div className="w-full max-w-2xl mt-12">
            <p className="text-gray-900 text-base font-semibold mb-3">
              We've seen it all in 55 years. What's happening with your home?
            </p>

            {storySubmitted ? (
              <div className="rounded-2xl px-6 py-8 text-center"
                style={{ background: '#f5f5f5', border: `1px solid rgba(212,175,55,0.3)` }}>
                <p className="text-gray-900 font-bold mb-1">Story received.</p>
                <p className="text-sm text-gray-600">
                  Our team will reach out with a resolution within 24 hours.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden"
                style={{ background: '#f5f5f5', border: '1px solid rgba(0,0,0,0.1)' }}>
                <textarea
                  value={story}
                  onChange={e => setStory(e.target.value)}
                  rows={5}
                  placeholder="Enter your story here... we'll get back to you with a resolution."
                  className="w-full px-5 py-4 bg-transparent text-gray-900 text-sm outline-none resize-none placeholder-gray-400 leading-relaxed"
                  style={{ fontFamily: 'Georgia, serif' }}
                />
                <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                  <span className="text-xs text-gray-500">No sales pitch. Just a resolution.</span>
                  <button
                    onClick={() => { if (story.trim()) setStorySubmitted(true); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-black transition-all hover:opacity-90"
                    style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})` }}>
                    Send <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── DNN MORNING BRIEF CORNER CARD ── */}
        {brief && (
          <Link to="/dnn-news"
            className="fixed bottom-6 right-6 max-w-xs rounded-2xl px-4 py-3 transition-all hover:scale-105 z-40"
            style={{
              background: '#111',
              border: `1px solid rgba(212,175,55,0.3)`,
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: GOLD }} />
              <p className="text-[9px] font-black tracking-[0.25em] uppercase" style={{ color: GOLD }}>
                DNN Morning Brief · {today}
              </p>
            </div>
            <p className="text-white text-xs font-semibold leading-snug line-clamp-2">{brief.headline}</p>
            <p className="text-[10px] mt-1.5 font-bold" style={{ color: GOLD }}>Read full brief →</p>
          </Link>
        )}

      </div>
    </div>
  );
}