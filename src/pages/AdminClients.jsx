import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Plus, Search, MapPin, Phone, Mail, Calendar } from 'lucide-react';
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
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', current_city: '',
    destination_city: '', budget: '', move_date: '', family_size: '', notes: '',
  });
  const [saving, setSaving] = useState(false);
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

  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Relocation Clients</h1>
            <p className="text-slate-500 mt-1">Manage people relocating to new cities</p>
          </div>
          <Button onClick={() => setShowAdd(true)} className="bg-slate-900 hover:bg-slate-800 gap-2 rounded-xl">
            <Plus className="w-4 h-4" /> Add Client
          </Button>
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-sm mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input placeholder="Search clients..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-white" />
      </div>

      {/* Client Cards */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
          <p className="text-slate-400 font-medium">No clients yet</p>
          <p className="text-sm text-slate-400 mt-1">Add your first relocation client to get started</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((client, i) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{client.full_name}</h3>
                  <Badge className={`${statusColors[client.status] || statusColors.new_lead} border-0 text-xs mt-1`}>
                    {(client.status || 'new_lead').replace(/_/g, ' ')}
                  </Badge>
                </div>
                {client.budget && (
                  <span className="text-xs font-medium text-slate-500">{budgetLabels[client.budget]}</span>
                )}
              </div>

              <div className="space-y-1.5 mt-3">
                {client.destination_city && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" />
                    {client.current_city && <span className="text-slate-400">{client.current_city} →</span>}
                    <span className="font-medium">{client.destination_city}</span>
                  </div>
                )}
                {client.email && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Mail className="w-3 h-3" />
                    {client.email}
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Phone className="w-3 h-3" />
                    {client.phone}
                  </div>
                )}
                {client.move_date && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar className="w-3 h-3" />
                    Moving: {client.move_date}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

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