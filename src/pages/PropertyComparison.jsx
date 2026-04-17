import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Plus, Home } from 'lucide-react';
import AddPropertyModal from '@/components/cityguide/AddPropertyModal';
import PropertyComparisonCard from '@/components/cityguide/PropertyComparisonCard';

const GOLD = '#D4AF37';

export default function PropertyComparison() {
  const [clientId, setClientId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(user => {
      if (user?.email) {
        base44.entities.RelocationClient.filter({ email: user.email }, '-created_date', 1).then(clients => {
          if (clients.length > 0) setClientId(clients[0].id);
        });
      }
    });
  }, []);

  const { data: properties = [] } = useQuery({
    queryKey: ['property-candidates', clientId],
    queryFn: () => base44.entities.PropertyCandidate.filter({ client_id: clientId }, '-created_date', 20),
    enabled: !!clientId,
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['property-candidates', clientId] });

  const topPicks = properties.filter(p => p.status === 'top_pick');
  const considering = properties.filter(p => p.status === 'considering');
  const eliminated = properties.filter(p => p.status === 'eliminated');

  return (
    <div className="min-h-screen" style={{ background: '#808080' }}>
    <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <p className="text-sm font-black tracking-[0.25em] mb-3" style={{ color: GOLD }}>MOST PROBABLE PROPERTIES</p>
          <h1 className="display-heading mb-3" style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.6rem)', color: '#fff' }}>My Property Comparison</h1>
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Add homes you've toured. Our team (and Gemini) will research each one across all 6 categories so you can decide with confidence.
          </p>
          {clientId && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold mx-auto"
              style={{ background: GOLD, color: '#000' }}>
              <Plus className="w-4 h-4" /> Add a Property
            </button>
          )}
        </motion.div>

        {!clientId && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            {/* How it works */}
            <div className="rounded-2xl p-8 mb-6" style={{ background: '#1a1a1a', border: `1px solid rgba(212,175,55,0.25)` }}>
              <p className="text-xs font-bold tracking-[0.25em] mb-4 text-center" style={{ color: GOLD }}>HOW THIS TOOL WORKS</p>
              <div className="grid sm:grid-cols-3 gap-6 mb-8">
                {[
                  { step: '1', icon: '🏠', title: 'Add Homes You\'ve Toured', desc: 'Save any property you\'re considering — just paste the address or MLS link.' },
                  { step: '2', icon: '🔬', title: 'We Research Each One', desc: 'Our team runs deep Gemini AI research across 6 key categories for every property.' },
                  { step: '3', icon: '✅', title: 'Compare & Decide', desc: 'Side-by-side scores for neighborhoods, schools, cost of living, healthcare, recreation & more.' },
                ].map(({ step, icon, title, desc }) => (
                  <div key={step} className="text-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl"
                      style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)' }}>
                      {icon}
                    </div>
                    <p className="text-xs font-bold tracking-widest mb-1" style={{ color: GOLD }}>STEP {step}</p>
                    <p className="text-sm font-bold text-white mb-1">{title}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>{desc}</p>
                  </div>
                ))}
              </div>

              {/* 6 categories */}
              <div className="rounded-xl p-4 mb-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-xs font-bold tracking-widest text-center mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>6 RESEARCH CATEGORIES PER PROPERTY</p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                  {['📍 Neighborhood', '🏫 Schools', '💰 Cost of Living', '🏥 Healthcare', '🌳 Recreation', '🏘️ Local Character'].map(cat => (
                    <div key={cat} className="text-xs py-2 px-1 rounded-lg" style={{ background: 'rgba(212,175,55,0.08)', color: 'rgba(255,255,255,0.7)' }}>
                      {cat}
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>Complete your relocation intake first to unlock this tool.</p>
                <Link to="/RelocationIntake">
                  <button className="px-8 py-3 rounded-full text-sm font-bold" style={{ background: GOLD, color: '#000' }}>
                    Start My Profile to Unlock →
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {clientId && properties.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(212,175,55,0.1)', border: `2px solid rgba(212,175,55,0.3)` }}>
              <Home className="w-10 h-10" style={{ color: GOLD }} />
            </div>
            <p className="text-xs font-bold tracking-widest mb-3" style={{ color: GOLD }}>NO PROPERTIES YET</p>
            <h2 className="text-xl font-bold mb-2" style={{ color: '#fff' }}>Start Your Comparison</h2>
            <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>
              After touring homes, add them here. Our team will run deep Gemini research on each one — neighborhoods, schools, cost of living, healthcare, recreation, and local character — so you can compare with confidence.
            </p>
            <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold mx-auto" style={{ background: GOLD, color: '#000' }}>
              <Plus className="w-4 h-4" /> Add My First Property
            </button>
          </motion.div>
        )}

        {/* Top Picks */}
        {topPicks.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1" style={{ background: 'rgba(212,175,55,0.3)' }} />
              <p className="text-xs font-bold tracking-widest px-3" style={{ color: GOLD }}>⭐ TOP PICKS</p>
              <div className="h-px flex-1" style={{ background: 'rgba(212,175,55,0.3)' }} />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {topPicks.map(p => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                  <PropertyComparisonCard property={p} onRefresh={refresh} onDelete={refresh} />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Considering */}
        {considering.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.1)' }} />
              <p className="text-xs font-bold tracking-widest px-3" style={{ color: 'rgba(255,255,255,0.5)' }}>CONSIDERING</p>
              <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.1)' }} />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {considering.map(p => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                  <PropertyComparisonCard property={p} onRefresh={refresh} onDelete={refresh} />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Eliminated */}
        {eliminated.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <p className="text-xs font-bold tracking-widest px-3" style={{ color: 'rgba(255,255,255,0.25)' }}>ELIMINATED</p>
              <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 opacity-50">
              {eliminated.map(p => (
                <PropertyComparisonCard key={p.id} property={p} onRefresh={refresh} onDelete={refresh} />
              ))}
            </div>
          </section>
        )}

        {/* Add more button when properties exist */}
        {clientId && properties.length > 0 && (
          <div className="text-center mt-6">
            <button onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold mx-auto"
              style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: GOLD }}>
              <Plus className="w-4 h-4" /> Add Another Property
            </button>
          </div>
        )}

      {showAddModal && clientId && (
        <AddPropertyModal
          clientId={clientId}
          onClose={() => setShowAddModal(false)}
          onAdded={refresh}
        />
      )}
      </div>
    </div>
  );
}