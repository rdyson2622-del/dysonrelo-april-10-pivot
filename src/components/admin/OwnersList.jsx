import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Trash2, Edit2, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const statusColors = {
  not_contacted: 'bg-slate-100 text-slate-600',
  contacted: 'bg-blue-100 text-blue-700',
  in_conversation: 'bg-amber-100 text-amber-700',
  interested: 'bg-emerald-100 text-emerald-700',
  not_interested: 'bg-red-100 text-red-700',
  converted: 'bg-purple-100 text-purple-700',
};

export default function OwnersList({ owners, onEdit, onDelete, onStatusChange, selectedIds = [], onToggleSelect }) {
  if (!owners?.length) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p className="font-medium">No listing owners yet</p>
        <p className="text-sm mt-1">Add owners who are moving to start outreach</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {owners.map((owner, i) => {
        const isSelected = selectedIds.includes(owner.id);
        return (
          <motion.div
            key={owner.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`border rounded-lg p-4 transition-colors cursor-pointer ${
              isSelected
                ? 'border-amber-400 bg-amber-50'
                : 'border-slate-200 hover:bg-slate-50'
            }`}
            onClick={() => onToggleSelect && onToggleSelect(owner.id)}
          >
            <div className="flex items-start justify-between gap-4">
              {/* Checkbox */}
              {onToggleSelect && (
                <div className="mt-1 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(owner.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900">{owner.owner_name}</h3>
                <p className="text-sm text-slate-600 mt-1">{owner.property_address}</p>
                {owner.property_city && (
                  <p className="text-xs text-slate-500">
                    {owner.property_city}{owner.property_state ? `, ${owner.property_state}` : ''}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  {owner.email && (
                    <a href={`mailto:${owner.email}`} onClick={e => e.stopPropagation()} className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {owner.email}
                    </a>
                  )}
                  {owner.phone && (
                    <a href={`tel:${owner.phone}`} onClick={e => e.stopPropagation()} className="text-xs text-slate-500 hover:underline flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {owner.phone}
                    </a>
                  )}
                </div>
                <div className="flex gap-2 mt-3">
                  <Badge className={`${statusColors[owner.contact_status] || statusColors.not_contacted} border-0 text-xs`}>
                    {(owner.contact_status || 'not_contacted').replace(/_/g, ' ')}
                  </Badge>
                  {owner.listing_price && (
                    <Badge variant="outline" className="text-xs">${(owner.listing_price / 1000).toFixed(0)}k</Badge>
                  )}
                </div>
              </div>

              <div className="flex gap-2 items-center" onClick={e => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(owner)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => onDelete(owner.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onStatusChange(owner.id, 'contacted')}>Mark Contacted</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(owner.id, 'in_conversation')}>In Conversation</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(owner.id, 'interested')}>Mark Interested</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(owner.id, 'converted')}>Mark Converted</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(owner.id, 'not_interested')}>Not Interested</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}