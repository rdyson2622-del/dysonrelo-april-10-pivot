import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, ExternalLink, MoreHorizontal, MessageSquare, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { base44 } from '@/api/base44Client';
import SendCampaignButton from './SendCampaignButton';

const statusColors = {
  not_contacted: 'bg-slate-100 text-slate-600',
  contacted: 'bg-blue-100 text-blue-700',
  in_conversation: 'bg-amber-100 text-amber-700',
  interested: 'bg-emerald-100 text-emerald-700',
  not_interested: 'bg-red-100 text-red-700',
  converted: 'bg-purple-100 text-purple-700',
};

export default function ContactTable({ owners, onRefresh }) {
  const [updating, setUpdating] = useState(null);

  const updateStatus = async (id, newStatus) => {
    setUpdating(id);
    await base44.entities.ListingOwner.update(id, {
      contact_status: newStatus,
      last_contacted: new Date().toISOString().split('T')[0],
    });
    setUpdating(null);
    onRefresh?.();
  };

  if (!owners || owners.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="font-medium">No listing owners yet</p>
        <p className="text-sm mt-1">Add owners who are moving to start outreach</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 px-3">Owner</th>
            <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 px-3">Property</th>
            <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 px-3">Moving To</th>
            <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 px-3">Price</th>
            <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 px-3">Status</th>
            <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 px-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {owners.map((owner, i) => (
            <motion.tr
              key={owner.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
            >
              <td className="py-3 px-3">
                <div>
                  <p className="font-medium text-sm text-slate-800">{owner.owner_name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {owner.email && (
                      <a href={`mailto:${owner.email}`} className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {owner.email}
                      </a>
                    )}
                  </div>
                  {owner.phone && (
                    <a href={`tel:${owner.phone}`} className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3" />
                      {owner.phone}
                    </a>
                  )}
                </div>
              </td>
              <td className="py-3 px-3">
                <p className="text-sm text-slate-700">{owner.property_address}</p>
                <p className="text-xs text-slate-400">{owner.property_city}{owner.property_state ? `, ${owner.property_state}` : ''}</p>
              </td>
              <td className="py-3 px-3">
                <p className="text-sm text-slate-600">{owner.moving_to || '—'}</p>
              </td>
              <td className="py-3 px-3">
                <p className="text-sm font-medium text-slate-800">
                  {owner.listing_price ? `$${owner.listing_price.toLocaleString()}` : '—'}
                </p>
              </td>
              <td className="py-3 px-3">
                <Badge className={`${statusColors[owner.contact_status] || statusColors.not_contacted} border-0 text-xs`}>
                  {(owner.contact_status || 'not_contacted').replace(/_/g, ' ')}
                </Badge>
              </td>
              <td className="py-3 px-3 text-right">
               <div className="flex items-center gap-2 justify-end">
                 <SendCampaignButton owner={owner} />
                 <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                     <Button variant="ghost" size="icon" className="h-8 w-8">
                       <MoreHorizontal className="w-4 h-4" />
                     </Button>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent align="end">
                     <DropdownMenuItem onClick={() => updateStatus(owner.id, 'contacted')}>
                       <Phone className="w-4 h-4 mr-2" /> Mark Contacted
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => updateStatus(owner.id, 'in_conversation')}>
                       <MessageSquare className="w-4 h-4 mr-2" /> In Conversation
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => updateStatus(owner.id, 'interested')}>
                       <Mail className="w-4 h-4 mr-2" /> Mark Interested
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => updateStatus(owner.id, 'converted')}>
                       <ExternalLink className="w-4 h-4 mr-2" /> Mark Converted
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => updateStatus(owner.id, 'not_interested')} className="text-red-600">
                       Not Interested
                     </DropdownMenuItem>
                   </DropdownMenuContent>
                 </DropdownMenu>
               </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}