import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";
const CHARLIE_IMG = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/626da9da8_Screenshot2026-02-06at123820PM.png";
const GOLD = '#D4AF37';

const sampleConversations = [
  {
    user: "We're moving to Austin, TX in June!",
    charlie: "Perfect! Austin's booming. I'll research the best neighborhoods, connect you with a top local agent, and build your complete moving plan — all free. ✨"
  },
  {
    user: "How do you find the right agent?",
    charlie: "After your Gemini session, Bob Dyson personally reviews your profile — 40 years of real estate experience — and evaluates the top agents in your destination market. Then we present you with 3-5 curated options. You choose."
  },
  {
    user: "What's the catch?",
    charlie: "No catch. Zero cost to you. We earn a referral fee from the agent at close of escrow. You get expert relocation management, completely free."
  }
];

export default function Landing() {
  const [currentConvo, setCurrentConvo] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setCurrentConvo((prev) => (prev + 1) % sampleConversations.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoPlay]);

  const convo = sampleConversations[currentConvo];

  return (
    <div className="min-h-screen" style={{ background: '#A9A9A9' }}>
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4" style={{ background: '#000', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-10 w-auto" />
        <Link to="/Admin">
          <button className="px-3 py-2 rounded-full text-xs font-semibold transition-all"
            style={{ background: 'rgba(212,175,55,0.12)', color: GOLD, border: '1px solid rgba(212,175,55,0.3)' }}>
            Admin
          </button>
        </Link>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-12 items-start min-h-[calc(100vh-200px)]">
          {/* Left Column - Value Prop */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-8 tracking-widest"
              style={{ background: GOLD, color: '#000' }}>
              ✨ POWERED BY AI
            </div>

            <h1 className="display-heading mb-6" style={{ lineHeight: 1.15, letterSpacing: '0.22em' }}>
              <span style={{ display: 'block', color: GOLD, fontSize: 'clamp(1.4rem, 5vw, 2.8rem)' }}>CONCIERGE</span>
              <span style={{ display: 'block', color: '#000', fontSize: 'clamp(1.2rem, 4vw, 2.4rem)' }}>REAL ESTATE</span>
            </h1>

            <p className="text-lg leading-relaxed mb-4" style={{ color: '#000' }}>
              Meet Charlie — AI that handles every aspect of your relocation.
            </p>
            <p className="font-semibold mb-8" style={{ color: '#000' }}>
              ✦ Completely free to you.
            </p>

            <div className="flex flex-col gap-3">
              <Link to="/Chat">
                <button className="w-full px-6 py-3 rounded-full text-sm font-bold transition-all hover:shadow-lg" 
                  style={{ background: GOLD, color: '#000' }}>
                  Talk to Charlie
                </button>
              </Link>
              <Link to="/Dashboard">
                <button className="w-full px-6 py-3 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-2"
                  style={{ background: '#000', color: '#fff' }}>
                  My Dashboard <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>

            {/* Welcome Back Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl p-6 mt-8"
              style={{ background: 'rgba(255,255,255,0.95)', border: '2px solid #D4AF37' }}
            >
              <h3 className="serif-heading text-lg mb-3" style={{ color: '#000', letterSpacing: '-0.01em' }}>Welcome</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#666' }}>
                Start your relocation journey with Charlie. We'll research neighborhoods, find your agent, and handle every moving detail — free.
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column - Charlie Chat Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="rounded-3xl p-8"
            style={{ background: '#3a3a3a', border: `2px solid ${GOLD}` }}
          >
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest"
                style={{ background: GOLD, color: '#000' }}>
                AI-POWERED
              </div>
            </div>

            <div className="flex justify-center mb-8">
              <img src={CHARLIE_IMG} alt="Charlie" className="h-40 w-auto" />
            </div>

            <p className="text-center text-xs font-bold tracking-widest mb-6" style={{ color: '#fff' }}>
              CHARLIE — YOUR AI CONCIERGE
            </p>

            {/* Animated Conversation */}
            <div className="space-y-4 mb-6 min-h-48">
              <motion.div
                key={`charlie-${currentConvo}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-lg px-4 py-3 text-sm leading-relaxed"
                style={{ background: '#000', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Hello! I'm Charlie. Moving somewhere you don't know anyone? I've got you. Where are you headed? 🏙️
              </motion.div>

              <motion.div
                key={`user-${currentConvo}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-lg px-4 py-3 text-sm font-semibold ml-auto w-fit"
                style={{ background: GOLD, color: '#000' }}
              >
                {convo.user}
              </motion.div>

              <motion.div
                key={`response-${currentConvo}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-lg px-4 py-3 text-sm leading-relaxed"
                style={{ background: '#000', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {convo.charlie}
              </motion.div>
            </div>

            {/* Carousel Dots */}
            <div className="flex justify-center gap-2 mb-6">
              {sampleConversations.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentConvo(i);
                    setAutoPlay(false);
                  }}
                  className="w-2 h-2 rounded-full transition-all"
                  style={{
                    background: i === currentConvo ? GOLD : 'rgba(255,255,255,0.3)',
                    width: i === currentConvo ? 24 : 8
                  }}
                />
              ))}
            </div>

            <Link to="/Chat" className="block w-full">
              <button className="w-full py-3 rounded-full text-sm font-bold tracking-wider transition-all hover:shadow-lg"
                style={{ background: GOLD, color: '#000' }}>
                START FREE CONSULTATION
              </button>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}