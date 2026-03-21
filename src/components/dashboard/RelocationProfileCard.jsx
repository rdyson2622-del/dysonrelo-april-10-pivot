import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, DollarSign, Home, Users, Star, Edit3, Check, X, AlertTriangle, ChevronDown, ChevronUp, UserCheck, FileSignature, Clock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const GOLD = '#D4AF37';

const CAUTIONS = [
  { icon: '🔄', title: 'Timeline Shifts', desc: 'Escrow delays, lease endings, or job start dates can push your move by weeks. Stay flexible and keep your agent briefed.' },
  { icon: '🗺️', title: 'Destination Changes', desc: 'It\'s common to pivot neighborhoods or even cities mid-search. Your profile updates automatically when you do.' },
  { icon: '🏚️', title: 'Failed Escrow', desc: 'Discovery and due diligence uncover surprises. A deal falling through is not a failure — it\'s the system working for you.' },
  { icon: '💸', title: 'Budget Pivots', desc: 'Rate changes, inspection costs, and appraisal gaps shift budgets. Update your range here any time.' },
  { icon: '🏘️', title: 'Part-of-Town Restarts', desc: 'A neighborhood that looked perfect on paper may not feel right in person. Charlie tracks every pivot so nothing is lost.' },
  { icon: '📋', title: 'Start-Overs', desc: 'Starting fresh with a new agent, a new area, or a new timeline happens more than you think. Your profile evolves with you.' },
];

const BUDGET_OPTIONS = ['Under $300,000', '$300k – $500k', '$500k – $750k', '$750k – $1 million', '$1M – $1.5M', 'Over $1.5 million'];
const TIMELINES = ['Within 3 months', '3–6 months', '6–12 months', '12+ months', 'Just exploring'];

export default function RelocationProfileCard({ clientId }) {
  const [client, setClient] = useState(null);
  const [editing, setEditing] = useState(false);
  const [showCautions, setShowCautions] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    if (!clientId) return;
    base44.entities.RelocationClient.filter({ id: clientId }, '-created_date', 1)
      .then(results => {
        if (results[0]) {
          setClient(results[0]);
          setForm({
            destination_city: results[0].destination_city || '',
            destination_state: '',
            move_date: results[0].move_date || '',
            budget: results[0].budget || '',
            notes: results[0].notes || '',
          });
        }
      })
      .catch(() => {});
  }, [clientId]);

  // Try to parse destination state from notes
  const parseDestState = (notes) => {
    if (!notes) return '';
    const match = notes.match(/Destination:[^,]+,\s*([A-Z]{2})/);
    return match ? match[1] : '';
  };

  const parseTimeline = (notes) => {
    if (!notes) return '';
    const match = notes.match(/Timeline:\s*([^\n]+)/);
    return match ? match[1].trim() : '';
  };

  const handleSave = async () => {
    if (!clientId) return;
    setSaving(true);
    try {
      const updated = await base44.entities.RelocationClient.update(clientId, {
        destination_city: form.destination_city,
        move_date: form.move_date || undefined,
        budget: form.budget || undefined,
      });
      setClient(prev => ({ ...prev, ...updated, destination_city: form.destination_city }));
      setEditing(false);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  if (!clientId) return null;

  const destState = parseDestState(client?.notes);
  const timeline = parseTimeline(client?.notes);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mb-8 rounded-3xl overflow-hidden"
      style={{ background: '#3a3a3a', border: `1px solid ${GOLD}55` }}
    >
      {/* Header */}
      <div className="px-6 pt-5 pb-4 flex items-center justify-between" style={{ borderBottom: '1px solid #555' }}>
        <div>
          <p className="text-xs font-bold tracking-widest mb-0.5" style={{ color: GOLD }}>YOUR RELOCATION PROFILE</p>
          <p className="text-sm" style={{ color: '#aaa' }}>Tap edit any time your plans change — this drives everything.</p>
        </div>
        {!editing ? (
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)}
            className="gap-1.5 rounded-xl" style={{ color: GOLD, border: `1px solid ${GOLD}44` }}>
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setEditing(false)}
              className="rounded-xl" style={{ color: '#888' }}>
              <X className="w-4 h-4" />
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}
              className="rounded-xl" style={{ background: GOLD, color: '#000' }}>
              {saving ? '...' : <><Check className="w-3.5 h-3.5 mr-1" /> Save</>}
            </Button>
          </div>
        )}
      </div>

      {/* Profile Fields */}
      <div className="px-6 py-5 grid grid-cols-2 gap-4 sm:grid-cols-4">

        {/* Destination */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <MapPin className="w-3.5 h-3.5" style={{ color: GOLD }} />
            <span className="text-xs font-bold tracking-wider uppercase" style={{ color: '#888' }}>Destination</span>
          </div>
          {editing ? (
            <div className="flex gap-1.5">
              <Input value={form.destination_city} onChange={e => setForm(p => ({ ...p, destination_city: e.target.value }))}
                placeholder="City" className="border-0 rounded-lg h-8 text-sm" style={{ background: '#2a2a2a', color: '#fff' }} />
              <Input value={form.destination_state} onChange={e => setForm(p => ({ ...p, destination_state: e.target.value }))}
                placeholder="ST" className="border-0 rounded-lg h-8 text-sm w-14" style={{ background: '#2a2a2a', color: '#fff' }} />
            </div>
          ) : (
            <p className="font-bold text-sm" style={{ color: '#fff' }}>
              {client?.destination_city || '—'}{destState ? `, ${destState}` : ''}
            </p>
          )}
        </div>

        {/* Timeline */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Calendar className="w-3.5 h-3.5" style={{ color: GOLD }} />
            <span className="text-xs font-bold tracking-wider uppercase" style={{ color: '#888' }}>Timeline</span>
          </div>
          {editing ? (
            <select value={form.timeline || ''} onChange={e => setForm(p => ({ ...p, timeline: e.target.value }))}
              className="w-full rounded-lg h-8 text-sm px-2 border-0"
              style={{ background: '#2a2a2a', color: '#fff' }}>
              <option value="">Select...</option>
              {TIMELINES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          ) : (
            <p className="font-bold text-sm" style={{ color: '#fff' }}>{timeline || '—'}</p>
          )}
        </div>

        {/* Budget */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <DollarSign className="w-3.5 h-3.5" style={{ color: GOLD }} />
            <span className="text-xs font-bold tracking-wider uppercase" style={{ color: '#888' }}>Budget</span>
          </div>
          {editing ? (
            <select value={form.budget || ''} onChange={e => setForm(p => ({ ...p, budget: e.target.value }))}
              className="w-full rounded-lg h-8 text-sm px-2 border-0"
              style={{ background: '#2a2a2a', color: '#fff' }}>
              <option value="">Select...</option>
              {BUDGET_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          ) : (
            <p className="font-bold text-sm" style={{ color: '#fff' }}>{client?.budget || '—'}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Star className="w-3.5 h-3.5" style={{ color: GOLD }} />
            <span className="text-xs font-bold tracking-wider uppercase" style={{ color: '#888' }}>Status</span>
          </div>
          <p className="font-bold text-sm capitalize" style={{ color: '#fff' }}>
            {client?.status?.replace(/_/g, ' ') || '—'}
          </p>
        </div>
      </div>

      {/* Priorities */}
      {client?.priorities?.length > 0 && (
        <div className="px-6 pb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Users className="w-3.5 h-3.5" style={{ color: GOLD }} />
            <span className="text-xs font-bold tracking-wider uppercase" style={{ color: '#888' }}>Priorities</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {client.priorities.map(p => (
              <span key={p} className="px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{ background: `${GOLD}22`, border: `1px solid ${GOLD}44`, color: GOLD }}>
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Cautions Toggle */}
      <div className="px-6 pb-5">
        <button
          onClick={() => setShowCautions(s => !s)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all"
          style={{ background: 'rgba(255,165,0,0.08)', border: '1px solid rgba(255,165,0,0.25)' }}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" style={{ color: '#f59e0b' }} />
            <span className="text-sm font-bold" style={{ color: '#f59e0b' }}>Things That Change Mid-Journey — Be Ready</span>
          </div>
          {showCautions
            ? <ChevronUp className="w-4 h-4" style={{ color: '#f59e0b' }} />
            : <ChevronDown className="w-4 h-4" style={{ color: '#f59e0b' }} />}
        </button>

        <AnimatePresence>
          {showCautions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-3 grid sm:grid-cols-2 gap-3">
                {CAUTIONS.map((c, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-xl"
                    style={{ background: '#2a2a2a', border: '1px solid #444' }}>
                    <span className="text-xl shrink-0">{c.icon}</span>
                    <div>
                      <p className="text-sm font-bold mb-0.5" style={{ color: '#fff' }}>{c.title}</p>
                      <p className="text-xs leading-relaxed" style={{ color: '#aaa' }}>{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3 text-center" style={{ color: '#666' }}>
                Any of these happen? Just tell Charlie — your profile updates instantly.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}