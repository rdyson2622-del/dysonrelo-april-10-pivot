import React, { useState } from 'react';
import { Search, Mic } from 'lucide-react';
import DysonVerticalBadge from '@/components/brand/DysonVerticalBadge';
import CopilotWordmark from '@/components/brand/CopilotWordmark';

const HERO_IMAGE = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/efdc69af3_hero-evening-luxury-clean.png';

export default function CopilotHeroBanner({ onSearch, onOpenVoice }) {
  const [address, setAddress] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (!address.trim()) return;
    onSearch?.(address);
  };

  return (
    <section className="px-4 sm:px-8 pt-6 pb-8" style={{ background: '#ede0cc' }}>
      <div className="max-w-4xl mx-auto space-y-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <DysonVerticalBadge height={72} />
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-[#0a0a0a]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>meet</span>
            <CopilotWordmark bold className="h-9 w-24" />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl shadow-2xl border border-[#D4AF37]/30 w-1/2 mx-auto">
          <img src={HERO_IMAGE} alt="Luxury home with pool" className="w-full aspect-[16/9] object-cover" />
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#854d0e' }}>
          Your Private Real Estate Copilot.
        </h1>

        <p className="text-sm sm:text-base text-[#2a241b] max-w-2xl mx-auto font-medium leading-relaxed">
          Paste any address from any online real estate site to see real sold comps, hidden property risks, and your calculated cash rebate at closing.
        </p>

        <form onSubmit={submit} className="max-w-2xl mx-auto pt-1">
          <div className="flex items-center rounded-2xl sm:rounded-full p-2 bg-[#0a0a0a] border-2 border-[#D4AF37] shadow-2xl">
            <div className="flex items-center gap-2.5 flex-1 pl-3 sm:pl-4">
              <Search className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Paste any address or online home link..."
                className="w-full bg-transparent text-white text-xs sm:text-sm font-semibold outline-none placeholder:text-white/40"
              />
            </div>
            <div className="flex items-center gap-1.5 pr-1 shrink-0">
              <button
                type="button"
                onClick={onOpenVoice}
                className="p-2 sm:p-2.5 rounded-xl bg-black border border-[#10b981]/60 text-[#10b981] hover:bg-[#10b981]/20 transition-all cursor-pointer shadow-sm active:scale-95"
                title="Talk with Charlie (Voice AI)"
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                type="submit"
                className="px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-full text-xs sm:text-sm font-black text-black hover:brightness-110 active:scale-95 cursor-pointer shadow-lg transition-all"
                style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 50%, #b8920a 100%)' }}
              >
                Run Copilot
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}