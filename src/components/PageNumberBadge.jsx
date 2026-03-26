import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PAGE_REGISTRY } from '@/lib/pageRegistry';
import { getSectionsForPage, getCurrentSection } from '@/lib/sectionRegistry';

export default function PageNumberBadge() {
  const location = useLocation();
  const [currentSection, setCurrentSection] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const section = getCurrentSection(location.pathname, window.scrollY);
      setCurrentSection(section);
    };

    // Check on mount and scroll
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  if (!location?.pathname) return null;

  // Find page number by path
  let pageNumber = null;
  let pageInfo = null;

  const sortedEntries = Object.entries(PAGE_REGISTRY).sort((a, b) => b[1].path.length - a[1].path.length);

  for (const [num, page] of sortedEntries) {
    if (!page?.path) continue;
    
    const pathname = location.pathname;
    const pagePath = page.path;
    
    if (pathname === pagePath) {
      pageNumber = num;
      pageInfo = page;
      break;
    }
    
    if (pagePath.includes(':')) {
      const basePath = pagePath.split(':')[0];
      const baseWithoutSlash = basePath.slice(0, -1);
      
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

  const displayCode = currentSection ? `${pageNumber}${currentSection.code.split('.')[1]}` : `${pageNumber}`;
  const displayTitle = currentSection 
    ? `${pageInfo.name} → ${currentSection.name} (${currentSection.description})`
    : `${pageInfo.name} (${pageInfo.section})`;

  return (
    <div
      className="fixed bottom-4 right-4 z-40 text-xs font-semibold"
      style={{
        color: 'rgba(212,175,55,0.7)',
        opacity: 0.8,
        pointerEvents: 'none',
        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
        background: 'rgba(0,0,0,0.3)',
        padding: '4px 8px',
        borderRadius: '12px',
        backdropFilter: 'blur(4px)',
      }}
      title={displayTitle}
    >
      <span style={{ fontSize: '0.75rem' }}>{displayCode}</span>
    </div>
  );
}