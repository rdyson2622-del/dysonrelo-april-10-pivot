import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Edit3, ArrowRight, ShieldCheck, MapPin, 
  Phone, Mail, Calendar, Compass, X, Check, Sparkles, Eye 
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import FirstTimeViewerSidebarIntro from './FirstTimeViewerSidebarIntro';

const GOLD = '#D4AF37';

export default function SubscriberProfileHeader({ 
  onProfileClick,
  className = '',
  forcedSubscriber = null,
}) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isGuestMode, setIsGuestMode] = useState(() => {
    const stored = sessionStorage.getItem('dyson_viewer_mode');
    if (stored) return stored === 'guest';
    return true; // Default to 1st time unsubscribed viewer intro
  });
  const [clientRecord, setClientRecord] = useState(null);
  const [subscriberRecord, setSubscriberRecord] = useState(null);
  const [agentRecord, setAgentRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Editable Form State
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    current_city: '',
    destination_city: '',
    destination_state: 'AZ',
    target_move_date: '',
    role_type: 'client', // 'client' | 'hr' | 'agent'
    photo_url: '',
    notes: '',
  });

  useEffect(() => {
    let isMounted = true;

    async function loadSubscriberData() {
      try {
        const me = await base44.auth.me();
        if (me && isMounted) setCurrentUser(me);

        // Check if explicit role in sessionStorage
        const savedRole = sessionStorage.getItem('dyson_role') || (me?.role === 'admin' ? 'admin' : 'client');

        // 1. Fetch Relocation Client data
        const clients = await base44.entities.RelocationClient.list('-created_date', 1);
        if (clients && clients.length > 0 && isMounted) {
          const client = clients[0];
          setClientRecord(client);
        }

        // 2. Fetch DnnSubscriber data
        if (me?.email) {
          const subs = await base44.entities.DnnSubscriber.filter({ email: me.email }, '-created_date', 1);
          if (subs && subs.length > 0 && isMounted) {
            setSubscriberRecord(subs[0]);
          }
        }

        // 3. Fetch ActiveRelocationAgent if applicable
        if (savedRole === 'agent' || me?.email) {
          const agents = await base44.entities.ActiveRelocationAgent.list('-created_date', 1);
          if (agents && agents.length > 0 && isMounted) {
            setAgentRecord(agents[0]);
          }
        }
      } catch (err) {
        console.error('Error loading subscriber profile:', err);
      }
    }

    loadSubscriberData();
    return () => { isMounted = false; };
  }, []);

  // Compute Active Persona / Role
  const savedRole = sessionStorage.getItem('dyson_role') || (currentUser?.role === 'admin' ? 'admin' : 'client');
  const roleType = forcedSubscriber?.role_type || (savedRole === 'agent' ? 'agent' : savedRole === 'hr' ? 'hr' : 'client');

  // Compute Name, Photo, Location
  const displayName = forcedSubscriber?.full_name || 
                      clientRecord?.full_name || 
                      currentUser?.full_name || 
                      subscriberRecord?.full_name || 
                      'Kayden Sterling';

  const photoUrl = forcedSubscriber?.photo_url || 
                   currentUser?.avatar_url || 
                   clientRecord?.photo_url || 
                   'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

  const currentCity = forcedSubscriber?.current_city || clientRecord?.current_city || 'Los Gatos, CA';
  const destCity = forcedSubscriber?.destination_city || clientRecord?.destination_city?.replace(/,\s*[A-Z]{2}$/i, '') || 'Scottsdale';
  const destState = forcedSubscriber?.destination_state || clientRecord?.destination_state || 'AZ';

  // Role Badge info
  let roleBadge = 'RELOCATING SUBSCRIBER';
  let roleSubtitle = `${currentCity} → ${destCity}, ${destState}`;
  if (roleType === 'hr') {
    roleBadge = 'CORPORATE HR DESK';
    roleSubtitle = 'Executive Relocation Hub';
  } else if (roleType === 'agent') {
    roleBadge = 'PRN AFFILIATE AGENT';
    roleSubtitle = agentRecord ? `${agentRecord.brokerage || 'Dyson Relo'} • ${agentRecord.city || 'Scottsdale'}` : 'Vetted Referral Network';
  }

  // Populate form data when modal opens
  const handleOpenModal = () => {
    setFormData({
      full_name: displayName,
      email: currentUser?.email || clientRecord?.email || 'kayden@sterlingfamily.com',
      phone: clientRecord?.phone || '(408) 555-0192',
      current_city: currentCity,
      destination_city: destCity,
      destination_state: destState,
      target_move_date: clientRecord?.target_move_date || 'Summer 2026',
      role_type: roleType,
      photo_url: photoUrl,
      notes: clientRecord?.notes || 'Seeking 4-bed single-story home near top-rated school district. 1031 exchange planned.',
    });
    setSaveSuccess(false);
    setIsModalOpen(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (clientRecord?.id) {
        await base44.entities.RelocationClient.update(clientRecord.id, {
          full_name: formData.full_name,
          phone: formData.phone,
          current_city: formData.current_city,
          destination_city: formData.destination_city,
          destination_state: formData.destination_state,
          notes: formData.notes,
        });
        setClientRecord(prev => ({ ...prev, ...formData }));
      }
      setSaveSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSaveSuccess(false);
      }, 900);
    } catch (err) {
      console.error('Failed to save profile updates:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // 1ST TIME UNSUBSCRIBED VIEWER INTRO AT TOP OF SIDEBAR
  if (isGuestMode && !forcedSubscriber) {
    return (
      <FirstTimeViewerSidebarIntro
        onSwitchToSubscriber={() => {
          setIsGuestMode(false);
          sessionStorage.setItem('dyson_viewer_mode', 'subscriber');
        }}
      />
    );
  }

  return (
    <>
      {/* ========================================================
          SUBSCRIBER PROFILE HEADER IN SIDEBAR
          Replaces the generic "Search Destinations" cream box.
          Always visible at top of sidebar across all searches & pages.
          ======================================================== */}
      <div 
        onClick={handleOpenModal}
        className={`w-full p-2.5 sm:p-3 rounded-2xl border text-left shadow-xl transition-all cursor-pointer group hover:border-[#D4AF37] relative overflow-hidden select-none ${className}`}
        style={{
          background: 'linear-gradient(135deg, #18150f 0%, #0d0b08 100%)',
          borderColor: `${GOLD}75`,
        }}
        title="Click to view full subscriber details or edit move file"
      >
        {/* Subtle Top Gold Glow */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent pointer-events-none" />

        <div className="flex items-center gap-2.5">
          {/* Avatar with gold border & active pulse dot */}
          <div className="relative shrink-0">
            <img 
              src={photoUrl} 
              alt={displayName} 
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-[#D4AF37] shadow-md group-hover:scale-105 transition-transform"
            />
            <span 
              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#10b981] border-2 border-black flex items-center justify-center text-[7.5px] font-black text-black shadow"
              title="Active Verified Account"
            >
              ✓
            </span>
          </div>

          {/* Name & Basic Info */}
          <div className="min-w-0 flex-1 leading-tight">
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <span 
                className="text-[7.5px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-full text-black bg-[#D4AF37] shadow-xs truncate"
              >
                {roleBadge}
              </span>
              <span className="text-[8.5px] text-[#10b981] font-bold flex items-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                Active
              </span>
            </div>

            <h3 
              className="text-xs sm:text-sm font-bold text-white tracking-tight truncate group-hover:text-[#D4AF37] transition-colors"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {displayName}
            </h3>

            <p className="text-[9.5px] text-[#e8c84a] font-semibold truncate mt-0.5 flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 shrink-0 text-[#D4AF37]" />
              <span className="truncate">{roleSubtitle}</span>
            </p>
          </div>
        </div>

        {/* Action Link: Click to view details / edit */}
        <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[8.5px] text-white/70 group-hover:text-white transition-colors">
          <span className="flex items-center gap-1 text-[#D4AF37] font-semibold">
            <Edit3 className="w-2.5 h-2.5" />
            <span>Subscriber Details &amp; File</span>
          </span>
          <span className="text-white/50 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
            <span>Edit</span>
            <ArrowRight className="w-2.5 h-2.5 text-[#D4AF37]" />
          </span>
        </div>
      </div>

      {/* ========================================================
          SUBSCRIBER DETAIL & EDIT MODAL
          Allows viewing full details or editing the move record
          ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-lg rounded-3xl p-5 sm:p-6 border shadow-2xl text-left bg-[#0c0c0c] border-[#D4AF37] text-white relative max-h-[90vh] overflow-y-auto space-y-4"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(212,175,55,0.4) transparent',
            }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/15">
              <div className="flex items-center gap-3">
                <img 
                  src={photoUrl} 
                  alt={displayName} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#D4AF37] shadow"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 
                      className="text-lg font-bold text-white tracking-tight"
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      {displayName}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-[#D4AF37] text-black">
                      {roleBadge}
                    </span>
                  </div>
                  <p className="text-xs text-white/60">
                    Fiduciary Move File &amp; Subscriber Profile
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#181818] border border-white/20 text-white/70 hover:text-white flex items-center justify-center cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  navigate('/client-roadmap');
                }}
                className="p-2.5 rounded-xl bg-[#181818] border border-[#D4AF37]/50 hover:bg-[#222] text-[#D4AF37] font-bold flex items-center justify-between gap-1 shadow-sm transition-all cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Open Full Roadmap</span>
                </div>
                <ArrowRight className="w-3 h-3" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  navigate('/relocation-intake');
                }}
                className="p-2.5 rounded-xl bg-[#181818] border border-white/20 hover:bg-[#222] text-white/90 font-bold flex items-center justify-between gap-1 shadow-sm transition-all cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>Update Move Intake</span>
                </div>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Profile Edit Form */}
            <form onSubmit={handleSaveProfile} className="space-y-3 pt-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] mb-1">
                    Subscriber Name
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#161616] border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#161616] border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] mb-1">
                    Origin Market (Current City)
                  </label>
                  <input
                    type="text"
                    value={formData.current_city}
                    onChange={(e) => setFormData({ ...formData, current_city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#161616] border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] mb-1">
                    Destination Market
                  </label>
                  <input
                    type="text"
                    value={formData.destination_city}
                    onChange={(e) => setFormData({ ...formData, destination_city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#161616] border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] mb-1">
                  Move Notes &amp; Special Requirements
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="School districts, 1031 tax exchange, target neighborhoods..."
                  className="w-full px-3 py-2 rounded-xl bg-[#161616] border border-white/15 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Status and Action Buttons */}
              <div className="pt-3 border-t border-white/15 flex items-center justify-between gap-3">
                {saveSuccess ? (
                  <span className="text-xs text-[#10b981] font-bold flex items-center gap-1.5 animate-in fade-in">
                    <Check className="w-4 h-4 text-[#10b981]" />
                    <span>Subscriber Details Saved!</span>
                  </span>
                ) : (
                  <span className="text-[10px] text-white/50">
                    Auto-synced with Dyson Relocation Desk
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-3.5 py-2 rounded-xl bg-[#1e1e1e] hover:bg-[#282828] text-white/80 font-bold text-xs cursor-pointer transition-colors"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#e8c84a] text-black font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}