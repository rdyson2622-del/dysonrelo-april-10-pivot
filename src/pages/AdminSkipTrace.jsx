import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Copy } from 'lucide-react';

const GOLD = '#D4AF37';

export default function AdminSkipTrace() {
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const handleOpenBatchData = () => {
    window.open('https://app.batchdata.com', '_blank');
  };

  const fullAddress = [street, city, state].filter(Boolean).join(', ');

  return (
    <div className="min-h-screen p-6" style={{ background: '#808080' }}>
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-xs font-bold tracking-[0.3em] mb-1" style={{ color: GOLD }}>ADMIN TOOL</p>
          <h1 className="text-3xl font-bold mb-1" style={{ color: '#fff' }}>Skip Trace Lookup</h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Build your address below, then open BatchData to run the skip trace manually.
          </p>
        </motion.div>

        {/* Address Builder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-6 mb-6"
          style={{ background: '#000', border: `1px solid rgba(212,175,55,0.25)` }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold tracking-widest mb-1.5" style={{ color: GOLD }}>STREET ADDRESS</label>
              <input
                value={street}
                onChange={e => setStreet(e.target.value)}
                placeholder="e.g. 123 Main St"
                className="w-full rounded-xl px-4 py-3 text-sm"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold tracking-widest mb-1.5" style={{ color: GOLD }}>CITY</label>
                <input
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Austin"
                  className="w-full rounded-xl px-4 py-3 text-sm"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest mb-1.5" style={{ color: GOLD }}>STATE</label>
                <input
                  value={state}
                  onChange={e => setState(e.target.value)}
                  placeholder="TX"
                  maxLength={2}
                  className="w-full rounded-xl px-4 py-3 text-sm uppercase"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
                />
              </div>
            </div>

            {/* Address Preview */}
            {fullAddress && (
              <div className="rounded-xl px-4 py-3 flex items-center justify-between gap-3"
                style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 shrink-0" style={{ color: GOLD }} />
                  <span className="text-sm font-semibold" style={{ color: '#fff' }}>{fullAddress}</span>
                </div>
                <button onClick={() => { navigator.clipboard.writeText(fullAddress); }}
                  className="p-1 rounded hover:opacity-70 shrink-0">
                  <Copy className="w-3.5 h-3.5" style={{ color: GOLD }} />
                </button>
              </div>
            )}

            <button
              onClick={handleOpenBatchData}
              className="w-full py-3 rounded-xl text-sm font-bold tracking-widest flex items-center justify-center gap-2 transition-all"
              style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37, #b8920a)', color: '#000' }}
            >
              <Search className="w-4 h-4" />
              Open BatchData — Run Skip Trace
            </button>
            <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Opens app.batchdata.com in a new tab — copy the address above and paste it there.
            </p>
          </div>
        </motion.div>

        {/* Instructions Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-6"
          style={{ background: '#000', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <p className="text-xs font-bold tracking-widest mb-4" style={{ color: GOLD }}>HOW TO RUN A SKIP TRACE</p>
          {[
            'Enter the property address above and copy it',
            'Click "Open BatchData" to go to your account',
            'Paste the address into BatchData\'s Skip Trace tool',
            'Copy the owner name, phone & email back here',
            'Add them to the Listing Owners database manually',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3 mb-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                style={{ background: 'rgba(212,175,55,0.2)', color: GOLD }}>
                {i + 1}
              </div>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{step}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}