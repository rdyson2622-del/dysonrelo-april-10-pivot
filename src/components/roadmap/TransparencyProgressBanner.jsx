import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, ArrowRight, X } from 'lucide-react';

const GOLD = '#D4AF37';
const DISMISS_KEY = 'transparency-banner-dismissed';

/**
 * TransparencyProgressBanner — a slim, dismissible banner that explains
 * our transparent workflow monitoring system and links to the Master Show Sheet
 * where subscribers see their progress dummies / live roadmaps.
 *
 * Mounted once in AppLayout so it appears on every consumer content page.
 */
export default function TransparencyProgressBanner() {
  const location = useLocation();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === 'true');
  }, []);

  // Don't show on the show sheet itself or if dismissed
  if (location.pathname === '/master-show-sheet' || dismissed) return null;

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, 'true');
    setDismissed(true);
  };

  return (
    <div className="px-4 pt-3">
      <div
        className="flex items-center gap-3 rounded-xl px-4 py-2.5"
        style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.4)' }}
        >
          <MapPin className="w-3.5 h-3.5" style={{ color: GOLD }} />
        </div>
        <p className="text-xs text-gray-300 flex-1 hidden sm:block leading-snug">
          <span className="font-bold" style={{ color: GOLD }}>Transparent Workflow:</span>{' '}
          Every request is tracked on a live Roadmap — AGI agents work your request, flag issues, and report accomplishments in real time.
        </p>
        <p className="text-xs text-gray-300 flex-1 sm:hidden">
          <span className="font-bold" style={{ color: GOLD }}>Track your progress</span>
        </p>
        <Link
          to="/master-show-sheet"
          className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg text-black transition-all hover:scale-[1.03] shrink-0"
          style={{ background: GOLD }}
        >
          View My Roadmap
          <ArrowRight className="w-3 h-3" />
        </Link>
        <button
          onClick={handleDismiss}
          className="text-gray-500 hover:text-white shrink-0"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}