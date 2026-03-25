import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";
const GOLD = '#D4AF37';

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: '#808080', color: '#fff' }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 px-6 md:px-14 py-4 frosted-dark"
        style={{ borderBottom: '1px solid rgba(212,175,55,0.12)' }}>
        <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-10 w-auto" />
      </nav>

      <main className="max-w-5xl mx-auto px-6 md:px-14 py-24">
        {/* Hero */}
        <div className="text-center mb-20">
          <h1 className="display-heading" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', lineHeight: 1.1, letterSpacing: '0.28em', marginBottom: '1.5rem' }}>
            <span style={{ color: '#000' }}>WELCOME TO </span><span className="gold-text-gradient">DYSON & DYSON</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto mb-12" style={{ color: '#fff' }}>
            Corporate relocation made simple. Expert guidance, AI concierge, matched agents. All included.
          </p>
          <Link to="/Explainers" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all hover:opacity-90"
            style={{ background: GOLD, color: '#000' }}>
            Learn More
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}