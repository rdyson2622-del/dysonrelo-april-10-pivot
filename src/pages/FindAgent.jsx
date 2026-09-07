import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Mail, Loader2, ShieldCheck, AlertTriangle, ThumbsDown, Award } from 'lucide-react';
import CharliePagePresenter from '@/components/charlie/CharliePagePresenter';
import AgentSelectionSolutionMap from '@/components/roadmap/AgentSelectionSolutionMap';
import ClientHeroMockup from '@/components/dnn/ClientHeroMockup';
import PortalSubscribeForm from '@/components/portal/PortalSubscribeForm';

const GOLD = '#D4AF37';

const WHY_SECTION = [
  {
    icon: ThumbsDown,
    title: 'The Problem With Most Referral Networks',
    content: `Most agent referral networks are a numbers game — you pay a fee to join a directory, and unqualified leads get blasted to a dozen agents at once. You're competing with strangers for a client who never asked to be shopped around, and half the "referrals" never even respond.

    That's not a referral relationship. That's a race to the bottom on price and speed, with no protection for your time or your commission.`
  },
  {
    icon: ShieldCheck,
    title: 'How Dyson & Dyson Does It Differently — Both Directions',
    content: `We built a two-way pipeline, not a one-way lead dump. Incoming: we vet relocating clients before they ever reach you — their timeline, budget, and priorities are already documented, and you're the only agent who sees them. Outgoing: when your own clients are relocating out of your market, we place them with a vetted destination agent and protect your referral fee on the deal.

    No bidding. No competing agents fighting over the same client. Just a warm, qualified introduction — from us to you, and from you to us.`
  },
  {
    icon: AlertTriangle,
    title: 'Why We Vet Every Agent Before Sending Business',
    content: `Every relocating client we place is someone's life decision. We won't hand that trust to an agent we haven't verified — and you shouldn't want us to, either, since your name is now attached to how that client is treated.

    This is why we complete a full agent profile and production review before any referrals flow in either direction. We need to know you before we can send you business, and before we can trust you with ours.`
  },
  {
    icon: Award,
    title: 'Our Standard for Every Agent in the Network',
    content: `To send or receive referrals through Dyson & Dyson, every agent must meet our standard:

    • Minimum 5 years active production in your primary market
    • Verified production history (closes, not just listings)
    • Clean DRE/license record — no disciplinary actions
    • Responsive communication — we test it before any client is placed
    • Willing to operate within our referral fee structure
    • Committed to representing the client's outcome, not just the close

    We don't partner with agents chasing volume. We partner with agents who protect the relationship on both ends of the referral.`
  }
];

export default function FindAgent() {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const checkSubscribed = () => {
      let localSubscribed = false;
      try {
        const portal = JSON.parse(localStorage.getItem('dyson_portal') || 'null');
        if (portal?.roleKey === 'agent') localSubscribed = true;
      } catch {
        // ignore malformed storage
      }
      if (localSubscribed) { setSubscribed(true); return; }
      base44.auth.me().then(user => {
        if (!user?.email) return;
        base44.entities.DnnSubscriber.filter({ email: user.email, source: 'Relocation Agent Portal' }, '-created_date', 1).then(recs => {
          if (recs.length > 0) setSubscribed(true);
        }).catch(() => {});
      }).catch(() => {});
    };
    checkSubscribed();
    window.addEventListener('dyson_role_change', checkSubscribed);
    return () => window.removeEventListener('dyson_role_change', checkSubscribed);
  }, []);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const user = await base44.auth.me();
        if (user?.email) {
          const clients = await base44.entities.RelocationClient.filter({ email: user.email }, '-created_date', 1);
          if (clients[0]) setClient(clients[0]);
        }
      } catch (err) {
        console.error('Error fetching client:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#ede0cc' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: GOLD }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#ede0cc' }}>
      <ClientHeroMockup
        label="Your Relocation Agent Portal"
        quoteLine1='"We built a two-way referral engine designed to send you real, qualified business — not just leads.'
        quoteLine2='No cold calls, no competing agents. Just a vetted pipeline, incoming and outgoing." '
        attribution="— Bob Dyson"
      />
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: `${GOLD}20`, border: `2px solid ${GOLD}` }}>
            <ShieldCheck className="w-8 h-8" style={{ color: GOLD }} />
          </div>
          <h1 className="display-heading mb-6" style={{ fontSize: '2.5rem', letterSpacing: '0.1em' }}>
            <span style={{ color: '#1a1a1a' }}>Referral Business,</span><br />
            <span style={{ color: GOLD }}>Both Directions</span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed mb-4" style={{ color: 'rgba(26,26,26,0.9)', fontStyle: 'italic' }}>
            "Every relocating client needs someone with real knowledge of the destination market — an agent or broker with genuine 'boots on the ground.' That's the seat we're inviting you to fill."
          </p>
          <p className="text-base max-w-3xl mx-auto leading-relaxed" style={{ color: 'rgba(26,26,26,0.65)' }}>
            Join the Dyson & Dyson network and you get vetted client referrals sent to you, and a trusted place to send your own relocating clients — with your fee protected on both ends.
          </p>
        </motion.div>

        {/* Agent Status — only if client exists and has an agent */}
        {client?.agent_name && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-3xl p-8 text-center" style={{ background: '#000', border: `1px solid ${GOLD}44` }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: `${GOLD}20`, border: `2px solid ${GOLD}` }}>
              <span className="text-2xl font-bold" style={{ color: GOLD }}>{client.agent_name.charAt(0)}</span>
            </div>
            <h2 className="text-2xl font-bold mb-1" style={{ color: '#fff' }}>{client.agent_name}</h2>
            <p className="text-sm mb-4" style={{ color: '#888' }}>Your assigned agent for {client.destination_city}</p>
            {client.assigned_agent && (
              <a href={`mailto:${client.assigned_agent}`} className="inline-flex items-center gap-2 px-6 py-2 rounded-full font-bold" style={{ background: GOLD, color: '#000' }}>
                <Mail className="w-4 h-4" /> Contact Agent
              </a>
            )}
          </motion.div>
        )}

        {/* In-progress status — client exists but no agent yet */}
        {client && !client.agent_name && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-3xl p-8 text-center" style={{ background: '#000', border: `1px solid ${GOLD}44` }}>
            <p className="text-lg mb-3" style={{ color: '#fff' }}>Your agent matching process is in progress.</p>
            <p className="text-sm" style={{ color: '#888' }}>
              Bob's team is reviewing agents in {client.destination_city} based on your profile.<br />
              We'll present 3–5 finalists within 48 hours of your completed intake.
            </p>
          </motion.div>
        )}



        {/* Solution Map — animated 4-step agent selection flow, shown above the problem box */}
        <AgentSelectionSolutionMap />

        {/* Why Section — always shown */}
        <div className="space-y-6">
          {WHY_SECTION.map((section, i) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="rounded-3xl p-8"
                style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${GOLD}20`, border: `1px solid ${GOLD}44` }}>
                    <Icon className="w-5 h-5" style={{ color: GOLD }} />
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: '#fff' }}>{section.title}</h3>
                </div>
                <div className="space-y-3">
                  {section.content.split('\n\n').map((para, j) => (
                    <p key={j} className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'rgba(255,255,255,0.72)' }}>
                      {para.trim()}
                    </p>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Network Scale Statement */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
          className="rounded-3xl p-8 text-center" style={{ background: '#000', border: `1px solid ${GOLD}44` }}>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
            We update our vetted, affiliated agent network on a regular basis — currently over <span className="font-bold" style={{ color: GOLD }}>500 vetted affiliated agents</span> across all 50 states seed our network monthly with many of the best of the best in U.S. markets and communities. We specialize in working with local, independent brokerages and their agents, bringing a real community feel to our services.
          </p>
        </motion.div>

        {/* ── SUBSCRIBE — makes this the agent's home page ── */}
        {!subscribed && (
          <PortalSubscribeForm portalName="Relocation Agent Portal" source="Relocation Agent Portal" roleKey="agent" dest="/find-agent" />
        )}

      </div>

      {/* Charlie — page-specific explainer video for the Relocation Agent Portal */}
      <CharliePagePresenter pageKey="portal-relocation-agent" />
    </div>
  );
}