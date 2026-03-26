import React from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();

  const adminModules = [
    { name: 'AI Charlie Scripts', path: '/admin/scripts', icon: '🤖', description: 'Edit Dyson Advisor & Commitment Gate logic' },
    { name: 'Client Pipeline', path: '/admin/clients', icon: '📈', description: 'View relocation leads and track progress' },
    { name: 'Communications', path: '/admin/communications', icon: '💬', description: 'Review outreach and emails' }
  ];

  return (
    <div style={{ padding: '40px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <h1 style={{ color: '#1a1a1a', marginBottom: '10px' }}>Admin Command Center</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>Recovery Mode Active: Direct Access to 4-Month Build Data</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {adminModules.map((module) => (
          <div 
            key={module.path}
            onClick={() => navigate(module.path)}
            style={{ 
              padding: '20px', 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              cursor: 'pointer',
              border: '1px solid #eee',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>{module.icon}</div>
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{module.name}</h3>
            <p style={{ fontSize: '14px', color: '#888', margin: 0 }}>{module.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;