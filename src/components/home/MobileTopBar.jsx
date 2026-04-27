import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const GOLD = '#D4AF37';

export default function MobileTopBar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDashboard = () => navigate('/dashboard');
  const handleHome = () => navigate('/');
  const handleChat = () => navigate('/chat');
  const handleRoadmap = () => navigate('/RelocationRoadmap');
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className="z-[9999]" style={{ height: '44px', background: '#0a0a0a', borderBottom: `1px solid ${GOLD}40`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '16px', paddingRight: '16px', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999, pointerEvents: 'auto' }}>
        <button className="pointer-events-auto" onClick={toggleMenu} style={{ background: 'none', border: 'none', color: GOLD, cursor: 'pointer', padding: '8px', pointerEvents: 'auto' }}>
          <Menu size={24} />
        </button>
        <button className="pointer-events-auto" onClick={handleDashboard} style={{ background: 'none', border: 'none', color: GOLD, cursor: 'pointer', padding: '8px', marginLeft: 'auto', pointerEvents: 'auto' }}>
          Dashboard
        </button>
      </div>

      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 40 }}>
          <div onClick={closeMenu} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)' }} />
          <div style={{ position: 'relative', width: '250px', height: '100vh', background: '#0d0d0d', borderRight: `1px solid ${GOLD}40`, zIndex: 50 }}>
            <div style={{ padding: '16px', borderBottom: `1px solid ${GOLD}20`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: GOLD, fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.1em' }}>MENU</span>
              <button onClick={closeMenu} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', padding: '4px' }}>
                <X size={20} />
              </button>
            </div>
            <nav style={{ padding: '16px' }}>
              {[
                { label: 'Home', handler: () => { handleHome(); closeMenu(); } },
                { label: 'Dashboard', handler: () => { handleDashboard(); closeMenu(); } },
                { label: 'Roadmap', handler: () => { handleRoadmap(); closeMenu(); } },
                { label: 'Chat', handler: () => { handleChat(); closeMenu(); } },
              ].map(item => (
                <button key={item.label}
                  onClick={item.handler}
                  style={{ display: 'block', width: '100%', padding: '12px', marginBottom: '8px', background: 'transparent', border: 'none', color: '#fff', textAlign: 'left', cursor: 'pointer', borderRadius: '8px', fontSize: '14px', fontWeight: '500' }}>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}