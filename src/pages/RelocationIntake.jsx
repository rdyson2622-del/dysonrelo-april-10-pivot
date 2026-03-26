import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle2, MapPin, Users, Sparkles, Shield, Zap } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const SERVICE_AGREEMENTS = [
  'I understand this service is completely FREE to me as the buyer — agent compensation is handled separately.',
  'I agree to work exclusively with a Dyson & Dyson referred agent for my destination purchase.',
  'I consent to this conversation being recorded and summarized to build my relocation profile.',
  'I understand my profile will be reviewed by Dyson & Dyson staff to match me with the right agent.',
  'I agree that all official transaction communications will flow through the Dyson platform.',
];

const GOLD = '#D4AF37';
const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";

const BUDGET_OPTIONS = [
  { value: 'under_200k', label: 'Under $200K' },
  { value: '200k_400k', label: '$200K – $400K' },
  { value: '400k_600k', label: '$400K – $600K' },
  { value: '600k_800k', label: '$600K – $800K' },
  { value: '800k_1m', label: '$800K – $1M' },
  { value: 'over_1m', label: 'Over $1M' },
];

const TIMELINE_OPTIONS = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '1_3_months', label: '1–3 months' },
  { value: '3_6_months', label: '3–6 months' },
  { value: '6_12_months', label: '6–12 months' },
  { value: 'over_1_year', label: 'Over a year' },
  { value: 'just_exploring', label: 'Just exploring for now' },
];

const PRIORITY_OPTIONS = [
  'Schools', 'Commute', 'Walkability', 'Safety', 'Nature',
  'Healthcare', 'Religious Community', 'Nightlife', 'Shopping', 'Dining',
];

const STEPS = ['Your Info', 'Your Move', 'Priorities', 'Confirm'];

export default function RelocationIntake() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  const [agreedItems, setAgreedItems] = useState([]);

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    current_city: '',
    destination_city: '',
    move_date: '',
    budget: '',
    family_size: '',
    priorities: [],
    notes: '',
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const togglePriority = (p) => {
    setForm(f => ({
      ...f,
      priorities: f.priorities.includes(p)
        ? f.priorities.filter(x => x !== p)
        : [...f.priorities, p],
    }));
  };

  const canNext = () => {
    if (step === 0) return form.full_name.trim() && form.email.trim();
    if (step === 1) return form.destination_city.trim() && form.budget && form.move_date;
    return true;
  };

  const toggleAgreement = (item) => {
    setAgreedItems(prev =>
      prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
    );
  };

  const allAgreed = agreedItems.length === SERVICE_AGREEMENTS.length;

  const handleSubmit = async () => {
    setSubmitting(true);
    await base44.entities.RelocationClient.create({
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
      current_city: form.current_city,
      destination_city: form.destination_city,
      move_date: form.move_date === 'asap' ? '' : form.move_date,
      budget: form.budget,
      family_size: form.family_size ? parseInt(form.family_size) : undefined,
      priorities: form.priorities.map(p => p.toLowerCase().replace(' ', '_')),
      notes: form.notes,
      status: 'in_consultation',
    });

    // Send intake notification email
    base44.integrations.Core.SendEmail({
      to: 'bob@dysonconcierge.com',
      subject: `New Relocation Intake: ${form.full_name} → ${form.destination_city}`,
      body: `New client intake submitted:\n\nName: ${form.full_name}\nEmail: ${form.email}\nPhone: ${form.phone}\nFrom: ${form.current_city}\nTo: ${form.destination_city}\nTimeline: ${form.move_date}\nBudget: ${form.budget}\nFamily Size: ${form.family_size}\nPriorities: ${form.priorities.join(', ')}\nNotes: ${form.notes}`,
    }).catch(() => {});

    setSubmitting(false);
    setSubmitted(true);
  };

  if (showAgreement) {
    return (
      <div className="min-h-screen" style={{ background: '#808080' }}>
        <nav className="flex items-center justify-between px-6 md:px-14 py-4" style={{ background: '#000', borderBottom: '1px solid rgba(212,175,55,0.12)' }}>
          <Link to="/Home">
            <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-10 w-auto" />
          </Link>
          <button onClick={() => setShowAgreement(false)} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </nav>

        <div className="max-w-2xl mx-auto px-6 py-12">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2" style={{ color: GOLD }}>
              <Zap className="w-4 h-4" />
              <span className="text-xs font-bold tracking-[0.3em]">BEFORE WE BEGIN</span>
            </div>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Charlie will hand you off to Gemini for your private relocation interview.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl p-8"
            style={{ background: '#000', border: '1px solid rgba(212,175,55,0.25)' }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-6 h-6" style={{ color: GOLD }} />
              <h2 className="text-2xl font-bold" style={{ color: '#fff' }}>Service Agreement</h2>
            </div>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>Please check each item to confirm you understand</p>

            <div className="space-y-3 mb-8">
              {SERVICE_AGREEMENTS.map((item, i) => {
                const checked = agreedItems.includes(item);
                return (
                  <button
                    key={i}
                    onClick={() => toggleAgreement(item)}
                    className="w-full flex items-start gap-3 p-4 rounded-xl text-left transition-all"
                    style={{
                      background: checked ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${checked ? GOLD : 'rgba(255,255,255,0.1)'}`,
                    }}
                  >
                    <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 transition-all"
                      style={{
                        background: checked ? GOLD : 'transparent',
                        border: `2px solid ${checked ? GOLD : 'rgba(255,255,255,0.3)'}`,
                      }}>
                      {checked && <CheckCircle2 className="w-3 h-3" style={{ color: '#000' }} />}
                    </div>
                    <span className="text-sm leading-relaxed" style={{ color: checked ? '#fff' : 'rgba(255,255,255,0.7)' }}>
                      {item}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!allAgreed || submitting}
              className="w-full py-4 rounded-xl text-sm font-bold tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed gold-btn"
            >
              {submitting ? 'Submitting...' : 'I Agree — Start My Session'} <Zap className="w-4 h-4" />
            </button>

            <p className="text-xs text-center mt-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
              By proceeding you agree to Dyson & Dyson's terms of service and privacy policy.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#808080' }}>
      <nav className="flex items-center justify-between px-6 md:px-14 py-4" style={{ background: '#000', borderBottom: '1px solid rgba(212,175,55,0.12)' }}>
        <Link to="/Home"><img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-10 w-auto" /></Link>
        <Link to="/Home" className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </nav>
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(212,175,55,0.15)', border: `2px solid ${GOLD}` }}>
            <CheckCircle2 className="w-10 h-10" style={{ color: GOLD }} />
          </div>
          <h1 className="display-heading mb-4" style={{ fontSize: '2.5rem', letterSpacing: '0.2em', color: '#fff' }}>
            You're In.
          </h1>
          <p className="text-base mb-2" style={{ color: '#fff' }}>
            Welcome to Dyson & Dyson Concierge Relocation, <strong style={{ color: GOLD }}>{form.full_name}</strong>.
          </p>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Bob Dyson's team has received your relocation profile. We'll be in touch shortly to schedule your private session and begin building your plan.
          </p>
          <p className="text-xs mb-8" style={{ color: 'rgba(212,175,55,0.7)' }}>
            Remember — this service is 100% free to you as the buyer. Always.
          </p>
          <Link to="/Dashboard">
            <button className="gold-btn px-8 py-3 rounded-full text-sm font-bold tracking-wide">
              Go to My Dashboard <ArrowRight className="inline w-4 h-4 ml-1" />
            </button>
          </Link>
        </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#808080' }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-14 py-4" style={{ background: '#000', borderBottom: '1px solid rgba(212,175,55,0.12)' }}>
        <Link to="/Home">
          <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-10 w-auto" />
        </Link>
        <Link to="/Home" className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <p className="text-xs font-bold tracking-[0.3em] mb-3" style={{ color: GOLD }}>DYSON & DYSON CONCIERGE</p>
          <h1 className="display-heading mb-3" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '0.18em', color: '#fff' }}>
            Let's Plan Your Move
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Tell us about your relocation and we'll build your personalized plan — completely free.
          </p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {STEPS.map((label, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                  style={{
                    background: i <= step ? GOLD : 'rgba(255,255,255,0.1)',
                    color: i <= step ? '#000' : 'rgba(255,255,255,0.4)',
                  }}>
                  {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className="text-xs hidden sm:block" style={{ color: i === step ? GOLD : 'rgba(255,255,255,0.4)' }}>{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-px mb-5" style={{ background: i < step ? GOLD : 'rgba(255,255,255,0.15)', maxWidth: '60px' }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form Card */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl p-8"
          style={{ background: '#000', border: `1px solid rgba(212,175,55,0.25)` }}
        >
          {/* STEP 0 — Your Info */}
          {step === 0 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-5 h-5" style={{ color: GOLD }} />
                <h2 className="font-bold text-lg" style={{ color: '#fff' }}>About You</h2>
              </div>
              <Field label="Full Name *" value={form.full_name} onChange={v => set('full_name', v)} placeholder="Jane Smith" />
              <Field label="Email Address *" value={form.email} onChange={v => set('email', v)} placeholder="jane@email.com" type="email" />
              <Field label="Phone Number" value={form.phone} onChange={v => set('phone', v)} placeholder="(555) 123-4567" type="tel" />
              <Field label="Current City" value={form.current_city} onChange={v => set('current_city', v)} placeholder="San Diego, CA" />
              <Field label="Family Size" value={form.family_size} onChange={v => set('family_size', v)} placeholder="e.g. 4" type="number" />
            </div>
          )}

          {/* STEP 1 — Your Move */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-5 h-5" style={{ color: GOLD }} />
                <h2 className="font-bold text-lg" style={{ color: '#fff' }}>Your Relocation</h2>
              </div>
              <Field label="Destination City *" value={form.destination_city} onChange={v => set('destination_city', v)} placeholder="Austin, TX" />

              <div>
                <label className="block text-xs font-bold tracking-wider mb-2" style={{ color: GOLD }}>Moving Timeline *</label>
                <div className="grid grid-cols-2 gap-2">
                  {TIMELINE_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => set('move_date', opt.value)}
                      className="px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all"
                      style={{
                        background: form.move_date === opt.value ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${form.move_date === opt.value ? GOLD : 'rgba(255,255,255,0.1)'}`,
                        color: form.move_date === opt.value ? GOLD : 'rgba(255,255,255,0.7)',
                      }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-wider mb-2" style={{ color: GOLD }}>Home Budget *</label>
                <div className="grid grid-cols-2 gap-2">
                  {BUDGET_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => set('budget', opt.value)}
                      className="px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all"
                      style={{
                        background: form.budget === opt.value ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${form.budget === opt.value ? GOLD : 'rgba(255,255,255,0.1)'}`,
                        color: form.budget === opt.value ? GOLD : 'rgba(255,255,255,0.7)',
                      }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — Priorities */}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5" style={{ color: GOLD }} />
                <h2 className="font-bold text-lg" style={{ color: '#fff' }}>What Matters Most?</h2>
              </div>
              <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.6)' }}>Select all that apply — this helps us find the right neighborhoods and agent for you.</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {PRIORITY_OPTIONS.map(p => (
                  <button key={p} onClick={() => togglePriority(p)}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                    style={{
                      background: form.priorities.includes(p) ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${form.priorities.includes(p) ? GOLD : 'rgba(255,255,255,0.1)'}`,
                      color: form.priorities.includes(p) ? GOLD : 'rgba(255,255,255,0.6)',
                    }}>
                    {p}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-xs font-bold tracking-wider mb-2" style={{ color: GOLD }}>Anything Else We Should Know?</label>
                <textarea
                  value={form.notes}
                  onChange={e => set('notes', e.target.value)}
                  placeholder="Special circumstances, must-haves, deal-breakers..."
                  rows={4}
                  className="w-full rounded-xl px-4 py-3 text-sm resize-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                />
              </div>
            </div>
          )}

          {/* STEP 3 — Confirm */}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle2 className="w-5 h-5" style={{ color: GOLD }} />
                <h2 className="font-bold text-lg" style={{ color: '#fff' }}>Confirm Your Profile</h2>
              </div>
              <div className="space-y-3 mb-6">
                {[
                  { label: 'Name', value: form.full_name },
                  { label: 'Email', value: form.email },
                  { label: 'Phone', value: form.phone || '—' },
                  { label: 'Moving From', value: form.current_city || '—' },
                  { label: 'Moving To', value: form.destination_city },
                  { label: 'Timeline', value: TIMELINE_OPTIONS.find(t => t.value === form.move_date)?.label || '—' },
                  { label: 'Budget', value: BUDGET_OPTIONS.find(b => b.value === form.budget)?.label || '—' },
                  { label: 'Family Size', value: form.family_size || '—' },
                  { label: 'Priorities', value: form.priorities.join(', ') || 'None selected' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-start gap-4 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="text-xs font-bold tracking-wider shrink-0" style={{ color: GOLD }}>{label}</span>
                    <span className="text-sm text-right" style={{ color: '#fff' }}>{value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>
                By submitting, you agree to be contacted by the Dyson & Dyson team. This service is always free to buyers.
              </p>
            </div>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6">
          {step > 0 ? (
            <button onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext()}
              className="gold-btn px-7 py-2.5 rounded-full text-sm font-bold tracking-wide flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setShowAgreement(true)}
              className="gold-btn px-7 py-2.5 rounded-full text-sm font-bold tracking-wide flex items-center gap-2">
              Review & Agree <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="block text-xs font-bold tracking-wider mb-1.5" style={{ color: '#D4AF37' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl px-4 py-3 text-sm"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
      />
    </div>
  );
}