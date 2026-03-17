import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Check, ChevronRight, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const GOLD = '#D4AF37';

const COMMITMENTS = [
  "I understand this service is completely FREE to me as the buyer — agent compensation is handled separately.",
  "I agree to work exclusively with a Dyson & Dyson referred agent for my destination purchase.",
  "I consent to this conversation being recorded and summarized to build my relocation profile.",
  "I understand my profile will be reviewed by Dyson & Dyson staff to match me with the right agent.",
  "I agree that all official transaction communications will flow through the Dyson platform.",
];

export default function CommitmentGate({ onCommit }) {
  const [step, setStep] = useState('intro'); // intro | form | consent
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [checked, setChecked] = useState([]);

  const allChecked = checked.length === COMMITMENTS.length;

  const toggleCheck = (i) => {
    setChecked(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  };

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) return;
    setStep('consent');
  };

  const handleCommit = () => {
    if (!allChecked) return;
    onCommit({ name, email, phone });
  };

  return (
    <div className="flex-1 overflow-y-auto p-5">
      {/* INTRO */}
      {step === 'intro' && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <div className="text-center space-y-2 pt-2">
            <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center"
              style={{ background: 'rgba(212,175,55,0.12)', border: `1px solid ${GOLD}44` }}>
              <Mic className="w-8 h-8" style={{ color: GOLD }} />
            </div>
            <h2 className="text-xl font-bold" style={{ color: '#fff' }}>Meet Gemini — Your AI Relocation Advisor</h2>
            <p className="text-sm leading-relaxed" style={{ color: '#aaa' }}>
              You're about to have a live voice conversation with Google Gemini — one of the most advanced AI systems in the world — guided by Charlie, your Dyson concierge.
            </p>
          </div>

          <div className="rounded-xl p-4 space-y-3" style={{ background: '#111', border: '1px solid #2a2a2a' }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>What happens in this session</p>
            {[
              "Gemini will interview you about your relocation — destination, lifestyle, budget, family needs",
              "Your answers are saved to your private profile — reviewed only by Dyson staff",
              "We use your profile to hand-select the best agent match for your personality and needs",
              "This entire service is FREE to you",
            ].map((item, i) => (
              <div key={i} className="flex gap-2.5 items-start">
                <div className="w-4 h-4 rounded-full shrink-0 mt-0.5 flex items-center justify-center"
                  style={{ background: 'rgba(212,175,55,0.15)', border: `1px solid ${GOLD}` }}>
                  <Check className="w-2.5 h-2.5" style={{ color: GOLD }} />
                </div>
                <p className="text-xs" style={{ color: '#ccc' }}>{item}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl p-3 text-xs" style={{ background: 'rgba(212,175,55,0.06)', border: `1px solid ${GOLD}22` }}>
            <p style={{ color: '#888' }}>
              <span style={{ color: GOLD }}>Disclosure: </span>
              This session is powered by Google Gemini AI. Conversations are recorded and summarized. Information shared by Dyson & Dyson staff is proprietary and confidential. You may request deletion of your data at any time.
            </p>
          </div>

          <Button onClick={() => setStep('form')} className="w-full h-11 font-bold gap-2 rounded-xl"
            style={{ background: GOLD, color: '#000' }}>
            Get Started <ChevronRight className="w-4 h-4" />
          </Button>
        </motion.div>
      )}

      {/* FORM */}
      {step === 'form' && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div>
            <h3 className="text-lg font-bold mb-1" style={{ color: '#fff' }}>Let's get acquainted</h3>
            <p className="text-xs" style={{ color: '#666' }}>Your information is private and never sold.</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold mb-1 block" style={{ color: '#888' }}>Full Name *</label>
              <Input
                placeholder="Your full name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="border-0 rounded-xl h-11"
                style={{ background: '#1a1a1a', color: '#fff', caretColor: GOLD }}
              />
            </div>
            <div>
              <label className="text-xs font-bold mb-1 block" style={{ color: '#888' }}>Email Address *</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="border-0 rounded-xl h-11"
                style={{ background: '#1a1a1a', color: '#fff', caretColor: GOLD }}
              />
            </div>
            <div>
              <label className="text-xs font-bold mb-1 block" style={{ color: '#888' }}>Phone (optional)</label>
              <Input
                type="tel"
                placeholder="(555) 000-0000"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="border-0 rounded-xl h-11"
                style={{ background: '#1a1a1a', color: '#fff', caretColor: GOLD }}
              />
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || !email.trim()}
            className="w-full h-11 font-bold gap-2 rounded-xl disabled:opacity-30"
            style={{ background: GOLD, color: '#000' }}>
            Continue to Agreement <ChevronRight className="w-4 h-4" />
          </Button>
        </motion.div>
      )}

      {/* CONSENT */}
      {step === 'consent' && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center gap-3">
            <Shield className="w-7 h-7" style={{ color: GOLD }} />
            <div>
              <h3 className="text-2xl font-bold" style={{ color: '#fff' }}>Service Agreement</h3>
              <p className="text-sm" style={{ color: '#666' }}>Please check each item to confirm you understand</p>
            </div>
          </div>

          <div className="space-y-2">
            {COMMITMENTS.map((item, i) => (
              <button
                key={i}
                onClick={() => toggleCheck(i)}
                className="w-full text-left flex gap-3 items-start p-3 rounded-xl transition-all"
                style={{
                  background: checked.includes(i) ? 'rgba(212,175,55,0.1)' : '#3a3a3a',
                  border: checked.includes(i) ? `1px solid ${GOLD}44` : '1px solid #555',
                }}>
                <div className="w-5 h-5 rounded-md shrink-0 mt-0.5 flex items-center justify-center transition-all"
                  style={{
                    background: checked.includes(i) ? GOLD : 'transparent',
                    border: `1px solid ${GOLD}`,
                  }}>
                  {checked.includes(i) && <Check className="w-3 h-3 text-black" />}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: checked.includes(i) ? '#ddd' : '#bbb', fontSize: '1rem' }}>{item}</p>
              </button>
            ))}
          </div>

          <Button
            onClick={handleCommit}
            disabled={!allChecked}
            className="w-full h-11 font-bold gap-2 rounded-xl disabled:opacity-30"
            style={{ background: GOLD, color: '#000' }}>
            I Agree — Start My Session <Mic className="w-4 h-4" />
          </Button>

          <p className="text-center text-xs" style={{ color: '#444' }}>
            By proceeding you agree to Dyson & Dyson's terms of service and privacy policy.
          </p>
        </motion.div>
      )}
    </div>
  );
}