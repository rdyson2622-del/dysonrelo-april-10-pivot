import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Pencil, Save } from 'lucide-react';

const DEFAULT_BODY = `Goal: Announce Dyson Homes CoPilot as a purchase/sale process guide that takes stress out of buying and selling; stress Bob's 55 years national relocation / RE; drive dysonhomes.com + "Text Me" Report + phone interview.

Owned lanes: (1) dysonhomes.com / CoPilot, (2) YouTube via rdyson2622 with DNN News sub-account delivery, (3) LinkedIn (Bob + company) weekly, (4) light trust mentions on 1dnn.com (not hard sell), (5) Google Ads creative once AW- tag is live, (6) consented email from bob@dysonrelo.com only.

Hold: Meta.

Cadence: owned ~1/week; earned press pitches ~1 every 2-4 weeks (not scheduled "posts").

Gate: Nothing public without Bob yes. Draft \u2192 Approved \u2192 Produced \u2192 Distributed \u2192 Archived.`;

export default function PrCampaignExplainerCard() {
  const [record, setRecord] = useState(null);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const list = await base44.entities.PrCampaign.list();
    let rec = list[0];
    if (!rec) {
      rec = await base44.entities.PrCampaign.create({ title: 'Dyson Homes CoPilot — Ongoing Media', body: DEFAULT_BODY });
    }
    setRecord(rec);
    setTitle(rec.title);
    setBody(rec.body || '');
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    await base44.entities.PrCampaign.update(record.id, { title, body });
    setEditing(false);
    load();
  };

  if (loading) return null;

  return (
    <div className="rounded-lg border bg-card p-5">
      {editing ? (
        <div className="space-y-3">
          <Input value={title} onChange={e => setTitle(e.target.value)} className="font-semibold" />
          <Textarea value={body} onChange={e => setBody(e.target.value)} rows={10} />
          <div className="flex gap-2">
            <Button onClick={save}><Save className="h-4 w-4 mr-2" />Save</Button>
            <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            <Button variant="ghost" size="sm" onClick={() => setEditing(true)}><Pencil className="h-4 w-4 mr-2" />Edit</Button>
          </div>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{body}</p>
        </div>
      )}
    </div>
  );
}