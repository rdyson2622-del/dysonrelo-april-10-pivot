import { useState } from 'react';
import { base44 } from '@/api/base44Client';

const INITIAL_SUBJECTS = [
  ['property-audit', 'Property Audit', 'Review property facts, comparable sales, material risks, and open diligence items.'],
  ['agent-vetting', 'Agent Vetting', 'Focus on agent background, local performance, references, and fit.'],
  ['move-roadmap', 'Relocation Road Maps', 'Organize the move into a clear sequence of decisions, owners, and next steps.'],
  ['escrow-watch', 'Escrow Watch', 'Track escrow milestones, unresolved items, deadlines, and transaction questions.'],
  ['dnn-news', 'DNN News', 'Bring current housing and relocation intelligence into the working dossier.']
].map(([id, title, placeholder]) => ({ id, title, placeholder }));

export default function useChiefPilotWorkspace() {
  const [subjects, setSubjects] = useState(INITIAL_SUBJECTS);
  const [activeId, setActiveId] = useState(null);
  const [conversations, setConversations] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const activeSubject = subjects.find(subject => subject.id === activeId) || null;

  const rename = (id, title) => setSubjects(items => items.map(item => item.id === id ? { ...item, title } : item));
  const move = (id, direction) => setSubjects(items => {
    const from = items.findIndex(item => item.id === id);
    const to = from + direction;
    if (from < 0 || to < 0 || to >= items.length) return items;
    const reordered = [...items];
    [reordered[from], reordered[to]] = [reordered[to], reordered[from]];
    return reordered;
  });

  const send = async text => {
    if (!activeSubject || !text.trim() || loading) return false;
    const next = [...(conversations[activeId] || []), { role: 'user', content: text.trim() }];
    setConversations(current => ({ ...current, [activeId]: next }));
    setLoading(true);
    setError('');
    try {
      const res = await base44.functions.invoke('adminCharlie', { messages: next });
      const reply = res.data?.reply || 'No response.';
      setConversations(current => ({ ...current, [activeId]: [...(current[activeId] || []), { role: 'charlie', content: reply }] }));
      return true;
    } catch (_) {
      setError('The workspace could not respond. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { subjects, activeSubject, activeId, setActiveId, conversations, loading, error, rename, move, send };
}