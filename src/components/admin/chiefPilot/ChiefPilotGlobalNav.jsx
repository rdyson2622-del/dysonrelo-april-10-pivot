import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings } from 'lucide-react';
import CopilotWordmark from '@/components/brand/CopilotWordmark';

const WHAT_WE_DO = [['buy', 'Buy'], ['relocation-management', 'Relocation Management'], ['sell', 'Sell'], ['solutions', 'Real Estate Solutions'], ['news', 'Real Estate News']];
const ADMINISTRATION = [['chats', 'Chats'], ['library', 'Library · For Preferred Clients']];
const SUBJECTS = [['property-search', 'Property Searches'], ['property-audit', 'Property Audits'], ['agent-vetting', 'Agent Vettings'], ['team-thread', 'Team Threads'], ['move-roadmap', 'Relocation Road Maps'], ['escrow-watch', 'Escrow Watch and Compliance']];

export default function ChiefPilotGlobalNav() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const onChiefPilot = location.pathname === '/admin/chief-pilot';
  const activeSubject = onChiefPilot ? params.get('subject') : '';
  const activeMode = onChiefPilot ? (params.get('mode') || (activeSubject ? 'chats' : '')) : '';
  let activity = [];
  try { activity = JSON.parse(sessionStorage.getItem('chief_pilot_recent_activity') || '[]').slice(0, 3); } catch (_) {}

  return (
    <section className="shrink-0 border-b border-white/10 bg-dyson-black px-4 py-5">
      <div className="flex items-center justify-between gap-2">
        <Link to="/admin/chief-pilot?open=1" className="flex items-center gap-2"><span className="text-[10px] tracking-[0.18em] text-white">DYSON HOMES</span><CopilotWordmark bold className="h-8 w-24" /></Link>
        <Link to="/admin" title="Admin" className="flex items-center justify-center rounded-full p-1.5 text-dyson-taupe transition-colors hover:bg-white/5 hover:text-dyson-gold-light"><Settings className="h-4 w-4" /></Link>
      </div>

      <nav className="mt-5 space-y-1 border-y border-white/10 py-4">
        <p className="mb-1 px-4 text-[11px] text-dyson-taupe">What We Do</p>
        {WHAT_WE_DO.map(([id, label]) => (
          <Link key={id} to={`/admin/chief-pilot?mode=${id}`} className={`block rounded-lg px-4 py-2.5 text-sm ${activeMode === id ? 'bg-white/15 text-white' : 'text-dyson-taupe hover:bg-white/5 hover:text-white'}`}>{label}</Link>
        ))}
      </nav>

      <div className="pt-5">
        <p className="mb-2 text-[11px] text-dyson-taupe">Administration</p>
        <nav className="space-y-1">
          {ADMINISTRATION.map(([id, label]) => (
            <Link key={id} to={`/admin/chief-pilot?mode=${id}`} className={`block rounded-lg px-4 py-2.5 text-sm ${activeMode === id ? 'bg-white/15 text-white' : 'text-dyson-taupe hover:bg-white/5 hover:text-white'}`}>{label}</Link>
          ))}
        </nav>
      </div>

      <div className="pt-5">
        <p className="mb-2 text-[11px] text-dyson-taupe">Subjects to Explore</p>
        <nav className="space-y-1">
          {SUBJECTS.map(([id, label]) => (
            <Link key={id} to={`/admin/chief-pilot?mode=chats&subject=${id}`} className={`block border-l px-4 py-2.5 text-sm ${activeSubject === id ? 'border-dyson-gold text-white' : 'border-transparent text-dyson-taupe hover:text-white'}`}>{label}</Link>
          ))}
        </nav>
      </div>

      {activity.length > 0 && (
        <div className="mt-5 border-t border-white/10 pt-4">
          <p className="mb-2 text-[11px] text-dyson-taupe">Prior activity</p>
          {activity.map(item => <Link key={item.id} to={`/admin/chief-pilot?mode=chats&subject=${item.subjectId || 'property-search'}`} className="block truncate py-1.5 text-xs text-dyson-taupe hover:text-white">{item.label}</Link>)}
        </div>
      )}
    </section>
  );
}