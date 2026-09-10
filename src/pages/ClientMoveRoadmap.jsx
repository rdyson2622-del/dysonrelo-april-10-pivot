import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, ShieldCheck, 
  Phone, Mic, ChevronDown, ChevronUp,
  Send, Check, Sparkles
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from '@/components/ui/use-toast';
import { ROADMAP_TEMPLATES } from '@/components/roadmap/VisualProjectRoadmap';

const GOLD = '#D4AF37';
const TAN_BG = '#ede0cc';

export default function ClientMoveRoadmap() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [currentUser, setCurrentUser] = useState(null);
  const [clientRecord, setClientRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dialogue & Communications State
  const [dialogueMessages, setDialogueMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [expandedPhase, setExpandedPhase] = useState(2); // Phase 2 active by default
  const [activePhaseNumber, setActivePhaseNumber] = useState(2);

  // Selected visual roadmap template (dynamic matching to project requirements)
  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    const qType = (searchParams.get('type') || searchParams.get('prompt') || '').toLowerCase();
    if (qType.includes('tax') || qType.includes('1031')) return 'tax_strategy';
    if (qType.includes('escrow')) return 'escrow_audit';
    if (qType.includes('agent') || qType.includes('vet')) return 'agent_vetting';
    return 'relocation';
  });

  // Load client data & communications
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        let user = null;
        try {
          user = await base44.auth.me();
          if (user && isMounted) setCurrentUser(user);
        } catch (_) {}

        // Fetch latest client record matching user or query param or latest created
        let matchedClient = null;
        const paramEmail = searchParams.get('email');
        const paramName = searchParams.get('name');

        if (paramEmail) {
          const res = await base44.entities.RelocationClient.filter({ email: paramEmail }, '-created_date', 1);
          if (res?.length > 0) matchedClient = res[0];
        } else if (user?.email) {
          const res = await base44.entities.RelocationClient.filter({ email: user.email }, '-created_date', 1);
          if (res?.length > 0) matchedClient = res[0];
        } else if (paramName) {
          const res = await base44.entities.RelocationClient.filter({ full_name: paramName }, '-created_date', 1);
          if (res?.length > 0) matchedClient = res[0];
        }

        if (!matchedClient) {
          const all = await base44.entities.RelocationClient.list('-created_date', 1);
          if (all?.length > 0) matchedClient = all[0];
        }

        if (matchedClient && isMounted) {
          setClientRecord(matchedClient);

          // Fetch chat messages / communications for this client
          try {
            const msgs = await base44.entities.ChatMessage.filter({ client_id: matchedClient.id }, 'created_date', 50);
            if (msgs && isMounted) {
              setDialogueMessages(msgs);
            }
          } catch (_) {}
        }
      } catch (err) {
        console.error('Failed to load roadmap data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [location.search]);

  // Derived client details
  const clientName = clientRecord?.full_name || searchParams.get('name') || currentUser?.full_name || 'Bob Dyson';
  const originCity = clientRecord?.current_city || 'Santa Cruz, CA';
  const destinationCity = clientRecord?.destination_city || searchParams.get('destination') || 'Austin, TX';
  const budget = clientRecord?.budget || '$800K – $1.5M';
  const moveDate = clientRecord?.move_date || 'Fall Relocation (1–3 Months)';
  const dispatchRef = clientRecord?.id ? `DYS-${clientRecord.id.slice(-6).toUpperCase()}` : 'DYS-649AB6';

  const currentTemplate = ROADMAP_TEMPLATES[selectedTemplate] || ROADMAP_TEMPLATES.relocation;
  const phases = currentTemplate.phases;

  // Handle sending message in Move Dialogue Journal
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const textToSend = newMessageText.trim();
    setNewMessageText('');
    setSendingMessage(true);

    const optimisticMsg = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: textToSend,
      created_date: new Date().toISOString(),
    };
    setDialogueMessages(prev => [...prev, optimisticMsg]);

    try {
      const clientId = clientRecord?.id || currentUser?.id || 'demo-client';
      await base44.entities.ChatMessage.create({
        client_id: clientId,
        role: 'user',
        content: textToSend,
      });

      // Dispatch to central communications log
      await base44.entities.Communication.create({
        client_id: clientId,
        client_name: clientName,
        type: 'note',
        direction: 'inbound',
        content: `Client Move Journal Note (${originCity} → ${destinationCity}): "${textToSend}"`,
        status: 'logged',
        sent_at: new Date().toISOString(),
      }).catch(() => {});

      toast({
        title: "Message Logged to Move File",
        description: "Bob Dyson and the relocation desk have been notified.",
      });
    } catch (err) {
      console.error('Failed to log message:', err);
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div className="min-h-screen py-6 px-4 sm:px-8 lg:px-12 text-[#0a0a0a]" style={{ background: TAN_BG }}>
      <div className="max-w-4xl mx-auto space-y-8 text-left">
        
        {/* ========================================================
            EDITORIAL EXECUTIVE HEADER (OPEN LAYOUT — ZERO BOXES)
            ======================================================== */}
        <section className="space-y-3">
          <div className="space-y-1">
            <div className="text-[11px] font-bold tracking-widest uppercase text-[#854d0e]">
              Fiduciary Relocation Management
            </div>
            <h1 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0a0a0a] leading-tight"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Relocation Roadmap: {clientName}
            </h1>
          </div>

          {/* Clean inline parameters line — no separate inner boxes */}
          <div className="text-sm sm:text-base font-semibold text-[#0a0a0a] flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
            <span className="text-[#854d0e] font-bold">{originCity} → {destinationCity}</span>
            <span className="text-[#0a0a0a]/30">•</span>
            <span>Budget: {budget}</span>
            <span className="text-[#0a0a0a]/30">•</span>
            <span>Timeline: {moveDate}</span>
          </div>

          <p className="text-sm text-[#44382c] leading-relaxed max-w-3xl pt-1">
            Bob Dyson and our senior relocation desk are independently reviewing your parameters. Because Dyson &amp; Dyson operates as an independent fiduciary, we do not sell your contact to generic agent pools. We personally audit local sales production, interview candidate brokers, and verify transaction records in <strong>{destinationCity}</strong> on your behalf — with zero buyer fees.
          </p>

          <div className="flex items-center gap-4 text-xs pt-1 font-medium">
            <div className="flex items-center gap-1.5 text-[#10b981] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero Buyer Fee Guarantee · Independent Fiduciary</span>
            </div>
            <span className="text-[#0a0a0a]/30">•</span>
            <Link
              to="/relocation-intake"
              className="text-[#854d0e] hover:text-[#0a0a0a] hover:underline font-bold transition-colors"
            >
              Update Move Parameters →
            </Link>
          </div>
        </section>

        {/* ========================================================
            3. CLEAN VERTICAL TIMELINE ROADMAP (NO HEAVY CARDS / NO PILLS)
            A single, continuous timeline connecting all milestones cleanly
            ======================================================== */}
        <section className="pt-4 space-y-5 border-t border-[#0a0a0a]/15">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <h2 
                className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0a0a0a]"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Your Relocation Milestones
              </h2>
              <p className="text-xs text-[#854d0e] font-medium mt-0.5">
                Milestones &amp; Fiduciary Checkpoints Along Your Move
              </p>
            </div>

            <div className="text-xs font-mono font-bold text-[#854d0e] text-right shrink-0">
              Phase {activePhaseNumber} of {phases.length} in progress
            </div>
          </div>

          {/* Connected timeline list */}
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#0a0a0a]/15">
            {phases.map((phase) => {
              const isExpanded = expandedPhase === phase.number;
              const isCompleted = phase.number < activePhaseNumber || phase.status === 'completed';
              const isActive = phase.number === activePhaseNumber;

              return (
                <div key={phase.number} className="relative group">
                  
                  {/* Timeline node icon */}
                  <div 
                    onClick={() => setExpandedPhase(isExpanded ? null : phase.number)}
                    className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold transition-transform cursor-pointer group-hover:scale-110 shadow-sm ${
                      isCompleted 
                        ? 'bg-[#10b981] text-black ring-4 ring-[#ede0cc]'
                        : isActive
                        ? 'bg-[#0a0a0a] text-[#D4AF37] ring-4 ring-[#ede0cc] border-2 border-[#D4AF37]'
                        : 'bg-[#0a0a0a]/15 text-[#0a0a0a]/70 ring-4 ring-[#ede0cc]'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : phase.number}
                  </div>

                  {/* Header row */}
                  <div 
                    onClick={() => setExpandedPhase(isExpanded ? null : phase.number)}
                    className="cursor-pointer select-none"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={`text-base sm:text-lg font-bold transition-colors ${
                            isActive ? 'text-[#0a0a0a]' : isCompleted ? 'text-[#0a0a0a]/90' : 'text-[#0a0a0a]/70'
                          }`}>
                            {phase.title}
                          </h3>
                          
                          {/* Clean status tag (NOT a bulky pill button) */}
                          <span className={`text-xs font-semibold ${
                            isCompleted ? 'text-[#10b981]' : isActive ? 'text-[#854d0e]' : 'text-[#0a0a0a]/40'
                          }`}>
                            • {isCompleted ? 'Completed' : isActive ? 'Active Review' : 'Upcoming'}
                          </span>
                        </div>

                        <p className="text-xs text-[#554433] leading-relaxed">
                          {phase.desc}
                        </p>
                      </div>

                      <button
                        type="button"
                        aria-label="Toggle details"
                        className="text-[#0a0a0a]/40 group-hover:text-[#0a0a0a] p-1 transition-colors shrink-0 mt-0.5"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded details — clean indentation, NO bulky inner cards */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 pl-3 sm:pl-4 border-l-2 border-[#D4AF37] space-y-2.5 text-xs text-[#44382c] animate-in fade-in duration-200">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#854d0e] block">
                          Dyson Fiduciary Deliverable:
                        </span>
                        <p className="text-sm font-serif italic text-[#0a0a0a] font-medium mt-0.5">
                          "{phase.dysonDeliverable || phase.deliverable}"
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#0a0a0a]/60 block">
                          Checkpoint Actions:
                        </span>
                        {phase.items?.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-[#0a0a0a]/85">
                            <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                              isCompleted ? 'text-[#10b981]' : isActive ? 'text-[#854d0e]' : 'text-[#0a0a0a]/30'
                            }`} />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================
            4. MOVE DIALOGUE & CONCIERGE JOURNAL (OPEN, UNCLUTTERED FEED)
            ======================================================== */}
        <section className="pt-6 border-t border-[#0a0a0a]/15 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <h2 
                className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0a0a0a]"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Move Dialogue &amp; Concierge Journal
              </h2>
              <p className="text-xs text-[#554433] mt-0.5">
                Direct communication thread between you and Bob Dyson's Fiduciary Desk.
              </p>
            </div>

            {/* Direct contact text links */}
            <div className="flex items-center gap-3 text-xs font-semibold shrink-0">
              <a 
                href="tel:+18583531200" 
                className="text-[#854d0e] hover:text-[#0a0a0a] flex items-center gap-1 hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Desk: (858) 353-1200</span>
              </a>
              <span className="text-[#0a0a0a]/20">|</span>
              <button
                type="button"
                onClick={() => navigate('/talking-app')}
                className="text-[#0a0a0a] hover:text-[#854d0e] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5 text-[#10b981]" />
                <span>Talk with Charlie</span>
              </button>
            </div>
          </div>

          {/* Clean Message History Feed */}
          <div className="space-y-3 py-2">
            {/* Initial Desk Record Entry */}
            <div className="p-3.5 rounded-xl bg-black/5 border border-black/10 space-y-1 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#854d0e] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#854d0e]" />
                  <span>Dyson Fiduciary Relocation Desk</span>
                </span>
                <span className="text-[#554433] font-mono text-[10px]">File Initialized</span>
              </div>
              <p className="text-[#0a0a0a]/85 leading-relaxed">
                Relocation file <strong>{dispatchRef}</strong> opened for {clientName}. Active route parameters: <strong>{originCity} → {destinationCity}</strong> ({budget}). Bob Dyson and the fiduciary review committee have initiated agent vetting in {destinationCity}.
              </p>
            </div>

            {/* Dynamic messages */}
            {dialogueMessages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div 
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div className="text-[10px] text-[#554433] px-1 font-medium">
                    {isUser ? clientName : 'Bob Dyson Concierge Desk'} • {msg.created_date ? new Date(msg.created_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                  </div>
                  <div 
                    className={`p-3 rounded-xl max-w-xl text-xs sm:text-sm leading-relaxed ${
                      isUser 
                        ? 'bg-[#0a0a0a] text-white rounded-br-none shadow-sm'
                        : 'bg-white text-[#0a0a0a] border border-black/10 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Streamlined Message Input Bar */}
          <form onSubmit={handleSendMessage} className="space-y-2 pt-1">
            <div className="flex items-center gap-2 p-1.5 rounded-full border border-[#0a0a0a]/30 bg-white/70 focus-within:bg-white focus-within:border-[#854d0e] focus-within:ring-2 focus-within:ring-[#854d0e]/20 transition-all shadow-sm">
              <input 
                type="text"
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                placeholder="Write a note, question, or property link for Bob Dyson's desk..."
                className="w-full bg-transparent px-4 py-1.5 text-xs sm:text-sm text-[#0a0a0a] placeholder:text-stone-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={sendingMessage || !newMessageText.trim()}
                className="px-5 py-2 rounded-full font-bold text-xs text-white bg-[#0a0a0a] hover:bg-[#1a1a1a] flex items-center gap-1.5 cursor-pointer shadow transition-all disabled:opacity-40 shrink-0"
              >
                <span>Send</span>
                <Send className="w-3 h-3 text-[#D4AF37]" />
              </button>
            </div>
            <p className="text-[10px] text-[#554433] text-center">
              All messages post directly to your relocation record and notify our fiduciary desk in real time.
            </p>
          </form>
        </section>

      </div>
    </div>
  );
}