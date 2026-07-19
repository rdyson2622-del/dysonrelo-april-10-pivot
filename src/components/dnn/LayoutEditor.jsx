import React, { useState, useRef, useCallback, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Save, RotateCcw, Download, Move, Eye } from 'lucide-react';

const GOLD = '#D4AF37';
const STUDIO_BG = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/5f493d29d_generated_image.png';
const MASTER_LAYOUT_ID = '6a5bc2a88cc89dc9b84ec199';

// Default positions — percentages of canvas (x=left, y=top, w=width, h=height)
const DEFAULT_BOB = { x: 4, y: 35, w: 22, h: 60, label: 'Bob', sub: 'Transparent · Lower Left' };
// Wall map billboard — positioned over the back-wall US map screen as a laid-in display
const DEFAULT_PANEL = { x: 27, y: 12, w: 46, h: 33 };
// Wall map zone guide — the visible screen area on the back wall (for reference only)
const WALL_MAP_ZONE = { x: 24, y: 9, w: 52, h: 38 };
const DEFAULT_PILLS = [
  { x: 15, y: 78, w: 14, h: 6, label: 'NEWS', sub: "Today's Clips" },
  { x: 43, y: 78, w: 14, h: 6, label: 'RELOCATION', sub: 'Free Access' },
  { x: 71, y: 78, w: 14, h: 6, label: 'INTELLIGENCE', sub: 'Tell Your Story' },
];

const DEFAULT_STATE = {
  bob: DEFAULT_BOB,
  panel: DEFAULT_PANEL,
  pills: DEFAULT_PILLS,
};

export default function LayoutEditor() {
  const canvasRef = useRef(null);
  const [layout, setLayout] = useState(DEFAULT_STATE);
  const [selected, setSelected] = useState('bob'); // 'bob' | 'panel' | 'pill-0' | 'pill-1' | 'pill-2'
  const [dragging, setDragging] = useState(null); // { type, offset }
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // Load saved coordinates from LayoutTemplate
  useEffect(() => {
    base44.entities.LayoutTemplate.filter({ id: MASTER_LAYOUT_ID }).then(arr => {
      const t = arr?.[0];
      if (t?.layout_coordinates) {
        setLayout({ ...DEFAULT_STATE, ...t.layout_coordinates });
      }
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);

  // Drag logic
  const handleMouseDown = useCallback((e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setSelected(type);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    const item = type === 'bob' ? layout.bob : type === 'panel' ? layout.panel : layout.pills[parseInt(type.split('-')[1])];
    setDragging({ type, offsetX: px - item.x, offsetY: py - item.y });
  }, [layout]);

  const handleMouseMove = useCallback((e) => {
    if (!dragging) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    const newX = Math.max(0, Math.min(100 - 2, px - dragging.offsetX));
    const newY = Math.max(0, Math.min(100 - 2, py - dragging.offsetY));
    setLayout(prev => {
      if (dragging.type === 'bob') return { ...prev, bob: { ...prev.bob, x: newX, y: newY } };
      if (dragging.type === 'panel') return { ...prev, panel: { ...prev.panel, x: newX, y: newY } };
      const idx = parseInt(dragging.type.split('-')[1]);
      const pills = [...prev.pills];
      pills[idx] = { ...pills[idx], x: newX, y: newY };
      return { ...prev, pills };
    });
  }, [dragging]);

  const handleMouseUp = useCallback(() => setDragging(null), []);

  const handleSlider = (type, field, val) => {
    setLayout(prev => {
      if (type === 'bob') return { ...prev, bob: { ...prev.bob, [field]: val } };
      if (type === 'panel') return { ...prev, panel: { ...prev.panel, [field]: val } };
      const idx = parseInt(type.split('-')[1]);
      const pills = [...prev.pills];
      pills[idx] = { ...pills[idx], [field]: val };
      return { ...prev, pills };
    });
  };

  const handleReset = () => setLayout(DEFAULT_STATE);

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg(null);
    try {
      await base44.entities.LayoutTemplate.update(MASTER_LAYOUT_ID, {
        layout_coordinates: layout,
      });
      setSaveMsg({ success: true, msg: 'Layout coordinates saved — Jay can use these exact positions' });
    } catch (e) {
      setSaveMsg({ success: false, msg: e.message });
    }
    setSaving(false);
  };

  const handleExport = () => {
    const data = { layout_coordinates: layout, note: 'Reference model for Jay Chavez — HeyGen template hardwire' };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'layout_coordinates.json';
    a.click();
  };

  if (!loaded) {
    return <div className="flex items-center justify-center py-12"><div className="w-6 h-6 border-2 border-slate-700 border-t-gold rounded-full animate-spin" style={{ borderTopColor: GOLD }} /></div>;
  }

  const selectedItem = selected === 'bob' ? layout.bob : selected === 'panel' ? layout.panel : selected?.startsWith('pill-') ? layout.pills[parseInt(selected.split('-')[1])] : null;

  return (
    <div className="flex flex-col gap-4" style={{ background: '#0a0a0a' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
        <div className="flex items-center gap-2">
          <Move className="w-4 h-4" style={{ color: GOLD }} />
          <p className="text-xs font-black tracking-widest uppercase" style={{ color: GOLD }}>Visual Layout Editor</p>
          <span className="text-[10px] text-slate-500">— drag elements to position them on the studio backdrop</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-300 hover:text-white transition-colors" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}>
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
          <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold text-white transition-colors" style={{ background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.3)' }}>
            <Download className="w-3 h-3" /> Export JSON
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold text-black transition-all disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #e8c84a, #D4AF37)' }}>
            {saving ? 'Saving…' : <><Save className="w-3 h-3" /> Save Coordinates</>}
          </button>
        </div>
      </div>

      {/* Canvas + Controls */}
      <div className="flex flex-col lg:flex-row gap-4 px-4 pb-4">
        {/* Canvas */}
        <div className="flex-1">
          <div
            ref={canvasRef}
            className="relative w-full overflow-hidden select-none"
            style={{
              aspectRatio: '16/9',
              backgroundImage: `url('${STUDIO_BG}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '1px solid rgba(212,175,55,0.2)',
              cursor: dragging ? 'grabbing' : 'default',
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Wall map zone guide — shows the back-wall screen area for reference */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: `${WALL_MAP_ZONE.x}%`,
                top: `${WALL_MAP_ZONE.y}%`,
                width: `${WALL_MAP_ZONE.w}%`,
                height: `${WALL_MAP_ZONE.h}%`,
                border: '1px dashed rgba(212,175,55,0.25)',
                borderRadius: '4px',
              }}
            >
              <span className="absolute -top-4 left-0 text-[7px] font-black tracking-widest uppercase" style={{ color: 'rgba(212,175,55,0.4)' }}>Wall Map Zone</span>
            </div>
            {/* Bob — transparent lower-left presenter */}
            <div
              onMouseDown={(e) => handleMouseDown(e, 'bob')}
              className={`absolute cursor-grab transition-all ${dragging?.type === 'bob' ? 'cursor-grabbing' : ''}`}
              style={{
                left: `${layout.bob.x}%`,
                top: `${layout.bob.y}%`,
                width: `${layout.bob.w}%`,
                height: `${layout.bob.h}%`,
                outline: selected === 'bob' ? `2px dashed ${GOLD}` : '2px dashed transparent',
                outlineOffset: '2px',
              }}
            >
              {/* Bob placeholder — transparent silhouette */}
              <div className="w-full h-full flex items-end justify-center">
                <div className="w-[60%] h-[90%] rounded-t-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(180deg, rgba(100,120,140,0.3) 0%, rgba(40,50,60,0.5) 100%)',
                    border: `1px solid ${selected === 'bob' ? GOLD : 'rgba(212,175,55,0.4)'}`,
                    borderTop: `2px solid ${selected === 'bob' ? GOLD : 'rgba(212,175,55,0.4)'}`,
                  }}>
                  <div className="w-[70%] h-[25%] rounded-full mb-1" style={{ background: 'rgba(180,160,140,0.5)' }} />
                </div>
              </div>
              {selected === 'bob' && (
                <div className="absolute -top-5 left-0 text-[8px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded" style={{ background: GOLD, color: '#000' }}>Bob</div>
              )}
            </div>

            {/* White solution panel — upper center */}
            <div
              onMouseDown={(e) => handleMouseDown(e, 'panel')}
              className={`absolute cursor-grab transition-all ${dragging?.type === 'panel' ? 'cursor-grabbing' : ''}`}
              style={{
                left: `${layout.panel.x}%`,
                top: `${layout.panel.y}%`,
                width: `${layout.panel.w}%`,
                height: `${layout.panel.h}%`,
                background: 'rgba(255,255,255,0.92)',
                border: `2px solid ${selected === 'panel' ? GOLD : '#D4AF37'}`,
                borderRadius: '10px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                outline: selected === 'panel' ? `2px dashed ${GOLD}` : 'none',
                outlineOffset: '2px',
              }}
            >
              <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-2">
                <div className="w-[60%] h-[3px] rounded-full" style={{ background: '#1a1a1a' }} />
                <div className="w-[80%] h-[2px] rounded-full" style={{ background: '#2a2a2a' }} />
                <div className="w-[70%] h-[2px] rounded-full" style={{ background: '#2a2a2a' }} />
                <div className="w-[75%] h-[2px] rounded-full" style={{ background: '#2a2a2a' }} />
              </div>
              {selected === 'panel' && (
                <div className="absolute -top-5 left-0 text-[8px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded" style={{ background: GOLD, color: '#000' }}>Wall Map Billboard</div>
              )}
            </div>

            {/* 3 floor pills */}
            {layout.pills.map((pill, i) => {
              const isSel = selected === `pill-${i}`;
              return (
                <div
                  key={i}
                  onMouseDown={(e) => handleMouseDown(e, `pill-${i}`)}
                  className={`absolute cursor-grab transition-all ${dragging?.type === `pill-${i}` ? 'cursor-grabbing' : ''}`}
                  style={{
                    left: `${pill.x}%`,
                    top: `${pill.y}%`,
                    width: `${pill.w}%`,
                    height: `${pill.h}%`,
                    background: 'linear-gradient(135deg, rgba(212,180,106,0.12) 0%, rgba(212,180,106,0.04) 100%)',
                    border: `1px solid ${isSel ? GOLD : 'rgba(212,180,106,0.45)'}`,
                    borderRadius: '9999px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.35)',
                    outline: isSel ? `2px dashed ${GOLD}` : 'none',
                    outlineOffset: '2px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span className="uppercase whitespace-nowrap leading-none" style={{ color: '#d4b46a', fontFamily: 'Cormorant Garamond, serif', fontWeight: 500, letterSpacing: '0.15em', fontSize: 'clamp(0.5rem, 1vw, 0.75rem)' }}>{pill.label}</span>
                  <span className="text-[6px] tracking-[0.15em] uppercase opacity-60 mt-0.5" style={{ color: '#d4b46a' }}>{pill.sub}</span>
                </div>
              );
            })}
          </div>

          {/* Instructions */}
          <div className="flex items-center gap-2 mt-2 px-1">
            <Eye className="w-3 h-3" style={{ color: GOLD }} />
            <p className="text-[10px] text-slate-500">Click an element to select it · Drag to reposition · Use sliders below for fine-tuning · Save when done</p>
          </div>
        </div>

        {/* Controls panel */}
        <div className="w-full lg:w-72 shrink-0">
          {/* Element selector */}
          <div className="mb-3">
            <p className="text-[9px] font-black tracking-widest uppercase text-slate-500 mb-2">Select Element</p>
            <div className="grid grid-cols-2 gap-1.5">
              <button onClick={() => setSelected('bob')} className="px-2 py-1.5 rounded text-[10px] font-bold transition-all" style={{ background: selected === 'bob' ? 'rgba(212,175,55,0.2)' : '#1a1a1a', border: `1px solid ${selected === 'bob' ? GOLD : 'rgba(255,255,255,0.1)'}`, color: selected === 'bob' ? GOLD : '#999' }}>Bob</button>
              <button onClick={() => setSelected('panel')} className="px-2 py-1.5 rounded text-[10px] font-bold transition-all" style={{ background: selected === 'panel' ? 'rgba(212,175,55,0.2)' : '#1a1a1a', border: `1px solid ${selected === 'panel' ? GOLD : 'rgba(255,255,255,0.1)'}`, color: selected === 'panel' ? GOLD : '#999' }}>Map Billboard</button>
              {layout.pills.map((pill, i) => (
                <button key={i} onClick={() => setSelected(`pill-${i}`)} className="px-2 py-1.5 rounded text-[10px] font-bold transition-all" style={{ background: selected === `pill-${i}` ? 'rgba(212,175,55,0.2)' : '#1a1a1a', border: `1px solid ${selected === `pill-${i}` ? GOLD : 'rgba(255,255,255,0.1)'}`, color: selected === `pill-${i}` ? GOLD : '#999' }}>{pill.label}</button>
              ))}
            </div>
          </div>

          {/* Position sliders */}
          {selectedItem && (
            <div className="rounded-lg p-3" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-[9px] font-black tracking-widest uppercase text-slate-500 mb-3">
                Position & Size — <span style={{ color: GOLD }}>{selected === 'bob' ? 'Bob' : selected === 'panel' ? 'Wall Map Billboard' : layout.pills[parseInt(selected.split('-')[1])].label}</span>
              </p>
              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between mb-1"><span className="text-[9px] text-slate-500">Horizontal (X)</span><span className="text-[9px] font-mono" style={{ color: GOLD }}>{selectedItem.x.toFixed(1)}%</span></div>
                  <input type="range" min="0" max="95" step="0.5" value={selectedItem.x} onChange={(e) => handleSlider(selected, 'x', parseFloat(e.target.value))} className="w-full accent-amber-400" />
                </div>
                <div>
                  <div className="flex justify-between mb-1"><span className="text-[9px] text-slate-500">Vertical (Y)</span><span className="text-[9px] font-mono" style={{ color: GOLD }}>{selectedItem.y.toFixed(1)}%</span></div>
                  <input type="range" min="0" max="95" step="0.5" value={selectedItem.y} onChange={(e) => handleSlider(selected, 'y', parseFloat(e.target.value))} className="w-full accent-amber-400" />
                </div>
                <div>
                  <div className="flex justify-between mb-1"><span className="text-[9px] text-slate-500">Width</span><span className="text-[9px] font-mono" style={{ color: GOLD }}>{selectedItem.w.toFixed(1)}%</span></div>
                  <input type="range" min="3" max="60" step="0.5" value={selectedItem.w} onChange={(e) => handleSlider(selected, 'w', parseFloat(e.target.value))} className="w-full accent-amber-400" />
                </div>
                <div>
                  <div className="flex justify-between mb-1"><span className="text-[9px] text-slate-500">Height</span><span className="text-[9px] font-mono" style={{ color: GOLD }}>{selectedItem.h.toFixed(1)}%</span></div>
                  <input type="range" min="3" max="80" step="0.5" value={selectedItem.h} onChange={(e) => handleSlider(selected, 'h', parseFloat(e.target.value))} className="w-full accent-amber-400" />
                </div>
              </div>
            </div>
          )}

          {/* Save message */}
          {saveMsg && (
            <div className="mt-3 rounded-lg p-2.5" style={{ background: saveMsg.success ? 'rgba(74,222,128,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${saveMsg.success ? 'rgba(74,222,128,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
              <p className="text-[10px]" style={{ color: saveMsg.success ? '#4ade80' : '#ef4444' }}>{saveMsg.success ? '✓' : '✗'} {saveMsg.msg}</p>
            </div>
          )}

          {/* Reference note */}
          <div className="mt-3 rounded-lg p-2.5" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <p className="text-[9px] text-slate-400 leading-relaxed">
              <span className="font-bold" style={{ color: GOLD }}>For Jay Chavez:</span> The white billboard is positioned over the back-wall US map screen as a laid-in display — it should look like a screen mounted on the wall. Also includes Bob's transparent position and the 3 floor pills (NEWS / RELOCATION / INTELLIGENCE). Save and export the JSON to hardwire into the HeyGen template.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}