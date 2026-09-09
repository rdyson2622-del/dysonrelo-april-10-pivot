import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Home, Users, Handshake, Share2, Megaphone, Building2,
  Newspaper, Wrench, Radio,
} from 'lucide-react';

const GOLD = '#D4AF37';

const CAMPAIGNS = [
  {
    icon: Home,
    title: 'Pending Listings',
    audience: 'Listing agents with a $3.5M+ MLS listing in escrow',
    goal: 'Turn the moment a listing goes into escrow into a warm referral pitch for the agent\'s relocating seller.',
    status: 'Built — MLS Listing Agent Outreach (personalized preview link + Resend multi-inbox rotation, 40/day per address)',
    discuss: 'Confirm Wisdom Properties IDX feed as the daily listing source with Mike West.',
  },
  {
    icon: Users,
    title: 'Relocation Agent Subscribers',
    audience: 'PRN partner agents already on the roster (sending + destination)',
    goal: 'Keep affiliated agents engaged with DNN content and Dyson tools so referrals keep flowing both directions.',
    status: 'Roster + Sending Agent Tracker live; content tier not yet built.',
    discuss: 'Define what a Relocation Agent subscriber actually receives day-to-day.',
  },
  {
    icon: Handshake,
    title: 'Referral Agent Subscribers',
    audience: 'Independent agents outside the PRN who take one-off referrals',
    goal: 'A lighter-touch subscriber tier for agents who aren\'t full PRN partners yet but send/receive occasional referrals.',
    status: 'Overlaps with Top 200 Independent Agent Campaign (SimpleTexting).',
    discuss: 'Decide if this is a distinct tier or folds into the Top 200 campaign.',
  },
  {
    icon: Share2,
    title: 'Social Media Daily News Campaigns',
    audience: 'LinkedIn / Instagram / Facebook followers',
    goal: 'Daily DNN broadcast clips auto-posted to build the "Oracle of Relocation" brand presence.',
    status: 'Connectors authorized (LinkedIn, Instagram, Facebook Pages); auto-post reliability is a known issue.',
    discuss: 'Prioritize fixing the auto-post failures before adding more channels.',
  },
  {
    icon: Megaphone,
    title: 'PR Campaigns',
    audience: 'Press, media outlets, industry journalists',
    goal: 'Earn press coverage and third-party credibility using Bob\'s legacy + the DNN story.',
    status: 'Media CRM, Pitch Tracker, Press Kit pages exist.',
    discuss: 'Pick target outlets and the first pitch to send.',
  },
  {
    icon: Building2,
    title: 'Corporate HR Campaigns',
    audience: 'Corporate HR / relocation coordinators at employers',
    goal: 'Position Dyson as the concierge relocation partner for employee moves — a B2B channel, not a consumer one.',
    status: 'Corporate Relo public page + B2B Audience Distribution built.',
    discuss: 'Identify first 10 target companies/HR contacts.',
  },
  {
    icon: Newspaper,
    title: 'Relo Agent Daily News Tiers',
    audience: 'Bureau Chief agents co-branded on DNN content',
    goal: 'Paid tier where an agent gets DNN intelligence co-branded for their own farm/territory.',
    status: 'Agent Bureau (B2B) page exists; billing/tiering not yet active.',
    discuss: 'Set the Bureau Chief monthly price and territory exclusivity rules.',
  },
  {
    icon: Wrench,
    title: 'Vendor Daily News Tiers',
    audience: 'Lenders, title companies, movers, inspectors',
    goal: 'Vendors pay to be DNN-approved and get co-branded market intelligence for their own clients.',
    status: 'Lender Vetting process exists; vendor content tier not yet built.',
    discuss: 'Decide which vendor category launches first (lenders vs. movers vs. title).',
  },
  {
    icon: Radio,
    title: 'Consumer Direct Subscribers',
    audience: 'General public — homeowners and future relocators',
    goal: 'Free Tier 1 DNN subscribers who build trust with daily intelligence long before they\'re ready to move.',
    status: 'DNN Subscriber CRM + email/in-app blast pipeline live.',
    discuss: 'Grow the subscriber base — where does the next batch of signups come from?',
  },
];

export default function AdminMarketingCampaignsHub() {
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8" style={{ background: '#ede0cc' }}>
      <div className="max-w-6xl mx-auto space-y-6 text-left">
        <div>
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-1 font-sans" style={{ color: '#854d0e' }}>
            REFERENCE &amp; STRATEGY DISCUSSIONS
          </p>
          <h1 className="display-heading mb-1 text-2xl sm:text-3xl" style={{ color: '#0a0a0a' }}>
            Marketing Campaigns Hub
          </h1>
          <p className="text-xs sm:text-sm text-[#44382c] font-medium max-w-3xl leading-relaxed">
            Nine campaign pillars for affiliate growth, broker distribution, and automated relocation lead acquisition.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CAMPAIGNS.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.title}
                className="rounded-3xl p-5 flex flex-col gap-3 shadow-xl transition-all hover:border-[#D4AF37]"
                style={{ background: '#0a0a0a', border: `1.5px solid ${GOLD}40` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${GOLD}18`, border: `1px solid ${GOLD}50` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: GOLD }} />
                  </div>
                  <h3 className="text-lg font-serif text-white leading-tight">{c.title}</h3>
                </div>

                <p className="text-[11px] font-black tracking-widest uppercase" style={{ color: GOLD }}>
                  Audience
                </p>
                <p className="text-sm text-gray-300 leading-snug -mt-2">{c.audience}</p>

                <p className="text-[11px] font-black tracking-widest uppercase" style={{ color: GOLD }}>
                  Goal
                </p>
                <p className="text-sm text-gray-300 leading-snug -mt-2">{c.goal}</p>

                <p className="text-[11px] font-black tracking-widest uppercase" style={{ color: GOLD }}>
                  Where it stands
                </p>
                <p className="text-sm text-gray-400 leading-snug -mt-2">{c.status}</p>

                <div className="mt-1 rounded-lg p-3" style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid ${GOLD}30` }}>
                  <p className="text-[10px] font-black tracking-widest uppercase mb-1" style={{ color: GOLD }}>
                    To discuss today
                  </p>
                  <p className="text-xs text-white leading-snug">{c.discuss}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}