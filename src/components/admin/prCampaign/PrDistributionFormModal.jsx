import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const CHANNELS = ['YouTube', 'LinkedIn', '1dnn', 'dysonhomes', 'Email', 'Google Ads', 'Press/earned', 'Other'];

export default function PrDistributionFormModal({ releaseId, distribution, onClose, onSaved }) {
  const [form, setForm] = useState({
    channel: distribution?.channel || CHANNELS[0],
    destination: distribution?.destination || '',
    postedBy: distribution?.postedBy || '',
    externalId: distribution?.externalId || '',
    views: distribution?.views ?? '',
    watchTime: distribution?.watchTime ?? '',
    likes: distribution?.likes ?? '',
    comments: distribution?.comments ?? '',
    shares: distribution?.shares ?? '',
    clicks: distribution?.clicks ?? '',
    ctr: distribution?.ctr ?? '',
    leadsAttributed: distribution?.leadsAttributed ?? '',
    notes: distribution?.notes || '',
  });
  const [saving, setSaving] = useState(false);

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));
  const num = v => (v === '' ? undefined : Number(v));

  const save = async () => {
    setSaving(true);
    const payload = {
      channel: form.channel,
      destination: form.destination,
      postedBy: form.postedBy,
      externalId: form.externalId,
      views: num(form.views),
      watchTime: num(form.watchTime),
      likes: num(form.likes),
      comments: num(form.comments),
      shares: num(form.shares),
      clicks: num(form.clicks),
      ctr: num(form.ctr),
      leadsAttributed: num(form.leadsAttributed),
      notes: form.notes,
      metricsUpdatedAt: new Date().toISOString(),
    };
    if (distribution) {
      await base44.entities.PrDistribution.update(distribution.id, payload);
    } else {
      await base44.entities.PrDistribution.create({ ...payload, pr_release_id: releaseId, postedAt: new Date().toISOString() });
    }
    setSaving(false);
    onSaved();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{distribution ? 'Update Distribution / Metrics' : 'Add Distribution'}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Select value={form.channel} onValueChange={v => set('channel', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{CHANNELS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
          <Input placeholder="Destination (URL or account label)" value={form.destination} onChange={e => set('destination', e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Posted by" value={form.postedBy} onChange={e => set('postedBy', e.target.value)} />
            <Input placeholder="External ID" value={form.externalId} onChange={e => set('externalId', e.target.value)} />
          </div>
          <div className="grid grid-cols-4 gap-2">
            <Input placeholder="Views" type="number" value={form.views} onChange={e => set('views', e.target.value)} />
            <Input placeholder="Watch time" type="number" value={form.watchTime} onChange={e => set('watchTime', e.target.value)} />
            <Input placeholder="Likes" type="number" value={form.likes} onChange={e => set('likes', e.target.value)} />
            <Input placeholder="Comments" type="number" value={form.comments} onChange={e => set('comments', e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Input placeholder="Shares" type="number" value={form.shares} onChange={e => set('shares', e.target.value)} />
            <Input placeholder="Clicks" type="number" value={form.clicks} onChange={e => set('clicks', e.target.value)} />
            <Input placeholder="CTR %" type="number" value={form.ctr} onChange={e => set('ctr', e.target.value)} />
          </div>
          <Input placeholder="Leads attributed" type="number" value={form.leadsAttributed} onChange={e => set('leadsAttributed', e.target.value)} />
          <Textarea placeholder="Notes" rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}