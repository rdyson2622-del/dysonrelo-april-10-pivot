import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';

export default function CopilotFooterBranding({
  savedCount = 0,
  onOpenSavedDiscussions,
  discussionChips = [],
  onSelectChip,
  onOpenReferModal,
  onOpenLegalModal
}) {
  return (
    <div className="px-3 sm:px-4 py-2.5 bg-[#0a0a0a] border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 select-none">
      {/* ── LEFT: SAVED DISCUSSIONS & CHIPS STACKED HORIZONTALLY IN CLEAN ROWS ── */}
      <div className="flex-1 min-w-0 flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={onOpenSavedDiscussions}
          className="px-2.5 py-1 rounded-md text-[10px] font-medium bg-[#141414] hover:bg-white/10 text-stone-300 hover:text-white border border-white/15 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm shrink-0"
          title="Open Saved Discussions"
        >
          <Bookmark className="w-3 h-3 text-[#D4AF37]" />
          <span>Saved Discussions</span>
          {savedCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-[#D4AF37] text-black text-[9px] font-bold">
              {savedCount}
            </span>
          )}
        </button>

        {discussionChips.map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={() => onSelectChip?.(chip)}
            className="px-2.5 py-1 rounded-md text-[10px] bg-[#141414] hover:bg-white/10 text-stone-300 hover:text-white active:bg-white active:text-black border border-white/15 transition-all cursor-pointer shrink-0"
            title={chip.query}
          >
            <span>{chip.label}</span>
          </button>
        ))}
      </div>

      {/* ── FAR RIGHT: PROPERLY STACKED IN 3 CLEAN ROWS ── */}
      <div className="flex flex-col items-start md:items-end text-left md:text-right shrink-0 md:ml-auto space-y-0.5 pt-1 md:pt-0">
        {/* Row 1: Corporate Entity & DRE License */}
        <div className="text-[11.5px] sm:text-[12px] font-medium text-white tracking-normal whitespace-nowrap">
          The Dyson &amp; Dyson Companies, Inc. · CA DRE #02303118
        </div>

        {/* Row 2: Direct Broker Telephone & Email */}
        <div className="text-[11px] sm:text-[11.5px] font-normal text-stone-300 flex items-center md:justify-end gap-2 whitespace-nowrap font-mono">
          <a 
            href="tel:8583531200" 
            className="text-stone-300 hover:text-white hover:underline transition-colors"
          >
            (858) 353 1200
          </a>
          <span className="text-stone-600">·</span>
          <a 
            href="mailto:bob@dysonrelo.com" 
            className="text-stone-300 hover:text-white hover:underline transition-colors"
          >
            bob@dysonrelo.com
          </a>
        </div>

        {/* Row 3: Client Engagement, Disclosures & Suppression */}
        <div className="text-[10px] sm:text-[10.5px] font-normal text-stone-400 flex flex-wrap items-center md:justify-end gap-2 whitespace-nowrap">
          <button
            type="button"
            onClick={onOpenReferModal}
            className="text-stone-400 hover:text-white transition-colors underline underline-offset-2 decoration-stone-600 hover:decoration-stone-300 cursor-pointer"
          >
            Refer a Friend
          </button>
          <span className="text-stone-600">·</span>
          <button
            type="button"
            onClick={onOpenLegalModal}
            className="text-stone-400 hover:text-white transition-colors underline underline-offset-2 decoration-stone-600 hover:decoration-stone-300 cursor-pointer"
          >
            Legal &amp; disclosures
          </button>
          <span className="text-stone-600">·</span>
          <Link
            to="/copilot/stop-contact"
            className="text-stone-500 hover:text-stone-300 transition-colors underline underline-offset-2 decoration-stone-700 hover:decoration-stone-400 cursor-pointer"
          >
            Stop contacting me
          </Link>
          <span className="text-stone-700">·</span>
          <Link
            to="/unsubscribe"
            className="text-stone-500 hover:text-stone-300 transition-colors underline underline-offset-2 decoration-stone-700 hover:decoration-stone-400 cursor-pointer"
          >
            Unsubscribe
          </Link>
        </div>
      </div>
    </div>
  );
}