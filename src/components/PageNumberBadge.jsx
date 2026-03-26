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
    
    const pathname = location.pathname;
    const pagePath = page.path;
    
    // Exact match (e.g., '/Dashboard' === '/Dashboard')
    if (pathname === pagePath) {
      pageNumber = num;
      pageInfo = page;
      break;
    }
    
    // Dynamic route match (e.g., '/AdminOwners/123' matches '/AdminOwners/:ownerId')
    // Check if pagePath has a param and pathname starts with the base
    if (pagePath.includes(':')) {
      const basePath = pagePath.split(':')[0]; // '/AdminOwners/' from '/AdminOwners/:ownerId'
      const baseWithoutSlash = basePath.slice(0, -1); // '/AdminOwners'
      
      if (pathname.startsWith(baseWithoutSlash) && pathname !== baseWithoutSlash) {
        pageNumber = num;
        pageInfo = page;
        break;
      }
    }
  }

  if (!pageNumber || !pageInfo) {
    console.warn('No page found for path:', location.pathname);
    return null;
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-40 text-xs font-semibold"
      style={{
        color: 'rgba(212,175,55,0.7)',
        opacity: 0.8,
        pointerEvents: 'none',
        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
      }}
      title={`${pageInfo.name} (${pageInfo.section})`}
    >
      <span style={{ fontSize: '0.75rem' }}>#{pageNumber}</span>
    </div>
  );
}