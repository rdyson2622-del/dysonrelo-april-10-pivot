import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ContactTable from '../components/admin/ContactTable';
import AddOwnerDialog from '../components/admin/AddOwnerDialog';

export default function AdminOwners() {
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data: owners = [], isLoading } = useQuery({
    queryKey: ['listing-owners'],
    queryFn: () => base44.entities.ListingOwner.list('-created_date', 200),
    initialData: [],
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['listing-owners'] });

  const filtered = owners.filter((o) => {
    const matchesSearch =
      !search ||
      o.owner_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.property_address?.toLowerCase().includes(search.toLowerCase()) ||
      o.property_city?.toLowerCase().includes(search.toLowerCase()) ||
      o.moving_to?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.contact_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Listing Owners</h1>
            <p className="text-slate-500 mt-1">Contact homeowners who are relocating</p>
          </div>
          <Button onClick={() => setShowAdd(true)} className="bg-slate-900 hover:bg-slate-800 gap-2 rounded-xl">
            <Plus className="w-4 h-4" /> Add Owner
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-3 mb-6"
      >
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search owners, properties, cities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 bg-white">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="not_contacted">Not Contacted</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="in_conversation">In Conversation</SelectItem>
            <SelectItem value="interested">Interested</SelectItem>
            <SelectItem value="not_interested">Not Interested</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm"
      >
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
          </div>
        ) : (
          <ContactTable owners={filtered} onRefresh={refresh} />
        )}
      </motion.div>

      <AddOwnerDialog open={showAdd} onClose={() => setShowAdd(false)} onAdded={refresh} />
    </div>
  );
}