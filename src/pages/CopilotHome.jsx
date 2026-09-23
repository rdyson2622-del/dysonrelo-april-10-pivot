import React from 'react';
import ChiefPilotDossier from '@/components/admin/chiefPilot/ChiefPilotDossier';
import ChiefPilotOpeningDoor from '@/components/admin/chiefPilot/ChiefPilotOpeningDoor';
import ChiefPilotSidebar from '@/components/admin/chiefPilot/ChiefPilotSidebar';
import useChiefPilotWorkspace from '@/components/admin/chiefPilot/useChiefPilotWorkspace';
import PreferredClientFloatingPill from '@/components/portal/PreferredClientFloatingPill';

// Locked consumer entry point — the Chief Pilot IA promoted live.
// Do not redesign this shell; Chief Pilot/Bob will keep tuning content in
// /admin/chief-pilot without changing this structure.
export default function CopilotHome() {
  const workspace = useChiefPilotWorkspace();
  const messages = workspace.activeSubject ? workspace.conversations[workspace.activeSubject.id] || [] : [];

  return (
    <div className="h-screen overflow-hidden bg-dyson-black p-3 sm:p-4">
      <div className="mx-auto flex h-[calc(100vh-32px)] max-w-7xl flex-col gap-3 md:flex-row">
        <div className="w-full shrink-0 md:w-72">
          <ChiefPilotSidebar workspace={workspace} />
        </div>
        <div className="min-h-0 flex-1 overflow-hidden rounded-lg bg-dyson-black">
          <div id="chief-pilot-content" className={`h-full overflow-y-auto rounded-lg border p-4 pb-24 sm:p-7 sm:pb-24 md:p-10 md:pb-24 lg:pb-10 ${workspace.entryOpen ? 'border-black/10 bg-dyson-cream' : (workspace.mode !== 'news' && workspace.mode !== 'library') ? 'border-white/10 bg-dyson-black' : 'border-black/10 bg-dyson-cream'}`}>
            {workspace.entryOpen ? (
              <ChiefPilotOpeningDoor workspace={workspace} />
            ) : (
              <ChiefPilotDossier
                mode={workspace.mode}
                isChatsInbox={workspace.isChatsInbox}
                libraryItems={workspace.libraryItems}
                onDeleteLibraryItem={workspace.deleteLibraryItem}
                onRenameLibraryItem={workspace.renameLibraryItem}
                visitorId={workspace.visitorId}
                subject={workspace.activeSubject}
                activeProperty={workspace.displayProperty}
                hasOwnProperty={Boolean(workspace.activeProperty)}
                isExample={workspace.isExample}
                showExample={workspace.showExample}
                exampleLoading={workspace.exampleLoading}
                onHideExample={workspace.hideExample}
                escrowStub={workspace.escrowStub}
                searchLoading={workspace.searchLoading}
                searchError={workspace.searchError}
                introStatus={workspace.introStatus}
                saveStatus={workspace.saveStatus}
                preferredClientActive={workspace.preferredClientActive}
                selectedAgentName={workspace.selectedAgentName}
                teamMessages={workspace.teamMessages}
                onPropertySearch={workspace.runPropertySearch}
                onClearProperty={workspace.clearActiveProperty}
                onSelectSubject={workspace.selectSubject}
                onSend={workspace.send}
                onTeamMessage={workspace.sendTeamMessage}
                onRequestIntro={workspace.requestVettedIntro}
                onStartEscrow={workspace.startEscrowWatch}
                onPreferredClaim={workspace.activatePreferredClient}
                onSaveProperty={workspace.saveProperty}
                onOpenEntry={workspace.openEntry}
                messages={messages}
                loading={workspace.loading}
                error={workspace.error}
              />
            )}
          </div>
        </div>
      </div>
      <PreferredClientFloatingPill engaged={!workspace.entryOpen} />
    </div>
  );
}