import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Sliders, RotateCcw, Save, X } from 'lucide-react';

const GOLD = '#D4AF37';

const DEFAULTS = {
  presenterWidth: 15,
  presenterHeight: 50,
  charlieX: 0,
  charlieY: 100,
  bobX: 100,
  bobY: 100,
  pillY: 93,
  pillWidth: 14,
  showText: '',
  showTextX: 50,
  showTextY: 8,
  showTextSize: 3,
};

const CONTROLS = [
  { key: 'presenterWidth', label: 'Presenter Scale W', min: 5, max: 40, step: 1, unit: '%', group: 'Presenters' },
  { key: 'presenterHeight', label: 'Presenter Scale H', min: 10, max: 80, step: 1, unit: '%', group: 'Presenters' },
  { key: 'charlieX', label: 'Charlie X', min: 0, max: 100, step: 1, unit: '%', group: 'Charlie' },
  { key: 'charlieY', label: 'Charlie Y', min: 0, max: 100, step: 1, unit: '%', group: 'Charlie' },
  { key: 'bobX', label: 'Bob X', min: 0, max: 100, step: 1, unit: '%', group: 'Bob' },
  { key: 'bobY', label: 'Bob Y', min: 0, max: 100, step: 1, unit: '%', group: 'Bob' },
  { key: 'pillY', label: 'News Pills Y', min: 50, max: 100, step: 1, unit: '%', group: 'News Pills' },
  { key: 'pillWidth', label: 'News Pill Width', min: 5, max: 30, step: 1, unit: '%', group: 'News Pills' },
  { key: 'showTextX', label: 'Show Text X', min: 0, max: 100, step: 1, unit: '%', group: 'Show Text' },
  { key: 'showTextY', label: 'Show Text Y', min: 0, max: 100, step: 1, unit: '%', group: 'Show Text' },
  { key: 'showTextSize', label: 'Show Text Size', min: 1, max: 10, step: 0.5, unit: 'vmin', group: 'Show Text' },
];

export default function VisualLayoutController({ show, onClose }) {
  const [config, setConfig] = useState({ ...DEFAULTS, ...(show.layoutConfig || {}) });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setConfig({ ...DEFAULTS, ...(show.layoutConfig || {}) });
  }, [show.id]);

  const handleChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.entities.DnnBroadcast.update(show.id, { layoutConfig: config });
      setSaved(true);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const handleReset = () => {
    setConfig(DEFAULTS);
    setSaved(false);
  };

  const groups = [...new Set(CONTROLS.map(c => c.group))];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.8)' }}>
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{ background: '#1a1a1a', border: `1px solid rgba(212,175,55,0.3)` }}>
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-5 py-4 z-10"
          style={{ background: '#1a1a1a', borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5" style={{ color: GOLD }} />
            <div>
              <p className="text-sm font-black tracking-widest uppercase" style={{ color: GOLD }}>Visual Layout Controller</p>
              <p className="text-[10px] text-slate-500">{show.show_name} · {show.broadcast_date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleReset} disabled={saving}
              className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg text-white transition-opacity disabled:opacity-50"
              style={{ background: '#333', border: '1px solid rgba(255,255,255,0.1)' }}>
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg text-black transition-opacity disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37)' }}>
              {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Layout'}
              {!saving && <Save className="w-3 h-3" />}
            </button>
            <button onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white"
              style={{ background: '#333' }}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="px-5 py-4 space-y-5">
          {/* Show text input */}
          <div>
            <label className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-1.5 block">Show Title Text (optional overlay)</label>
            <input
              type="text"
              value={config.showText || ''}
              onChange={(e) => handleChange('showText', e.target.value)}
              placeholder="e.g. DNN MARKET BRIEF"
              className="w-full px-3 py-2 rounded-lg text-sm text-white"
              style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>

          {groups.map(group => (
            <div key={group}>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: GOLD }}>{group}</p>
              <div className="space-y-3">
                {CONTROLS.filter(c => c.group === group).map(ctrl => (
                  <div key={ctrl.key}>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-medium text-slate-300">{ctrl.label}</label>
                      <span className="text-[11px] font-bold tabular-nums" style={{ color: GOLD }}>
                        {config[ctrl.key]}{ctrl.unit}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={ctrl.min}
                      max={ctrl.max}
                      step={ctrl.step}
                      value={config[ctrl.key]}
                      onChange={(e) => handleChange(ctrl.key, parseFloat(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: '#333',
                        outline: 'none',
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="px-5 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: '#111' }}>
          <p className="text-[10px] text-slate-500">
            Saved layout values are sent to the Creatomate render API on the next composite. Use "Start Stitching" to re-render with updated positions.
          </p>
        </div>
      </div>
    </div>
  );
}