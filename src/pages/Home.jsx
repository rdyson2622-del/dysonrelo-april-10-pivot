import React from 'react';
import { MessageSquare, ShieldCheck, Zap, Star } from 'lucide-react';

const Home = () => {
  return (
    <div style={{ position: 'relative', background: '#fff', fontFamily: 'sans-serif' }}>
      
      {/* SECTION #101 - HERO SECTION */}
      <section id="101" style={{ position: 'relative', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#fff', textAlign: 'center', padding: '20px' }}>
        <div>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px' }}>Your High-Probability Relocation Strategy</h1>
          <p style={{ fontSize: '20px', maxWidth: '800px', margin: '0 auto 30px' }}>Surgical data and expert vetting for committed home buyers.</p>
          
          {/* CHARLIE AUDIO UNLOCK PROTOCOL */}
          <div style={{ marginBottom: '20px' }}>
            <button 
              onClick={() => {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                if (audioCtx.state === 'suspended') { audioCtx.resume(); }
                alert("Dyson Voice Protocol Enabled. Charlie is standing by.");
              }}
              style={{ padding: '10px 20px', background: 'transparent', color: '#D4AF37', border: '2px solid #D4AF37', borderRadius: '30px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              ENABLE CHARLIE VOICE CONCIERGE
            </button>
          </div>

          <button 
            onClick={() => window.location.href='/CityGuide'}
            style={{ padding: '15px 40px', background: '#D4AF37', color: '#000', fontWeight: 'bold', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
          >
            START YOUR SEARCH
          </button>
        </div>
        <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#000', color: '#D4AF37', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', borderRadius: '4px', border: '1px solid #D4AF37' }}>#101</div>
      </section>

      {/* SECTION #102 - CHARLIE INTRO */}
      <section id="102" style={{ position: 'relative', padding: '60px 20px', background: '#f9f9f9', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '15px', border: '1px solid #D4AF37' }}>
          <MessageSquare size={48} color="#D4AF37" style={{ marginBottom: '20px' }} />
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Meet Charlie: Your Relocation Orchestrator</h2>
          <p style={{ color: '#666', marginTop: '15px' }}>Charlie is your 24/7 direct line to the Dyson Admin team.</p>
        </div>
        <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#000', color: '#D4AF37', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', borderRadius: '4px', border: '1px solid #D4AF37' }}>#102</div>
      </section>

      {/* SECTION #105 - BOB DYSON BIO */}
      <section id="105" style={{ position: 'relative', padding: '80px 20px', background: '#fff' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', maxWidth: '1000px', margin: '0 auto', alignItems: 'center' }}>
          <div style={{ flex: '1 1 300px', height: '400px', background: '#000', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #D4AF37' }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ color: '#D4AF37', fontSize: '80px', fontWeight: 'bold', display: 'block' }}>D&D</span>
              <span style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px' }}>DYSON & DYSON</span>
            </div>
          </div>
          <div style={{ flex: '2 1 400px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold' }}>Bob Dyson</h2>
            <p style={{ fontSize: '18px', color: '#444', marginTop: '20px' }}>Over 30 years in luxury real estate, eliminating incompetence in relocation.</p>
          </div>
        </div>
        <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#000', color: '#D4AF37', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', borderRadius: '4px', border: '1px solid #D4AF37' }}>#105</div>
      </section>

      {/* SECTION #106 - AGENT SELECTION */}
      <section id="106" style={{ position: 'relative', padding: '80px 20px', background: '#000', color: '#fff', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#D4AF37' }}>READY TO VET YOUR AREA?</h2>
        <p style={{ marginBottom: '30px' }}>Access our Partner Portal to see top-tier agents who passed the Dyson Protocol.</p>
        <button style={{ padding: '15px 40px', background: '#D4AF37', color: '#000', fontWeight: 'bold', borderRadius: '8px', border: 'none' }}>BROWSE PARTNER AGENTS</button>
        <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#000', color: '#D4AF37', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', borderRadius: '4px', border: '1px solid #D4AF37' }}>#106</div>
      </section>

    </div>
  );
};

export default Home;