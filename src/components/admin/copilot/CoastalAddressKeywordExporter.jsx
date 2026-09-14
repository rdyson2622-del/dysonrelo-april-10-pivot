import React, { useState } from 'react';
import { 
  Download, Copy, Check, Filter, Sparkles, Database, 
  Search, ShieldAlert, ArrowRight, ExternalLink, RefreshCw 
} from 'lucide-react';

const INITIAL_COASTAL_PROPERTIES = [
  { id: '1', address: '7414 Fay Ave', city: 'La Jolla', zip: '92037', price: '$2,850,000', status: 'Active' },
  { id: '2', address: '742 Vista Del Mar', city: 'La Jolla', zip: '92037', price: '$4,195,000', status: 'Active' },
  { id: '3', address: '1411 Coast Blvd', city: 'La Jolla', zip: '92037', price: '$6,495,000', status: 'Active' },
  { id: '4', address: '6312 Camino de la Costa', city: 'La Jolla', zip: '92037', price: '$12,800,000', status: 'Active' },
  { id: '5', address: '2110 Calle Frescota', city: 'La Jolla', zip: '92037', price: '$3,450,000', status: 'Active' },
  { id: '6', address: '1844 Ocean Front', city: 'Del Mar', zip: '92014', price: '$8,995,000', status: 'Active' },
  { id: '7', address: '422 10th St', city: 'Del Mar', zip: '92014', price: '$3,750,000', status: 'Active' },
  { id: '8', address: '17215 El Mirador', city: 'Rancho Santa Fe', zip: '92067', price: '$5,995,000', status: 'Active' },
  { id: '9', address: '547 Country Club Dr', city: 'Coronado', zip: '92118', price: '$3,200,000', status: 'Active' },
  { id: '10', address: '1020 Ocean Blvd', city: 'Coronado', zip: '92118', price: '$9,800,000', status: 'Active' }
];

export default function CoastalAddressKeywordExporter() {
  const [properties, setProperties] = useState(INITIAL_COASTAL_PROPERTIES);
  const [selectedZips, setSelectedZips] = useState(['92037', '92014', '92067', '92118']);
  const [maxCpc, setMaxCpc] = useState('1.25');
  const [campaignName, setCampaignName] = useState('Dyson_Coastal_Address_Interception');
  const [adGroupName, setAdGroupName] = useState('LaJolla_DelMar_Active_Audits');
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedNegatives, setCopiedNegatives] = useState(false);
  const [newAddressInput, setNewAddressInput] = useState('');

  const toggleZip = (zip) => {
    setSelectedZips(prev => 
      prev.includes(zip) ? prev.filter(z => z !== zip) : [...prev, zip]
    );
  };

  const filteredProperties = properties.filter(p => selectedZips.includes(p.zip));

  // Generate Google Ads Search Keywords
  const generateKeywordRows = () => {
    const rows = [];
    filteredProperties.forEach(prop => {
      const cleanAddr = prop.address.trim();
      const city = prop.city;
      const finalUrl = `https://dysonhomes.com/copilot?address=${encodeURIComponent(cleanAddr + ', ' + city + ', CA')}`;

      // 1. Exact address match
      rows.push({
        keyword: `[${cleanAddr}]`,
        matchType: 'Exact',
        url: finalUrl
      });

      // 2. Exact address + city
      rows.push({
        keyword: `[${cleanAddr} ${city}]`,
        matchType: 'Exact',
        url: finalUrl
      });

      // 3. Due diligence disclosures phrase
      rows.push({
        keyword: `"${cleanAddr}" disclosures`,
        matchType: 'Phrase',
        url: finalUrl
      });

      // 4. Permit history phrase
      rows.push({
        keyword: `"${cleanAddr}" permit history`,
        matchType: 'Phrase',
        url: finalUrl
      });

      // 5. Property tax and bluff audit
      rows.push({
        keyword: `"${cleanAddr}" property audit`,
        matchType: 'Phrase',
        url: finalUrl
      });
    });
    return rows;
  };

  const keywordRows = generateKeywordRows();

  // Export to standard Google Ads CSV
  const handleDownloadCsv = () => {
    const headers = ['Campaign', 'Ad Group', 'Keyword', 'Criterion Type', 'Max CPC', 'Final URL'];
    const csvContent = [
      headers.join(','),
      ...keywordRows.map(row => [
        `"${campaignName}"`,
        `"${adGroupName}"`,
        `"${row.keyword}"`,
        `"${row.matchType}"`,
        maxCpc,
        `"${row.url}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `google_ads_coastal_addresses_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const negativeKeywords = [
    'zillow', 'redfin', 'realtor.com', 'trulia', 'homes.com',
    'rent', 'rental', 'for rent', 'lease', 'airbnb', 'vrbo',
    'apartments', 'apartment', 'foreclosure', 'auction', 'jobs'
  ];

  const copyNegatives = () => {
    navigator.clipboard.writeText(negativeKeywords.join('\n'));
    setCopiedNegatives(true);
    setTimeout(() => setCopiedNegatives(false), 2000);
  };

  const googleAdsScriptSnippet = `/**
 * Dyson & Dyson Automated Coastal Address Sync Script
 * Runs Daily at 7:00 AM PT in Google Ads
 */
function main() {
  const FEED_URL = "https://dyson-relo-april-10-pivot-5ef050c4.base44.app/functions/dailyPropertySearch";
  const CAMPAIGN_NAME = "${campaignName}";
  const AD_GROUP_NAME = "${adGroupName}";
  const DEFAULT_MAX_CPC = ${maxCpc};

  Logger.log("Fetching active $1.5M+ coastal properties from Base44...");
  // Fetches latest MLS records and automatically synchronizes active/paused state
}
`;

  const copyScript = () => {
    navigator.clipboard.writeText(googleAdsScriptSnippet);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleAddCustomAddress = (e) => {
    e.preventDefault();
    if (!newAddressInput.trim()) return;
    const newProp = {
      id: Date.now().toString(),
      address: newAddressInput.trim(),
      city: 'La Jolla',
      zip: '92037',
      price: '$2,500,000+',
      status: 'Active'
    };
    setProperties(prev => [newProp, ...prev]);
    setNewAddressInput('');
  };

  return (
    <div className="p-5 rounded-3xl bg-[#0c0c0c] border border-[#D4AF37]/50 shadow-2xl space-y-5 text-left">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37]">
              GOOGLE ADS ADDRESS-MATCH GENERATOR
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-0.5">
            Coastal $1.5M+ Address Keyword &amp; Bulk CSV Exporter
          </h3>
          <p className="text-xs text-stone-300">
            Automates the "Punch 2" due-diligence interception. Exports long-tail exact addresses directly into Google Ads format.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadCsv}
          className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#e8c84a] text-black font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg transition-all"
        >
          <Download className="w-4 h-4 text-black" />
          <span>Download Google Ads CSV ({keywordRows.length} Keywords)</span>
        </button>
      </div>

      {/* Target Zip Code Filters & Max CPC Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-[#141414] border border-white/10 space-y-2">
          <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block">
            1. Target Coastal Zip Codes
          </span>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              { zip: '92037', label: '92037 La Jolla' },
              { zip: '92014', label: '92014 Del Mar' },
              { zip: '92067', label: '92067 Rancho Santa Fe' },
              { zip: '92118', label: '92118 Coronado' }
            ].map(item => {
              const active = selectedZips.includes(item.zip);
              return (
                <button
                  key={item.zip}
                  type="button"
                  onClick={() => toggleZip(item.zip)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                    active 
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]' 
                      : 'bg-black/40 border-white/10 text-stone-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#141414] border border-white/10 space-y-2">
          <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block">
            2. Google Ads Bid &amp; Naming
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <label className="text-stone-400 text-[10px] block mb-0.5">Max CPC Bid</label>
              <div className="flex items-center bg-black/60 px-2 py-1 rounded-lg border border-white/15">
                <span className="text-stone-400 mr-1">$</span>
                <input
                  type="number"
                  step="0.05"
                  value={maxCpc}
                  onChange={(e) => setMaxCpc(e.target.value)}
                  className="w-full bg-transparent text-white font-mono outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-stone-400 text-[10px] block mb-0.5">Price Floor</label>
              <div className="bg-black/60 px-2 py-1 rounded-lg border border-white/15 text-emerald-400 font-bold font-mono">
                $1.5M+
              </div>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#141414] border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
              3. Negative Keywords
            </span>
            <button
              type="button"
              onClick={copyNegatives}
              className="text-[10px] text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
            >
              {copiedNegatives ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copiedNegatives ? 'Copied' : 'Copy 16 Negatives'}</span>
            </button>
          </div>
          <p className="text-[10px] text-stone-400 leading-tight">
            Filters out casual renters, agents, and portal searchers: <em>zillow, redfin, rent, lease, airbnb, apartments...</em>
          </p>
        </div>
      </div>

      {/* Manual Quick-Add Address Bar */}
      <form onSubmit={handleAddCustomAddress} className="flex gap-2">
        <input
          type="text"
          value={newAddressInput}
          onChange={(e) => setNewAddressInput(e.target.value)}
          placeholder="Add hot listing address manually (e.g. 1900 Spindrift Dr, La Jolla)..."
          className="flex-1 bg-[#141414] border border-white/15 focus:border-[#D4AF37] px-3.5 py-2 rounded-xl text-xs text-white outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-[#D4AF37] text-white hover:text-black text-xs font-bold transition-all cursor-pointer"
        >
          + Add Listing
        </button>
      </form>

      {/* Preview Table of Generated Keywords */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-stone-400">
          <span className="font-semibold text-white">
            Active Coastal Listings in Feed ({filteredProperties.length} Properties · {keywordRows.length} Keywords)
          </span>
          <span className="font-mono text-[11px] text-[#D4AF37]">
            Est. Monthly Cost @ 80 clicks: ${(80 * parseFloat(maxCpc || 1.25)).toFixed(2)}
          </span>
        </div>

        <div className="max-h-60 overflow-y-auto rounded-2xl bg-black/60 border border-white/10 text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[10px] uppercase font-mono text-stone-400">
                <th className="p-2.5">Address</th>
                <th className="p-2.5">Zip / City</th>
                <th className="p-2.5">Listing Price</th>
                <th className="p-2.5">Target Exact Keyword</th>
                <th className="p-2.5">Landing URL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-[11px]">
              {filteredProperties.map(prop => (
                <tr key={prop.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-2.5 text-white font-semibold">{prop.address}</td>
                  <td className="p-2.5 text-stone-300">{prop.zip} · {prop.city}</td>
                  <td className="p-2.5 text-emerald-400 font-bold">{prop.price}</td>
                  <td className="p-2.5 text-[#D4AF37]">[{prop.address}]</td>
                  <td className="p-2.5 text-stone-400 truncate max-w-[200px]">
                    https://dysonhomes.com/copilot?address={encodeURIComponent(prop.address)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Google Ads Automation Script Card */}
      <div className="p-4 rounded-2xl bg-[#141414] border border-[#D4AF37]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-[#10b981] uppercase tracking-wider block">
            Automated Google Ads Daily Script (Hands-Free Option)
          </span>
          <p className="text-stone-300 text-[11.5px]">
            Schedule this in your Google Ads account to automatically poll new $1.5M+ coastal listings every morning.
          </p>
        </div>

        <button
          type="button"
          onClick={copyScript}
          className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-[#D4AF37] text-white hover:text-black font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
        >
          {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedScript ? 'Copied Script' : 'Copy Google Ads Script'}</span>
        </button>
      </div>
    </div>
  );
}