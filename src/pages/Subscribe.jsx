import React, { useEffect, useState } from 'react';
import RoleSubscriptionDeck from '@/components/admin/frontdoor/RoleSubscriptionDeck';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const GOLD = '#D4AF37';
const DYSON_LOGO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b57d0bb4c61271a073eceb/fa3407553_Screenshot2026-02-20at90227PM.png";
const DNN_LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/08d73fd44_DNNOPTIONALLOGO.png';

export default function Subscribe() {
  const [initialRole, setInitialRole] = useState('client');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const r = params.get('role');
    if (r) {
      setInitialRole(r);
    }
  }, []);

  return (
    <div className="min-h-screen px-4 sm:px-8 py-8" style={{ background: '#ede0cc' }}>
      <div className="max-w-6xl mx-auto">
        {/* Navigation back bar */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/admin/front-door-lab"
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all hover:scale-105"
            style={{ background: '#0a0a0a', color: GOLD, border: `1px solid ${GOLD}` }}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to DysonHomes Front Door
          </Link>
          <div className="flex items-center gap-6">
            <img src={DYSON_LOGO} alt="Dyson & Dyson" className="h-8 w-auto object-contain" />
            <img src={DNN_LOGO} alt="DNN" className="h-7 w-auto object-contain" />
          </div>
        </div>

        {/* Unified Role Subscription Console */}
        <RoleSubscriptionDeck activeRole={initialRole} onSelectRole={setInitialRole} />
      </div>
    </div>
  );
}