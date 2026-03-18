import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatInterface from '../components/charlie/ChatInterface';
const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";
const GOLD = '#D4AF37';

export default function Chat() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#080808' }}>
      {/* Header */}
      <header className="px-6 py-3 flex items-center gap-3 shrink-0 frosted-dark" style={{ borderBottom: '1px solid rgba(212,175,55,0.12)' }}>
        <Link to="/Dashboard">
          <Button variant="ghost" size="icon" className="h-8 w-8" style={{ color: '#D4AF37' }}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <Link to="/Home"><img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-12 w-auto cursor-pointer" /></Link>
        <div>
          <h1 className="text-2xl font-black" style={{ color: '#ffffff' }}>Charlie — AI Concierge</h1>
          <p className="text-sm" style={{ color: '#D4AF37' }}>Concierge Relocation Services • Always Free</p>
        </div>
      </header>

      {/* Gemini Live CTA banner */}
      <div className="max-w-3xl w-full mx-auto px-6 pt-4 shrink-0">
        <Link to="/GeminiSession">
          <div className="rounded-xl px-4 py-3 flex items-center gap-3 cursor-pointer transition-all hover:opacity-90"
            style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid ${GOLD}44` }}>
            <Sparkles className="w-5 h-5 shrink-0" style={{ color: GOLD }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold" style={{ color: GOLD }}>Ready for your deep-dive interview?</p>
              <p className="text-sm truncate" style={{ color: '#f5f5f5' }}>Start your live Gemini session — builds your full relocation profile</p>
            </div>
            <span className="text-sm font-bold shrink-0" style={{ color: GOLD }}>Begin →</span>
          </div>
        </Link>
      </div>

      {/* Chat */}
      <div className="flex-1 max-w-3xl w-full mx-auto p-6">
        <ChatInterface
          expanded={expanded}
          onToggleExpand={() => setExpanded(!expanded)} />
      </div>
    </div>);

}