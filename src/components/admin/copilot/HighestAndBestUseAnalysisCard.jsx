import React, { useState } from 'react';
import { 
  TrendingUp, CheckCircle2, AlertTriangle, ShieldCheck, 
  Copy, Check, DollarSign, Target, Zap, ArrowRight, BarChart3
} from 'lucide-react';

export const HIGHEST_BEST_USE_TEXT = `# STRATEGIC VALIDATION: GOOGLE ADDRESS MATCH + RETARGETING AS HIGHEST & BEST USE

## Verdict
Yes. For a testing budget of $500 to $1,500 a month in coastal luxury real estate ($1.5M+), this two-punch strategy is the highest and best use of your capital, automation, and positioning.

Every conventional real estate marketing channel fails at this budget tier. Here is how this approach compares directly against the industry alternatives, why your specific tech stack makes it work, and the single metric that will determine whether it pays off.

---

## How It Compares to Alternative Plays at $500/Month

| Strategy | Est. Cost / Click (CPC) | Intent Level | Flaw at $500/Month Budget |
| :--- | :--- | :--- | :--- |
| **Broad Google PPC** (e.g. "La Jolla homes for sale") | $18.00 – $45.00+ | Low to Mid | Burns your entire $500 on 12 to 25 clicks. Completely unviable. |
| **Meta / Instagram Ads** (Carousel listings) | $1.50 – $3.50 | Very Low | High volume of "Zillow voyeurs" and tire-kickers with zero buying capacity. |
| **Portal Direct / Premier Agent** (Zillow/Realtor) | $2,500 – $6,000/mo | High | Requires large monthly minimums and forces you into a 3-way race against other agents. |
| **Targeted Direct Mail** (Coastal post cards) | ~$1.25 / piece | Passive | $500 reaches only ~400 doors once. Statistically near-zero yield on a single drop. |
| **Google Address Match + Retargeting** | **$0.75 – $2.75** | **Extreme (In Due Diligence)** | **Delivers 100–150 laser-targeted visits actively evaluating specific properties right now.** |

---

## Why This Is Your Highest and Best Play

### 1. The Cost Arbitrage (Nobody Bids on Addresses)
Major portals and mega-teams spend millions bidding on broad search queries like "San Diego luxury real estate" or "Del Mar oceanfront homes." Almost no one bids on specific street addresses like [7414 Fay Ave] or [7414 Fay Ave tax history]. Because competition on exact long-tail addresses is virtually zero, Google’s auction prices drop to rock bottom ($0.75 to $2.50 per click). You are stepping into an open lane.

### 2. Perfect Intent Alignment
A consumer typing "7414 Fay Ave permits" or "7414 Fay Ave bluff hazard" is not casually browsing on the couch. They have toured the property, read the listing sheet, or are actively preparing to write an offer. They are at the exact bottom of the funnel. Intercepting them at this moment with an independent due diligence audit positions Dyson & Dyson not as an aggressive sales agent trying to take a commission, but as an authoritative risk manager protecting their balance sheet.

### 3. Zero-Labor Automation
Because Base44 connects your MLS feed directly to the Google Ads API and dynamic landing URLs (dysonhomes.com/copilot?address=...), your operational cost is essentially zero once configured:
- When a coastal luxury listing goes live, your ad group and keywords go live automatically.
- When the listing goes into escrow or sells, the ad group pauses automatically.
- You do not spend hours manually building campaigns or monitoring ad sets.

---

## The Only Vulnerability You Must Watch: Landing Page Capture
The strategy will only produce transactions if your Page 2 Command Center converts those 100–150 clicks into identified prospects.

To ensure this remains your highest and best play:
1. **Frictionless Capture:** Keep the capture hook low-pressure, exactly as you structured it with the "Text Me Report" and "Save to My Vault" loss-aversion prompt. Never hit them with an aggressive forced registration wall the second they click.
2. **Instant Gratification:** Ensure the address passed in the URL automatically populates Charlie's briefing and the Comps/Risks cards immediately so they see instant value before giving their phone number.
3. **Follow-Up Protocol:** When a verified buyer texts or claims a vault for a $4M La Jolla listing, having Bob Dyson or Charlie follow up within 10 minutes with technical zoning or disclosure insight turns that single $2.50 click into a $100,000+ commission opportunity.`;

export default function HighestAndBestUseAnalysisCard() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(HIGHEST_BEST_USE_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 rounded-3xl bg-[#0a0a0a] border-2 border-[#D4AF37] shadow-2xl space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
              STRATEGIC EVALUATION &amp; CAPITAL ALLOCATION
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Highest &amp; Best Use Marketing Analysis
          </h2>
          <p className="text-xs text-stone-300 mt-1">
            Evaluation: <strong className="text-[#D4AF37]">Google Address Match + Micro-Geofence Retargeting</strong> vs. Traditional Portals &amp; Broad PPC.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#e8c84a] text-black font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied Strategy Memo' : 'Copy Strategy Memo'}</span>
        </button>
      </div>

      {/* Big Verdict Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1c170d] via-[#121212] to-[#141818] border border-[#D4AF37]/60 space-y-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0" />
          <span className="text-sm font-bold text-white uppercase tracking-wide">
            Definitive Verdict: Absolute Highest &amp; Best Use of $500–$1,500/Month
          </span>
        </div>
        <p className="text-xs sm:text-sm text-stone-200 leading-relaxed pl-7">
          For a test budget of $500 to $1,500/month in coastal luxury real estate ($1.5M+), this two-punch strategy is undeniably the highest and best use of your capital, automation, and positioning. Every conventional channel either burns the entire budget in under 20 clicks or delivers zero-intent voyeurs.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="space-y-2">
        <h3 className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>How It Compares to Alternative Real Estate Plays at $500/Month</span>
        </h3>

        <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#121212]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181818] text-stone-400 font-mono text-[10px] uppercase border-b border-white/10">
              <tr>
                <th className="p-3">Strategy</th>
                <th className="p-3">Est. CPC</th>
                <th className="p-3">Buyer Intent Level</th>
                <th className="p-3">Fatal Flaw at $500/Mo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-stone-300">
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-3 font-semibold text-white">Broad Google PPC (e.g. "La Jolla homes for sale")</td>
                <td className="p-3 text-red-400 font-mono">$18.00 – $45.00+</td>
                <td className="p-3 text-stone-400">Low to Mid</td>
                <td className="p-3 text-stone-400">Burns entire $500 on 12 to 25 clicks. Completely unviable.</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-3 font-semibold text-white">Meta / Instagram Ads (Carousel listings)</td>
                <td className="p-3 font-mono text-stone-300">$1.50 – $3.50</td>
                <td className="p-3 text-stone-400">Very Low</td>
                <td className="p-3 text-stone-400">High volume of "Zillow voyeurs" and tire-kickers with zero buying capacity.</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-3 font-semibold text-white">Portal Direct / Premier Agent (Zillow/Realtor)</td>
                <td className="p-3 font-mono text-stone-300">$2,500 – $6,000/mo min.</td>
                <td className="p-3 text-amber-300">High</td>
                <td className="p-3 text-stone-400">Requires large monthly minimums and forces you into a 3-way race against other agents.</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-3 font-semibold text-white">Targeted Direct Mail (Coastal post cards)</td>
                <td className="p-3 font-mono text-stone-300">~$1.25 / piece</td>
                <td className="p-3 text-stone-400">Passive</td>
                <td className="p-3 text-stone-400">$500 reaches only ~400 doors once. Statistically near-zero yield on a single drop.</td>
              </tr>
              <tr className="bg-[#D4AF37]/15 border-t-2 border-[#D4AF37]/50">
                <td className="p-3 font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                  <span>Google Address Match + Retargeting</span>
                </td>
                <td className="p-3 text-[#D4AF37] font-mono font-bold">$0.75 – $2.75</td>
                <td className="p-3 text-[#10b981] font-bold">Extreme (Active Due Diligence)</td>
                <td className="p-3 text-white font-medium">Delivers 100–150 laser-targeted visits actively evaluating specific properties right now.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3 Core Advantages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-2">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#D4AF37]" />
            <h4 className="font-bold text-white text-sm">1. Cost Arbitrage</h4>
          </div>
          <p className="text-stone-300 leading-relaxed text-[11.5px]">
            Major portals spend millions on generic searches ("San Diego luxury"). Almost no one bids on specific street addresses like <em>[7414 Fay Ave]</em>. Google auction prices drop to rock bottom ($0.75–$2.50/click). You step into an uncontested lane.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-2">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#10b981]" />
            <h4 className="font-bold text-white text-sm">2. Perfect Intent Alignment</h4>
          </div>
          <p className="text-stone-300 leading-relaxed text-[11.5px]">
            A user searching <em>"7414 Fay Ave permits"</em> or <em>"bluff hazard"</em> has already toured or is drafting an offer. They are at the ultimate bottom-of-funnel. Intercepting them with a fiduciary audit establishes you as an authoritative risk manager protecting their balance sheet.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#60a5fa]" />
            <h4 className="font-bold text-white text-sm">3. Zero-Labor Automation</h4>
          </div>
          <p className="text-stone-300 leading-relaxed text-[11.5px]">
            When an MLS coastal listing goes active, your ad group and exact keyword match go live automatically. When the property closes or goes pending, it pauses automatically. Zero manual campaign rebuilds.
          </p>
        </div>
      </div>

      {/* The Crucial Safeguard: Landing Page Capture */}
      <div className="p-4 rounded-2xl bg-[#141414] border border-amber-500/40 space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <h4 className="text-xs sm:text-sm font-bold text-white">
            The Only Vulnerability to Guard: Landing Page Conversion &amp; Response
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11.5px] text-stone-300">
          <div className="bg-black/50 p-2.5 rounded-xl border border-white/5 space-y-1">
            <strong className="text-amber-300 block">Frictionless Capture</strong>
            <span>Keep the capture hook low-pressure ("Text Me Report" / "Save to Vault"). Never hit them with a forced registration wall upon arrival.</span>
          </div>
          <div className="bg-black/50 p-2.5 rounded-xl border border-white/5 space-y-1">
            <strong className="text-emerald-300 block">Instant Gratification</strong>
            <span>Ensure the address passed in the URL populates Charlie's briefing and Comps/Risks cards immediately before asking for contact info.</span>
          </div>
          <div className="bg-black/50 p-2.5 rounded-xl border border-white/5 space-y-1">
            <strong className="text-[#D4AF37] block">10-Minute Follow-Up</strong>
            <span>When a buyer claims an audit on a $4M coastal home, a rapid technical follow-up turns that single $2.50 click into a $100,000+ commission.</span>
          </div>
        </div>
      </div>
    </div>
  );
}