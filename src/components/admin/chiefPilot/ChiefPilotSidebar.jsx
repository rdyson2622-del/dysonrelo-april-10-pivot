import React from 'react';
import ChiefPilotModeRail from './ChiefPilotModeRail';
import ChiefPilotSubjectList from './ChiefPilotSubjectList';
import ChiefPilotHistory from './ChiefPilotHistory';
import ChiefPilotChatComposer from './ChiefPilotChatComposer';
import CopilotWordmark from '@/components/brand/CopilotWordmark';

export default function ChiefPilotSidebar({ workspace }) {
  return (
    <aside className="flex min-h-0 flex-col gap-4 border-b border-white/10 bg-dyson-ink p-5 md:border-b-0 md:border-r">
      <div className="flex items-center gap-2"><span className="text-[10px] tracking-[0.18em] text-dyson-text">DYSON HOMES</span><CopilotWordmark className="h-7 w-16 brightness-125 saturate-125" /></div>
      <ChiefPilotModeRail activeMode={workspace.mode} onSelect={workspace.selectMode} preferredClientActive={workspace.preferredClientActive} />
      {workspace.mode === 'chats' && <section><p className="mb-2 text-[11px] text-dyson-taupe">Subjects</p><ChiefPilotSubjectList subjects={workspace.subjects} activeId={workspace.activeId} onSelect={workspace.selectSubject} onRename={workspace.rename} onMove={workspace.move} /></section>}
      <ChiefPilotHistory items={workspace.historyItems} onOpen={workspace.openActivity} />
      <ChiefPilotChatComposer disabled={!workspace.activeSubject || !workspace.preferredClientActive} loading={workspace.loading} onSend={workspace.send} />
    </aside>
  );
}