import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function CopilotLegalDisclosuresModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl max-h-[90vh] bg-[#fbf9f5] text-[#1a1a1a] rounded-2xl shadow-2xl border border-stone-300 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-disclosures-title"
      >
        {/* Light Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white">
          <h2 id="legal-disclosures-title" className="text-base sm:text-lg font-semibold text-stone-900 tracking-tight font-sans">
            Legal &amp; disclosures
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 stroke-[2]" />
          </button>
        </div>

        {/* Modal Body: Exact verbatim text */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-4 text-xs sm:text-[13.5px] leading-relaxed text-stone-700 font-sans">
          <p>
            {"Dyson Homes CoPilot is an information and referral service from Dyson & Dyson Companies / Dyson Relocation. It is not a substitute for advice from your own licensed real estate broker, attorney, tax advisor, or lender."}
          </p>

          <p>
            {"Property data and estimates are for general information only. They may be incomplete or out of date and are not an appraisal, CMA, or guarantee of value, condition, or marketability."}
          </p>

          <p>
            {"Any closing-cost credit, rebate, or similar consumer benefit is available only where allowed by law, may not be available in every state, and is never guaranteed. Amounts (if any) depend on the specific transaction, local rules, and written agreements. We do not quote a percentage or dollar amount until eligibility is confirmed for your situation."}
          </p>

          <p>
            {"We are not acting as your listing agent or as a dual agent for buyer and seller on the same transaction through this tool. Referral relationships and compensation are disclosed as required."}
          </p>

          <p>
            {"By using this site or requesting a report, you agree we may contact you about the property or service you asked about. You can unsubscribe or ask us to stop contacting you at any time."}
          </p>

          <p>
            {"Licensed real estate activity is conducted only by appropriately licensed brokers and agents. California DRE details and other state licensing will be stated where required."}
          </p>

          <p className="pt-2 text-stone-500 text-xs border-t border-stone-200">
            {"© Dyson & Dyson Companies. All rights reserved."}
          </p>
        </div>

        {/* Light Modal Footer */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition-colors cursor-pointer shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}