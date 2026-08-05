import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Plus, Trash2, Target, Users, Mail, Upload, Send, X, Loader2,
  Building2, Phone, CheckCircle2, AlertCircle, ChevronDown, ChevronRight
} from 'lucide-react';

const GOLD = '#D4AF37';

export default function AdminAudienceDistribution() {
  const queryClient = useQueryClient();
  const [selectedAudienceId, setSelectedAudienceId] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [search, setSearch] = useState('');

  const { data: audiences = [], isLoading } = useQuery({
    queryKey: ['audiences'],
    queryFn: () => base44.entities.TargetAudienceProfile.list('-created_date', 100),
  });

  const selectedAudience = audiences.find(a => a.id === selectedAudienceId) || null;

  const { data: contacts = [] } = useQuery({
    queryKey: ['audience-contacts', selectedAudienceId],
    queryFn: () => selectedAudienceId
      ? base44.entities.AudienceContact.filter({ audience_id: selectedAudienceId }, '-created_date', 500)
      : [],
    enabled: !!selectedAudienceId,
  });

  const filteredAudiences = audiences.filter(a =>
    a.audience_name?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredContacts = contacts.filter(c =>
    c.contact_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.company?.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = contacts.filter(c => c.status === 'active' && c.email).length;

  return (
    <div className="min-h-screen" style={{ background: '#1a1a1a' }}>
      {/* Header */}
      <div className="px-6 py-4 border-b sticky top-0 z-10" style={{ borderColor: '#333', background: '#1a1a1a' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#fff' }}>B2B Audience Distribution</h1>
            <p style={{ color: '#888' }}>Manage corporate audiences and distribute DNN broadcasts via Gmail</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowImport(true)}
              variant="outline"
              className="gap-2"
              style={{ borderColor: GOLD, color: GOLD }}
            >
              <Upload className="w-4 h-4" /> Import Contacts
            </Button>
            <Button
              onClick={() => {
                if (!selectedAudienceId) { alert('Select an audience first'); return; }
                setShowSend(true);
              }}
              className="gap-2"
              style={{ background: GOLD, color: '#000' }}
            >
              <Send className="w-4 h-4" /> Send Show
            </Button>
          </div>
        </div>
        <Input
          placeholder="Search audiences or contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm border-0 rounded-lg h-9"
          style={{ background: '#2a2a2a', color: '#fff' }}
        />
      </div>

      <div className="grid grid-cols-12 gap-6 p-6 max-w-[1600px]">
        {/* Audience List */}
        <div className="col-span-12 lg:col-span-4">
          <div className="rounded-xl p-4 overflow-y-auto max-h-[75vh]" style={{ background: '#2a2a2a', border: '1px solid #333' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold tracking-wider uppercase" style={{ color: GOLD }}>Audiences</p>
              <span style={{ color: '#888', fontSize: 12 }}>{audiences.length}</span>
            </div>
            {isLoading ? (
              <p style={{ color: '#888' }}>Loading...</p>
            ) : filteredAudiences.length === 0 ? (
              <p style={{ color: '#666' }}>No audiences yet. Create one in Target Audiences first.</p>
            ) : (
              <div className="space-y-2">
                {filteredAudiences.map(audience => (
                  <motion.button
                    key={audience.id}
                    onClick={() => setSelectedAudienceId(audience.id)}
                    className="w-full text-left p-3 rounded-lg transition-all"
                    style={{
                      background: selectedAudienceId === audience.id ? GOLD + '22' : '#333',
                      border: selectedAudienceId === audience.id ? `1px solid ${GOLD}` : '1px solid #444',
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate" style={{ color: '#fff' }}>
                          {audience.audience_name}
                        </p>
                        <p className="text-xs mt-1" style={{ color: '#888' }}>
                          {audience.audience_type?.replace(/_/g, ' ')}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full whitespace-nowrap" style={{ background: GOLD + '22', color: GOLD }}>
                        {audience.estimated_size || 0}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contacts Panel */}
        <div className="col-span-12 lg:col-span-8">
          <AnimatePresence mode="wait">
            {selectedAudience ? (
              <motion.div key="contacts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="rounded-xl overflow-hidden" style={{ background: '#2a2a2a', border: `1px solid ${GOLD}44` }}>
                  {/* Audience header */}
                  <div className="p-5 border-b" style={{ borderColor: '#333' }}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-bold" style={{ color: '#fff' }}>{selectedAudience.audience_name}</h2>
                        <p className="text-sm mt-1" style={{ color: '#aaa' }}>{selectedAudience.description || 'No description'}</p>
                      </div>
                      <Button
                        onClick={() => setShowAddContact(true)}
                        size="sm"
                        className="gap-1"
                        style={{ background: GOLD, color: '#000' }}
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Contact
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      <Stat label="Total Contacts" value={contacts.length} />
                      <Stat label="Eligible (active + email)" value={activeCount} accent />
                      <Stat label="Audience Type" value={selectedAudience.audience_type?.replace(/_/g, ' ') || '—'} />
                    </div>
                  </div>

                  {/* Contacts table */}
                  <div className="max-h-[60vh] overflow-y-auto">
                    {contacts.length === 0 ? (
                      <div className="p-10 text-center">
                        <Users className="w-10 h-10 mx-auto mb-3" style={{ color: '#555' }} />
                        <p style={{ color: '#888' }}>No contacts in this audience yet.</p>
                        <p style={{ color: '#666', fontSize: 13 }} className="mt-1">Use "Import Contacts" to bulk-load via CSV.</p>
                      </div>
                    ) : (
                      <table className="w-full text-sm">
                        <thead className="sticky top-0" style={{ background: '#222' }}>
                          <tr>
                            <Th>Name</Th>
                            <Th>Email</Th>
                            <Th>Company</Th>
                            <Th>Title</Th>
                            <Th>Consent</Th>
                            <Th>Status</Th>
                            <Th></Th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredContacts.map(c => (
                            <tr key={c.id} className="border-t" style={{ borderColor: '#333' }}>
                              <Td><span style={{ color: '#fff', fontWeight: 500 }}>{c.contact_name}</span></Td>
                              <Td><span style={{ color: '#aaa' }}>{c.email || '—'}</span></Td>
                              <Td><span style={{ color: '#aaa' }}>{c.company || '—'}</span></Td>
                              <Td><span style={{ color: '#aaa' }}>{c.title || '—'}</span></Td>
                              <Td>
                                <ConsentBadge status={c.consent_status} />
                              </Td>
                              <Td>
                                <StatusBadge status={c.status} />
                              </Td>
                              <Td>
                                <DeleteContactButton contactId={c.id} audienceId={selectedAudienceId} />
                              </Td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="rounded-xl p-12 text-center" style={{ background: '#2a2a2a', border: '1px dashed #444' }}>
                <Target className="w-12 h-12 mx-auto mb-3" style={{ color: GOLD }} />
                <p style={{ color: '#888' }}>Select an audience to view and manage its contacts.</p>
                <p style={{ color: '#666', fontSize: 13, marginTop: 6 }}>
                  Audiences are created in the Target Audiences page. Then load contacts here.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showImport && (
          <ImportContactsModal
            audienceId={selectedAudienceId}
            audiences={audiences}
            onClose={() => setShowImport(false)}
          />
        )}
        {showAddContact && (
          <AddContactModal
            audienceId={selectedAudienceId}
            audienceName={selectedAudience?.audience_name}
            onClose={() => setShowAddContact(false)}
          />
        )}
        {showSend && (
          <SendShowModal
            audienceId={selectedAudienceId}
            audienceName={selectedAudience?.audience_name}
            eligibleCount={activeCount}
            onClose={() => setShowSend(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────
function Stat({ label, value, accent }) {
  return (
    <div className="rounded-lg p-3" style={{ background: '#1a1a1a' }}>
      <p className="text-xs" style={{ color: '#888' }}>{label}</p>
      <p className="font-bold text-lg mt-1" style={{ color: accent ? GOLD : '#fff' }}>{value}</p>
    </div>
  );
}
function Th({ children }) {
  return <th className="text-left px-3 py-2 text-xs font-bold uppercase tracking-wider" style={{ color: '#888' }}>{children}</th>;
}
function Td({ children }) {
  return <td className="px-3 py-2.5">{children}</td>;
}
function ConsentBadge({ status }) {
  const map = {
    opted_in: { c: '#10b981', l: 'Opted In' },
    pending: { c: '#f59e0b', l: 'Pending' },
    declined: { c: '#ef4444', l: 'Declined' },
    unknown: { c: '#6b7280', l: 'Unknown' },
  };
  const v = map[status] || map.unknown;
  return <span className="text-xs px-2 py-1 rounded-full whitespace-nowrap" style={{ background: v.c + '22', color: v.c }}>{v.l}</span>;
}
function StatusBadge({ status }) {
  const map = {
    active: { c: '#10b981', l: 'Active' },
    bounced: { c: '#ef4444', l: 'Bounced' },
    unsubscribed: { c: '#f59e0b', l: 'Unsub' },
    archived: { c: '#6b7280', l: 'Archived' },
  };
  const v = map[status] || map.active;
  return <span className="text-xs px-2 py-1 rounded-full whitespace-nowrap" style={{ background: v.c + '22', color: v.c }}>{v.l}</span>;
}

function DeleteContactButton({ contactId, audienceId }) {
  const queryClient = useQueryClient();
  const del = useMutation({
    mutationFn: () => base44.entities.AudienceContact.delete(contactId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['audience-contacts', audienceId] }),
  });
  return (
    <button onClick={() => del.mutate()} className="p-1 hover:bg-red-500/20 rounded">
      <Trash2 className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
    </button>
  );
}

// ─── Import Contacts Modal (CSV paste) ────────────────────────────────────
function ImportContactsModal({ audienceId, audiences, onClose }) {
  const queryClient = useQueryClient();
  const [targetAudienceId, setTargetAudienceId] = useState(audienceId || '');
  const [csvText, setCsvText] = useState('');
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);

  const sample = `name,email,phone,company,title,department,city,state
Jane Smith,jane@acme.com,4155551234,Acme Corp,VP Human Resources,HR,San Francisco,CA
John Davis,john@bigco.com,3105559876,BigCo Inc,Global Mobility Manager,Global Mobility,Los Angeles,CA`;

  const handleImport = async () => {
    if (!targetAudienceId) { alert('Select an audience'); return; }
    if (!csvText.trim()) { alert('Paste CSV data'); return; }
    setImporting(true);
    try {
      const lines = csvText.trim().split('\n');
      const header = lines[0].toLowerCase().split(',').map(h => h.trim());
      const nameIdx = header.findIndex(h => h.includes('name') && !h.includes('company'));
      const emailIdx = header.findIndex(h => h.includes('email'));
      const phoneIdx = header.findIndex(h => h.includes('phone'));
      const companyIdx = header.findIndex(h => h.includes('company'));
      const titleIdx = header.findIndex(h => h.includes('title') || h.includes('role'));
      const deptIdx = header.findIndex(h => h.includes('department') || h.includes('dept'));
      const cityIdx = header.findIndex(h => h.includes('city'));
      const stateIdx = header.findIndex(h => h.includes('state'));
      const audience = audiences.find(a => a.id === targetAudienceId);

      const records = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = parseCsvLine(lines[i]);
        if (!cols[nameIdx] && !cols[emailIdx]) continue;
        records.push({
          audience_id: targetAudienceId,
          audience_name: audience?.audience_name || '',
          contact_name: cols[nameIdx]?.trim() || '',
          email: cols[emailIdx]?.trim() || '',
          phone: cols[phoneIdx]?.trim() || '',
          company: cols[companyIdx]?.trim() || '',
          title: cols[titleIdx]?.trim() || '',
          department: cols[deptIdx]?.trim() || '',
          city: cols[cityIdx]?.trim() || '',
          state: cols[stateIdx]?.trim() || '',
          consent_status: 'pending',
          recruitment_source: 'csv_import',
          import_batch: `csv-${new Date().toISOString().slice(0, 10)}`,
          status: 'active',
        });
      }

      const created = await base44.entities.AudienceContact.bulkCreate(records);
      setResult({ success: true, count: created.length || records.length });
      queryClient.invalidateQueries({ queryKey: ['audience-contacts', targetAudienceId] });
    } catch (e) {
      setResult({ success: false, error: e.message });
    } finally {
      setImporting(false);
    }
  };

  return (
    <ModalShell title="Import Contacts (CSV)" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block" style={{ color: GOLD }}>Target Audience</label>
          <select
            value={targetAudienceId}
            onChange={(e) => setTargetAudienceId(e.target.value)}
            className="w-full rounded-lg px-3 py-2 text-sm"
            style={{ background: '#1a1a1a', color: '#fff', border: '1px solid #444' }}
          >
            <option value="">Select audience...</option>
            {audiences.map(a => <option key={a.id} value={a.id}>{a.audience_name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block" style={{ color: GOLD }}>CSV Data (first row = headers)</label>
          <Textarea
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            rows={8}
            placeholder={sample}
            className="font-mono text-xs"
            style={{ background: '#1a1a1a', color: '#fff', border: '1px solid #444' }}
          />
          <p className="text-xs mt-1" style={{ color: '#888' }}>Supported columns: name, email, phone, company, title, department, city, state</p>
        </div>
        {result && (
          <div className="rounded-lg p-3" style={{
            background: result.success ? '#10b98122' : '#ef444422',
            border: `1px solid ${result.success ? '#10b981' : '#ef4444'}`
          }}>
            {result.success ? (
              <p className="text-sm flex items-center gap-2" style={{ color: '#10b981' }}>
                <CheckCircle2 className="w-4 h-4" /> Imported {result.count} contacts.
              </p>
            ) : (
              <p className="text-sm flex items-center gap-2" style={{ color: '#ef4444' }}>
                <AlertCircle className="w-4 h-4" /> {result.error}
              </p>
            )}
          </div>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} style={{ borderColor: '#444', color: '#aaa' }}>Close</Button>
          <Button onClick={handleImport} disabled={importing} className="gap-2" style={{ background: GOLD, color: '#000' }}>
            {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Import
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}

// ─── Add Contact Modal ─────────────────────────────────────────────────────
function AddContactModal({ audienceId, audienceName, onClose }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    contact_name: '', email: '', phone: '', company: '', title: '', department: '', city: '', state: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.contact_name) { alert('Name is required'); return; }
    setSaving(true);
    try {
      await base44.entities.AudienceContact.create({
        ...form,
        audience_id: audienceId,
        audience_name: audienceName || '',
        consent_status: 'pending',
        recruitment_source: 'manual_entry',
        status: 'active',
      });
      queryClient.invalidateQueries({ queryKey: ['audience-contacts', audienceId] });
      onClose();
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell title="Add Contact" onClose={onClose}>
      <div className="space-y-3">
        <Field label="Name *">
          <Input value={form.contact_name} onChange={e => setForm({ ...form, contact_name: e.target.value })}
            style={inputStyle} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Email">
            <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
          </Field>
          <Field label="Phone">
            <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
          </Field>
        </div>
        <Field label="Company">
          <Input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} style={inputStyle} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Title">
            <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} />
          </Field>
          <Field label="Department">
            <Input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} style={inputStyle} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="City">
            <Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={inputStyle} />
          </Field>
          <Field label="State">
            <Input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} style={inputStyle} />
          </Field>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} style={{ borderColor: '#444', color: '#aaa' }}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2" style={{ background: GOLD, color: '#000' }}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}

// ─── Send Show Modal ───────────────────────────────────────────────────────
function SendShowModal({ audienceId, audienceName, eligibleCount, onClose }) {
  const [broadcastId, setBroadcastId] = useState('');
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [firstTouch, setFirstTouch] = useState(false);

  React.useEffect(() => {
    base44.entities.DnnBroadcast.list('-created_date', 20).then(b => {
      setBroadcasts(b.filter(x => x.compositedVideoUrl || x.videoUrl));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSend = async () => {
    if (!broadcastId) { alert('Select a broadcast'); return; }
    setSending(true);
    try {
      const res = await base44.functions.invoke('dnnAudienceDistribute', {
        broadcast_id: broadcastId,
        audience_id: audienceId,
        mode: firstTouch ? 'first_touch' : 'broadcast',
      });
      setResult(res);
    } catch (e) {
      setResult({ error: e.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <ModalShell title="Send Show to Audience" onClose={onClose}>
      <div className="space-y-4">
        <div className="rounded-lg p-3" style={{ background: '#1a1a1a', border: `1px solid ${GOLD}44` }}>
          <p className="text-sm" style={{ color: '#aaa' }}>
            Audience: <span style={{ color: GOLD, fontWeight: 600 }}>{audienceName}</span>
          </p>
          <p className="text-sm mt-1" style={{ color: '#aaa' }}>
            Eligible recipients: <span style={{ color: '#fff', fontWeight: 600 }}>{eligibleCount}</span>
          </p>
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block" style={{ color: GOLD }}>Select Broadcast</label>
          {loading ? (
            <p style={{ color: '#888' }}>Loading broadcasts...</p>
          ) : (
            <select
              value={broadcastId}
              onChange={e => setBroadcastId(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm"
              style={{ background: '#1a1a1a', color: '#fff', border: '1px solid #444' }}
            >
              <option value="">Select broadcast...</option>
              {broadcasts.map(b => (
                <option key={b.id} value={b.id}>
                  {b.show_name || `Show ${b.show_number}`}{b.broadcast_date ? ` · ${b.broadcast_date}` : ''}
                </option>
              ))}
            </select>
          )}
        </div>
        <label className="flex items-start gap-3 rounded-lg p-3 cursor-pointer transition-all" style={{
          background: firstTouch ? `${GOLD}1a` : '#1a1a1a',
          border: `1px solid ${firstTouch ? GOLD : '#444'}`,
        }}>
          <input
            type="checkbox"
            checked={firstTouch}
            onChange={e => setFirstTouch(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-yellow-500"
          />
          <div>
            <p className="text-sm font-semibold" style={{ color: firstTouch ? GOLD : '#fff' }}>
              ✉️ First Touch (Cold Intro)
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#aaa' }}>
              Sends the saved cold-intro email template (with [First Name]/[Company Name] merged per contact) instead of the broadcast link. Only contacts who haven't received anything yet are emailed.
            </p>
          </div>
        </label>
        <div className="rounded-lg p-3 text-sm" style={{ background: '#1a1a1a', border: '1px solid #333' }}>
          <p style={{ color: '#888' }} className="mb-1">
            <Mail className="w-3.5 h-3.5 inline mr-1" style={{ color: GOLD }} />
            {firstTouch
              ? 'Each new contact receives the cold-intro email via your connected Gmail account.'
              : 'Each contact receives a personalized email via your connected Gmail account with a link to watch the broadcast.'}
          </p>
        </div>
        {result && (
          <div className="rounded-lg p-3" style={{
            background: result.error ? '#ef444422' : (result.success ? '#10b98122' : '#f59e0b22'),
            border: `1px solid ${result.error ? '#ef4444' : (result.success ? '#10b981' : '#f59e0b')}`
          }}>
            {result.error ? (
              <p className="text-sm flex items-center gap-2" style={{ color: '#ef4444' }}>
                <AlertCircle className="w-4 h-4" /> {result.error}
              </p>
            ) : (
              <div className="text-sm" style={{ color: '#fff' }}>
                <p className="flex items-center gap-2 font-semibold mb-1">
                  <CheckCircle2 className="w-4 h-4" style={{ color: '#10b981' }} />
                  Sent: {result.sent} · Failed: {result.failed}
                </p>
                <p style={{ color: '#aaa', fontSize: 12 }}>
                  Audience: {result.audience_name} · Eligible: {result.eligible} of {result.total_contacts}
                </p>
              </div>
            )}
          </div>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} style={{ borderColor: '#444', color: '#aaa' }}>Close</Button>
          <Button onClick={handleSend} disabled={sending || !broadcastId} className="gap-2" style={{ background: GOLD, color: '#000' }}>
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send via Gmail
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}

// ─── Shared bits ──────────────────────────────────────────────────────────
const inputStyle = { background: '#1a1a1a', color: '#fff', border: '1px solid #444' };

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-medium mb-1 block" style={{ color: '#aaa' }}>{label}</label>
      {children}
    </div>
  );
}

function ModalShell({ title, onClose, children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="rounded-xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6"
        style={{ background: '#2a2a2a', border: `1px solid ${GOLD}66` }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold" style={{ color: '#fff' }}>{title}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10">
            <X className="w-5 h-5" style={{ color: '#888' }} />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQuotes = !inQuotes; }
    else if (ch === ',' && !inQuotes) { result.push(current); current = ''; }
    else { current += ch; }
  }
  result.push(current);
  return result;
}