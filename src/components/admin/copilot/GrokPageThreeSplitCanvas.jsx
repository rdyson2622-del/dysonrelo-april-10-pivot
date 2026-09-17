import React, { useState, useRef, useEffect } from 'react';
import { 
  Paperclip, Send, Scale, ShieldAlert, FileText, 
  Waves, Clock, Radio, Mic, Briefcase, Shield, Sparkles, ArrowLeft, Bookmark, Phone, MessageSquare
} from 'lucide-react';
import CopilotDynamicSpeakerBox from '@/components/copilot/CopilotDynamicSpeakerBox';
import CopilotConsumerSpeakerBox from '@/components/copilot/CopilotConsumerSpeakerBox';
import CopilotThreeWayDemo from '@/components/copilot/CopilotThreeWayDemo';
import CopilotMiniAppsRail from '@/components/copilot/CopilotMiniAppsRail';
import CopilotDossierNewsPanel from '@/components/copilot/CopilotDossierNewsPanel';
import CopilotContactCaptureModal from '@/components/copilot/CopilotContactCaptureModal';
import CopilotExplodedSubjectModal from '@/components/copilot/CopilotExplodedSubjectModal';
import CopilotSavedDiscussionsModal from '@/components/copilot/CopilotSavedDiscussionsModal';
import CopilotBrokerEscalationModal from '@/components/copilot/CopilotBrokerEscalationModal';
import { findExplainerByQuery } from '@/components/copilot/copilotExplainers';
import { getPropertyDossier } from './propertyDossierData';
import { 
  getDomainKnowledgeContext, 
  detectVisualSnippetRequest, 
  detectEscalationTrigger 
} from '@/lib/copilotDomainContext';
import { base44 } from '@/api/base44Client';
import { COPILOT_CHARLIE_SYSTEM_PROMPT } from '@/pages/DysonHomesCopilot';
import { GeminiLiveSessionClient } from '@/lib/geminiLiveClient';

export default function GrokPageThreeSplitCanvas({ property, onBackToSearch, showRail = true }) {
  const [inputText, setInputText] = useState('');
  const [activeExplainer, setActiveExplainer] = useState(null);
  const [activeDemoSpeaker, setActiveDemoSpeaker] = useState(null);
  const [rightPanelView, setRightPanelView] = useState('dossier'); // 5 doors: 'dossier' | 'vetting' | 'roadmap' | 'escrow' | 'news' | 'solutions'
  const [isPageExploded, setIsPageExploded] = useState(false);
  const [selectedExplodedItem, setSelectedExplodedItem] = useState(null);
  const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false);
  const [isSavedDiscussionsOpen, setIsSavedDiscussionsOpen] = useState(false);
  const [isEscalationModalOpen, setIsEscalationModalOpen] = useState(false);
  const [escalationQuestion, setEscalationQuestion] = useState('');
  const [pushedSnippet, setPushedSnippet] = useState(null);
  const [isSending, setIsSending] = useState(false);

  // Talk Live (Gemini Live with active door context)
  const [isTalkLiveActive, setIsTalkLiveActive] = useState(false);
  const [liveStatus, setLiveStatus] = useState('ready');
  const [liveStatusText, setLiveStatusText] = useState('');
  const liveClientRef = useRef(null);

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

  // Discussion history stack state (stacked as added, retained on 40% side)
  const [discussionChips, setDiscussionChips] = useState([
    { id: 'audit', label: 'Property Audit', query: 'Charlie, walk me through how this home sits against adjusted comps', view: 'dossier' },
    { id: 'vetting', label: 'Agent Vetting', query: 'Bob, what are the top 3 traps when a buyer uses the listing agent?', view: 'vetting' },
    { id: 'roadmap', label: 'Move Roadmap', query: 'Charlie, what are the next milestones after an offer is accepted?', view: 'roadmap' },
    { id: 'escrow', label: 'Escrow Watch', query: 'Bob, what does a bad contingency look like?', view: 'escrow' },
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
  const [isInputFocused, setIsInputFocused] = useState(false);
  const messagesEndRef = useRef(null);
  const canvasRef = useRef(null);
  const dossierData = getPropertyDossier(property);

  // Command Center & Intelligence panel conversation messages
  const [messages, setMessages] = useState([]);

  // Cleanup Live Client on unmount
  useEffect(() => {
    return () => {
      if (liveClientRef.current) {
        liveClientRef.current.stop();
        liveClientRef.current = null;
      }
    };
  }, []);

  // When property is passed/updated, deliver fiduciary audit to dialogue if empty
  useEffect(() => {
    if (property && messages.length === 0) {
      const cleanAddr = property;
      const userMsg = {
        id: Date.now(),
        sender: 'user',
        text: `Audit property: ${cleanAddr}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const charlieMsg = {
        id: Date.now() + 1,
        sender: 'charlie',
        speakerName: 'Charlie Simmons',
        text: `Charlie here. Property audit initiated for ${cleanAddr}. I've pulled recent verified sales within 0.75 miles, adjusted for market shifts, and checked local environmental and property risk factors. On the right, your live dossier is active with Honest comps, Hidden risks, and Compliance and discovery.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const bobMsg = {
        id: Date.now() + 2,
        sender: 'bob',
        speakerName: 'Bob Dyson',
        text: `Bob Dyson here. Under our referral agreement, CoPilot remains your strategic intelligence partner alongside your vetted agent for ${cleanAddr}. We help you understand the risks of dual agency, structure contingency milestones, and verify disclosures to safeguard your earnest money deposit.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([userMsg, charlieMsg, bobMsg]);
      setRightPanelView('dossier');
    }
  }, [property]);

  const resetToBlank = () => {
    setMessages([]);
    setRightPanelView(null);
    setActiveExplainer(null);
    setPushedSnippet(null);
    if (liveClientRef.current) {
      liveClientRef.current.stop();
      liveClientRef.current = null;
    }
    setIsTalkLiveActive(false);
    setLiveStatus('ready');
    setActiveDemoSpeaker(null);
  };

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  // Talk Live (Gemini Live Session) with active door context
  const handleToggleTalkLive = async () => {
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
      const domainContext = getDomainKnowledgeContext(activeDoor, property, dossierData);
      const dynamicLivePrompt = `${COPILOT_CHARLIE_SYSTEM_PROMPT}

ACTIVE DOOR CONTEXT:
${domainContext}

DOSSIER FACTS FOR ${dossierData.shortAddress || property}:
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
          if (sp === 'assistant') setActiveDemoSpeaker('charlie');
          else if (sp === 'user') setActiveDemoSpeaker('consumer');
          else setActiveDemoSpeaker(null);
        },
        onTranscript: (item) => {
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
          console.warn('Gemini Live session error in split canvas:', err);
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
      console.warn('Failed to start Gemini Live session in split canvas:', e);
      setLiveStatus('error');
      setLiveStatusText('Couldn’t start voice. Tap Talk Live to retry.');
      setIsTalkLiveActive(false);
      setActiveDemoSpeaker(null);
    }
  };

  // ── UNIFIED MESSAGE EXECUTION ENGINE (CONTEXT LOADING + LEFT-TO-RIGHT ACTIONS + HIT-A-WALL ESCALATION) ──
  const executeSendMessage = async (textToSend) => {
    const clean = (textToSend || inputText).trim();
    if (!clean || isSending) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: clean,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    addDiscussionChip(clean);

    // ── 1. HIT-A-WALL ESCALATION DETECTION (NO GUESSING / HALLUCINATING) ──
    const escalation = detectEscalationTrigger(clean);
    if (escalation) {
      const handoffMsg = {
        id: Date.now() + 1,
        sender: escalation.speaker || 'bob',
        speakerName: escalation.speaker === 'bob' ? 'Bob Dyson' : 'Charlie Simmons',
        text: escalation.handoffText,
        isEscalation: true,
        escalationData: escalation,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, handoffMsg]);
      setIsSending(false);

      try {
        base44.entities.CharlieEscalation.create({
          consumer_question: clean,
          handoff_response: escalation.handoffText,
          status: 'open',
          priority: 'urgent',
          page_context: `Copilot Split Canvas - ${property || 'Subject Property'}`
        }).catch(err => console.warn('Non-blocking escalation log:', err));
      } catch (_) {}
      return;
    }

    setIsSending(true);

    // ── 2. LEFT-TO-RIGHT ACTION DETECTION (VISUAL SNIPPET PUSH & DOOR ROUTING) ──
    let activeTargetDoor = rightPanelView || 'dossier';

    if (/news|broadcast|dnn/i.test(clean)) {
      activeTargetDoor = 'news';
      setRightPanelView('news');
    } else if (/vetting|agent vetting|dual agency|hire agent|connect with an agent|advisory agreement|exclusive agreement/i.test(clean)) {
      activeTargetDoor = 'vetting';
      setRightPanelView('vetting');
    } else if (/roadmap|milestone|steps to buy|timeline|phase/i.test(clean)) {
      activeTargetDoor = 'roadmap';
      setRightPanelView('roadmap');
    } else if (/escrow|deposit|emd|contingency|title exception|liquidated damages|notice to perform/i.test(clean)) {
      activeTargetDoor = 'escrow';
      setRightPanelView('escrow');
    } else if (/solution|vault|playbook|prop 19/i.test(clean)) {
      activeTargetDoor = 'solutions';
      setRightPanelView('solutions');
    } else if (/audit|comps|risk/i.test(clean)) {
      activeTargetDoor = 'dossier';
      setRightPanelView('dossier');
    }

    const visualSnippet = detectVisualSnippetRequest(clean, activeTargetDoor, property, dossierData);
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
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: explainer.speaker === 'bob' ? 'bob' : 'charlie',
          speakerName: explainer.speaker === 'bob' ? 'Bob Dyson' : 'Charlie Simmons',
          text: explainer.textAnswer || `Playing video explainer for "${explainer.label}".`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsSending(false);
      return;
    }

    try {
      // ── 3. DOMAIN-SPECIFIC CONTEXT LOADING ──
      const domainKnowledge = getDomainKnowledgeContext(activeTargetDoor, property, dossierData);
      const isBobPrimary = activeTargetDoor === 'escrow' || activeTargetDoor === 'vetting' || /bob|contract|legal|title|deposit|contingency|liquidated damages/i.test(clean);

      const compsFormatted = (dossierData.comps || []).length > 0
        ? (dossierData.comps || []).map((c, i) => `  Comp ${i+1}: ${c.address} (${c.distance}, ${c.specs}) — Price: ${c.soldPrice}, Status: ${c.adjPrice}`).join('\n')
        : '  No verified comps returned.';

      const risksFormatted = (dossierData.risks || []).length > 0
        ? (dossierData.risks || []).map(r => `  • ${r.title}: ${r.desc}`).join('\n')
        : '  No verified risks returned.';

      const dossierContextBlock = `
DOSSIER FACTS FOR ${dossierData.shortAddress || property}:
- Short Address: ${dossierData.shortAddress || property}
- List Price: ${dossierData.listPrice || 'Under review'}
- Comps Summary: "${dossierData.compsSummary || ''}"
- Comps Matrix:
${compsFormatted}
- Risk Factors:
${risksFormatted}
`;

      const snippetDirective = visualSnippet ? `
ACTIVE LEFT-TO-RIGHT ACTION EXECUTED:
You have pushed a structured visual breakdown to the right-side dossier panel:
- Card Title: "${visualSnippet.title}"
- Type: ${visualSnippet.type}
Directive: Explicitly inform the buyer in your response that you have pushed this breakdown/clause to the right-side panel for their review.
` : '';

      const fullPrompt = `${dossierContextBlock}

${domainKnowledge}

${snippetDirective}

${COPILOT_CHARLIE_SYSTEM_PROMPT}

USER QUESTION:
${clean}

SPEAKER ASSIGNMENT & DIRECTIVE:
${isBobPrimary ? "Answer primarily as Bob Dyson (Principal Broker, CA DRE #02303118). Use Bob's experienced, fiduciary, supportive guidance focusing on contract protections, liquidated damages cap (3% under Cal. Civ. Code § 1675), and active contingency removal (Form CR and 48-hr Notice to Perform)." : "Answer as Charlie Simmons (Voice AI Concierge). Warm, clear, concise, referencing the active door and dossier details on screen."}
- Answer authoritatively in 2 to 4 concise sentences.
- Never lecture, never give formal legal advice, never guess on complex structural/legal disputes.`;

      const res = await base44.integrations.Core.InvokeLLM({
        model: 'gemini_3_flash',
        prompt: fullPrompt
      });

      const replyText = typeof res === 'string' ? res : res?.response || res?.content || JSON.stringify(res);

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: isBobPrimary ? 'bob' : 'charlie',
          speakerName: isBobPrimary ? 'Bob Dyson' : 'Charlie Simmons',
          text: replyText || `For ${dossierData.shortAddress || property}, our fiduciary desk reviews all unvarnished comps and contract contingency protections to keep your earnest money deposit 100% safeguarded.`,
          pushedSnippetTitle: visualSnippet?.title || null,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.warn('InvokeLLM fallback in split canvas:', err);
      const isBobPrimary = activeTargetDoor === 'escrow' || activeTargetDoor === 'vetting';
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: isBobPrimary ? 'bob' : 'charlie',
          speakerName: isBobPrimary ? 'Bob Dyson' : 'Charlie Simmons',
          text: isBobPrimary 
            ? `Bob Dyson here. Under California Form RPA, contingencies never expire automatically. We ensure your earnest money deposit is safeguarded under the 3% statutory cap (Cal. Civ. Code § 1675) and review all preliminary title Schedule B exceptions before any contingency removal.`
            : `Charlie here. On ${dossierData.shortAddress || property}, our fiduciary desk reviews comps, hazard disclosures, and contract contingency protections with zero added broker fees.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handlePillClick = (query) => {
    executeSendMessage(query);
  };

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    executeSendMessage();
  };

  const handleSelectMiniApp = (appId) => {
    setRightPanelView(appId);
    if (appId === 'dossier') {
      addDiscussionChip('Property Audit', 'dossier');
    } else if (appId === 'vetting') {
      addDiscussionChip('Agent Vetting', 'vetting');
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: 'charlie',
          speakerName: 'Charlie Simmons',
          text: `I've opened the Agent Vetting view for ${dossierData.shortAddress || property}. Under our referral agreement, CoPilot remains actively involved alongside your chosen buyer's agent throughout the entire purchase, equipping you with independent analysis at every step.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } else if (appId === 'roadmap') {
      addDiscussionChip('Move Roadmap', 'roadmap');
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: 'charlie',
          speakerName: 'Charlie Simmons',
          text: `Here is the 7-phase transaction sequence for ${dossierData.shortAddress || property}. CoPilot remains actively involved alongside you and your agent through each phase—from offer formulation to final escrow recording.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } else if (appId === 'escrow') {
      addDiscussionChip('Escrow Watch', 'escrow');
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: 'bob',
          speakerName: 'Bob Dyson',
          text: `Bob Dyson here. I've opened our Escrow & Title diligence view. Under our referral agreement, we stay by your side alongside your agent and escrow officer to provide second-opinion reviews of title exceptions and contingency milestones.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } else if (appId === 'dnn') {
      setRightPanelView('news');
      addDiscussionChip('DNN News', 'news');
    }
  };

  return (
    <div 
      className="w-full rounded-2xl border border-white/10 shadow-2xl overflow-hidden select-none text-left"
      style={{ background: '#080808', color: '#f5f5f5' }}
    >
      {/* ── MAIN CANVAS (FLEX-COL TO LG:FLEX-ROW) ── */}
      <div ref={canvasRef} className="flex flex-col lg:flex-row h-auto lg:h-[720px] xl:h-[750px] overflow-hidden">
        
        {/* ── CENTER-LEFT COLUMN: ROSTER (VISUAL/READ-ONLY, CHARLIE ONLY LIVE TALK) + GROK-PLAIN CHAT ── */}
        <div className="w-full lg:w-[480px] xl:w-[520px] p-3 sm:p-4 flex flex-col bg-[#0b0b0b] border-b lg:border-b-0 lg:border-r border-white/10 relative shrink-0 h-full overflow-hidden">
          
          {/* Scrollable Conversation Container */}
          <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-2 scrollbar-thin">

            {/* ── HEADER: COPILOT + COMMAND CENTER (EXACTLY WHERE IT WAS) ── */}
            <div className="flex items-baseline justify-center gap-2.5 pb-2 px-0.5">
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
                onResetDemo={() => {
                  setActiveDemoSpeaker(null);
                  resetToBlank();
                }}
                onMessagePosted={(msg) => {
                  setMessages(prev => [...prev, msg]);
                }}
              />
            </div>

            {/* ── COMMAND BAR: POSITIONED DIRECTLY UNDER DEMO BOX MATCHING PAGE 1 SEARCH STYLE ── */}
            <div className="pt-2.5 pb-1 space-y-2">
              <form onSubmit={handleSendMessage} className="w-full">
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
                      title="Send message"
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
                      className="px-2 py-1 rounded-md text-[10px] font-medium bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white border border-white/15 transition-all cursor-pointer whitespace-nowrap"
                      title="Clear all messages and reset screen to blank"
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
                              if (canvasRef.current) {
                                const panel = canvasRef.current.querySelector('#copilot-right-panel');
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
                              <span>Call / Connect with Bob</span>
                            </button>
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
              <div ref={messagesEndRef} />
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN: PROPERTY AUDIT, SOLUTIONS VAULT & DAILY NEWS ── */}
        <div id="copilot-right-panel" className="flex-1 min-w-0 bg-[#080808] h-full overflow-hidden flex flex-col">
          <CopilotDossierNewsPanel
            property={property}
            dossierData={dossierData}
            activeView={rightPanelView}
            onViewChange={setRightPanelView}
            isExploded={isPageExploded}
            onToggleExplode={() => setIsPageExploded(prev => !prev)}
            onExplodeItem={(item) => {
              setSelectedExplodedItem(item);
              setIsPageExploded(true);
            }}
            onPromptClick={handlePillClick}
            onOpenCaptureModal={() => setIsCaptureModalOpen(true)}
            isSubscriber={isSubscriber}
            activeExplainer={activeExplainer}
            pushedSnippet={pushedSnippet}
            onDismissSnippet={() => setPushedSnippet(null)}
            onBackToSearch={() => {
              resetToBlank();
              onBackToSearch?.();
            }}
          />
        </div>

      </div>

      {/* ── FOOTER ROW DIRECTLY OVER MINI APPS: DISCUSSION STACK (LOWER LEFT <= 40% SCREEN) & BRANDING (FAR RIGHT) ── */}
      <div className="px-3 sm:px-4 py-2.5 bg-[#0a0a0a] border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Discussion History & Saved Discussions Stack (Lower Left Stacked, <= 40% Screen Width) */}
        <div className="w-full sm:max-w-[40%] flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsSavedDiscussionsOpen(true)}
            className="px-2.5 py-1 rounded-md text-[10px] font-medium bg-[#141414] hover:bg-white/10 text-stone-300 hover:text-white border border-white/15 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm shrink-0"
            title="Open Saved Discussions"
          >
            <Bookmark className="w-3 h-3 text-[#D4AF37]" />
            <span>Saved Discussions</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#D4AF37] text-black text-[9px] font-bold">
                {savedCount}
              </span>
            )}
          </button>

          {discussionChips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => {
                if (chip.view) setRightPanelView(chip.view);
                handlePillClick(chip.query);
              }}
              className="px-2.5 py-1 rounded-md text-[10px] bg-[#141414] hover:bg-white/10 text-stone-400 hover:text-white active:bg-white active:text-black border border-white/15 transition-all cursor-pointer shrink-0"
              title={chip.query}
            >
              <span>{chip.label}</span>
            </button>
          ))}
        </div>

        {/* Footer Branding: stacked vertically on the far right */}
        <div className="flex flex-col items-end text-right font-normal text-white shrink-0 self-end sm:self-center ml-auto">
          <span className="text-[12px] sm:text-[12.5px] font-normal text-white tracking-normal whitespace-nowrap">
            The Dyson &amp; Dyson Companies, Inc. Ca. DRE#02303118
          </span>
          <div className="text-[11.5px] sm:text-[12px] font-normal text-white flex items-center gap-2 whitespace-nowrap mt-0.5">
            <a href="tel:8583531200" className="text-white hover:underline transition-colors font-normal">
              (858) 353 1200
            </a>
            <span className="text-white">·</span>
            <a href="mailto:bob@dysonrelo.com" className="text-white hover:underline transition-colors font-normal">
              bob@dysonrelo.com
            </a>
          </div>
        </div>
      </div>

      {/* ── BOTTOM HORIZONTAL AI MINIONS RAIL ── */}
      {showRail && (
        <CopilotMiniAppsRail 
          onSelectApp={handleSelectMiniApp}
          activeApp={rightPanelView || 'dossier'}
        />
      )}

      {/* ── FULL-PAGE EXPLODED SUBJECT THEATER ── */}
      <CopilotExplodedSubjectModal
        isOpen={isPageExploded}
        onClose={() => {
          setIsPageExploded(false);
          setSelectedExplodedItem(null);
        }}
        subjectType={rightPanelView}
        activeView={rightPanelView}
        onViewChange={setRightPanelView}
        selectedItem={selectedExplodedItem}
        onSelectItem={setSelectedExplodedItem}
        dossierData={dossierData}
        property={property}
        onPromptClick={handlePillClick}
        onOpenCaptureModal={() => setIsCaptureModalOpen(true)}
        isSubscriber={isSubscriber}
      />

      {/* ── CONTACT CAPTURE MODAL ── */}
      <CopilotContactCaptureModal
        isOpen={isCaptureModalOpen}
        onClose={() => setIsCaptureModalOpen(false)}
        propertyAddress={dossierData.fullAddress || property || '742 Vista Del Mar, La Jolla, CA'}
        onCaptureSuccess={(captured) => {
          setIsSubscriber(true);
          setMessages(prev => [
            ...prev,
            {
              id: Date.now(),
              sender: 'charlie',
              text: `I've queued the complete fiduciary property audit for ${captured.address} directly to ${captured.phone}.\n\nYou've also been granted complimentary VIP Subscriber access to our Daily DNN News broadcasts under Bob Dyson's broker desk!`
            }
          ]);
        }}
      />

      {/* ── SAVED DISCUSSIONS MODAL ── */}
      <CopilotSavedDiscussionsModal
        isOpen={isSavedDiscussionsOpen}
        onClose={() => setIsSavedDiscussionsOpen(false)}
        currentMessages={messages}
        currentProperty={property}
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

      {/* ── BROKER PRIORITY ESCALATION MODAL (HITTING THE WALL) ── */}
      <CopilotBrokerEscalationModal
        isOpen={isEscalationModalOpen}
        onClose={() => setIsEscalationModalOpen(false)}
        initialQuestion={escalationQuestion}
        propertyAddress={dossierData?.fullAddress || property}
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
  );
}