import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  User, Edit3, ArrowRight, ShieldCheck, MapPin, 
  Phone, Mail, Calendar, Compass, X, Check, Sparkles, Eye,
  Volume2, Play, Square, Mic
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import FirstTimeViewerSidebarIntro from './FirstTimeViewerSidebarIntro';

const GOLD = '#D4AF37';

// Authentic Bob Dyson black-shirt headshot in Base44 storage (single source of truth)
const BOB_PHOTO_PERMANENT = "https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/09d1d285a_bob_dyson_black_shirt.webp";

// Authentic Charlie Simmons studio desk photo & audio greeting
const CHARLIE_DESK_PHOTO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/2e7121744_Screenshot2026-09-09at25842PM.png";
const CHARLIE_GREETING_AUDIO = "https://resource2.heygen.ai/text_to_speech/33dec76283f44f80b7d658cc9060acbb/cc5fb6c924064712ba9f690852aa4646/id=2b2fe5ab-819c-4d92-a6b7-8ce1f65f86df.wav";

export default function SubscriberProfileHeader({ 
  onProfileClick,
  className = '',
  forcedSubscriber = null,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = (location?.pathname || '').toLowerCase();

  // Detect which of the 6 subscriber portals we are in
  const isCorporatePortal = currentPath.includes('corporate-relo');
  const isBrokerPortal = currentPath.includes('broker');
  const isAgentPortal = currentPath.includes('partner-benefits') || currentPath.includes('agent-command') || currentPath.includes('sending-agent') || currentPath.includes('my-agent');
  const isReferralAgentPortal = currentPath.includes('referral-agent') || currentPath.includes('referral-process') || currentPath.includes('referral-forms');
  const isVendorPortal = currentPath.includes('financial-services') || currentPath.includes('vendor');
  const isClientPortal = currentPath.includes('client-roadmap') || currentPath.includes('relocation-roadmap') || currentPath.includes('relocation-intake') || currentPath.includes('dashboard') || currentPath.includes('home');
  const isFrontDoor = currentPath === '/' || currentPath === '/portal';

  const isOneOfSixPortals = isCorporatePortal || isBrokerPortal || isAgentPortal || isReferralAgentPortal || isVendorPortal || isClientPortal;

  const [currentUser, setCurrentUser] = useState(null);
  const [isGuestMode, setIsGuestMode] = useState(() => {
    // If explicitly in one of the 6 portals, default to Subscriber mode with the dual box!
    const stored = sessionStorage.getItem('dyson_viewer_mode');
    if (stored === 'subscriber') return false;
    if (stored === 'guest') return true;
    // On the front door / public entry, default to 1st-timer guest view
    return isFrontDoor;
  });

  const [clientRecord, setClientRecord] = useState(null);
  const [subscriberRecord, setSubscriberRecord] = useState(null);
  const [agentRecord, setAgentRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Charlie audio greeting state
  const [isCharliePlaying, setIsCharliePlaying] = useState(false);
  const audioRef = useRef(null);

  // Editable Form State
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    current_city: '',
    destination_city: '',
    destination_state: 'AZ',
    target_move_date: '',
    role_type: 'client',
    photo_url: '',
    notes: '',
  });

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('charlie-speech-active', { detail: { active: false } }));
      }
    };
  }, []);

  const toggleCharlieVoice = (e) => {
    if (e) e.stopPropagation();

    if (isCharliePlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsCharliePlaying(false);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('charlie-speech-active', { detail: { active: false } }));
      }
      return;
    }

    try {
      if (!audioRef.current) {
        const audio = new Audio(CHARLIE_GREETING_AUDIO);
        audio.preload = 'auto';

        audio.onplay = () => {
          setIsCharliePlaying(true);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('charlie-speech-active', { detail: { active: true } }));
          }
        };

        audio.onended = () => {
          setIsCharliePlaying(false);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('charlie-speech-active', { detail: { active: false } }));
          }
        };

        audio.onpause = () => {
          setIsCharliePlaying(false);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('charlie-speech-active', { detail: { active: false } }));
          }
        };

        audio.onerror = () => {
          setIsCharliePlaying(false);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('charlie-speech-active', { detail: { active: false } }));
          }
        };

        audioRef.current = audio;
      } else {
        audioRef.current.currentTime = 0;
      }

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Playback error or blocked by autoplay policy:', err);
          setIsCharliePlaying(false);
        });
      }
    } catch (err) {
      console.error('Failed to trigger Charlie greeting audio:', err);
      setIsCharliePlaying(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function loadSubscriberData() {
      try {
        const me = await base44.auth.me();
        if (me && isMounted) setCurrentUser(me);

        // 1. Fetch Relocation Client data
        const clients = await base44.entities.RelocationClient.list('-created_date', 1);
        if (clients && clients.length > 0 && isMounted) {
          setClientRecord(clients[0]);
        }

        // 2. Fetch DnnSubscriber data
        if (me?.email) {
          const subs = await base44.entities.DnnSubscriber.filter({ email: me.email }, '-created_date', 1);
          if (subs && subs.length > 0 && isMounted) {
            setSubscriberRecord(subs[0]);
          }
        }

        // 3. Fetch ActiveRelocationAgent if applicable
        const savedRole = sessionStorage.getItem('dyson_role') || (me?.role === 'admin' ? 'admin' : 'client');
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

  // Compute Active Persona / Role across the 6 portals
  const savedRole = sessionStorage.getItem('dyson_role') || (currentUser?.role === 'admin' ? 'admin' : 'client');
  let roleType = forcedSubscriber?.role_type || (savedRole === 'agent' ? 'agent' : savedRole === 'hr' ? 'hr' : 'client');

  if (isCorporatePortal) roleType = 'hr';
  else if (isBrokerPortal) roleType = 'broker';
  else if (isAgentPortal) roleType = 'agent';
  else if (isReferralAgentPortal) roleType = 'referral_agent';
  else if (isVendorPortal) roleType = 'vendor';
  else if (isClientPortal) roleType = 'client';

  // Compute Name, Photo, Location (defaults to Bob Dyson as verified subscriber)
  const displayName = forcedSubscriber?.full_name || 
                      clientRecord?.full_name || 
                      currentUser?.full_name || 
                      subscriberRecord?.full_name || 
                      'Bob Dyson';

  // Headshot is pulled from user/client profile, falling back to Bob's black shirt photo
  const photoUrl = forcedSubscriber?.photo_url || 
                   clientRecord?.photo_url || 
                   currentUser?.data?.photo_url || 
                   BOB_PHOTO_PERMANENT;

  const currentCity = forcedSubscriber?.current_city || clientRecord?.current_city || 'Del Mar, CA';
  const destCity = forcedSubscriber?.destination_city || clientRecord?.destination_city?.replace(/,\s*[A-Z]{2}$/i, '') || 'Scottsdale';
  const destState = forcedSubscriber?.destination_state || clientRecord?.destination_state || 'AZ';

  // Role Badge info tailored to which of the 6 portals is active
  let roleBadge = 'SUBSCRIBER • RELOCATING FAMILY';
  let roleSubtitle = `${currentCity} → ${destCity}, ${destState}`;
  if (roleType === 'hr' || isCorporatePortal) {
    roleBadge = 'SUBSCRIBER • HR DESK';
    roleSubtitle = 'Executive Relocation Hub';
  } else if (roleType === 'broker' || isBrokerPortal) {
    roleBadge = 'SUBSCRIBER • BROKER DESK';
    roleSubtitle = 'Wisdom Properties • Pilot Brokerage';
  } else if (roleType === 'agent' || isAgentPortal) {
    roleBadge = 'SUBSCRIBER • PRN AGENT';
    roleSubtitle = agentRecord ? `${agentRecord.brokerage || 'Dyson Relo'} • ${agentRecord.city || 'Scottsdale'}` : 'Vetted Referral Network';
  } else if (roleType === 'referral_agent' || isReferralAgentPortal) {
    roleBadge = 'SUBSCRIBER • REFERRAL AGENT';
    roleSubtitle = 'Affiliate Referral Network';
  } else if (roleType === 'vendor' || isVendorPortal) {
    roleBadge = 'SUBSCRIBER • VETTED VENDOR';
    roleSubtitle = 'Fiduciary Service Partner';
  }

  // Populate form data when modal opens
  const handleOpenModal = () => {
    setFormData({
      full_name: displayName,
      email: currentUser?.email || clientRecord?.email || 'rdyson2622@gmail.com',
      phone: clientRecord?.phone || '(858) 353-1200',
      current_city: currentCity,
      destination_city: destCity,
      destination_state: destState,
      target_move_date: clientRecord?.target_move_date || 'Fall 2026',
      role_type: roleType,
      photo_url: photoUrl,
      notes: clientRecord?.notes || 'Executive founder relocation file. Full fiduciary concierge move coordination.',
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
          photo_url: formData.photo_url || BOB_PHOTO_PERMANENT,
        });
        setClientRecord(prev => ({ ...prev, ...formData, photo_url: formData.photo_url || BOB_PHOTO_PERMANENT }));
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
  // Strictly reserved for the 1st timer / cold visitor on Front Door
  if (isGuestMode && !isOneOfSixPortals && !forcedSubscriber) {
    return (
      <FirstTimeViewerSidebarIntro
        onSwitchToSubscriber={() => {
          setIsGuestMode(false);
          sessionStorage.setItem('dyson_viewer_mode', 'subscriber');
        }}
      />
    );
  }

  // ========================================================
  // SUBSCRIBER DUAL BOX FOR THE 6 PORTALS:
  // 1. TOP BOX: Bob Dyson (Subscriber headshot in black shirt, same size as Charlie)
  // 2. BOTTOM BOX: Charlie Simmons at his studio desk
  // ========================================================
  return (
    <>
      <div 
        className={`w-full p-2.5 sm:p-3 rounded-2xl border text-left shadow-xl transition-all relative overflow-hidden select-none space-y-2.5 ${className}`}
        style={{
          background: 'linear-gradient(160deg, #16130e 0%, #0c0b08 100%)',
          borderColor: `${GOLD}80`,
          boxShadow: '0 8px 24px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.1)',
        }}
      >
        {/* Top Subtle Gold Accent Line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent pointer-events-none" />

        {/* ========================================================
            1. TOP BOX: BOB DYSON (SUBSCRIBER HEADSHOT IN BLACK SHIRT)
            Pulls from subscriber profile, exactly same 16:9 size as Charlie's box
            ======================================================== */}
        <div 
          onClick={handleOpenModal}
          className="relative rounded-xl overflow-hidden border border-[#D4AF37]/60 hover:border-[#D4AF37] shadow-md aspect-[16/9] w-full bg-black group cursor-pointer transition-all duration-300"
          title="Click to view full subscriber profile & move file"
        >
          <img 
            src={photoUrl} 
            alt={displayName} 
            className="w-full h-full object-cover object-[center_18%] transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

          {/* Top-left: Role badge */}
          <div className="absolute top-1.5 left-1.5 z-10">
            <span 
              className="px-2 py-0.2 rounded-full text-[7.5px] font-black uppercase tracking-wider bg-black/80 text-[#D4AF37] border border-[#D4AF37]/60 shadow-sm"
            >
              {roleBadge}
            </span>
          </div>

          {/* Top-right: Active status */}
          <div className="absolute top-1.5 right-1.5 z-10">
            <span className="flex items-center gap-1 text-[8px] font-bold text-[#10b981] bg-black/80 px-1.5 py-0.2 rounded-full border border-[#10b981]/50">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              <span>Active</span>
            </span>
          </div>

          {/* Lower Left Corner: Subscriber Name */}
          <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[9px] font-bold text-white tracking-wide">
            <span className="flex items-center gap-1 drop-shadow">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              <span>{displayName}</span>
            </span>
            <span className="text-[#D4AF37] drop-shadow text-[8px] uppercase tracking-wider font-semibold">
              Edit File ✎
            </span>
          </div>
        </div>

        {/* ========================================================
            2. BOTTOM BOX: CHARLIE SIMMONS AT STUDIO DESK
            Same 16:9 aspect ratio directly below Bob Dyson's box
            ======================================================== */}
        <div 
          onClick={toggleCharlieVoice}
          className={`relative rounded-xl overflow-hidden border shadow-md aspect-[16/9] w-full bg-black group cursor-pointer transition-all duration-300 ${
            isCharliePlaying 
              ? 'border-2 border-[#D4AF37] ring-2 ring-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.6)] scale-[1.01]' 
              : 'border-[#D4AF37]/60 hover:border-[#D4AF37]'
          }`}
          title={isCharliePlaying ? "Click to pause Charlie's voice" : "Click to hear Charlie speak"}
        >
          <img 
            src={CHARLIE_DESK_PHOTO} 
            alt="Charlie Simmons at DNN Studio Desk" 
            className={`w-full h-full object-cover object-top transition-transform duration-500 ${
              isCharliePlaying ? 'scale-105' : 'group-hover:scale-105'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
          
          {/* Play/Speaking Badge in Corner */}
          <div className="absolute top-1.5 right-1.5 z-10">
            <div 
              className={`px-2 py-0.5 rounded-full text-[8.5px] font-bold flex items-center gap-1 shadow-lg border transition-all ${
                isCharliePlaying 
                  ? 'bg-[#D4AF37] text-black border-black animate-pulse' 
                  : 'bg-black/80 text-white/90 border-[#D4AF37]/60 group-hover:border-[#D4AF37] group-hover:text-white'
              }`}
            >
              {isCharliePlaying ? (
                <>
                  <Square className="w-2 h-2 fill-black" />
                  <span className="uppercase tracking-wider text-[7.5px] font-black">Playing</span>
                  <span className="flex items-center gap-0.5">
                    <span className="w-0.5 h-2 bg-black animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-0.5 h-2.5 bg-black animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-0.5 h-2 bg-black animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </>
              ) : (
                <>
                  <Volume2 className="w-2.5 h-2.5 text-[#D4AF37]" />
                  <span className="uppercase tracking-wider text-[7.5px] font-black text-[#D4AF37]">Click to Hear</span>
                </>
              )}
            </div>
          </div>

          {/* Lower Left Corner: Charlie Simmons Name Tag */}
          <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[9px] font-bold text-white tracking-wide">
            <span className="flex items-center gap-1 drop-shadow">
              <span className={`w-1.5 h-1.5 rounded-full ${isCharliePlaying ? 'bg-[#D4AF37] animate-ping' : 'bg-[#10b981] animate-pulse'}`} />
              <span>Charlie Simmons</span>
            </span>
            <span className="text-[#D4AF37] drop-shadow text-[8px] uppercase tracking-wider font-semibold">
              AI Concierge
            </span>
          </div>
        </div>

        {/* Action Row: View / Edit Profile & Switch back to guest if desired */}
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[9px]">
          <button
            type="button"
            onClick={handleOpenModal}
            className="text-[#D4AF37] hover:text-[#e8c84a] font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Edit3 className="w-2.5 h-2.5" />
            <span>Manage Move File</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsGuestMode(true);
              sessionStorage.setItem('dyson_viewer_mode', 'guest');
            }}
            className="text-white/40 hover:text-white transition-colors cursor-pointer text-[8px]"
            title="Switch to 1st Time Guest View"
          >
            1st Timer View
          </button>
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