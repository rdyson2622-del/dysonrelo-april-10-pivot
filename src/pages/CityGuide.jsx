// FORCE-WRITE OVERRIDE FOR CITYGUIDE.JSX
import React from 'react';
import { Lock, MessageSquare } from 'lucide-react';

const CityGuide = () => {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#fff', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      
      {/* SECTION #301 - SEARCH AREA */}
      <section id="301" style={{ position: 'relative', marginBottom: '60px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>Deep-Dive Research for your High-Probability Property</h2>
        <div style={{ display: 'flex', gap: '10px', maxWidth: '600px' }}>
          <input type="text" placeholder="Enter City, State..." style={{ flex: 1, padding: '12px', border: '2px solid #000', borderRadius: '4px' }} />
          <button style={{ padding: '12px 24px', background: '#000', color: '#fff', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}>GO</button>
        </div>
        
        {/* THE PULSING CONCIERGE BUTTON */}
        <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
          <button 
            onClick={() => window.location.href='/Chat?prefill=I have an urgent research request for the Dyson Admin Team regarding...'}
            className="dyson-pulse"
            style={{ padding: '15px 30px', background: '#D4AF37', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            REQUEST DYSON TEAM RESEARCH
          </button>
          
          <button disabled style={{ padding: '15px 30px', background: '#ccc', color: '#666', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={18} /> START AI DEEP DIVE (30 MIN PASS)
          </button>
        </div>
      </section>

      {/* SECTION #302 - THE 6-CATEGORY GRID */}
      <section id="302" style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '10px' }}>NEIGHBORHOODS</h3>
          <p style={{ fontSize: '15px', color: '#333', lineHeight: '1.4' }}>Dyson Analysis: Mapping commute-to-lifestyle ratios and appreciation trends to find your perfect fit.</p>
        </div>
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '10px' }}>SCHOOLS</h3>
          <p style={{ fontSize: '15px', color: '#333', lineHeight: '1.4' }}>District Deep-Dive: Evaluating boundaries, private options, and specialized programs beyond simple test scores.</p>
        </div>
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '10px' }}>HEALTHCARE</h3>
          <p style={{ fontSize: '15px', color: '#333', lineHeight: '1.4' }}>Specialist Mapping: Locating top-rated hospital networks and specific providers based on your family needs.</p>
        </div>
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '10px' }}>COST OF LIVING</h3>
          <p style={{ fontSize: '15px', color: '#333', lineHeight: '1.4' }}>Real-World Math: Calculating local tax impacts, utility averages, and true cost-to-carry for this specific zip code.</p>
        </div>
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '10px' }}>PARKS & REC</h3>
          <p style={{ fontSize: '15px', color: '#333', lineHeight: '1.4' }}>Lifestyle Hubs: Identifying green-space proximity, trail access, and community-centric recreation zones.</p>
        </div>
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '10px' }}>CULTURE & DINING</h3>
          <p style={{ fontSize: '15px', color: '#333', lineHeight: '1.4' }}>The Social Fabric: A curated look at the culinary staples, local "vibe," and the actual social fabric of the area.</p>
        </div>
      </section>

      {/* THE WHITE-ON-BLACK DISCLAIMER */}
      <div style={{ marginTop: '40px', background: '#000', color: '#fff', padding: '20px', borderRadius: '4px', textAlign: 'center', fontWeight: 'bold', letterSpacing: '0.5px' }}>
        NOTE: AI DEEP DIVES ARE RESERVED FOR HIGH-PROBABILITY PROPERTIES TO ENSURE PINPOINT ACCURACY BEFORE YOUR OFFER.
      </div>

      {/* STATIC HUD NUMBERS */}
      <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#000', color: '#D4AF37', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', borderRadius: '4px', border: '1px solid #D4AF37' }}>#301</div>
      <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: '#000', color: '#D4AF37', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', borderRadius: '4px', border: '1px solid #D4AF37' }}>#303</div>

      {/* PULSE CSS */}
      <style>{`
        .dyson-pulse {
          animation: pulse-gold 2s infinite;
        }
        @keyframes pulse-gold {
          0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(212, 175, 55, 0); }
          100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
        }
      `}</style>
    </div>
  );
};

export default CityGuide;