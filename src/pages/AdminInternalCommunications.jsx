import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, MessageSquare, Video, PlayCircle, X, Radio } from 'lucide-react';

const GOLD = '#D4AF37';

const LINKS = [
  {
    icon: Mail,
    title: 'Email Campaigns',
    desc: 'Build and send email blasts to subscribers, agents, and referral contacts.',
    path: '/admin/dnn/communications',
  },
  {
    icon: MessageSquare,
    title: 'Messaging & SMS Process',
    desc: 'Compose, batch-send, and track SMS outreach and reply threads.',
    path: '/admin/communications',
  },
  {
    icon: Video,
    title: 'Explainer Videos',
    desc: 'Manage explainer video scripts and renders used across every portal.',
    path: '/admin/dnn/explainer-videos',
  },
  {
    icon: PlayCircle,
    title: 'Charlie Video Library',
    desc: "Charlie's scripts, knowledge base, and rendered video assets.",
    path: '/admin/charlie-scripts',
  },
];

export default function AdminInternalCommunications() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen px-6 py-12" style={{ background: '#ede0cc' }}>
      <div className="max-w-2xl mx-auto">
        <button onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/admin/referral-agents'))}
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-full mb-4"
          style={{ background: '#fff8ee', border: `1px solid ${GOLD}60`, color: '#1a1a1a' }}>
          <X className="w-3.5 h-3.5" /> Exit
        </button>

        <div className="rounded-2xl p-6 md:p-8" style={{ background: '#0a0a0a', border: `1px solid ${GOLD}40` }}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Radio className="w-4 h-4" style={{ color: GOLD }} />
            <p className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>Internal Use Only</p>
          </div>
          <h1 className="text-3xl font-serif text-white text-center mb-4">Internal Company Communications</h1>
          <p className="text-sm text-gray-300 text-center mb-8 leading-relaxed">
            This is the team's home base for every outward-facing message we send. Instead of hunting
            through admin menus, use this hub to jump straight to the email campaign builder, the SMS
            messaging process, the explainer video scripts, and Charlie's video library — the same tools
            and content that power the referral agent, client, and vendor portals.
          </p>

          <div className="space-y-3">
            {LINKS.map(({ icon: Icon, title, desc, path }) => (
              <a key={path} href={path}
                className="flex items-start gap-3 rounded-xl p-4 transition-all hover:scale-[1.01]"
                style={{ background: '#111', border: `1px solid ${GOLD}40` }}>
                <Icon className="w-5 h-5 mt-0.5 shrink-0" style={{ color: GOLD }} />
                <div>
                  <p className="text-sm font-serif text-white">{title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}