import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";
const GOLD = '#D4AF37';

export default function ReceivingAgentExplainer() {
  return (
    <div className="min-h-screen" style={{ background: '#808080', color: '#fff' }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-14 py-4"
        style={{ background: '#000', borderBottom: '1px solid rgba(212,175,55,0.12)' }}>
        <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-12 w-auto" />
        <Link to="/">
          <button className="text-sm px-4 py-2 rounded-full transition-all hover:bg-white/5" style={{ color: '#fff', fontWeight: 500 }}>
            Back to Home
          </button>
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h1 className="display-heading mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.15, letterSpacing: '0.22em', color: '#fff' }}>
            Receiving Agent Partnership <span style={{ color: GOLD }}>— Coming Soon</span>
          </h1>
          <p className="text-lg leading-relaxed mb-8" style={{ color: '#fff' }}>
            For receiving agents in destination cities — explains how the referral works, what the client expects, and accountability standards
          </p>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="rounded-3xl p-10"
          style={{ background: '#3a3a3a', border: `1px solid rgba(212,175,55,0.3)` }}
        >
          <h2 className="serif-heading text-3xl mb-8" style={{ color: '#fff', letterSpacing: '-0.01em' }}>
            Receiving Agent Program — In Development
          </h2>

          <p className="text-base leading-relaxed mb-8" style={{ color: '#fff' }}>
            This presentation is currently being built.
          </p>

          <div className="mb-10">
            <p className="text-base font-semibold mb-6" style={{ color: '#fff' }}>
              The Receiving Agent program covers:
            </p>
            <ul className="space-y-4">
              {[
                { icon: '📋', text: 'How referrals are structured and sent' },
                { icon: '👥', text: 'What clients expect when they arrive' },
                { icon: '📊', text: 'Accountability standards and reporting' },
                { icon: '💰', text: 'Referral fee structure and payment terms' },
                { icon: '🤝', text: 'How to join the Dyson & Dyson agent network' },
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <span className="text-base" style={{ color: '#fff' }}>{item.text}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Expected Completion */}
          <div className="rounded-xl p-6 mb-8" style={{ background: 'rgba(212,175,55,0.1)', border: `1px solid rgba(212,175,55,0.2)` }}>
            <p className="text-sm font-semibold mb-2" style={{ color: GOLD }}>EXPECTED COMPLETION</p>
            <p className="text-base font-bold mb-4" style={{ color: '#fff' }}>Q2 2026</p>
            <p className="text-sm" style={{ color: '#fff' }}>
              Contact <strong>rdyson2622@gmail.com</strong> to be considered for the receiving agent network.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-wrap gap-3">
            <a href="mailto:rdyson2622@gmail.com" className="flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all hover:shadow-lg" style={{ background: GOLD, color: '#000' }}>
              Contact Bob About Joining <ArrowRight className="w-4 h-4" />
            </a>
            <Link to="/">
              <button className="px-6 py-3 rounded-full font-bold transition-all hover:bg-white/5" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(212,175,55,0.3)' }}>
                Back to Home
              </button>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}