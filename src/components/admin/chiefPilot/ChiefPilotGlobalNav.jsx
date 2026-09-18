import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import CopilotWordmark from '@/components/brand/CopilotWordmark';

const MODES = [['chats', 'Chats'], ['news', 'News'], ['library', 'Library · For Preferred Clients']];
const SUBJECTS = [['property-search', 'Property Search'], ['property-audit', 'Property Audit'], ['agent-vetting', 'Agent Vetting'], ['team-thread', 'Team Thread'], ['move-roadmap', 'Relocation Road Maps'], ['escrow-watch', 'Escrow Watch']];

export default function ChiefPilotGlobalNav() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const activeSubject = location.pathname === '/admin/chief-pilot' ? params.get('subject') : '';
  const activeMode = location.pathname === '/admin/chief-pilot' ? (params.get('mode') || (activeSubject ? 'chats' : '')) : '';
  let activity = [];
  try { activity = JSON.parse(sessionStorage.getItem('chief_pilot_recent_activity') || '[]').slice(0, 3); } catch (_) {}
  return (
    <section className="shrink-0 border-b border-white/10 bg-dyson-black px-4 py-5">
      <Link to="/admin/chief-pilot?open=1" className="flex items-center gap-2"><span className="text-[10px] tracking-[0.18em] text-white">DYSON HOMES</span><CopilotWordmark bold className="h-8 w-24" /></Link>
      <nav className="mt-5 space-y-1 border-y border-white/10 py-4">{MODES.map(([id, label]) => <Link key={id} to={`/admin/chief-pilot?mode=${id}`} className={`block rounded-lg px-4 py-2.5 text-sm ${activeMode === id ? 'bg-white/15 text-white' : 'text-dyson-taupe hover:bg-white/5 hover:text-white'}`}>{label}</Link>)}</nav>
      <div className="pt-5"><p className="mb-2 text-[11px] text-dyson-taupe">Subjects</p><nav className="space-y-1"><Link to="/admin/chief-pilot?mode=solutions" className={`block border-l px-4 py-2.5 text-sm ${activeMode === 'solutions' ? 'border-dyson-gold text-white' : 'border-transparent text-dyson-taupe hover:text-white'}`}>Real Estate Solutions</Link>{SUBJECTS.map(([id, label]) => <Link key={id} to={`/admin/chief-pilot?mode=chats&subject=${id}`} className={`block border-l px-4 py-2.5 text-sm ${activeSubject === id ? 'border-dyson-gold text-white' : 'border-transparent text-dyson-taupe hover:text-white'}`}>{label}</Link>)}</nav></div>
      {activity.length > 0 && <div className="mt-5 border-t border-white/10 pt-4"><p className="mb-2 text-[11px] text-dyson-taupe">Prior activity</p>{activity.map(item => <Link key={item.id} to={`/admin/chief-pilot?mode=chats&subject=${item.subjectId || 'property-search'}`} className="block truncate py-1.5 text-xs text-dyson-taupe hover:text-white">{item.label}</Link>)}</div>}
    </section>
  );
}