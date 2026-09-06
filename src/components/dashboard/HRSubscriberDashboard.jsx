import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, MessageCircle, Newspaper, Map, Sparkles, Phone, ArrowRight, Building2
} from 'lucide-react';
import RequestInfoWidget from './RequestInfoWidget';

const GOLD = '#D4AF37';

const QUICK_LINKS = [
  { to: '/communications-explainer', icon: MessageCircle, label: 'Communication Hub' },
  { to: '/RelocationRoadmap', icon: Map, label: 'My Roadmaps' },
  { to: '/CityGuide', icon: MapPin, label: 'City Guide' },
  { to: '/real-estate-answers', icon: Sparkles, label: 'Real Estate Answers' },
  { to: '/corporate-relo', icon: Newspaper, label: 'Real Estate News' },
];

export default function HRSubscriberDashboard({ subscriber }) {
  return (
    <div className="w-full px-6 sm:px-10 pt-10 pb-16" style={{ background: '#0d0d0d' }}>
      <div className="max-w-6xl mx-auto">
        {/* Welcome header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <p className="text-xs font-black tracking-[0.3em] uppercase mb-1" style={{ color: GOLD }}>
              Welcome back
            </p>
            <h1 className="serif-heading" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#fff' }}>
              {subscriber?.full_name?.split(' ')[0] || 'there'}'s HR Relocation Workspace
            </h1>
          </div>
          <span className="px-4 py-2 rounded-full text-xs font-black tracking-wide uppercase self-start flex items-center gap-2"
            style={{ background: '#111', color: GOLD, border: `1px solid ${GOLD}` }}>
            <Building2 className="w-3.5 h-3.5" /> Corporate Relo Subscriber
          </span>
        </div>

        {/* Request info / act on it */}
        <RequestInfoWidget portalRole="hr" context="corporate_relo" />

        {/* Quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {QUICK_LINKS.map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to}
              className="flex flex-col items-center justify-center gap-2 py-5 rounded-xl text-center transition-all hover:scale-[1.03]"
              style={{ background: '#111', border: '1px solid rgba(212,175,55,0.25)' }}>
              <Icon className="w-5 h-5" style={{ color: GOLD }} />
              <span className="text-xs font-bold text-white">{label}</span>
            </Link>
          ))}
        </div>

        {/* Need a human */}
        <div className="rounded-2xl px-6 py-4 flex items-center justify-between gap-4" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)' }}>
          <div>
            <p className="text-xs font-black tracking-widest" style={{ color: GOLD }}>NEED A HUMAN?</p>
            <p className="text-xs" style={{ color: '#fff' }}>Mon–Sat, 9am–7pm PT</p>
          </div>
          <a href="tel:+18583531200" className="flex items-center gap-2">
            <Phone className="w-4 h-4" style={{ color: GOLD }} />
            <span className="text-sm font-bold" style={{ color: '#fff' }}>(858) 353-1200</span>
          </a>
        </div>
      </div>
    </div>
  );
}