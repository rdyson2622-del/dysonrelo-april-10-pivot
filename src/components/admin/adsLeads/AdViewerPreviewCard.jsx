import React from 'react';
import { ExternalLink } from 'lucide-react';

// Explains + mocks up what a viewer actually sees when the campaign serves —
// the real live preview (with Google's actual asset combinations for
// Search/Gmail/YouTube/Display) lives in the app dashboard's Marketing →
// Google Ads flow, next to the campaign's assets. This card is the "what is
// this, in plain terms" companion to that, right where the numbers live.
export default function AdViewerPreviewCard() {
  return (
    <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#111111] p-5 text-white">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-[#D4AF37]">What the Viewer Sees</h2>
      </div>

      <p className="text-xs text-white/60 mb-4">
        Sample of the Search ad this campaign serves. Google decides which headline/description combo and placement (Search, Gmail, YouTube, Display) shows to any given viewer — this is a representative mock-up, not a live pull.
      </p>

      {/* Mock Google Search result */}
      <div className="rounded-lg bg-white text-black p-4 max-w-lg">
        <div className="flex items-center gap-2 text-[11px] text-[#1a0dab] mb-1">
          <span className="border border-black/30 rounded-sm px-1 text-black/70 font-semibold text-[10px]">Ad</span>
          <span className="text-black/70">dysonhomes.com</span>
        </div>
        <p className="text-[18px] text-[#1a0dab] leading-tight">Dyson Homes CoPilot — Stress-less Relocation</p>
        <p className="text-[13px] text-black/70 mt-1">
          Your independent fiduciary oversight for the entire move. We vet the agent, manage the milestones, no direct cost to you. Start your Relocation Roadmap today.
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-white/10 text-xs text-white/60">
        For the real preview across Search, Gmail, YouTube &amp; Display with this campaign's actual assets, open{' '}
        <a href="https://ads.google.com" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] inline-flex items-center gap-1 hover:underline">
          Marketing → Google Ads <ExternalLink className="w-3 h-3" />
        </a>{' '}
        in the app dashboard and select this campaign.
      </div>
    </div>
  );
}