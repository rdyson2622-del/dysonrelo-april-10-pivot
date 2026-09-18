import React from 'react';
import ChiefPilotDnnNews from './ChiefPilotDnnNews';
import ChiefPilotLibrary from './ChiefPilotLibrary';
import ChiefPilotSubjectSearch from './ChiefPilotSubjectSearch';
import ChiefPilotClientChats from './ChiefPilotClientChats';
import ChiefPilotSampleExplainer from './ChiefPilotSampleExplainer';

export default function ChiefPilotDossier({ mode, isChatsInbox, libraryItems, subject, activeProperty, isExample, showExample, onHideExample, selectedAgentName, onOpenEntry, onSend, messages, loading, error }) {
  if (mode === 'chats' && activeProperty?.level3Example) return <ChiefPilotSampleExplainer property={activeProperty} onBack={onOpenEntry} />;
  if (mode === 'library') {
    return <div className="w-full max-w-3xl text-dyson-text-dark"><ChiefPilotLibrary items={libraryItems} isExample={showExample} onHideExample={onHideExample} onSearchOwn={onOpenEntry} /></div>;
  }
  if (mode === 'news') {
    return <div className="w-full max-w-3xl text-dyson-text-dark"><ChiefPilotDnnNews title={subject.title} activeProperty={activeProperty} isExample={isExample} onHideExample={onHideExample} onSearchOwn={onOpenEntry} onSend={onSend} /></div>;
  }
  if (isChatsInbox) return <ChiefPilotClientChats />;
  return <ChiefPilotSubjectSearch subject={subject} activeProperty={activeProperty} selectedAgentName={selectedAgentName} onOpenEntry={onOpenEntry} onSend={onSend} messages={messages} loading={loading} error={error} />;
}