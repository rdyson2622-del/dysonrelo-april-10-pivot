import React from 'react';
import ChiefPilotDnnNewsPlayer from './ChiefPilotDnnNewsPlayer';
import ChiefPilotLibrary from './ChiefPilotLibrary';
import ChiefPilotSubjectSearch from './ChiefPilotSubjectSearch';
import ChiefPilotClientChats from './ChiefPilotClientChats';
import ChiefPilotSampleExplainer from './ChiefPilotSampleExplainer';

export default function ChiefPilotDossier({ mode, isChatsInbox, libraryItems, onDeleteLibraryItem, onRenameLibraryItem, visitorId, subject, activeProperty, isExample, showExample, onHideExample, selectedAgentName, onOpenEntry, onSend, messages = [], loading = false, error = '' }) {
  if (mode === 'library') {
    return <div className="w-full max-w-3xl text-dyson-text-dark"><ChiefPilotLibrary items={libraryItems} onDeleteItem={onDeleteLibraryItem} onRenameItem={onRenameLibraryItem} visitorId={visitorId} isExample={showExample} onHideExample={onHideExample} onSearchOwn={onOpenEntry} /></div>;
  }
  if (mode === 'news') {
    return <div className="mx-auto w-full max-w-3xl text-dyson-text-dark"><ChiefPilotDnnNewsPlayer title={subject.title} onSend={onSend} messages={messages} loading={loading} error={error} /></div>;
  }
  if (isChatsInbox) return <ChiefPilotClientChats />;
  if (mode === 'chats' && activeProperty?.level3Example) return <ChiefPilotSampleExplainer property={activeProperty} onBack={onOpenEntry} />;
  return <ChiefPilotSubjectSearch subject={subject} activeProperty={activeProperty} isExample={isExample} selectedAgentName={selectedAgentName} onOpenEntry={onOpenEntry} onSend={onSend} messages={messages} loading={loading} error={error} />;
}