import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Users, Home, TrendingUp, UserCheck, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../components/dashboard/StatCard';

export default function Admin() {
  const { data: owners = [] } = useQuery({
    queryKey: ['listing-owners'],
    queryFn: () => base44.entities.ListingOwner.list('-created_date', 100),
    initialData: [],
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['relocation-clients'],
    queryFn: () => base44.entities.RelocationClient.list('-created_date', 100),
    initialData: [],
  });

  const contacted = owners.filter((o) => o.contact_status !== 'not_contacted').length;
  const converted = owners.filter((o) => o.contact_status === 'converted').length;
  const conversionRate = owners.length > 0 ? Math.round((converted / owners.length) * 100) : 0;

  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-slate-900">Admin Overview</h1>
        <p className="text-slate-500 mt-1">Manage your listing owners and relocation clients</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <StatCard title="Listing Owners" value={owners.length} icon={Home} color="orange" delay={0} />
        <StatCard title="Contacted" value={contacted} icon={Users} color="blue" delay={0.05} />
        <StatCard title="Converted" value={converted} icon={UserCheck} color="green" delay={0.1} />
        <StatCard title="Conversion Rate" value={`${conversionRate}%`} icon={TrendingUp} color="purple" delay={0.15} />
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <Link to="/AdminOwners">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white">
                <Home className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
            </div>
            <h3 className="font-semibold text-slate-900">Listing Owners</h3>
            <p className="text-sm text-slate-500 mt-1">
              {owners.length} owners • {owners.filter((o) => o.contact_status === 'not_contacted').length} pending outreach
            </p>
          </motion.div>
        </Link>

        <Link to="/AdminClients">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                <UserCheck className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
            </div>
            <h3 className="font-semibold text-slate-900">Relocation Clients</h3>
            <p className="text-sm text-slate-500 mt-1">
              {clients.length} clients • {clients.filter((c) => c.status === 'actively_searching').length} actively searching
            </p>
          </motion.div>
        </Link>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm mt-8"
      >
        <h3 className="font-semibold text-slate-900 mb-4">Recent Owners Added</h3>
        {owners.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No listing owners yet. Go to Listing Owners to add some.</p>
        ) : (
          <div className="space-y-3">
            {owners.slice(0, 5).map((owner) => (
              <div key={owner.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div>
                  <p className="text-sm font-medium text-slate-800">{owner.owner_name}</p>
                  <p className="text-xs text-slate-400">{owner.property_address}</p>
                </div>
                <span className="text-xs text-slate-500">{owner.moving_to || 'Unknown destination'}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}