import React from 'react';
import { useLocation } from 'react-router-dom';
import { PAGE_REGISTRY } from '@/lib/pageRegistry';

export default function PageNumberBadge() {
  const location = useLocation();

  if (!location?.pathname) return null;

  // Find page number by path — check exact match first, then dynamic routes
  let pageNumber = null;
  let pageInfo = null;

  // Sort entries by path length (longest first) to match specific routes before general ones
  const sortedEntries = Object.entries(PAGE_REGISTRY).sort((a, b) => b[1].path.length - a[1].path.length);

  for (const [num, page] of sortedEntries) {
    if (!page?.path) continue;
    
    // Exact match
    if (location.pathname === page.path) {
      pageNumber = num;
      pageInfo = page;
      break;
    }
    
    // Dynamic route match (e.g., /AdminOwners/:ownerId)
    const basePath = page.path.split(':')[0]; // e.g., '/AdminOwners/' from '/AdminOwners/:ownerId'
    if (basePath && basePath !== '/' && location.pathname.startsWith(basePath.slice(0, -1))) {
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