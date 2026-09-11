import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

const PORTAL_HOMES = {
  client: '/home',
  agent: '/agent-command-center',
  referral_agent: '/partner-benefits',
  vendor: '/search',
  hr: '/corporate-relo',
};

const PORTAL_ROUTES = {
  '/home': 'client',
  '/dashboard': 'client',
  '/relocation-intake': 'client',
  '/subscribe': 'client',
  '/find-agent': 'agent',
  '/agent-command-center': 'agent',
  '/agent-subscribe': 'agent',
  '/agent-invited-clients': 'agent',
  '/national-directory': 'agent',
  '/partner-benefits': 'referral_agent',
  '/search': 'vendor',
  '/corporate-relo': 'hr',
};

const getSavedPortal = () => {
  try { return JSON.parse(localStorage.getItem('dyson_portal')); }
  catch { return null; }
};

export default function PortalAccessGuard({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    // 2-second timeout: if auth.me() takes longer, treat as guest and don't block
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('auth_timeout')), 2000)
    );

    Promise.race([base44.auth.me(), timeoutPromise])
      .then(user => {
        if (!active) return;
        if (user?.role === 'admin') return;

        const assigned = user?.portal_role || getSavedPortal()?.roleKey;
        if (assigned) {
          sessionStorage.setItem('dyson_role', assigned);
          window.dispatchEvent(new Event('dyson_role_change'));
        }

        const pathLower = location.pathname.toLowerCase();

        // Guests can freely view /talking-app and /partner-benefits without login
        if (!user && (pathLower === '/talking-app' || pathLower === '/partner-benefits')) {
          return;
        }

        const requested = (pathLower.startsWith('/vetted-agents/') || pathLower.startsWith('/agent-workfile'))
          ? 'agent'
          : PORTAL_ROUTES[pathLower];

        // Only redirect if an authenticated user with an assigned portal_role mismatches the page
        if (user && assigned && requested && requested !== assigned) {
          navigate(PORTAL_HOMES[assigned] || '/?choose=1', { replace: true });
        }
      })
      .catch(() => {
        // Timeout or unauthenticated: treat as guest and keep page visible
      });

    return () => {
      active = false;
    };
  }, [location.pathname, navigate]);

  // Immediately render children — never block first paint with a full-screen black screen
  return children;
}