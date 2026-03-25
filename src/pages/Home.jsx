import React from 'react';

const Home = () => {
  return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#fff', textAlign: 'center', padding: '20px' }}>
      <div>
        <h1 style={{ fontSize: '56px', fontWeight: 'bold', marginBottom: '20px', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Your High-Probability Relocation Strategy</h1>
        <p style={{ fontSize: '18px', maxWidth: '800px', margin: '0 auto 40px', color: '#ccc' }}>Surgical data and expert vetting for committed home buyers.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
          <button 
            onClick={() => {
              const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
              if (audioCtx.state === 'suspended') { audioCtx.resume(); }
              alert("Dyson Voice Protocol Enabled. Charlie is standing by.");
            }}
            style={{ padding: '12px 30px', background: 'transparent', color: '#D4AF37', border: '2px solid #D4AF37', borderRadius: '30px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '0.05em' }}
          >
            ENABLE CHARLIE VOICE CONCIERGE
          </button>

          <button 
            onClick={() => window.location.href='/CityGuide'}
            style={{ padding: '14px 50px', background: '#D4AF37', color: '#000', fontWeight: 'bold', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '16px', letterSpacing: '0.02em' }}
          >
            START YOUR SEARCH
          </button>
        </div>
      </div>
    </section>
  );
};

export default Home;