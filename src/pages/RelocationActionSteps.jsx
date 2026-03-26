import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Circle, MapPin, UserCheck, Home, Search, Building2, FileText, Key, Truck, ChevronDown, ChevronUp } from 'lucide-react';

const GOLD = '#D4AF37';
const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";

const PHASES = [
  {
    number: 1,
    icon: UserCheck,
    title: 'Onboarding & Profile',
    questions: ['Full Name', 'Email', 'Destination City', 'Budget', 'Timeline', 'Priorities'],
  },
  {
    number: 2,
    icon: UserCheck,
    title: 'Agent Match',
    questions: ['Agent Personality Fit', 'Top 3 Candidate Preferences', 'Selected Agent', 'Agent Contact Info'],
  },
  {
    number: 3,
    icon: Search,
    title: 'Property Search',
    questions: ['Target Neighborhoods', 'Property Type', 'Must-Have Features', 'Properties Viewed', 'Top Picks'],
  },
  {
    number: 4,
    icon: MapPin,
    title: 'Community Research',
    questions: ['Schools & Education', 'Neighborhoods', 'Healthcare', 'Recreation', 'Cost of Living'],
  },
  {
    number: 5,
    icon: Building2,
    title: 'Due Diligence',
    questions: ['Inspection Reports', 'HOA Details', 'Hazard Zone Analysis', 'Environmental Report'],
  },
  {
    number: 6,
    icon: FileText,
    title: 'Purchase Agreement',
    questions: ['Offer Amount', 'Contingencies', 'Closing Timeline', 'Contingency Strategy'],
  },
  {
    number: 7,
    icon: Key,
    title: 'Escrow & Closing',
    questions: ['Title Status', 'Appraisal', 'Final Walkthrough', 'Closing Date'],
  },
  {
    number: 8,
    icon: Truck,
    title: 'Moving & Setup',
    questions: ['Moving Company', 'Utilities Transfer', 'Internet Setup', 'School Enrollment', 'Healthcare Setup'],
  },
];

export default function RelocationActionSteps() {
  const navigate = useNavigate();
  const [clientId, setClientId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [expandedPhase, setExpandedPhase] = useState(1);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const user = await base44.auth.me();
        if (user?.email) {
          const clients = await base44.entities.RelocationClient.filter({ email: user.email }, '-created_date', 1);
          if (clients.length > 0) {
            setClientId(clients[0].id);
            // Load any existing MovingPlan data
            const plans = await base44.entities.MovingPlan.filter({ client_id: clients[0].id });
            if (plans.length > 0) {
              // Pre-populate with existing data structure if available
            }
          }
        }
      } catch (err) {
        console.error('Error fetching client:', err);
      }
    };
    fetchClient();
  }, []);

  const updateAnswer = (phaseNum, question, value) => {
    setAnswers(prev => ({
      ...prev,
      [phaseNum]: {
        ...(prev[phaseNum] || {}),
        [question]: value,
      },
    }));
  };

  const getPhaseCompletion = (phaseNum) => {
    const phaseAnswers = answers[phaseNum] || {};
    const totalQuestions = PHASES[phaseNum - 1].questions.length;
    const filledAnswers = Object.values(phaseAnswers).filter(v => v && v.trim()).length;
    return { filled: filledAnswers, total: totalQuestions };
  };

  const saveProgress = async () => {
    if (!clientId) return;
    try {
      await base44.entities.MovingPlan.create({
        client_id: clientId,
        destination_city: answers[1]?.['Destination City'] || '',
        destination_state: '',
        budget_range: answers[1]?.['Budget'] || '',
        move_timeline: answers[1]?.['Timeline'] || '',
        neighborhoods: (answers[4]?.['Target Neighborhoods'] || '').split(',').map(n => n.trim()),
        priorities: (answers[1]?.['Priorities'] || '').split(',').map(p => p.trim()),
        property_type: answers[3]?.['Property Type'] || '',
        action_items: Object.keys(answers).flatMap(phaseNum => 
          Object.entries(answers[phaseNum] || {}).map(([q, a]) => `${PHASES[parseInt(phaseNum) - 1].title}: ${q} - ${a}`)
        ),
        notes: 'Relocation action steps saved',
      });
    } catch (err) {
      console.error('Error saving progress:', err);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#808080' }}>
      {/* Header with back button */}
      <nav className="flex items-center justify-between px-6 md:px-14 py-4" style={{ background: '#000', borderBottom: '1px solid rgba(212,175,55,0.12)' }}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <Link to="/Home">
          <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-10 w-auto" />
        </Link>
        <div className="w-20" />
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <p className="text-xs font-bold tracking-[0.3em] mb-2" style={{ color: GOLD }}>ACTION STEPS</p>
          <h1 className="display-heading mb-3" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '0.18em', color: '#fff' }}>
            Your Relocation Checklist
          </h1>
          <p className="text-sm max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Work through each phase — answer the questions, track progress, and we'll store everything for your reference.
          </p>
        </motion.div>

        {/* Phases */}
        <div className="space-y-3 mb-8">
          {PHASES.map((phase, i) => {
            const Icon = phase.icon;
            const { filled, total } = getPhaseCompletion(phase.number);
            const isOpen = expandedPhase === phase.number;
            const isComplete = filled === total;

            return (
              <motion.div
                key={phase.number}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: '#000',
                  border: isOpen ? `2px solid ${GOLD}` : '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {/* Phase Header */}
                <button
                  onClick={() => setExpandedPhase(isOpen ? null : phase.number)}
                  className="w-full flex items-center gap-4 px-6 py-4 text-left transition-all hover:bg-white/5"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: isComplete ? GOLD : 'rgba(255,255,255,0.07)',
                      border: isComplete ? 'none' : `1px solid rgba(255,255,255,0.15)`,
                    }}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="w-5 h-5" style={{ color: '#000' }} />
                    ) : (
                      <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {filled}/{total}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm" style={{ color: '#fff' }}>
                        Phase {phase.number}: {phase.title}
                      </h3>
                      {isComplete && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: GOLD, color: '#000' }}>
                          COMPLETE
                        </span>
                      )}
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {filled} of {total} questions answered
                    </p>
                  </div>

                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }} />
                  ) : (
                    <ChevronDown className="w-4 h-4 shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }} />
                  )}
                </button>

                {/* Expanded Content */}
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-6 space-y-3 border-t border-white/10"
                  >
                    {phase.questions.map((question, j) => (
                      <div key={j}>
                        <label className="block text-xs font-bold tracking-wider mb-1.5" style={{ color: GOLD }}>
                          {question}
                        </label>
                        <input
                          type="text"
                          value={answers[phase.number]?.[question] || ''}
                          onChange={e => updateAnswer(phase.number, question, e.target.value)}
                          placeholder={`Enter ${question.toLowerCase()}...`}
                          className="w-full rounded-xl px-4 py-2.5 text-sm"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                        />
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Save Button */}
        <div className="flex justify-center gap-3">
          <button
            onClick={saveProgress}
            className="px-8 py-3 rounded-full text-sm font-bold tracking-wide gold-btn"
          >
            Save My Progress
          </button>
        </div>
      </main>
    </div>
  );
}