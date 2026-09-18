import React from 'react';

export default function CopilotDialogueFocusDetails({ focus }) {
  const speakerName = focus?.speaker === 'bob' ? 'Bob Dyson' : 'Charlie Simmons';
  return (
    <div className="rounded-xl border border-dyson-gold/40 bg-dyson-charcoal p-4 text-left">
      <span className="text-[10px] font-medium text-dyson-gold">CURRENT DIALOGUE</span>
      <h3 className="mt-1 text-sm font-normal text-dyson-text">{focus?.question}</h3>
      <div className="mt-3 border-t border-dyson-taupe/20 pt-3">
        <span className="text-[10px] text-dyson-taupe">{speakerName}</span>
        <p className="mt-1 whitespace-pre-line text-xs font-normal leading-relaxed text-dyson-text">
          {focus?.response || `${speakerName} is preparing the response…`}
        </p>
      </div>
    </div>
  );
}