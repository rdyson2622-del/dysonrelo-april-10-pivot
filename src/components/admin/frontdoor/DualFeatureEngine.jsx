import React from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, ShieldCheck, MapPin, Compass } from 'lucide-react';

const GOLD = '#D4AF37';

export default function DualFeatureEngine({ latestBroadcast }) {
  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* LEFT: 6AM DAILY DNN BROADCAST BOX */}
      <div
        id="dnn-broadcast-engine"
        className="rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all scroll-mt-24"
        style={{
          background: '#0a0a0a',
          border: `2px solid ${GOLD}`,
          boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
        }}
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              6AM DAILY EDITION
            </span>
            <span className="text-[11px] text-[#ede0cc]/70 font-mono">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <h3
            className="font-bold text-xl text-white mb-2 leading-snug"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {latestBroadcast?.show_name || "National Relocation & Housing Pulse — 90-Second Brief"}
          </h3>
          <p className="text-xs text-white/80 leading-relaxed mb-4">
            AI Anchor Charlie and founder Bob Dyson deliver your daily executive breakdown: mortgage rate movements, state-to-state tax advantages, and buyer opportunities.
          </p>

          {/* Video Player Frame */}
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-[#333] group">
            <img
              src="https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/0f55cd52a_DNNStudioLandingPage.png"
              alt="News Studio"
              className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex items-end p-4 justify-between">
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-[#D4AF37] block">
                  DNN Broadcast Desk
                </span>
                <span className="text-xs font-semibold text-white">
                  Scene 1: Charlie Desk • Scene 2: Relocation Brief
                </span>
              </div>
              <Link
                to="/dnn-news"
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
                style={{ background: GOLD, color: '#000' }}
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between text-xs border-t border-[#222] mt-4">
          <span className="text-white/60">Broadcasts publish daily at 6:00 AM PT</span>
          <Link to="/dnn-news" className="text-[#D4AF37] hover:underline font-bold flex items-center gap-1">
            Watch News Archives <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* RIGHT: VETTED CONCIERGE ADVANTAGE BOX */}
      <div
        id="concierge-advantage-engine"
        className="rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all scroll-mt-24"
        style={{
          background: '#0a0a0a',
          border: `2px solid ${GOLD}`,
          boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
        }}
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase"
              style={{ background: 'rgba(212,175,55,0.2)', color: GOLD }}
            >
              <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
              THE CONCIERGE ADVANTAGE
            </span>
            <span className="text-[11px] text-[#ede0cc]/70">Zero Sales Pitches</span>
          </div>

          <h3
            className="font-bold text-xl text-white mb-2 leading-snug"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Beyond Simple Portal Search: Independent Vetting
          </h3>
          <p className="text-xs text-white/80 leading-relaxed mb-4">
            Other portals sell your data to random advertising agents. We research 20+ top producers in your target destination, check escrow track records, and provide hand-picked representation.
          </p>

          {/* 3 Pillars List */}
          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-[#141414] border border-[#222] flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: 'rgba(212,175,55,0.2)', border: `1px solid ${GOLD}` }}>
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Destination Orientation</h4>
                <p className="text-[11px] text-white/70">Taxes, neighborhood vibes, school rankings, and local relocation costs.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#141414] border border-[#222] flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: 'rgba(212,175,55,0.2)', border: `1px solid ${GOLD}` }}>
                <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">20+ Top Agent Research</h4>
                <p className="text-[11px] text-white/70">We interview top producing brokers and deliver 3 vetted finalists suited to you.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#141414] border border-[#222] flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: 'rgba(212,175,55,0.2)', border: `1px solid ${GOLD}` }}>
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">100% Free For Relocating Buyers</h4>
                <p className="text-[11px] text-white/70">Compensated strictly through standard inter-brokerage referral agreements.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between text-xs border-t border-[#222] mt-4">
          <span className="text-white/60">Ready to plan your move?</span>
          <Link to="/relocation-intake" className="text-[#D4AF37] hover:underline font-bold flex items-center gap-1">
            Start Relocation Intake <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}