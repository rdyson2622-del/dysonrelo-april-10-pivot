import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  User, Edit3, ArrowRight, ShieldCheck, MapPin, 
  Phone, Mail, Calendar, Compass, X, Check, Sparkles, Eye,
  Volume2, Play, Square, Mic
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import FirstTimeViewerSidebarIntro from './FirstTimeViewerSidebarIntro';
import { GeminiLiveSessionClient } from '@/lib/geminiLiveClient';
import { CHARLIE_SIMMONS_SYSTEM_PROMPT, CHARLIE_VOICE_NAME } from '@/lib/charlieSimmonsPrompt';
import { CHARLIE_PORTAL_WELCOME_SCRIPTS, getActivePortalRole } from '@/lib/charliePortalWelcomeScripts';

const GOLD = '#D4AF37';

// Authentic Bob Dyson black-shirt headshot in Base44 storage (single source of truth)
const BOB_PHOTO_PERMANENT = "https://base44.app/api/apps/69d905d72ff7c93b5ef050c4/files/mp/public/69d905d72ff7c93b5ef050c4/09d1d285a_bob_dyson_black_shirt.webp";

// Authentic Charlie Simmons studio desk photo
const CHARLIE_DESK_PHOTO = "https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/2e7121744_Screenshot2026-09-09at25842PM.png";

export default function SubscriberProfileHeader({ 
  onProfileClick,
  className = '',
  forcedSubscriber = null,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = (location?.pathname || '').toLowerCase();

  const [currentUser, setCurrentUser] = useState(null);
  const [savedRole, setSavedRole] = useState(() => sessionStorage.getItem('dyson_role') || 'client');
  const [viewerMode, setViewerMode] = useState(() => sessionStorage.getItem('dyson_viewer_mode') || 'subscriber');

  // Listen to role changes from top command bar
  useEffect(() => {
    const syncRole = () => {
      setSavedRole(sessionStorage.getItem('dyson_role') || 'client');
      setViewerMode(sessionStorage.getItem('dyson_viewer_mode') || 'subscriber');
    };
    window.addEventListener('dyson_role_change', syncRole);
    window.addEventListener('dyson_viewer_mode_change', syncRole);
    return () => {
      window.removeEventListener('dyson_role_change', syncRole);
      window.removeEventListener('dyson_viewer_mode_change', syncRole);
    };
  }, []);

  // Resolve active portal role among the 6 subscriber roles
  const activePortalRole = getActivePortalRole(currentPath, savedRole);
  const welcomeConfig = CHARLIE_PORTAL_WELCOME_SCRIPTS[activePortalRole] || CHARLIE_PORTAL_WELCOME_SCRIPTS.client;

  const isFrontDoor = currentPath === '/' || currentPath === '/portal';
  const isFirstTimeVisitor = savedRole === 'first_time_visitor' || (isFrontDoor && viewerMode === 'guest');

  const [clientRecord, setClientRecord] = useState(null);
  const [subscriberRecord, setSubscriberRecord] = useState(null);
  const [agentRecord, setAgentRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // V2V Two-Way Voice State
  const [v2vStatus, setV2vStatus] = useState('ready'); // ready, connecting, listening, speaking, error
  const [speakerRole, setSpeakerRole] = useState(null); // 'assistant', 'user', null
  const [liveTranscript, setLiveTranscript] = useState('');
  const v2vClientRef = useRef(null);

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

  // End V2V on unmount
  useEffect(() => {
    return () => {
      if (v2vClientRef.current) {
        v2vClientRef.current.stop();
        v2vClientRef.current = null;
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('charlie-speech-active', { detail: { active: false } }));
        window.dispatchEvent(new CustomEvent('v2v-session-state', { detail: { status: 'ready', isActive: false } }));
      }
    };
  }, []);

  // Start / Stop Two-Way V2V Session
  const toggleV2V = async (e) => {
    if (e) e.stopPropagation();

    // If currently active, stop it
    if (v2vClientRef.current) {
      v2vClientRef.current.stop();
      v2vClientRef.current = null;
      setV2vStatus('ready');
      setSpeakerRole(null);
      setLiveTranscript('');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('charlie-speech-active', { detail: { active: false } }));
        window.dispatchEvent(new CustomEvent('v2v-session-state', { detail: { status: 'ready', isActive: false } }));
      }
      return;
    }

    // Launch two-way V2V session starting with Charlie's customized portal welcome back greeting
    try {
      setV2vStatus('connecting');
      setLiveTranscript('');

      const client = new GeminiLiveSessionClient({
        systemPrompt: CHARLIE_SIMMONS_SYSTEM_PROMPT,
        voiceName: CHARLIE_VOICE_NAME,
        openingGreetingText: welcomeConfig.script,
        openingGreetingAudioUrl: welcomeConfig.audioUrl,
        onStatusChange: (status) => {
          setV2vStatus(status);
          const active = status === 'listening' || status === 'speaking' || status === 'connecting';
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('charlie-speech-active', { detail: { active } }));
            window.dispatchEvent(new CustomEvent('v2v-session-state', { detail: { status, isActive: active } }));
          }
        },
        onTranscript: (t) => {
          if (t?.text) setLiveTranscript(t.text);
        },
        onSpeaker: (role) => {
          setSpeakerRole(role);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('v2v-speaker-change', { detail: { speaker: role } }));
          }
        },
        onError: (err) => {
          console.warn('V2V session error:', err);
          setV2vStatus('error');
        },
        onNavigate: (nav) => {
          if (nav?.path) navigate(nav.path);
        },
      });

      v2vClientRef.current = client;
      await client.start();
    } catch (err) {
      console.error('Failed to start V2V session:', err);
      setV2vStatus('error');
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function loadSubscriberData() {
      try {
        const me = await base44.auth.me().catch(() => null);
        if (me && isMounted) setCurrentUser(me);

        // Fetch Relocation Client data
        const clients = await base44.entities.RelocationClient.list('-created_date', 1).catch(() => []);
        if (clients && clients.length > 0 && isMounted) {
          setClientRecord(clients[0]);
        }

        // Fetch DnnSubscriber data
        if (me?.email) {
          const subs = await base44.entities.DnnSubscriber.filter({ email: me.email }, '-created_date', 1).catch(() => []);
          if (subs && subs.length > 0 && isMounted) {
            setSubscriberRecord(subs[0]);
          }
        }

        // Fetch ActiveRelocationAgent if applicable
        if (activePortalRole === 'agent' || me?.email) {
          const agents = await base44.entities.ActiveRelocationAgent.list('-created_date', 1).catch(() => []);
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
  }, [activePortalRole]);

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

  // Role Badge info tailored to the active portal
  const roleBadge = welcomeConfig.roleLabel;

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
      role_type: activePortalRole,
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
  // Strictly reserved for the 1st timer / cold visitor on Front Door
  if (isFirstTimeVisitor && !forcedSubscriber) {
    return (
      <FirstTimeViewerSidebarIntro
        onSwitchToSubscriber={() => {
          sessionStorage.setItem('dyson_viewer_mode', 'subscriber');
          sessionStorage.setItem('dyson_role', 'client');
          window.dispatchEvent(new Event('dyson_role_change'));
          window.dispatchEvent(new Event('dyson_viewer_mode_change'));
        }}
      />
    );
  }

  const isV2VActive = v2vStatus === 'listening' || v2vStatus === 'speaking' || v2vStatus === 'connecting';
  const isCharlieSpeaking = isV2VActive && (speakerRole === 'assistant' || v2vStatus === 'speaking');
  const isUserSpeaking = isV2VActive && (speakerRole === 'user' || v2vStatus === 'listening');

  // ========================================================
  // SUBSCRIBER DUAL BOX FOR ALL 6 PORTALS:
  // 1. TOP BOX: Bob Dyson (Subscriber headshot in black shirt, properly framed)
  // 2. BOTTOM BOX: Charlie Simmons at his studio desk with 2-way V2V wiring
  // 3. Welcome back message with exact required closing sentence
  // ========================================================
  return (
    <>
      <div 
        className={`w-full p-2.5 sm:p-3 rounded-2xl border text-left shadow-xl transition-all relative overflow-hidden select-none space-y-2.5 ${className}`}
        style={{
          background: 'linear-gradient(160deg, #16130e 0%, #0c0b08 100%)',
          borderColor: isV2VActive ? (isCharlieSpeaking ? GOLD : '#10b981') : `${GOLD}80`,
          boxShadow: isV2VActive 
            ? '0 0 25px rgba(212,175,55,0.35), 0 8px 24px rgba(0,0,0,0.8)' 
            : '0 8px 24px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.1)',
        }}
      >
        {/* Top Subtle Gold Accent Line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent pointer-events-none" />

        {/* ========================================================
            1. TOP BOX: BOB DYSON (SUBSCRIBER HEADSHOT IN BLACK SHIRT)
            Pulls from subscriber profile, framed cleanly showing head, face, and black shirt!
            ======================================================== */}
        <div 
          onClick={handleOpenModal}
          className="relative rounded-xl overflow-hidden border border-[#D4AF37]/60 hover:border-[#D4AF37] shadow-md aspect-[16/9] w-full bg-black group cursor-pointer transition-all duration-300 flex items-center justify-center"
          title="Click to view full subscriber profile & move file"
        >
          {/* Ambient blurred backdrop fill to keep 16:9 studio depth without pillarboxing */}
          <img 
            src={photoUrl} 
            alt="" 
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-[center_30%] filter blur-lg opacity-40 scale-125 pointer-events-none"
          />

          {/* Uncropped, natural Bob Dyson headshot displaying full head, face, collar, and black shirt */}
          <img 
            src={photoUrl} 
            alt={displayName} 
            className="relative z-0 h-full w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent pointer-events-none z-10" />

          {/* Top-left: Role badge */}
          <div className="absolute top-1.5 left-1.5 z-20">
            <span 
              className="px-2 py-0.5 rounded-full text-[7.5px] font-black uppercase tracking-wider bg-black/80 text-[#D4AF37] border border-[#D4AF37]/60 shadow-sm"
            >
              {roleBadge}
            </span>
          </div>

          {/* Top-right: Active status */}
          <div className="absolute top-1.5 right-1.5 z-20">
            <span className="flex items-center gap-1 text-[8px] font-bold text-[#10b981] bg-black/80 px-1.5 py-0.5 rounded-full border border-[#10b981]/50">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              <span>Active</span>
            </span>
          </div>

          {/* Lower Left Corner: Subscriber Name */}
          <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[9px] font-bold text-white tracking-wide z-20">
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
            Wired for Two-Way V2V communication!
            ======================================================== */}
        <div 
          onClick={toggleV2V}
          className={`relative rounded-xl overflow-hidden border shadow-md aspect-[16/9] w-full bg-black group cursor-pointer transition-all duration-300 ${
            isCharlieSpeaking 
              ? 'border-2 border-[#D4AF37] ring-4 ring-[#D4AF37]/50 shadow-[0_0_25px_rgba(212,175,55,0.6)] scale-[1.01]' 
              : isUserSpeaking
              ? 'border-2 border-emerald-400 ring-4 ring-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.5)] scale-[1.01]'
              : isV2VActive
              ? 'border-2 border-[#D4AF37] ring-2 ring-[#D4AF37]/30'
              : 'border-[#D4AF37]/60 hover:border-[#D4AF37]'
          }`}
          title={isV2VActive ? "Live V2V Connected — Click to disconnect" : "Click to hear Charlie and begin two-way voice conversation"}
        >
          <img 
            src={CHARLIE_DESK_PHOTO} 
            alt="Charlie Simmons at DNN Studio Desk" 
            className={`w-full h-full object-cover object-top transition-transform duration-500 ${
              isV2VActive ? 'scale-105' : 'group-hover:scale-105'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
          
          {/* Top-Right: Two-Way V2V Live Indicator Badge */}
          <div className="absolute top-1.5 right-1.5 z-10">
            <div 
              className={`px-2 py-0.5 rounded-full text-[8.5px] font-bold flex items-center gap-1 shadow-lg border transition-all ${
                isCharlieSpeaking 
                  ? 'bg-[#D4AF37] text-black border-black animate-pulse' 
                  : isUserSpeaking
                  ? 'bg-emerald-400 text-black border-black animate-pulse'
                  : isV2VActive
                  ? 'bg-black/90 text-[#D4AF37] border-[#D4AF37]'
                  : 'bg-black/80 text-white/90 border-[#D4AF37]/60 group-hover:border-[#D4AF37] group-hover:text-white'
              }`}
            >
              {isCharlieSpeaking ? (
                <>
                  <Volume2 className="w-2.5 h-2.5 fill-black" />
                  <span className="uppercase tracking-wider text-[7.5px] font-black">Speaking</span>
                  <span className="flex items-center gap-0.5">
                    <span className="w-0.5 h-2 bg-black animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-0.5 h-2.5 bg-black animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-0.5 h-2 bg-black animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </>
              ) : isUserSpeaking ? (
                <>
                  <Mic className="w-2.5 h-2.5 fill-black" />
                  <span className="uppercase tracking-wider text-[7.5px] font-black">Listening</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                </>
              ) : isV2VActive ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                  <span className="uppercase tracking-wider text-[7.5px] font-black text-emerald-400">V2V Active</span>
                </>
              ) : (
                <>
                  <Mic className="w-2.5 h-2.5 text-[#D4AF37]" />
                  <span className="uppercase tracking-wider text-[7.5px] font-black text-[#D4AF37]">Tap for 2-Way V2V</span>
                </>
              )}
            </div>
          </div>

          {/* Lower Left Corner: Charlie Simmons Name Tag */}
          <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[9px] font-bold text-white tracking-wide">
            <span className="flex items-center gap-1 drop-shadow">
              <span className={`w-1.5 h-1.5 rounded-full ${isV2VActive ? (isCharlieSpeaking ? 'bg-[#D4AF37] animate-ping' : 'bg-emerald-400 animate-ping') : 'bg-[#10b981] animate-pulse'}`} />
              <span>Charlie Simmons</span>
            </span>
            <span className="text-[#D4AF37] drop-shadow text-[8px] uppercase tracking-wider font-semibold">
              AI Concierge
            </span>
          </div>
        </div>

        {/* ========================================================
            3. TWO-WAY V2V CONNECTION BAR (Interactive Voice Bridge)
            ======================================================== */}
        <div 
          className="w-full flex items-center justify-between px-2.5 py-1 rounded-xl shadow-md text-[9px] font-bold"
          style={{
            background: 'linear-gradient(90deg, #18140e 0%, #0d0b07 100%)',
            border: `1px solid ${isV2VActive ? (isCharlieSpeaking ? GOLD : '#10b981') : `${GOLD}60`}`,
          }}
        >
          <div className="flex items-center gap-1.5 min-w-0 pr-1">
            <span 
              className={`w-2 h-2 rounded-full shrink-0 ${
                isCharlieSpeaking ? 'bg-[#D4AF37] animate-ping' : isUserSpeaking ? 'bg-emerald-400 animate-ping' : isV2VActive ? 'bg-emerald-400' : 'bg-[#D4AF37]'
              }`} 
            />
            <span className="text-[#D4AF37] tracking-wider uppercase font-sans truncate text-[8.5px]">
              {isCharlieSpeaking ? 'Charlie Speaking…' : isUserSpeaking ? 'Listening to You…' : isV2VActive ? 'Two-Way V2V Active' : '2-Way Voice Communication'}
            </span>
          </div>

          <button
            type="button"
            onClick={toggleV2V}
            className={`px-2.5 py-1 rounded-lg text-[8.5px] font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 shadow-sm flex items-center gap-1 ${
              isV2VActive
                ? 'bg-red-500/25 text-red-300 border border-red-500/50 hover:bg-red-500/40'
                : 'bg-[#D4AF37] text-black hover:bg-[#e8c84a]'
            }`}
          >
            {isV2VActive ? (
              <>
                <Square className="w-2 h-2 fill-current" />
                <span>End Call</span>
              </>
            ) : (
              <>
                <Mic className="w-2.5 h-2.5" />
                <span>Talk to Charlie</span>
              </>
            )}
          </button>
        </div>

        {/* ========================================================
            4. CHARLIE WELCOME BACK MESSAGE (CUSTOM FOR EACH OF THE 6 PORTALS)
            Strictly ends with:
            "All your tools and services are outlined below in your mini apps which display on your main page and we can discuss anything throughout your visit."
            ======================================================== */}
        <div className="space-y-1 pt-0.5">
          <div className="flex items-center justify-between gap-1">
            <h3 
              className="text-xs sm:text-[13px] font-bold text-white tracking-tight leading-tight"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {welcomeConfig.welcomeHeading}
            </h3>
            <span className="text-[7.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/70 border border-[#D4AF37]/50 text-[#D4AF37]">
              {welcomeConfig.badge}
            </span>
          </div>
          
          <p className="text-[10px] sm:text-[10.5px] text-white/90 leading-relaxed font-normal">
            {welcomeConfig.script}
          </p>
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
              sessionStorage.setItem('dyson_viewer_mode', 'guest');
              sessionStorage.setItem('dyson_role', 'first_time_visitor');
              window.dispatchEvent(new Event('dyson_role_change'));
              window.dispatchEvent(new Event('dyson_viewer_mode_change'));
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