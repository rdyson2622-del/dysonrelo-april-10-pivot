import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, MessageCircle, Shield, MapPin, CheckCircle2,
  UserCheck, Building2, Truck, Zap, GraduationCap, HeartPulse, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";

const GOLD = '#D4AF37';
const DARK_GOLD = '#B8860B';

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
  const [charlieActive, setCharlieActive] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: '#080808', color: '#fff' }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-4" style={{ borderBottom: `1px solid ${GOLD}22`, background: '#0a0a0a' }}>
        <div className="flex items-center gap-2">
          <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-14 w-auto" />
        </div>
        <div className="flex items-center gap-3">
          <Link to="/Dashboard">
            <Button variant="ghost" className="text-sm font-normal" style={{ color: '#aaa' }}>Dashboard</Button>
          </Link>
          <Link to="/Admin">
            <Button className="text-sm font-semibold rounded-lg px-4" style={{ background: GOLD, color: '#000' }}>
              Admin
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Gold accent lines */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 60% 50%, rgba(212,175,55,0.06) 0%, transparent 60%)' }} />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-wider"
                style={{ background: 'rgba(212,175,55,0.12)', color: GOLD, border: `1px solid ${GOLD}44` }}>
                <Sparkles className="w-3 h-3" />
                POWERED BY ARTIFICIAL INTELLIGENCE
              </div>

              <h1 className="text-5xl md:text-7xl font-black leading-[1.0] tracking-tight mb-2">
                <span style={{ color: '#fff' }}>YOUR PERSONAL</span>
              </h1>
              <h1 className="text-5xl md:text-7xl font-black leading-[1.0] tracking-tight">
                <span style={{ color: GOLD }}>AI REAL ESTATE</span>
              </h1>
              <h1 className="text-5xl md:text-7xl font-black leading-[1.0] tracking-tight mb-6">
                <span style={{ color: '#fff' }}>CONCIERGE</span>
              </h1>

              <p className="text-lg leading-relaxed mb-3 max-w-lg" style={{ color: '#aaa' }}>
                Meet Charlie — a revolutionary AI assistant that handles every aspect of your relocation. Neighborhood research, agent matching, moving logistics, school enrollment, and more.
              </p>
              <p className="text-base font-bold mb-8" style={{ color: GOLD }}>
                ✦ Completely free to you. Always.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link to="/Chat">
                  <Button size="lg" className="gap-2 rounded-xl px-7 font-bold text-base" style={{ background: GOLD, color: '#000' }}>
                    Talk to Charlie <MessageCircle className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/Dashboard">
                  <Button size="lg" variant="outline" className="gap-2 rounded-xl px-7 font-semibold" style={{ borderColor: GOLD, color: GOLD, background: 'transparent' }}>
                    My Dashboard <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Charlie card */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex justify-center">
              <div className="relative w-full max-w-sm">
                {/* Glow */}
                <div className="absolute inset-0 rounded-3xl blur-3xl scale-110" style={{ background: 'rgba(212,175,55,0.15)' }} />

                <div className="relative rounded-3xl p-6" style={{ background: '#111', border: `1px solid ${GOLD}55` }}>
                  {/* AI badge */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold tracking-widest"
                    style={{ background: GOLD, color: '#000' }}>
                    AI-POWERED
                  </div>

                  <div className="flex justify-center mb-5 mt-2">
                    <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-32 w-auto cursor-pointer hover:scale-105 transition-transform" onClick={() => setCharlieActive(!charlieActive)} />
                  </div>

                  <p className="text-center text-xs font-semibold tracking-widest mb-4" style={{ color: GOLD }}>
                    CHARLIE — YOUR AI CONCIERGE
                  </p>

                  <div className="space-y-3">
                    <div className="rounded-2xl rounded-bl-sm px-4 py-3 text-sm" style={{ background: '#1a1a1a', color: '#ddd', border: '1px solid #2a2a2a' }}>
                      Hello! I'm Charlie. Moving somewhere you don't know anyone? I've got you. Where are you headed? 🏙️
                    </div>
                    <div className="rounded-2xl rounded-br-sm px-4 py-3 text-sm ml-6 font-medium" style={{ background: GOLD, color: '#000' }}>
                      We're moving to Austin, TX in June!
                    </div>
                    <div className="rounded-2xl rounded-bl-sm px-4 py-3 text-sm" style={{ background: '#1a1a1a', color: '#ddd', border: '1px solid #2a2a2a' }}>
                      Perfect! Austin's booming. I'll research the best neighborhoods for families, connect you with a top local agent, and build your complete moving plan — all free. Let's start! ✨
                    </div>
                  </div>

                  <Link to="/Chat" className="block mt-4">
                    <button className="w-full py-3 rounded-xl font-bold text-sm tracking-wider transition-all hover:opacity-90"
                      style={{ background: GOLD, color: '#000' }}>
                      START YOUR FREE CONSULTATION
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI Banner */}
      <section className="py-12 px-6" style={{ background: '#0d0d0d', borderTop: `1px solid ${GOLD}22`, borderBottom: `1px solid ${GOLD}22` }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${GOLD})` }} />
            <Sparkles style={{ color: GOLD }} className="w-5 h-5" />
            <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black mb-3" style={{ color: GOLD }}>
            A NEW ERA OF REAL ESTATE IS HERE
          </h2>
          <p className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: '#999' }}>
            Concierge Relocation Services harnesses the power of advanced AI to give every relocating family access to a world-class personal assistant — the kind of service previously reserved for executives and celebrities. <span style={{ color: GOLD }}>And it costs you absolutely nothing.</span>
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-[0.3em] mb-3" style={{ color: GOLD }}>FULL-SERVICE RELOCATION</p>
          <h2 className="text-3xl md:text-5xl font-black" style={{ color: '#fff' }}>
            Everything handled.<br />
            <span style={{ color: GOLD }}>Nothing left behind.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="p-6 rounded-2xl transition-all duration-300 group cursor-default"
              style={{ background: '#111', border: '1px solid #222' }}
              onMouseEnter={e => e.currentTarget.style.border = `1px solid ${GOLD}66`}
              onMouseLeave={e => e.currentTarget.style.border = '1px solid #222'}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(212,175,55,0.12)', border: `1px solid ${GOLD}33` }}>
                <s.icon className="w-5 h-5" style={{ color: GOLD }} />
              </div>
              <h3 className="font-bold mb-2" style={{ color: '#fff' }}>{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#777' }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Agent Selection Highlight */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl p-10 md:p-14 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #111 0%, #1a1500 100%)', border: `1px solid ${GOLD}44` }}
        >
          <div className="absolute inset-0 opacity-5" style={{ background: `radial-gradient(circle at 80% 50%, ${GOLD}, transparent)` }} />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] mb-3" style={{ color: GOLD }}>EXCLUSIVE AGENT NETWORK</p>
              <h3 className="text-3xl md:text-4xl font-black mb-4" style={{ color: '#fff' }}>
                Meet Your Perfect<br /><span style={{ color: GOLD }}>Local Agent</span>
              </h3>
              <p className="leading-relaxed mb-6" style={{ color: '#999' }}>
                Charlie doesn't just connect you with any agent — he analyzes your specific needs, budget, timeline, and neighborhood preferences to hand-match you with the ideal local expert. Every agent in our network is vetted, top-producing, and relocation-certified.
              </p>
              <ul className="space-y-2 mb-8">
                {['Vetted & Certified Relocation Specialists', 'Top 10% Producers in Their Markets', 'Dedicated Buyer Representation', 'Zero Cost to You as the Buyer'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm" style={{ color: '#bbb' }}>
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: GOLD }} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/Chat">
                <button className="px-8 py-3 rounded-xl font-bold text-sm tracking-wider" style={{ background: GOLD, color: '#000' }}>
                  FIND MY AGENT WITH CHARLIE
                </button>
              </Link>
            </div>
            <div className="flex justify-center">
              <DnDLogo size="xl" speaking={false} />
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center" style={{ background: '#0a0a0a', borderTop: `1px solid ${GOLD}22` }}>
        <p className="text-xs font-bold tracking-[0.3em] mb-3" style={{ color: GOLD }}>GET STARTED TODAY</p>
        <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: '#fff' }}>Ready for your <span style={{ color: GOLD }}>fresh start?</span></h2>
        <p className="text-base mb-8 max-w-md mx-auto" style={{ color: '#777' }}>Talk to Charlie right now. No sign-up required. No hidden fees. Just exceptional AI-powered relocation service.</p>
        <Link to="/Chat">
          <button className="px-10 py-4 rounded-xl font-black text-lg tracking-wider" style={{ background: GOLD, color: '#000' }}>
            TALK TO CHARLIE — IT'S FREE
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center" style={{ borderTop: `1px solid #1a1a1a` }}>
        <div className="font-black tracking-tight mb-1" style={{ color: GOLD }}>CONCIERGE RELOCATION SERVICES</div>
        <p className="text-xs" style={{ color: '#444' }}>© 2026 · Powered by AI · Serving Families Nationwide · Always Free to Buyers</p>
      </footer>
    </div>
  );
}