import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Radio, Calendar } from 'lucide-react';

function formatWhen(iso) {
  if (!iso) return 'Not yet posted';
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default function MediaDistributionPlanCard() {
  const [releases, setReleases] = useState([]);
  const [distributions, setDistributions] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [rel, dist] = await Promise.all([
      base44.entities.PrRelease.list('-created_date', 100),
      base44.entities.PrDistribution.list('-postedAt', 300),
    ]);
    setReleases(rel);
    setDistributions(dist);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const campaigns = {};
  releases.forEach(r => {
    const key = r.campaign || 'Uncategorized';
    if (!campaigns[key]) campaigns[key] = [];
    campaigns[key].push(r);
  });
  Object.values(campaigns).forEach(list =>
    list.sort((a, b) => (a.loopDay ?? 99) - (b.loopDay ?? 99) || new Date(b.created_date) - new Date(a.created_date))
  );

  return (
    <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#111111] p-5 text-white">
      <div className="flex items-center gap-2 mb-1">
        <Calendar className="w-4 h-4 text-[#D4AF37]" />
        <h2 className="text-lg font-semibold text-[#D4AF37]">Media Distribution Plan</h2>
      </div>
      <p className="text-xs text-white/50 mb-3">Click a campaign, then a video, to see exactly what's going out — and when — to which channel or audience.</p>

      {loading ? (
        <p className="text-sm text-white/50">Loading…</p>
      ) : Object.keys(campaigns).length === 0 ? (
        <p className="text-sm text-white/50">No campaigns in the PR library yet.</p>
      ) : (
        <Accordion type="multiple" className="w-full">
          {Object.entries(campaigns).map(([campaignName, items]) => (
            <AccordionItem key={campaignName} value={campaignName} className="border-white/10">
              <AccordionTrigger className="text-white hover:no-underline">
                <span className="flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {campaignName}
                  <span className="text-xs text-white/40">({items.length})</span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <Accordion type="multiple" className="ml-2 border-l border-white/10 pl-3">
                  {items.map(release => {
                    const releaseDist = distributions.filter(d => d.pr_release_id === release.id);
                    return (
                      <AccordionItem key={release.id} value={release.id} className="border-white/5">
                        <AccordionTrigger className="text-sm text-white/90 hover:no-underline py-2.5">
                          <span className="flex items-center gap-2 text-left">
                            {release.loopDay ? (
                              <span className="shrink-0 w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold flex items-center justify-center">D{release.loopDay}</span>
                            ) : null}
                            <span className="truncate">{release.title}</span>
                            <span className="text-[10px] uppercase tracking-wide text-white/40 shrink-0">{release.status}</span>
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="text-xs text-white/60 space-y-1 pb-1">
                            <p><span className="text-white/40">Audience:</span> {release.targetAudience || '—'}</p>
                            <p><span className="text-white/40">Hook:</span> {release.bannerHook || '—'}</p>
                          </div>
                          {releaseDist.length === 0 ? (
                            <p className="text-xs text-white/40 italic">No distribution scheduled or posted yet.</p>
                          ) : (
                            <div className="space-y-1.5">
                              {releaseDist.map(d => (
                                <div key={d.id} className="flex items-center justify-between text-xs bg-white/5 rounded-lg px-3 py-2">
                                  <span className="font-medium text-[#D4AF37]">{d.channel}</span>
                                  <span className="text-white/60 truncate max-w-[160px]">{d.destination || '—'}</span>
                                  <span className="text-white/40">{formatWhen(d.postedAt)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}