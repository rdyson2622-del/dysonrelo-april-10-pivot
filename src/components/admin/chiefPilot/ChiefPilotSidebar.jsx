import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import ChiefPilotModeRail from './ChiefPilotModeRail';
import ChiefPilotSubjectList from './ChiefPilotSubjectList';
import ChiefPilotHistory from './ChiefPilotHistory';
import ChiefPilotChatComposer from './ChiefPilotChatComposer';
import CopilotWordmark from '@/components/brand/CopilotWordmark';
import { useAuth } from '@/lib/AuthContext';

export default function ChiefPilotSidebar({ workspace }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isSolutions = !workspace.entryOpen && workspace.mode === 'solutions';
  const activeSubjectId = !workspace.entryOpen && workspace.mode === 'chats' && !workspace.isChatsInbox ? workspace.activeId : '';
  const selectMode = id => { workspace.selectMode(id); setMobileOpen(false); };
  const selectSubject = id => { workspace.selectSubject(id); setMobileOpen(false); };
  return (
    <aside className={`flex min-h-0 flex-col gap-4 rounded-lg border border-white/10 bg-dyson-ink p-5 md:h-full ${mobileOpen ? 'fixed inset-0 z-50 overflow-y-auto md:static md:z-auto md:overflow-visible' : ''}`}>
      <div className="flex items-center justify-between gap-2">
        <button type="button" onClick={workspace.openEntry} title="Back to CoPilot home" className="flex items-center gap-2 rounded-md px-1 -mx-1 py-1 transition-colors hover:bg-white/5">
          <span className="text-[10px] tracking-[0.18em] text-dyson-text">DYSON HOMES</span><CopilotWordmark bold className="h-7 w-16" />
        </button>
        {isAdmin && <Link to="/admin" title="Admin" className="flex items-center justify-center rounded-full p-1.5 text-dyson-taupe transition-colors hover:bg-white/5 hover:text-dyson-gold-light"><Settings className="h-4 w-4" /></Link>}
        <button type="button" onClick={() => setMobileOpen(value => !value)} className="text-xs text-dyson-taupe md:hidden">{mobileOpen ? 'Close' : 'Menu'}</button>
      </div>
      <div className={`${mobileOpen ? 'flex' : 'hidden'} min-h-0 flex-1 flex-col gap-4 md:overflow-y-auto md:flex`}>
        <nav className="flex flex-col gap-1 border-y border-white/10 py-3" aria-label="Chief Pilot services">
          <p className="mb-1 px-3 text-[11px] text-dyson-taupe">What We Do</p>
          {[['buy', 'Buy'], ['relocation-management', 'Relocation Management'], ['sell', 'Sell']].map(([id, label]) => (
            <button key={id} type="button" onClick={() => selectMode(id)} className={`w-full rounded-md px-3 py-2 text-left text-xs hover:bg-white/5 ${!workspace.entryOpen && workspace.mode === id ? 'text-dyson-gold-light' : 'text-dyson-taupe hover:text-dyson-text'}`}>{label}</button>
          ))}
          <button type="button" onClick={() => selectMode('solutions')} className={`w-full rounded-md px-3 py-2 text-left text-xs hover:bg-white/5 ${isSolutions ? 'text-dyson-gold-light' : 'text-dyson-taupe hover:text-dyson-text'}`}>Real Estate Solutions</button>
          <button type="button" onClick={() => selectMode('news')} className={`w-full rounded-md px-3 py-2 text-left text-xs hover:bg-white/5 ${!workspace.entryOpen && workspace.mode === 'news' ? 'text-dyson-gold-light' : 'text-dyson-taupe hover:text-dyson-text'}`}>Real Estate News</button>
        </nav>
        <ChiefPilotModeRail activeMode={workspace.mode} onSelect={selectMode} preferredClientActive={workspace.preferredClientActive} heading="Administration" />
        <section>
          <p className="mb-2 text-[11px] text-dyson-taupe">Subjects to Explore</p>
          <div className="space-y-1">
            <ChiefPilotSubjectList subjects={workspace.subjects} activeId={activeSubjectId} onSelect={selectSubject} />
          </div>
        </section>
        <ChiefPilotHistory items={workspace.historyItems} onOpen={workspace.openActivity} />
        {!workspace.entryOpen && <ChiefPilotChatComposer disabled={!workspace.activeSubject || !workspace.preferredClientActive} loading={workspace.loading} onSend={workspace.send} />}
        <div className="shrink-0 border-t border-white/10 pt-3 text-center text-[15px] leading-relaxed text-dyson-taupe">
          <p>The Dyson &amp; Dyson Companies, Inc.</p>
          <p>(858) 353 1200</p>
          <p>Ca.DRE# 02303118</p>
        </div>
      </div>
    </aside>
  );
}