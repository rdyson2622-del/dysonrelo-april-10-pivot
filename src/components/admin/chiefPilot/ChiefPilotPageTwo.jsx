import React from 'react';
import ChiefPilotSidebar from './ChiefPilotSidebar';
import ChiefPilotDossier from './ChiefPilotDossier';
import ChiefPilotOpeningDoor from './ChiefPilotOpeningDoor';
import useChiefPilotWorkspace from './useChiefPilotWorkspace';

export default function ChiefPilotPageTwo() {
  const workspace = useChiefPilotWorkspace();
  const messages = workspace.activeSubject ? workspace.conversations[workspace.activeSubject.id] || [] : [];

  return (
    <section className="h-[calc(100vh-220px)] min-h-[680px] overflow-hidden rounded-xl bg-dyson-black p-3">
      <div className="grid h-full gap-3 overflow-hidden rounded-lg bg-dyson-black p-3 md:grid-cols-[240px_1fr]">
        <ChiefPilotSidebar workspace={workspace} />
        <div id="chief-pilot-content" className={`h-full overflow-y-auto rounded-lg border p-7 sm:p-10 ${workspace.entryOpen ? 'border-white/10 bg-dyson-black' : 'border-black/10 bg-dyson-cream'}`}>
          {workspace.entryOpen ? <ChiefPilotOpeningDoor workspace={workspace} /> : <ChiefPilotDossier mode={workspace.mode} libraryItems={workspace.libraryItems} subject={workspace.activeSubject} activeProperty={workspace.displayProperty} hasOwnProperty={Boolean(workspace.activeProperty)} isExample={workspace.isExample} showExample={workspace.showExample} exampleLoading={workspace.exampleLoading} onHideExample={workspace.hideExample} escrowStub={workspace.escrowStub} searchLoading={workspace.searchLoading} searchError={workspace.searchError} introStatus={workspace.introStatus} saveStatus={workspace.saveStatus} preferredClientActive={workspace.preferredClientActive} selectedAgentName={workspace.selectedAgentName} teamMessages={workspace.teamMessages} onPropertySearch={workspace.runPropertySearch} onClearProperty={workspace.clearActiveProperty} onSelectSubject={workspace.selectSubject} onSend={workspace.send} onTeamMessage={workspace.sendTeamMessage} onRequestIntro={workspace.requestVettedIntro} onStartEscrow={workspace.startEscrowWatch} onPreferredClaim={workspace.activatePreferredClient} onSaveProperty={workspace.saveProperty} messages={messages} loading={workspace.loading} error={workspace.error} />}
        </div>
      </div>
    </section>
  );
}