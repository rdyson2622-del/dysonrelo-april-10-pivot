import React, { useState } from 'react';
import { 
  X, MessageSquare, Mic, Calendar, Clock, ChevronRight, CheckCircle2, 
  Sparkles, Bot, User, ArrowRight, ShieldCheck, Download, History
} from 'lucide-react';

const GOLD = '#D4AF37';

export default function RetainedDialogueModal({ isOpen, onClose, subscriberRole = 'client', subscriberName = 'Bob Dyson', realLogs = [] }) {
  if (!isOpen) return null;

  // Curated historical dialogues tailored by subscriber persona if user has no prior logs yet
  const ROLE_DEFAULT_DIALOGUES = {
    client: [
      {
        id: 'dlg-1',
        date: 'Yesterday, 4:15 PM',
        type: 'voice',
        channel: 'Charlie Voice Concierge',
        title: 'Scottsdale Property Tax & Inspection Timeline Check',
        summary: 'Reviewed 2840 Silverleaf Sunset Ridge. Charlie confirmed Arizona 0.6% effective tax rate and scheduled physical inspection contingency deadline for Day 10.',
        actionTaken: 'Escrow Milestone auto-updated: Inspection Contingency Due in 4 days.',
        turns: [
          { role: 'user', text: 'Charlie, we just got the contract accepted on the Silverleaf house in Scottsdale. When is our inspection contingency release deadline?' },
          { role: 'assistant', text: 'Congratulations, Bob! In your Arizona purchase contract, your inspection contingency period is 10 calendar days from acceptance. That puts your release deadline this Friday at 5:00 PM Mountain Time. I have already flagged your vetted inspector, Dave Miller, who is scheduled for Wednesday morning.' },
          { role: 'user', text: 'What about the state property tax assessment on that property?' },
          { role: 'assistant', text: 'Maricopa County assesses at roughly 0.6% of market value, which on your $8.95M purchase comes out to approximately $53,700 annually, significantly lower than your previous California property rate. I’ve added this breakdown to your Client Financial Roadmap.' },
        ],
      },
      {
        id: 'dlg-2',
        date: 'Sep 3, 2026, 11:30 AM',
        type: 'intake',
        channel: 'Concierge Desk Inquiry',
        title: 'Vetted Agent Selection in Paradise Valley vs. Scottsdale',
        summary: 'Evaluated top 1% receiving agents specializing in luxury gated communities. Selected Sarah Jenkins with 14 neighborhood transactions.',
        actionTaken: 'Introduced to Vetted Agent Sarah Jenkins; mutual confidentiality agreement signed.',
        turns: [
          { role: 'user', text: 'We are deciding between Paradise Valley and Silverleaf in Scottsdale. Which agent in your vetted bureau has the highest transaction record in both?' },
          { role: 'assistant', text: 'Our fiduciary evaluation ranks Sarah Jenkins #1 for North Scottsdale and PV luxury relocations. She holds an average 98.4% list-to-sale closing ratio, 14 closed transactions this year, and agrees to our Dyson fiduciary code of conduct with zero kickbacks.' },
        ],
      },
    ],
    agent: [
      {
        id: 'dlg-3',
        date: 'Today, 8:45 AM',
        type: 'voice',
        channel: 'Agent Command Bureau',
        title: 'New Executive Transferee Handoff Briefing',
        summary: 'Briefed on relocating VP of Engineering moving from Seattle to Austin. Budget $3.5M–$4.5M, Westlake school district priority.',
        actionTaken: 'Client workfile initialized; 25% Dyson referral fee agreement executed in BackOffice.',
        turns: [
          { role: 'assistant', text: 'Good morning. We have an executive transferee, Marcus Vance, transferring with Oracle to Austin. He requires a 4-bedroom estate in Eanes ISD. Would you like to accept this relocation handoff?' },
          { role: 'user', text: 'Yes, I have two off-market Westlake listings that fit his criteria perfectly. Send over the intake file.' },
          { role: 'assistant', text: 'Handoff file and pre-signed 25% referral agreement dispatched to your workfile. His direct telephone number and moving timeline are now unlocked.' },
        ],
      },
    ],
    referral_agent: [
      {
        id: 'dlg-4',
        date: 'Sep 5, 2026, 2:10 PM',
        type: 'voice',
        channel: 'Referral Concierge Desk',
        title: 'Escrow Status for Referred Client Miller Family',
        summary: 'Checked status on $1.85M referral closing in Denver. Loan approval completed, closing scheduled for Sep 24.',
        actionTaken: 'Referral fee disbursement locked: $11,562.50 check routed to your brokerage.',
        turns: [
          { role: 'user', text: 'Charlie, can you give me an update on the Miller family I referred to the Denver desk last month?' },
          { role: 'assistant', text: 'Glad to report the Miller transaction at 744 Chautauqua is moving smoothly. Clear-to-close was issued yesterday by the lender. Escrow is scheduled to close on September 24th, with your 25% referral disbursement of $11,562.50 scheduled for release within 24 hours of recording.' },
        ],
      },
    ],
    hr: [
      {
        id: 'dlg-5',
        date: 'Sep 7, 2026, 9:20 AM',
        type: 'intake',
        channel: 'Corporate Relo Executive Desk',
        title: 'Q3 Executive Move Package Optimization',
        summary: 'Audited 3 employee moves for Q3. Zero fees charged to employer; total relocation savings calculated at $42,000.',
        actionTaken: 'Executive Milestone Report exported for HR VP review.',
        turns: [
          { role: 'user', text: 'Are all three of our Q3 engineering transferees on track for their October 1 start dates?' },
          { role: 'assistant', text: 'All three are ahead of schedule. Marcus in Austin has his contract accepted; Elena in Boulder has completed home inspection; and David in Nashville is touring neighborhoods with our vetted agent this Saturday.' },
        ],
      },
    ],
    broker: [
      {
        id: 'dlg-6',
        date: 'Sep 6, 2026, 1:15 PM',
        type: 'voice',
        channel: 'BackOffice Compliance Audit Desk',
        title: 'Escrow Friction Analysis for 3 Pending Transactions',
        summary: 'AI Audit flagged 1 appraisal gap risk on transaction #2026-88. Suggested mitigation strategy.',
        actionTaken: 'Automated notice sent to Listing Agent with appraisal dispute comps.',
        turns: [
          { role: 'assistant', text: 'Our Brokermint sync detected an appraisal contingency deadline in 48 hours for transaction #2026-88, with no appraisal report yet uploaded to the file.' },
          { role: 'user', text: 'Have we notified the transaction coordinator?' },
          { role: 'assistant', text: 'Yes, an internal alert was raised to the TC, and the lender was contacted. The appraiser confirmed the valuation came in at purchase price and the written report is arriving by 2:00 PM today.' },
        ],
      },
    ],
    vendor: [
      {
        id: 'dlg-7',
        date: 'Sep 4, 2026, 3:00 PM',
        type: 'voice',
        channel: 'Vetted Partner Network',
        title: 'Client Moving Quotes Dispatch',
        summary: 'Reviewed 2 incoming packing and transport inquiries for relocating clients moving into Maricopa County.',
        actionTaken: 'Client contact details shared; concierge confirmed direct client consent.',
        turns: [
          { role: 'assistant', text: 'We have 2 families completing purchase escrow this month in North Scottsdale who requested vetted white-glove moving quotes. Are you available for early October delivery dates?' },
          { role: 'user', text: 'Yes, our trucks have dedicated capacity for the first two weeks of October. We will submit guaranteed rate estimates today.' },
        ],
      },
    ],
  };

  const sampleList = ROLE_DEFAULT_DIALOGUES[subscriberRole] || ROLE_DEFAULT_DIALOGUES.client;
  const displayLogs = realLogs && realLogs.length > 0 ? realLogs : sampleList;
  const [selectedDialogue, setSelectedDialogue] = useState(displayLogs[0] || null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden bg-[#0c0c0c] text-white"
        style={{ borderColor: `${GOLD}70` }}
      >
        {/* Header Bar */}
        <div 
          className="p-4 sm:p-5 flex items-center justify-between border-b shrink-0"
          style={{ 
            background: 'linear-gradient(180deg, #18150e 0%, #0c0c0c 100%)',
            borderColor: `${GOLD}40` 
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-sm"
              style={{ background: 'rgba(212,175,55,0.15)', borderColor: GOLD }}
            >
              <History className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold tracking-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  Retained Dialogue &amp; Communication History
                </h3>
                <span 
                  className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full text-black"
                  style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
                >
                  Verified Ledger
                </span>
              </div>
              <p className="text-xs text-white/60">
                Permanent past reference logs for {subscriberName} • Re-read transcripts, advice, &amp; agreed actions
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2-Column Dialogue Viewer */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-0">
          
          {/* Left Column: List of Prior Sessions */}
          <div className="md:col-span-5 border-r border-white/10 p-3 sm:p-4 overflow-y-auto space-y-2.5 bg-[#090909]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] px-1 flex items-center justify-between">
              <span>Past Sessions ({displayLogs.length})</span>
              <span className="text-[9px] text-white/40 lowercase">select to read transcript</span>
            </div>

            {displayLogs.map((item) => {
              const isSelected = selectedDialogue?.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedDialogue(item)}
                  className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer shadow-sm group ${
                    isSelected 
                      ? 'bg-[#1a170f] border-[#D4AF37] shadow-lg' 
                      : 'bg-[#121212] border-white/10 hover:border-white/30 hover:bg-[#161616]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-white/50 mb-1">
                    <span className="flex items-center gap-1 font-mono text-white/70">
                      <Calendar className="w-2.5 h-2.5 text-[#D4AF37]" /> {item.date}
                    </span>
                    <span className="flex items-center gap-1 text-[9px] px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-[#D4AF37]">
                      {item.type === 'voice' ? <Mic className="w-2.5 h-2.5" /> : <MessageSquare className="w-2.5 h-2.5" />}
                      <span>{item.channel}</span>
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-snug line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-white/60 line-clamp-2 mt-1 leading-relaxed">
                    {item.summary}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right Column: Full Spoken Transcript & Actions Generated */}
          <div className="md:col-span-7 p-4 sm:p-6 overflow-y-auto bg-[#0d0d0d] flex flex-col justify-between space-y-4">
            {selectedDialogue ? (
              <div className="space-y-4 text-left">
                {/* Session Header */}
                <div className="border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-[10px] text-[#D4AF37] font-semibold mb-1">
                    <Clock className="w-3 h-3" />
                    <span>{selectedDialogue.date}</span>
                    <span>•</span>
                    <span className="font-mono">{selectedDialogue.channel}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white leading-snug" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    {selectedDialogue.title}
                  </h3>
                  <p className="text-xs text-white/70 mt-1 leading-relaxed">
                    {selectedDialogue.summary}
                  </p>
                </div>

                {/* Outcome / Action Step Recorded */}
                {selectedDialogue.actionTaken && (
                  <div className="p-3 rounded-xl bg-[#141812] border border-[#10b981]/40 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#10b981] block">
                        Action Executed From This Dialogue:
                      </span>
                      <p className="text-xs text-white/90 mt-0.5 leading-relaxed">
                        {selectedDialogue.actionTaken}
                      </p>
                    </div>
                  </div>
                )}

                {/* Turn-by-Turn Transcript */}
                <div className="space-y-3 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] block">
                    Full Spoken / Recorded Transcript:
                  </span>

                  {selectedDialogue.turns?.map((turn, idx) => {
                    const isUser = turn.role === 'user';
                    return (
                      <div 
                        key={idx} 
                        className={`flex gap-2.5 p-3 rounded-xl border ${
                          isUser 
                            ? 'bg-[#161616] border-white/15' 
                            : 'bg-[#18140c] border-[#D4AF37]/30 shadow-sm'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          isUser ? 'bg-white/10 text-white' : 'bg-[#D4AF37]/20 text-[#D4AF37]'
                        }`}>
                          {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className={`text-[9px] font-bold uppercase tracking-wider block mb-0.5 ${
                            isUser ? 'text-white/60' : 'text-[#D4AF37]'
                          }`}>
                            {isUser ? subscriberName : 'Charlie (Concierge AI)'}
                          </span>
                          <p className="text-xs text-white/90 leading-relaxed">
                            {turn.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-white/40">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs">Select a dialogue from the left to view the recorded transcript.</p>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-[10px] text-white/50 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" /> Retained under Dyson Fiduciary Privacy Protection
              </span>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#D4AF37] text-black hover:brightness-110 cursor-pointer shadow-md"
              >
                Close Reference
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}