import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';

export default function CopilotFooterBranding({
  savedCount = 0,
  onOpenSavedDiscussions,
  discussionChips = [],
  onSelectChip,
  isAuthenticated,
  userName,
  onSignOut,
  onOpenReferModal,
  onOpenLegalModal
}) {
  return (
    <div className="px-3 sm:px-4 py-2.5 bg-[#0a0a0a] border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 select-none">
      {/* Discussion History & Saved Discussions Stack (Lower Left Stacked, <= 40% Screen Width) */}
      <div className="w-full sm:max-w-[40%] flex flex-wrap items-center gap-1.5">
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
            className="px-2.5 py-1 rounded-md text-[10px] bg-[#141414] hover:bg-white/10 text-stone-400 hover:text-white active:bg-white active:text-black border border-white/15 transition-all cursor-pointer shrink-0"
            title={chip.query}
          >
            <span>{chip.label}</span>
          </button>
        ))}
      </div>

      {/* Footer Branding: stacked vertically on the far right */}
      <div className="flex flex-col items-end text-right font-normal text-white shrink-0 self-end sm:self-center ml-auto">
        <span className="text-[12px] sm:text-[12.5px] font-normal text-white tracking-normal whitespace-nowrap">
          The Dyson &amp; Dyson Companies, Inc. Ca. DRE#02303118
        </span>
        <div className="text-[11.5px] sm:text-[12px] font-normal text-white flex items-center gap-2 whitespace-nowrap mt-0.5">
          <a href="tel:8583531200" className="text-white hover:underline transition-colors font-normal">
            (858) 353 1200
          </a>
          <span className="text-white">·</span>
          <a href="mailto:bob@dysonrelo.com" className="text-white hover:underline transition-colors font-normal">
            bob@dysonrelo.com
          </a>
          <span className="text-white">·</span>
          {isAuthenticated ? (
            <>
              <span className="text-stone-300">
                Welcome back{userName ? `, ${userName.split(' ')[0]}` : ''}
              </span>
              <span className="text-white">·</span>
              <button
                type="button"
                onClick={onSignOut}
                className="text-stone-400 hover:text-white transition-colors underline underline-offset-4 decoration-stone-600 hover:decoration-stone-300 cursor-pointer font-normal text-[11.5px] sm:text-[12px]"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/login?returnTo=%2Fdossier"
              className="text-stone-400 hover:text-white transition-colors underline underline-offset-4 decoration-stone-600 hover:decoration-stone-300 cursor-pointer font-normal text-[11.5px] sm:text-[12px]"
            >
              Sign in
            </Link>
          )}
          <span className="text-white">·</span>
          <button
            type="button"
            onClick={onOpenReferModal}
            className="text-stone-400 hover:text-white transition-colors underline underline-offset-4 decoration-stone-600 hover:decoration-stone-300 cursor-pointer font-normal text-[11.5px] sm:text-[12px]"
          >
            Refer a Friend
          </button>
          <span className="text-white">·</span>
          <button
            type="button"
            onClick={onOpenLegalModal}
            className="text-stone-400 hover:text-white transition-colors underline underline-offset-4 decoration-stone-600 hover:decoration-stone-300 cursor-pointer font-normal text-[11.5px] sm:text-[12px]"
          >
            Legal &amp; disclosures
          </button>
          <span className="text-white">·</span>
          <Link
            to="/copilot/stop-contact"
            className="text-stone-400 hover:text-white transition-colors underline underline-offset-4 decoration-stone-600 hover:decoration-stone-300 cursor-pointer font-normal text-[11.5px] sm:text-[12px]"
          >
            Stop contacting me
          </Link>
          <span className="text-white">·</span>
          <Link
            to="/unsubscribe"
            className="text-stone-400 hover:text-white transition-colors underline underline-offset-4 decoration-stone-600 hover:decoration-stone-300 cursor-pointer font-normal text-[11.5px] sm:text-[12px]"
          >
            Unsubscribe
          </Link>
        </div>
      </div>
    </div>
  );
}