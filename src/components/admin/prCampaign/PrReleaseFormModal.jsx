import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const DISCLOSURE_MODES = ['Spoken', 'On-screen only', 'Both'];

export default function PrReleaseFormModal({ release, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: release?.title || '',
    slug: release?.slug || '',
    campaign: release?.campaign || 'Dyson Homes CoPilot Ongoing Media',
    weekLabel: release?.weekLabel || '',
    scriptBody: release?.scriptBody || '',
    newsSummary: release?.newsSummary || '',
    disclosure: release?.disclosure || '',
    disclosureMode: release?.disclosureMode || '',
    ctaSite: release?.ctaSite || 'dysonhomes.com',
    ctaPhone: release?.ctaPhone || '',
    ctaOffer: release?.ctaOffer || '',
    notes: release?.notes || '',
  });
  const [saving, setSaving] = useState(false);

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const save = async () => {
    setSaving(true);
    if (release) {
      await base44.entities.PrRelease.update(release.id, form);
    } else {
      await base44.entities.PrRelease.create(form);
    }
    setSaving(false);
    onSaved();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{release ? 'Edit Release' : 'New Release'}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Title" value={form.title} onChange={e => set('title', e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Slug" value={form.slug} onChange={e => set('slug', e.target.value)} />
            <Input placeholder="Week label (e.g. Week-1)" value={form.weekLabel} onChange={e => set('weekLabel', e.target.value)} />
          </div>
          <Input placeholder="Campaign" value={form.campaign} onChange={e => set('campaign', e.target.value)} />
          <Textarea placeholder="Script body" rows={8} value={form.scriptBody} onChange={e => set('scriptBody', e.target.value)} />
          <Textarea placeholder="News summary (optional — used as the DNN News article body instead of the full script)" rows={3} value={form.newsSummary} onChange={e => set('newsSummary', e.target.value)} />
          <Textarea placeholder="Disclosure line" rows={2} value={form.disclosure} onChange={e => set('disclosure', e.target.value)} />
          <Select value={form.disclosureMode} onValueChange={v => set('disclosureMode', v)}>
            <SelectTrigger><SelectValue placeholder="Disclosure mode" /></SelectTrigger>
            <SelectContent>{DISCLOSURE_MODES.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
          </Select>
          <div className="grid grid-cols-3 gap-3">
            <Input placeholder="CTA site" value={form.ctaSite} onChange={e => set('ctaSite', e.target.value)} />
            <Input placeholder="CTA phone" value={form.ctaPhone} onChange={e => set('ctaPhone', e.target.value)} />
            <Input placeholder="CTA offer" value={form.ctaOffer} onChange={e => set('ctaOffer', e.target.value)} />
          </div>
          <Textarea placeholder="Internal notes" rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={save} disabled={saving || !form.title}>{saving ? 'Saving…' : 'Save'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}