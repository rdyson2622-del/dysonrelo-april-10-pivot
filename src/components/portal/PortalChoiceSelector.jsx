import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Star, Handshake, Wrench, Building2 } from 'lucide-react';

const GOLD = '#D4AF37';

const PATHS = [
  { icon: Home, label: 'Client', sub: 'Full relocation concierge — always free.', dest: '/home', roleKey: 'client' },
  { icon: Star, label: 'Relo Agent', sub: 'Join our vetted agent network.', dest: '/find-agent', roleKey: 'agent' },
  { icon: Handshake, label: 'Inactive Licensed Agents', sub: 'Send us your out-of-state client.', dest: '/partner-benefits', roleKey: 'referral_agent' },
  { icon: Wrench, label: 'Vendor', sub: 'Movers, inspectors & service providers.', dest: '/search', roleKey: 'vendor' },
  { icon: Building2, label: 'Corp Relo / HR', sub: 'White-glove employee relocation.', dest: '/corporate-relo', roleKey: 'hr' },
];

/**
 * PortalChoiceSelector — lets first-time visitors pick which portal fits
 * them so they land in the right subscribed experience going forward.
 */
export default function PortalChoiceSelector() {
  const navigate = useNavigate();

  const handleSelect = (path) => {
    sessionStorage.setItem('dyson_role', path.roleKey);
    window.dispatchEvent(new Event('dyson_role_change'));
    navigate(path.dest);
  };

  return (
    <div>
      <p className="text-center text-xs font-black tracking-[0.2em] uppercase mb-1" style={{ color: GOLD }}>
        Get Started
      </p>
      <h2 className="text-center mb-6 text-lg sm:text-xl font-bold" style={{ color: '#fff' }}>
        Enter a portal that best fits you?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {PATHS.map((path) => (
          <button
            key={path.roleKey}
            onClick={() => handleSelect(path)}
            className="flex flex-col items-center text-center gap-2 px-3 py-5 rounded-xl transition-all hover:scale-[1.03] active:scale-95"
            style={{ background: '#0a0a0a', border: `1.5px solid ${GOLD}` }}
          >
            <path.icon className="w-6 h-6" style={{ color: GOLD }} />
            <span className="text-sm font-black" style={{ color: '#fff' }}>{path.label}</span>
            <span className="text-[11px] leading-snug" style={{ color: 'rgba(255,255,255,0.6)' }}>{path.sub}</span>
          </button>
        ))}
      </div>
    </div>
  );
}