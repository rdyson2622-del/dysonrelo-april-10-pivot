import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import SolutionMapEntry from './SolutionMapEntry';
import ClientStory from '@/components/landing/ClientStory';
import PortalSubscribeForm from '@/components/portal/PortalSubscribeForm';

const GOLD = '#D4AF37';

export default function Home() {
  const headingRef = useRef(null);
  const [headingVisible, setHeadingVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeadingVisible(true); },
      { threshold: 0.3 }
    );
    if (headingRef.current) observer.observe(headingRef.current);
    return () => observer.disconnect();
  }, []);

  // Fetch latest DNN article for bottom corner card
  const { data: articles = [] } = useQuery({
    queryKey: ['landingDnnBrief'],
    queryFn: () => base44.entities.DnnArticle.filter(
      { status: 'published' }, '-generated_date', 1
    ),
  });
  const brief = articles[0] || null;
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="flex flex-col" style={{ background: '#0a0a0a' }}>
      {/* ── Top: Solution Map entry page ── */}
      <SolutionMapEntry />

      {/* ── Scrollable following sections ── */}
      <div className="w-full px-8 pb-20 pt-4" style={{ background: '#ede0cc' }}>

        {/* ── MARKETING BRIDGE ── */}
        <div className="w-full mt-8 mb-2">
          <div className="rounded-2xl px-8 py-10 text-center"
            style={{ background: 'rgba(0,0,0,0.08)', border: '1px solid rgba(212,175,55,0.25)' }}>
            <p className="font-black leading-tight mb-2"
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(1.4rem, 3.5vw, 2.25rem)',
                color: '#1a1a1a',
                letterSpacing: '0.04em',
              }}>
              Moving is a Logistics Problem.<br />
              Selling is a Story Problem.<br />
              <span style={{ color: GOLD }}>We Solve Both.</span>
            </p>
            <p className="text-sm mt-4 mb-8 max-w-lg mx-auto leading-relaxed" style={{ color: '#4a3a28', fontFamily: 'Georgia, serif' }}>
              Whether you need a full relocation managed end-to-end, or you're stuck in a deal that won't close — we have a path for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/relo-management"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-black tracking-wide transition-all hover:scale-105 active:scale-95"
                style={{
                  background: 'rgba(0,0,0,0.5)',
                  border: `1px solid ${GOLD}`,
                  color: GOLD,
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  boxShadow: '0 4px 20px rgba(212,175,55,0.15)',
                }}>
                🏠 Explore Relocation Services
              </a>
              <a href="/real-estate-answers"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-black tracking-wide transition-all hover:scale-105 active:scale-95"
                style={{
                  background: 'rgba(0,0,0,0.5)',
                  border: `1px solid ${GOLD}`,
                  color: GOLD,
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  boxShadow: '0 4px 20px rgba(212,175,55,0.15)',
                }}>
                💬 Get Real Estate Answers
              </a>
            </div>
          </div>
        </div>

        {/* ── CLIENT STORIES ── */}
        <div className="w-full mt-12 text-left">
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

          {/* Story 1 — Windean Stratton */}
          <ClientStory
            label="4-State Relocation · Arizona → Arkansas"
            headline="The 4-State Farm Relocation: How We Moved a Family (and 13 Chickens) Without a Hitch."
            defaultOpen
          >
            <div className="rounded-2xl overflow-hidden mb-8" style={{ background: '#000', border: '1px solid rgba(212,175,55,0.3)' }}>
              <p className="text-xs font-black tracking-[0.25em] uppercase mb-3 px-4 pt-4" style={{ color: GOLD }}>▶ WATCH THE WINDEANS' STORY</p>
              <video
                src="https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/bf489a37c_a_true_story_of_a_cross_country_real_estate_move.mp4"
                controls
                playsInline
                preload="metadata"
                className="w-full block"
                style={{ aspectRatio: '16/9' }}
              />
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

          {/* CTA */}
          <div className="rounded-2xl px-7 py-8 text-center mt-10"
            style={{ background: '#111', border: `2px solid ${GOLD}` }}>
            <p className="text-xs font-black tracking-[0.25em] uppercase mb-3" style={{ color: GOLD }}>YOUR STORY IS NEXT</p>
            <p className="text-white leading-relaxed mb-6" style={{ fontFamily: 'Georgia, serif', fontSize: '1rem' }}>
              Every home has a story, and every move has a conflict. Are you planning a complex relocation, or is your current real estate transaction stuck in the mud?
            </p>
            <button
              onClick={() => window.location.href = '/solve-my-story'}
              className="px-10 py-4 rounded-full font-bold text-base tracking-wider transition-all hover:opacity-90"
              style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}
            >
              Solve My Story →
            </button>
            <p className="text-xs mt-4 opacity-50 text-white">No sales pitch. Just a resolution. 55 years of relocation management experience.</p>
          </div>

          {/* ── CLIENT SUBSCRIBE — bottom of the scroll ── */}
          <div className="mt-12">
            <PortalSubscribeForm portalName="Client Concierge" source="Client Portal" roleKey="client" dest="/home" />
          </div>
        </div>
      </div>

      {/* ── DNN MORNING BRIEF CORNER CARD ── */}
      {brief && (
        <Link to="/dnn-news"
          className="hidden md:block fixed bottom-6 right-6 max-w-xs rounded-2xl px-4 py-3 transition-all hover:scale-105 z-40"
          style={{
            background: '#111',
            border: `1px solid rgba(212,175,55,0.3)`,
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: GOLD }} />
            <p className="text-[9px] font-black tracking-[0.25em] uppercase" style={{ color: GOLD }}>
              DNN Morning Brief · {today}
            </p>
          </div>
          <p className="text-white text-xs font-semibold leading-snug line-clamp-2">{brief.headline}</p>
          <p className="text-[10px] mt-1.5 font-bold" style={{ color: GOLD }}>Read full brief →</p>
        </Link>
      )}
    </div>
  );
}