import React from 'react';
import { Star, Phone, Globe, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function PreferredNationalsSection({
  nationals = [],
  selectedIndustryLabel = '',
}) {
  if (nationals.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 text-left">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
            CURATED NATIONAL ALLOCATION
          </span>
          <h2 className="text-sm sm:text-base font-bold text-white">
            Vetted National Partners ({selectedIndustryLabel})
          </h2>
        </div>
        <span className="text-[10px] font-mono text-[#D4AF37] px-2 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30">
          Strict Cap: ≤ 2 Partners
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {nationals.map((vendor) => (
          <div
            key={vendor.id || vendor.name}
            className="p-4 rounded-2xl bg-[#0d0d0d] border border-[#D4AF37]/40 space-y-2.5 shadow-xl relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#D4AF37] text-black">
                    Rank #{vendor.national_rank || 1} National
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Fiduciary Vetted
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white mt-1">
                  {vendor.name}
                </h3>
              </div>
            </div>

            {vendor.notes && (
              <p className="text-xs text-white/70 leading-relaxed italic bg-black/60 p-2.5 rounded-xl border border-white/5">
                "{vendor.notes}"
              </p>
            )}

            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-3 text-white/60 text-[11px]">
                {vendor.coverage && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#D4AF37]" />
                    <span>{vendor.coverage}</span>
                  </span>
                )}
                {vendor.phone && (
                  <a 
                    href={`tel:${vendor.phone}`}
                    className="flex items-center gap-1 text-white hover:text-[#D4AF37] transition-colors font-medium"
                  >
                    <Phone className="w-3 h-3 text-[#D4AF37]" />
                    <span>{vendor.phone}</span>
                  </a>
                )}
              </div>

              {vendor.website && (
                <a
                  href={vendor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#D4AF37] text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Globe className="w-3 h-3" />
                  <span>Official Portal</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}