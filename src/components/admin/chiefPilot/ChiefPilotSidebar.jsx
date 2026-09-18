import React from 'react';
import ChiefPilotModeRail from './ChiefPilotModeRail';
import ChiefPilotSubjectList from './ChiefPilotSubjectList';
import ChiefPilotHistory from './ChiefPilotHistory';
import ChiefPilotChatComposer from './ChiefPilotChatComposer';
import CopilotWordmark from '@/components/brand/CopilotWordmark';

export default function ChiefPilotSidebar({ workspace }) {
  return (
    <aside className="flex min-h-0 flex-col gap-4 rounded-lg border border-white/10 bg-dyson-ink p-5">
      <div className="flex items-center gap-2"><span className="text-[10px] tracking-[0.18em] text-dyson-text">DYSON HOMES</span><CopilotWordmark bold className="h-7 w-16" /></div>
      <button type="button" onClick={workspace.openEntry} className={`w-full rounded-md border px-3 py-2 text-left text-xs ${workspace.entryOpen ? 'border-dyson-gold bg-dyson-gold/10 text-dyson-gold-light' : 'border-white/10 text-dyson-taupe hover:bg-white/5 hover:text-white'}`}>AI Search</button>
      <ChiefPilotModeRail activeMode={workspace.mode} onSelect={workspace.selectMode} preferredClientActive={workspace.preferredClientActive} />
      {workspace.mode === 'chats' && <section><p className="mb-2 text-[11px] text-dyson-taupe">Subjects</p><ChiefPilotSubjectList subjects={workspace.subjects} activeId={workspace.activeId} onSelect={workspace.selectSubject} onRename={workspace.rename} onMove={workspace.move} /></section>}
      <ChiefPilotHistory items={workspace.historyItems} onOpen={workspace.openActivity} />
      <ChiefPilotChatComposer disabled={!workspace.activeSubject || !workspace.preferredClientActive} loading={workspace.loading} onSend={workspace.send} />
    </aside>
  );
}