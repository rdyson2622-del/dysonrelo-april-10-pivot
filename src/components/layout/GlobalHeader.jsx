import React from 'react';
import { Home } from 'lucide-react';
import CommandPills from './CommandPills';

const GOLD = '#D4AF37';

/**
 * GlobalHeader — the PUBLIC top navigation bar visible across all client-facing portals.
 *
 * SECURITY: This header is rendered on client/agent/vendor pages. It contains
 * ONLY the "Studio Home" escape hatch and a non-sensitive portal label. It must
 * NEVER expose links to the Admin dashboard or other restricted portals — that
 * multi-portal switcher lives exclusively in AdminLayout (admin-only).
 */
export default function GlobalHeader({ portalLabel, isAdmin }) {
  const goStudioHome = () => { window.location.href = '/?choose=1'; };

  return (
    <div className="px-4 py-3 flex items-center gap-3" style={{ background: '#0d0d0d', borderBottom: '1px solid rgba(212,175,55,0.25)' }}>
      {/* Studio Home pill — far-left escape hatch */}
      <button
        onClick={goStudioHome}
        className="flex items-center gap-1.5 text-xs font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full transition-all hover:scale-[1.03]"
        style={{ color: GOLD, border: `1px solid ${GOLD}`, background: 'rgba(212,175,55,0.08)' }}
      >
        <Home className="w-3.5 h-3.5" />
        Studio Home
      </button>

      {/* Current portal label (desktop only) */}
      {portalLabel && (
        <span
          className="hidden lg:inline text-[10px] font-black tracking-[0.2em] uppercase px-3 py-1.5 rounded-lg"
          style={{ color: '#fff', background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)' }}
        >
          {portalLabel}
        </span>
      )}

      <div className="flex-1" />

      {/* Admin-only portal pills — aligned to the right of Studio Home row */}
      {isAdmin && <CommandPills />}
    </div>
  );
}