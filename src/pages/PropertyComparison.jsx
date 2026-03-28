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
    <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="text-xs font-bold tracking-[0.3em] mb-2" style={{ color: GOLD }}>MOST PROBABLE PROPERTIES</p>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="display-heading" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)', letterSpacing: '0.18em', color: '#fff' }}>
                My Property Comparison
              </h1>
              <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Add homes you've toured. Our team (and Gemini) will research each one across all 6 categories so you can decide with confidence.
              </p>
            </div>
            {clientId && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold shrink-0"
                style={{ background: GOLD, color: '#000' }}>
                <Plus className="w-4 h-4" /> Add a Property
              </button>
            )}
          </div>
        </motion.div>

        {!clientId && (
          <div className="text-center py-20">
            <Home className="w-12 h-12 mx-auto mb-4" style={{ color: 'rgba(255,255,255,0.2)' }} />
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Complete your relocation intake to access this tool.</p>
            <Link to="/RelocationIntake">
              <button className="mt-4 px-6 py-2.5 rounded-full text-sm font-bold" style={{ background: GOLD, color: '#000' }}>
                Start My Profile
              </button>
            </Link>
          </div>
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
  );
}