import React, { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Building2, DollarSign, ShieldCheck, Handshake, ArrowRight, MessageCircle, Newspaper, Play } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PortalSubscribeForm from '@/components/portal/PortalSubscribeForm';
import { getFlow } from '@/lib/departmentWorkflows';
import { useAnimatedDemoStatuses } from '@/hooks/useAnimatedDemoStatuses';
import FlowRoadmapLine from '@/components/workflow/FlowRoadmapLine';
import IssueRequestSolutionMap from '@/components/roadmap/IssueRequestSolutionMap';

const GOLD = '#D4AF37';

const PILLARS = [
  {
    faqIndex: 0,
    icon: DollarSign,
    title: 'Zero Management Fees',
    desc: "Traditional corporate relocation companies charge management fees, referral markups, and administrative overhead — thousands per transferred employee. We charge your company nothing. We share in the commission already paid to the buying or selling agent, money built into every transaction anyway.",
  },
  {
    faqIndex: 1,
    icon: ShieldCheck,
    title: 'Vetted Pros — Not Aunt Suzie',
    desc: "Every agent in our national and international network is production-vetted, license-verified, and matched to your employee's specific move. Your transferee lands with a proven professional on the receiving end — not a relative who assumes she's getting the business because she holds a license.",
  },
  {
    faqIndex: 2,
    icon: Handshake,
    title: 'No Awkward Decisions',
    desc: "When your employee knows three or four agents personally, our selection process makes the decision for them. No awkward calls, no hurt feelings, no favors owed. The system chose — not your employee. Those uncomfortable situations simply disappear.",
  },
];

function clipReady(clip) {
  if (!clip) return false;
  const charlieOk = clip.charlieStatus === 'completed' && clip.charlieVideoUrl;
  const bobOk = clip.bobStatus === 'completed' && clip.bobVideoUrl;
  const combinedOk = clip.combinedStatus === 'completed' && clip.combinedVideoUrl;
  return !!(combinedOk || charlieOk || bobOk);
}

function segmentsFor(clip) {
  if (!clip) return [];
  if (clip.combinedStatus === 'completed' && clip.combinedVideoUrl) {
    return [{ src: clip.combinedVideoUrl, speaker: 'guide' }];
  }
  const segs = [];
  if (clip.charlieStatus === 'completed' && clip.charlieVideoUrl) {
    segs.push({ src: clip.charlieVideoUrl, speaker: 'charlie' });
  }
  if (clip.bobStatus === 'completed' && clip.bobVideoUrl) {
    segs.push({ src: clip.bobVideoUrl, speaker: 'bob' });
  }
  return segs;
}

/** Upper-left speaking avatar player for one completed clip (Charlie then Bob). */
function SectionAvatar({ clip, label }) {
  const segs = useMemo(() => segmentsFor(clip), [clip]);
  const videoRef = useRef(null);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);

  if (!segs.length) return null;

  const src = segs[Math.min(idx, segs.length - 1)]?.src;

  const onEnded = () => {
    if (idx < segs.length - 1) {
      setIdx((i) => i + 1);
      setPlaying(true);
      setTimeout(() => videoRef.current?.play?.().catch(() => {}), 40);
    } else {
      setPlaying(false);
    }
  };

  const toggle = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <div
      className="relative rounded-xl overflow-hidden shrink-0"
      style={{
        width: 168,
        background: '#0d0d0d',
        border: `2px solid ${GOLD}`,
        boxShadow: '0 12px 32px rgba(0,0,0,0.45)',
      }}
    >
      <div
        className="px-2 py-1 text-[9px] font-black tracking-[0.15em] uppercase text-center"
        style={{ background: '#1a1a1a', color: GOLD, borderBottom: '1px solid rgba(212,175,55,0.25)' }}
      >
        {label}
      </div>
      <div className="relative" style={{ height: 190, background: '#000' }}>
        <video
          key={src}
          ref={videoRef}
          src={src}
          playsInline
          preload="metadata"
          onEnded={onEnded}
          onClick={toggle}
          className="w-full h-full object-cover cursor-pointer"
        />
        {!playing && (
          <button
            type="button"
            onClick={toggle}
            aria-label="Play"
            className="absolute inset-0 flex items-center justify-center hover:bg-black/20"
          >
            <span
              className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.65)', border: `2px solid ${GOLD}` }}
            >
              <Play className="w-5 h-5 ml-0.5" style={{ color: GOLD }} fill={GOLD} />
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

export default function CorporateRelo() {
  const relocationFlow = getFlow('operations');
  const { statuses: relocationStatuses, activeStageId: relocationActive } = useAnimatedDemoStatuses(
    relocationFlow?.stages
  );

  const { data: clips = [] } = useQuery({
    queryKey: ['corporateReloClipsPublic'],
    queryFn: () => base44.entities.CorporateReloClip.list(),
  });

  const intro = clips.find((c) => c.kind === 'intro' && clipReady(c));
  const qas = clips
    .filter((c) => c.kind === 'qa' && clipReady(c))
    .sort((a, b) => (a.faqIndex ?? 0) - (b.faqIndex ?? 0));

  const qaByIndex = (i) => qas.find((c) => (c.faqIndex ?? 0) === i) || qas[i];

  return (
    <div className="min-h-screen" style={{ background: '#0d0d0d', color: '#fff' }}>
      {/* ── Hero + Intro avatar (upper left) ── */}
      <section
        className="px-8 md:px-16 pt-16 pb-14"
        style={{ background: '#ede0cc', borderBottom: '1px solid rgba(212,175,55,0.12)' }}
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start gap-8">
          {intro && <SectionAvatar clip={intro} label="Intro · Charlie / Bob" />}
          <div className={`flex-1 text-center ${intro ? 'md:text-left' : ''}`}>
            <div
              className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full text-xs font-black tracking-[0.3em] uppercase"
              style={{ background: '#000', border: '1px solid rgba(212,175,55,0.3)', color: GOLD }}
            >
              <Building2 className="w-3.5 h-3.5" /> For HR Managers &amp; Employers
            </div>
            <h1
              className="display-heading mb-3"
              style={{
                fontSize: 'clamp(1.65rem, 4.5vw, 3rem)',
                lineHeight: 1.05,
                letterSpacing: '0.12em',
                color: '#1a1a1a',
              }}
            >
              CORPORATE RELOCATION
            </h1>
            <h2
              className="display-heading mb-8"
              style={{
                fontSize: 'clamp(1.2rem, 3vw, 2.1rem)',
                letterSpacing: '0.12em',
                color: GOLD,
              }}
            >
              WITH FULL REAL TIME TRANSPARENCY TO YOU AND YOUR EMPLOYEE BUT WITHOUT THE MANAGEMENT FEES.
            </h2>
          </div>
        </div>

        <div
          className="w-full max-w-5xl mx-auto mt-6 mb-2 rounded-2xl p-5"
          style={{ background: '#1a1a1a', border: `1px solid ${GOLD}40` }}
        >
          <p
            className="text-[10px] font-black tracking-[0.3em] uppercase text-center mb-3 animate-pulse"
            style={{ color: GOLD }}
          >
            ● Live Roadmap — The Relocation Process
          </p>
          <FlowRoadmapLine
            stages={relocationFlow?.stages || []}
            stageStatuses={relocationStatuses}
            color={GOLD}
            activeStageId={relocationActive}
            onSelect={() => {}}
          />
        </div>

        <p
          className="leading-relaxed max-w-4xl mx-auto mt-10 text-center"
          style={{ color: '#1a1a1a', fontSize: '1.75rem' }}
        >
          We save your company the relocation management costs charged by traditional corporate relocation companies.
          Instead, we share in the commission offered to the buying or selling agent in our national and international
          networks — so your people land well, and your budget stays intact.
        </p>

        <div className="w-full max-w-3xl mx-auto mt-10">
          <IssueRequestSolutionMap context="corporate_relo" />
        </div>
      </section>

      {/* ── Three Pillars — each with matching Q clip upper-left in the card ── */}
      <section className="px-8 md:px-16 py-16" style={{ background: '#ede0cc' }}>
        <div className="grid grid-cols-1 gap-6 max-w-5xl mx-auto">
          {PILLARS.map((p) => {
            const clip = qaByIndex(p.faqIndex);
            return (
              <div
                key={p.title}
                className="p-6 rounded-2xl flex flex-col sm:flex-row gap-5 items-start"
                style={{ background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.25)' }}
              >
                {clip && (
                  <SectionAvatar
                    clip={clip}
                    label={`Q${p.faqIndex + 1} · ${clip.question ? 'Charlie / Bob' : 'Guide'}`}
                  />
                )}
                <div className="flex-1 flex flex-col gap-3 min-w-0">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(212,175,55,0.2)', border: '1px solid rgba(212,175,55,0.3)' }}
                  >
                    <p.icon className="w-5 h-5" style={{ color: GOLD }} />
                  </div>
                  <p className="font-bold text-base text-white">{p.title}</p>
                  {clip?.question && (
                    <p className="text-xs font-semibold" style={{ color: GOLD }}>
                      {clip.question}
                    </p>
                  )}
                  <p className="text-sm leading-relaxed text-white">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-8 md:px-16 py-20 text-center" style={{ background: '#0d0d0d' }}>
        <p className="text-xs font-black tracking-[0.35em] uppercase mb-4" style={{ color: GOLD }}>
          NEXT TRANSFEREE?
        </p>
        <h2
          className="display-heading mb-8"
          style={{ fontSize: 'clamp(1.3rem, 3vw, 2rem)', letterSpacing: '0.12em', color: '#fff' }}
        >
          LET'S TALK ABOUT YOUR PEOPLE
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-black text-base transition-all hover:scale-105"
            style={{
              background: `linear-gradient(135deg, #e8c84a, ${GOLD})`,
              color: '#000',
              boxShadow: '0 4px 14px rgba(212,175,55,0.3)',
            }}
          >
            <MessageCircle className="w-5 h-5" /> Talk to Charlie Now
          </Link>
          <Link
            to="/relocation-intake"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base transition-all hover:scale-105"
            style={{ border: `1px solid ${GOLD}`, color: GOLD }}
          >
            How We Manage a Move <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/dnn-news"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base transition-all hover:scale-105"
            style={{ border: `1px solid ${GOLD}`, color: GOLD }}
          >
            <Newspaper className="w-4 h-4" /> Real Estate News (Free)
          </Link>
        </div>
        <div className="mt-12 max-w-2xl mx-auto text-left">
          <PortalSubscribeForm
            portalName="Corporate Relo / HR Portal"
            source="Corporate HR Portal"
            roleKey="hr"
            dest="/corporate-relo"
          />
        </div>
        <p className="text-sm mt-10" style={{ color: '#8a8a8a' }}>
          The Dyson &amp; Dyson Companies, Inc. · California DRE #02303118 · (858) 353-1200
        </p>
      </section>
      {/* CharliePagePresenter upper-right bubble removed — section avatars are the hero path */}
    </div>
  );
}