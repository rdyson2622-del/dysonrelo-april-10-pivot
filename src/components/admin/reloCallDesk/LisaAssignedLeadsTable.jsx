import React from 'react';
import { Phone, Mail, CheckCircle2, PhoneCall, AlertCircle, Clock } from 'lucide-react';

const GOLD = '#D4AF37';

const STATUS_OPTIONS = [
  { value: 'new', label: 'New', color: 'bg-blue-500/20 text-blue-400 border-blue-500/40' },
  { value: 'called', label: 'Called', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
  { value: 'callback', label: 'Callback', color: 'bg-amber-500/20 text-amber-400 border-amber-500/40' },
  { value: 'yes_moving', label: 'Yes Moving', color: 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40' },
  { value: 'no', label: 'Not Moving', color: 'bg-red-500/20 text-red-400 border-red-500/40' },
  { value: 'wrong_number', label: 'Wrong #', color: 'bg-white/10 text-white/50 border-white/20' },
  { value: 'do_not_call', label: 'DNC', color: 'bg-red-900/40 text-red-400 border-red-800' },
];

export default function LisaAssignedLeadsTable({
  leads = [],
  activeBatch = null,
  isLoading = false,
  onOpenCallModal,
  onQuickStatusChange,
}) {
  if (isLoading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-12 text-center text-white/50 space-y-3 shadow-2xl">
        <div className="w-8 h-8 border-3 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin mx-auto" />
        <p className="text-xs text-white/60">Loading Lisa's assigned pending listings...</p>
      </div>
    );
  }

  // EXACT EMPTY STATE MANDATE
  if (!leads || leads.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-10 sm:p-14 text-center shadow-2xl space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-black border border-[#D4AF37]/40 flex items-center justify-center mx-auto text-[#D4AF37]">
          <PhoneCall className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <p className="text-base sm:text-lg font-bold text-white tracking-wide whitespace-pre-wrap">
            No assigned list yet  ask Admin to import + assign
          </p>
          <p className="text-xs text-white/40">
            Once an admin imports and assigns today's $2M+ pending listings batch, your call queue will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] overflow-hidden shadow-2xl space-y-0">
      {/* Batch Header Bar */}
      <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-black/50 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-white text-sm">
            {activeBatch ? activeBatch.label : "Today's Assigned Leads"}
          </span>
          {activeBatch?.list_date && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
              {activeBatch.list_date}
            </span>
          )}
          <span className="text-white/50 text-xs">
            ({leads.length} lead{leads.length === 1 ? '' : 's'} assigned to Lisa Hurt)
          </span>
        </div>

        <div className="text-[11px] text-white/40 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
          <span>Fiduciary 1-on-1 calls only • No blast email/SMS</span>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-black/80 text-[10px] font-black uppercase tracking-wider text-[#D4AF37]">
              <th className="py-3 px-4 font-black">Address</th>
              <th className="py-3 px-4 font-black">City</th>
              <th className="py-3 px-4 font-black">List Price</th>
              <th className="py-3 px-4 font-black">Listing Agent Name</th>
              <th className="py-3 px-4 font-black">Phone</th>
              <th className="py-3 px-4 font-black">Email</th>
              <th className="py-3 px-4 font-black">Status</th>
              <th className="py-3 px-4 font-black text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-white/80">
            {leads.map((lead) => {
              const currentStatus = lead.status || 'new';
              const statusCfg = STATUS_OPTIONS.find(s => s.value === currentStatus) || STATUS_OPTIONS[0];

              return (
                <tr key={lead.id} className="hover:bg-white/[0.03] transition-colors group">
                  {/* 1. Address */}
                  <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span>{lead.address}</span>
                      {lead.market && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-white/10 text-white/60">
                          {lead.market}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* 2. City */}
                  <td className="py-3.5 px-4 text-white/70 whitespace-nowrap">
                    {lead.city || '—'}
                  </td>

                  {/* 3. List Price */}
                  <td className="py-3.5 px-4 font-bold text-[#D4AF37] whitespace-nowrap">
                    {lead.list_price != null ? `$${Number(lead.list_price).toLocaleString()}` : '—'}
                  </td>

                  {/* 4. Listing Agent Name */}
                  <td className="py-3.5 px-4 text-white font-medium whitespace-nowrap">
                    <div>
                      <span>{lead.listing_agent_name || 'Listing Agent'}</span>
                      {lead.listing_office && (
                        <span className="block text-[10px] text-white/40 truncate max-w-[160px]">
                          {lead.listing_office}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* 5. Phone */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-mono text-white/90">
                    {lead.listing_agent_phone ? (
                      <a
                        href={`tel:${lead.listing_agent_phone}`}
                        className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold group-hover:underline"
                        title="Click to dial"
                      >
                        <Phone className="w-3 h-3 shrink-0" />
                        <span>{lead.listing_agent_phone}</span>
                      </a>
                    ) : (
                      <span className="text-white/30 italic">No phone</span>
                    )}
                  </td>

                  {/* 6. Email */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-white/80">
                    {lead.listing_agent_email ? (
                      <a
                        href={`mailto:${lead.listing_agent_email}`}
                        className="flex items-center gap-1.5 text-white/80 hover:text-[#D4AF37] group-hover:underline"
                        title="Click to send 1-on-1 email"
                      >
                        <Mail className="w-3 h-3 text-[#D4AF37] shrink-0" />
                        <span className="max-w-[170px] truncate">{lead.listing_agent_email}</span>
                      </a>
                    ) : (
                      <span className="text-white/30 italic">No email</span>
                    )}
                  </td>

                  {/* 7. Status with minimal status update */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <select
                      value={currentStatus}
                      onChange={(e) => onQuickStatusChange && onQuickStatusChange(lead.id, e.target.value)}
                      className={`px-2 py-1 rounded-lg text-[10.5px] font-bold border cursor-pointer focus:outline-none bg-black ${statusCfg.color}`}
                      title="Update lead call status"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-[#0a0a0a] text-white">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* 8. Actions / Outcome logging */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {lead.listing_agent_phone && (
                        <a
                          href={`tel:${lead.listing_agent_phone}`}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 font-bold text-[11px] transition-colors"
                          title="Call listing agent"
                        >
                          Call
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => onOpenCallModal && onOpenCallModal(lead)}
                        className="px-3 py-1 rounded-lg bg-[#D4AF37] text-black font-bold text-[11px] hover:brightness-110 active:scale-95 transition-all shadow cursor-pointer"
                      >
                        Log Outcome
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}