import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, MessageCircle, Shield, MapPin, CheckCircle2,
  UserCheck, Building2, Truck, Zap, GraduationCap, HeartPulse, Sparkles
} from 'lucide-react';
import CharlieTopHat from '../components/brand/CharlieTopHat';
const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";

const GOLD = '#D4AF37';

const services = [
  { icon: MessageCircle, title: 'AI Concierge Chat', desc: 'Charlie is available 24/7 to answer every question about your new city, completely free.' },
  { icon: MapPin, title: 'Neighborhood Research', desc: 'Deep-dive analysis of neighborhoods matching your lifestyle, commute, and priorities.' },
  { icon: UserCheck, title: 'Agent Selection', desc: 'We match you with a vetted, top-performing local agent who specializes in relocation.' },
  { icon: Building2, title: 'Home Search Strategy', desc: 'AI-powered property matching based on your exact criteria and budget.' },
  { icon: Truck, title: 'Moving Coordination', desc: 'From packing to delivery — Charlie manages your entire moving logistics checklist.' },
  { icon: Zap, title: 'Utilities & Services', desc: 'Internet, electric, gas, water — all transferred and set up before you arrive.' },
  { icon: GraduationCap, title: 'School Enrollment', desc: 'District research, school tours, and enrollment paperwork handled for you.' },
  { icon: HeartPulse, title: 'Healthcare Setup', desc: 'Find top-rated doctors, dentists, and specialists in your new area.' },
];

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: '#080808', color: '#fff' }}>

      {/* Nav */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-14 py-4 frosted-dark"
        style={{ borderBottom: '1px solid rgba(212,175,55,0.12)' }}
      >
        <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-12 w-auto" />
        <div className="flex items-center gap-2">
          <Link to="/Dashboard">
            <button className="text-sm px-4 py-2 rounded-full transition-all hover:bg-white/5" style={{ color: '#999', fontWeight: 500 }}>
              Dashboard
            </button>
          </Link>
          <Link to="/Admin">
            <button className="text-sm px-4 py-2 rounded-full font-semibold transition-all hover:opacity-90 gold-btn">
              Admin
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ minHeight: '88vh', display: 'flex', alignItems: 'center' }}>
        {/* Deep background radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(212,175,55,0.07) 0%, transparent 65%)',
        }} />
        {/* Top shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.5) 50%, transparent 100%)' }} />

        <div className="relative max-w-7xl mx-auto px-6 md:px-14 py-24 w-full">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Left: Copy */}
            <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-8 tracking-widest"
                style={{ background: 'rgba(212,175,55,0.1)', color: GOLD, border: '1px solid rgba(212,175,55,0.25)' }}>
                <Sparkles className="w-3 h-3" />
                POWERED BY AI
              </div>

              <h1 className="display-heading" style={{ fontSize: 'clamp(2rem, 4.5vw, 4.2rem)', lineHeight: 1.15, letterSpacing: '0.28em', marginBottom: '0.1em', color: '#fff' }}>
                Your Personal
              </h1>
              <h1 className="display-heading gold-text-gradient" style={{ fontSize: 'clamp(2rem, 4.5vw, 4.2rem)', lineHeight: 1.15, letterSpacing: '0.28em', marginBottom: '0.1em' }}>
                AI Real Estate
              </h1>
              <h1 className="display-heading" style={{ fontSize: 'clamp(2rem, 4.5vw, 4.2rem)', lineHeight: 1.15, letterSpacing: '0.28em', marginBottom: '2rem', color: '#fff' }}>
                Concierge.
              </h1>

              <p className="text-lg leading-relaxed mb-2 max-w-lg" style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 400 }}>
                Meet Charlie — AI that handles every aspect of your relocation. Neighborhood research, agent matching, school enrollment, and more.
              </p>
              <p className="text-base font-semibold mb-10" style={{ color: GOLD }}>
                ✦ Completely free to you. Always.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link to="/Chat">
                  <button className="gold-btn px-7 py-3 rounded-full text-sm font-bold tracking-wide flex items-center gap-2">
                    Talk to Charlie <MessageCircle className="w-4 h-4" />
                  </button>
                </Link>
                <Link to="/Dashboard">
                  <button className="px-7 py-3 rounded-full text-sm font-semibold flex items-center gap-2 transition-all hover:bg-white/5"
                    style={{ color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)' }}>
                    My Dashboard <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Right: Charlie card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-center"
            >
              <div className="relative w-full max-w-sm">
                {/* Ambient glow */}
                <div className="absolute inset-0 rounded-3xl blur-3xl scale-110 pointer-events-none"
                  style={{ background: 'rgba(212,175,55,0.12)' }} />

                <div className="relative rounded-3xl p-7 frosted-gold">
                  {/* AI badge */}
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold tracking-widest"
                    style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37, #b8920a)', color: '#000', boxShadow: '0 0 16px rgba(212,175,55,0.4)' }}>
                    AI-POWERED
                  </div>

                  <div className="flex justify-center mb-5 mt-2">
                    <CharlieTopHat size="lg" />
                  </div>

                  <p className="text-center text-xs font-bold tracking-widest mb-5" style={{ color: GOLD }}>
                    CHARLIE — YOUR AI CONCIERGE
                  </p>

                  <div className="space-y-3">
                    <div className="rounded-2xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed"
                      style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      Hello! I'm Charlie. Moving somewhere you don't know anyone? I've got you. Where are you headed? 🏙️
                    </div>
                    <div className="rounded-2xl rounded-br-sm px-4 py-3 text-sm ml-6 font-semibold gold-btn">
                      We're moving to Austin, TX in June!
                    </div>
                    <div className="rounded-2xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed"
                      style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      Perfect! Austin's booming. I'll research the best neighborhoods, connect you with a top local agent, and build your complete moving plan — all free. ✨
                    </div>
                  </div>

                  <Link to="/Chat" className="block mt-5">
                    <button className="w-full py-3 rounded-2xl text-sm font-bold tracking-wider gold-btn">
                      START FREE CONSULTATION
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Divider banner */}
      <section className="py-14 px-6 relative overflow-hidden"
        style={{ borderTop: '1px solid rgba(212,175,55,0.1)', borderBottom: '1px solid rgba(212,175,55,0.1)', background: 'rgba(212,175,55,0.02)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5))' }} />
            <Sparkles style={{ color: GOLD }} className="w-4 h-4" />
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.5), transparent)' }} />
          </div>
          <h2 className="display-heading gold-text-gradient mb-3" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', lineHeight: 1.2, letterSpacing: '0.22em' }}>
            A new era of real estate is here.
          </h2>
          <p className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Concierge Relocation Services harnesses advanced AI to give every family access to a world-class personal assistant — the kind previously reserved for executives.{' '}
            <span style={{ color: GOLD, fontWeight: 600 }}>And it costs you absolutely nothing.</span>
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-7xl mx-auto px-6 md:px-14 py-24">
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-[0.3em] mb-4" style={{ color: GOLD }}>FULL-SERVICE RELOCATION</p>
          <h2 className="display-heading" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 3rem)', lineHeight: 1.25, letterSpacing: '0.22em', color: '#fff' }}>
            Everything handled.<br />
            <span className="gold-text-gradient">Nothing left behind.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 rounded-2xl service-card"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                <s.icon className="w-5 h-5" style={{ color: GOLD }} />
              </div>
              <h3 className="font-semibold mb-2 text-sm" style={{ color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.01em' }}>{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Agent highlight */}
      <section className="max-w-7xl mx-auto px-6 md:px-14 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl p-10 md:p-16 relative overflow-hidden frosted-gold"
          style={{ border: '1px solid rgba(212,175,55,0.22)' }}
        >
          {/* Subtle radial bg */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse 60% 80% at 85% 50%, rgba(212,175,55,0.07) 0%, transparent 65%)',
          }} />
          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] mb-4" style={{ color: GOLD }}>EXCLUSIVE AGENT NETWORK</p>
              <h3 className="serif-heading mb-5" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 600, lineHeight: 1.05, letterSpacing: '0.02em', color: '#fff' }}>
                Meet your perfect<br /><span className="gold-text-gradient">local agent.</span>
              </h3>
              <p className="leading-relaxed mb-7" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Charlie doesn't just connect you with any agent — he analyzes your needs, budget, timeline, and neighborhood preferences to hand-match you with the ideal local expert. Every agent is vetted, top-producing, and relocation-certified.
              </p>
              <ul className="space-y-2.5 mb-9">
                {['Vetted & Certified Relocation Specialists', 'Top 10% Producers in Their Markets', 'Dedicated Buyer Representation', 'Zero Cost to You as the Buyer'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: GOLD }} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/Chat">
                <button className="px-8 py-3 rounded-full font-bold text-sm tracking-wide gold-btn">
                  Find My Agent with Charlie
                </button>
              </Link>
            </div>
            <div className="flex justify-center">
              <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-40 w-auto opacity-90" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center relative overflow-hidden"
        style={{ borderTop: '1px solid rgba(212,175,55,0.1)', background: 'rgba(212,175,55,0.015)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(212,175,55,0.06) 0%, transparent 60%)' }} />
        <div className="relative">
          <p className="text-xs font-bold tracking-[0.3em] mb-4" style={{ color: GOLD }}>GET STARTED TODAY</p>
          <h2 className="serif-heading mb-4" style={{ fontSize: 'clamp(2.6rem, 6vw, 5rem)', fontWeight: 600, lineHeight: 1.05, letterSpacing: '0.02em', color: '#fff' }}>
            Ready for your{' '}
            <span className="gold-text-gradient">fresh start?</span>
          </h2>
          <p className="text-base mb-10 max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Talk to Charlie right now. No sign-up required. No hidden fees. Just exceptional AI-powered relocation service.
          </p>
          <Link to="/Chat">
            <button className="px-10 py-4 rounded-full font-bold text-base tracking-wide gold-btn">
              Talk to Charlie — It's Free
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="font-bold tracking-widest text-xs mb-2" style={{ color: 'rgba(212,175,55,0.7)' }}>CONCIERGE RELOCATION SERVICES</div>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>© 2026 · Powered by AI · Serving Families Nationwide · Always Free to Buyers</p>
      </footer>
    </div>
  );
}