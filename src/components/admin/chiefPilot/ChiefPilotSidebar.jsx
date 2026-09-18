import React, { useState } from 'react';
import ChiefPilotModeRail from './ChiefPilotModeRail';
import ChiefPilotSubjectList from './ChiefPilotSubjectList';
import ChiefPilotHistory from './ChiefPilotHistory';
import ChiefPilotChatComposer from './ChiefPilotChatComposer';
import CopilotWordmark from '@/components/brand/CopilotWordmark';

export default function ChiefPilotSidebar({ workspace }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <aside className="flex min-h-0 flex-col gap-4 rounded-lg border border-white/10 bg-dyson-ink p-5">
      <div className="flex items-center justify-between gap-2"><button type="button" onClick={workspace.openEntry} className="flex items-center gap-2"><span className="text-[10px] tracking-[0.18em] text-dyson-text">DYSON HOMES</span><CopilotWordmark bold className="h-7 w-16" /></button><button type="button" onClick={() => setMobileOpen(value => !value)} className="text-xs text-dyson-taupe md:hidden">{mobileOpen ? 'Close' : 'Menu'}</button></div>
      <div className={`${mobileOpen ? 'flex' : 'hidden'} min-h-0 flex-1 flex-col gap-4 md:flex`}>
        <ChiefPilotModeRail activeMode={workspace.mode} onSelect={workspace.selectMode} preferredClientActive={workspace.preferredClientActive} />
        {workspace.mode === 'chats' && <section><p className="mb-2 text-[11px] text-dyson-taupe">Subjects</p><ChiefPilotSubjectList subjects={workspace.subjects} activeId={workspace.activeId} onSelect={workspace.selectSubject} /></section>}
        <ChiefPilotHistory items={workspace.historyItems} onOpen={workspace.openActivity} />
        {!workspace.entryOpen && <ChiefPilotChatComposer disabled={!workspace.activeSubject || !workspace.preferredClientActive} loading={workspace.loading} onSend={workspace.send} />}
      </div>
    </aside>
  );
}