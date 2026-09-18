import React from 'react';
import ChiefPilotSidebar from './ChiefPilotSidebar';
import ChiefPilotDossier from './ChiefPilotDossier';
import useChiefPilotWorkspace from './useChiefPilotWorkspace';

export default function ChiefPilotPageTwo() {
  const workspace = useChiefPilotWorkspace();
  const messages = workspace.activeSubject ? workspace.conversations[workspace.activeSubject.id] || [] : [];

  return (
    <section className="h-[calc(100vh-220px)] min-h-[680px] overflow-hidden rounded-xl border border-white/10 bg-dyson-ink">
      <div className="grid h-full md:grid-cols-[300px_1fr]">
        <ChiefPilotSidebar workspace={workspace} />
        <div className="h-full overflow-y-auto p-7 sm:p-10">
          <ChiefPilotDossier mode={workspace.mode} libraryItems={workspace.libraryItems} subject={workspace.activeSubject} activeProperty={workspace.activeProperty} escrowStub={workspace.escrowStub} searchLoading={workspace.searchLoading} searchError={workspace.searchError} introStatus={workspace.introStatus} onPropertySearch={workspace.runPropertySearch} onClearProperty={workspace.clearActiveProperty} onSelectSubject={workspace.selectSubject} onSend={workspace.send} onRequestIntro={workspace.requestVettedIntro} onStartEscrow={workspace.startEscrowWatch} messages={messages} loading={workspace.loading} error={workspace.error} />
        </div>
      </div>
    </section>
  );
}