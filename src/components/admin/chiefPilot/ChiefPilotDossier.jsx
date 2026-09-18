import React from 'react';
import ChiefPilotDnnNewsPlayer from './ChiefPilotDnnNewsPlayer';
import ChiefPilotLibrary from './ChiefPilotLibrary';
import ChiefPilotSubjectSearch from './ChiefPilotSubjectSearch';
import ChiefPilotClientChats from './ChiefPilotClientChats';
import ChiefPilotSampleExplainer from './ChiefPilotSampleExplainer';
import ChiefPilotPropertySearch from './ChiefPilotPropertySearch';
import ChiefPilotPropertyAudit from './ChiefPilotPropertyAudit';
import ChiefPilotAgentVetting from './ChiefPilotAgentVetting';
import ChiefPilotTeamThread from './ChiefPilotTeamThread';
import ChiefPilotEscrowWatch from './ChiefPilotEscrowWatch';
import ChiefPilotRelocationRoadmaps from './ChiefPilotRelocationRoadmaps';

export default function ChiefPilotDossier({
  mode, isChatsInbox, libraryItems, subject, activeProperty, isExample, showExample, exampleLoading, onHideExample,
  escrowStub, selectedAgentName, teamMessages, searchLoading, searchError, introStatus, saveStatus, preferredClientActive,
  onPropertySearch, onClearProperty, onSelectSubject, onTeamMessage, onRequestIntro, onStartEscrow, onPreferredClaim, onSaveProperty,
  onOpenEntry, onSend, messages = [], loading = false, error = ''
}) {
  if (mode === 'library') {
    return <div className="w-full max-w-3xl text-dyson-text-dark"><ChiefPilotLibrary items={libraryItems} isExample={showExample} onHideExample={onHideExample} onSearchOwn={onOpenEntry} /></div>;
  }
  if (mode === 'news') {
    return <div className="mx-auto w-full max-w-3xl text-dyson-text-dark"><ChiefPilotDnnNewsPlayer title={subject.title} /></div>;
  }
  if (isChatsInbox) return <ChiefPilotClientChats />;
  if (mode === 'chats' && activeProperty?.level3Example) return <ChiefPilotSampleExplainer property={activeProperty} onBack={onOpenEntry} />;

  const openListing = () => onSelectSubject?.('property-search');

  if (mode === 'chats') {
    switch (subject.id) {
      case 'property-search':
        return <ChiefPilotPropertySearch title={subject.title} activeProperty={activeProperty} isExample={isExample} onHideExample={onHideExample} searchLoading={searchLoading} searchError={searchError} onSearch={onPropertySearch} onClear={onClearProperty} onSelectSubject={onSelectSubject} onSend={onSend} preferredClientActive={preferredClientActive} onPreferredClaim={onPreferredClaim} onSaveProperty={onSaveProperty} saveStatus={saveStatus} selectedAgentName={selectedAgentName} />;
      case 'property-audit':
        return <ChiefPilotPropertyAudit title={subject.title} activeProperty={activeProperty} isExample={isExample} selectedAgentName={selectedAgentName} onOpenListing={openListing} onSend={onSend} onSaveProperty={onSaveProperty} saveStatus={saveStatus} />;
      case 'agent-vetting':
        return <ChiefPilotAgentVetting title={subject.title} activeProperty={activeProperty} isExample={isExample} selectedAgentName={selectedAgentName} onOpenListing={openListing} introStatus={introStatus} onRequestIntro={onRequestIntro} />;
      case 'team-thread':
        return <ChiefPilotTeamThread title={subject.title} activeProperty={activeProperty} isExample={isExample} agentName={selectedAgentName} escrowStub={escrowStub} messages={teamMessages} preferredClientActive={preferredClientActive} onSendMessage={onTeamMessage} onOpenListing={openListing} />;
      case 'move-roadmap':
        return <ChiefPilotRelocationRoadmaps title={subject.title} activeProperty={activeProperty} escrowStub={escrowStub} isExample={isExample} selectedAgentName={selectedAgentName} onOpenListing={openListing} />;
      case 'escrow-watch':
        return <ChiefPilotEscrowWatch title={subject.title} activeProperty={activeProperty} escrowStub={escrowStub} isExample={isExample} selectedAgentName={selectedAgentName} onOpenListing={openListing} onStartEscrow={onStartEscrow} />;
      default:
        break;
    }
  }

  return <ChiefPilotSubjectSearch subject={subject} activeProperty={activeProperty} isExample={isExample} selectedAgentName={selectedAgentName} onOpenEntry={onOpenEntry} onSend={onSend} messages={messages} loading={loading} error={error} />;
}