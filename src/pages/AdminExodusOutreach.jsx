import React, { useState } from 'react';
import { Copy, CheckCircle, MessageSquare, ArrowRight } from 'lucide-react';

const GOLD = '#D4AF37';
const TAN = '#ede0cc';

const SMS_TEMPLATE = `Hi [Agent Name], congrats on the new listing on [Street Name]. I'm with Dyson & Dyson. Since your sellers are moving out of [City], we want to help you monetize that move. We manage the destination vetting and logistics, securing a 25% referral fee for you with zero extra paperwork. See how we act as your national relo department: dysonrelo.com/exodus`;

const TIPS = [
  { label: 'Who to target', body: 'Independent boutique agents who just listed in outflow markets (LA, SF, Seattle, Chicago). Exclude Compass, Coldwell, Sotheby\'s, KW, eXp.' },
  { label: 'When to send', body: 'Within 48 hours of a new listing appearing on MLS. The agent is still in "seller mode" and most receptive to referral conversations.' },
  { label: 'How to find them', body: 'Pull new listings from Zillow/Redfin in exodus zip codes. Filter for non-franchise listing agents. Run their name through the Master Roster to check status.' },
  { label: 'Follow-up', body: 'If no reply in 3 days, send a single follow-up: "Just checking — does your seller have a destination in mind?" Keep it peer-to-peer, never salesy.' },
];

export default function AdminExodusOutreach() {
  const [agentName, setAgentName] = useState('');
  const [streetName, setStreetName] = useState('');
  const [city, setCity] = useState('');
  const [copied, setCopied] = useState(false);

  const personalized = SMS_TEMPLATE
    .replace('[Agent Name]', agentName || '[Agent Name]')
    .replace('[Street Name]', streetName || '[Street Name]')
    .replace('[City]', city || '[City]');

  const handleCopy = () => {
    navigator.clipboard.writeText(personalized);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen px-6 py-10" style={{ background: TAN }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-black tracking-[0.3em] mb-2" style={{ color: GOLD }}>PRN · TARGETING</p>
          <h1 className="font-black text-3xl leading-tight mb-3" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#1a1a1a' }}>
            Exodus Agent Outreach
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: '#4a3a28' }}>
            Peer-to-peer SMS strategy for independent listing agents in outflow markets. Personalize below, then copy and send.
          </p>
        </div>

        {/* Personalizer */}
        <div className="rounded-2xl overflow-hidden mb-6" style={{ border: `2px solid ${GOLD}` }}>
          <div className="px-5 py-4" style={{ background: '#0d0d0d' }}>
            <p className="text-xs font-black tracking-[0.25em] uppercase" style={{ color: GOLD }}>PERSONALIZE YOUR MESSAGE</p>
          </div>
          <div className="px-5 py-5 space-y-4" style={{ background: '#fff8ee' }}>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-black tracking-widest uppercase block mb-1" style={{ color: GOLD }}>Agent First Name</label>
                <input value={agentName} onChange={e => setAgentName(e.target.value)}
                  placeholder="e.g. Sarah"
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: '#ede0cc', border: '1px solid rgba(212,175,55,0.4)', color: '#1a1a1a' }} />
              </div>
              <div>
                <label className="text-[10px] font-black tracking-widest uppercase block mb-1" style={{ color: GOLD }}>Street Name</label>
                <input value={streetName} onChange={e => setStreetName(e.target.value)}
                  placeholder="e.g. Oak Ave"
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: '#ede0cc', border: '1px solid rgba(212,175,55,0.4)', color: '#1a1a1a' }} />
              </div>
              <div>
                <label className="text-[10px] font-black tracking-widest uppercase block mb-1" style={{ color: GOLD }}>Their City</label>
                <input value={city} onChange={e => setCity(e.target.value)}
                  placeholder="e.g. San Francisco"
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: '#ede0cc', border: '1px solid rgba(212,175,55,0.4)', color: '#1a1a1a' }} />
              </div>
            </div>

            {/* Message Preview */}
            <div>
              <label className="text-[10px] font-black tracking-widest uppercase block mb-2" style={{ color: GOLD }}>
                <MessageSquare className="w-3 h-3 inline mr-1" />Message Preview
              </label>
              <div className="rounded-xl px-4 py-4 text-sm leading-relaxed relative"
                style={{ background: '#ede0cc', border: '1px solid rgba(212,175,55,0.3)', color: '#2a1f0e', fontFamily: 'Georgia, serif' }}>
                {personalized}
              </div>
            </div>

            <button onClick={handleCopy}
              className="w-full py-3 rounded-full font-black text-sm tracking-wide flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              style={{ background: copied ? 'rgba(16,185,129,0.15)' : `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: copied ? '#059669' : '#000', border: copied ? '1px solid rgba(16,185,129,0.4)' : 'none' }}>
              {copied ? <><CheckCircle className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Message</>}
            </button>
          </div>
        </div>

        {/* Tips */}
        <p className="text-xs font-black tracking-[0.25em] uppercase mb-4" style={{ color: GOLD }}>OUTREACH STRATEGY</p>
        <div className="space-y-3 mb-8">
          {TIPS.map((tip, i) => (
            <div key={i} className="flex gap-4 rounded-2xl px-5 py-4"
              style={{ background: '#fff8ee', border: '1px solid rgba(212,175,55,0.2)' }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-black text-xs mt-0.5"
                style={{ background: 'rgba(212,175,55,0.2)', color: GOLD }}>
                {i + 1}
              </div>
              <div>
                <p className="font-black text-sm mb-0.5" style={{ color: '#1a1a1a' }}>{tip.label}</p>
                <p className="text-xs leading-relaxed" style={{ color: '#4a3a28' }}>{tip.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA to Roster */}
        <div className="rounded-2xl px-6 py-5 flex items-center justify-between"
          style={{ background: '#0d0d0d', border: `1px solid ${GOLD}` }}>
          <div>
            <p className="text-xs font-black tracking-widest uppercase mb-1" style={{ color: GOLD }}>Filter Independent Agents</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>Use the "Independent Only" toggle in the Master Roster to generate your outreach list.</p>
          </div>
          <a href="/admin/roster"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-sm shrink-0 ml-4 transition-all hover:scale-[1.02]"
            style={{ background: `linear-gradient(135deg, #e8c84a, ${GOLD})`, color: '#000' }}>
            Roster <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="h-12" />
      </div>
    </div>
  );
}