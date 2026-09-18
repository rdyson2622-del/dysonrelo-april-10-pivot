import { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { getCheckedInUser, saveToClientVault } from '@/lib/copilotContactSession';
import { resolveSanctionedDossier } from '@/lib/resolveSanctionedDossier';

const INITIAL_SUBJECTS = [['property-search', 'Property Search'], ['property-audit', 'Property Audit'], ['agent-vetting', 'Agent Vetting'], ['team-thread', 'Team Thread'], ['move-roadmap', 'Relocation Road Maps'], ['escrow-watch', 'Escrow Watch']].map(([id, title]) => ({ id, title }));
const PROPERTY_KEY = 'chief_pilot_active_property';
const ACTIVITY_KEY = 'chief_pilot_recent_activity';
const EXAMPLE_HIDDEN_KEY = 'chief_pilot_example_hidden';
export const DEMO_PROPERTY_ADDRESS = '6228 Calle Pavana, San Diego, CA 92139';
const DEMO_LISTING_URL = 'https://www.realtor.com/realestateandhomes-detail/6228-Calle-Pavana_San-Diego_CA_92139_M18233-70493';
const DEMO_PROPERTY = { fullAddress: DEMO_PROPERTY_ADDRESS, shortAddress: '6228 Calle Pavana', listingUrl: DEMO_LISTING_URL, listing: { listingUrl: DEMO_LISTING_URL }, address: { city: 'San Diego', state: 'CA', zip: '92139' } };
const ESCROW_KEY = 'chief_pilot_escrow_stub';
const ESCROW_STEPS = ['Escrow opened', 'Deposit and disclosures', 'Inspections and contingencies', 'Loan and appraisal', 'Final review and close'];
const fromSession = key => {
  try { return JSON.parse(sessionStorage.getItem(key) || 'null'); } catch (_) { return null; }
};

export default function useChiefPilotWorkspace() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState(INITIAL_SUBJECTS);
  const [mode, setMode] = useState('chats');
  const [entryOpen, setEntryOpen] = useState(true);
  const [activeId, setActiveId] = useState('property-search');
  const [activity, setActivity] = useState(() => fromSession(ACTIVITY_KEY) || []);
  const [libraryItems, setLibraryItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dyson_copilot_saved_discussions') || '[]'); } catch (_) { return []; }
  });
  const [showExample, setShowExample] = useState(() => sessionStorage.getItem(EXAMPLE_HIDDEN_KEY) !== '1' && localStorage.getItem(EXAMPLE_HIDDEN_KEY) !== '1');
  const [exampleProperty, setExampleProperty] = useState(DEMO_PROPERTY);
  const [exampleLoading, setExampleLoading] = useState(false);
  const [activeProperty, setActiveProperty] = useState(() => fromSession(PROPERTY_KEY));
  const [escrowStub, setEscrowStub] = useState(() => fromSession(ESCROW_KEY));
  const [conversations, setConversations] = useState({});
  const [teamMessages, setTeamMessages] = useState([]);
  const [selectedAgentName, setSelectedAgentName] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [introStatus, setIntroStatus] = useState('idle');
  const [saveStatus, setSaveStatus] = useState('idle');
  const [preferredClientActive, setPreferredClientActive] = useState(() => sessionStorage.getItem('chief_pilot_preferred_active') === '1');
  const [error, setError] = useState('');
  const activeSubject = mode === 'news' ? { id: 'dnn-news', title: 'DNN News' } : mode === 'library' ? { id: 'library', title: 'My Library' } : subjects.find(subject => subject.id === activeId) || null;
  const preferredClient = getCheckedInUser(user);
  const displayProperty = activeProperty || (showExample ? exampleProperty : null);
  const isExample = !activeProperty && showExample;
  useEffect(() => {
    if (activeProperty || !showExample || exampleProperty.isVerified) return;
    let current = true; setExampleLoading(true);
    resolveSanctionedDossier(DEMO_PROPERTY_ADDRESS).then(result => {
      if (current && result?.isVerified) setExampleProperty({ ...result, listingUrl: DEMO_LISTING_URL, listing: { ...(result.listing || {}), listingUrl: DEMO_LISTING_URL } });
    }).catch(() => null).finally(() => { if (current) setExampleLoading(false); });
    return () => { current = false; };
  }, [activeProperty, showExample, exampleProperty.isVerified]);
  const hideExample = () => {
    setShowExample(false); sessionStorage.setItem(EXAMPLE_HIDDEN_KEY, '1');
    if (preferredClient?.isPreferredClient) localStorage.setItem(EXAMPLE_HIDDEN_KEY, '1');
  };
  const historyItems = useMemo(() => {
    const saved = libraryItems.map((item, index) => ({ id: `saved-${item.id || index}`, kind: 'Saved item', label: item.title || 'Saved discussion', timestamp: item.saved_at || item.savedAt || '', mode: 'library' }));
    return [...activity, ...saved].sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0)).slice(0, 15);
  }, [activity, libraryItems]);
  const recordActivity = item => setActivity(current => {
    const next = [{ ...item, id: `${item.kind}-${Date.now()}`, timestamp: new Date().toISOString() }, ...current].slice(0, 15);
    sessionStorage.setItem(ACTIVITY_KEY, JSON.stringify(next)); return next;
  });
  const openEntry = () => setEntryOpen(true);
  const closeEntry = () => setEntryOpen(false);
  const selectEntryTarget = id => {
    if (id === 'library' && !preferredClientActive) return;
    if (id === 'dnn-news') setMode('news');
    else if (id === 'library') setMode('library');
    else { setMode('chats'); setActiveId(id); }
  };
  const selectMode = nextMode => {
    if (nextMode === 'library' && !preferredClientActive) return;
    setEntryOpen(false); setMode(nextMode);
  };
  const selectSubject = id => {
    setEntryOpen(false); setMode('chats'); setActiveId(id);
    document.getElementById('chief-pilot-content')?.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const openActivity = item => {
    if (item.mode === 'library') { setMode('library'); return; }
    if (item.property) { setActiveProperty(item.property); sessionStorage.setItem(PROPERTY_KEY, JSON.stringify(item.property)); }
    if (item.subjectId === 'dnn-news') setMode('news');
    else { setMode('chats'); setActiveId(item.subjectId || 'property-search'); }
  };

  const rename = (id, title) => setSubjects(items => items.map(item => item.id === id ? { ...item, title } : item));
  const move = (id, direction) => setSubjects(items => {
    const from = items.findIndex(item => item.id === id);
    const to = from + direction;
    if (from < 0 || to < 0 || to >= items.length) return items;
    const reordered = [...items];
    [reordered[from], reordered[to]] = [reordered[to], reordered[from]];
    return reordered;
  });

  const clearActiveProperty = () => {
    setActiveProperty(null); setEscrowStub(null); setSelectedAgentName(''); setTeamMessages([]); setSearchError(''); setIntroStatus('idle'); setSaveStatus('idle');
    sessionStorage.removeItem(PROPERTY_KEY); sessionStorage.removeItem(ESCROW_KEY);
  };
  const runPropertySearch = async query => {
    clearActiveProperty(); setSearchLoading(true);
    const result = await resolveSanctionedDossier(query);
    setSearchLoading(false);
    if (!result?.isVerified) {
      setSearchError(result?.marketSummary || 'No verified property record was found. Try another address or MLS#.');
      return false;
    }
    setActiveProperty(result); sessionStorage.setItem(PROPERTY_KEY, JSON.stringify(result));
    recordActivity({ kind: 'Search', label: result.fullAddress || query, subjectId: 'property-search', property: result });
    return true;
  };
  const requestVettedIntro = async () => {
    const targetProperty = activeProperty || displayProperty;
    if (!targetProperty) return;
    if (!preferredClientActive) {
      selectSubject('property-search');
      requestAnimationFrame(() => requestAnimationFrame(() => document.getElementById('preferred-client-door')?.scrollIntoView({ behavior: 'smooth', block: 'center' })));
      return;
    }
    if (isExample) { setSelectedAgentName('Selected after Vetting'); setIntroStatus('saved'); return; }
    if (!preferredClient?.isPreferredClient) { setIntroStatus('gate'); return; }
    setIntroStatus('saving');
    try {
      await base44.entities.VettedIntroIntent.create({
        preferred_client_name: preferredClient.name,
        preferred_client_email: preferredClient.email || undefined,
        preferred_client_phone: preferredClient.phone || undefined,
        property_address: targetProperty.fullAddress,
        destination_city: targetProperty.address?.city || undefined,
        destination_state: targetProperty.address?.state || undefined,
        destination_zip: targetProperty.address?.zip || undefined,
        mls_number: targetProperty.listing?.listingNumber || undefined,
        status: 'pending', source: 'chief_pilot'
      });
      setSelectedAgentName('Vetted introduction requested');
      setIntroStatus('saved');
    } catch (_) { setIntroStatus('error'); }
  };
  const startEscrowWatch = () => {
    const targetProperty = activeProperty || displayProperty;
    if (!targetProperty) return;
    const stub = { propertyAddress: targetProperty.fullAddress, steps: ESCROW_STEPS.map(label => ({ label, status: isExample ? 'EXAMPLE' : 'pending' })) };
    setEscrowStub(stub); sessionStorage.setItem(ESCROW_KEY, JSON.stringify(stub));
  };
  const activatePreferredClient = () => {
    setPreferredClientActive(true);
    sessionStorage.setItem('chief_pilot_preferred_active', '1');
  };
  const sendTeamMessage = text => {
    if (!preferredClientActive || !text.trim()) return;
    setTeamMessages(items => [...items, { id: Date.now(), role: 'client', text: text.trim() }]);
  };
  const saveProperty = async () => {
    if (!displayProperty || saveStatus === 'saving') return;
    if (!preferredClientActive) {
      selectSubject('property-search');
      requestAnimationFrame(() => requestAnimationFrame(() => document.getElementById('preferred-client-door')?.scrollIntoView({ behavior: 'smooth', block: 'center' })));
      return;
    }
    setSaveStatus('saving');
    await saveToClientVault({ title: `${displayProperty.shortAddress || displayProperty.fullAddress} property file`, item_type: 'dossier', address: displayProperty.fullAddress, payload: { property: displayProperty } });
    try { setLibraryItems(JSON.parse(localStorage.getItem('dyson_copilot_saved_discussions') || '[]')); } catch (_) {}
    setSaveStatus('saved');
  };

  const runConversation = async (text, requirePreferred) => {
    if (!activeSubject || !text.trim() || loading) return false;
    const contextId = activeSubject.id;
    if (requirePreferred && !preferredClientActive) {
      selectSubject('property-search');
      requestAnimationFrame(() => requestAnimationFrame(() => document.getElementById('preferred-client-door')?.scrollIntoView({ behavior: 'smooth', block: 'center' })));
      return false;
    }
    const next = [...(conversations[contextId] || []), { role: 'user', content: text.trim(), createdAt: new Date().toISOString() }];
    setConversations(current => ({ ...current, [contextId]: next })); setLoading(true); setError('');
    recordActivity({ kind: 'Chat', label: text.trim(), subjectId: contextId, mode });
    const known = displayProperty ? JSON.stringify({ example: isExample, address: displayProperty.address, fullAddress: displayProperty.fullAddress, building: displayProperty.building, listing: displayProperty.listing, valuation: displayProperty.valuation, comps: displayProperty.comps, risks: displayProperty.risks }) : 'No Active Property';
    const scoped = next.map((message, index) => index === next.length - 1 ? { ...message, content: `SELECTED SUBJECT: ${activeSubject.title}\nVERIFIED ACTIVE PROPERTY DATA: ${known}\nUse only known data. Never invent property facts, comps, risks, dates, or prices. Do not execute actions or send/draft outreach. If the answer requires unavailable data, begin with [HANDOFF] and recommend Call / Connect with Bob.\n\nUSER MESSAGE: ${message.content}` } : message);
    try {
      const res = await base44.functions.invoke('adminCharlie', { messages: scoped });
      const raw = res.data?.reply || '[HANDOFF] I could not verify an answer from known data.';
      const handoff = raw.includes('[HANDOFF]') || /cannot verify|could not verify|not available in the known data|do not have verified/i.test(raw);
      const reply = raw.replace('[HANDOFF]', '').trim();
      setConversations(current => ({ ...current, [contextId]: [...(current[contextId] || []), { role: 'charlie', content: reply, handoff, createdAt: new Date().toISOString() }] }));
      return true;
    } catch (_) {
      setConversations(current => ({ ...current, [contextId]: [...(current[contextId] || []), { role: 'charlie', content: 'I could not verify an answer from known data.', handoff: true, createdAt: new Date().toISOString() }] }));
      return true;
    } finally { setLoading(false); }
  };
  const send = text => runConversation(text, true);
  const sendEntry = text => runConversation(text, false);

  return { subjects, mode, entryOpen, openEntry, closeEntry, selectEntryTarget, selectMode, selectSubject, historyItems, openActivity, libraryItems, activeSubject, activeId, activeProperty, displayProperty, isExample, showExample, exampleLoading, hideExample, escrowStub, conversations, teamMessages, selectedAgentName, loading, searchLoading, searchError, introStatus, saveStatus, preferredClientActive, error, rename, move, send, sendEntry, sendTeamMessage, runPropertySearch, clearActiveProperty, requestVettedIntro, startEscrowWatch, activatePreferredClient, saveProperty };
}