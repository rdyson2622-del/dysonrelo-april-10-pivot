import React from 'react';
import ChiefPilotSubjectList from './ChiefPilotSubjectList';
import ChiefPilotChatComposer from './ChiefPilotChatComposer';
import ChiefPilotDossier from './ChiefPilotDossier';
import useChiefPilotWorkspace from './useChiefPilotWorkspace';

export default function ChiefPilotPageTwo() {
  const workspace = useChiefPilotWorkspace();
  const messages = workspace.activeId ? workspace.conversations[workspace.activeId] || [] : [];

  return (
    <section className="h-[calc(100vh-220px)] min-h-[680px] overflow-hidden rounded-xl border border-white/10 bg-dyson-ink">
      <div className="grid h-full md:grid-cols-[300px_1fr]">
        <aside className="flex min-h-0 flex-col border-b border-white/10 p-5 md:border-b-0 md:border-r">
          <p className="mb-6 text-xs font-medium tracking-wide text-dyson-taupe">Workspace</p>
          <ChiefPilotSubjectList subjects={workspace.subjects} activeId={workspace.activeId} onSelect={workspace.setActiveId} onRename={workspace.rename} onMove={workspace.move} />
          <ChiefPilotChatComposer disabled={!workspace.activeSubject} loading={workspace.loading} onSend={workspace.send} />
        </aside>
        <div className="h-full overflow-y-auto p-7 sm:p-10">
          <ChiefPilotDossier subject={workspace.activeSubject} currentProperty={workspace.currentProperty} onPropertySearch={workspace.setCurrentProperty} onSelectSubject={workspace.setActiveId} onSend={workspace.send} messages={messages} loading={workspace.loading} error={workspace.error} />
        </div>
      </div>
    </section>
  );
}