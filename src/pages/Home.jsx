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

      {/* SECTION #102 - CHARLIE ORCHESTRATOR */}
      <section id="102" style={{ position: 'relative', padding: '80px 20px', background: '#f9f9f9', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '15px', border: '1px solid #D4AF37', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <MessageSquare size={48} color="#D4AF37" style={{ marginBottom: '20px' }} />
          <h2 style={{ fontSize: '28px', fontWeight: 'bold' }}>Charlie: Your Relocation Orchestrator</h2>
          <p style={{ color: '#444', fontSize: '18px', marginTop: '15px', lineHeight: '1.6' }}>
            Charlie isn't a chatbot. He is the interface for the Dyson Protocol, ensuring every school district, hospital network, and neighborhood appreciation trend is vetted before you see it.
          </p>
        </div>
        <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#000', color: '#D4AF37', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', borderRadius: '4px', border: '1px solid #D4AF37' }}>#102</div>
      </section>

      {/* SECTION #105 - BOB DYSON BIO (WITH LOGO PLUG) */}
      <section id="105" style={{ position: 'relative', padding: '100px 20px', background: '#fff' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '60px', maxWidth: '1100px', margin: '0 auto', alignItems: 'center' }}>
          <div style={{ flex: '1 1 400px', height: '500px', background: '#000', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #D4AF37' }}>
            <DnDLogo size="lg" />
          </div>
          <div style={{ flex: '2 1 500px' }}>
            <h2 style={{ fontSize: '40px', fontWeight: 'bold', color: '#000' }}>Bob Dyson</h2>
            <p style={{ fontSize: '20px', color: '#333', marginTop: '25px', lineHeight: '1.8' }}>
              With over 30 years in luxury real estate, Bob Dyson created this platform to eliminate the "Incompetence Gap" in relocation. We provide surgical data for those who refuse to settle for generic search results.
            </p>
          </div>
        </div>
        <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#000', color: '#D4AF37', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', borderRadius: '4px', border: '1px solid #D4AF37' }}>#105</div>
      </section>

      {/* SECTION #106 - AGENT VETTING PROTOCOL */}
      <section id="106" style={{ position: 'relative', padding: '100px 20px', background: '#000', color: '#fff', textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#D4AF37', marginBottom: '30px' }}>READY TO VET YOUR AREA?</h2>
        <p style={{ fontSize: '20px', color: '#ccc', maxWidth: '800px', margin: '0 auto 40px' }}>
          Our partner network consists only of agents who have passed the Dyson Relo Vetting Standard. Surgical precision, local mastery, and client advocacy.
        </p>
        <button style={{ padding: '20px 50px', background: '#D4AF37', color: '#000', fontWeight: 'bold', borderRadius: '8px', border: 'none', fontSize: '18px', cursor: 'pointer' }}>
          BROWSE PARTNER AGENTS
        </button>
        <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#000', color: '#D4AF37', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', borderRadius: '4px', border: '1px solid #D4AF37' }}>#106</div>
      </section>

    </div>
  );
};

export default Home;