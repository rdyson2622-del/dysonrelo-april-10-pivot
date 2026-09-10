import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, LogOut, UserCheck, ShieldCheck, ChevronDown, Sparkles, Building, Compass } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';

export default function SubscriberSignInButton({ className = '' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute portal destination based on user profile/role
  const resolvePortalPath = () => {
    if (!user) return '/portal';
    if (user.role === 'admin') return '/admin';
    const pRole = user.portal_role || sessionStorage.getItem('dyson_role');
    if (pRole === 'brokerage_admin' || pRole === 'broker') return '/brokerage';
    if (pRole === 'agent') return '/agent-command-center';
    if (pRole === 'referral_agent' || pRole === 'inactive_agent') return '/partner-benefits';
    if (pRole === 'hr') return '/corporate-relo';
    if (pRole === 'vendor') return '/search';
    return '/home';
  };

  const displayName = user?.full_name || user?.email?.split('@')[0] || 'Subscriber';
  const roleLabel = user?.role === 'admin' 
    ? 'Admin Console' 
    : (user?.portal_role ? user.portal_role.toUpperCase() : 'SUBSCRIBER');

  const handleSignInClick = () => {
    const currentPath = location.pathname + location.search;
    const returnTo = currentPath === '/login' || currentPath === '/register' ? '/portal' : currentPath;
    navigate(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  };

  const handleSignOut = () => {
    setDropdownOpen(false);
    sessionStorage.removeItem('dyson_role');
    sessionStorage.setItem('dyson_viewer_mode', 'guest');
    logout(false);
    window.location.href = '/portal';
  };

  // If NOT authenticated, show prominent "Subscriber Sign In" button
  if (!isAuthenticated || !user) {
    return (
      <button
        type="button"
        onClick={handleSignInClick}
        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md shrink-0 border ${className}`}
        style={{
          background: 'linear-gradient(135deg, #1c1810 0%, #0d0c08 100%)',
          borderColor: `${GOLD}99`,
          color: GOLD,
          boxShadow: '0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(212,175,55,0.2)',
        }}
        title="Sign in to your DysonRelo Subscriber Workspace"
      >
        <LogIn className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span className="tracking-wide">Subscriber Sign In</span>
        <span 
          className="hidden md:inline-block text-[8px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-full text-black bg-[#D4AF37] ml-0.5"
        >
          Portal
        </span>
      </button>
    );
  }

  // If AUTHENTICATED, show personalized subscriber badge with dropdown menu
  return (
    <div className={`relative shrink-0 ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold transition-all hover:border-[#D4AF37] cursor-pointer shadow-md border"
        style={{
          background: 'linear-gradient(135deg, #1c1810 0%, #0d0c08 100%)',
          borderColor: `${GOLD}80`,
          color: '#ffffff',
        }}
        title={`Signed in as ${displayName} (${roleLabel})`}
      >
        <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse shrink-0" />
        <span className="text-[#D4AF37] font-semibold truncate max-w-[110px] sm:max-w-[140px]">
          {displayName}
        </span>
        <span className="hidden sm:inline-block text-[8px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-full text-black bg-[#D4AF37]">
          {roleLabel}
        </span>
        <ChevronDown className="w-3 h-3 text-[#D4AF37]/80" />
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div 
          className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0d0c08] border border-[#D4AF37]/70 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-left text-xs"
          style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.85)' }}
        >
          {/* User Header */}
          <div className="px-3 py-2 border-b border-white/10 mb-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
              Signed In Subscriber
            </div>
            <div className="font-bold text-white truncate text-sm">
              {displayName}
            </div>
            <div className="text-[10px] text-white/50 truncate">
              {user.email}
            </div>
          </div>

          {/* Quick Links */}
          <button
            type="button"
            onClick={() => {
              setDropdownOpen(false);
              navigate(resolvePortalPath());
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer font-medium text-left"
          >
            <Building className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Open My Workspace</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setDropdownOpen(false);
              navigate('/client-roadmap');
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer font-medium text-left"
          >
            <Compass className="w-3.5 h-3.5 text-[#10b981]" />
            <span>Move Roadmap &amp; Intake</span>
          </button>

          {user.role === 'admin' && (
            <button
              type="button"
              onClick={() => {
                setDropdownOpen(false);
                navigate('/admin');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#D4AF37] hover:bg-white/10 transition-colors cursor-pointer font-bold text-left"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Admin Console</span>
            </button>
          )}

          {/* Sign Out */}
          <div className="pt-1 mt-1 border-t border-white/10">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer font-medium text-left"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}