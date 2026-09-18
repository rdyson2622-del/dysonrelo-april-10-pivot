import React from 'react';
import ChiefPilotPropertySearch from './ChiefPilotPropertySearch';
import ChiefPilotPropertyAudit from './ChiefPilotPropertyAudit';
import ChiefPilotAgentVetting from './ChiefPilotAgentVetting';
import ChiefPilotRelocationRoadmaps from './ChiefPilotRelocationRoadmaps';
import ChiefPilotEscrowWatch from './ChiefPilotEscrowWatch';
import ChiefPilotDnnNews from './ChiefPilotDnnNews';
import ChiefPilotConversation from './ChiefPilotConversation';
import ChiefPilotLibrary from './ChiefPilotLibrary';

export default function ChiefPilotDossier({ mode, libraryItems, subject, activeProperty, hasOwnProperty, isExample, showExample, exampleLoading, onHideExample, escrowStub, searchLoading, searchError, introStatus, saveStatus, preferredClientActive, onPropertySearch, onClearProperty, onSelectSubject, onSend, onRequestIntro, onStartEscrow, onPreferredClaim, onSaveProperty, messages, loading, error }) {
  const shared = { title: subject.title, activeProperty, hasOwnProperty, isExample, exampleLoading, onHideExample, escrowStub, onSelectSubject, onSelectSearch: () => onSelectSubject('property-search'), onSearchOwn: () => onSelectSubject('property-search'), onSend };
  const panels = {
    'property-search': <ChiefPilotPropertySearch {...shared} searchLoading={searchLoading} searchError={searchError} onSearch={onPropertySearch} onClear={onClearProperty} preferredClientActive={preferredClientActive} onPreferredClaim={onPreferredClaim} onSaveProperty={onSaveProperty} saveStatus={saveStatus} />,
    'property-audit': <ChiefPilotPropertyAudit {...shared} />,
    'agent-vetting': <ChiefPilotAgentVetting {...shared} introStatus={introStatus} onRequestIntro={onRequestIntro} />,
    'move-roadmap': <ChiefPilotRelocationRoadmaps {...shared} />,
    'escrow-watch': <ChiefPilotEscrowWatch {...shared} onStartEscrow={onStartEscrow} />,
    'dnn-news': <ChiefPilotDnnNews {...shared} />
  };
  return (
    <div className="w-full max-w-3xl">
      {mode === 'library' ? <ChiefPilotLibrary items={libraryItems} {...shared} isExample={showExample} /> : panels[subject.id] || <h2 className="text-2xl font-normal text-dyson-text">{subject.title}</h2>}
      <ChiefPilotConversation messages={messages} loading={loading} error={error} />
    </div>
  );
}