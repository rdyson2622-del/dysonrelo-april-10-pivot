import React, { useState } from 'react';
import { HelpCircle, Send, CheckCircle2, AlertCircle, Compass, Sparkles, MapPin, Calendar } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const INDUSTRY_QUESTIONS = {
  moving: [
    { id: 'origin_dest', label: 'Origin City/ZIP & Destination City/ZIP', placeholder: 'e.g. San Jose, CA 95125 → Scottsdale, AZ 85255' },
    { id: 'timing', label: 'Estimated Move Date & Flexibility', placeholder: 'e.g. November 15, 2026 (+/- 3 days)' },
    { id: 'size', label: 'Residence Size & Specialty Items', placeholder: 'e.g. 4-bedroom single family, grand piano, wine collection' },
  ],
  staging: [
    { id: 'status', label: 'Property Status & Architecture', placeholder: 'e.g. Vacant modern contemporary, 3,800 sq ft' },
    { id: 'target_price', label: 'Target Listing Price & Photography Date', placeholder: 'e.g. $2.85M, MLS photography in 10 days' },
    { id: 'rooms', label: 'Key Rooms to Stage', placeholder: 'e.g. Foyer, great room, primary suite, outdoor terrace' },
  ],
  home_inspection: [
    { id: 'prop_details', label: 'Property Age, Sq Ft & Foundation', placeholder: 'e.g. 1978 build, 3,200 sq ft, raised foundation' },
    { id: 'special_scopes', label: 'Ancillary Scopes Needed', placeholder: 'e.g. Sewer lateral camera, pool/spa, roof infrared' },
    { id: 'deadline', label: 'Contingency Period Expiration', placeholder: 'e.g. 7 days from contract acceptance' },
  ],
  cleaning: [
    { id: 'service_type', label: 'Service Type & Timing', placeholder: 'e.g. Move-out deep turnover cleaning, day after movers load' },
    { id: 'specs', label: 'Specialty Cleaning Items', placeholder: 'e.g. Sub-Zero interior, interior windows, steam carpet extraction' },
  ],
  default: [
    { id: 'destination', label: 'Destination City & ZIP Code', placeholder: 'e.g. San Diego, CA 92037' },
    { id: 'timing', label: 'Target Service Date', placeholder: 'e.g. Within next 2-3 weeks' },
    { id: 'scope', label: 'Specific Project Requirements', placeholder: 'e.g. Describe your specific project needs' },
  ],
};

export default function LocalGuidedQaStub({
  selectedIndustry,
  selectedIndustryLabel = '',
  onMatchSuccess,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [answers, setAnswers] = useState({});
  const [requesterEmail, setRequesterEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);
  const [error, setError] = useState(null);

  const questions = INDUSTRY_QUESTIONS[selectedIndustry] || INDUSTRY_QUESTIONS.default;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const user = await base44.auth.me().catch(() => null);
      const email = requesterEmail || user?.email || 'subscriber@dysonrelo.com';

      const payload = {
        requester_email: email,
        industry_key: selectedIndustry,
        city: city || 'San Diego',
        zip: zip || '92037',
        answers_json: JSON.stringify({
          city,
          zip,
          answers,
          industry_label: selectedIndustryLabel,
        }),
        status: 'new',
        created_at: new Date().toISOString(),
      };

      const res = await base44.entities.VendorMatchRequest.create(payload);
      setSubmittedRequest(res);
      onMatchSuccess?.(res);
    } catch (err) {
      console.error('Failed to submit local match request:', err);
      setError(err.message || 'Failed to submit match request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-[#D4AF37]/40 bg-[#0d0d0d] p-5 sm:p-6 text-left shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
              ON-DEMAND LOCAL DISPATCH
            </span>
            <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
              Adaptive Real-Time Triage
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white mt-1">
            Need Vetted Local Providers in Your Destination Market?
          </h3>
          <p className="text-xs text-white/70 mt-0.5 max-w-xl">
            Locals change frequently; our fiduciary desk allocates the highest-rated verified local providers on demand rather than maintaining a frozen, stale 500-page directory.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 self-start sm:self-center border border-[#D4AF37] text-black bg-[#D4AF37] hover:brightness-110 shadow-md"
        >
          {isOpen ? 'Close Local Q&A' : 'Launch Local Triage Q&A →'}
        </button>
      </div>

      {/* CONFIRMATION BANNER */}
      {submittedRequest && (
        <div className="p-4 rounded-2xl bg-[#10b981]/15 border-2 border-[#10b981] text-left space-y-1 animate-in zoom-in-95 duration-200 shadow-xl">
          <div className="flex items-center gap-2 text-[#10b981] font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Local Match Request Dispatched (Ref #{submittedRequest.id.slice(-6).toUpperCase()})</span>
          </div>
          <p className="text-xs text-white/80">
            Our relocation desk is matching vetted providers in <strong>{submittedRequest.city} ({submittedRequest.zip})</strong> for {selectedIndustryLabel}. An advisor will coordinate direct options within 4 business hours.
          </p>
        </div>
      )}

      {/* GUIDED Q&A FORM ACCORDION */}
      {isOpen && !submittedRequest && (
        <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block mb-1">
                Destination City *
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. San Diego, Coronado, La Jolla"
                className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block mb-1">
                Destination ZIP Code *
              </label>
              <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="e.g. 92037"
                className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>
          </div>

          {/* DYNAMIC INDUSTRY QUESTIONS */}
          <div className="space-y-3 pt-1 border-t border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">
              Triage Scope Questions:
            </span>

            {questions.map((q) => (
              <div key={q.id}>
                <label className="text-[11px] font-semibold text-white/90 block mb-1">
                  {q.label}
                </label>
                <input
                  type="text"
                  value={answers[q.id] || ''}
                  onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                  placeholder={q.placeholder}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] block mb-1">
                Your Email for Local Match Updates
              </label>
              <input
                type="email"
                value={requesterEmail}
                onChange={(e) => setRequesterEmail(e.target.value)}
                placeholder="subscriber@example.com"
                className="w-full px-3 py-2 rounded-xl bg-black border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-[#D4AF37] text-black font-black text-xs hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Transmitting Triage...' : 'Dispatch Local Match Request'}</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}