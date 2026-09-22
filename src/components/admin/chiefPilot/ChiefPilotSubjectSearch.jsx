import React from 'react';
import ChiefPilotExplainers from './ChiefPilotExplainers';

export default function ChiefPilotSubjectSearch({ subject, activeProperty, isExample, onOpenEntry, onSend, messages, loading, error }) {
  return <ChiefPilotExplainers subject={subject} onBack={onOpenEntry} isLiveObjective={Boolean(activeProperty) && !isExample} onSend={onSend} messages={messages} loading={loading} error={error} />;
}