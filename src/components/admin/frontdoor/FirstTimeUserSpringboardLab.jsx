import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Plus, Edit2, RotateCcw, Smartphone, 
  Monitor, CheckCircle2, ShieldCheck, HelpCircle, 
  BookOpen, Compass, Home, Play, Mic, Phone, X
} from 'lucide-react';
import SpringboardGrid, { PORTAL_SPRINGBOARD_PRESETS, AVAILABLE_ICONS } from '@/components/springboard/SpringboardGrid';
import UnifiedConciergeSearchPill from '@/components/portal/UnifiedConciergeSearchPill';
import ClientBottomCardsDeck from './ClientBottomCardsDeck';

const GOLD = '#D4AF37';
const TAN_BG = '#ede0cc';

export default function FirstTimeUserSpringboardLab() {
  const navigate = useNavigate();
  const [activePreset, setActivePreset] = useState('first_time_user');
  const [devicePreview, setDevicePreview] = useState('desktop'); // 'desktop' | 'mobile'
  const [isEditMode, setIsEditMode] = useState(false);
  const [appButtons, setAppButtons] = useState(() => PORTAL_SPRINGBOARD_PRESETS.first_time_user);
  
  // New App Button Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingButtonId, setEditingButtonId] = useState(null);
  const [btnLabel, setBtnLabel] = useState('');
  const [btnSub, setBtnSub] = useState('');
  const [btnBadge, setBtnBadge] = useState('');
  const [btnIcon, setBtnIcon] = useState('Home');
  const [btnColor, setBtnColor] = useState('#D4AF37');
  const [btnPath, setBtnPath] = useState('/relocation-intake');

  const handleSwitchPreset = (presetKey) => {
    setActivePreset(presetKey);
    setAppButtons(PORTAL_SPRINGBOARD_PRESETS[presetKey] || PORTAL_SPRINGBOARD_PRESETS.first_time_user);
  };

  const handleResetButtons = () => {
    setAppButtons(PORTAL_SPRINGBOARD_PRESETS[activePreset]);
  };

  const handleDeleteButton = (btnId) => {
    setAppButtons(prev => prev.filter(b => b.id !== btnId));
  };

  const handleOpenAddModal = (btnToEdit = null) => {
    if (btnToEdit) {
      setEditingButtonId(btnToEdit.id);
      setBtnLabel(btnToEdit.label);
      setBtnSub(btnToEdit.sub || '');
      setBtnBadge(btnToEdit.badge || '');
      setBtnIcon(btnToEdit.iconName || 'Home');
      setBtnColor(btnToEdit.iconColor || '#D4AF37');
      setBtnPath(btnToEdit.path || '/');
    } else {
      setEditingButtonId(null);
      setBtnLabel('');
      setBtnSub('');
      setBtnBadge('');
      setBtnIcon('Sparkles');
      setBtnColor('#D4AF37');
      setBtnPath('/solutions');
    }
    setIsAddModalOpen(true);
  };

  const handleSaveButton = (e) => {
    e.preventDefault();
    if (!btnLabel.trim()) return;

    if (editingButtonId) {
      setAppButtons(prev => prev.map(b => {
        if (b.id === editingButtonId) {
          return {
            ...b,
            label: btnLabel.trim(),
            sub: btnSub.trim(),
            badge: btnBadge.trim() || undefined,
            iconName: btnIcon,
            iconColor: btnColor,
            path: btnPath.trim()
          };
        }
        return b;
      }));
    } else {
      const newBtn = {
        id: `custom_${Date.now()}`,
        label: btnLabel.trim(),
        sub: btnSub.trim(),
        badge: btnBadge.trim() || undefined,
        iconName: btnIcon,
        iconColor: btnColor,
        bgGradient: 'from-[#1c1917] via-[#111111] to-[#0a0a0a]',
        border: `border-[${btnColor}]/50`,
        path: btnPath.trim()
      };
      setAppButtons(prev => [...prev, newBtn]);
    }
    setIsAddModalOpen(false);
  };

  return (
    <div className="w-full space-y-6 text-left">
      {/* Top Controls: Preset selector, Edit mode, Device preview */}
      <div className="p-4 rounded-2xl bg-[#0a0a0a] text-white border border-[#D4AF37]/40 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Universal Springboard &amp; 1st-Time User Lab
            </h2>
          </div>
          <p className="text-xs text-white/60 mt-0.5">
            Single Search/Ask Pill + Customizable iPhone App Squircle Grid across all portals
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Preset Buttons */}
          <div className="flex items-center bg-[#141414] p-1 rounded-xl border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => handleSwitchPreset('first_time_user')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${activePreset === 'first_time_user' ? 'bg-[#D4AF37] text-black shadow' : 'text-white/70 hover:text-white'}`}
            >
              1st-Time User
            </button>
            <button
              type="button"
              onClick={() => handleSwitchPreset('client_subscriber')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${activePreset === 'client_subscriber' ? 'bg-[#D4AF37] text-black shadow' : 'text-white/70 hover:text-white'}`}
            >
              Subscriber
            </button>
            <button
              type="button"
              onClick={() => handleSwitchPreset('agent')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${activePreset === 'agent' ? 'bg-[#D4AF37] text-black shadow' : 'text-white/70 hover:text-white'}`}
            >
              Agent Network
            </button>
          </div>

          {/* Edit / Add Button Tools */}
          <button
            type="button"
            onClick={() => setIsEditMode(prev => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              isEditMode 
                ? 'bg-amber-500 text-black border-amber-400 font-black' 
                : 'bg-black text-[#D4AF37] border-[#D4AF37]/50 hover:bg-[#1a1a1a]'
            }`}
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditMode ? 'Done Customizing' : 'Customize App Buttons'}</span>
          </button>

          {isEditMode && (
            <>
              <button
                type="button"
                onClick={() => handleOpenAddModal()}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#10b981] text-black border border-[#10b981] hover:brightness-110 cursor-pointer flex items-center gap-1 shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add App Button</span>
              </button>
              <button
                type="button"
                onClick={handleResetButtons}
                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white/10 text-white/80 hover:bg-white/20 cursor-pointer flex items-center gap-1"
                title="Reset to Preset Default"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {/* Device toggle */}
          <div className="flex items-center bg-[#141414] p-1 rounded-xl border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setDevicePreview('desktop')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${devicePreview === 'desktop' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'}`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setDevicePreview('mobile')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${devicePreview === 'mobile' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'}`}
              title="iPhone Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas (Desktop or Mobile Shell) */}
      <div className={`mx-auto transition-all ${devicePreview === 'mobile' ? 'max-w-[420px]' : 'w-full'}`}>
        <div 
          className="w-full rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl border border-[#0a0a0a]/20 text-[#0a0a0a] space-y-6"
          style={{
            background: TAN_BG,
            boxShadow: '0 20px 50px -10px rgba(0,0,0,0.25), 0 0 0 1px rgba(212,175,55,0.4)',
          }}
        >
          {/* 1. First-Time User Welcome Banner */}
          <section className="p-4 rounded-xl bg-[#0a0a0a] text-white border border-[#D4AF37]/50 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-full bg-[#181818] border-2 border-[#D4AF37] flex items-center justify-center shrink-0 shadow-md">
                <Sparkles className="w-7 h-7 text-[#D4AF37]" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#D4AF37] text-black">
                    {activePreset === 'first_time_user' ? '1ST-TIME GUEST' : 'ACTIVE SUBSCRIBER'}
                  </span>
                  <span className="text-[10px] text-[#10b981] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                    Zero-Fee Concierge Protection
                  </span>
                </div>
                <h1 
                  className="text-lg sm:text-xl font-bold text-white tracking-tight leading-tight mt-0.5"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  {activePreset === 'first_time_user' ? 'Welcome to Your Private Relocation Concierge' : 'Welcome back, Robert Dyson'}
                </h1>
                <p className="text-xs text-white/70 font-sans mt-0.5">
                  Fiduciary Relocation &amp; Vetted Real Estate Solutions across all 50 States.
                </p>
              </div>
            </div>

            <div className="text-right text-xs shrink-0 self-end sm:self-auto">
              <div className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">Direct Desk</div>
              <a href="tel:+18583531200" className="font-mono text-white font-bold hover:text-[#D4AF37]">
                (858) 353-1200
              </a>
            </div>
          </section>

          {/* 2. THE ONE UNIFIED SEARCH & ASK PILL (REPLACING REDUNDANT CHAT/ASK PILLS) */}
          <section className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold px-1 text-[#854d0e]">
              <span className="uppercase tracking-wider font-bold">ONE UNIFIED CONCIERGE SEARCH &amp; ASK PILL</span>
              <span className="text-[11px] text-[#554433]">Answers questions, searches homes, &amp; connects voice</span>
            </div>
            
            <UnifiedConciergeSearchPill 
              placeholder="Ask anything (tax strategy, schools, timelines) or search any city / listing link..."
              showVoiceToggle={true}
              showSuggestions={true}
            />
          </section>

          {/* 3. APP SYMBOLS SPRINGBOARD GRID */}
          <section className="pt-2">
            <div className="flex items-center justify-between pb-2 border-b border-[#0a0a0a]/20 mb-3">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#854d0e] flex items-center gap-1.5">
                <span>CONCIERGE WORKSPACE APPS</span>
                {isEditMode && <span className="text-[10px] text-amber-700 font-bold bg-amber-200 px-2 py-0.5 rounded-full">Customizing</span>}
              </h3>
              <span className="text-[10px] text-[#44382c] font-medium">
                {appButtons.length} Apps Active • Tap to Launch
              </span>
            </div>

            <SpringboardGrid 
              buttons={appButtons}
              columns={4}
              isEditMode={isEditMode}
              onDeleteButton={handleDeleteButton}
              onEditButton={handleOpenAddModal}
              onAction={(action) => {
                if (action.startsWith('modal:')) {
                  alert(`Opening modal: ${action.replace('modal:', '')}`);
                }
              }}
            />
          </section>

          {/* 4. 1st-Time User Guided Orientation Strip */}
          <section className="p-3.5 rounded-xl bg-black/5 border border-black/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0a0a0a] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                <span>How This Workspace Operates:</span>
              </span>
              <span className="text-[10px] text-[#854d0e] font-semibold">100% Free For Relocating Families</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#44382c]">
              <div className="p-2 rounded-lg bg-white/60 border border-black/5">
                <span className="font-bold text-[#0a0a0a] block">1. One Unified Bar</span>
                Type any tax or relocation question, or paste a listing link. The bar answers directly.
              </div>
              <div className="p-2 rounded-lg bg-white/60 border border-black/5">
                <span className="font-bold text-[#0a0a0a] block">2. Springboard Apps</span>
                Tap any app symbol to launch vetted agents, roadmaps, daily news, or direct telephony.
              </div>
              <div className="p-2 rounded-lg bg-white/60 border border-black/5">
                <span className="font-bold text-[#0a0a0a] block">3. Zero Sales Bias</span>
                We are an independent fiduciary firm. We vet local agents instead of selling leads.
              </div>
            </div>
          </section>

          {/* 5. Bottom Navigation Cards Deck */}
          <ClientBottomCardsDeck 
            originAddress="14820 Blossom Hill Rd, Los Gatos, CA"
            destinationCity="Scottsdale"
            destinationState="AZ"
            onOpenLibrary={() => alert('Vault & Library archives opened')}
          />
        </div>
      </div>

      {/* Add / Edit Button Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl p-6 bg-[#0a0a0a] border border-[#D4AF37] text-white space-y-4 shadow-2xl text-left">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>{editingButtonId ? 'Edit App Button' : 'Create Custom App Button'}</span>
              </h3>
              <button 
                type="button" 
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 text-white/70 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveButton} className="space-y-3 text-xs">
              <div>
                <label className="text-white/70 block mb-1">App Label (1-2 words)</label>
                <input 
                  type="text"
                  required
                  value={btnLabel}
                  onChange={e => setBtnLabel(e.target.value)}
                  placeholder="e.g. Escrow Audit"
                  className="w-full px-3 py-2 rounded-xl bg-[#141414] border border-white/20 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="text-white/70 block mb-1">Subtitle (micro-copy)</label>
                <input 
                  type="text"
                  value={btnSub}
                  onChange={e => setBtnSub(e.target.value)}
                  placeholder="e.g. Review Milestones"
                  className="w-full px-3 py-2 rounded-xl bg-[#141414] border border-white/20 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/70 block mb-1">Status Badge (optional)</label>
                  <input 
                    type="text"
                    value={btnBadge}
                    onChange={e => setBtnBadge(e.target.value)}
                    placeholder="e.g. Live, Step 1, New"
                    className="w-full px-3 py-2 rounded-xl bg-[#141414] border border-white/20 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="text-white/70 block mb-1">Accent Color</label>
                  <select
                    value={btnColor}
                    onChange={e => setBtnColor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#141414] border border-white/20 text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="#D4AF37">Gold (#D4AF37)</option>
                    <option value="#10b981">Emerald (#10b981)</option>
                    <option value="#60a5fa">Blue (#60a5fa)</option>
                    <option value="#ef4444">Crimson (#ef4444)</option>
                    <option value="#e8c84a">Yellow (#e8c84a)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/70 block mb-1">App Symbol Icon</label>
                  <select
                    value={btnIcon}
                    onChange={e => setBtnIcon(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#141414] border border-white/20 text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    {Object.keys(AVAILABLE_ICONS).map(iconName => (
                      <option key={iconName} value={iconName}>{iconName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-white/70 block mb-1">Destination Route</label>
                  <input 
                    type="text"
                    required
                    value={btnPath}
                    onChange={e => setBtnPath(e.target.value)}
                    placeholder="/relocation-intake"
                    className="w-full px-3 py-2 rounded-xl bg-[#141414] border border-white/20 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 cursor-pointer font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-black font-bold cursor-pointer hover:brightness-110 shadow"
                  style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #D4AF37 100%)' }}
                >
                  Save App Button
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}