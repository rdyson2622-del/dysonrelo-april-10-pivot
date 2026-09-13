import React from 'react';
import GrokPageThreeSplitCanvas from './GrokPageThreeSplitCanvas';

export default function CopilotChatDossierCanvas({ property, onPropertyChange }) {
  return (
    <div className="w-full">
      <GrokPageThreeSplitCanvas property={property} onBackToSearch={onPropertyChange} />
    </div>
  );
}