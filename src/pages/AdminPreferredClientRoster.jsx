import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Users, Shield, Search, Phone, Mail, Calendar, 
  FolderLock, FileText, ChevronRight, X, Clock, CheckCircle2 
} from 'lucide-react';

export default function AdminPreferredClientRoster() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);

  // 1. Fetch visitors (clients who claimed preferred status or checked in)
  const { data: visitors = [], isLoading: isLoadingVisitors } = useQuery({
    queryKey: ['preferredClientVisitors'],
    queryFn: async () => {
      return await base44.entities.CopilotVisitor.list('-last_seen_at', 200);
    }
  });

  // 2. Fetch all vault items to count per client
  const { data: vaultItems = [], isLoading: isLoadingVault } = useQuery({
    queryKey: ['preferredClientVaultItems'],
    queryFn: async () => {
      return await base44.entities.CopilotClientVault.list('-saved_at', 500);
    }
  });

  // Aggregate clients by phone or email
  const clientMap = new Map();

  visitors.forEach((v) => {
    const key = (v.phone || v.email || v.id).trim().toLowerCase();
    if (!clientMap.has(key)) {
      clientMap.set(key, {
        id: v.id,
        name: v.name || 'Anonymous Visitor',
        phone: v.phone || '',
        email: v.email || '',
        source: v.source || 'preferred_claim',
        lastActive: v.last_seen_at || v.created_date,
        vaultCount: 0,
        vaultItems: []
      });
    }
  });

  // Match vault items to clients or create entry if saved without prior visitor record
  vaultItems.forEach((item) => {
    const key = (item.client_phone || item.client_email || '').trim().toLowerCase();
    if (key && clientMap.has(key)) {
      const c = clientMap.get(key);
      c.vaultCount += 1;
      c.vaultItems.push(item);
    } else if (key) {
      clientMap.set(key, {
        id: item.id,
        name: item.client_name || 'Preferred Client',
        phone: item.client_phone || '',
        email: item.client_email || '',
        source: 'vault_direct',
        lastActive: item.saved_at || item.created_date,
        vaultCount: 1,
        vaultItems: [item]
      });
    }
  });

  const clients = Array.from(clientMap.values()).sort((a, b) => {
    const dateA = new Date(a.lastActive || 0).getTime();
    const dateB = new Date(b.lastActive || 0).getTime();
    return dateB - dateA;
  });

  const filtered = clients.filter(c => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto text-left" style={{ color: '#F3F0E6' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#D4AF37] uppercase">
              FIDUCIARY CLIENT INTELLIGENCE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
            Preferred Client Roster
          </h1>
          <p className="text-xs text-stone-400 font-sans">
            Read-only directory of clients with activated Private Vaults and verified property inquiries
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, phone, email..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#141414] border border-white/15 text-white placeholder-stone-500 text-xs focus:outline-none focus:border-[#D4AF37] transition-colors"
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-[#111111] border border-white/10">
          <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">
            TOTAL PREFERRED CLIENTS
          </span>
          <span className="text-2xl font-serif font-bold text-white mt-1 block">
            {clients.length}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-[#111111] border border-white/10">
          <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">
            ITEMS IN PRIVATE VAULTS
          </span>
          <span className="text-2xl font-serif font-bold text-[#D4AF37] mt-1 block">
            {vaultItems.length}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-[#111111] border border-white/10">
          <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">
            PRIVACY PROTOCOL
          </span>
          <span className="text-sm font-medium text-emerald-400 mt-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Zero Unsolicited Outbound</span>
          </span>
        </div>
      </div>

      {/* Client Table */}
      <div className="rounded-xl border border-white/10 bg-[#111111] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-white/10 text-stone-400 font-mono text-[10px] uppercase bg-[#141414]">
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4">Private Vault</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoadingVisitors || isLoadingVault ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-stone-400 font-sans">
                    Loading Preferred Client Roster...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-stone-400 font-sans">
                    No preferred clients matching search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((client, idx) => (
                  <tr 
                    key={client.id || idx}
                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                    onClick={() => setSelectedClient(client)}
                  >
                    <td className="py-3 px-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center font-bold text-xs shrink-0">
                          {client.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span>{client.name}</span>
                          {client.source === 'preferred_claim' && (
                            <span className="text-[9px] font-mono text-emerald-400 block">
                              Preferred Status Claimed
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-stone-300">
                      <div className="space-y-0.5">
                        {client.phone && (
                          <div className="flex items-center gap-1.5 font-mono text-stone-300 text-[11px]">
                            <Phone className="w-3 h-3 text-stone-500" />
                            <span>{client.phone}</span>
                          </div>
                        )}
                        {client.email && (
                          <div className="flex items-center gap-1.5 text-stone-400 text-[11px]">
                            <Mail className="w-3 h-3 text-stone-500" />
                            <span>{client.email}</span>
                          </div>
                        )}
                        {!client.phone && !client.email && (
                          <span className="text-stone-500 italic">No contact details</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-stone-400 font-mono text-[11px]">
                      {client.lastActive ? new Date(client.lastActive).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      }) : '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                        client.vaultCount > 0
                          ? 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/30 font-semibold'
                          : 'bg-white/5 text-stone-400 border-white/10'
                      }`}>
                        <FolderLock className="w-3 h-3" />
                        <span>{client.vaultCount} {client.vaultCount === 1 ? 'file' : 'files'}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedClient(client);
                        }}
                        className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 ml-auto cursor-pointer"
                      >
                        <span>View Vault</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Client Vault Drawer / Detail Modal */}
      {selectedClient && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setSelectedClient(null)}
        >
          <div 
            className="w-full max-w-xl bg-[#141414] border border-[#D4AF37]/50 rounded-2xl shadow-2xl p-6 relative max-h-[85vh] flex flex-col text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedClient(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Client Profile Header */}
            <div className="border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] font-serif font-bold text-base flex items-center justify-center">
                  {selectedClient.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {selectedClient.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-400 font-mono mt-0.5">
                    {selectedClient.phone && <span>{selectedClient.phone}</span>}
                    {selectedClient.phone && selectedClient.email && <span>·</span>}
                    {selectedClient.email && <span>{selectedClient.email}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Vault Files List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
              <div className="flex items-center justify-between text-xs font-mono text-stone-400 uppercase">
                <span>Private Vault Files ({selectedClient.vaultItems.length})</span>
                <span>Confidential</span>
              </div>

              {selectedClient.vaultItems.length === 0 ? (
                <div className="py-8 text-center text-xs text-stone-400 border border-dashed border-white/10 rounded-xl">
                  Client profile activated. No saved discussions or dossiers in vault yet.
                </div>
              ) : (
                selectedClient.vaultItems.map((item, idx) => (
                  <div 
                    key={item.id || idx}
                    className="p-3.5 rounded-xl bg-black border border-white/10 space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-[10px] font-mono text-[#D4AF37] uppercase font-bold block">
                          {item.item_type || 'discussion'}
                        </span>
                        <h4 className="font-semibold text-white truncate">
                          {item.title}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono text-stone-400 shrink-0">
                        {item.saved_at ? new Date(item.saved_at).toLocaleDateString() : ''}
                      </span>
                    </div>

                    {item.address && (
                      <p className="text-[11px] text-stone-400 font-mono">
                        Property: {item.address}
                      </p>
                    )}

                    {item.notes && (
                      <p className="text-[11px] text-stone-300 bg-white/5 p-2 rounded-lg italic font-sans">
                        Notes: {item.notes}
                      </p>
                    )}

                    {item.payload?.messages && item.payload.messages.length > 0 && (
                      <div className="text-[10.5px] text-stone-400">
                        {item.payload.messages.length} messages in conversation transcript
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between text-xs text-stone-400">
              <span className="text-[10px] font-mono">
                California Broker License #00609384
              </span>
              <button
                type="button"
                onClick={() => setSelectedClient(null)}
                className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}