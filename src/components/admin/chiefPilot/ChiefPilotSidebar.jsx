import React from 'react';
import ChiefPilotModeRail from './ChiefPilotModeRail';
import ChiefPilotSubjectList from './ChiefPilotSubjectList';
import ChiefPilotHistory from './ChiefPilotHistory';
import ChiefPilotChatComposer from './ChiefPilotChatComposer';
import CopilotSweepLogo from '@/components/brand/CopilotSweepLogo';

export default function ChiefPilotSidebar({ workspace }) {
  return (
    <aside className="flex min-h-0 flex-col gap-4 border-b border-white/10 p-5 md:border-b-0 md:border-r">
      <div className="flex items-center gap-2"><span className="text-[10px] tracking-[0.18em] text-dyson-text">DYSON HOMES</span><CopilotSweepLogo size="xs" /></div>
      <ChiefPilotModeRail activeMode={workspace.mode} onSelect={workspace.selectMode} />
      {workspace.mode === 'chats' && <section><p className="mb-2 text-[11px] text-dyson-taupe">Subjects</p><ChiefPilotSubjectList subjects={workspace.subjects} activeId={workspace.activeId} onSelect={workspace.selectSubject} onRename={workspace.rename} onMove={workspace.move} /></section>}
      <ChiefPilotHistory items={workspace.historyItems} onOpen={workspace.openActivity} />
      <ChiefPilotChatComposer disabled={!workspace.activeSubject} loading={workspace.loading} onSend={workspace.send} />
    </aside>
  );
}