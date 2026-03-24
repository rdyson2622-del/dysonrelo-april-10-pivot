import { useEffect, useState } from 'react';

const WATCHED_IDS = ['101', '102', '103', '104', '105', '106', '201', '202', '203', '204', '205', '301', '302', '303'];

const TAG_STYLE = {
  position: 'fixed',
  bottom: '10px',
  right: '10px',
  background: 'rgba(0,0,0,0.8)',
  color: '#FFD700',
  padding: '4px 8px',
  fontSize: '14px',
  fontWeight: 'bold',
  zIndex: 999999,
  borderRadius: '4px',
  border: '1px solid #FFD700',
  pointerEvents: 'none',
  transition: 'opacity 0.2s ease',
};

export default function SectionTag() {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const observers = [];

    const observe = () => {
      WATCHED_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setActiveId(id);
            }
          },
          { threshold: 0.1 }
        );

        observer.observe(el);
        observers.push(observer);
      });
    };

    // Small delay to let pages render their elements
    const timer = setTimeout(observe, 300);

    return () => {
      clearTimeout(timer);
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  // Re-run observer on route changes
  useEffect(() => {
    setActiveId(null);
    const observers = [];

    const timer = setTimeout(() => {
      WATCHED_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) setActiveId(id);
          },
          { threshold: 0.1 }
        );

        observer.observe(el);
        observers.push(observer);
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      observers.forEach((o) => o.disconnect());
    };
  }, [window.location.pathname]);

  if (!activeId) return null;

  return (
    <div style={TAG_STYLE}>
      #{activeId}
    </div>
  );
}