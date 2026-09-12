import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Wrench, ShieldCheck, CheckCircle2, Trophy, Phone, 
  Send, Sparkles, X, ArrowLeft, ArrowRight
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import VendorSearchHeader from '@/components/vendorFinder/VendorSearchHeader';
import IndustrySelector from '@/components/vendorFinder/IndustrySelector';
import OfferingChoices from '@/components/vendorFinder/OfferingChoices';
import PreferredNationalsSection from '@/components/vendorFinder/PreferredNationalsSection';
import LocalGuidedQaStub from '@/components/vendorFinder/LocalGuidedQaStub';
import TopFiveRecommendationsPanel from '@/components/vendorFinder/TopFiveRecommendationsPanel';

const GOLD = '#D4AF37';

export default function SubscriberVendorFinder() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('moving');
  const [selectedOfferings, setSelectedOfferings] = useState([]);
  const [localMatchDispatched, setLocalMatchDispatched] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteForm, setQuoteForm] = useState({ name: '', phone: '', notes: '' });
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  // Queries
  const { data: industries = [], isLoading: isLoadingIndustries } = useQuery({
    queryKey: ['vendorFinderIndustries'],
    queryFn: async () => {
      const res = await base44.entities.VendorIndustry.list('sort_order', 50);
      return res || [];
    },
  });

  const { data: allNationals = [], isLoading: isLoadingNationals } = useQuery({
    queryKey: ['vendorFinderNationals'],
    queryFn: async () => {
      const res = await base44.entities.PreferredVendor.list('industry_key', 100);
      return res || [];
    },
  });

  const { data: allOfferings = [], isLoading: isLoadingOfferings } = useQuery({
    queryKey: ['vendorFinderOfferings'],
    queryFn: async () => {
      const res = await base44.entities.VendorOffering.list('sort_order', 100);
      return res || [];
    },
  });

  // Filter nationals and offerings for active industry
  const activeNationals = allNationals.filter(
    (n) => n.industry_key === selectedIndustry && n.active !== false
  );

  const activeOfferings = allOfferings.filter(
    (o) => o.industry_key === selectedIndustry && o.active !== false
  );

  const currentIndustryObj = industries.find((i) => i.key === selectedIndustry) || {
    key: selectedIndustry,
    label: selectedIndustry.replace('_', ' ').toUpperCase(),
  };

  // Keyword match auto-selector: if user searches for trade keywords, switch to relevant industry
  useEffect(() => {
    if (!searchQuery) return;
    const q = searchQuery.toLowerCase();
    const matched = industries.find(
      (ind) => ind.label.toLowerCase().includes(q) || ind.key.toLowerCase().includes(q)
    );
    if (matched && matched.key !== selectedIndustry) {
      setSelectedIndustry(matched.key);
      setSelectedOfferings([]);
    }
  }, [searchQuery, industries, selectedIndustry]);

  const handleToggleOffering = (offeringKey) => {
    if (selectedOfferings.includes(offeringKey)) {
      setSelectedOfferings(selectedOfferings.filter((k) => k !== offeringKey));
    } else {
      setSelectedOfferings([...selectedOfferings, offeringKey]);
    }
  };

  const handleSelectIndustry = (indKey) => {
    setSelectedIndustry(indKey);
    setSelectedOfferings([]);
    setLocalMatchDispatched(false);
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    try {
      await base44.entities.VendorMatchRequest.create({
        requester_email: user?.email || 'subscriber@dysonrelo.com',
        industry_key: selectedIndustry,
        city: 'Destination Market',
        zip: 'Client File',
        answers_json: JSON.stringify({
          contact_name: quoteForm.name,
          phone: quoteForm.phone,
          notes: quoteForm.notes,
          selected_offerings: selectedOfferings,
          industry: currentIndustryObj.label,
        }),
        status: 'new',
        created_at: new Date().toISOString(),
      });
      setQuoteSuccess(true);
      setTimeout(() => {
        setIsQuoteModalOpen(false);
        setQuoteSuccess(false);
      }, 2500);
    } catch (err) {
      console.error('Failed to submit quote request:', err);
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto space-y-7 text-left select-none">
      
      {/* 1. SEARCH-FIRST HEADER */}
      <VendorSearchHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedIndustry={selectedIndustry}
        onSelectIndustry={handleSelectIndustry}
      />

      {/* ADMIN OVERLAY LINK (IF ADMIN LOGGED IN) */}
      {user?.role === 'admin' && (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-black/80 border border-[#D4AF37]/30 text-xs">
          <div className="flex items-center gap-2 text-white/80">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            <span>Admin Mode: Reviewing Subscriber-Facing Vendor Finder</span>
          </div>
          <Link
            to="/admin/preferred-vendors"
            className="text-[#D4AF37] hover:underline font-bold flex items-center gap-1"
          >
            <span>Admin Master Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 2. INDUSTRY SELECTOR CHIPS */}
      <div 
        className="p-5 sm:p-6 rounded-3xl border shadow-xl space-y-4"
        style={{
          background: '#0d0d0d',
          borderColor: 'rgba(212,175,55,0.3)',
        }}
      >
        <IndustrySelector
          industries={industries}
          selectedIndustry={selectedIndustry}
          onSelectIndustry={handleSelectIndustry}
          searchQuery={searchQuery}
        />
      </div>

      {/* 3. VENDOR OFFERING CHOICES */}
      <div 
        className="p-5 sm:p-6 rounded-3xl border shadow-xl space-y-4"
        style={{
          background: '#0d0d0d',
          borderColor: 'rgba(212,175,55,0.3)',
        }}
      >
        <OfferingChoices
          offerings={activeOfferings}
          selectedOfferings={selectedOfferings}
          onToggleOffering={handleToggleOffering}
          selectedIndustryLabel={currentIndustryObj.label}
        />
      </div>

      {/* 4. PREFERRED NATIONALS + OPTIONAL LOCAL GUIDED Q&A STUB */}
      <div className="space-y-5">
        {/* Curated Nationals */}
        <div 
          className="p-5 sm:p-6 rounded-3xl border shadow-xl space-y-4"
          style={{
            background: '#0d0d0d',
            borderColor: 'rgba(212,175,55,0.3)',
          }}
        >
          <PreferredNationalsSection
            nationals={activeNationals}
            selectedIndustryLabel={currentIndustryObj.label}
          />
        </div>

        {/* Optional Local Guided Q&A Stub */}
        <LocalGuidedQaStub
          selectedIndustry={selectedIndustry}
          selectedIndustryLabel={currentIndustryObj.label}
          onMatchSuccess={(res) => setLocalMatchDispatched(true)}
        />
      </div>

      {/* 5. TOP 5 RECOMMENDATIONS PANEL (NOT A GIANT CARD WALL) */}
      <TopFiveRecommendationsPanel
        selectedIndustry={selectedIndustry}
        selectedIndustryLabel={currentIndustryObj.label}
        nationals={activeNationals}
        selectedOfferings={selectedOfferings}
        offerings={activeOfferings}
        localMatchDispatched={localMatchDispatched}
        onLaunchLocalTriage={() => {
          window.scrollTo({ top: 600, behavior: 'smooth' });
        }}
        onOpenConnectModal={() => setIsQuoteModalOpen(true)}
      />

      {/* QUOTE / CONNECT MODAL */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-[#0a0a0a] border-2 border-[#D4AF37] p-6 shadow-2xl text-left space-y-4">
            <div className="flex items-start justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                  Fiduciary Quote Request
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Request Custom Scope &amp; Cap Quote
                </h3>
                <p className="text-xs text-white/60">
                  {currentIndustryObj.label} • Dyson Guaranteed Pricing Caps
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsQuoteModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {quoteSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 mx-auto" />
                <p>Quote request submitted successfully to our fiduciary desk.</p>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={quoteForm.name}
                    onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                    placeholder="e.g. John Doe"
                    className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block mb-1">
                    Direct Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={quoteForm.phone}
                    onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                    placeholder="(555) 000-0000"
                    className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block mb-1">
                    Move Details &amp; Notes
                  </label>
                  <textarea
                    rows={3}
                    value={quoteForm.notes}
                    onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                    placeholder="Specify dates, origin/destination cities, or special needs..."
                    className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white focus:outline-none focus:border-[#D4AF37] resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsQuoteModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#D4AF37] text-black font-black hover:brightness-110 cursor-pointer shadow-md"
                  >
                    Submit Fiduciary Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}