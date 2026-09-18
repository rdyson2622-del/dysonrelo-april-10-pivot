import React, { useState } from 'react';
import CopilotPreferredClientModal from '@/components/copilot/CopilotPreferredClientModal';

export default function ChiefPilotPreferredDoor({ active, message, onClaimSuccess }) {
  const [open, setOpen] = useState(false);
  return (
    <section id="preferred-client-door" className="mt-10 rounded-xl border border-dyson-gold/30 bg-dyson-gold/5 p-6 text-left">
      <p className="text-[10px] tracking-[0.18em] text-dyson-gold">PREFERRED CLIENT</p>
      {active ? <><h2 className="mt-2 text-lg text-dyson-text-dark">Your private workspace is open.</h2><p className="mt-2 text-sm text-dyson-text-dark/70">Chats and Library are available across every category.</p></> : <><h2 className="mt-2 text-lg text-dyson-text-dark">Keep this plan and open private Chats and Library.</h2><p className="mt-2 text-sm leading-6 text-dyson-text-dark/70">Continue inside only if you agree to employ CoPilot as your relocation partner.</p>{message && <p className="mt-3 text-xs text-dyson-gold-deep">{message}</p>}<button type="button" onClick={() => setOpen(true)} className="mt-5 rounded-full bg-dyson-gold px-5 py-2.5 text-sm text-dyson-text-dark">Claim Preferred Client status</button></>}
      <CopilotPreferredClientModal isOpen={open} onClose={() => setOpen(false)} onClaimSuccess={onClaimSuccess} />
    </section>
  );
}