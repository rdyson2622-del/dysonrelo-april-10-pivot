import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Pencil, Check, X, Lock } from 'lucide-react';

const GOLD = '#D4AF37';

const FIELDS = [
  { key: 'acceptance_date', editedKey: 'edited_acceptance_date', label: 'Acceptance Date', type: 'date' },
  { key: 'closing_date', editedKey: 'edited_closing_date', label: 'Closing Date', type: 'date' },
  { key: 'listing_agent_name', editedKey: null, label: 'Listing Agent', type: 'text' },
  { key: 'buyer_agent_name', editedKey: null, label: "Buyer's Agent", type: 'text' },
];

/**
 * Per-escrow key details — Acceptance/Closing date + Listing/Buyer agent.
 * Editable in Base44 only: saved to the EscrowRecord entity, never sent to
 * Brokermint. Dates synced from Brokermint are shown unless an admin has
 * entered an override (edited_* field), which always takes priority.
 */
export default function EscrowKeyDetailsPanel({ escrowNumber, propertyAddress, brokerageId }) {
  const queryClient = useQueryClient();
  const [editingField, setEditingField] = useState(null);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);

  const { data: record } = useQuery({
    queryKey: ['escrowRecord', escrowNumber],
    queryFn: async () => {
      const list = await base44.entities.EscrowRecord.filter({ escrow_number: String(escrowNumber) });
      return list?.[0] || null;
    },
    enabled: !!escrowNumber,
  });

  const startEdit = (field, currentValue) => {
    setEditingField(field.key);
    setDraft(currentValue || '');
  };

  const save = async (field) => {
    setSaving(true);
    try {
      const patchKey = field.editedKey || field.key;
      const payload = { [patchKey]: draft || null };
      if (record?.id) {
        await base44.entities.EscrowRecord.update(record.id, payload);
      } else {
        await base44.entities.EscrowRecord.create({
          escrow_number: String(escrowNumber),
          brokerage_id: brokerageId,
          property_address: propertyAddress,
          ...payload,
        });
      }
      queryClient.invalidateQueries({ queryKey: ['escrowRecord', escrowNumber] });
      setEditingField(null);
    } catch { /* best-effort */ }
    setSaving(false);
  };

  return (
    <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center gap-1.5 mb-2.5">
        <Lock className="w-3 h-3" style={{ color: GOLD }} />
        <p className="text-[9px] text-gray-500">Editable here — changes save only to Base44 and never modify your Brokermint BackOffice file.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {FIELDS.map(field => {
          const syncedValue = record?.[field.key];
          const overrideValue = field.editedKey ? record?.[field.editedKey] : null;
          const effectiveValue = overrideValue || syncedValue;
          const isEditing = editingField === field.key;
          const displayValue = field.type === 'date' && effectiveValue
            ? new Date(effectiveValue).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : effectiveValue;
          return (
            <div key={field.key}>
              <p className="text-[9px] font-black tracking-widest uppercase text-gray-500 mb-1">{field.label}</p>
              {isEditing ? (
                <div className="flex items-center gap-1">
                  <input
                    type={field.type}
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    autoFocus
                    className="flex-1 px-2 py-1 rounded text-xs text-white min-w-0"
                    style={{ background: '#000', border: `1px solid ${GOLD}60` }}
                  />
                  <button onClick={() => save(field)} disabled={saving} className="shrink-0">
                    <Check className="w-3.5 h-3.5" style={{ color: '#22c55e' }} />
                  </button>
                  <button onClick={() => setEditingField(null)} className="shrink-0">
                    <X className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEdit(field, effectiveValue)}
                  className="flex items-center gap-1.5 group w-full text-left"
                >
                  <span className="text-xs" style={{ color: effectiveValue ? '#fff' : '#666' }}>
                    {displayValue || 'Not set'}
                  </span>
                  <Pencil className="w-2.5 h-2.5 opacity-0 group-hover:opacity-60 transition-opacity shrink-0" style={{ color: GOLD }} />
                  {overrideValue && <span className="text-[8px] font-bold px-1 rounded" style={{ background: `${GOLD}20`, color: GOLD }}>EDITED</span>}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}