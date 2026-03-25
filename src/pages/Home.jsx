import React, { useState } from 'react';
import { MessageSquare, CheckCircle2, ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const Home = () => {
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.email) {
      toast.error('Please fill in name and email');
      return;
    }
    setSubmitting(true);
    try {
      // For now, just show success — in production this would save to a leads entity
      console.log('Lead captured:', leadForm);
      toast.success('Thanks! Charlie will reach out soon.');
      setLeadForm({ name: '', email: '', phone: '' });
    } catch (err) {
      toast.error('Something went wrong');
    }
    setSubmitting(false);
  };

  return (
    <div style={{ background: '#fff' }}>
      {/* HERO SECTION */}
      <section style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)', color: '#fff', padding: '40px 20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1000px', textAlign: 'center', zIndex: 2, position: 'relative' }}>
          <h1 style={{ fontSize: '56px', fontWeight: '700', marginBottom: '20px', lineHeight: '1.2' }}>
            Your Relocation, Reimagined
          </h1>
          <p style={{ fontSize: '22px', color: '#ccc', maxWidth: '700px', margin: '0 auto 40px', lineHeight: '1.6' }}>
            Dyson & Dyson Corporate Relocation handles the entire move — destination research, agent matching, schools, utilities, timing. At no extra cost to you.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={{ padding: '16px 40px', background: '#D4AF37', color: '#000', fontWeight: '700', borderRadius: '8px', border: 'none', fontSize: '16px', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
              Schedule a Consultation
            </button>
          </div>
        </div>
      </section>

      {/* THE DYSON STORY */}
      <section style={{ padding: '100px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '44px', fontWeight: '700', marginBottom: '30px', color: '#000' }}>
              50 Years of Excellence
            </h2>
            <p style={{ fontSize: '18px', color: '#333', lineHeight: '1.8', marginBottom: '20px' }}>
              Bob Dyson didn't build Dyson & Dyson on luck. He built it on a simple principle: relocating families shouldn't feel like a gamble.
            </p>
            <p style={{ fontSize: '18px', color: '#333', lineHeight: '1.8', marginBottom: '20px' }}>
              For over three decades, we've guided executives and their families through the most critical decisions of their lives — where to live, where to send kids to school, which neighborhoods have the right vibe.
            </p>
            <p style={{ fontSize: '18px', color: '#333', lineHeight: '1.8' }}>
              Now, with Charlie — our AI concierge — we've made that expertise accessible to everyone. No commissions. No hidden agendas. Just surgical data and human judgment.
            </p>
          </div>
          <div style={{ height: '400px', background: '#f0f0f0', borderRadius: '12px', border: '2px solid #D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
            <span style={{ fontSize: '14px' }}>Bob Dyson Photo / Brand Image</span>
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section style={{ padding: '100px 40px', background: '#f9f9f9' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '44px', fontWeight: '700', textAlign: 'center', marginBottom: '60px', color: '#000' }}>
            How We Help
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
            {[
              { icon: '🔍', title: 'Destination Intelligence', desc: 'School rankings, healthcare networks, neighborhoods, cost of living — vetted and current.' },
              { icon: '🤝', title: 'Agent Matching', desc: 'We vet and connect you with the best agents in your destination market. No guessing.' },
              { icon: '📋', title: 'Move Planning', desc: 'Timeline, utilities, movers, legal docs — we handle coordination so you don\'t have to.' },
              { icon: '💬', title: 'Charlie Concierge', desc: 'AI-powered research assistant available 24/7. Ask anything about your destination.' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '40px', background: '#fff', borderRadius: '12px', border: '1px solid #e0e0e0', textAlign: 'center' }}>
                <div style={{ fontSize: '44px', marginBottom: '20px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '15px', color: '#000' }}>{item.title}</h3>
                <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.6' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEAD CAPTURE SECTION */}
      <section style={{ padding: '100px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '44px', fontWeight: '700', marginBottom: '20px', color: '#000' }}>
              Ready to Start?
            </h2>
            <p style={{ fontSize: '18px', color: '#333', lineHeight: '1.8', marginBottom: '30px' }}>
              Tell us about your move. One of our relocation specialists will reach out within 24 hours to discuss your destination and next steps. No pressure. No sales pitch.
            </p>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', fontSize: '16px', color: '#333', marginBottom: '15px' }}>
              <CheckCircle2 size={20} color="#D4AF37" />
              <span>Free initial consultation</span>
            </div>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', fontSize: '16px', color: '#333', marginBottom: '15px' }}>
              <CheckCircle2 size={20} color="#D4AF37" />
              <span>No commitment or fees</span>
            </div>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', fontSize: '16px', color: '#333' }}>
              <CheckCircle2 size={20} color="#D4AF37" />
              <span>Speak directly with our team</span>
            </div>
          </div>

          <form onSubmit={handleLeadSubmit} style={{ background: '#f9f9f9', padding: '50px', borderRadius: '12px', border: '2px solid #e0e0e0' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#000' }}>Your Name</label>
              <input type="text" placeholder="John Smith" value={leadForm.name} onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#000' }}>Email</label>
              <input type="email" placeholder="john@example.com" value={leadForm.email} onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#000' }}>Phone (optional)</label>
              <input type="tel" placeholder="(555) 123-4567" value={leadForm.phone} onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" disabled={submitting} style={{ width: '100%', padding: '14px', background: '#D4AF37', color: '#000', fontWeight: '700', borderRadius: '6px', border: 'none', fontSize: '16px', cursor: 'pointer', opacity: submitting ? 0.7 : 1, transition: 'all 0.3s' }}>
              {submitting ? 'Sending...' : 'Get Started'}
            </button>
            <p style={{ fontSize: '12px', color: '#999', marginTop: '15px', textAlign: 'center' }}>
              We'll never spam you. Just relocation guidance.
            </p>
          </form>
        </div>
      </section>

      {/* CTA TO CHARLIE */}
      <section style={{ padding: '80px 40px', background: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)', color: '#fff', textAlign: 'center' }}>
        <h2 style={{ fontSize: '44px', fontWeight: '700', marginBottom: '30px' }}>
          Or Chat with Charlie Now
        </h2>
        <p style={{ fontSize: '18px', color: '#ccc', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}>
          Our AI concierge is available 24/7 to answer questions about your destination city, neighborhoods, schools, and more.
        </p>
        <button style={{ padding: '16px 40px', background: '#D4AF37', color: '#000', fontWeight: '700', borderRadius: '8px', border: 'none', fontSize: '16px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px', transition: 'all 0.3s' }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
          <MessageSquare size={20} />
          Start a Conversation
          <ArrowRight size={18} />
        </button>
      </section>

      {/* FOOTER CTA */}
      <section style={{ padding: '60px 40px', background: '#f9f9f9', textAlign: 'center', borderTop: '1px solid #e0e0e0' }}>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
          Have questions? Call our team.
        </p>
        <a href="tel:+18583531200" style={{ fontSize: '28px', fontWeight: '700', color: '#D4AF37', textDecoration: 'none' }}>
          (858) 353-1200
        </a>
      </section>
    </div>
  );
};

export default Home;