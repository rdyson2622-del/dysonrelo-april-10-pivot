import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Send, CheckSquare, Square, MessageSquare, ChevronDown, Eye } from 'lucide-react';

function fillTemplate(content, owner) {
  return content
    .replace(/\{\{owner_name\}\}/g, owner.owner_name || 'there')
    .replace(/\{\{property_address\}\}/g, owner.property_address || '')
    .replace(/\{\{listing_price\}\}/g, owner.listing_price ? `$${Number(owner.listing_price).toLocaleString()}` : '')
    .replace(/\{\{destination_city\}\}/g, owner.moving_to || '');
}

export default function AdminComposeSMS() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedOwners, setSelectedOwners] = useState(new Set());
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [previewOwner, setPreviewOwner] = useState(null);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  const { data: templates = [] } = useQuery({
    queryKey: ['messageTemplates'],
    queryFn: () => base44.entities.MessageTemplate.filter({ communication_type: 'sms', is_active: true }),
  });

  const { data: owners = [] } = useQuery({
    queryKey: ['listingOwners'],
    queryFn: () => base44.entities.ListingOwner.list('-created_date', 2000),
  });

  // Deduplicate templates by name, keep most recent
  const uniqueTemplates = useMemo(() => {
    const map = {};
    for (const t of templates) {
      if (!map[t.name] || new Date(t.updated_date) > new Date(map[t.name].updated_date)) {
        map[t.name] = t;
      }
    }
    return Object.values(map).sort((a, b) => a.name.localeCompare(b.name));
  }, [templates]);

  const cities = useMemo(() => {
    const set = new Set(owners.map(o => o.property_city?.trim()).filter(Boolean));
    return ['all', ...Array.from(set).sort()];
  }, [owners]);

  const filteredOwners = useMemo(() => {
    return owners.filter(o => {
      const matchCity = cityFilter === 'all' || o.property_city?.trim().toLowerCase() === cityFilter.toLowerCase();
      const matchSearch = !search ||
        o.owner_name?.toLowerCase().includes(search.toLowerCase()) ||
        o.property_address?.toLowerCase().includes(search.toLowerCase()) ||
        o.phone?.includes(search) ||
        o.property_city?.toLowerCase().includes(search.toLowerCase());
      return matchCity && matchSearch && o.phone;
    });
  }, [owners, cityFilter, search]);

  const toggleOwner = (id) => {
    setSelectedOwners(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (filteredOwners.every(o => selectedOwners.has(o.id))) {
      setSelectedOwners(prev => {
        const next = new Set(prev);
        filteredOwners.forEach(o => next.delete(o.id));
        return next;
      });
    } else {
      setSelectedOwners(prev => {
        const next = new Set(prev);
        filteredOwners.forEach(o => next.add(o.id));
        return next;
      });
    }
  };

  const selectedList = owners.filter(o => selectedOwners.has(o.id));

  const handleSend = async () => {
    if (!selectedTemplate || selectedOwners.size === 0) return;
    if (!confirm(`Send "${selectedTemplate.name}" to ${selectedOwners.size} contact(s) NOW? This will send immediately via Twilio.`)) return;

    setSending(true);
    setResult(null);

    try {
      const res = await base44.functions.invoke('manualSendSMS', {
        template_id: selectedTemplate.id,
        owner_ids: Array.from(selectedOwners),
      });
      setResult(res.data);
      if (res.data.success) {
        setSelectedOwners(new Set());
      }
    } catch (e) {
      setResult({ success: false, error: e.message });
    } finally {
      setSending(false);
    }
  };

  const allFilteredSelected = filteredOwners.length > 0 && filteredOwners.every(o => selectedOwners.has(o.id));

  return (
    <div className="p-6 min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Compose SMS</h1>
          <p className="text-sm text-slate-500 mt-1">Select a template, choose contacts, review, and send manually.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT: Template Selection */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <h2 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Step 1: Choose Template
              </h2>
              <div className="space-y-2">
                {uniqueTemplates.map(t => (
                  <button
                    key={t.id}
                    onClick={() => { setSelectedTemplate(t); setResult(null); }}
                    className={`w-full text-left px-3 py-3 rounded-lg border text-sm transition ${
                      selectedTemplate?.id === t.id
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 hover:border-slate-400 bg-white text-slate-700'
                    }`}
                  >
                    <p className="font-medium">{t.name}</p>
                    <p className={`text-xs mt-0.5 ${selectedTemplate?.id === t.id ? 'text-slate-300' : 'text-slate-400'}`}>
                      {t.category?.replace(/_/g, ' ')}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Template Preview */}
            {selectedTemplate && (
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                <p className="text-xs text-yellow-400 font-semibold mb-2 uppercase tracking-wide">Template Preview</p>
                <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {previewOwner
                    ? fillTemplate(selectedTemplate.content, previewOwner)
                    : selectedTemplate.content}
                </p>
                {previewOwner && (
                  <p className="text-xs text-slate-400 mt-2">Showing filled for: {previewOwner.owner_name}</p>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: Contact Selection */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <h2 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Search className="w-4 h-4" /> Step 2: Select Contacts
              </h2>

              {/* Filters */}
              <div className="flex gap-2 mb-3 flex-wrap">
                <div className="relative flex-1 min-w-[160px]">
                  <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
                  <Input
                    placeholder="Search name, address, phone, city..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-8 h-8 text-xs"
                  />
                </div>
                <select
                  value={cityFilter}
                  onChange={e => setCityFilter(e.target.value)}
                  className="h-8 border border-slate-200 rounded-md px-2 text-xs text-slate-700 bg-white"
                >
                  {cities.map(c => (
                    <option key={c} value={c}>{c === 'all' ? 'All Cities' : c}</option>
                  ))}
                </select>
              </div>

              <p className="text-xs text-slate-400 mb-2">{filteredOwners.length} contacts with phone numbers</p>

              {/* Table */}
              <div className="max-h-[400px] overflow-y-auto border border-slate-100 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-slate-50 border-b border-slate-200">
                    <tr className="text-xs text-slate-500 uppercase tracking-wide">
                      <th className="px-3 py-2 w-8">
                        <button onClick={toggleAll}>
                          {allFilteredSelected
                            ? <CheckSquare className="w-4 h-4 text-slate-900" />
                            : <Square className="w-4 h-4 text-slate-400" />}
                        </button>
                      </th>
                      <th className="text-left px-3 py-2">Name</th>
                      <th className="text-left px-3 py-2">Phone</th>
                      <th className="text-left px-3 py-2">City</th>
                      <th className="text-left px-3 py-2">Status</th>
                      <th className="px-3 py-2">Preview</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOwners.map((owner, i) => (
                      <tr
                        key={owner.id}
                        className={`border-b border-slate-100 transition cursor-pointer ${
                          selectedOwners.has(owner.id) ? 'bg-blue-50' : i % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                        } hover:bg-blue-50/60`}
                        onClick={() => toggleOwner(owner.id)}
                      >
                        <td className="px-3 py-2.5 w-8">
                          {selectedOwners.has(owner.id)
                            ? <CheckSquare className="w-4 h-4 text-blue-600" />
                            : <Square className="w-4 h-4 text-slate-300" />}
                        </td>
                        <td className="px-3 py-2.5 font-medium text-slate-900 max-w-[160px] truncate">{owner.owner_name}</td>
                        <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">{owner.phone}</td>
                        <td className="px-3 py-2.5 text-slate-500 max-w-[150px] truncate" title={owner.property_city || ''}>{owner.property_city || '—'}</td>
                        <td className="px-3 py-2.5">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            owner.contact_status === 'not_contacted' ? 'bg-slate-100 text-slate-600' :
                            owner.contact_status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                            owner.contact_status === 'interested' ? 'bg-green-100 text-green-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>{owner.contact_status?.replace(/_/g, ' ')}</span>
                        </td>
                        <td className="px-3 py-2.5 text-center" onClick={e => e.stopPropagation()}>
                          {selectedTemplate && (
                            <button
                              onClick={() => setPreviewOwner(previewOwner?.id === owner.id ? null : owner)}
                              className={`p-1 rounded transition ${previewOwner?.id === owner.id ? 'text-yellow-600 bg-yellow-50' : 'text-slate-400 hover:text-slate-700'}`}
                              title="Preview filled message"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredOwners.length === 0 && (
                      <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400 text-sm">No contacts with phone numbers found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Step 3: Send */}
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <h2 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Send className="w-4 h-4" /> Step 3: Review & Send
              </h2>

              {!selectedTemplate && (
                <p className="text-sm text-slate-400">← Select a template first</p>
              )}
              {selectedTemplate && selectedOwners.size === 0 && (
                <p className="text-sm text-slate-400">← Select at least one contact</p>
              )}

              {selectedTemplate && selectedOwners.size > 0 && (
                <div className="space-y-3">
                  <div className="bg-slate-50 rounded-lg px-4 py-3 text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Template:</span>
                      <span className="font-medium text-slate-800">{selectedTemplate.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Recipients:</span>
                      <span className="font-medium text-slate-800">{selectedOwners.size} contact{selectedOwners.size !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Delivery:</span>
                      <span className="font-medium text-green-700">Immediate — no delay</span>
                    </div>
                  </div>

                  {/* Selected names */}
                  <div className="flex flex-wrap gap-1.5">
                    {selectedList.slice(0, 8).map(o => (
                      <span key={o.id} className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">{o.owner_name}</span>
                    ))}
                    {selectedList.length > 8 && (
                      <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">+{selectedList.length - 8} more</span>
                    )}
                  </div>

                  <Button
                    onClick={handleSend}
                    disabled={sending}
                    className="w-full bg-slate-900 hover:bg-slate-700 text-white h-11 text-base font-semibold gap-2"
                  >
                    {sending
                      ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                      : <><Send className="w-4 h-4" /> Send Now to {selectedOwners.size} Contact{selectedOwners.size !== 1 ? 's' : ''}</>
                    }
                  </Button>
                </div>
              )}

              {/* Result */}
              {result && (
                <div className={`mt-3 rounded-lg px-4 py-3 text-sm font-medium ${result.success ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                  {result.success
                    ? `✓ Sent ${result.sent} message${result.sent !== 1 ? 's' : ''} successfully. ${result.failed > 0 ? `${result.failed} failed.` : ''}`
                    : `✗ Error: ${result.error}`}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}