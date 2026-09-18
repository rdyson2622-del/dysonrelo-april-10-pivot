import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowDown, Shield, LayoutDashboard, Paperclip, Send, Mic, Radio, FileText, Scale, ArrowLeft, Bookmark, Phone, MessageSquare } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';
import SlideFourPrivateWealth, { extractAddressOrMls } from '@/components/admin/copilot/SlideFourPrivateWealth';
import CopilotDynamicSpeakerBox from '@/components/copilot/CopilotDynamicSpeakerBox';
import CopilotConsumerSpeakerBox from '@/components/copilot/CopilotConsumerSpeakerBox';
import CopilotThreeWayDemo from '@/components/copilot/CopilotThreeWayDemo';
import CopilotMiniAppsRail from '@/components/copilot/CopilotMiniAppsRail';
import CopilotDossierNewsPanel from '@/components/copilot/CopilotDossierNewsPanel';
import CopilotContactCaptureModal from '@/components/copilot/CopilotContactCaptureModal';
import CopilotExplodedSubjectModal from '@/components/copilot/CopilotExplodedSubjectModal';
import CopilotSavedDiscussionsModal from '@/components/copilot/CopilotSavedDiscussionsModal';
import CopilotLegalDisclosuresModal from '@/components/copilot/CopilotLegalDisclosuresModal';
import CopilotReferAFriendModal from '@/components/copilot/CopilotReferAFriendModal';
import CopilotBrokerEscalationModal from '@/components/copilot/CopilotBrokerEscalationModal';
import CopilotAdminHeaderNav from '@/components/copilot/CopilotAdminHeaderNav';
import CopilotFooterBranding from '@/components/copilot/CopilotFooterBranding';
import useCopilotDoorSelection from '@/components/copilot/useCopilotDoorSelection';
import { getCheckedInUser, clearCheckedInContact } from '@/lib/copilotContactSession';
import { findExplainerByQuery } from '@/components/copilot/copilotExplainers';
import { GeminiLiveSessionClient } from '@/lib/geminiLiveClient';
import { stopAllCopilotAudio } from '@/lib/copilotAudioController';
import { buildRecentConversation, getPreviousAssistant, isAffirmativeFollowUp, isPropertyConversation } from '@/lib/copilotConversationContext';
import { KNOWN_PROPERTY_DOSSIERS } from '@/components/admin/copilot/propertyDossierData';
import { 
  getDomainKnowledgeContext, 
  detectVisualSnippetRequest, 
  detectEscalationTrigger 
} from '@/lib/copilotDomainContext';

// Sanctioned lookup helper imported from dedicated module to maintain clean separation
import { resolveSanctionedDossier } from '@/lib/resolveSanctionedDossier';
export { resolveSanctionedDossier };

const TAN_BG = '#ede0cc';

export const COPILOT_CHARLIE_SYSTEM_PROMPT = "You are Charlie Simmons, AI concierge for DysonHomes Copilot (Dyson & Dyson Companies / DysonRelo). Warm, clear, brief, interruptible. On Copilot your job is to ANSWER ordinary real-estate and product questions on-point — do not pass the buck on normal questions.\n\nPOSITIONING & ROLE (CRITICAL):\n- DysonHomes Copilot is your human-driven & AI-assisted private real estate intelligence partner on dysonhomes.com.\n- We are an intelligence advocate and supportive advisor—NOT a compliance officer or final decision maker. The buyer always makes the final call; we equip them with the questions, data, comps, and risk awareness to decide with confidence.\n- Ongoing Partnership via Referral Agreement: CoPilot does not disappear when you select an agent. Under our formal referral agreement, CoPilot remains actively involved alongside the buyer and their vetted agent throughout the entire sequence of events (discovery, offer, inspections, escrow, and closing) as an extra layer of strategic analytical support.\n- Trust line: No agent spam. Dedicated independent buyer representation—never dual agency with the listing agent.\n- Public experience is conversational (chat + Talk Live). Admin/back office is separate.\n\nHOW TO ANSWER:\n- Lead with a useful answer in 2–4 short sentences, then one optional follow-up question.\n- Educate and guide rather than police or command. Instead of saying 'never accept dual agency', explain the structural conflicts of listing agent representation.\n- Explain how CoPilot works with the buyer's agent through the referral agreement when asked about our role.\n- If the dossier already shows comps/risks/notes, narrate what is on screen; do not invent new numbers.\n\nHARD STOPS (non-negotiable — hand to human, do not invent):\n- Exact fees, commissions, rebate dollar amounts or percentages, referral splits.\n- DRE / licensing / contracts / agency / legal / tax advice.\n- Guarantees of sale price, appraisal, investment returns, or outcomes.\n- Claiming to be a licensed broker; you are the AI concierge. Brokerage: The Dyson & Dyson Companies (CA DRE #02303118).\nOn a hard stop: one plain sentence + offer human specialist callback. Do not lecture.\n\nSTYLE:\n- Conversational, warm, supportive. No monologues. One question at a time when you need info.\n- You are Charlie only (not Bob) unless Bob speaks.";

const COPILOT_SEED_FAQS = [{question:"What is DysonHomes Copilot? / What do you do?",answer:"DysonHomes Copilot is your human & AI-assisted private real estate copilot. Paste an address to see comps, property risks, and closing-rebate context where allowed by law — with an independent fiduciary match, not the listing agent. No agent spam.",is_active:true},{question:"What are comps? / How do you get comps?",answer:"Comps are recent similar sales near the property. Copilot shows them in the dossier so you can see how the home sits versus the market. Numbers come from the analysis on screen — ask me to walk through what’s already shown; I won’t invent sale prices.",is_active:true},{question:"How do you find hidden property risks?",answer:"Risks are flags like flood/fire exposure, title or permit issues, and HOA-style gotchas when the data supports them. I’ll summarize what’s in your dossier in plain English. For legal conclusions, a human specialist confirms.",is_active:true},{question:"How do I get money back at closing? / What’s the rebate?",answer:"Where allowed by law, DysonHomes can structure a closing-cost credit tied to an independent buyer-agent referral — never dual agency with the listing agent. I won’t invent a dollar amount or percentage; a human specialist confirms what applies in your state and deal.",is_active:true},{question:"Who is my agent? / Are you the listing agent?",answer:"We’re not the listing agent. The goal is an independent fiduciary buyer-side match looking out for you. I’m Charlie, the AI concierge — a human DysonRelo / Dyson & Dyson specialist handles agency and contracts (CA DRE #02303118).",is_active:true},{question:"Who is Bob Dyson?",answer:"Bob Dyson is the real-estate brain behind Dyson & Dyson / DysonRelo and DysonHomes Copilot — strategy and fiduciary direction. I’m Charlie, the AI guide on the site.",is_active:true},{question:"What’s Talk Live? / Can I talk to you?",answer:"Talk Live is interruptible voice with me (Charlie) on Copilot — same gold path as our live voice stack. Tap Talk, allow the mic, barge in anytime. Typing still works.",is_active:true},{question:"What’s your commission? / Exact rebate %?",answer:"I can’t invent fees, commissions, or rebate percentages. I’ll flag that for a human specialist — want a callback?",is_active:true}];

export default function DysonHomesCopilot({ initialPage }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  const page1Ref = useRef(null);
  const page2Ref = useRef(null);
  const [analyzedProperty, setAnalyzedProperty] = useState('742 Vista Del Mar, La Jolla, CA 92037');

  // Copilot Command Center Interactive Wire State
  const [inputText, setInputText] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState([]);
  const [activeExplainer, setActiveExplainer] = useState(null);
  const [activeDemoSpeaker, setActiveDemoSpeaker] = useState(null);
  const [rightPanelView, setRightPanelView] = useState(null);
  const presentationEpochRef = useRef(0);
  const [presentationResetKey, setPresentationResetKey] = useState(0);
  const [isPageExploded, setIsPageExploded] = useState(false);
  const [selectedExplodedItem, setSelectedExplodedItem] = useState(null);
  const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false);
  const [isTalkLiveActive, setIsTalkLiveActive] = useState(false);
  const [liveStatus, setLiveStatus] = useState('ready'); // ready, connecting, listening, speaking, mic_denied, error
  const [liveStatusText, setLiveStatusText] = useState('');
  const [isSavedDiscussionsOpen, setIsSavedDiscussionsOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [isReferModalOpen, setIsReferModalOpen] = useState(false);
  const [isEscalationModalOpen, setIsEscalationModalOpen] = useState(false);
  const [escalationQuestion, setEscalationQuestion] = useState('');
  const [pushedSnippet, setPushedSnippet] = useState(null);
  const [dialogueFocus, setDialogueFocus] = useState(null);
  const [savedCount, setSavedCount] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('dyson_copilot_saved_discussions');
        if (raw) return JSON.parse(raw).length;
      } catch (_) {}
    }
    return 1;
  });
  const [isSubscriber, setIsSubscriber] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dyson_subscriber_unlocked') === 'true';
    }
    return false;
  });

  // User Check-In Identity (Auth User OR captured contact info)
  const [checkedInUser, setCheckedInUser] = useState(() => getCheckedInUser(user));

  useEffect(() => {
    setCheckedInUser(getCheckedInUser(user));
  }, [user]);

  useEffect(() => {
    const handleContactUpdated = () => {
      setCheckedInUser(getCheckedInUser(user));
    };
    window.addEventListener('dyson_copilot_contact_updated', handleContactUpdated);
    return () => window.removeEventListener('dyson_copilot_contact_updated', handleContactUpdated);
  }, [user]);

  const handleSignOutOrClear = () => {
    clearCheckedInContact();
    if (isAuthenticated) {
      logout();
    }
    setCheckedInUser(null);
  };

  // Discussion history stack state (stacked as added, retained on 40% side)
  const [discussionChips, setDiscussionChips] = useState([
    { id: 'audit', label: 'Property Audit', query: 'Charlie, walk me through how this home sits against adjusted comps', view: 'dossier' },
    { id: 'vetting', label: 'Agent Vetting', query: 'Bob, what are the top 3 traps when a buyer uses the listing agent?', view: 'vetting' },
    { id: 'roadmap', label: 'Move Roadmap', query: 'Charlie, what are the next milestones after an offer is accepted?', view: 'roadmap' },
    { id: 'escrow', label: 'Escrow Watch', query: 'Bob, how do we protect our earnest money deposit from forfeiture?', view: 'escrow' },
    { id: 'news', label: 'Daily News', query: 'Charlie, summarize this broadcast in bullet points', view: 'news' },
    { id: 'prop19', label: 'Prop 19 Tax', query: 'How does Prop 19 tax base portability work when relocating in California?', view: 'solutions' },
  ]);

  const addDiscussionChip = (text, view = 'solutions') => {
    if (!text || text.trim().length === 0) return;
    const trimmed = text.trim();
    setDiscussionChips(prev => {
      if (prev.some(c => c.query.toLowerCase() === trimmed.toLowerCase() || c.label.toLowerCase() === trimmed.toLowerCase())) {
        return prev;
      }
      const label = trimmed.length > 24 ? trimmed.slice(0, 24) + '...' : trimmed;
      return [...prev, { id: `disc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, label, query: trimmed, view }];
    });
  };

  const messagesEndRef = useRef(null);
  const liveClientRef = useRef(null);
  const kbRowsRef = useRef([]);
  const hasSeededKbRef = useRef(false);
  const lastAuditedAddressRef = useRef(null);
  const isAuditingRef = useRef(false);

  // Real dossier state initialized to 742 Vista Del Mar verified baseline
  const [dossierData, setDossierData] = useState(() => {
    return KNOWN_PROPERTY_DOSSIERS['742 vista del mar'] || {
      shortAddress: '742 Vista Del Mar',
      city: 'La Jolla, CA',
      fullAddress: '742 Vista Del Mar, La Jolla, CA 92037',
      listPrice: '$7.95M',
      marketSummary: 'Overpriced vs comps; individual legal & lender discovery required.',
      comps: [
        {
          address: '718 Via Capri',
          distance: '0.32 mi',
          specs: '5 bd | 4.5 ba | 4,612 sf',
          soldPrice: 'Sold $6.25M',
          adjPrice: 'Adj. $6.41M'
        },
        {
          address: '7550 Eads Ave',
          distance: '0.48 mi',
          specs: '4 bd | 4 ba | 3,980 sf',
          soldPrice: 'Sold $5.30M',
          adjPrice: 'Adj. $5.48M'
        },
        {
          address: '737 Bonair Way',
          distance: '0.61 mi',
          specs: '5 bd | 4 ba | 4,305 sf',
          soldPrice: 'Sold $5.85M',
          adjPrice: 'Adj. $6.02M'
        }
      ],
      compsSummary: 'Subject at $7.95M list is 24–32% above adjusted comps.',
      risks: [
        {
          id: 'topo',
          title: 'Topography & drainage',
          desc: 'Steep lot; prior water intrusion noted in 2021 disclosure.'
        },
        {
          id: 'coastal',
          title: 'Coastal bluff influence',
          desc: 'Setback & erosion disclosure on file; future costs possible.'
        },
        {
          id: 'permits',
          title: 'Permit & code notes',
          desc: 'Unpermitted pool heater; fence variance exception.'
        }
      ],
      risksSummary: 'Review seller disclosures and coastal reports closely.',
      complianceBasis: 'Transaction-specific legal & underwriting discovery required.',
      complianceProtocol: 'Case-by-Case Discovery',
      complianceStatus: 'Checked Against State, Fed & Lender Regs'
    };
  });

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isSending]);

  // Seed and fetch CharlieKnowledgeBase rows on mount
  useEffect(() => {
    async function initKnowledgeBase() {
      try {
        const rows = await base44.entities.CharlieKnowledgeBase.filter({ is_active: true }, '-created_date', 50);
        kbRowsRef.current = rows || [];

        // Check if Copilot FAQ rows exist, seed if missing
        if (!hasSeededKbRef.current) {
          hasSeededKbRef.current = true;
          const existingQuestions = new Set((rows || []).map(r => (r.question || '').toLowerCase()));
          for (const item of COPILOT_SEED_FAQS) {
            if (!existingQuestions.has(item.question.toLowerCase())) {
              try {
                const created = await base44.entities.CharlieKnowledgeBase.create({
                  question: item.question,
                  answer: item.answer,
                  is_active: true,
                  topic: item.topic,
                  keywords: item.keywords,
                  source: 'copilot_seed'
                });
                if (created) {
                  kbRowsRef.current.push(created);
                }
              } catch (_) {}
            }
          }
        }
      } catch (err) {
        console.warn('Could not query or seed CharlieKnowledgeBase:', err);
      }
    }
    initKnowledgeBase();
  }, []);

  // Teardown Live client on unmount
  useEffect(() => {
    return () => {
      if (liveClientRef.current) {
        liveClientRef.current.stop();
        liveClientRef.current = null;
      }
    };
  }, []);

  // Talk Live handler using GeminiLiveSessionClient with Algieba voice
  const handleToggleTalkLive = async () => {
    const presentationEpoch = presentationEpochRef.current;
    if (isTalkLiveActive && liveClientRef.current) {
      liveClientRef.current.stop();
      liveClientRef.current = null;
      setIsTalkLiveActive(false);
      setLiveStatus('ready');
      setLiveStatusText('');
      setActiveDemoSpeaker(null);
      return;
    }

    try {
      setLiveStatus('connecting');
      setLiveStatusText('Connecting…');
      setIsTalkLiveActive(true);

      const activeDoor = rightPanelView || 'dossier';
      const domainContext = getDomainKnowledgeContext(activeDoor, analyzedProperty, dossierData);
      const dynamicLivePrompt = `${COPILOT_CHARLIE_SYSTEM_PROMPT}

ACTIVE DOOR CONTEXT:
${domainContext}

DOSSIER FACTS FOR ${dossierData.shortAddress || analyzedProperty}:
- List Price: ${dossierData.listPrice || 'Could not resolve'}
- Comps: ${dossierData.compsSummary || ''}
- Risks: ${dossierData.risksSummary || ''}

LIQUIDATED DAMAGES & TITLE CONTEXT:
- Under Cal. Civ. Code § 1675, seller liquidated damages for buyer default is strictly capped at 3% on 1-4 unit residential.
- In California Form RPA, contingencies never expire automatically; seller must issue a 48-hour formal Notice to Buyer to Perform (NBP).
- Title exceptions on Schedule B (unrecorded easements, solar liens, boundary conflicts) require independent discovery and ALTA endorsements.`;

      const client = new GeminiLiveSessionClient({
        systemPrompt: dynamicLivePrompt,
        voiceName: 'Algieba',
        language: 'en-US',
        onStatusChange: (st) => {
          if (presentationEpoch !== presentationEpochRef.current) return;
          setLiveStatus(st);
          if (st === 'connecting') {
            setLiveStatusText('Connecting…');
          } else if (st === 'listening') {
            setLiveStatusText('Listening — interrupt anytime');
            setActiveDemoSpeaker(null);
          } else if (st === 'speaking') {
            setLiveStatusText('Speaking — interrupt anytime');
            setActiveDemoSpeaker('charlie');
          } else if (st === 'mic_denied') {
            setLiveStatusText('Mic blocked. Allow microphone for this site, then tap Talk Live again.');
            setIsTalkLiveActive(false);
            setActiveDemoSpeaker(null);
          } else if (st === 'error') {
            setLiveStatusText('Couldn’t start voice. Tap Talk Live to retry.');
            setIsTalkLiveActive(false);
            setActiveDemoSpeaker(null);
          } else if (st === 'ready') {
            setLiveStatusText('');
            setIsTalkLiveActive(false);
            setActiveDemoSpeaker(null);
          }
        },
        onSpeaker: (sp) => {
          if (presentationEpoch !== presentationEpochRef.current) return;
          if (sp === 'assistant') setActiveDemoSpeaker('charlie');
          else if (sp === 'user') setActiveDemoSpeaker('consumer');
          else setActiveDemoSpeaker(null);
        },
        onTranscript: (item) => {
          if (presentationEpoch !== presentationEpochRef.current) return;
          if (item?.text) {
            setMessages(prev => [
              ...prev,
              {
                id: Date.now() + Math.random(),
                sender: item.role === 'user' ? 'user' : 'charlie',
                text: item.text,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]);
          }
        },
        onError: (err) => {
          if (presentationEpoch !== presentationEpochRef.current) return;
          console.warn('Gemini Live session error:', err);
          const isDenied = err?.code === 'mic_denied' || 
                           String(err?.message || err).toLowerCase().includes('denied') || 
                           String(err?.message || err).toLowerCase().includes('blocked');
          if (isDenied) {
            setLiveStatus('mic_denied');
            setLiveStatusText('Mic blocked. Allow microphone for this site, then tap Talk Live again.');
          } else {
            setLiveStatus('error');
            setLiveStatusText('Couldn’t start voice. Tap Talk Live to retry.');
          }
          setIsTalkLiveActive(false);
          setActiveDemoSpeaker(null);
        }
      });

      liveClientRef.current = client;
      await client.start();
    } catch (e) {
      if (presentationEpoch !== presentationEpochRef.current) return;
      console.warn('Failed to start Gemini Live session:', e);
      const isDenied = e?.name === 'NotAllowedError' || e?.name === 'PermissionDeniedError';
      if (isDenied) {
        setLiveStatus('mic_denied');
        setLiveStatusText('Mic blocked. Allow microphone for this site, then tap Talk Live again.');
      } else {
        setLiveStatus('error');
        setLiveStatusText('Couldn’t start voice. Tap Talk Live to retry.');
      }
      setIsTalkLiveActive(false);
      setActiveDemoSpeaker(null);
    }
  };

  // Real LLM Send invocation using InvokeLLM with gemini_3_flash
  const executeSendMessage = async (textToSend) => {
    const clean = (textToSend || inputText).trim();
    if (!clean || isSending) return;
    const presentationEpoch = presentationEpochRef.current;

    // A live client question always takes priority over any running canned demo or prior voice.
    stopAllCopilotAudio();

    // Route address queries, MLS numbers, or listing URLs directly to handleAuditAddress
    const isAddressOrMlsOrUrl = (
      /^\d+[\w-]*\s+/.test(clean) || 
      /^mls\s*#?\s*[a-z0-9]+/i.test(clean) ||
      /^(https?:\/\/|www\.|\w+\.(com|org|net))/i.test(clean) ||
      /^audit:\s*/i.test(clean)
    );
    if (isAddressOrMlsOrUrl) {
      setInputText('');
      handleAuditAddress(clean.replace(/^audit:\s*/i, ''));
      return;
    }

    setActiveExplainer(null);
    setPushedSnippet(null);

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: clean,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setDialogueFocus({ id: userMsg.id, question: clean, response: '', speaker: 'charlie' });
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    addDiscussionChip(clean);

    const previousAssistant = getPreviousAssistant(messages);
    const recentConversation = buildRecentConversation(messages);

    if (isAffirmativeFollowUp(clean) && /reach out|call you|callback|contact you|connect with you/i.test(previousAssistant?.text || '')) {
      const followUpReply = 'Absolutely. I’ve opened the secure contact form so our team can clarify the service structure with you directly.';
      setIsCaptureModalOpen(true);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'charlie', text: followUpReply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setDialogueFocus({ id: userMsg.id, question: clean, response: followUpReply, speaker: 'charlie' });
      return;
    }

    const isGeneralCostQuestion = /\b(cost|costs|fee|fees|charge|charges|pay|free)\b/i.test(clean)
      && !/\b(closing costs?|purchase price|home price|listing price|repair cost|inspection cost)\b/i.test(clean);
    if (isGeneralCostQuestion) {
      const costReply = 'Our advisory and concierge support does not add a separate brokerage fee for the buyer. Transaction-specific compensation or referral terms are handled through written agreements, and a human specialist can confirm exactly what applies to your situation.';
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'charlie', text: costReply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setDialogueFocus({ id: userMsg.id, question: clean, response: costReply, speaker: 'charlie' });
      return;
    }

    // ── 1. THE ESCALATION PROTOCOL (HITTING THE WALL) ──
    const escalation = detectEscalationTrigger(clean);
    if (escalation) {
      const handoffMsg = {
        id: Date.now() + 1,
        sender: escalation.speaker || 'charlie',
        speakerName: escalation.speaker === 'bob' ? 'Bob Dyson' : 'Charlie Simmons',
        text: escalation.handoffText,
        isEscalation: true,
        escalationData: escalation,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, handoffMsg]);
      setDialogueFocus({ id: userMsg.id, question: clean, response: escalation.handoffText, speaker: handoffMsg.sender });
      setIsSending(false);

      // Programmed escalation: log asynchronously to CharlieEscalation
      try {
        base44.entities.CharlieEscalation.create({
          consumer_question: clean,
          handoff_response: escalation.handoffText,
          status: 'open',
          priority: 'urgent',
          page_context: `Copilot Command Center - ${analyzedProperty}`
        }).catch(err => console.warn('Non-blocking escalation log error:', err));
      } catch (_) {}
      return;
    }

    setIsSending(true);

    // ── 2. LEFT-TO-RIGHT ACTIONS (PUSHING VISUAL SNIPPETS & ROUTING RIGHT VIEW) ──
    let activeTargetDoor = rightPanelView || 'dossier';

    if (/news|broadcast|dnn/i.test(clean)) {
      activeTargetDoor = 'news';
      setRightPanelView('news');
    } else if (/vetting|agent vetting|dual agency|hire agent|connect with an agent|advisory agreement|exclusive agreement|why do i need to sign|are you my agent/i.test(clean)) {
      activeTargetDoor = 'vetting';
      setRightPanelView('vetting');
    } else if (/roadmap|milestone|steps to buy|timeline|phase/i.test(clean)) {
      activeTargetDoor = 'roadmap';
      setRightPanelView('roadmap');
    } else if (/escrow|deposit|emd|contingency|title exception|liquidated damages/i.test(clean)) {
      activeTargetDoor = 'escrow';
      setRightPanelView('escrow');
    } else if (/solution|vault|playbook/i.test(clean)) {
      activeTargetDoor = 'solutions';
      setRightPanelView('solutions');
    } else if (/audit|comps|risk/i.test(clean)) {
      activeTargetDoor = 'dossier';
      setRightPanelView('dossier');
    }

    // Detect if this question warrants pushing a visual breakdown (clause comparison, title exception, bluff setback, prop 19)
    const visualSnippet = detectVisualSnippetRequest(clean, activeTargetDoor, analyzedProperty, dossierData);
    if (visualSnippet) {
      setPushedSnippet(visualSnippet);
      if (visualSnippet.type === 'clause_comparison' || visualSnippet.type === 'title_exception') {
        setRightPanelView('escrow');
        activeTargetDoor = 'escrow';
      } else if (visualSnippet.type === 'bluff_setback') {
        setRightPanelView('dossier');
        activeTargetDoor = 'dossier';
      } else if (visualSnippet.type === 'prop19_calc') {
        setRightPanelView('solutions');
        activeTargetDoor = 'solutions';
      }
    }

    if (/text me|send report|phone/i.test(clean)) {
      setIsCaptureModalOpen(true);
    }

    const explainer = findExplainerByQuery(clean);
    if (explainer?.videoUrl) {
      setActiveExplainer(explainer);
      const explainerSpeaker = explainer.speaker === 'bob' ? 'bob' : 'charlie';
      const explainerReply = explainer.textAnswer || `Playing video explainer for "${explainer.label}".`;
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: explainerSpeaker,
          text: explainerReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setDialogueFocus({ id: userMsg.id, question: clean, response: explainerReply, speaker: explainerSpeaker });
      setIsSending(false);
      return;
    }

    try {
      // ── 3. DOMAIN-SPECIFIC KNOWLEDGE LOADING ──
      const propertyConversation = isPropertyConversation(clean, messages);
      const domainKnowledge = propertyConversation
        ? getDomainKnowledgeContext(activeTargetDoor, analyzedProperty, dossierData)
        : 'ACTIVE CONTEXT: GENERAL COPILOT SERVICE QUESTION. Do not mention any property, address, listing, comp, risk, or dossier unless the client explicitly asks about one.';

      const kbContext = (kbRowsRef.current || [])
        .slice(0, 15)
        .map(r => `Q: ${r.question || ''}\nA: ${r.answer || ''}`)
        .join('\n\n');

      const currentDossier = dossierData;
      const compsFormatted = (currentDossier.comps || []).length > 0
        ? (currentDossier.comps || [])
            .map((c, i) => `  Comp ${i + 1}: ${c.address} (${c.distance}, ${c.specs}) — Price: ${c.soldPrice}, Status: ${c.adjPrice}`)
            .join('\n')
        : '  No verified comps returned from sanctioned functions.';

      const risksFormatted = (currentDossier.risks || []).length > 0
        ? (currentDossier.risks || [])
            .map(r => `  • ${r.title}: ${r.desc}`)
            .join('\n')
        : '  No verified risks returned from sanctioned functions.';

      const dossierContextBlock = propertyConversation ? `
DOSSIER FACTS:
- shortAddress: ${currentDossier.shortAddress || analyzedProperty}
- listPrice: ${currentDossier.listPrice || 'Could not resolve'}
- compsSummary: "${currentDossier.compsSummary || ''}"
- comps rows:
${compsFormatted}
- risk titles:
${risksFormatted}
`.trim() : 'NO PROPERTY DOSSIER IS RELEVANT TO THIS QUESTION. Do not use or mention previously loaded property data.';

      const snippetDirective = visualSnippet ? `
ACTIVE LEFT-TO-RIGHT ACTION EXECUTED:
You have pushed a visual breakdown to the right-side dossier panel:
- Card Title: "${visualSnippet.title}"
- Type: ${visualSnippet.type}
Directive: Explicitly mention in your response that you have pushed this breakdown/clause to the right-side advisory panel for their review.
` : '';

      const fullPrompt = `${dossierContextBlock}

${domainKnowledge}

${snippetDirective}

${COPILOT_CHARLIE_SYSTEM_PROMPT}

RECENT CONVERSATION — AUTHORITATIVE FOLLOW-UP CONTEXT:
${recentConversation || 'No prior dialogue.'}

KNOWLEDGE BASE CONTEXT:
${kbContext}

CURRENT USER QUESTION:
${clean}

DIRECTIVE FOR CHARLIE SIMMONS:
- Treat short replies such as “yes,” “no,” or “please do” as answers to Charlie’s immediately preceding question in RECENT CONVERSATION.
- Never introduce a property or address from stored dossier data unless the current question or its immediate follow-up context is property-specific.
- Act as an active operator of the right-side dashboard only when a visual breakdown is relevant to the current question.
- If this is a property question and comps are present, answer using those numbers; do not invent.
- For “Is this a good deal vs comps?” answer first with the exact visible conclusion.
- Answer directly, authoritatively, and conversationally in 2 to 4 concise sentences.
- Adhere strictly to hard stops (no legal/tax advice, no commissions/splits, CA DRE #02303118).`;

      const res = await base44.integrations.Core.InvokeLLM({
        model: 'gemini_3_flash',
        prompt: fullPrompt
      });

      if (presentationEpoch !== presentationEpochRef.current) return;
      const replyText = typeof res === 'string' ? res : res?.response || res?.content || JSON.stringify(res);
      const finalReplyText = replyText || `For ${currentDossier.shortAddress}, our sanctioned registry query returned no active comps. Individual discovery is required.`;
      setDialogueFocus({ id: userMsg.id, question: clean, response: finalReplyText, speaker: 'charlie' });

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'charlie',
          text: finalReplyText,
          pushedSnippetTitle: visualSnippet?.title || null,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      if (presentationEpoch !== presentationEpochRef.current) return;
      console.warn('InvokeLLM failed, providing grounded fallback:', err);
      const fallbackReply = `On ${dossierData.shortAddress || analyzedProperty}, our fiduciary desk reviews all unvarnished comps, geotechnical reports, and contract contingency protections to keep your earnest money deposit 100% safeguarded.`;
      setDialogueFocus({ id: userMsg.id, question: clean, response: fallbackReply, speaker: 'charlie' });
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'charlie',
          text: fallbackReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      if (presentationEpoch === presentationEpochRef.current) setIsSending(false);
    }
  };

  const { selectDoor: handleSelectMiniApp, doorSelectionVersion } = useCopilotDoorSelection({
    setView: setRightPanelView,
    setMessages,
    clearStage: () => {
      setActiveExplainer(null);
      setPushedSnippet(null);
      setDialogueFocus(null);
      setSelectedExplodedItem(null);
      liveClientRef.current?.stop();
      liveClientRef.current = null;
      setIsTalkLiveActive(false);
      setLiveStatus('ready');
      setLiveStatusText('');
      setActiveDemoSpeaker(null);
    }
  });

  const latestVoiceMessage = [...messages].reverse().find(
    (message) => message.sender === 'charlie' || message.sender === 'bob'
  );
  const activeVoiceMessage = dialogueFocus
    ? (dialogueFocus.response ? {
        id: dialogueFocus.id,
        text: dialogueFocus.response,
        sender: dialogueFocus.speaker,
        audioUrl: null
      } : null)
    : latestVoiceMessage;

  const resetToBlank = () => {
    // Invalidate pending replies before resetting every presentation surface.
    presentationEpochRef.current += 1;
    stopAllCopilotAudio();
    setMessages([]);
    setInputText('');
    setIsSending(false);
    isAuditingRef.current = false;
    setRightPanelView('news');
    setActiveExplainer(null);
    setDialogueFocus(null);
    setPushedSnippet(null);
    setSelectedExplodedItem(null);
    setIsPageExploded(false);
    setPresentationResetKey(key => key + 1);
    if (liveClientRef.current) {
      liveClientRef.current.stop();
      liveClientRef.current = null;
    }
    setIsTalkLiveActive(false);
    setLiveStatus('ready');
    setLiveStatusText('');
    setActiveDemoSpeaker(null);
  };

  const scrollToSection = (ref, pageNum, path) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const rect = ref.current.getBoundingClientRect();
      const top = rect.top + window.pageYOffset - 75;
      window.scrollTo({ top, behavior: 'smooth' });
      if (path && window.location.pathname !== path) {
        window.history.pushState(null, '', path);
      }
    }
  };

  const handleAuditAddress = async (addr) => {
    if (!addr || typeof addr !== 'string' || !addr.trim()) return;
    setDialogueFocus(null);
    const rawTrimmed = addr.trim();

    // Guard: Prevent duplicate overlapping audit requests
    if (isAuditingRef.current && lastAuditedAddressRef.current === rawTrimmed) {
      return;
    }
    const presentationEpoch = presentationEpochRef.current;
    isAuditingRef.current = true;
    lastAuditedAddressRef.current = rawTrimmed;

    const isListingUrl = /^(https?:\/\/|www\.|\w+\.(com|org|net))/i.test(rawTrimmed) || 
                         /zillow\.com|redfin\.com|realtor\.com|homes\.com/i.test(rawTrimmed);

    const cleanAddr = isListingUrl
      ? rawTrimmed
      : ((typeof extractAddressOrMls === 'function' ? extractAddressOrMls(rawTrimmed) : rawTrimmed) || rawTrimmed);

    setAnalyzedProperty(cleanAddr);
    setRightPanelView('dossier');
    addDiscussionChip(`Audit: ${cleanAddr.split(',')[0]}`);

    // Deliver audit command to Dialogue feed
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: `Audit property: ${cleanAddr}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);

    // Reliably scroll and bring Command Center & Dossier into view
    scrollToSection(page2Ref, 2, '/dossier');

    try {
      // Query sanctioned backend functions (mlsListingLookup / searchListingsForSkipTrace)
      const resolved = await resolveSanctionedDossier(cleanAddr);
      if (presentationEpoch !== presentationEpochRef.current) return;
      setDossierData(resolved);

      const hasComps = resolved.comps && resolved.comps.length > 0;
      const isMlsEmpty = resolved.isMlsEmpty || (resolved.inputType === 'mls' && resolved.comps?.length === 0);

      let charlieText = '';
      let bobMsgText = '';

      if (resolved.isAmbiguous) {
        charlieText = `Charlie here. Multiple properties found on ${resolved.shortAddress}. Which property would you like to audit? Select an address below or in your dossier to proceed:`;
        bobMsgText = `Bob Dyson here. When an entire street is searched without a house number, we verify each parcel individually. Please select your specific address.`;
      } else if (resolved.isVerified) {
        const bldg = resolved.building || {};
        const listInfo = resolved.listing || {};
        const valInfo = resolved.valuation || {};
        const statusStr = [listInfo.status || 'Active', listInfo.propertyType || ''].filter(Boolean).join(' ');
        const valStr = valInfo.estimatedValue ? `$${Number(valInfo.estimatedValue).toLocaleString()}` : (resolved.listPrice || '');
        const areaStr = bldg.livingArea ? `${Number(bldg.livingArea).toLocaleString()} sf` : '';
        const yearStr = bldg.yearBuilt ? `built in ${bldg.yearBuilt}` : '';
        const apnStr = resolved.ids?.apn ? `APN ${resolved.ids.apn}` : '';
        const details = [statusStr, areaStr, yearStr, apnStr].filter(Boolean).join(' • ');

        charlieText = `Charlie here. Verified property records for ${resolved.fullAddress || resolved.shortAddress} have been loaded into your dossier: ${details}${valStr ? ` (estimated value ~${valStr})` : ''}. ${resolved.compsSummary}`;
        bobMsgText = `Bob Dyson here. Property attributes and valuation for ${resolved.shortAddress} are confirmed from public records. We verify physical disclosures, permit histories, and title contingencies before advising on any purchase agreement.`;
      } else if (isMlsEmpty) {
        charlieText = `Charlie here. No listing records found for this MLS#. Try the full street address or paste the listing URL for a more reliable lookup.`;
        bobMsgText = `Bob Dyson here. When an MLS number doesn't match an active record, we recommend pasting the full street address or listing URL so we can pull the verified property details directly.`;
      } else {
        charlieText = `Charlie here. Our sanctioned property search could not resolve verified records for ${resolved.shortAddress}. We recommend individual discovery directly with the listing desk.`;
        bobMsgText = `Bob Dyson here. When public or API records cannot be verified, our fiduciary rule is never to guess. We verify title, listing status, and seller disclosures directly before advising on any offer.`;
      }

      const charlieMsg = {
        id: Date.now() + 1,
        sender: 'charlie',
        speakerName: 'Charlie Simmons',
        text: charlieText,
        options: resolved.ambiguousOptions || null,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const bobMsg = {
        id: Date.now() + 2,
        sender: 'bob',
        speakerName: 'Bob Dyson',
        text: bobMsgText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, charlieMsg, bobMsg]);
    } finally {
      if (presentationEpoch === presentationEpochRef.current) isAuditingRef.current = false;
    }
  };

  useEffect(() => {
    const hash = window.location.hash;
    const pathname = location.pathname;

    if (initialPage === 1 || hash === '#page-1' || hash === '#landing' || pathname === '/landing') {
      scrollToSection(page1Ref, 1);
    } else if (
      initialPage === 2 || 
      initialPage === 3 || 
      hash === '#page-2' || 
      hash === '#dossier' || 
      hash === '#chat' || 
      hash === '#team' || 
      pathname === '/dossier' || 
      pathname === '/chat' || 
      pathname === '/team' || 
      pathname === '/copilot-dossier' || 
      pathname === '/copilot-chat'
    ) {
      scrollToSection(page2Ref, 2);
    }

    const params = new URLSearchParams(window.location.search);
    const auditAddr = params.get('address') || params.get('audit') || params.get('property');
    if (auditAddr && auditAddr.trim() && lastAuditedAddressRef.current !== auditAddr.trim()) {
      handleAuditAddress(auditAddr.trim());
    }
  }, [initialPage, location.pathname]);

  return (
    <div className="min-h-screen text-[#0a0a0a] p-3 sm:p-6 lg:p-8 space-y-8 select-none" style={{ background: TAN_BG }}>
      
      {/* ── TOP STICKY NAVIGATION RAIL (ADMIN ONLY) ── */}
      {isAdmin && (
        <CopilotAdminHeaderNav
          onScrollToPage1={() => scrollToSection(page1Ref, 1, '/')}
          onScrollToPage2={() => scrollToSection(page2Ref, 2, '/dossier')}
        />
      )}

      {/* ── 2 STREAMLINED CORE PAGES ── */}
      <main className="space-y-12 w-full flex flex-col items-center">
        
        {/* ── PAGE 1: LANDING & PROPERTY SEARCH ── */}
        <section id="page-1" ref={page1Ref} className="w-full max-w-7xl scroll-mt-24">
          <div className="rounded-2xl border-2 border-[#D4AF37]/60 shadow-2xl overflow-hidden bg-[#0a0a0a]">
            <SlideFourPrivateWealth
              onRunAudit={(addr) => {
                if (addr) handleAuditAddress(addr);
              }}
              onOpenDossier={(addr) => {
                if (addr) handleAuditAddress(addr);
              }}
              onGoToChatCanvas={() => {
                scrollToSection(page2Ref, 2, '/dossier');
              }}
            />
          </div>
        </section>

        {/* ── PAGE 2: CONSOLIDATED COMMAND CENTER & DOSSIER (Mini-Apps Rail + Real 3-Way Dialogue + Fiduciary Dossier) ── */}
        <section id="page-2" ref={page2Ref} className="w-full max-w-7xl scroll-mt-24">
          <div className="rounded-2xl border-2 border-[#D4AF37]/60 shadow-2xl overflow-hidden bg-[#0a0a0a]">
            <div 
              className="w-full rounded-2xl border border-white/10 shadow-2xl overflow-hidden select-none text-left"
              style={{ background: '#080808', color: '#f5f5f5' }}
            >
              {/* ── MAIN CANVAS (FLEX-COL TO LG:FLEX-ROW) ── */}
              <div className="flex flex-col lg:flex-row h-auto lg:h-[720px] xl:h-[750px] overflow-hidden">
                
                {/* ── CENTER-LEFT COLUMN: ROSTER + LIVE GEMINI/INVOKELLM CHAT ── */}
                <div className="w-full lg:w-[480px] xl:w-[520px] p-3 sm:p-4 flex flex-col bg-[#0b0b0b] border-b lg:border-b-0 lg:border-r border-white/10 relative shrink-0 h-full overflow-hidden">
                  
                  {/* Scrollable Conversation Container */}
                  <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-2 scrollbar-thin">

                    {/* ── HEADER: COPILOT + COMMAND CENTER (EXACTLY WHERE IT WAS) ── */}
                    <div className="flex flex-col items-center pb-2 px-0.5">
                      <div className="flex items-baseline justify-center gap-2.5">
                        <span 
                          className="font-serif italic font-medium text-[#D4AF37] text-[48px] sm:text-[52px] leading-none select-none"
                          style={{ fontFamily: 'Cormorant Garamond, serif' }}
                        >
                          CoPilot
                        </span>
                        <span className="text-white text-[28px] sm:text-[32px] font-normal tracking-wide whitespace-nowrap">
                          Command Center
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-sans pt-1">
                        {checkedInUser ? (
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 shadow-sm text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                            <span className="text-stone-300 font-medium">
                              Welcome back, {checkedInUser.firstName}
                            </span>
                            <span className="text-stone-600">·</span>
                            <button
                              type="button"
                              onClick={handleSignOutOrClear}
                              className="text-stone-400 hover:text-white underline underline-offset-2 decoration-stone-600 hover:decoration-stone-300 cursor-pointer text-[11px]"
                            >
                              Sign out
                            </button>
                          </div>
                        ) : (
                          <Link
                            to="/login?returnTo=%2Fdossier"
                            className="text-stone-400 hover:text-white transition-colors underline underline-offset-4 decoration-stone-600 hover:decoration-stone-300 cursor-pointer text-[11px]"
                          >
                            Sign in
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* ── ROSTER: BOB, CHARLIE, YOU SPEAKER BOXES (REDUCED BY 10%) ── */}
                    <div className="grid grid-cols-3 gap-2 pt-1 max-w-[90%] mx-auto">
                      <CopilotDynamicSpeakerBox 
                        speaker="bob"
                        variant="card"
                        className="w-full"
                        isSpeakingOverride={activeDemoSpeaker === 'bob'}
                        activeExplainer={activeExplainer}
                        onClearExplainer={() => setActiveExplainer(null)}
                        onTriggerExplainer={(query) => executeSendMessage(query)}
                      />
                      <CopilotDynamicSpeakerBox 
                        speaker="charlie"
                        variant="card"
                        className="w-full"
                        isSpeakingOverride={activeDemoSpeaker === 'charlie'}
                        activeExplainer={activeExplainer}
                        onClearExplainer={() => setActiveExplainer(null)}
                        onTriggerExplainer={() => handleToggleTalkLive()}
                        onToggleTalkLive={handleToggleTalkLive}
                        liveStatus={liveStatus}
                        liveStatusText={liveStatusText}
                        isLiveActive={isTalkLiveActive}
                      />
                      <CopilotConsumerSpeakerBox 
                        className="w-full"
                        userName="You"
                        userRole="Verified Buyer"
                        isTransmitting={activeDemoSpeaker === 'consumer'}
                      />
                    </div>

                    {/* ── INTERACTIVE 3-WAY DIALOGUE STAGE ── */}
                    <div className="pt-2">
                      <CopilotThreeWayDemo 
                        onTurnChange={setActiveDemoSpeaker}
                        onResetDemo={resetToBlank}
                        onMessagePosted={(msg) => {
                          setMessages(prev => [...prev, msg]);
                        }}
                      />
                    </div>

                    {/* ── COMMAND BAR: POSITIONED DIRECTLY UNDER DEMO BOX MATCHING PAGE 1 SEARCH STYLE ── */}
                    <div className="pt-2.5 pb-1 space-y-2">
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          executeSendMessage();
                        }} 
                        className="w-full"
                      >
                        <div 
                          className="flex items-center rounded-full px-3.5 py-1.5 transition-all border border-[#666666] w-full relative overflow-hidden shadow-lg bg-black"
                          style={{ backgroundColor: '#000000', color: '#ffffff' }}
                        >
                          <Paperclip className="w-4 h-4 text-white hover:text-[#D4AF37] mr-2 shrink-0 cursor-pointer z-10 transition-colors" title="Attach file or pre-approval" />
                          
                          <div className="relative flex-1 min-w-0 flex items-center h-7 overflow-hidden">
                            {!inputText && !isInputFocused && (
                              <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none text-white/70 text-xs sm:text-sm whitespace-nowrap">
                                <div className="inline-flex animate-marquee whitespace-nowrap">
                                  <span className="mr-12 font-normal text-white">Ask anything real estate—compliance, Prop 19, escrow traps, comps...</span>
                                  <span className="mr-12 font-normal text-white">Ask anything real estate—compliance, Prop 19, escrow traps, comps...</span>
                                </div>
                              </div>
                            )}

                            <input
                              type="text"
                              value={inputText}
                              onFocus={() => setIsInputFocused(true)}
                              onBlur={() => setIsInputFocused(false)}
                              onChange={(e) => setInputText(e.target.value)}
                              placeholder=""
                              className="w-full bg-transparent text-white text-xs sm:text-sm outline-none font-normal min-w-0 z-10 placeholder:text-white/60"
                              style={{ color: '#ffffff' }}
                            />
                          </div>

                          <div className="flex items-center gap-1.5 ml-2 shrink-0 z-10">
                            <button
                              type="button"
                              onClick={handleToggleTalkLive}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center justify-center ${
                                isTalkLiveActive 
                                  ? 'bg-red-600 text-white animate-pulse' 
                                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                              }`}
                              title={isTalkLiveActive ? "End live Gemini duplex session" : "Talk Live with Charlie"}
                            >
                              <span>{isTalkLiveActive ? (liveStatus === 'connecting' ? 'Connecting…' : 'End Voice') : 'Talk Live'}</span>
                            </button>

                            <button
                              type="submit"
                              disabled={isSending}
                              className="px-5 py-2 rounded-full font-bold text-xs flex items-center justify-center transition-all cursor-pointer shadow-sm bg-[#0a0a0a] hover:bg-[#1a1a1a] text-[#D4AF37] hover:text-white border border-[#666666] active:scale-95"
                              style={{ backgroundColor: '#000000', color: '#D4AF37' }}
                              title="Send message to Charlie"
                            >
                              <span style={{ color: '#D4AF37' }}>{isSending ? 'Sending...' : 'Send'}</span>
                              <span className="text-[#D4AF37] ml-1">→</span>
                            </button>
                          </div>
                        </div>
                      </form>

                      {/* Talk Live Helper & Exact Status Bar */}
                      <div className="flex items-center justify-between text-[11px] px-2 py-0.5 min-h-[22px]">
                        <span className="text-stone-300 font-sans truncate">
                          {liveStatus === 'connecting' ? (
                            <span className="text-[#D4AF37] font-semibold animate-pulse">Connecting…</span>
                          ) : liveStatus === 'listening' ? (
                            <span className="text-emerald-400 font-semibold">Listening — interrupt anytime</span>
                          ) : liveStatus === 'speaking' ? (
                            <span className="text-[#D4AF37] font-semibold">Speaking — interrupt anytime</span>
                          ) : liveStatus === 'mic_denied' ? (
                            <span className="text-rose-400 font-semibold">Mic blocked. Allow microphone for this site, then tap Talk Live again.</span>
                          ) : liveStatus === 'error' ? (
                            <span className="text-rose-400 font-semibold">Couldn’t start voice. Tap Talk Live to retry.</span>
                          ) : (
                            <span className="text-stone-400">Tap once — then just talk. No typing.</span>
                          )}
                        </span>

                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          {isTalkLiveActive && (
                            <button
                              type="button"
                              onClick={handleToggleTalkLive}
                              className="px-2 py-0.5 rounded bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-200 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                              <span>End</span>
                            </button>
                          )}

                          {messages.length > 0 && (
                            <button
                              type="button"
                              onClick={resetToBlank}
                              className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white border border-white/15 transition-all cursor-pointer whitespace-nowrap"
                              title="Clear the session and restore the News image and video"
                            >
                              Clear Session
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ── 3-WAY INTERACTIVE DIALOGUE FEED (COLOR-CODED DURING SPEECH & AT REST) ── */}
                    <div className="space-y-3 pt-3">
                      {messages.map((m) => {
                        const isConsumer = m.sender === 'consumer';
                        const isCharlie = m.sender === 'charlie';
                        const isBob = m.sender === 'bob';
                        const isPlainUser = m.sender === 'user';

                        // Active speaking state driven by 3-Way Dialogue Demo
                        const isSpeakingNow = (
                          (activeDemoSpeaker === 'consumer' && isConsumer) ||
                          (activeDemoSpeaker === 'charlie' && isCharlie) ||
                          (activeDemoSpeaker === 'bob' && isBob)
                        );

                        // Speaker subtle accents: Soft tonal backgrounds, thin clean borders, no neon glows
                        let bubbleClasses = 'bg-[#141414] border border-white/10 text-stone-200';
                        if (isSpeakingNow) {
                          if (isConsumer) {
                            bubbleClasses = 'bg-[#171313] border border-rose-500/60 text-white shadow-sm';
                          } else if (isCharlie) {
                            bubbleClasses = 'bg-[#121614] border border-emerald-500/50 text-white shadow-sm';
                          } else if (isBob) {
                            bubbleClasses = 'bg-[#181611] border border-[#D4AF37]/60 text-white shadow-sm';
                          }
                        } else {
                          if (isConsumer) {
                            bubbleClasses = 'bg-[#141212] border border-white/10 border-l-2 border-l-rose-400/70 text-white';
                          } else if (isCharlie) {
                            bubbleClasses = 'bg-[#121413] border border-white/10 border-l-2 border-l-emerald-400/70 text-stone-200';
                          } else if (isBob) {
                            bubbleClasses = 'bg-[#151411] border border-white/10 border-l-2 border-l-[#D4AF37]/70 text-stone-200';
                          } else if (isPlainUser) {
                            bubbleClasses = 'bg-[#161616] border border-white/10 text-white';
                          }
                        }

                        return (
                          <div 
                            key={m.id} 
                            className={`flex flex-col ${isPlainUser ? 'items-end' : 'items-start'} transition-all duration-300`}
                          >
                            {/* Color-Coded Speaker Name & Status Indicator */}
                            <div className="mb-1 px-1 text-[11px] font-medium flex items-center gap-1.5">
                              {isConsumer ? (
                                <>
                                  <span className={`w-2 h-2 rounded-full bg-rose-500 ${isSpeakingNow ? 'animate-ping' : ''}`} />
                                  <span className="text-rose-400 font-bold">
                                    {m.speakerName || 'You (Buyer)'}
                                  </span>
                                  {isSpeakingNow && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-rose-500/15 text-rose-300 font-sans">
                                      Speaking Live
                                    </span>
                                  )}
                                </>
                              ) : isCharlie ? (
                                <>
                                  <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${isSpeakingNow ? 'animate-ping' : ''}`} />
                                  <span className="text-emerald-400 font-medium">
                                    {m.speakerName || 'Charlie Simmons (Voice)'}
                                  </span>
                                  {isSpeakingNow && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-300 font-sans">
                                      Speaking Live
                                    </span>
                                  )}
                                </>
                              ) : isBob ? (
                                <>
                                  <span className={`w-1.5 h-1.5 rounded-full bg-[#D4AF37] ${isSpeakingNow ? 'animate-ping' : ''}`} />
                                  <span className="text-[#D4AF37] font-medium">
                                    {m.speakerName || 'Bob Dyson (Broker)'}
                                  </span>
                                  {isSpeakingNow && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-sans">
                                      Advising Live
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="text-stone-300 font-semibold">You</span>
                              )}
                            </div>

                            <div 
                              className={`rounded-xl px-4 py-3 text-xs sm:text-[13px] leading-relaxed max-w-[96%] transition-all duration-300 ${bubbleClasses}`}
                            >
                              <p className="whitespace-pre-line font-normal">{m.text}</p>

                              {/* Pushed Visual Snippet Link Affordance */}
                              {m.pushedSnippetTitle && (
                                <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                                  <span className="text-[10.5px] text-stone-300 font-sans">
                                    Pushed to right panel: <strong className="text-white font-medium">{m.pushedSnippetTitle}</strong>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (page2Ref.current) {
                                        const panel = page2Ref.current.querySelector('#copilot-right-panel');
                                        if (panel) panel.scrollIntoView({ behavior: 'smooth' });
                                      }
                                    }}
                                    className="text-[10px] text-[#D4AF37] hover:underline flex items-center gap-1 font-sans cursor-pointer ml-2 shrink-0"
                                  >
                                    <span>View on Panel →</span>
                                  </button>
                                </div>
                              )}

                              {/* Escalation Protocol Card: 1-Click Call or Connect with Bob Dyson */}
                              {m.isEscalation && (
                                <div className="mt-3 pt-2.5 border-t border-[#D4AF37]/30 space-y-2.5">
                                  <div className="flex items-center gap-1.5 text-[#D4AF37] text-[11px] font-sans font-medium">
                                    <Shield className="w-3.5 h-3.5" />
                                    <span>Programmed Broker Handoff · California DRE #02303118</span>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                    <a
                                      href="tel:8583531200"
                                      className="px-3 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#e8c84a] text-black font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                                    >
                                      <Phone className="w-3.5 h-3.5" />
                                      <span>Call Bob Dyson · (858) 353-1200</span>
                                    </a>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEscalationQuestion(m.text || 'Requested direct broker consultation');
                                        setIsEscalationModalOpen(true);
                                      }}
                                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center gap-1.5 border border-white/15 transition-all cursor-pointer"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
                                      <span>Request Priority Callback</span>
                                    </button>
                                  </div>
                                </div>
                              )}

                              {m.options && m.options.length > 0 && (
                                <div className="mt-3 pt-2.5 border-t border-white/10 space-y-2">
                                  <span className="text-stone-300 text-xs font-medium block font-sans">
                                    Which property? Select below:
                                  </span>
                                  <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                                    {m.options.map((opt, oIdx) => (
                                      <button
                                        key={oIdx}
                                        type="button"
                                        onClick={() => handleAuditAddress(opt.fullAddress)}
                                        className="text-left px-3 py-1.5 rounded-lg bg-black/60 hover:bg-[#D4AF37] hover:text-black text-white text-xs border border-white/20 transition-all font-mono flex items-center justify-between cursor-pointer"
                                      >
                                        <span>{opt.street}, {opt.city} {opt.zip}</span>
                                        <span className="text-[10px] opacity-70">Audit →</span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {m.time && (
                              <span className="text-[9px] text-stone-500 mt-1 px-1 font-mono">
                                {m.time}
                              </span>
                            )}
                          </div>
                        );
                      })}

                      {isSending && (
                        <div className="flex flex-col items-start">
                          <div className="mb-0.5 px-1 text-[11px] font-medium text-emerald-400 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            <span>Charlie Simmons (Voice)</span>
                          </div>
                          <div className="rounded-xl px-3.5 py-2 bg-[#0c1a14] border border-emerald-500/40 text-stone-300 text-xs flex items-center gap-2">
                            <span>Charlie is consulting property records &amp; fiduciary directives...</span>
                          </div>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                </div>

                {/* ── RIGHT COLUMN: PROPERTY AUDIT, SOLUTIONS VAULT & DAILY NEWS ── */}
                <div id="copilot-right-panel" className="flex-1 min-w-0 bg-[#080808] h-full overflow-hidden flex flex-col">
                  <CopilotDossierNewsPanel
                    key={presentationResetKey}
                    property={analyzedProperty}
                    dossierData={dossierData}
                    activeView={rightPanelView}
                    dialogueFocus={dialogueFocus}
                    onViewChange={handleSelectMiniApp}
                    doorSelectionVersion={doorSelectionVersion}
                    isExploded={isPageExploded}
                    onToggleExplode={() => setIsPageExploded(prev => !prev)}
                    onExplodeItem={(item) => {
                      setSelectedExplodedItem(item);
                      setIsPageExploded(true);
                    }}
                    onPromptClick={(query) => executeSendMessage(query)}
                    onAuditAddress={(addr) => handleAuditAddress(addr)}
                    onOpenCaptureModal={() => setIsCaptureModalOpen(true)}
                    isSubscriber={isSubscriber}
                    onBackToSearch={() => {
                      setRightPanelView('dossier');
                    }}
                    pushedSnippet={pushedSnippet}
                    onDismissSnippet={() => setPushedSnippet(null)}
                    onClear={resetToBlank}
                    activeExplainer={activeExplainer}
                  />
                </div>

              </div>

              {/* ── FOOTER ROW: SAVED DISCUSSIONS & CHIPS HORIZONTAL (LEFT) & BRANDING 3-ROW STACK (FAR RIGHT) ── */}
              <CopilotFooterBranding
                savedCount={savedCount}
                onOpenSavedDiscussions={() => setIsSavedDiscussionsOpen(true)}
                discussionChips={discussionChips}
                activeDoor={rightPanelView || 'dossier'}
                voiceText={activeVoiceMessage?.text || ''}
                voiceSpeaker={activeVoiceMessage?.sender || 'charlie'}
                voiceAudioUrl={activeVoiceMessage?.audioUrl || null}
                voiceAutoPlayKey={activeVoiceMessage?.id}
                onVoiceStateChange={(playing, speaker) => setActiveDemoSpeaker(playing ? speaker : null)}
                onSelectChip={(chip) => {
                  if (['audit', 'vetting', 'roadmap', 'escrow', 'news'].includes(chip.id)) {
                    handleSelectMiniApp(chip.view);
                  } else {
                    handleSelectMiniApp(chip.view);
                    executeSendMessage(chip.query);
                  }
                }}
                onOpenReferModal={() => setIsReferModalOpen(true)}
                onOpenLegalModal={() => setIsLegalModalOpen(true)}
              />

              {/* ── BOTTOM HORIZONTAL AI MINIONS RAIL ── */}
              <CopilotMiniAppsRail 
                onSelectApp={handleSelectMiniApp} 
                activeApp={rightPanelView || 'dossier'} 
              />

              {/* ── FULL-PAGE EXPLODED SUBJECT THEATER ── */}
              <CopilotExplodedSubjectModal
                key={presentationResetKey}
                onClear={resetToBlank}
                isOpen={isPageExploded}
                onClose={() => {
                  setIsPageExploded(false);
                  setSelectedExplodedItem(null);
                }}
                subjectType={rightPanelView}
                activeView={rightPanelView}
                onViewChange={handleSelectMiniApp}
                selectedItem={selectedExplodedItem}
                onSelectItem={setSelectedExplodedItem}
                dossierData={dossierData}
                property={analyzedProperty}
                onPromptClick={(query) => executeSendMessage(query)}
                onOpenCaptureModal={() => setIsCaptureModalOpen(true)}
                isSubscriber={isSubscriber}
              />

              {/* ── CONTACT CAPTURE MODAL ── */}
              <CopilotContactCaptureModal
                isOpen={isCaptureModalOpen}
                onClose={() => setIsCaptureModalOpen(false)}
                propertyAddress={dossierData.fullAddress || analyzedProperty}
                dossierSnapshot={dossierData}
                mlsId={dossierData?.mlsId || dossierData?.mls_id || undefined}
                onCaptureSuccess={(captured) => {
                  setMessages(prev => [
                    ...prev,
                    {
                      id: Date.now(),
                      sender: 'charlie',
                      text: `Your report request for ${captured.address} has been recorded with our fiduciary desk. Delivery is held pending verification. No broker pressure or unsolicited outreach.`
                    }
                  ]);
                }}
              />

              {/* ── SAVED DISCUSSIONS MODAL ── */}
              <CopilotSavedDiscussionsModal
                isOpen={isSavedDiscussionsOpen}
                onClose={() => setIsSavedDiscussionsOpen(false)}
                currentMessages={messages}
                currentProperty={analyzedProperty}
                onRestoreDiscussion={(restoredMsgs) => {
                  setMessages(restoredMsgs);
                }}
                onSaveCurrent={() => {
                  try {
                    const raw = localStorage.getItem('dyson_copilot_saved_discussions');
                    if (raw) setSavedCount(JSON.parse(raw).length);
                  } catch (_) {}
                }}
              />

              {/* ── REFER A FRIEND MODAL ── */}
              <CopilotReferAFriendModal
                isOpen={isReferModalOpen}
                onClose={() => setIsReferModalOpen(false)}
              />

              {/* ── LEGAL & DISCLOSURES MODAL ── */}
              <CopilotLegalDisclosuresModal
                isOpen={isLegalModalOpen}
                onClose={() => setIsLegalModalOpen(false)}
              />

              {/* ── BROKER PRIORITY ESCALATION MODAL (HITTING THE WALL) ── */}
              <CopilotBrokerEscalationModal
                isOpen={isEscalationModalOpen}
                onClose={() => setIsEscalationModalOpen(false)}
                initialQuestion={escalationQuestion}
                propertyAddress={dossierData.fullAddress || analyzedProperty}
                onEscalationSuccess={(esc) => {
                  setMessages(prev => [
                    ...prev,
                    {
                      id: Date.now(),
                      sender: 'bob',
                      speakerName: 'Bob Dyson',
                      text: `Thank you, ${esc.name || 'valued buyer'}. Your priority consultation request has been forwarded directly to my desk. I will review your documentation and connect with you shortly.`
                    }
                  ]);
                }}
              />

            </div>
          </div>
        </section>

      </main>
    </div>
  );
}