import React from 'react';
import { Globe } from 'lucide-react';

const GOLD = '#D4AF37';

export default function GoDaddyDomainModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="w-full max-w-lg rounded-2xl p-6 text-white relative shadow-2xl"
        style={{ background: '#0d0d0d', border: `2px solid ${GOLD}` }}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#222]">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#D4AF37]" />
            <h3
              className="font-bold text-lg text-white"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Connecting dysonhomes.com at GoDaddy
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-sm font-bold px-2 py-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 py-4 text-xs text-white/80 leading-relaxed">
          <p>
            To point your GoDaddy-owned domain <strong>dysonhomes.com</strong> directly to this application, add these DNS records in your GoDaddy DNS Management panel:
          </p>

          <div className="p-3.5 rounded-xl bg-[#141414] border border-[#333] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#D4AF37] uppercase text-[10px] tracking-wider">
                Recommended DNS Records
              </span>
              <span className="text-[10px] text-white/50">GoDaddy DNS</span>
            </div>
            
            <div className="font-mono text-[11px] bg-black p-2.5 rounded border border-[#222] space-y-1">
              <div><strong className="text-[#D4AF37]">Type:</strong> A &nbsp;|&nbsp; <strong className="text-[#D4AF37]">Name:</strong> @ &nbsp;|&nbsp; <strong className="text-[#D4AF37]">Value:</strong> 216.24.57.1</div>
              <div><strong className="text-[#D4AF37]">Type:</strong> CNAME &nbsp;|&nbsp; <strong className="text-[#D4AF37]">Name:</strong> www &nbsp;|&nbsp; <strong className="text-[#D4AF37]">Value:</strong> base44.onrender.com</div>
            </div>

            <p className="text-[11px] text-white/60">
              ⚠️ <em>Note:</em> Remove any existing default GoDaddy parked A records or AAAA (IPv6) records for @.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#141414] border border-[#333] space-y-1.5">
            <span className="font-bold text-white text-xs block">
              Step in Base44 Dashboard:
            </span>
            <p className="text-[11px] text-white/70">
              In your Base44 project settings under <strong>Domains</strong>, enter <code>dysonhomes.com</code> and click <strong>Verify</strong>. Alternatively, use <strong>Continue with GoDaddy</strong> for 1-click automated DNS configuration.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg font-bold text-xs cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%)',
              color: '#000',
            }}
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}