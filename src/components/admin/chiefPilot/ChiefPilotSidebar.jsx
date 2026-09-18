import React from 'react';
import ChiefPilotModeRail from './ChiefPilotModeRail';
import ChiefPilotSubjectList from './ChiefPilotSubjectList';
import ChiefPilotHistory from './ChiefPilotHistory';
import ChiefPilotChatComposer from './ChiefPilotChatComposer';

export default function ChiefPilotSidebar({ workspace }) {
  return (
    <aside className="flex min-h-0 flex-col gap-4 border-b border-white/10 p-5 md:border-b-0 md:border-r">
      <div className="flex items-baseline gap-2"><span className="font-serif text-lg italic text-dyson-gold">CoPilot</span><span className="text-[9px] tracking-[0.2em] text-dyson-taupe">DYSON</span></div>
      <ChiefPilotModeRail activeMode={workspace.mode} onSelect={workspace.selectMode} />
      {workspace.mode === 'chats' && <section><p className="mb-2 text-[11px] text-dyson-taupe">Subjects</p><ChiefPilotSubjectList subjects={workspace.subjects} activeId={workspace.activeId} onSelect={workspace.selectSubject} onRename={workspace.rename} onMove={workspace.move} /></section>}
      <ChiefPilotHistory items={workspace.historyItems} onOpen={workspace.openActivity} />
      <ChiefPilotChatComposer disabled={!workspace.activeSubject} loading={workspace.loading} onSend={workspace.send} />
    </aside>
  );
}