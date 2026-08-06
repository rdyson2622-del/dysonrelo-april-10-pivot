import React from 'react';
import { Link } from 'react-router-dom';
import DnnBroadcastArchive from '@/components/dnn/DnnBroadcastArchive';

const DNN_LOGO = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/08d73fd44_DNNOPTIONALLOGO.png';
const GOLD = '#D4AF37';

/**
 * DnnBroadcastArchivePage — standalone, portal-accessible archive of every
 * completed DNN studio show (past + current). Consumers and all portal roles
 * can reach this route; admins get edit/delete on each card.
 */
export default function DnnBroadcastArchivePage() {
  return (
    <div className="min-h-screen" style={{ background: '#ede0cc' }}>
      {/* Header */}
      <div className="sticky top-0 z-20 px-6 md:px-12 py-4 flex items-center justify-between"
        style={{ background: '#1a1a1a', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
        <div className="flex items-center gap-4">
          <img src={DNN_LOGO} alt="DNN" className="h-10 w-auto" />
          <div>
            <p className="text-sm font-black tracking-[0.35em] uppercase" style={{ color: GOLD }}>DNN</p>
            <p className="text-xs tracking-widest uppercase text-white">Broadcast Archive</p>
          </div>
        </div>
        <Link to="/dnn-news" className="text-xs font-bold tracking-widest uppercase" style={{ color: GOLD }}>← Back to News</Link>
      </div>

      {/* Hero */}
      <div className="w-full px-6 md:px-16 py-10 text-center" style={{ borderBottom: '1px solid rgba(212,175,55,0.12)' }}>
        <h1 className="display-heading mb-2" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', letterSpacing: '0.15em', color: '#1a1a1a' }}>BROADCAST ARCHIVE</h1>
        <p className="text-sm mx-auto" style={{ color: '#4a4a4a', maxWidth: '560px' }}>
          Every DNN studio show — past and current — in one place. Consistent daily real estate intelligence, on demand.
        </p>
      </div>

      {/* Archive */}
      <div className="w-full px-6 md:px-12 lg:px-20 py-10 max-w-7xl mx-auto">
        <DnnBroadcastArchive />
      </div>
    </div>
  );
}