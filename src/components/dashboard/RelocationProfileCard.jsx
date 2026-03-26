import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, DollarSign, Users, Star, Edit3, Check, X, AlertTriangle, ChevronDown, ChevronUp, ChevronRight, UserCheck, FileSignature, Clock, TrendingUp, RotateCcw, MapPinned, Wallet, Building, ClipboardList, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const GOLD = '#D4AF37';

const CAUTIONS = [
  { icon: Clock, title: 'Timeline Shifts', desc: 'Escrow delays, lease endings, or job start dates can push your move by weeks. Stay flexible and keep your agent briefed.', color: '#60a5fa' },
  { icon: MapPinned, title: 'Destination Changes', desc: 'It\'s common to pivot neighborhoods or even cities mid-search. Your profile updates automatically when you do.', color: '#a78bfa' },
  { icon: Building, title: 'Failed Escrow', desc: 'Discovery and due diligence uncover surprises. A deal falling through is not a failure — it\'s the system working for you.', color: '#f87171' },
  { icon: Wallet, title: 'Budget Pivots', desc: 'Rate changes, inspection costs, and appraisal gaps shift budgets. Update your range here any time.', color: '#fbbf24' },
  { icon: RotateCcw, title: 'Part-of-Town Restarts', desc: 'A neighborhood that looked perfect on paper may not feel right in person. Charlie tracks every pivot so nothing is lost.', color: '#34d399' },
  { icon: ClipboardList, title: 'Start-Overs', desc: 'Starting fresh with a new agent, a new area, or a new timeline happens more than you think. Your profile evolves with you.', color: '#f472b6' },
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

  // Full relocation journey milestones
  const allMilestones = [
    { id: 'profile', label: 'Profile Created', complete: true, phase: 'intake', guidance: 'Your journey begins here. Share your destination, timeline, and priorities.' },
    { id: 'agent', label: 'Agent Selected', complete: !!client?.agent_name, phase: 'intake', guidance: 'We present 3-5 vetted agents based on your personality fit and needs.' },
    { id: 'buyer_broker', label: 'Buyer Broker Signed', complete: !!client?.buyer_broker_signed, phase: 'intake', guidance: 'Formalize your relationship with your chosen agent. Unlocks full City Guide access.' },
    { id: 'search', label: 'Property Search Started', complete: !!client?.agent_selected_date, phase: 'search', guidance: 'Your agent begins curating listings based on your exact criteria.' },
    { id: 'viewed', label: 'Properties Viewed', complete: false, phase: 'search', guidance: 'Tour homes with your agent. We track every property you see.' },
    { id: 'top_pick', label: 'Top Pick Identified', complete: false, phase: 'search', guidance: 'You find a property that feels right. Time for due diligence.' },
    { id: 'offer', label: 'Offer Submitted', complete: false, phase: 'offer', guidance: 'Your agent crafts a competitive offer based on market analysis.' },
    { id: 'negotiation', label: 'Negotiation Complete', complete: false, phase: 'offer', guidance: 'Terms agreed upon. Moving toward contract.' },
    { id: 'contract', label: 'Under Contract', complete: false, phase: 'escrow', guidance: 'Congratulations! Now the real work begins — inspections, appraisal, financing.' },
    { id: 'inspection', label: 'Inspection Complete', complete: false, phase: 'escrow', guidance: 'Professional inspection reveals the true condition of the property.' },
    { id: 'appraisal', label: 'Appraisal Complete', complete: false, phase: 'escrow', guidance: 'Lender verifies the property value matches the loan amount.' },
    { id: 'financing', label: 'Financing Secured', complete: false, phase: 'escrow', guidance: 'Final loan approval received. Clear to close!' },
    { id: 'closing', label: 'Closing Day', complete: !!client?.escrow_complete_date, phase: 'closing', guidance: 'Sign documents, transfer funds, receive keys. You did it!' },
    { id: 'moved', label: 'Moved In', complete: false, phase: 'post', guidance: 'Welcome home! Charlie helps with utilities, services, and settling in.' },
  ];

  // Determine current active phase based on client status
  const getCurrentPhase = () => {
    if (client?.status === 'moved' || client?.escrow_complete_date) return 'post';
    if (client?.status === 'under_contract') return 'escrow';
    if (client?.status === 'actively_searching') return 'search';
    if (client?.buyer_broker_signed) return 'search';
    if (client?.agent_name) return 'intake';
    return 'intake';
  };

  const currentPhase = getCurrentPhase();
  
  // Filter milestones based on current progress (show all up to current phase + next phase)
  const visibleMilestones = allMilestones.filter(m => {
    const phaseOrder = ['intake', 'search', 'offer', 'escrow', 'closing', 'post'];
    const currentIdx = phaseOrder.indexOf(currentPhase);
    const milestoneIdx = phaseOrder.indexOf(m.phase);
    return milestoneIdx <= currentIdx + 1; // Show current phase + next phase
  });

  // Calculate progress based on visible milestones
  const completedMilestones = visibleMilestones.filter(m => m.complete).length;
  const progressPercent = Math.round((completedMilestones / visibleMilestones.length) * 100);

  // Mid-journey pivot detection
  const hasMidJourneyIssue = () => {
    // Check for common pivot scenarios based on client data
    if (client?.notes?.includes('pivot') || client?.notes?.includes('restart')) return true;
    if (client?.status === 'inactive' && client?.buyer_broker_signed) return true;
    return false;
  };

  const showPivotGuidance = hasMidJourneyIssue();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mb-8 space-y-4"
    >
      {/* Main Profile Card */}
      <div className="rounded-3xl overflow-hidden" style={{ background: '#2a2a2a', border: `1px solid ${GOLD}33` }}>
        {/* Header with Progress */}
        <div className="px-6 py-5 flex items-center justify-between" style={{ background: '#1a1a1a', borderBottom: `1px solid ${GOLD}22` }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}33` }}>
              <Sparkles className="w-5 h-5" style={{ color: GOLD }} />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: '#fff' }}>Your Relocation Profile</p>
              <p className="text-xs" style={{ color: '#888' }}>This drives everything we do for you</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Progress Ring */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: '#0a0a0a', border: '1px solid #333' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" 
                style={{ 
                  background: `conic-gradient(${GOLD} ${progressPercent * 3.6}deg, #333 0deg)`,
                  color: '#fff'
                }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#0a0a0a' }}>
                  {progressPercent}%
                </span>
              </div>
              <span className="text-xs" style={{ color: '#888' }}>{completedMilestones}/{visibleMilestones.length} complete</span>
            </div>
            {!editing ? (
              <Button variant="ghost" size="sm" onClick={() => setEditing(true)}
                className="gap-1.5 rounded-lg h-8" style={{ color: GOLD, border: `1px solid ${GOLD}44` }}>
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setEditing(false)}
                  className="rounded-lg h-8 w-8 p-0" style={{ color: '#888' }}>
                  <X className="w-4 h-4" />
                </Button>
                <Button size="sm" onClick={handleSave} disabled={saving}
                  className="rounded-lg h-8" style={{ background: GOLD, color: '#000' }}>
                  {saving ? '...' : <Check className="w-4 h-4" />}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Grid */}
        <div className="p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Destination */}
            <div className="rounded-2xl p-4" style={{ background: '#1a1a1a', border: '1px solid #333' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${GOLD}15` }}>
                  <MapPin className="w-4 h-4" style={{ color: GOLD }} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#666' }}>Destination</span>
              </div>
              {editing ? (
                <Input 
                  value={form.destination_city} 
                  onChange={e => setForm(p => ({ ...p, destination_city: e.target.value }))}
                  placeholder="City, State" 
                  className="border-0 rounded-lg h-9 text-sm" 
                  style={{ background: '#0a0a0a', color: '#fff' }} 
                />
              ) : (
                <p className="font-bold text-lg" style={{ color: '#fff' }}>
                  {client?.destination_city ? `${client.destination_city}${destState ? `, ${destState}` : ''}` : '—'}
                </p>
              )}
            </div>

            {/* Timeline */}
            <div className="rounded-2xl p-4" style={{ background: '#1a1a1a', border: '1px solid #333' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${GOLD}15` }}>
                  <Calendar className="w-4 h-4" style={{ color: GOLD }} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#666' }}>Timeline</span>
              </div>
              {editing ? (
                <select 
                  value={form.move_date || ''} 
                  onChange={e => setForm(p => ({ ...p, move_date: e.target.value }))}
                  className="w-full rounded-lg h-9 text-sm px-3 border-0"
                  style={{ background: '#0a0a0a', color: '#fff' }}>
                  <option value="">Select...</option>
                  {TIMELINES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              ) : (
                <p className="font-bold text-lg" style={{ color: '#fff' }}>
                  {client?.move_date || timeline || '—'}
                </p>
              )}
            </div>

            {/* Budget */}
            <div className="rounded-2xl p-4" style={{ background: '#1a1a1a', border: '1px solid #333' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${GOLD}15` }}>
                  <DollarSign className="w-4 h-4" style={{ color: GOLD }} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#666' }}>Budget</span>
              </div>
              {editing ? (
                <select 
                  value={form.budget || ''} 
                  onChange={e => setForm(p => ({ ...p, budget: e.target.value }))}
                  className="w-full rounded-lg h-9 text-sm px-3 border-0"
                  style={{ background: '#0a0a0a', color: '#fff' }}>
                  <option value="">Select...</option>
                  {BUDGET_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              ) : (
                <p className="font-bold text-lg" style={{ color: '#fff' }}>
                  {client?.budget?.replace(/_/g, ' ').replace(/k/g, 'K').replace(/m/g, 'M') || '—'}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="rounded-2xl p-4" style={{ background: '#1a1a1a', border: '1px solid #333' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${GOLD}15` }}>
                  <TrendingUp className="w-4 h-4" style={{ color: GOLD }} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#666' }}>Status</span>
              </div>
              <p className="font-bold text-lg capitalize" style={{ color: GOLD }}>
                {client?.status?.replace(/_/g, ' ') || 'New Lead'}
              </p>
            </div>
          </div>

          {/* Milestones Row - Full Journey */}
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid #333' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#666' }}>Your Relocation Journey</p>
              <span className="text-xs px-2 py-1 rounded-full" style={{ background: '#0a0a0a', color: '#888', border: '1px solid #333' }}>
                Phase: <span style={{ color: GOLD, textTransform: 'capitalize' }}>{currentPhase}</span>
              </span>
            </div>
            
            {/* Mid-Journey Pivot Alert */}
            {showPivotGuidance && (
              <div className="mb-4 p-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#f59e0b' }} />
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#f59e0b' }}>Mid-Journey Pivot Detected</p>
                    <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      Changes happen. Your profile adapts. Charlie can guide you through timeline shifts, destination changes, or starting fresh with a new agent.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Milestones by Phase */}
            <div className="space-y-3">
              {['intake', 'search', 'offer', 'escrow', 'closing', 'post'].map(phase => {
                const phaseMilestones = visibleMilestones.filter(m => m.phase === phase);
                if (phaseMilestones.length === 0) return null;
                
                const isActivePhase = phase === currentPhase;
                const isPastPhase = ['intake', 'search', 'offer', 'escrow', 'closing', 'post'].indexOf(phase) < ['intake', 'search', 'offer', 'escrow', 'closing', 'post'].indexOf(currentPhase);
                
                return (
                  <div key={phase} className="rounded-xl p-3" style={{ 
                    background: isActivePhase ? 'rgba(212,175,55,0.05)' : '#0a0a0a',
                    border: isActivePhase ? `1px solid ${GOLD}33` : '1px solid #222'
                  }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold uppercase" style={{ 
                        color: isActivePhase ? GOLD : isPastPhase ? '#666' : '#444',
                        textTransform: 'capitalize'
                      }}>
                        {phase === 'post' ? 'Post-Move' : phase} Phase
                      </span>
                      {isActivePhase && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: GOLD, color: '#000' }}>Current</span>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {phaseMilestones.map((m, i) => (
                        <div 
                          key={m.id}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-help transition-all hover:scale-105"
                          style={{ 
                            background: m.complete ? 'rgba(34,197,94,0.1)' : isActivePhase ? 'rgba(212,175,55,0.1)' : '#151515',
                            border: m.complete ? '1px solid rgba(34,197,94,0.3)' : isActivePhase ? `1px solid ${GOLD}44` : '1px solid #2a2a2a'
                          }}
                          title={m.guidance}
                        >
                          <div 
                            className="w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: m.complete ? '#22c55e' : isActivePhase ? GOLD : '#333' }}>
                            {m.complete ? <Check className="w-3 h-3 text-black" /> : <span className="text-xs text-white">{allMilestones.findIndex(am => am.id === m.id) + 1}</span>}
                          </div>
                          <span className="text-sm font-medium" style={{ color: m.complete ? '#4ade80' : isActivePhase ? '#fff' : '#666' }}>
                            {m.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Progress summary */}
            <div className="mt-4 flex items-center justify-between p-3 rounded-xl" style={{ background: '#0a0a0a', border: '1px solid #222' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" 
                  style={{ 
                    background: `conic-gradient(${GOLD} ${progressPercent * 3.6}deg, #333 0deg)`,
                    color: '#fff'
                  }}>
                  <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#0a0a0a' }}>
                    {progressPercent}%
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: '#fff' }}>Journey Progress</p>
                  <p className="text-xs" style={{ color: '#888' }}>{completedMilestones} of {visibleMilestones.length} milestones complete</p>
                </div>
              </div>
              {!client?.buyer_broker_signed && (
                <p className="text-xs text-right max-w-[200px]" style={{ color: '#666' }}>
                  Complete intake milestones to unlock full City Guide
                </p>
              )}
            </div>
          </div>

          {/* Priorities */}
          {client?.priorities?.length > 0 && (
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid #333' }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#666' }}>Your Priorities</p>
              <div className="flex flex-wrap gap-2">
                {client.priorities.map(p => (
                  <span key={p} className="px-3 py-1.5 rounded-full text-sm font-medium"
                    style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}33`, color: GOLD }}>
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Things That Change Panel */}
      <div className="rounded-3xl overflow-hidden" style={{ background: '#1a1a1a', border: '1px solid #333' }}>
        <button
          onClick={() => setShowCautions(s => !s)}
          className="w-full flex items-center justify-between px-6 py-4 transition-all hover:bg-white/5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
              <AlertTriangle className="w-5 h-5" style={{ color: '#f59e0b' }} />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold" style={{ color: '#f59e0b' }}>Things That Change Mid-Journey</p>
              <p className="text-xs" style={{ color: '#888' }}>Be ready for these common pivots</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: '#666' }}>{showCautions ? 'Hide' : 'Show'} 6 items</span>
            {showCautions ? <ChevronUp className="w-5 h-5" style={{ color: '#666' }} /> : <ChevronDown className="w-5 h-5" style={{ color: '#666' }} />}
          </div>
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
              <div className="px-6 pb-6">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {CAUTIONS.map((c, i) => {
                    const Icon = c.icon;
                    return (
                      <div 
                        key={i} 
                        className="group rounded-2xl p-4 transition-all hover:scale-[1.02]"
                        style={{ 
                          background: '#0a0a0a', 
                          border: '1px solid #222',
                        }}>
                        <div className="flex items-start gap-3">
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: `${c.color}15`, border: `1px solid ${c.color}30` }}>
                            <Icon className="w-5 h-5" style={{ color: c.color }} />
                          </div>
                          <div>
                            <p className="text-sm font-bold mb-1" style={{ color: '#fff' }}>{c.title}</p>
                            <p className="text-xs leading-relaxed" style={{ color: '#888' }}>{c.desc}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl" style={{ background: '#0a0a0a', border: '1px dashed #333' }}>
                  <Sparkles className="w-4 h-4" style={{ color: GOLD }} />
                  <p className="text-sm" style={{ color: '#888' }}>
                    Any of these happen? Just tell <span style={{ color: GOLD }}>Charlie</span> — your profile updates instantly.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}