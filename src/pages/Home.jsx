// FORCE-WRITE OVERRIDE FOR HOME.JSX
import React from 'react';
import { MessageSquare, ShieldCheck, Zap, Star } from 'lucide-react';

const Home = () => {
  return (
    <div style={{ position: 'relative', background: '#fff', fontFamily: 'sans-serif' }}>
      
      {/* SECTION #101 - HERO SECTION */}
      <section id="101" style={{ position: 'relative', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#fff', textAlign: 'center', padding: '20px' }}>
        <div>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px' }}>Your High-Probability Relocation Strategy</h1>
          <p style={{ fontSize: '20px', maxWidth: '800px', margin: '0 auto 30px' }}>Surgical data and expert vetting for committed home buyers who don't have time for the "Guess and Check" method.</p>
          <button style={{ padding: '15px 40px', background: '#D4AF37', color: '#000', fontWeight: 'bold', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>START YOUR SEARCH</button>
        </div>
        <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#000', color: '#D4AF37', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', borderRadius: '4px', border: '1px solid #D4AF37' }}>#101</div>
      </section>

      {/* SECTION #102 - CHARLIE INTRO CARD */}
      <section id="102" style={{ position: 'relative', padding: '60px 20px', background: '#f9f9f9', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid #D4AF37' }}>
          <MessageSquare size={48} color="#D4AF37" style={{ marginBottom: '20px' }} />
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Meet Charlie: Your Relocation Orchestrator</h2>
          <p style={{ color: '#666', marginTop: '15px' }}>Charlie isn't a chatbot; he's your direct line to the Dyson Admin team and your 24/7 data architect.</p>
        </div>
        <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#000', color: '#D4AF37', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', borderRadius: '4px', border: '1px solid #D4AF37' }}>#102</div>
      </section>

      {/* SECTION #103 - THE DYSON PROMISE */}
      <section id="103" style={{ position: 'relative', padding: '80px 20px', background: '#fff' }}>
        <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 'bold', marginBottom: '50px' }}>The Dyson Promise</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }}>
            <ShieldCheck size={40} color="#D4AF37" />
            <h3 style={{ fontWeight: 'bold', margin: '15px 0' }}>Vetted Partners Only</h3>
            <p>We only work with top-tier agents who pass our 12-point vetting protocol.</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Zap size={40} color="#D4AF37" />
            <h3 style={{ fontWeight: 'bold', margin: '15px 0' }}>Surgical Data</h3>
            <p>Direct access to neighborhood insights that Zillow and Redfin can't provide.</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Star size={40} color="#D4AF37" />
            <h3 style={{ fontWeight: 'bold', margin: '15px 0' }}>Concierge Support</h3>
            <p>Our Admin team is your advocate from the first search to the final closing.</p>
          </div>
        </div>
        <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#000', color: '#D4AF37', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', borderRadius: '4px', border: '1px solid #D4AF37' }}>#103</div>
      </section>

      {/* SECTION #104 - GEMINI SESSION EXPLAINER */}
      <section id="104" style={{ position: 'relative', padding: '80px 20px', background: '#000', color: '#fff' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', border: '2px solid #D4AF37', padding: '40px', borderRadius: '20px' }}>
          <h2 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '20px' }}>The Gemini Session: 3-Way Clarity</h2>
          <p style={{ fontSize: '18px', color: '#ccc' }}>You, Bob Dyson, and our AI Architect in a single session to map your relocation DNA and identify your "High-Probability" property finalists.</p>
        </div>
        <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#000', color: '#D4AF37', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', borderRadius: '4px', border: '1px solid #D4AF37' }}>#104</div>
      </section>

      {/* SECTION #105 - BOB DYSON BIO */}
      <section id="105" style={{ position: 'relative', padding: '80px 20px', background: '#f9f9f9' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', maxWidth: '1000px', margin: '0 auto', alignItems: 'center' }}>
          <div style={{ flex: '1 1 300px', height: '400px', background: '#ccc', borderRadius: '10px' }}></div> {/* Placeholder for Bob's Image */}
          <div style={{ flex: '2 1 400px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold' }}>Bob Dyson</h2>
            <p style={{ fontSize: '18px', color: '#444', marginTop: '20px', lineHeight: '1.6' }}>With over 30 years in luxury real estate, Bob built DysonRelo to eliminate the noise and incompetence that plagues traditional relocation.</p>
          </div>
        </div>
        <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#000', color: '#D4AF37', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', borderRadius: '4px', border: '1px solid #D4AF37' }}>#105</div>
      </section>

      {/* SECTION #106 - AGENT SELECTION PROCESS */}
      <section id="106" style={{ position: 'relative', padding: '80px 20px', background: '#000', color: '#fff', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>Ready to Vet Your Area?</h2>
        <p style={{ marginBottom: '40px', color: '#ccc' }}>Access our Partner Portal to see which top-tier agents have passed the Dyson Protocol in your target city.</p>
        <button style={{ padding: '15px 40px', background: '#D4AF37', color: '#000', fontWeight: 'bold', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>BROWSE PARTNER AGENTS</button>
        <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#000', color: '#D4AF37', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', borderRadius: '4px', border: '1px solid #D4AF37' }}>#106</div>
      </section>

    </div>
  );
};

export default Home;