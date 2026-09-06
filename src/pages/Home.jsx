import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import SolutionMapEntry from './SolutionMapEntry';
import ClientStory from '@/components/landing/ClientStory';
import PortalSubscribeForm from '@/components/portal/PortalSubscribeForm';
import ClientHeroMockup from '@/components/dnn/ClientHeroMockup';
import PropertyPlatformSearch from '@/components/portal/PropertyPlatformSearch';
import FindAProWidget from '@/components/portal/FindAProWidget';
import ClientSubscriberDashboard from '@/components/dashboard/ClientSubscriberDashboard';

const GOLD = '#D4AF37';
const DYSON_LOGO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/aa2b5389f_Screenshot2026-08-01at41912PM.png";

export default function Home() {
  const headingRef = useRef(null);
  const videoRef = useRef(null);
  const [headingVisible, setHeadingVisible] = useState(false);
  const [started, setStarted] = useState(false);
  const [clientRecord, setClientRecord] = useState(null);
  const [checkedSubscriber, setCheckedSubscriber] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeadingVisible(true); },
      { threshold: 0.3 }
    );
    if (headingRef.current) observer.observe(headingRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    base44.auth.me().then(user => {
      if (!user?.email) { setCheckedSubscriber(true); return; }
      base44.entities.RelocationClient.filter({ email: user.email }, '-created_date', 1).then(recs => {
        setClientRecord(recs[0] || null);
        setCheckedSubscriber(true);
      }).catch(() => setCheckedSubscriber(true));
    }).catch(() => setCheckedSubscriber(true));
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

  if (!checkedSubscriber) {
    return <div className="min-h-screen" style={{ background: '#0a0a0a' }} />;
  }

  return (
    <div className="flex flex-col" style={{ background: '#0a0a0a' }}>
      {clientRecord ? (
        <ClientSubscriberDashboard client={clientRecord} />
      ) : (
        <>
          {/* ── New front page hero ── */}
          <ClientHeroMockup />

          {/* ── Solution Map entry page ── */}
          <SolutionMapEntry />
        </>
      )}

      {/* ── Scrollable following sections ── */}
      <div className="w-full px-8 pb-20 pt-4" style={{ background: '#ede0cc' }}>

        {/* ── SEARCH ACROSS ALL PLATFORMS ── */}
        <div className="w-full mt-8 mb-2 rounded-2xl px-8 py-10" style={{ background: '#000' }}>
          <PropertyPlatformSearch />
        </div>

        {/* ── FIND A PRO ── */}
        <div className="w-full mt-6 mb-2 rounded-2xl px-8 py-10" style={{ background: '#000' }}>
          <FindAProWidget />
        </div>

        {!clientRecord && (
        <>
        {/* ── MARKETING BRIDGE ── */}
        <div className="w-full mt-8 mb-2">
...
          {/* ── CLIENT SUBSCRIBE — bottom of the scroll ── */}
          <div className="mt-12">
            <PortalSubscribeForm portalName="Client Concierge" source="Client Portal" roleKey="client" dest="/home" />
          </div>
        </div>
        </>
        )}
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