import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  MapPin, Calendar, MessageCircle, Newspaper, Shield, DollarSign,
  Map, Sparkles, Phone, ArrowRight, Home as HomeIcon
} from 'lucide-react';

const GOLD = '#D4AF37';

const STATUS_LABELS = {
  new_lead: 'Getting Started',
  in_consultation: 'In Consultation',
  actively_searching: 'Actively Searching',
  under_contract: 'Under Contract',
  moved: 'Moved',
  closed: 'Closed',
  inactive: 'Inactive',
};

const QUICK_LINKS = [
  { to: '/communications-explainer', icon: MessageCircle, label: 'Communication Hub' },
  { to: '/RelocationRoadmap', icon: Map, label: 'My Roadmap' },
  { to: '/CityGuide', icon: MapPin, label: 'City Guide' },
  { to: '/real-estate-answers', icon: Sparkles, label: 'Real Estate Answers' },
  { to: '/my-agent', icon: Shield, label: 'Vette an Agent' },
  { to: '/financial-services', icon: DollarSign, label: 'Select a Lender' },
  { to: '/dnn-news', icon: Newspaper, label: 'DNN News' },
];

export default function ClientSubscriberDashboard({ client }) {
  const { data: roadmapItems = [] } = useQuery({
    queryKey: ['clientDashboardRoadmap', client?.id],
    queryFn: async () => {
      const user = await base44.auth.me();
      const items = await base44.entities.SubscriberRoadmap.filter(
        { subscriber_id: user.id }, '-requested_at', 5
      );
      const real = items.filter(i => !i.is_dummy);
      return real.length ? real : items;
    },
    enabled: !!client,
  });

  const statusLabel = STATUS_LABELS[client.status] || 'Getting Started';

  return (
    <div className="w-full px-6 sm:px-10 pt-10 pb-4" style={{ background: '#ede0cc' }}>
      <div className="max-w-6xl mx-auto">
        {/* Welcome header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <p className="text-xs font-black tracking-[0.3em] uppercase mb-1" style={{ color: GOLD }}>
              Welcome back
            </p>
            <h1 className="serif-heading" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#1a1a1a' }}>
              {client.full_name?.split(' ')[0] || 'there'}'s Relocation Workspace
            </h1>
          </div>
          <span className="px-4 py-2 rounded-full text-xs font-black tracking-wide uppercase self-start"
            style={{ background: '#111', color: GOLD, border: `1px solid ${GOLD}` }}>
            {statusLabel}
          </span>
        </div>

        {/* Move at a glance */}
        <div className="rounded-2xl px-6 py-5 mb-6 flex flex-wrap gap-6 items-center" style={{ background: '#111', border: '1px solid rgba(212,175,55,0.25)' }}>
          <div className="flex items-center gap-2">
            <HomeIcon className="w-4 h-4" style={{ color: GOLD }} />
            <span className="text-sm text-white">{client.current_city || 'Origin not set'}</span>
            <ArrowRight className="w-3.5 h-3.5" style={{ color: GOLD }} />
            <span className="text-sm text-white">{client.destination_city || 'Destination not set'}</span>
          </div>
          {client.move_date && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" style={{ color: GOLD }} />
              <span className="text-sm text-white">Target move: {client.move_date}</span>
            </div>
          )}
          <Link to="/RelocationRoadmap" className="text-xs font-bold ml-auto" style={{ color: GOLD }}>
            View Full Roadmap →
          </Link>
        </div>

        {/* Roadmap activity */}
        <div className="rounded-2xl px-6 py-5 mb-6" style={{ background: '#111', border: '1px solid rgba(212,175,55,0.25)' }}>
          <p className="text-xs font-black tracking-[0.25em] uppercase mb-3" style={{ color: GOLD }}>
            Recent Activity On Your File
          </p>
          {roadmapItems.length === 0 ? (
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Nothing logged yet — as we work your file, updates will appear here.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {roadmapItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 py-1.5">
                  <span className="text-sm text-white truncate">{item.title}</span>
                  <span className="text-[10px] font-black tracking-wide uppercase shrink-0 px-2 py-0.5 rounded-full"
                    style={{ color: GOLD, border: `1px solid rgba(212,175,55,0.3)` }}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
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
        <div className="rounded-2xl px-6 py-4 mb-2 flex items-center justify-between gap-4" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)' }}>
          <div>
            <p className="text-xs font-black tracking-widest" style={{ color: GOLD }}>NEED A HUMAN?</p>
            <p className="text-xs" style={{ color: '#1a1a1a' }}>Mon–Sat, 9am–7pm PT</p>
          </div>
          <a href="tel:+18583531200" className="flex items-center gap-2">
            <Phone className="w-4 h-4" style={{ color: GOLD }} />
            <span className="text-sm font-bold" style={{ color: '#1a1a1a' }}>(858) 353-1200</span>
          </a>
        </div>
      </div>
    </div>
  );
}