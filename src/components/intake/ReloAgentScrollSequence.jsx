import React from 'react';
import {
  MessageCircle, MapPin, UserCheck, BarChart3, Truck, Zap,
  GraduationCap, HeartPulse, CheckCircle2,
} from 'lucide-react';

const GOLD = '#D4AF37';
const CREAM = '#ede0cc';
const DARK = '#1a1a1a';

const SERVICES = [
  { icon: MessageCircle,  title: 'AI Concierge Chat',     desc: 'Charlie is available 24/7 to answer every question' },
  { icon: MapPin,          title: 'Neighborhood Research', desc: 'Deep-dive analysis of neighborhoods matching your lifestyle' },
  { icon: UserCheck,       title: 'Agent Selection',      desc: 'We interview agents on your behalf' },
  { icon: BarChart3,       title: 'Home Search Strategy', desc: 'AI-powered property matching based on your criteria' },
  { icon: Truck,           title: 'Moving Coordination', desc: 'From packing to delivery — complete logistics' },
  { icon: Zap,             title: 'Utilities & Services',desc: 'Internet, electric, gas, water set up before arrival' },
  { icon: GraduationCap,   title: 'School Enrollment',    desc: 'District research, tours, and enrollment handled' },
  { icon: HeartPulse,      title: 'Healthcare Setup',     desc: 'Find top-rated doctors, dentists, specialists' },
];

const AGENT_POINTS = [
  'We profile your ideal agent before any names are shared',
  'Top 20 destination agents evaluated — production, DRE, personality',
  '3–5 personally vetted candidates presented for your review',
  'Your selection triggers immediate agent briefing & onboarding',
  'Zero cost to you as the buyer — always',
];

function Page({ children }) {
  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center px-6 md:px-14 py-20 text-center"
      style={{ background: CREAM, borderBottom: '1px solid rgba(212,175,55,0.12)' }}
    >
      {children}
    </section>
  );
}

function Label({ children }) {
  return (
    <p className="text-xs font-black tracking-[0.35em] uppercase mb-6" style={{ color: GOLD }}>{children}</p>
  );
}

function Title({ children, color = '#1a1a1a' }) {
  return (
    <h1 className="display-heading mb-3" style={{ fontSize: 'clamp(1.5rem, 3.75vw, 2.625rem)', letterSpacing: '0.12em', color }}>{children}</h1>
  );
}

function SubTitle({ children }) {
  return (
    <h2 className="display-heading mb-10" style={{ fontSize: 'clamp(1.19rem, 2.975vw, 2.04rem)', letterSpacing: '0.12em', color: GOLD }}>{children}</h2>
  );
}

export default function ReloAgentScrollSequence() {
  return (
    <div>
      {/* ── PAGE 1: THE DYSON PROMISE ── */}
      <Page>
        <Label>THE DYSON PROMISE</Label>
        <Title>WE DON'T SEND YOU A MAP.</Title>
        <h2 className="display-heading mb-10" style={{ fontSize: 'clamp(1.5rem, 3.75vw, 2.625rem)', letterSpacing: '0.12em', color: GOLD }}>
          WE MAKE THE JOURNEY WITH YOU.
        </h2>
        <div className="max-w-2xl space-y-5">
          <p className="text-base leading-relaxed" style={{ color: '#1a1a1a' }}>
            We are <strong>Relocation Managers</strong>. Not Agents. Not a listing service. We help families and
            professionals sell their current home and find their next one, anywhere in the country. Every step below
            is something Charlie and your Dyson team actively execute on your behalf, all the way through close of
            escrow and beyond.
          </p>
          <p className="text-base leading-relaxed" style={{ color: '#4a453e' }}>
            We intentionally work with a limited number of families at any given time. This isn't exclusivity — it's
            commitment. Real relocation management requires deep local focus, market expertise, timeline coordination,
            and relentless attention to detail. We're not scaling a service. We're delivering one.
          </p>
        </div>
      </Page>

      {/* ── PAGE 2: OUR SERVICES ── */}
      <Page>
        <Label>WHAT WE HANDLE</Label>
        <Title>OUR SERVICES</Title>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl w-full mt-6">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="rounded-2xl p-6 text-center" style={{ background: DARK }}>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'rgba(212,175,55,0.15)', border: `1px solid ${GOLD}40` }}
                >
                  <Icon className="w-6 h-6" style={{ color: GOLD }} />
                </div>
                <p className="text-sm font-bold mb-2" style={{ color: '#fff' }}>{s.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{s.desc}</p>
              </div>
            );
          })}
        </div>
      </Page>

      {/* ── PAGE 3: THE COMMITMENT / GEMINI SESSION ── */}
      <Page>
        <Label>THE COMMITMENT</Label>
        <Title>THE SCOPE IS EXTENSIVE</Title>
        <SubTitle>THAT'S WHY WE EXIST.</SubTitle>
        <p className="text-base mb-10" style={{ color: '#1a1a1a' }}>
          Seeing the full scope of what's ahead can feel overwhelming.
        </p>
        <div className="max-w-2xl rounded-3xl p-8 w-full" style={{ background: DARK }}>
          <p className="text-xs font-black tracking-[0.3em] mb-4 text-center" style={{ color: GOLD }}>
            AFTER YOU COMMIT — THE GEMINI SESSION
          </p>
          <p className="text-base leading-relaxed mb-4 text-white">
            Once you've confirmed your contact information, we set up a private three-way live session — you, Google
            Gemini, and Senior Staff. This is a real conversation where we build your complete relocation profile
            together, in real time.
          </p>
          <p className="text-base leading-relaxed text-white">
            This session is <strong style={{ color: GOLD }}>by invitation only</strong> — we're selective about who we
            work with. No cost to you, ever.
          </p>
        </div>
      </Page>

      {/* ── PAGE 4: EXPERIENCED EXPERTS, POWERED BY AI ── */}
      <Page>
        <Label>HUMAN + AI</Label>
        <Title>EXPERIENCED EXPERTS,</Title>
        <h2 className="display-heading mb-12" style={{ fontSize: 'clamp(1.5rem, 3.75vw, 2.625rem)', letterSpacing: '0.12em', color: GOLD }}>
          POWERED BY AI.
        </h2>
        <div className="max-w-2xl space-y-6">
          <p className="text-lg leading-relaxed" style={{ color: '#1a1a1a' }}>
            AI handles data aggregation, comp analysis, document generation, and 24/7 availability. Real estate
            experts position you to make wise judgment calls, approve major decisions, and guide you through your
            entire relocation.
          </p>
          <p className="text-xl font-bold" style={{ color: GOLD }}>
            And it costs you absolutely nothing — we are funded by the selected Brokers and Agents.
          </p>
        </div>
      </Page>

      {/* ── PAGE 5: AGENT SELECTION ── */}
      <Page>
        <Label>AGENT SELECTION</Label>
        <Title>YOUR AGENT. YOUR CHOICE.</Title>
        <SubTitle>ZERO GUESSWORK.</SubTitle>
        <p className="text-base mb-8 max-w-xl" style={{ color: '#1a1a1a' }}>
          Most people find an agent through Zillow, a yard sign, or a friend — with no idea if they're any good. We
          eliminate that entirely.
        </p>
        <div className="max-w-xl w-full space-y-3 text-left">
          {AGENT_POINTS.map((item, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 rounded-xl" style={{ background: DARK }}>
              <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: GOLD }} />
              <span className="text-sm" style={{ color: '#fff' }}>{item}</span>
            </div>
          ))}
        </div>
      </Page>

      {/* ── PAGE 6: READY FOR YOUR FRESH START ── */}
      <Page>
        <Label>BEGIN YOUR JOURNEY</Label>
        <Title>READY FOR YOUR</Title>
        <h2 className="display-heading mb-12" style={{ fontSize: 'clamp(1.5rem, 3.75vw, 2.625rem)', letterSpacing: '0.12em', color: GOLD }}>
          FRESH START?
        </h2>
        <div className="max-w-xl space-y-8">
          <p className="text-lg leading-relaxed" style={{ color: '#1a1a1a' }}>
            Talk to Charlie right now. Share where you're moving and we'll take it from there — your relocation
            manager, your Gemini session, your plan. No hidden fees. Always free.
          </p>
          <a
            href="#about-you"
            className="inline-block px-10 py-5 rounded-full font-black text-lg transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #e8c84a, #D4AF37)',
              color: '#000',
              boxShadow: '0 4px 14px rgba(212,175,55,0.3)',
              textDecoration: 'none',
            }}
          >
            Let's Plan My Relocation Move
          </a>
        </div>
      </Page>
    </div>
  );
}