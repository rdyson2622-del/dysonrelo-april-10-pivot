import React, { useState } from 'react';
import ChiefPilotModeRail from './ChiefPilotModeRail';
import ChiefPilotSubjectList from './ChiefPilotSubjectList';
import ChiefPilotHistory from './ChiefPilotHistory';
import ChiefPilotChatComposer from './ChiefPilotChatComposer';
import CopilotWordmark from '@/components/brand/CopilotWordmark';

export default function ChiefPilotSidebar({ workspace }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isSolutions = !workspace.entryOpen && workspace.mode === 'solutions';
  const activeSubjectId = !workspace.entryOpen && workspace.mode === 'chats' ? workspace.activeId : '';
  return (
    <aside className="flex min-h-0 flex-col gap-4 rounded-lg border border-white/10 bg-dyson-ink p-5">
      <div className="flex items-center justify-between gap-2">
        <button type="button" onClick={workspace.openEntry} title="Back to CoPilot home" className="flex items-center gap-2 rounded-md px-1 -mx-1 py-1 transition-colors hover:bg-white/5">
          <span className="text-[10px] tracking-[0.18em] text-dyson-text">DYSON HOMES</span><CopilotWordmark bold className="h-7 w-16" />
        </button>
        <button type="button" onClick={() => setMobileOpen(value => !value)} className="text-xs text-dyson-taupe md:hidden">{mobileOpen ? 'Close' : 'Menu'}</button>
      </div>
      <div className={`${mobileOpen ? 'flex' : 'hidden'} min-h-0 flex-1 flex-col gap-4 overflow-y-auto md:flex`}>
        <ChiefPilotModeRail activeMode={workspace.mode} onSelect={workspace.selectMode} preferredClientActive={workspace.preferredClientActive} />
        <section>
          <p className="mb-2 text-[11px] text-dyson-taupe">Subjects</p>
          <div className="space-y-1">
            <button type="button" onClick={() => workspace.selectMode('solutions')} className={`block w-full border-l px-3 py-2 text-left text-sm ${isSolutions ? 'border-dyson-gold text-dyson-text' : 'border-transparent text-dyson-taupe hover:text-dyson-text'}`}>Real Estate Solutions</button>
            <ChiefPilotSubjectList subjects={workspace.subjects} activeId={activeSubjectId} onSelect={workspace.selectSubject} />
          </div>
        </section>
        <ChiefPilotHistory items={workspace.historyItems} onOpen={workspace.openActivity} />
        {!workspace.entryOpen && <ChiefPilotChatComposer disabled={!workspace.activeSubject || !workspace.preferredClientActive} loading={workspace.loading} onSend={workspace.send} />}
      </div>
    </aside>
  );
}