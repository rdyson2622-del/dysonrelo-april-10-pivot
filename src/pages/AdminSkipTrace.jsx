import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Phone, Mail, MapPin, User, Loader2, CheckCircle2, AlertCircle, Copy } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';

export default function AdminSkipTrace() {
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!street.trim() || !city.trim() || !state.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);

    const res = await base44.functions.invoke('skipTraceByAddress', {
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      zip: zip.trim(),
    });

    setLoading(false);
    if (res.data?.error) {
      setError(res.data.error);
    } else {
      setResult(res.data);
    }
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen p-6" style={{ background: '#808080' }}>
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-xs font-bold tracking-[0.3em] mb-1" style={{ color: GOLD }}>ADMIN TOOL</p>
          <h1 className="text-3xl font-bold mb-1" style={{ color: '#fff' }}>Skip Trace Lookup</h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Enter a property address to find the owner's name and contact info via BatchData.
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-6 mb-6"
          style={{ background: '#000', border: `1px solid rgba(212,175,55,0.25)` }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold tracking-widest mb-1.5" style={{ color: GOLD }}>STREET ADDRESS *</label>
              <input
                value={street}
                onChange={e => setStreet(e.target.value)}
                placeholder="e.g. 123 Main St"
                className="w-full rounded-xl px-4 py-3 text-sm"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-xs font-bold tracking-widest mb-1.5" style={{ color: GOLD }}>CITY *</label>
                <input
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Austin"
                  className="w-full rounded-xl px-4 py-3 text-sm"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest mb-1.5" style={{ color: GOLD }}>STATE *</label>
                <input
                  value={state}
                  onChange={e => setState(e.target.value)}
                  placeholder="TX"
                  maxLength={2}
                  className="w-full rounded-xl px-4 py-3 text-sm uppercase"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest mb-1.5" style={{ color: GOLD }}>ZIP</label>
                <input
                  value={zip}
                  onChange={e => setZip(e.target.value)}
                  placeholder="78701"
                  className="w-full rounded-xl px-4 py-3 text-sm"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
                />
              </div>
            </div>

            <button
              onClick={handleSearch}
              disabled={loading || !street.trim() || !city.trim() || !state.trim()}
              className="w-full py-3 rounded-xl text-sm font-bold tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37, #b8920a)', color: '#000' }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? 'Looking Up Owner...' : 'Find Owner Info'}
            </button>
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="rounded-2xl p-5 mb-6 flex items-start gap-3"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#EF4444' }} />
            <div>
              <p className="font-bold text-sm mb-1" style={{ color: '#EF4444' }}>Lookup Failed</p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{error}</p>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {result && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-6"
            style={{ background: '#000', border: `1px solid ${GOLD}` }}>
            <div className="flex items-center gap-2 mb-5">
              <CheckCircle2 className="w-5 h-5" style={{ color: '#22C55E' }} />
              <p className="font-bold text-sm tracking-widest" style={{ color: '#22C55E' }}>OWNER FOUND</p>
            </div>

            {/* Property */}
            <div className="flex items-start gap-3 mb-4 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: GOLD }} />
              <div>
                <p className="text-xs font-bold tracking-widest mb-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>PROPERTY</p>
                <p className="text-sm" style={{ color: '#fff' }}>{result.property_address}</p>
              </div>
            </div>

            {/* Owner Name */}
            <div className="flex items-start gap-3 mb-4 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <User className="w-4 h-4 mt-0.5 shrink-0" style={{ color: GOLD }} />
              <div>
                <p className="text-xs font-bold tracking-widest mb-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>OWNER NAME</p>
                <p className="text-lg font-bold" style={{ color: '#fff' }}>{result.owner_name || '—'}</p>
              </div>
            </div>

            {/* Phone Numbers */}
            <div className="flex items-start gap-3 mb-4 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <Phone className="w-4 h-4 mt-0.5 shrink-0" style={{ color: GOLD }} />
              <div className="flex-1">
                <p className="text-xs font-bold tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>PHONE NUMBERS</p>
                {result.phones?.length > 0 ? result.phones.map((p, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 mb-1.5">
                    <div>
                      <span className="text-sm font-semibold" style={{ color: '#fff' }}>{p.number || p}</span>
                      {p.type && <span className="ml-2 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>({p.type})</span>}
                    </div>
                    <button onClick={() => copy(p.number || p)} className="p-1 rounded hover:opacity-70">
                      <Copy className="w-3.5 h-3.5" style={{ color: GOLD }} />
                    </button>
                  </div>
                )) : <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>No phone numbers found</p>}
              </div>
            </div>

            {/* Email Addresses */}
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 mt-0.5 shrink-0" style={{ color: GOLD }} />
              <div className="flex-1">
                <p className="text-xs font-bold tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>EMAIL ADDRESSES</p>
                {result.emails?.length > 0 ? result.emails.map((e, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-sm" style={{ color: '#fff' }}>{e.email || e.address || e}</span>
                    <button onClick={() => copy(e.email || e.address || e)} className="p-1 rounded hover:opacity-70">
                      <Copy className="w-3.5 h-3.5" style={{ color: GOLD }} />
                    </button>
                  </div>
                )) : <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>No email addresses found</p>}
              </div>
            </div>

            {/* Save to Owners DB button */}
            {result.saved_to_db ? (
              <div className="mt-5 pt-4 text-center text-sm font-semibold" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', color: '#22C55E' }}>
                ✓ Saved to Listing Owners database
              </div>
            ) : (
              <SaveOwnerButton result={result} onSaved={() => setResult(r => ({ ...r, saved_to_db: true }))} />
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function SaveOwnerButton({ result, onSaved }) {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const primaryPhone = result.phones?.[0]?.number || result.phones?.[0] || '';
    const primaryEmail = result.emails?.[0]?.email || result.emails?.[0]?.address || result.emails?.[0] || '';
    await base44.entities.ListingOwner.create({
      owner_name: result.owner_name || 'Unknown Owner',
      phone: primaryPhone,
      email: primaryEmail,
      property_address: result.property_address,
      property_city: result.city,
      property_state: result.state,
      contact_status: 'not_contacted',
      notes: `Skip traced via BatchData on ${new Date().toLocaleDateString()}. ${result.phones?.length || 0} phone(s), ${result.emails?.length || 0} email(s) found.`,
    });
    setSaving(false);
    onSaved();
  };

  return (
    <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all disabled:opacity-40"
        style={{ background: 'rgba(212,175,55,0.15)', color: GOLD, border: `1px solid ${GOLD}` }}
      >
        {saving ? 'Saving...' : '+ Save to Listing Owners Database'}
      </button>
    </div>
  );
}