import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, ArrowRight, ArrowLeft, Clock, ShieldCheck, 
  MapPin, Home, UserCheck, Search, MessageSquare, Send, 
  Phone, MessageCircle, Mic, AlertCircle, ChevronDown, ChevronUp,
  FileText, Sparkles, Building2, Check
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from '@/components/ui/use-toast';

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

        // 1. Fetch latest client record matching user or query param or latest created
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
  const clientName = clientRecord?.full_name || searchParams.get('name') || currentUser?.full_name || 'Kayden Sterling';
  const firstName = clientName.split(' ')[0] || 'Kayden';
  const originCity = clientRecord?.current_city || 'Los Gatos, CA';
  const destinationCity = clientRecord?.destination_city || searchParams.get('destination') || 'Scottsdale, AZ';
  const budget = clientRecord?.budget || '$800K – $1.5M';
  const moveDate = clientRecord?.move_date || 'Fall Relocation (1–3 Months)';
  const dispatchRef = clientRecord?.id ? `DYS-${clientRecord.id.slice(-6).toUpperCase()}` : 'DYS-RELO-8821';

  // Roadmap phases structure
  const ROADMAP_PHASES = [
    {
      number: 1,
      title: 'Relocation Intake & Criteria Profile',
      status: 'completed',
      badge: 'Completed',
      desc: 'Move parameters, timeline, budget, and destination criteria registered in the Dyson network.',
      dysonDeliverable: 'Client relocation file established; fiduciary engagement initiated.',
      items: [
        'Relocation profile submitted & verified',
        'Move timeline & budget parameters registered',
        'Fiduciary representation standards acknowledged',
      ],
    },
    {
      number: 2,
      title: 'Fiduciary Agent Match & Independent Vetting',
      status: 'active',
      badge: 'In Progress • Manual Review',
      desc: 'Bob Dyson and our senior relocation desk are independently vetting top-producing local agents in your destination market.',
      dysonDeliverable: 'Vetted candidate shortlist presented directly to you with production audit & disciplinary check.',
      items: [
        'Analyzing local MLS sales volume & neighborhood specialization',
        'Direct interview & fiduciary standard verification with broker candidates',
        '3–5 top candidate dossiers prepared for client review',
      ],
    },
    {
      number: 3,
      title: 'Curated Property Search & On-Site Preview',
      status: 'upcoming',
      badge: 'Upcoming',
      desc: 'Collaborative MLS listing review, AI comp analysis, and video tours coordinated with your vetted agent.',
      dysonDeliverable: 'Unbiased property valuation audits before offers are drafted.',
      items: [
        'Off-market & MLS match alerts aligned with your lifestyle criteria',
        'Preliminary tax assessment and valuation audit for candidate homes',
        'Coordination of preview tours and neighborhood drive-throughs',
      ],
    },
    {
      number: 4,
      title: 'Community, School & Tax Migration Research',
      status: 'upcoming',
      badge: 'Upcoming',
      desc: 'In-depth lifestyle intelligence, school district data, property tax analysis, and climate considerations.',
      dysonDeliverable: 'Personalized destination briefing document prepared by our research desk.',
      items: [
        'Local property tax differential and residency transition guide',
        'School ranking verification and private/public enrollment windows',
        'Commute routes, municipal services, and medical infrastructure mapping',
      ],
    },
    {
      number: 5,
      title: 'Due Diligence, Inspection & Contract Review',
      status: 'upcoming',
      badge: 'Upcoming',
      desc: 'Independent contract and contingency audit so you never walk into an uninspected surprise.',
      dysonDeliverable: 'Fiduciary contract audit protecting your earnest money deposit.',
      items: [
        'Independent inspection report evaluation and repair request strategy',
        'HOA covenants, CCRs, and municipal zoning compliance review',
        'Title commitment and property disclosure cross-examination',
      ],
    },
    {
      number: 6,
      title: 'Escrow Oversight, Closing & Settlement',
      status: 'upcoming',
      badge: 'Upcoming',
      desc: 'Continuous tracking through closing day, key exchange, and mover coordination.',
      dysonDeliverable: 'Escrow milestone audit from acceptance through deed recordation.',
      items: [
        'Escrow milestone timeline and deadline monitoring',
        'Final walkthrough checklist and lender funding verification',
        'Utility transfer coordination and closing celebration',
      ],
    },
  ];

  // Handle posting a new message to the dialogue feed
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    setSendingMessage(true);
    const content = newMessageText.trim();
    const tempId = `temp-${Date.now()}`;

    // Optimistic UI update
    const optimisticMsg = {
      id: tempId,
      client_id: clientRecord?.id || 'demo-client',
      role: 'user',
      content,
      created_date: new Date().toISOString(),
    };

    setDialogueMessages(prev => [...prev, optimisticMsg]);
    setNewMessageText('');

    try {
      // 1. Save ChatMessage entity
      await base44.entities.ChatMessage.create({
        client_id: clientRecord?.id || 'demo-client',
        role: 'user',
        content,
        message_type: 'text',
      });

      // 2. Also log to Communication entity for Admin Communications integration
      await base44.entities.Communication.create({
        recipient_name: clientName,
        recipient_email: clientRecord?.email || currentUser?.email || 'client@dysonrelo.com',
        recipient_phone: clientRecord?.phone || '(858) 353-1200',
        message_content: `[Client Move Dialogue - ${destinationCity}] ${content}`,
        sent_date: new Date().toISOString(),
        status: 'delivered',
        communication_type: 'sms',
        notes: `Logged from Client Move Roadmap (${destinationCity})`,
      });

      // 3. Automated acknowledgment from Bob Dyson's Fiduciary Desk
      setTimeout(async () => {
        const replyContent = `Thank you ${firstName}. Your note has been logged to your move file (${dispatchRef}) and routed directly to Bob Dyson's relocation desk. We are actively reviewing this with your criteria.`;
        const replyMsg = {
          id: `reply-${Date.now()}`,
          client_id: clientRecord?.id || 'demo-client',
          role: 'charlie',
          content: replyContent,
          created_date: new Date().toISOString(),
        };
        setDialogueMessages(prev => [...prev, replyMsg]);

        try {
          await base44.entities.ChatMessage.create({
            client_id: clientRecord?.id || 'demo-client',
            role: 'charlie',
            content: replyContent,
            message_type: 'text',
          });
        } catch (_) {}
      }, 1200);

      toast({
        title: "Message Logged to Your Move File",
        description: "Bob Dyson and the relocation desk have been notified.",
      });
    } catch (err) {
      console.error('Failed to log message:', err);
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div className="min-h-screen p-3 sm:p-6 lg:p-8" style={{ background: TAN_BG }}>
      <div className="max-w-5xl mx-auto space-y-5 text-left">
        
        {/* TOP BRAND NAVIGATION */}
        <div className="flex items-center justify-between pb-2">
          <button
            type="button"
            onClick={() => navigate('/admin/front-door-lab?view=client_backside')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0a0a0a] hover:text-[#854d0e] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Client Backside Workspace</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-[#854d0e] bg-black/5 px-2.5 py-0.5 rounded-full">
              Move File: {dispatchRef}
            </span>
          </div>
        </div>

        {/* ========================================================
            1. TOP NOTICE FOR CLIENT & DISPATCH TO OUR SYSTEM
            ======================================================== */}
        <section 
          className="rounded-2xl p-4 sm:p-6 bg-[#0a0a0a] text-white border-2 border-[#D4AF37] shadow-2xl relative overflow-hidden"
        >
          <div className="relative z-10 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-ping shrink-0" />
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#10b981] text-black">
                  DISPATCH ACTIVE • NOTICE CONFIRMED
                </span>
                <span className="text-xs font-mono text-[#D4AF37]">
                  {dispatchRef}
                </span>
              </div>

              <div className="text-[11px] text-white/60 font-mono">
                Logged to Dyson Communication System ✓
              </div>
            </div>

            <div className="space-y-1">
              <h1 
                className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Relocation Request Active for {clientName}
              </h1>
              <p className="text-xs sm:text-sm text-[#D4AF37] font-semibold">
                Fiduciary Manual Process Triggered: Bob Dyson and our senior relocation desk are now actively reviewing your move parameters.
              </p>
            </div>

            <p className="text-xs text-white/75 leading-relaxed pt-1">
              Because Dyson &amp; Dyson operates as an independent fiduciary, we do not sell your information to generic lead portals. Our team manually audits local agents, interviews brokerage managers, and verifies transaction records in <strong>{destinationCity}</strong> to select top-tier candidates on your behalf.
            </p>

            {/* Quick Move Attributes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10 text-xs">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                <span className="text-[10px] text-white/50 block">Current Origin:</span>
                <span className="font-bold text-white text-xs truncate block">{originCity}</span>
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                <span className="text-[10px] text-white/50 block">Destination Target:</span>
                <span className="font-bold text-[#10b981] text-xs truncate block">{destinationCity}</span>
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                <span className="text-[10px] text-white/50 block">Target Budget:</span>
                <span className="font-bold text-white text-xs truncate block">{budget}</span>
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                <span className="text-[10px] text-white/50 block">Move Timeline:</span>
                <span className="font-bold text-[#D4AF37] text-xs truncate block">{moveDate}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-white/70">
                <ShieldCheck className="w-4 h-4 text-[#10b981]" />
                <span>Zero Buyer Fee Guarantee • Independent Fiduciary Representation</span>
              </div>
              <Link
                to="/relocation-intake"
                className="text-xs text-[#D4AF37] hover:underline font-bold"
              >
                Update Move Criteria →
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================
            2. THE RELOCATION ROADMAP (STEP-BY-STEP MILESTONES)
            ======================================================== */}
        <section className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-[#0a0a0a]/15">
            <div>
              <h2 
                className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0a0a0a]"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Your Relocation Roadmap
              </h2>
              <p className="text-xs text-[#854d0e] font-semibold">
                Milestones &amp; Fiduciary Checkpoints Along Your Move
              </p>
            </div>

            <div className="text-xs font-mono font-bold text-[#0a0a0a]">
              Phase 2 of 6 Active
            </div>
          </div>

          <div className="space-y-2.5">
            {ROADMAP_PHASES.map((phase) => {
              const isExpanded = expandedPhase === phase.number;
              const isCompleted = phase.status === 'completed';
              const isActive = phase.status === 'active';

              return (
                <div
                  key={phase.number}
                  className={`rounded-xl border transition-all overflow-hidden ${
                    isActive 
                      ? 'bg-[#0a0a0a] text-white border-2 border-[#D4AF37] shadow-lg' 
                      : isCompleted
                      ? 'bg-[#0a0a0a]/90 text-white border border-[#10b981]/50'
                      : 'bg-[#0a0a0a]/75 text-white/80 border border-white/10'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedPhase(isExpanded ? null : phase.number)}
                    className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        isCompleted
                          ? 'bg-[#10b981] text-black'
                          : isActive
                          ? 'bg-[#D4AF37] text-black font-black'
                          : 'bg-white/10 text-white/50'
                      }`}>
                        {isCompleted ? <Check className="w-4 h-4" /> : phase.number}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm sm:text-base font-bold text-white truncate">
                            {phase.title}
                          </h3>
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isCompleted
                              ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40'
                              : isActive
                              ? 'bg-[#D4AF37] text-black font-bold'
                              : 'bg-white/10 text-white/50'
                          }`}>
                            {phase.badge}
                          </span>
                        </div>
                        <p className="text-xs text-white/60 truncate mt-0.5">
                          {phase.desc}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-white/60">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-white/10 space-y-3 text-xs bg-black/40">
                      <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 space-y-1">
                        <div className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider">
                          Dyson Fiduciary Deliverable:
                        </div>
                        <p className="text-white/85 text-xs">
                          {phase.dysonDeliverable}
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <div className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">
                          Checkpoint Actions:
                        </div>
                        {phase.items.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-white/75">
                            <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isCompleted ? 'text-[#10b981]' : isActive ? 'text-[#D4AF37]' : 'text-white/30'}`} />
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
            3. "AND BELOW IT THE DIALOGUE ALONG THE WAY AND ALL THROUGH THE MOVE"
            Live, continuous timeline of notes, updates & client questions
            ======================================================== */}
        <section 
          className="rounded-2xl p-4 sm:p-6 bg-[#0a0a0a] text-white border border-[#D4AF37]/50 shadow-2xl space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#D4AF37]" />
                <h3 
                  className="text-xl sm:text-2xl font-bold text-white tracking-tight"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  Move Dialogue &amp; Concierge Journal
                </h3>
              </div>
              <p className="text-xs text-white/60 mt-0.5">
                Continuous log of communications, questions, and notes between you and Bob Dyson's Fiduciary Desk.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href="tel:+18583531200"
                className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Call Bob Dyson</span>
              </a>
              <button
                type="button"
                onClick={() => navigate('/talking-app')}
                className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#151515] hover:bg-[#202020] text-[#10b981] border border-[#10b981] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Talk with Charlie</span>
              </button>
            </div>
          </div>

          {/* Dialogue Feed */}
          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {/* Initial System Entry */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#D4AF37] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Dyson Fiduciary Relocation Desk</span>
                </span>
                <span className="text-[10px] text-white/40 font-mono">Today • Intake Confirmation</span>
              </div>
              <p className="text-white/80 leading-relaxed text-xs">
                Relocation file <strong>{dispatchRef}</strong> opened for {clientName}. Move parameters: <strong>{originCity} → {destinationCity}</strong> ({budget}). Bob Dyson and the fiduciary committee have initiated candidate research in {destinationCity}.
              </p>
            </div>

            {/* Dynamic Message History */}
            {dialogueMessages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div 
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1 text-xs`}
                >
                  <div className="flex items-center gap-2 px-1 text-[10px] text-white/40">
                    <span>{isUser ? clientName : 'Bob Dyson Concierge Desk'}</span>
                    <span>•</span>
                    <span>{msg.created_date ? new Date(msg.created_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}</span>
                  </div>
                  <div 
                    className={`p-3 rounded-2xl max-w-xl text-xs leading-relaxed ${
                      isUser 
                        ? 'bg-[#faf6ee] text-[#0a0a0a] font-medium border border-[#D4AF37] rounded-br-none shadow-md'
                        : 'bg-[#181818] text-white/90 border border-white/15 rounded-bl-none shadow'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}
          </div>

          {/* New Message Composer */}
          <form onSubmit={handleSendMessage} className="pt-2 border-t border-white/10 space-y-2">
            <div className="flex items-center gap-2 p-1.5 rounded-full border border-[#D4AF37] bg-[#141414] focus-within:ring-2 focus-within:ring-[#D4AF37]">
              <input 
                type="text"
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                placeholder={`Send note, question, or property link to Bob Dyson's desk...`}
                className="w-full bg-transparent px-4 py-1.5 text-xs sm:text-sm text-white placeholder:text-stone-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={sendingMessage || !newMessageText.trim()}
                className="px-5 py-2 rounded-full font-bold text-xs text-black flex items-center gap-1.5 cursor-pointer shadow hover:brightness-110 active:scale-95 disabled:opacity-50 shrink-0"
                style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
              >
                <span>Send Note</span>
                <Send className="w-3 h-3" />
              </button>
            </div>
            <p className="text-[10px] text-white/40 text-center">
              All messages post directly to your move history and alert our fiduciary team in real time.
            </p>
          </form>
        </section>

      </div>
    </div>
  );
}