import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '../base44';
import { Plus } from 'lucide-react';

export default function Admin() {
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editOwner, setEditOwner] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const triggerLASearch = () => {
    window.alert("COMMAND RECEIVED: Pulling 10 Just-Listed LA Properties >$2M...");
  };

  const { data: owners = [] } = useQuery({
    queryKey: ['listing-owners'],
    queryFn: () => base44.entities.ListingOwner.list('-created_date', 100),
    initialData: [],
  });

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      {/* GOLD COMMAND BOX */}
      <div style={{ background: '#000', padding: '30px', border: '3px solid #D4AF37', borderRadius: '12px', marginBottom: '40px' }}>
        <h2 style={{ color: '#D4AF37', marginTop: 0 }}>Surgical Lead Generator</h2>
        <p style={{ color: '#fff' }}>Ready to execute the LA High-Probability Pull (10 Listings &gt;$2M).</p>
        <button 
          onClick={triggerLASearch}
          style={{ background: '#D4AF37', color: '#000', padding: '15px 40px', fontWeight: 'bold', fontSize: '18px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          PLACE NEW ORDER NOW
        </button>
      </div>

      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Lead Database</h2>
      
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eee', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8f9fa' }}>
            <tr>
              <th style={{ padding: '15px', textAlign: 'left' }}>Owner Name</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Property Address</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {owners.length > 0 ? owners.map(owner => (
              <tr key={owner.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px' }}>{owner.owner_name}</td>
                <td style={{ padding: '15px' }}>{owner.property_address}</td>
                <td style={{ padding: '15px' }}><span style={{ color: '#D4AF37' }}>Ready for Text</span></td>
              </tr>
            )) : (
              <tr><td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No active leads found. Click the button above to start.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}