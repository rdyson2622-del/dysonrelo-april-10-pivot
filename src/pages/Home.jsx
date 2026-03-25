import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, MessageCircle, Shield, MapPin, CheckCircle2,
  UserCheck, Building2, Truck, Zap, GraduationCap, HeartPulse, Sparkles
} from 'lucide-react';
import CharlieTopHat from '../components/brand/CharlieTopHat';
import { CORPORATE_PROFILE } from '../lib/corporateProfile';
const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";

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

      {/* Nav */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-14 py-4"
        style={{ background: '#000', borderBottom: '1px solid rgba(212,175,55,0.12)' }}
      >
        <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-12 w-auto" />
        <div className="flex items-center gap-2">
          <Link to="/Dashboard">
            <button className="text-sm px-4 py-2 rounded-full transition-all hover:bg-white/5" style={{ color: '#fff', fontWeight: 500 }}>
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

      {/* Hero — full viewport landing screen */}
      <section className="relative overflow-hidden" style={{ minHeight: '100vh', background: '#808080' }}>
        {/* Deep background radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(212,175,55,0.07) 0%, transparent 65%)',
        }} />
        {/* Top shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.5) 50%, transparent 100%)' }} />

        {/* Portrait: centered column. Landscape/desktop: two columns side by side */}
        <div className="relative flex flex-col md:flex-row items-center md:items-center justify-center gap-12 px-6 md:px-14 w-full h-full" style={{ minHeight: '100vh', paddingTop: '5vh', paddingBottom: '5vh' }}>

          {/* LEFT — hero slide */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center md:items-center justify-center text-center w-full md:w-auto md:flex-1 py-16 md:py-0"
          >
            <div className="mb-8 flex justify-center">
              <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-36 w-auto" />
            </div>
            <h1 className="display-heading" style={{ marginBottom: '1.5rem', display: 'block', width: '100%', textAlign: 'center' }}>
              <span style={{ display: 'block', textAlign: 'center', width: '100%', color: '#D4AF37', fontSize: 'clamp(2rem, 5vw, 4.5rem)', letterSpacing: '0.28em', lineHeight: 1.15 }}>CONCIERGE</span>
              <span style={{ display: 'block', textAlign: 'center', width: '100%', color: '#000', textTransform: 'none', fontSize: 'clamp(1.8rem, 4.5vw, 4rem)', letterSpacing: '0.18em', lineHeight: 1.15, whiteSpace: 'nowrap' }}>Real Estate</span>
            </h1>
            <p className="text-base leading-relaxed mb-2" style={{ color: '#fff', fontWeight: 400 }}>
              Meet Charlie — your AI Relocation Manager backed by The Dyson & Dyson Companies and 54+ years of real estate expertise. Whether you're planning to move, have already listed, or are searching for your new home — we don't sell. We manage your entire relocation.
            </p>
            <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Experienced relocation experts powered by AI. We handle data work so you get real insight. You get Charlie for 24/7 answers AND a real person who knows your market inside and out. We work with a limited number of clients at any given time because relocation management demands intensive focus — on your specific market, your lifestyle, your timeline. We're not racing toward a sale. We're focused on getting you home.
            </p>
            <p className="text-base font-semibold mb-10" style={{ color: '#D4AF37' }}>
              ✦ Completely free to you as the buyer.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/Chat">
                <button className="gold-btn px-7 py-3 rounded-full text-sm font-bold tracking-wide flex items-center gap-2">
                  Talk to Charlie <MessageCircle className="w-4 h-4" />
                </button>
              </Link>
              <Link to="/Dashboard">
                <button className="px-7 py-3 rounded-full text-sm font-semibold flex items-center gap-2 transition-all hover:bg-white/5"
                  style={{ background: '#000', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  My Dashboard <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
            {/* Scroll cue — portrait only */}
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }} className="mt-12 md:hidden flex flex-col items-center gap-1" style={{ color: 'rgba(212,175,55,0.5)' }}>
              <span className="text-xs tracking-widest">SCROLL</span>
              <ArrowRight className="w-4 h-4 rotate-90" />
            </motion.div>
          </motion.div>

          {/* RIGHT — Charlie card (landscape/desktop only inline; portrait shows below as separate section) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:flex relative w-full md:w-auto md:flex-1 justify-center py-16 md:py-0"
          >
            <div className="absolute inset-0 rounded-3xl blur-3xl scale-110 pointer-events-none"
              style={{ background: 'rgba(212,175,55,0.12)' }} />
            <div className="relative rounded-3xl p-7 w-full max-w-sm" style={{ background: 'linear-gradient(135deg, #4a4a4a 0%, #2d2d2d 100%)', border: '2px solid #D4AF37' }}>
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
                  <Link to="/Chat" className="block mt-5">
                  <button className="w-full py-3 rounded-2xl text-sm font-bold tracking-wider gold-btn">
                  START FREE CONSULTATION
                  </button>
                  </Link>
                  </div>
                  </motion.div>

                  </div>
                  </section>

                  {/* Charlie Card Section — portrait only (below hero) */}
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
            <Link to="/Chat" className="block mt-5">
              <button className="w-full py-3 rounded-2xl text-sm font-bold tracking-wider gold-btn">
                START FREE CONSULTATION
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* WE MOVE WITH YOU — Journey Banner (RIGHT after hero) */}
      <section className="py-16 px-6 md:px-14" style={{ background: '#000', borderTop: '1px solid rgba(212,175,55,0.15)', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
        <div className="max-w-5xl mx-auto text-center mb-12">
          <p className="text-xs font-bold tracking-[0.3em] mb-3" style={{ color: GOLD }}>THE DYSON PROMISE</p>
          <h2 className="display-heading mb-4" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)', lineHeight: 1.2, letterSpacing: '0.22em', color: '#fff' }}>
            We don't send you a map.<br />
            <span className="gold-text-gradient">We make the journey with you.</span>
          </h2>
          <p className="text-base max-w-2xl mx-auto mb-4" style={{ color: '#e5e5e5' }}>
            We are <strong style={{ color: GOLD }}>Relocation Managers</strong> — not agents, not a listing service, not a broker. We help families and professionals sell their current home and find their next one, anywhere in the country. Every step below is something Charlie and your Dyson team actively execute on your behalf, all the way through closing.
          </p>
          <p className="text-sm max-w-2xl mx-auto" style={{ color: 'rgba(229,229,229,0.8)' }}>
            <em>We intentionally work with a limited number of families at any given time. This isn't exclusivity — it's commitment. Real relocation management requires deep local focus, market expertise, timeline coordination, and relentless attention to detail. We're not scaling a service. We're delivering one.</em>
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
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

        <div className="max-w-3xl mx-auto text-center">
          <p className="text-base font-semibold mb-4" style={{ color: '#e5e5e5' }}>
            Seeing the full scope of what's ahead can feel overwhelming.<br />
            <span style={{ color: GOLD }}>That's exactly the point — and exactly why we exist.</span>
          </p>

          {/* Gemini 3-Way Session callout */}
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

          <Link to="/Chat">
            <button className="gold-btn px-8 py-3 rounded-full text-sm font-bold tracking-wide flex items-center gap-2 mx-auto">
              Start with Charlie — Get Your Invitation <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>

      {/* V2V Agent Recruitment Card */}
      <section className="px-6 md:px-14 py-10" style={{ background: '#808080' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative rounded-3xl px-6 py-5 frosted-dark flex flex-col md:flex-row md:items-center gap-4 w-full" style={{ background: '#111', border: '1px solid #D4AF37' }}>
              <div className="flex items-center gap-3 shrink-0">
                <img src={DYSON_LOGO} alt="D&D" className="h-10 w-auto" />
                <p className="text-xs font-bold tracking-widest" style={{ color: GOLD }}>VOICE-TO-VOICE</p>
              </div>
              <div className="flex-1">
                <h3 className="serif-heading text-lg mb-1 leading-tight" style={{ color: '#fff' }}>The 1927 Parallel</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#fff' }}>
                  Discover how AI is transforming real estate the way talkies transformed cinema. We all have an opportunity to expand our knowledge base and personal and business abilities in ways never dreamed.
                </p>
              </div>
              <Link to="/Explainers" className="inline-flex items-center gap-2 text-xs font-bold shrink-0" style={{ color: GOLD }}>
                EXPLORE <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bob Dyson Leadership Section */}
      <section className="py-20 px-6 md:px-14" style={{ background: '#000', borderTop: '1px solid rgba(212,175,55,0.15)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-[0.3em] mb-3" style={{ color: GOLD }}>BACKED BY EXPERIENCE</p>
            <h2 className="display-heading mb-4" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)', lineHeight: 1.2, letterSpacing: '0.22em', color: '#fff' }}>
              Bob Dyson:<br />
              <span style={{ color: GOLD }}>54+ Years, 1000+ Properties, 1600+ Office Network</span>
            </h2>
          </div>
          
          <div className="rounded-2xl p-8 mb-8" style={{ background: '#3a3a3a', border: '1px solid rgba(212,175,55,0.25)' }}>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#fff' }}>
              Bob Dyson began as a corporate jet pilot and Chief Pilot for the Governor of Oklahoma — at age 20. He strategically acquired over 1,000 properties across multiple states while building Red Carpet Corporation of America from a 500-office network to 1,600+ offices with 45,000 agents across 42 states. After selling the company, he founded Dyson & Dyson and established Dyson News Network (DNN), delivering real estate news to millions via Yahoo Mail and Yahoo Finance. Today, he leads Dyson & Dyson Concierge Relocation Services — combining 54+ years of hands-on real estate expertise along with cutting-edge AI to serve families nationwide.
            </p>
            <p className="text-sm italic leading-relaxed" style={{ color: '#D4AF37', borderLeft: '3px solid #D4AF37', paddingLeft: '1rem' }}>
              "{CORPORATE_PROFILE.bobsDedication}"
            </p>
          </div>

          <p className="text-center mb-8" style={{ color: '#fff', fontSize: '1.5rem' }}>
            <strong style={{ color: GOLD }}>At The Dyson & Dyson Companies:</strong> We don't sell real estate. We manage your entire move.
          </p>
        </div>
      </section>

      {/* Divider banner */}
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
            AI handles data aggregation, comp analysis, document generation, and 24/7 availability. Select Real estate experts position you to make the judgment calls, approve major decisions, and guide you through your entire relocation.{' '}
            <span style={{ color: GOLD, fontWeight: 600 }}>And it costs you absolutely nothing since we are funded by the selected Brokers and&nbsp;Agents.</span>
          </p>
        </div>
      </section>

      {/* Intelligent Orchestration */}
      <section className="max-w-7xl mx-auto px-6 md:px-14 py-24">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ background: 'rgba(212,175,55,0.2)', color: GOLD }}>⚙️</div>
            <p className="text-xs font-bold tracking-[0.3em]" style={{ color: GOLD }}>INTELLIGENT ORCHESTRATION</p>
          </div>
          <h2 className="display-heading mb-4" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 3rem)', lineHeight: 1.25, letterSpacing: '0.22em', color: '#fff' }}>
            Each assistant specializes in one domain
          </h2>
          <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: '#fff' }}>
            but they communicate with each other — passing insights, triggering actions, and optimizing outcomes together.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { icon: '💬', name: 'Charlie', role: 'Portal Concierge', color: '#B8860B' },
            { icon: '🎯', name: 'Scout', role: 'Lead Scoring', color: '#4169E1' },
            { icon: '👤', name: 'Nexus', role: 'Network Matcher', color: '#FF8C00' },
            { icon: '📈', name: 'Pulse', role: 'Market Intelligence', color: '#20B820' },
            { icon: '🛡️', name: 'Guardian', role: 'Transaction Oversight', color: '#9932CC' },
            { icon: '⏰', name: 'Relay', role: 'Follow-Up Automation', color: '#DC143C' },
            { icon: '✍️', name: 'Composer', role: 'Content Generator', color: '#20B2AA' },
            { icon: '📢', name: 'Signal', role: 'Notification Engine', color: '#FF6347' },
            { icon: '📊', name: 'Advisor', role: 'Escrower Simulator', color: '#20B820' },
            { icon: '🏠', name: 'Keeper', role: 'Homeowner Assistant', color: '#1E90FF' },
            { icon: '🚀', name: 'Bridge', role: 'Referral Coordinator', color: '#FF1493' },
            { icon: '👁️', name: 'Lens', role: 'Profile Optimizer', color: '#9932CC' },
            { icon: '📚', name: 'Curator', role: 'Education Pathways', color: '#228B22' },
            { icon: '🔧', name: 'Dispatch', role: 'Service Coordinator', color: '#DC143C' },
            { icon: '⚡', name: 'Harvest', role: 'Credit Engine', color: '#FFD700' },
            { icon: '🛡️', name: 'Anchor', role: 'Compliance Monitor', color: '#808080' },
            { icon: '🔍', name: 'Radar', role: 'Opportunity Finder', color: '#00BFFF' },
            { icon: '🎼', name: 'Conductor', role: 'Workflow Orchestrator', color: '#FF1493' },
            { icon: '📰', name: 'Herald', role: 'News & Distribution', color: '#20B820' },
            { icon: '📧', name: 'Emissary', role: 'Email Intelligence', color: '#FFB6C1' },
            { icon: '🎯', name: 'Sentinel', role: 'Admin Intelligence', color: '#DAA520' },
          ].map((agent, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.5 }}
              className="flex flex-col items-center p-4 rounded-xl transition-all hover:scale-105"
              style={{ background: '#000', border: `1px solid ${GOLD}` }}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-2" style={{ background: `${agent.color}22`, border: `1px solid ${agent.color}44` }}>
                {agent.icon}
              </div>
              <p className="text-xs font-bold text-center" style={{ color: '#fff' }}>{agent.name}</p>
              <p className="text-xs text-center mt-1" style={{ color: '#fff' }}>{agent.role}</p>
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
          style={{ border: '1px solid #D4AF37', background: '#000' }}
        >
          {/* Subtle radial bg */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse 60% 80% at 85% 50%, rgba(212,175,55,0.07) 0%, transparent 65%)',
          }} />
          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] mb-4" style={{ color: GOLD }}>THE DYSON AGENT SELECTION PROCESS</p>
              <h3 className="display-heading mb-5" style={{ fontSize: 'clamp(1.4rem, 3vw, 2.4rem)', lineHeight: 1.25, letterSpacing: '0.22em', color: '#fff' }}>
                Your agent. Your choice.<br /><span className="gold-text-gradient">Zero guesswork.</span>
              </h3>
              <p className="leading-relaxed mb-5" style={{ color: '#e5e5e5' }}>
                Most people find an agent through Zillow, a yard sign, or a friend of a friend — with no idea whether they're any good. We eliminate that entirely.
              </p>
              <p className="leading-relaxed mb-6" style={{ color: '#e5e5e5' }}>
                Before we show you a single name, Your Dyson Management Team interviews you on the type of agent you'd work best with — communication style, personality, pace. Then we pull from the <strong style={{ color: '#fff' }}>top 20 agents in your destination market</strong>, review their production records, check their DRE standing, and personally vet each one against Bob Dyson's 40+ years of market expertise. From that pool, we present you with <strong style={{ color: '#fff' }}>3 to 5 curated candidates</strong> — never more, never less.
              </p>
              <p className="leading-relaxed mb-7" style={{ color: '#e5e5e5' }}>
                You choose the one who feels right. The moment you do, <strong style={{ color: '#fff' }}>we have boots on the ground</strong> — a dedicated expert who knows your market, knows your needs, and is accountable to us. No "I love me" agents chasing their next deal. No cold handoffs. Just a professional who's been briefed, vetted, and ready to go to work for you.
              </p>
              <ul className="space-y-2.5 mb-9 max-w-2xl">
                {[
                  'The Dyson Relo Team profiles your ideal agent before any names are shared',
                  'Top 20 destination agents evaluated — production, DRE rating, personality',
                  '3–5 personally vetted candidates presented for your review',
                  'Your selection triggers immediate agent briefing & onboarding',
                  'Zero cost to you as the buyer — always'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm" style={{ color: '#fff' }}>
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
          <h2 className="display-heading mb-4" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 3rem)', lineHeight: 1.25, letterSpacing: '0.22em', color: '#fff' }}>
            Ready for your{' '}
            <span className="gold-text-gradient">fresh start?</span>
          </h2>
          <p className="text-base mb-10 max-w-md mx-auto" style={{ color: '#fff' }}>
            Talk to Charlie right now. Share where you're moving and we'll take it from there — your relocation manager, your Gemini session, your plan. No hidden fees. Always free.
          </p>
          <Link to="/Chat">
            <button className="px-10 py-4 rounded-full font-bold text-base tracking-wide gold-btn">
              Talk to Charlie — It's Free
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: '#000' }}>
        <div className="font-bold tracking-widest text-xs mb-2" style={{ color: 'rgba(212,175,55,0.7)' }}>CONCIERGE RELOCATION SERVICES</div>
        <p className="text-sm" style={{ color: '#fff' }}>The Dyson & Dyson Companies / Concierge Relocation Program     Free to Buyers, Paid at Close     CA.DRE # 02303118</p>
      </footer>
    </div>
  );
}