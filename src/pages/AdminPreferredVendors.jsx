import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Wrench, ShieldCheck, Lock, Upload, Plus, Search, 
  HelpCircle, BookOpen, Layers, CheckCircle2, AlertCircle,
  FileText, ExternalLink, Filter, Building2, Truck, Sparkles,
  Phone, Globe, MapPin, Tag, Check, X, Clock, Compass
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';

const DRAFT_GUIDED_QUESTIONS = [
  {
    industry: 'moving',
    label: 'Moving & Van Lines',
    questions: [
      'Origin and destination ZIP codes?',
      'Estimated move date and timing flexibility?',
      'Residence size (bedrooms/sqft) & special items (piano, safe, fine art)?',
      'Full packing service or transport only?'
    ]
  },
  {
    industry: 'staging',
    label: 'Home Staging & Design',
    questions: [
      'Is the residence currently vacant or owner-occupied?',
      'Target listing price point and architectural style?',
      'Key rooms requiring staging (primary suite, great room, outdoor living)?',
      'Target photography / MLS live date?'
    ]
  },
  {
    industry: 'home_inspection',
    label: 'Home Inspection & Engineering',
    questions: [
      'Property year built and foundation type?',
      'Ancillary inspections needed (sewer lateral camera, pool/spa, roof, chimney)?',
      'Contract contingency deadline for inspection sign-off?'
    ]
  },
  {
    industry: 'cleaning',
    label: 'Turnkey Move Cleaning',
    questions: [
      'Move-in or move-out turnover cleaning?',
      'Interior window cleaning and carpet extraction required?',
      'Appliance interior detailing requested?'
    ]
  }
];

export default function AdminPreferredVendors() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview'); // overview | industries | nationals | match_requests | offerings | guided_qa | docs
  const [industryFilter, setIndustryFilter] = useState('all');
  
  // New Industry form state
  const [showAddIndustry, setShowAddIndustry] = useState(false);
  const [newIndustry, setNewIndustry] = useState({ key: '', label: '', consumer_blurb: '', sort_order: 13, active: true });
  const [addIndustryError, setAddIndustryError] = useState('');

  // Queries
  const { data: industries = [], isLoading: isLoadingIndustries } = useQuery({
    queryKey: ['vendorIndustries'],
    queryFn: async () => {
      const res = await base44.entities.VendorIndustry.list('sort_order', 100);
      return res || [];
    }
  });

  const { data: nationals = [], isLoading: isLoadingNationals } = useQuery({
    queryKey: ['preferredVendorsList'],
    queryFn: async () => {
      const res = await base44.entities.PreferredVendor.list('industry_key', 100);
      return res || [];
    }
  });

  const { data: matchRequests = [], isLoading: isLoadingMatchRequests } = useQuery({
    queryKey: ['vendorMatchRequests'],
    queryFn: async () => {
      const res = await base44.entities.VendorMatchRequest.list('-created_date', 50);
      return res || [];
    }
  });

  const { data: offerings = [], isLoading: isLoadingOfferings } = useQuery({
    queryKey: ['vendorOfferings'],
    queryFn: async () => {
      const res = await base44.entities.VendorOffering.list('sort_order', 100);
      return res || [];
    }
  });

  // Create Industry Mutation
  const createIndustryMutation = useMutation({
    mutationFn: async (data) => {
      return await base44.entities.VendorIndustry.create(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vendorIndustries'] });
      setShowAddIndustry(false);
      setNewIndustry({ key: '', label: '', consumer_blurb: '', sort_order: industries.length + 1, active: true });
      setAddIndustryError('');
    },
    onError: (err) => {
      setAddIndustryError(err.message || 'Error creating industry.');
    }
  });

  const handleCreateIndustry = (e) => {
    e.preventDefault();
    if (!newIndustry.key.trim() || !newIndustry.label.trim()) {
      setAddIndustryError('Key and Label are required.');
      return;
    }
    const cleanKey = newIndustry.key.trim().toLowerCase().replace(/\s+/g, '_');
    createIndustryMutation.mutate({
      ...newIndustry,
      key: cleanKey,
      sort_order: Number(newIndustry.sort_order) || 0
    });
  };

  const filteredNationals = industryFilter === 'all' 
    ? nationals 
    : nationals.filter(n => n.industry_key === industryFilter);

  const filteredOfferings = industryFilter === 'all'
    ? offerings
    : offerings.filter(o => o.industry_key === industryFilter);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto text-left select-none text-white">
      {/* Top Banner */}
      <div 
        className="p-4 sm:p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl"
        style={{
          background: 'linear-gradient(135deg, #18140c 0%, #0a0a0a 100%)',
          borderColor: 'rgba(212,175,55,0.4)',
        }}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-black border border-[#D4AF37] flex items-center justify-center shrink-0 shadow-md">
            <Wrench className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Preferred Vendors
              </h1>
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50">
                ADMIN STUB • STEP 1
              </span>
            </div>
            <p className="text-xs text-white/70 mt-0.5">
              Curated national providers (~2/industry) &amp; on-demand local trade match engine.
            </p>
          </div>
        </div>

        {/* 4 User Requested Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black border border-[#D4AF37] text-[#D4AF37] text-xs font-bold shadow-sm">
            <Lock className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span>Not subscribers</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black border border-amber-500/60 text-amber-400 text-xs font-bold shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Nationals curated</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black border border-sky-500/60 text-sky-400 text-xs font-bold shadow-sm">
            <Compass className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>Locals on demand</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black border border-red-500/60 text-red-400 text-xs font-bold shadow-sm">
            <Lock className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span>No blast</span>
          </div>
        </div>
      </div>

      {/* Product Lock Explanation Box */}
      <div 
        className="p-4 rounded-2xl border space-y-2 shadow-md"
        style={{
          background: '#0d0d0d',
          borderColor: 'rgba(212,175,55,0.3)',
        }}
      >
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
            PRODUCT LOCK ARCHITECTURE
          </span>
          <span className="text-[10px] text-white/50 font-mono">
            RESPA &amp; Fiduciary Guidelines
          </span>
        </div>
        <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
          Curated nationals (~2/industry), <strong className="text-[#D4AF37]">NOT subscribers</strong>; locals found on demand via guided questions and reviews/analytics. No massive static, out-of-date directories.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-white/10 pb-2 overflow-x-auto text-xs">
        {[
          { key: 'overview', label: 'Dashboard Overview' },
          { key: 'industries', label: `Industries (${industries.length})` },
          { key: 'nationals', label: `Preferred Nationals (~2/ind)` },
          { key: 'offerings', label: `Offerings Stub (${offerings.length})` },
          { key: 'guided_qa', label: 'Guided Q&A Preview' },
          { key: 'match_requests', label: `Match Requests (${matchRequests.length})` },
          { key: 'docs', label: 'Docs & How-To' },
        ].map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-[#D4AF37] text-black shadow-md'
                : 'text-white/70 hover:text-white bg-white/5 border border-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-[#0d0d0d] border border-white/10 space-y-1">
              <span className="text-[10px] uppercase font-bold text-white/50">Active Industries</span>
              <div className="text-2xl font-bold text-[#D4AF37]">{industries.filter(i => i.active).length}</div>
              <p className="text-[11px] text-white/60">Moving, staging, inspections, etc.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0d0d0d] border border-white/10 space-y-1">
              <span className="text-[10px] uppercase font-bold text-white/50">Curated Nationals</span>
              <div className="text-2xl font-bold text-white">{nationals.length}</div>
              <p className="text-[11px] text-white/60">&le; 2 per trade category</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0d0d0d] border border-white/10 space-y-1">
              <span className="text-[10px] uppercase font-bold text-white/50">Offerings Defined</span>
              <div className="text-2xl font-bold text-white">{offerings.length}</div>
              <p className="text-[11px] text-white/60">Examples for moving &amp; staging</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0d0d0d] border border-white/10 space-y-1">
              <span className="text-[10px] uppercase font-bold text-white/50">Match Requests Logged</span>
              <div className="text-2xl font-bold text-amber-300">{matchRequests.length}</div>
              <p className="text-[11px] text-white/60">On-demand consumer requests</p>
            </div>
          </div>

          {/* Quick How-To Strip */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37]">
              <BookOpen className="w-4 h-4" />
              <span>Operational Logic Summary</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-white/80">
              <div className="p-3 rounded-xl bg-[#14120b] border border-[#D4AF37]/30 space-y-1">
                <strong className="text-[#D4AF37] block font-semibold">Consumer Experience</strong>
                <p className="text-white/70 leading-relaxed">
                  Vendor Finder &gt; Choose Industry &gt; View Preferred Nationals &gt; Answer guided questions for local best fit. Locals change frequently; never freeze a 500-page static local directory.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#14120b] border border-[#D4AF37]/30 space-y-1">
                <strong className="text-[#D4AF37] block font-semibold">Admin Experience</strong>
                <p className="text-white/70 leading-relaxed">
                  Keep &le; 2 active nationals per industry. Import CSV for batch updates. Review inbound match requests. Never blast outreach to vendors without Bob Dyson explicit sign-off.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INDUSTRIES LIST + ADD */}
      {activeTab === 'industries' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-bold text-white">Vendor Industries</h2>
              <p className="text-xs text-white/60">Categories active for client roadmap milestones and vendor matching.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddIndustry(v => !v)}
              className="px-3.5 py-1.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs flex items-center gap-1.5 hover:bg-[#e8c84a] transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddIndustry ? 'Close Form' : 'Add Industry'}</span>
            </button>
          </div>

          {/* Add Industry Form Drawer */}
          {showAddIndustry && (
            <form onSubmit={handleCreateIndustry} className="p-4 rounded-2xl bg-[#14120b] border border-[#D4AF37]/40 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-bold text-[#D4AF37]">Add New Vendor Industry</span>
                <span className="text-[10px] text-white/40">Entity: VendorIndustry</span>
              </div>

              {addIndustryError && (
                <div className="text-xs text-red-400 bg-red-950/40 p-2 rounded-lg border border-red-500/30">
                  {addIndustryError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-white/60 text-[10px] uppercase font-bold mb-1">Key (slug)</label>
                  <input
                    type="text"
                    placeholder="e.g. solar_energy"
                    value={newIndustry.key}
                    onChange={(e) => setNewIndustry({ ...newIndustry, key: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-black border border-white/15 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-[10px] uppercase font-bold mb-1">Label (Display Name)</label>
                  <input
                    type="text"
                    placeholder="e.g. Solar Energy & Backup"
                    value={newIndustry.label}
                    onChange={(e) => setNewIndustry({ ...newIndustry, label: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-black border border-white/15 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-[10px] uppercase font-bold mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={newIndustry.sort_order}
                    onChange={(e) => setNewIndustry({ ...newIndustry, sort_order: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-xl bg-black border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/60 text-[10px] uppercase font-bold mb-1">Consumer Guidance Blurb</label>
                <textarea
                  rows={2}
                  placeholder="Explains to the consumer what to look for and how Dyson verifies this trade..."
                  value={newIndustry.consumer_blurb}
                  onChange={(e) => setNewIndustry({ ...newIndustry, consumer_blurb: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl bg-black border border-white/15 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#D4AF37] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddIndustry(false)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createIndustryMutation.isPending}
                  className="px-4 py-1.5 rounded-lg bg-[#D4AF37] text-black font-bold text-xs hover:bg-[#e8c84a]"
                >
                  {createIndustryMutation.isPending ? 'Saving...' : 'Save Industry'}
                </button>
              </div>
            </form>
          )}

          {/* Industries Table */}
          <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-white/60">
                  <th className="px-3 py-2 text-left font-bold w-12">#</th>
                  <th className="px-3 py-2 text-left font-bold">Label</th>
                  <th className="px-3 py-2 text-left font-bold">Key</th>
                  <th className="px-3 py-2 text-left font-bold">Consumer Blurb</th>
                  <th className="px-3 py-2 text-center font-bold w-20">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {industries.map((ind, i) => (
                  <tr key={ind.id || ind.key} className="hover:bg-white/5">
                    <td className="px-3 py-2.5 text-white/40 font-mono">{ind.sort_order || i + 1}</td>
                    <td className="px-3 py-2.5 font-bold text-white">{ind.label}</td>
                    <td className="px-3 py-2.5 text-[#D4AF37] font-mono">{ind.key}</td>
                    <td className="px-3 py-2.5 text-white/70 max-w-md">{ind.consumer_blurb || '—'}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ind.active !== false ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-white/10 text-white/40'
                      }`}>
                        {ind.active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PREFERRED NATIONALS (~2/INDUSTRY) */}
      {activeTab === 'nationals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-bold text-white">Preferred National Providers</h2>
              <p className="text-xs text-white/60">&le; 2 Curated Nationals per Industry (NOT subscribers). Empty or inactive TBD #1 / #2 placeholders.</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl bg-black border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-bold flex items-center gap-1.5 cursor-not-allowed opacity-80"
                title="Placeholder only — CSV import disabled in step 1 stub"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import CSV (Placeholder)</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden">
            <div className="p-3 border-b border-white/10 flex items-center justify-between text-xs text-white/60">
              <span>Curated National Partners (TBD #1 / #2 Model)</span>
              <span className="italic text-[11px]">Strict Cap: Max 2 Active per Industry</span>
            </div>

            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-white/60">
                  <th className="px-3 py-2 text-left font-bold">Industry</th>
                  <th className="px-3 py-2 text-left font-bold">Rank</th>
                  <th className="px-3 py-2 text-left font-bold">Provider Name</th>
                  <th className="px-3 py-2 text-left font-bold">Coverage</th>
                  <th className="px-3 py-2 text-left font-bold">Notes</th>
                  <th className="px-3 py-2 text-center font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {nationals.map(vendor => (
                  <tr key={vendor.id} className="hover:bg-white/5">
                    <td className="px-3 py-2.5 font-mono text-[#D4AF37] font-semibold">{vendor.industry_key}</td>
                    <td className="px-3 py-2.5">
                      <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold text-[10px]">
                        #{vendor.national_rank || '—'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-bold text-white">{vendor.name}</td>
                    <td className="px-3 py-2.5 text-white/70">{vendor.coverage || 'Nationwide'}</td>
                    <td className="px-3 py-2.5 text-white/60 max-w-sm truncate">{vendor.notes || '—'}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        vendor.active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {vendor.active ? 'Active' : 'Inactive / TBD'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: OFFERINGS BY INDUSTRY STUB TABLE */}
      {activeTab === 'offerings' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-[#14120b] border border-[#D4AF37]/30 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block">
              OFFERING SELECTION NOTE
            </span>
            <p className="text-xs text-white/80 leading-relaxed">
              Category opens to product / service / content choices, then Preferred nationals + local match. Seeded examples under moving and staging only.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden">
            <div className="p-3 border-b border-white/10 flex items-center justify-between text-xs text-white/60">
              <span>Catalog of Offerings by Industry</span>
              <span className="italic text-[11px] text-[#D4AF37]">Examples Labeled Under Moving &amp; Staging</span>
            </div>

            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-white/60">
                  <th className="px-3 py-2 text-left font-bold">Industry</th>
                  <th className="px-3 py-2 text-left font-bold">Title</th>
                  <th className="px-3 py-2 text-left font-bold">Kind</th>
                  <th className="px-3 py-2 text-left font-bold">Description</th>
                  <th className="px-3 py-2 text-left font-bold">Associated Provider</th>
                  <th className="px-3 py-2 text-center font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {offerings.map(offering => (
                  <tr key={offering.id} className="hover:bg-white/5">
                    <td className="px-3 py-2.5 font-mono text-[#D4AF37] font-semibold">{offering.industry_key}</td>
                    <td className="px-3 py-2.5 font-bold text-white flex items-center gap-1.5">
                      <span>{offering.title}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Example
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-white/70 uppercase text-[10px]">{offering.kind}</td>
                    <td className="px-3 py-2.5 text-white/70 max-w-md">{offering.short_description}</td>
                    <td className="px-3 py-2.5 text-white/60">{offering.preferred_vendor_name || '—'}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: GUIDED Q&A PREVIEW */}
      {activeTab === 'guided_qa' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-white">Guided Q&amp;A Preview (Read-Only Draft)</h2>
            <p className="text-xs text-white/60">Interactive questions used during relocation intake to dynamically filter on-demand local partners.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DRAFT_GUIDED_QUESTIONS.map(cat => (
              <div key={cat.industry} className="p-4 rounded-2xl bg-[#0d0d0d] border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#D4AF37]" />
                    <span className="font-bold text-sm text-white">{cat.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#D4AF37] uppercase">{cat.industry}</span>
                </div>

                <div className="space-y-2">
                  {cat.questions.map((q, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-black/60 border border-white/5 flex items-start gap-2.5 text-xs text-white/80">
                      <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center shrink-0 font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="leading-snug">{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: MATCH REQUESTS LOG */}
      {activeTab === 'match_requests' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-white">Vendor Match Requests</h2>
            <p className="text-xs text-white/60">Log of incoming client and agent requests for local vendor allocation.</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden">
            <div className="p-3 border-b border-white/10 flex items-center justify-between text-xs text-white/60">
              <span>Request Queue</span>
              <span>Entity: VendorMatchRequest</span>
            </div>

            {matchRequests.length === 0 ? (
              <div className="p-8 text-center text-white/50 space-y-2">
                <Compass className="w-8 h-8 mx-auto text-[#D4AF37]/50" />
                <p className="text-sm font-medium">Match requests empty log.</p>
                <p className="text-xs text-white/40">
                  Client responses to guided questions will populate here for concierge review.
                </p>
              </div>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-white/60">
                    <th className="px-3 py-2 text-left font-bold">Requester</th>
                    <th className="px-3 py-2 text-left font-bold">Industry</th>
                    <th className="px-3 py-2 text-left font-bold">Location</th>
                    <th className="px-3 py-2 text-left font-bold">Status</th>
                    <th className="px-3 py-2 text-left font-bold">Result Summary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {matchRequests.map(r => (
                    <tr key={r.id}>
                      <td className="px-3 py-2.5 text-white font-semibold">{r.requester_email || 'Anonymous'}</td>
                      <td className="px-3 py-2.5 font-mono text-[#D4AF37]">{r.industry_key}</td>
                      <td className="px-3 py-2.5 text-white/70">{r.city} {r.zip ? `(${r.zip})` : ''}</td>
                      <td className="px-3 py-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white">
                          {r.status || 'new'}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-white/70">{r.result_summary || 'Pending review'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* TAB 7: DOCS (CONSUMER / ADMIN HOW-TO) */}
      {activeTab === 'docs' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-white">Vendor System Documentation &amp; How-To</h2>
            <p className="text-xs text-white/60">Official operational rules governing the Preferred Vendors architecture.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Consumer Docs */}
            <div className="p-5 rounded-2xl bg-[#0d0d0d] border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#D4AF37] border-b border-white/10 pb-2">
                <Compass className="w-4 h-4 text-[#D4AF37]" />
                <span>Consumer How-To</span>
              </div>
              <div className="text-xs text-white/80 space-y-2 leading-relaxed">
                <p>
                  <strong>1. Navigation Flow:</strong> The consumer opens Vendor Finder &gt; selects a trade industry &gt; reviews the vetted Preferred Nationals.
                </p>
                <p>
                  <strong>2. On-Demand Local Match:</strong> Rather than forcing the client to sift through hundreds of unverified local ads, they answer 3-4 quick triage questions.
                </p>
                <p>
                  <strong>3. Adaptive Real-Time Matching:</strong> Local service providers change constantly; our fiduciary desk sources the best local fit in real time instead of maintaining a huge frozen, outdated local directory.
                </p>
              </div>
            </div>

            {/* Admin Docs */}
            <div className="p-5 rounded-2xl bg-[#0d0d0d] border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#D4AF37] border-b border-white/10 pb-2">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>Admin How-To</span>
              </div>
              <div className="text-xs text-white/80 space-y-2 leading-relaxed">
                <p>
                  <strong>1. Provider Caps:</strong> Maintain strict cap of &le; 2 active curated national partners per industry.
                </p>
                <p>
                  <strong>2. Batch Ingest:</strong> Use CSV import utility to update vetted national data and rankings.
                </p>
                <p>
                  <strong>3. Triage Reviews:</strong> Actively review incoming match requests from clients and relocation agents.
                </p>
                <p>
                  <strong>4. Strict Governance:</strong> Never blast mass communication or automated email/SMS campaigns to vendors without explicit sign-off from Bob Dyson.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}