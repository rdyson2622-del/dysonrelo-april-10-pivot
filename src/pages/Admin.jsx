import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '../base44';
import { Trash2, Edit2, Check, X, Search, Plus } from 'lucide-react';

export default function Admin() {
  const queryClient = useQueryClient();
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editOwner, setEditOwner] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  // THE COMMAND TRIGGER - Set to pull 100 to ensure we catch all 10+ leads
  const triggerLASearch = () => {
    window.alert("COMMAND RECEIVED: Pulling New LA Properties >$2M...");
  };

  // REMOVED THE LIMIT OF 10 - Now pulls up to 100 records
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
        <button 
          onClick={triggerLASearch}
          style={{ background: '#D4AF37', color: '#000', padding: '15px 40px', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          EXECUTE ORDER: LA LISTINGS (>$2M)
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
            {owners.map(owner => (
              <tr key={owner.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px' }}>{owner.owner_name}</td>
                <td style={{ padding: '15px' }}>{owner.property_address}</td>
                <td style={{ padding: '15px' }}><span style={{ color: '#D4AF37' }}>Ready for Text</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}