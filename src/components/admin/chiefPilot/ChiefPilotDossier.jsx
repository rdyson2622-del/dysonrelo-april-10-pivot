import React from 'react';
import ChiefPilotPropertySearch from './ChiefPilotPropertySearch';
import ChiefPilotPropertyAudit from './ChiefPilotPropertyAudit';
import ChiefPilotAgentVetting from './ChiefPilotAgentVetting';
import ChiefPilotRelocationRoadmaps from './ChiefPilotRelocationRoadmaps';
import ChiefPilotEscrowWatch from './ChiefPilotEscrowWatch';
import ChiefPilotDnnNews from './ChiefPilotDnnNews';
import ChiefPilotConversation from './ChiefPilotConversation';

export default function ChiefPilotDossier({ subject, currentProperty, onPropertySearch, onSelectSubject, onSend, messages, loading, error }) {
  const shared = { title: subject.title, currentProperty, onSelectSearch: () => onSelectSubject('property-search'), onSend };
  const panels = {
    'property-search': <ChiefPilotPropertySearch {...shared} onSearch={onPropertySearch} />,
    'property-audit': <ChiefPilotPropertyAudit {...shared} />,
    'agent-vetting': <ChiefPilotAgentVetting {...shared} />,
    'move-roadmap': <ChiefPilotRelocationRoadmaps {...shared} />,
    'escrow-watch': <ChiefPilotEscrowWatch {...shared} />,
    'dnn-news': <ChiefPilotDnnNews {...shared} />
  };
  return (
    <div className="w-full max-w-3xl">
      {panels[subject.id] || <h2 className="text-2xl font-normal text-dyson-text">{subject.title}</h2>}
      <ChiefPilotConversation messages={messages} loading={loading} error={error} />
    </div>
  );
}