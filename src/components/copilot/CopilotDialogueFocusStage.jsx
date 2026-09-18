import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function CopilotDialogueFocusStage({ focus }) {
  const isBob = focus?.speaker === 'bob';
  return (
    <div className="w-[92%] max-w-[760px] min-w-[315px] mx-auto rounded-2xl border border-dyson-gold/60 bg-dyson-charcoal p-4 shadow-2xl" style={{ aspectRatio: '800/243' }}>
      <div className="flex items-center gap-2 border-b border-dyson-taupe/20 pb-2 text-dyson-gold">
        <MessageSquare className="h-4 w-4" />
        <span className="text-xs font-medium">Live client question</span>
      </div>
      <div className="flex h-[calc(100%-32px)] flex-col justify-center gap-3 py-3">
        <p className="text-sm text-dyson-taupe">“{focus?.question}”</p>
        <p className="line-clamp-3 text-sm leading-relaxed text-dyson-text">
          {focus?.response || `${isBob ? 'Bob' : 'Charlie'} is preparing the response…`}
        </p>
      </div>
    </div>
  );
}