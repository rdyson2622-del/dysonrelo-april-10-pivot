import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Plus, Search, MapPin, Phone, Mail, Calendar, ArrowLeft, Upload, CheckCircle2, AlertCircle, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const statusColors = {
  new_lead: 'bg-slate-100 text-slate-600',
  in_consultation: 'bg-blue-100 text-blue-700',
  actively_searching: 'bg-amber-100 text-amber-700',
  under_contract: 'bg-purple-100 text-purple-700',
  moved: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-red-100 text-red-700',
};

const budgetLabels = {
  under_200k: 'Under $200K',
  '200k_400k': '$200K - $400K',
  '400k_600k': '$400K - $600K',
  '600k_800k': '$600K - $800K',
  '800k_1m': '$800K - $1M',
  over_1m: 'Over $1M',
};

export default function AdminClients() {
  const [showAdd, setShowAdd] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', current_city: '',
    destination_city: '', budget: '', move_date: '', family_size: '', notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    await base44.entities.RelocationClient.delete(id);
    setConfirmDelete(null);
    refresh();
  };
  const [bulkStatus, setBulkStatus] = useState(null); // null | 'parsing' | 'preview' | 'importing' | 'done'
  const [bulkRows, setBulkRows] = useState([]);
  const [bulkResult, setBulkResult] = useState(null);
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['relocation-clients'],
    queryFn: () => base44.entities.RelocationClient.list('-created_date', 200),
    initialData: [],
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['relocation-clients'] });

  const handleSave = async () => {
    setSaving(true);
    await base44.entities.RelocationClient.create({
      ...form,
      family_size: form.family_size ? parseInt(form.family_size) : undefined,
    });
    setSaving(false);
    setForm({ full_name: '', email: '', phone: '', current_city: '', destination_city: '', budget: '', move_date: '', family_size: '', notes: '' });
    setShowAdd(false);
    refresh();
  };

  const filtered = clients.filter((c) => {
    return !search ||
      c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.destination_city?.toLowerCase().includes(search.toLowerCase()) ||
      c.current_city?.toLowerCase().includes(search.toLowerCase());
  });

  const update = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const handleCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBulkStatus('parsing');
    const reader = new FileReader();
    reader.onload = (evt) => {
      const lines = evt.target.result.split('\n').filter(Boolean);
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
      const rows = lines.slice(1).map(line => {
        const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const obj = {};
        headers.forEach((h, i) => { obj[h] = vals[i] || ''; });
        return obj;
      }).filter(r => r.full_name || r.email);
      setBulkRows(rows);
      setBulkStatus('preview');
    };
    reader.readAsText(file);
  };

  const runBulkImport = async () => {
    setBulkStatus('importing');
    let success = 0, failed = 0;
    for (const row of bulkRows) {
      try {
        await base44.entities.RelocationClient.create({
          full_name: row.full_name || row.name || '',
          email: row.email || '',
          phone: row.phone || '',
          current_city: row.current_city || row.from_city || '',
          destination_city: row.destination_city || row.to_city || row.destination || '',
          budget: row.budget || '',
          move_date: row.move_date || '',
          family_size: row.family_size ? parseInt(row.family_size) : undefined,
          notes: row.notes || '',
          status: row.status || 'new_lead',
        });
        success++;
      } catch { failed++; }
    }
    setBulkResult({ success, failed });
    setBulkStatus('done');
    refresh();
  };

  const closeBulk = () => {
    setShowBulk(false);
    setBulkStatus(null);
    setBulkRows([]);
    setBulkResult(null);
  };

  const downloadTemplate = () => {
    const csv = 'full_name,email,phone,current_city,destination_city,budget,move_date,family_size,notes\nJane Doe,jane@email.com,(555) 123-4567,San Francisco CA,Austin TX,400k_600k,2026-06-01,3,';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'clients_template.csv'; a.click();
  };

  return (
     <div className="p-8 min-h-screen" style={{ background: '#A9A9A9' }}>
       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
         <Link to="/Admin" className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-lg hover:bg-black/10 transition">
           <ArrowLeft className="w-4 h-4" style={{ color: '#000' }} />
           <span className="text-sm font-medium" style={{ color: '#000' }}>Back to Admin</span>
         </Link>
         <div className="flex items-center justify-between mb-8">
           <div>
             <h1 className="text-2xl font-bold" style={{ color: '#000' }}>Relocation Clients</h1>
             <p className="mt-1" style={{ color: 'rgba(0,0,0,0.6)' }}>Manage people relocating to new cities</p>
           </div>
           <div className="flex gap-2">
              <Button onClick={() => setShowBulk(true)} variant="outline" className="gap-2 rounded-xl" style={{ borderColor: '#000', color: '#000' }}>
                <Upload className="w-4 h-4" /> Bulk Import
              </Button>
              <Button onClick={() => setShowAdd(true)} className="gap-2 rounded-xl" style={{ background: '#000', color: '#fff' }}>
                <Plus className="w-4 h-4" /> Add Client
              </Button>
            </div>
         </div>
       </motion.div>

      {/* Search */}
      <div className="relative max-w-sm mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(0,0,0,0.4)' }} />
        <Input placeholder="Search clients..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ background: 'rgba(255,255,255,0.85)', borderColor: 'rgba(0,0,0,0.1)', paddingLeft: '2.5rem' }} />
      </div>

      {/* Client Cards */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 rounded-2xl border" style={{ background: 'rgba(255,255,255,0.85)', borderColor: 'rgba(0,0,0,0.1)' }}>
          <p className="font-medium" style={{ color: 'rgba(0,0,0,0.4)' }}>No clients yet</p>
          <p className="text-sm mt-1" style={{ color: 'rgba(0,0,0,0.3)' }}>Add your first relocation client to get started</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
           {filtered.map((client, i) => (
             <div key={client.id} className="relative">
               <Link to={`/AdminClients/${client.id}`} className="block">
               <motion.div
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.03 }}
                 className="rounded-2xl border p-5 hover:shadow-md transition-all cursor-pointer hover:scale-105"
                 style={{ background: 'rgba(255,255,255,0.85)', borderColor: 'rgba(0,0,0,0.1)' }}
               >
                 <div className="flex items-start justify-between mb-3">
                   <div>
                     <h3 className="font-semibold" style={{ color: '#000' }}>{client.full_name}</h3>
                     <Badge className={`${statusColors[client.status] || statusColors.new_lead} border-0 text-xs mt-1`}>
                       {(client.status || 'new_lead').replace(/_/g, ' ')}
                     </Badge>
                   </div>
                   <div className="flex items-center gap-2">
                     {client.budget && (
                       <span className="text-xs font-medium" style={{ color: 'rgba(0,0,0,0.6)' }}>{budgetLabels[client.budget]}</span>
                     )}
                     <button
                       onClick={(e) => { e.preventDefault(); setConfirmDelete(confirmDelete === client.id ? null : client.id); }}
                       className="p-1 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition"
                       title="Delete client"
                     >
                       <Trash2 className="w-3.5 h-3.5" />
                     </button>
                   </div>
                 </div>

                 <div className="space-y-1.5 mt-3">
                   {client.destination_city && (
                     <div className="flex items-center gap-2 text-sm" style={{ color: '#000' }}>
                       <MapPin className="w-3.5 h-3.5 text-orange-500" />
                       {client.current_city && <span style={{ color: 'rgba(0,0,0,0.6)' }}>{client.current_city} →</span>}
                       <span className="font-medium">{client.destination_city}</span>
                     </div>
                   )}
                   {client.email && (
                     <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(0,0,0,0.5)' }}>
                       <Mail className="w-3 h-3" />
                       {client.email}
                     </div>
                   )}
                   {client.phone && (
                     <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(0,0,0,0.5)' }}>
                       <Phone className="w-3 h-3" />
                       {client.phone}
                     </div>
                   )}
                   {client.move_date && (
                     <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(0,0,0,0.5)' }}>
                       <Calendar className="w-3 h-3" />
                       Moving: {client.move_date}
                     </div>
                   )}
                 </div>
               </motion.div>
               </Link>
               {confirmDelete === client.id && (
               <div className="absolute top-2 right-2 z-50 bg-white rounded-xl shadow-xl border border-red-100 p-3 text-center w-44">
                 <p className="text-xs font-semibold text-red-700 mb-2">Delete {client.full_name}?</p>
                 <div className="flex gap-2 justify-center">
                   <button onClick={(e) => handleDelete(client.id, e)} className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700">Delete</button>
                   <button onClick={(e) => { e.preventDefault(); setConfirmDelete(null); }} className="px-3 py-1 rounded-lg border text-xs font-bold hover:bg-slate-50">Cancel</button>
                 </div>
               </div>
               )}
               </div>
               ))}
               </div>
       )}

      {/* Bulk Import Dialog */}
      <Dialog open={showBulk} onOpenChange={closeBulk}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bulk Import Clients</DialogTitle>
          </DialogHeader>

          {(!bulkStatus || bulkStatus === 'parsing') && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg p-4 text-sm" style={{ background: '#f8f8f8', border: '1px solid #e5e5e5' }}>
                <p className="font-semibold mb-1">Upload a CSV file with client data.</p>
                <p className="text-slate-500">Required columns: <code>full_name</code>, <code>email</code>, <code>destination_city</code></p>
                <p className="text-slate-500">Optional: <code>phone</code>, <code>current_city</code>, <code>budget</code>, <code>move_date</code>, <code>family_size</code>, <code>notes</code>, <code>status</code></p>
              </div>
              <div className="flex gap-3 items-center">
                <Button variant="outline" onClick={downloadTemplate} className="gap-2 text-sm">
                  <Download className="w-4 h-4" /> Download Template
                </Button>
                <label className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium cursor-pointer" style={{ background: '#000', color: '#fff' }}>
                  <Upload className="w-4 h-4" /> Choose CSV File
                  <input type="file" accept=".csv" className="hidden" onChange={handleCSV} />
                </label>
              </div>
            </div>
          )}

          {bulkStatus === 'preview' && (
            <div className="space-y-4 py-4">
              <p className="text-sm font-semibold">{bulkRows.length} client{bulkRows.length !== 1 ? 's' : ''} ready to import:</p>
              <div className="max-h-64 overflow-y-auto rounded-lg border">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-slate-100">
                    <tr>
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Email</th>
                      <th className="text-left p-2">From</th>
                      <th className="text-left p-2">Destination</th>
                      <th className="text-left p-2">Budget</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulkRows.map((r, i) => (
                      <tr key={i} className="border-t">
                        <td className="p-2">{r.full_name || r.name}</td>
                        <td className="p-2">{r.email}</td>
                        <td className="p-2">{r.current_city || r.from_city || '—'}</td>
                        <td className="p-2">{r.destination_city || r.destination || '—'}</td>
                        <td className="p-2">{r.budget || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeBulk}>Cancel</Button>
                <Button onClick={runBulkImport} style={{ background: '#000', color: '#fff' }}>
                  Import {bulkRows.length} Clients
                </Button>
              </DialogFooter>
            </div>
          )}

          {bulkStatus === 'importing' && (
            <div className="py-12 flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
              <p className="text-sm font-medium">Importing clients...</p>
            </div>
          )}

          {bulkStatus === 'done' && bulkResult && (
            <div className="py-8 flex flex-col items-center gap-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              <div className="text-center">
                <p className="text-lg font-bold">{bulkResult.success} clients imported successfully</p>
                {bulkResult.failed > 0 && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1 justify-center">
                    <AlertCircle className="w-4 h-4" /> {bulkResult.failed} failed
                  </p>
                )}
              </div>
              <Button onClick={closeBulk} style={{ background: '#000', color: '#fff' }}>Done</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Client Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Relocation Client</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Full Name *</Label>
                <Input value={form.full_name} onChange={(e) => update('full_name', e.target.value)} placeholder="Jane Doe" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="(555) 123-4567" />
              </div>
            </div>
            <div>
              <Label>Email *</Label>
              <Input value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="jane@email.com" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Current City</Label>
                <Input value={form.current_city} onChange={(e) => update('current_city', e.target.value)} placeholder="San Francisco, CA" />
              </div>
              <div>
                <Label>Destination City *</Label>
                <Input value={form.destination_city} onChange={(e) => update('destination_city', e.target.value)} placeholder="Austin, TX" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Budget</Label>
                <Select value={form.budget} onValueChange={(v) => update('budget', v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under_200k">Under $200K</SelectItem>
                    <SelectItem value="200k_400k">$200K-$400K</SelectItem>
                    <SelectItem value="400k_600k">$400K-$600K</SelectItem>
                    <SelectItem value="600k_800k">$600K-$800K</SelectItem>
                    <SelectItem value="800k_1m">$800K-$1M</SelectItem>
                    <SelectItem value="over_1m">Over $1M</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Move Date</Label>
                <Input type="date" value={form.move_date} onChange={(e) => update('move_date', e.target.value)} />
              </div>
              <div>
                <Label>Family Size</Label>
                <Input type="number" value={form.family_size} onChange={(e) => update('family_size', e.target.value)} placeholder="3" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.full_name || !form.email || !form.destination_city || saving} className="bg-slate-900 hover:bg-slate-800">
              {saving ? 'Saving...' : 'Add Client'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}