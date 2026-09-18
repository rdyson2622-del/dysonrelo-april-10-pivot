import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { getCheckedInUser } from '@/lib/copilotContactSession';
import { resolveSanctionedDossier } from '@/lib/resolveSanctionedDossier';

const INITIAL_SUBJECTS = [['property-search', 'Property Search'], ['property-audit', 'Property Audit'], ['agent-vetting', 'Agent Vetting'], ['move-roadmap', 'Relocation Road Maps'], ['escrow-watch', 'Escrow Watch'], ['dnn-news', 'DNN News']].map(([id, title]) => ({ id, title }));
const PROPERTY_KEY = 'chief_pilot_active_property';
const ESCROW_KEY = 'chief_pilot_escrow_stub';
const ESCROW_STEPS = ['Escrow opened', 'Deposit and disclosures', 'Inspections and contingencies', 'Loan and appraisal', 'Final review and close'];
const fromSession = key => {
  try { return JSON.parse(sessionStorage.getItem(key) || 'null'); } catch (_) { return null; }
};

export default function useChiefPilotWorkspace() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState(INITIAL_SUBJECTS);
  const [activeId, setActiveId] = useState('property-search');
  const [activeProperty, setActiveProperty] = useState(() => fromSession(PROPERTY_KEY));
  const [escrowStub, setEscrowStub] = useState(() => fromSession(ESCROW_KEY));
  const [conversations, setConversations] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [introStatus, setIntroStatus] = useState('idle');
  const [error, setError] = useState('');
  const activeSubject = subjects.find(subject => subject.id === activeId) || null;
  const preferredClient = getCheckedInUser(user);

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
    setActiveProperty(null); setEscrowStub(null); setSearchError(''); setIntroStatus('idle');
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
    return true;
  };
  const requestVettedIntro = async () => {
    if (!activeProperty) return;
    if (!preferredClient?.isPreferredClient) { setIntroStatus('gate'); return; }
    setIntroStatus('saving');
    try {
      await base44.entities.VettedIntroIntent.create({
        preferred_client_name: preferredClient.name,
        preferred_client_email: preferredClient.email || undefined,
        preferred_client_phone: preferredClient.phone || undefined,
        property_address: activeProperty.fullAddress,
        destination_city: activeProperty.address?.city || undefined,
        destination_state: activeProperty.address?.state || undefined,
        destination_zip: activeProperty.address?.zip || undefined,
        mls_number: activeProperty.listing?.listingNumber || undefined,
        status: 'pending', source: 'chief_pilot'
      });
      setIntroStatus('saved');
    } catch (_) { setIntroStatus('error'); }
  };
  const startEscrowWatch = () => {
    if (!activeProperty) return;
    const stub = { propertyAddress: activeProperty.fullAddress, steps: ESCROW_STEPS.map(label => ({ label, status: 'pending' })) };
    setEscrowStub(stub); sessionStorage.setItem(ESCROW_KEY, JSON.stringify(stub));
  };

  const send = async text => {
    if (!activeSubject || !text.trim() || loading) return false;
    const next = [...(conversations[activeId] || []), { role: 'user', content: text.trim() }];
    setConversations(current => ({ ...current, [activeId]: next })); setLoading(true); setError('');
    const known = activeProperty ? JSON.stringify({ address: activeProperty.address, fullAddress: activeProperty.fullAddress, building: activeProperty.building, listing: activeProperty.listing, valuation: activeProperty.valuation, comps: activeProperty.comps, risks: activeProperty.risks }) : 'No Active Property';
    const scoped = next.map((message, index) => index === next.length - 1 ? { ...message, content: `SELECTED SUBJECT: ${activeSubject.title}\nVERIFIED ACTIVE PROPERTY DATA: ${known}\nUse only known data. Never invent property facts, comps, risks, dates, or prices. Do not execute actions or send/draft outreach. If the answer requires unavailable data, begin with [HANDOFF] and recommend Call / Connect with Bob.\n\nUSER MESSAGE: ${message.content}` } : message);
    try {
      const res = await base44.functions.invoke('adminCharlie', { messages: scoped });
      const raw = res.data?.reply || '[HANDOFF] I could not verify an answer from known data.';
      const handoff = raw.includes('[HANDOFF]') || /cannot verify|could not verify|not available in the known data|do not have verified/i.test(raw);
      const reply = raw.replace('[HANDOFF]', '').trim();
      setConversations(current => ({ ...current, [activeId]: [...(current[activeId] || []), { role: 'charlie', content: reply, handoff }] }));
      return true;
    } catch (_) {
      setConversations(current => ({ ...current, [activeId]: [...(current[activeId] || []), { role: 'charlie', content: 'I could not verify an answer from known data.', handoff: true }] }));
      return true;
    } finally { setLoading(false); }
  };

  return { subjects, activeSubject, activeId, setActiveId, activeProperty, escrowStub, conversations, loading, searchLoading, searchError, introStatus, error, rename, move, send, runPropertySearch, clearActiveProperty, requestVettedIntro, startEscrowWatch };
}