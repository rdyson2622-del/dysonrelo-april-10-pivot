import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { MapPin, Users, Home, Map, CheckCircle2, LayoutDashboard } from 'lucide-react';
import PlanVoiceNote from '@/components/dashboard/PlanVoiceNote';
import RelocationProfileCard from '@/components/dashboard/RelocationProfileCard';
import HeroMinimal from '@/components/home/HeroMinimal';
import ReadyToStart from '@/components/dashboard/ReadyToStart';

const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";
const GOLD = '#D4AF37';

export default function Dashboard() {
  const [clientId, setClientId] = useState(null);
  const navigate = useNavigate();

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => base44.entities.RelocationTask.list('-created_date', 50),
    initialData: [],
  });

  useEffect(() => {
    const fetchClient = async () => {
      const user = await base44.auth.me();
      if (user?.email) {
        const clients = await base44.entities.RelocationClient.filter({ email: user.email }, '-created_date', 1);
        if (clients.length > 0) setClientId(clients[0].id);
      }
    };
    fetchClient();
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#808080' }}>
      {/* Hero Section */}
      <HeroMinimal />

      <main className="max-w-5xl mx-auto px-6 pb-16 space-y-8">
        {/* Ready to Start / Relocation Profile / Voice Note */}
        {!clientId ? (
          <ReadyToStart onScrollToRoadmap={() => navigate('/RelocationRoadmap')} />
        ) : (
          <>
            <RelocationProfileCard clientId={clientId} />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <PlanVoiceNote clientId={clientId} />
            </motion.div>
          </>
        )}

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl p-8"
          style={{ background: '#000', border: '1px solid rgba(212,175,55,0.3)' }}
        >
          <h2 className="text-xs font-bold tracking-[0.2em] mb-6" style={{ color: GOLD }}>NEXT STEPS</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '📍', title: 'Research Your Destination', desc: 'Explore neighborhoods that match your lifestyle' },
              { icon: '🏠', title: 'Find Your Perfect Home', desc: 'Browse listings and get expert recommendations' },
              { icon: '👤', title: 'Connect with an Agent', desc: 'Meet a local expert who specializes in relocations' },
            ].map((step, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-3xl">{step.icon}</span>
                <div>
                  <h4 className="font-bold mb-1 text-white">{step.title}</h4>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </main>
    </div>
  );
}