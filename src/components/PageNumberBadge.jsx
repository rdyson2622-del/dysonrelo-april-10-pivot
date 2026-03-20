import React from 'react';
import { useLocation } from 'react-router-dom';
import { PAGE_REGISTRY } from '@/lib/pageRegistry';

export default function PageNumberBadge() {
  const location = useLocation();

  if (!location?.pathname) return null;

  // Find page number by path
  let pageNumber = null;
  let pageInfo = null;

  for (const [num, page] of Object.entries(PAGE_REGISTRY)) {
    if (!page?.path) continue;
    
    const basePath = page.path.split(':')[0]; // e.g., '/AdminOwners/' from '/AdminOwners/:ownerId'
    
    if (location.pathname === page.path || location.pathname.startsWith(basePath)) {
      pageNumber = num;
      pageInfo = page;
      break;
    }
  }

  if (!pageNumber || !pageInfo) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-40 px-4 py-2.5 rounded-full text-xs font-bold tracking-widest flex items-center gap-2"
      style={{
        background: 'linear-gradient(135deg, #D4AF37, #B8860B)',
        color: '#000',
        boxShadow: '0 4px 16px rgba(212,175,55,0.3)',
      }}
      title={`${pageInfo.name} (${pageInfo.section})`}
    >
      <span>PAGE</span>
      <span style={{ fontSize: '1.1rem', fontWeight: 900 }}>{pageNumber}</span>
    </div>
  );
}