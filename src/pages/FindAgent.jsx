import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { MapPin, Mail, Check, User, Search, FileSignature, Loader2 } from 'lucide-react';

const GOLD = '#D4AF37';

export default function FindAgent() {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState(null);

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
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#808080' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: GOLD }} />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen" style={{ background: '#808080' }}>
        <div className="max-w-4xl mx-auto px-6 py-20 space-y-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: `${GOLD}20`, border: `2px solid ${GOLD}` }}>
              <User className="w-8 h-8" style={{ color: GOLD }} />
            </div>
            <h1 className="display-heading mb-3" style={{ fontSize: '2.5rem', color: '#fff', letterSpacing: '0.1em' }}>Meet Your Perfect Agent</h1>
            <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.8)' }}>Start your relocation profile to unlock personalized agent matching.</p>
            <a href="/RelocationIntake" className="inline-block px-8 py-3 rounded-full font-bold" style={{ background: GOLD, color: '#000' }}>Complete Your Profile</a>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-3xl p-8" style={{ background: '#000', border: '1px solid rgba(255,255,255,0.15)' }}>
            <h3 className="text-xl font-bold mb-6" style={{ color: '#fff' }}>How It Works</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {[{ icon: User, title: 'Tell Us About You', desc: 'Share your relocation destination, timeline, and preferences.' }, { icon: Search, title: 'We Vet Agents', desc: 'Deep dive into DRE records, production, and personality fit.' }, { icon: Check, title: 'You Choose', desc: '3–5 hand-picked finalists for your market.' }, { icon: FileSignature, title: 'Get Started', desc: 'Sign a buyer broker agreement and start your search.' }].map((step, i) => {
                const StepIcon = step.icon;
                return (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${GOLD}20`, border: `1px solid ${GOLD}33` }}>
                      <StepIcon className="w-6 h-6" style={{ color: GOLD }} />
                    </div>
                    <div>
                      <p className="font-bold mb-1" style={{ color: '#fff' }}>{step.title}</p>
                      <p className="text-sm" style={{ color: '#888' }}>{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            </motion.div>
            </div>
            </div>
            );
            }

  return (
    <div className="min-h-screen" style={{ background: '#808080' }}>
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: `${GOLD}20`, border: `2px solid ${GOLD}` }}>
            <User className="w-8 h-8" style={{ color: GOLD }} />
          </div>
          <h1 className="display-heading mb-3" style={{ fontSize: '2.5rem', color: '#fff', letterSpacing: '0.1em' }}>Your Agent Match</h1>
          <p className="text-lg" style={{ color: 'rgba(255,255,255,0.8)' }}>Vetted. Local. Perfect fit for {client.destination_city}.</p>
        </motion.div>

        {/* Agent Status Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-3xl p-8" style={{ background: '#000', border: `1px solid ${GOLD}44` }}>
          {client.agent_name ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: `${GOLD}20`, border: `2px solid ${GOLD}` }}>
                <span className="text-2xl font-bold" style={{ color: GOLD }}>{client.agent_name.charAt(0)}</span>
              </div>
              <h2 className="text-2xl font-bold mb-1" style={{ color: '#fff' }}>{client.agent_name}</h2>
              <p className="text-sm mb-4" style={{ color: '#888' }}>Your assigned agent</p>
              {client.assigned_agent && (
                <a href={`mailto:${client.assigned_agent}`} className="inline-flex items-center gap-2 px-6 py-2 rounded-full" style={{ background: GOLD, color: '#000', fontWeight: 'bold' }}>
                  <Mail className="w-4 h-4" /> Contact Agent
                </a>
              )}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-lg mb-4" style={{ color: '#fff' }}>Your agent matching process is in progress.</p>
              <p className="text-sm" style={{ color: '#888' }}>
                Bob's team is reviewing 20+ agents in {client.destination_city} based on your preferences. <br />
                We'll present 3–5 finalists within 48 hours.
              </p>
            </div>
          )}
        </motion.div>

        {/* What Happens Next */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-3xl p-8" style={{ background: '#000', border: '1px solid rgba(255,255,255,0.15)' }}>
          <h3 className="text-xl font-bold mb-6" style={{ color: '#fff' }}>How Agent Matching Works</h3>
          <div className="space-y-4">
            {[
              { num: 1, title: 'Personality Interview', desc: 'We schedule a call to understand your style — hands-on or delegate?' },
              { num: 2, title: 'Deep Vetting', desc: 'DRE records, production history, and reviews for 20+ local agents.' },
              { num: 3, title: 'Your Choice', desc: 'You pick from 3–5 finalists who match your needs and personality.' },
              { num: 4, title: 'Buyer Broker Agreement', desc: 'Formalize your relationship. Unlocks full tools and City Guide access.' },
            ].map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold" style={{ background: GOLD, color: '#000' }}>
                  {step.num}
                </div>
                <div>
                  <p className="font-bold" style={{ color: '#fff' }}>{step.title}</p>
                  <p className="text-sm" style={{ color: '#888' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}