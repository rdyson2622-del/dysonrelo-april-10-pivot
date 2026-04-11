import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, MessageCircle, Shield, MapPin, CheckCircle2,
  UserCheck, Building2, Truck, Zap, GraduationCap, HeartPulse, Sparkles
} from 'lucide-react';
import CharlieTopHat from '../components/brand/CharlieTopHat';
import { CORPORATE_PROFILE } from '../lib/corporateProfile';
import CityGuideTeaser from '../components/home/CityGuideTeaser';
import HeroMinimal from '../components/home/HeroMinimal';

const GOLD = '#D4AF37';

const services = [
  { icon: MessageCircle, title: 'AI Concierge Chat', desc: 'Charlie is available 24/7 to answer every question about your new city, completely free.' },
  { icon: MapPin, title: 'Neighborhood Research', desc: 'Deep-dive analysis of neighborhoods matching your lifestyle, commute, and priorities.' },
  { icon: UserCheck, title: 'Agent Selection', desc: 'We interview you on agent personality & style, then present 3–5 hand-vetted candidates — reviewed for DRE ratings, production records, and personally screened. You choose. No "I love me" agents chasing deals.' },
  { icon: Building2, title: 'Home Search Strategy', desc: 'AI-powered property matching based on your exact criteria and budget.' },
  { icon: Truck, title: 'Moving Coordination', desc: 'From packing to delivery — Charlie manages your entire moving logistics checklist.' },
  { icon: Zap, title: 'Utilities & Services', desc: 'Internet, electric, gas, water — all transferred and set up before you arrive.' },
  { icon: GraduationCap, title: 'School Enrollment', desc: 'District research, school tours, and enrollment paperwork handled for you.' },
  { icon: HeartPulse, title: 'Healthcare Setup', desc: 'Find top-rated doctors, dentists, and specialists in your new area.' },
];

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: '#808080', color: '#fff' }}>

      {/* Hero */}
      <section id="hero">
        <HeroMinimal />
      </section>

      {/* Charlie Card — mobile only */}
      <section className="md:hidden relative overflow-hidden py-20 px-6 flex justify-center" style={{ background: '#000', borderTop: '1px solid rgba(212,175,55,0.15)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-sm"
        >
          <div className="absolute inset-0 rounded-3xl blur-3xl scale-110 pointer-events-none"
            style={{ background: 'rgba(212,175,55,0.12)' }} />
          <div className="relative rounded-3xl p-7" style={{ background: 'linear-gradient(135deg, #4a4a4a 0%, #2d2d2d 100%)', border: '2px solid #D4AF37' }}>
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold tracking-widest"
              style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37, #b8920a)', color: '#000', boxShadow: '0 0 16px rgba(212,175,55,0.4)' }}>
              AI-POWERED
            </div>
            <div className="flex justify-center mb-5 mt-2">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/626da9da8_Screenshot2026-02-06at123820PM.png"
                alt="Charlie"
                className="h-48 w-auto object-contain"
                style={{ filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.3))' }}
              />
            </div>
            <p className="text-center text-xs font-bold tracking-widest mb-5" style={{ color: '#fff' }}>
              CHARLIE — YOUR RELOCATION MANAGER
            </p>
            <div className="space-y-2">
              <div className="rounded-lg px-3 py-2 text-sm leading-relaxed"
                style={{ background: '#000', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}>
                Hello! I'm Charlie — your Relocation Manager from Dyson & Dyson. We manage selling your current home and finding your next one — completely free. Tell me where you're headed and I'll show you exactly what we'll do together. 🏙️
              </div>
              <div className="rounded-lg px-3 py-2 text-sm font-semibold gold-btn ml-auto w-fit">
                We're moving to Austin, TX in June!
              </div>
              <div className="rounded-lg px-3 py-2 text-sm leading-relaxed"
                style={{ background: '#000', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}>
                Perfect. Austin is booming and I know it well. Once you share your contact info, we'll schedule your private session with Bob Dyson and Gemini AI — and I'll start building your complete relocation plan. ✨
              </div>
            </div>
            <Link to="/RelocationIntake" className="block mt-5">
              <button className="w-full py-3 rounded-2xl text-sm font-bold tracking-wider gold-btn">
                LET'S PLAN MY RELOCATION MOVE
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Promise */}
      <section id="promise" className="py-16 px-6 md:px-14" style={{ background: '#000', borderTop: '1px solid rgba(212,175,55,0.15)', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
        <div className="max-w-5xl mx-auto text-center mb-12">
          <p className="text-xs font-bold tracking-[0.3em] mb-3" style={{ color: GOLD }}>THE DYSON PROMISE</p>
          <h2 className="display-heading mb-4" style={{ fontSize: 'clamp(1.28rem, 2.8vw, 2.24rem)', lineHeight: 1.2, letterSpacing: '0.22em', color: '#fff' }}>
            We don't send you a map.<br />
            <span className="gold-text-gradient" style={{ fontSize: 'clamp(1.09rem, 2.38vw, 1.9rem)' }}>We make the journey with you.</span>
          </h2>
          <p className="text-base max-w-2xl mx-auto mb-4" style={{ color: '#e5e5e5' }}>
            We are <strong style={{ color: GOLD }}>Relocation Managers</strong>. Not Agents. Not a listing service. We help families and professionals sell their current home and find their next one, anywhere in the country. Every step below is something Charlie and your Dyson team actively execute on your behalf, all the way through close of escrow and beyond.
          </p>
          <p className="text-sm max-w-2xl mx-auto" style={{ color: 'rgba(229,229,229,0.8)' }}>
            <em>We intentionally work with a limited number of families at any given time. This isn't exclusivity — it's commitment. Real relocation management requires deep local focus, market expertise, timeline coordination, and relentless attention to detail. We're not scaling a service. We're delivering one.</em>
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-10 px-6 md:px-14" style={{ background: '#6b6b6b' }}>
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="p-5 rounded-2xl"
              style={{ background: '#3a3a3a', border: '1px solid rgba(212,175,55,0.25)' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                <s.icon className="w-5 h-5" style={{ color: GOLD }} />
              </div>
              <h3 className="font-bold mb-1.5 tracking-wide" style={{ color: '#fff', fontSize: '1.185rem' }}>{s.title}</h3>
              <p className="leading-relaxed" style={{ color: '#e5e5e5', fontSize: '0.878rem' }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Gemini CTA */}
      <section id="gemini-cta" className="py-16 px-6 md:px-14" style={{ background: '#6b6b6b', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-3xl font-semibold mb-6 max-w-5xl mx-auto" style={{ color: '#e5e5e5' }}>
            Seeing the full scope of what's ahead can feel overwhelming.<br />
            <span style={{ color: GOLD }}>That's exactly the point — and exactly why we exist.</span>
          </p>
          <div className="rounded-2xl p-6 mb-6 text-left" style={{ background: '#3a3a3a', border: '1px solid rgba(212,175,55,0.3)' }}>
            <p className="text-xs font-bold tracking-[0.3em] mb-2" style={{ color: GOLD }}>AFTER YOU COMMIT — THE GEMINI SESSION</p>
            <p className="text-sm leading-relaxed mb-3" style={{ color: '#e5e5e5' }}>
              Once you've confirmed your contact information with us, we set up a private three-way live session — you, Google Gemini (one of the most advanced AI systems in the world), and Senior Staff directly. This is not a chatbot form. It's a real conversation where we build your complete relocation profile together, in real time. Dyson Leadership brings 54+ years of real estate options and guidance to every conversation.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#e5e5e5' }}>
               This session is <strong style={{ color: '#fff' }}>by invitation only</strong> — we're selective about who we work with to ensure everyone gets the intensive, hands-on attention they deserve. We don't have unlimited capacity because we refuse to compromise on quality. Once we have your info and can confirm we're the right fit for your move, Charlie schedules it. No cost to you, ever.
             </p>
             <p className="text-sm leading-relaxed" style={{ color: '#e5e5e5' }}>
               We are not a member of any real estate association by design, but are a licensed brokerage firm — The Dyson & Dyson Companies, Inc. Ca. DRE # 02303118. (858) 353 1200
             </p>
           </div>
          <Link to="/RelocationIntake">
            <button className="gold-btn px-8 py-3 rounded-full text-sm font-bold tracking-wide flex items-center gap-2 mx-auto">
              Let's Plan My Relocation Move <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>

      {/* City Guide Teaser */}
      <div id="city-guide-teaser">
        <CityGuideTeaser />
      </div>

      {/* AI + Experts banner */}
      <section className="py-14 px-6 relative overflow-hidden"
        style={{ borderTop: '1px solid rgba(212,175,55,0.1)', borderBottom: '1px solid rgba(212,175,55,0.1)', background: '#000' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5))' }} />
            <Sparkles style={{ color: GOLD }} className="w-4 h-4" />
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.5), transparent)' }} />
          </div>
          <h2 className="display-heading gold-text-gradient mb-3" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', lineHeight: 1.2, letterSpacing: '0.22em' }}>
            Experienced experts, powered by AI.
          </h2>
          <p className="text-base md:text-lg leading-relaxed max-w-3xl mx-auto" style={{ color: '#fff' }}>
            AI handles data aggregation, comp analysis, document generation, and 24/7 availability. Real estate experts position you to make wise judgment calls, approve major decisions, and then guide you through your entire relocation.{' '}
            <span style={{ color: GOLD, fontWeight: 600 }}>And it costs you absolutely nothing since we are funded by the selected Brokers and&nbsp;Agents.</span>
          </p>
        </div>
      </section>

      {/* Agent Selection — centered, no logo */}
      <section id="agent-selection" className="py-20 px-6 md:px-14" style={{ background: '#000', borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs font-bold tracking-[0.3em] mb-5" style={{ color: GOLD }}>THE DYSON AGENT SELECTION PROCESS</p>
            <h3 className="display-heading mb-4" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)', lineHeight: 1.2, letterSpacing: '0.18em', color: '#fff' }}>
              Your agent. Your choice.<br /><span className="gold-text-gradient">Zero guesswork.</span>
            </h3>
            <div className="w-20 h-px mx-auto mb-8" style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }} />
            <p className="leading-relaxed mb-5 text-base" style={{ color: '#e5e5e5' }}>
              Most people find an agent through Zillow, a yard sign, or a friend of a friend — with no idea whether they're any good. We eliminate that entirely.
            </p>
            <p className="leading-relaxed mb-5 text-base" style={{ color: '#e5e5e5' }}>
              Before we show you a single name, your Dyson Management Team interviews you on communication style, personality, and pace. Then we pull from the <strong style={{ color: '#fff' }}>top 20 agents in your destination market</strong>, review their production records, check their DRE standing, and personally vet each one against Bob Dyson's 40+ years of expertise. From that pool, we present you with <strong style={{ color: '#fff' }}>3 to 5 curated candidates</strong> — never more, never less.
            </p>
            <p className="leading-relaxed mb-10 text-base" style={{ color: '#e5e5e5' }}>
              You choose the one who feels right. The moment you do, <strong style={{ color: '#fff' }}>we have boots on the ground</strong> — briefed, vetted, and ready. No cold handoffs. No "I love me" agents chasing their next deal.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 text-left">
              {[
                'We profile your ideal agent before any names are shared',
                'Top 20 destination agents evaluated — production, DRE, personality',
                '3–5 personally vetted candidates presented for your review',
                'Your selection triggers immediate agent briefing & onboarding',
                'Zero cost to you as the buyer — always'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: GOLD }} />
                  <span className="text-sm" style={{ color: '#fff' }}>{item}</span>
                </div>
              ))}
            </div>
            <Link to="/RelocationIntake">
              <button className="px-10 py-4 rounded-full font-bold text-base tracking-wide gold-btn">
                Find My Agent — Start Here
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-20 px-6 text-center relative overflow-hidden"
        style={{ borderTop: '1px solid rgba(212,175,55,0.1)', background: 'rgba(212,175,55,0.015)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(212,175,55,0.06) 0%, transparent 60%)' }} />
        <div className="relative">
          <p className="text-xs font-bold tracking-[0.3em] mb-4" style={{ color: GOLD }}>GET STARTED TODAY</p>
          <h2 className="display-heading mb-4" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 3rem)', lineHeight: 1.25, letterSpacing: '0.22em', color: '#fff' }}>
            Ready for your{' '}
            <span className="gold-text-gradient">fresh start?</span>
          </h2>
          <p className="text-base mb-10 max-w-md mx-auto" style={{ color: '#fff' }}>
            Talk to Charlie right now. Share where you're moving and we'll take it from there — your relocation manager, your Gemini session, your plan. No hidden fees. Always free.
          </p>
          <Link to="/RelocationIntake">
            <button className="px-10 py-4 rounded-full font-bold text-base tracking-wide gold-btn">
              Let's Plan My Relocation Move
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="py-10 px-6 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: '#000' }}>
        <div className="font-bold tracking-widest text-xs mb-2" style={{ color: 'rgba(212,175,55,0.7)' }}>CONCIERGE RELOCATION SERVICES</div>
        <p className="text-base" style={{ color: '#fff', fontSize: '1.5rem' }}>The Dyson & Dyson Companies / Concierge Relocation Program     Free to Buyers     CA.DRE # 02303118</p>
      </footer>
    </div>
  );
}