import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Building2, DollarSign, ShieldCheck, Handshake, ArrowRight, MessageCircle, Newspaper, Play } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PortalSubscribeForm from '@/components/portal/PortalSubscribeForm';
import IssueRequestSolutionMap from '@/components/roadmap/IssueRequestSolutionMap';
import StudioHeroBanner from '@/components/dnn/StudioHeroBanner';
import FindAProWidget from '@/components/portal/FindAProWidget';
import PropertyPlatformSearch from '@/components/portal/PropertyPlatformSearch';
import SolutionMapEntry from './SolutionMapEntry';
import ClientStory from '@/components/landing/ClientStory';

const GOLD = '#D4AF37';
const DYSON_LOGO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/aa2b5389f_Screenshot2026-08-01at41912PM.png";

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

// NOTE: This page's content is a standalone HR/Corporate portal template — editing
// it does NOT affect the Client Portal (Home.jsx) or any other portal. Section order
// per 2026-09-04 request: Corporate Relocation hero FIRST, "news landing" front door
// (StudioHeroBanner + SolutionMapEntry) moved to the BOTTOM as its own standalone block.
export default function CorporateRelo() {
  const { data: clips = [] } = useQuery({
    queryKey: ['corporateReloClipsPublic'],
    queryFn: () => base44.entities.CorporateReloClip.list(),
  });

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const headingRef = useRef(null);
  const videoRef = useRef(null);
  const [headingVisible, setHeadingVisible] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeadingVisible(true); },
      { threshold: 0.3 }
    );
    if (headingRef.current) observer.observe(headingRef.current);
    return () => observer.disconnect();
  }, []);

  const intro = clips.find((c) => c.kind === 'intro' && clipReady(c));
  const qas = clips
    .filter((c) => c.kind === 'qa' && clipReady(c))
    .sort((a, b) => (a.faqIndex ?? 0) - (b.faqIndex ?? 0));

  const qaByIndex = (i) => qas.find((c) => (c.faqIndex ?? 0) === i) || qas[i];

  return (
    <div className="min-h-screen" style={{ background: '#0d0d0d', color: '#fff' }}>
      {/* ── FIRST PAGE: Corporate Relocation hero ── */}
      <section
        className="px-8 md:px-16 pt-16 pb-14"
        style={{ background: '#ede0cc', borderBottom: '1px solid rgba(212,175,55,0.12)' }}
      >
        {intro && scrolled && (
          <div className="fixed z-40 hidden md:block" style={{ top: '160px', left: '311px', transform: 'translateX(-50%)' }}>
            <SectionAvatar clip={intro} label="Intro · Charlie / Bob" />
          </div>
        )}
        <div className="max-w-5xl mx-auto">
          <div className="flex-1 text-center">
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

        <p
          className="leading-relaxed max-w-4xl mx-auto mt-10 text-center"
          style={{ color: '#1a1a1a', fontSize: '1.75rem' }}
        >
          We save your company the relocation management costs charged by traditional corporate relocation companies.
          Instead, we share in the commission offered to the buying or selling agent in our national and international
          networks — so your people land well, and your budget stays intact.
        </p>

        <div className="w-full max-w-3xl mx-auto mt-10 rounded-2xl p-6" style={{ background: '#1a1a1a', border: `1px solid ${GOLD}40` }}>
          <FindAProWidget
            label="Employee Relocation Support Utilities"
            subtitle="Your transferee needs a mover, inspector, or contractor right now? These national platforms are ready today."
          />
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

      {/* ── CLIENT STORIES ── */}
      <section className="px-8 md:px-16 py-16" style={{ background: '#ede0cc' }}>
        <div className="w-full max-w-5xl mx-auto text-left">
          <div
            ref={headingRef}
            className="mb-8"
            style={{
              opacity: headingVisible ? 1 : 0,
              transform: headingVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.9s ease, transform 0.9s ease',
            }}
          >
            <p className="display-heading mb-2" style={{ fontSize: 'clamp(1.3rem, 3.9vw, 1.82rem)', letterSpacing: '0.2em', color: '#1a1a1a' }}>
              REVIEW CLIENT STORIES &amp; SOLUTIONS
            </p>
            <p style={{ color: GOLD, fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '2.29rem', animation: 'gentlePulse 3s ease-in-out infinite' }}>
              Tap any story to read or watch the full case study.
            </p>
          </div>

          <ClientStory
            label="4-State Relocation · Arizona → Arkansas"
            headline="The 4-State Farm Relocation: How We Moved a Family (and 13 Chickens) Without a Hitch."
          >
            <div className="rounded-2xl overflow-hidden mb-8" style={{ background: '#000', border: '1px solid rgba(212,175,55,0.3)' }}>
              <p className="text-xs font-black tracking-[0.25em] uppercase mb-3 px-4 pt-4" style={{ color: GOLD }}>▶ WATCH THE WINDEANS' STORY</p>
              <div className="relative" style={{ aspectRatio: '16/9' }}>
                <video
                  ref={videoRef}
                  src="https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/bf489a37c_a_true_story_of_a_cross_country_real_estate_move.mp4"
                  controls
                  playsInline
                  preload="none"
                  className="w-full block h-full"
                  onPlay={() => setStarted(true)}
                />
                {!started && (
                  <button
                    onClick={() => { setStarted(true); videoRef.current?.play(); }}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                    style={{ background: '#000' }}
                  >
                    <img src={DYSON_LOGO} alt="Dyson & Dyson" style={{ height: '180px', width: 'auto' }} />
                    <span className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: GOLD }}>
                      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#000" style={{ marginLeft: 3 }}><path d="M8 5v14l11-7z" /></svg>
                    </span>
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs font-black tracking-[0.25em] uppercase mb-2" style={{ color: GOLD }}>THE SITUATION</p>
            <p className="text-white leading-relaxed mb-3" style={{ fontFamily: 'Georgia, serif', fontSize: '0.97rem' }}>
              Moving across town is stressful. Now imagine moving across four states, coordinating the sale of your current home, the purchase of a new one, managing two moving trucks, and transporting a cat and 13 chickens.
            </p>
            <p className="text-white leading-relaxed mb-8" style={{ fontFamily: 'Georgia, serif', fontSize: '0.97rem' }}>
              That was the situation John and Windean faced when relocating from Apache Junction, Arizona, to Jonesboro, Arkansas. If the timing on either the sale or the purchase fell through, they wouldn't just be out of a home — they'd be stranded on the highway with a barnyard in the backseat.
            </p>
            <div className="h-px w-12 mb-8" style={{ background: `rgba(212,175,55,0.5)` }} />

            <p className="text-xs font-black tracking-[0.25em] uppercase mb-2" style={{ color: GOLD }}>THE ECOSYSTEM SOLVE</p>
            <p className="text-white leading-relaxed mb-3" style={{ fontFamily: 'Georgia, serif', fontSize: '0.97rem' }}>
              At the Dyson Referral Group, we know that a cross-country move of this magnitude requires more than just luck — it requires an Ecosystem.
            </p>
            <p className="text-white leading-relaxed mb-8" style={{ fontFamily: 'Georgia, serif', fontSize: '0.97rem' }}>
              We didn't just hand John and Windean a phone number. Bob Dyson personally vetted and selected the absolute top-tier real estate and escrow teams in both states. As Relocation Managers, the Dyson team stayed embedded in every text and email thread between the brokers, the title companies, and the clients from day one — monitoring progress, ensuring total transparency, and managing the moving parts so the Strattons could focus on the drive.
            </p>
            <div className="h-px w-12 mb-8" style={{ background: `rgba(212,175,55,0.5)` }} />

            <p className="text-xs font-black tracking-[0.25em] uppercase mb-2" style={{ color: GOLD }}>THE CLIENT'S VOICE</p>
            <p className="text-white leading-relaxed mb-5" style={{ fontFamily: 'Georgia, serif', fontSize: '0.97rem' }}>
              The result? What could have been a logistical nightmare became a total success. Here is the letter Windean sent us the moment they arrived in Arkansas:
            </p>
            <blockquote className="rounded-2xl px-6 py-6 mb-8 relative"
              style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid rgba(212,175,55,0.3)` }}>
              <span className="text-5xl absolute top-2 left-4 leading-none" style={{ color: GOLD, opacity: 0.25, fontFamily: 'Georgia, serif' }}>"</span>
              <p className="text-white leading-relaxed italic pt-3" style={{ fontFamily: 'Georgia, serif', fontSize: '0.97rem' }}>
                With two trucks full of our home's adornments en route, John, 13 chickens, one cat, and I have made it safely to our new home in Bono, Arkansas. Traveling across four states with all those animals was a true test of my endurance... but I just wanted to write a letter of gratitude for the most efficient and professional home buying experience of all time!
              </p>
              <p className="text-white leading-relaxed italic mt-4" style={{ fontFamily: 'Georgia, serif', fontSize: '0.97rem' }}>
                Bob, you took the time to research and vet many people to find us the 'best of the best' on both ends of our move. With your extensive expertise, you made this a buttery-smooth transaction. I am certain this would have gone very differently had you not gone the distance. Thank you for making this so easy, so smooth, and so pleasurable.
              </p>
              <p className="mt-4 text-sm font-bold" style={{ color: GOLD }}>— Windean Stratton</p>
            </blockquote>
            <div className="h-px w-12 mb-8" style={{ background: `rgba(212,175,55,0.5)` }} />

            <p className="text-xs font-black tracking-[0.25em] uppercase mb-2" style={{ color: GOLD }}>THE LESSON</p>
            <p className="text-white leading-relaxed" style={{ fontFamily: 'Georgia, serif', fontSize: '0.97rem' }}>
              At Dyson, our philosophy is simple: Proper planning, elite professionals, and relentless daily management are the ingredients of a stress-free relocation. You don't just need an agent — you need an enterprise managing the timeline.
            </p>
          </ClientStory>
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
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('open_talk_to_us'))}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-black text-base transition-all hover:scale-105"
            style={{
              background: `linear-gradient(135deg, #e8c84a, ${GOLD})`,
              color: '#000',
              boxShadow: '0 4px 14px rgba(212,175,55,0.3)',
            }}
          >
            <MessageCircle className="w-5 h-5" /> Talk to Charlie Now
          </button>
          <Link
            to="/relocation-intake"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base transition-all hover:scale-105"
            style={{ border: `1px solid ${GOLD}`, color: GOLD }}
          >
            How We Manage a Move <ArrowRight className="w-4 h-4" />
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

      {/* ── Moved down temporarily, out of the hero scroll position ── */}
      <section className="px-8 md:px-16 py-16" style={{ background: '#0d0d0d' }}>
        <div className="w-full max-w-3xl mx-auto">
          <IssueRequestSolutionMap context="corporate_relo" />
        </div>

        <div className="w-full max-w-3xl mx-auto mt-10 rounded-2xl p-6" style={{ background: '#000' }}>
          <PropertyPlatformSearch />
        </div>
      </section>

      {/* ── NEWS LANDING — moved to the bottom as its own standalone block.
          Uses the shared StudioHeroBanner + SolutionMapEntry components as-is
          (unmodified) so other portals that also use them are unaffected. ── */}
      <section style={{ background: '#0a0a0a' }}>
        <div className="px-8 md:px-16 pt-14 pb-4 text-center">
          <p className="text-xs font-black tracking-[0.35em] uppercase mb-2" style={{ color: GOLD }}>
            Also Available To You
          </p>
          <h2 className="display-heading" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.9rem)', letterSpacing: '0.12em', color: '#fff' }}>
            Real Estate News &amp; Intelligence
          </h2>
        </div>
        <StudioHeroBanner />
        <SolutionMapEntry />
      </section>

    </div>
  );
}