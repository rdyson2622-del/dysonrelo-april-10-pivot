import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
      <h1 style={{ fontSize: '56px', fontWeight: 'bold', marginBottom: '20px' }}>Welcome to Dyson & Dyson</h1>
      <p style={{ fontSize: '20px', maxWidth: '600px', marginBottom: '40px', color: '#ccc' }}>
        Your partner in seamless corporate relocation. Expert guidance. Data-driven decisions. Real results.
      </p>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => navigate('/Home')}
          style={{
            padding: '15px 40px',
            background: '#D4AF37',
            color: '#000',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          Learn More <ArrowRight size={18} />
        </button>
        
        <button
          onClick={() => navigate('/Dashboard')}
          style={{
            padding: '15px 40px',
            background: 'transparent',
            color: '#D4AF37',
            fontWeight: 'bold',
            border: '2px solid #D4AF37',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}