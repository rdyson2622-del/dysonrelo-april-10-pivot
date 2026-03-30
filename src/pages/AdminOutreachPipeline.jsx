import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Phone, CheckCircle2, AlertCircle, Clock, ChevronDown, ChevronUp, Send, Ban, Home, RefreshCw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STAGES = [
  { key: 'outreach',        label: 'Initial SMS Sent',     color: '#3B82F6', step: 1 },
  { key: 'followup_day3',   label: 'Day 3 Follow-Up',      color: '#F59E0B', step: 2 },
  { key: 'followup_day7',   label: 'Day 7 Follow-Up',      color: '#EF4444', step: 3 },
  { key: 'followup_day14',  label: 'Day 14 Final',         color: '#8B5CF6', step: 4 },
  { key: 'response',        label: 'Owner Responded',      color: '#10B981', step: 5 },
  { key: 'profile_complete',label: 'Profile Complete',     color: '#059669', step: 6 },
  { key: 'processing',      label: 'Charlie Engaged',      color: '#D4AF37', step: 7 },
  { key: 'closed',          label: 'Closed',               color: '#6B7280', step: 8 },
];

const SMS_SCRIPTS = {
  initial: (firstName, address) =>
    `Hi ${firstName}, this is Dyson & Dyson Concierge Relocation. We noticed your home is listed — are you planning to relocate? We offer a FREE concierge service to find your next home & manage your entire move. Learn more: dysonrelo.com — Reply YES or call Bob at (858) 353-1200. Reply STOP to opt out.`,
  day3: (firstName, address) =>
    `Hi ${firstName}, just following up — your home at ${address} is listed and we wanted to make sure you saw our note. Our AI concierge Charlie handles your ENTIRE relocation FREE — neighborhoods, schools, agents, everything. Just reply YES to get started. Reply STOP to opt out.`,
  day7: (firstName) =>
    `Hey ${firstName} — Bob Dyson here from Dyson & Dyson Relocation. 54 years in real estate. We've helped hundreds of families move seamlessly. If you're heading somewhere new, Charlie (our AI) will map out your whole move for free. Worth 2 minutes? Reply YES or call (858) 353-1200. Reply STOP to opt out.`,
  day14: (firstName) =>
    `${firstName}, last message from us — if you're still planning a move, dysonrelo.com has everything you need: AI neighborhood research, school ratings, cost-of-living, agent matching — completely free. No obligation. Just reply YES or visit dysonrelo.com. Reply STOP to opt out.`,
};

function getDaysSince(dateStr) {
  if (!dateStr) return null;
  return Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
}

function getCampaignStepInfo(campaign) {
  const notes = campaign.notes || '';
  const days = getDaysSince(campaign.sms_sent_date);
  const hasDay3 = notes.includes('[FOLLOWUP-DAY3]');
  const hasDay7 = notes.includes('[FOLLOWUP-DAY7]');
  const hasDay14 = notes.includes('[FOLLOWUP-DAY14]');

  if (campaign.workflow_stage === 'closed') return { stage: 'closed', step: 8, nextAction: null };
  if (campaign.workflow_stage === 'processing') return { stage: 'processing', step: 7, nextAction: 'Charlie is engaged' };
  if (campaign.workflow_stage === 'profile_complete') return { stage: 'profile_complete', step: 6, nextAction: 'Engage Charlie' };
  if (campaign.workflow_stage === 'response') return { stage: 'response', step: 5, nextAction: 'Complete profile & engage Charlie' };
  if (!days && days !== 0) return { stage: 'outreach', step: 1, nextAction: 'Initial SMS not sent yet — send from Listing Owners page', days: null };
  if (hasDay14) return { stage: 'followup_day14', step: 4, nextAction: 'Awaiting response after final follow-up', days };
  if (hasDay7) return { stage: 'followup_day7', step: 3, nextAction: days >= 14 ? 'Day 14 final follow-up ready to send' : `Day 14 sends in ${14 - days} days`, days };
  if (hasDay3) return { stage: 'followup_day3', step: 2, nextAction: days >= 7 ? 'Day 7 follow-up ready to send' : `Day 7 sends in ${7 - days} days`, days };
  return { stage: 'outreach', step: 1, nextAction: days >= 3 ? 'Day 3 follow-up ready to send' : `Day 3 sends in ${3 - days} days`, days };
}

function ScriptPreview({ script }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-2">
      <button onClick={() => setOpen(o => !o)} className="flex items-center gap-1 text-xs text-blue-600 hover:underline font-semibold">
        <MessageSquare className="w-3 h-3" />
        {open ? 'Hide script' : 'View SMS script'}
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 bg-slate-900 text-white rounded-xl px-4 py-3 text-xs leading-relaxed font-mono">
              {script}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PipelineCard({ campaign, onSendFollowUp, onClose, onAdvance, sending }) {
  const info = getCampaignStepInfo(campaign);
  const stageConfig = STAGES.find(s => s.key === info.stage) || STAGES[0];
  const firstName = campaign.owner_name?.split(' ')[0] || 'there';
  const address = campaign.property_address || 'your property';

  const nextScriptKey = info.stage === 'outreach' && info.days >= 3 ? 'day3'
    : info.stage === 'followup_day3' && info.days >= 7 ? 'day7'
    : info.stage === 'followup_day7' && info.days >= 14 ? 'day14'
    : null;

  const nextScript = nextScriptKey ? SMS_SCRIPTS[nextScriptKey]?.(firstName, address) : null;
  const isClosed = campaign.workflow_stage === 'closed';
  const isResponded = ['response', 'profile_complete', 'processing'].includes(campaign.workflow_stage);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl border p-4 shadow-sm ${isClosed ? 'opacity-60 border-slate-200' : 'border-slate-200 hover:shadow-md'} transition-all`}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-900">{campaign.owner_name}</span>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: `${stageConfig.color}18`, color: stageConfig.color }}
            >
              Step {info.step}: {stageConfig.label}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{campaign.property_address}</p>
          {campaign.listing_price && (
            <p className="text-xs text-slate-400">${(campaign.listing_price / 1000).toFixed(0)}k listed</p>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-slate-400">Phone</p>
          <p className="text-xs font-mono font-semibold text-slate-700">{campaign.owner_phone || '—'}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 flex gap-1">
        {STAGES.slice(0, 7).map((s) => (
          <div
            key={s.key}
            className="h-1.5 flex-1 rounded-full"
            style={{ background: info.step >= s.step ? s.color : '#e2e8f0' }}
          />
        ))}
      </div>

      {/* Next Action */}
      {!isClosed && (
        <div className="mt-3 flex items-start gap-2">
          {isResponded ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          ) : nextScript ? (
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          ) : (
            <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          )}
          <p className="text-xs text-slate-600 font-medium">{info.nextAction}</p>
        </div>
      )}

      {/* Script preview for next follow-up */}
      {nextScript && !isClosed && (
        <ScriptPreview script={nextScript} />
      )}

      {/* Initial script always visible */}
      {info.stage === 'outreach' && (info.days === null || info.days < 3) && !isClosed && (
        <ScriptPreview script={SMS_SCRIPTS.initial(firstName, address)} />
      )}

      {/* Action Buttons */}
      {!isClosed && (
        <div className="mt-3 flex gap-2 flex-wrap">
          {nextScriptKey && (
            <Button
              size="sm"
              disabled={sending === campaign.id}
              onClick={() => onSendFollowUp(campaign, nextScriptKey, nextScript)}
              className="gap-1 text-xs bg-slate-900 hover:bg-slate-700 text-white"
            >
              {sending === campaign.id ? (
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-3 h-3" />
              )}
              Send {nextScriptKey === 'day3' ? 'Day 3' : nextScriptKey === 'day7' ? 'Day 7' : 'Day 14'} Follow-Up
            </Button>
          )}
          {campaign.workflow_stage === 'response' && (
            <Button size="sm" variant="outline" className="gap-1 text-xs text-emerald-700 border-emerald-300 hover:bg-emerald-50"
              onClick={() => onAdvance(campaign.id, 'profile_complete')}>
              <CheckCircle2 className="w-3 h-3" /> Mark Profile Complete
            </Button>
          )}
          {campaign.workflow_stage === 'profile_complete' && (
            <Button size="sm" variant="outline" className="gap-1 text-xs text-purple-700 border-purple-300 hover:bg-purple-50"
              onClick={() => onAdvance(campaign.id, 'processing')}>
              <Zap className="w-3 h-3" /> Engage Charlie
            </Button>
          )}
          <Button
            size="sm" variant="outline"
            onClick={() => { if (confirm(`Mark ${campaign.owner_name} as property sold?`)) onClose(campaign.id, 'Sold'); }}
            className="gap-1 text-xs text-amber-700 border-amber-200 hover:bg-amber-50"
          >
            <Home className="w-3 h-3" /> Sold
          </Button>
          <Button
            size="sm" variant="outline"
            onClick={() => { if (confirm(`Stop all SMS for ${campaign.owner_name}?`)) onClose(campaign.id, 'Opted out'); }}
            className="gap-1 text-xs text-red-600 border-red-200 hover:bg-red-50"
          >
            <Ban className="w-3 h-3" /> Opt-Out
          </Button>
        </div>
      )}

      {isClosed && (
        <p className="mt-3 text-xs font-semibold text-slate-400">⛔ Closed — no further SMS</p>
      )}
    </motion.div>
  );
}

export default function AdminOutreachPipeline() {
  const [filter, setFilter] = useState('active');
  const [sending, setSending] = useState(null);
  const [runningAuto, setRunningAuto] = useState(false);
  const [autoResult, setAutoResult] = useState(null);
  const queryClient = useQueryClient();

  // Campaigns are always stored in prod (created by backend function via asServiceRole)
  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['outreach_pipeline'],
    queryFn: () => base44.entities.OwnerOutreachCampaign.list('-sms_sent_date', 200),
  });

  const filtered = campaigns.filter(c => {
    if (filter === 'active') return c.workflow_stage !== 'closed';
    if (filter === 'responded') return ['response', 'profile_complete', 'processing'].includes(c.workflow_stage);
    if (filter === 'needs_followup') {
      const info = getCampaignStepInfo(c);
      return info.nextAction?.includes('ready to send');
    }
    if (filter === 'closed') return c.workflow_stage === 'closed';
    return true;
  });

  const needsFollowUp = campaigns.filter(c => {
    const info = getCampaignStepInfo(c);
    return info.nextAction?.includes('ready to send');
  }).length;

  const sendFollowUp = async (campaign, type, script) => {
    setSending(campaign.id);
    try {
      const accountSid = await base44.functions.invoke('sendFollowUpSMS', {
        _manual: true,
        campaign_id: campaign.id,
        phone: campaign.owner_phone,
        owner_name: campaign.owner_name,
        message: script,
        type,
      });
      // Mark in notes
      await base44.entities.OwnerOutreachCampaign.update(campaign.id, {
        notes: (campaign.notes || '') + `\n[${new Date().toLocaleDateString()}] [FOLLOWUP-${type.toUpperCase()}] Manual follow-up sent.`,
      });
      queryClient.invalidateQueries({ queryKey: ['outreach_pipeline'] });
    } catch (e) {
      alert('Failed: ' + e.message);
    } finally {
      setSending(null);
    }
  };

  const closeCampaign = async (id, reason) => {
    await base44.entities.OwnerOutreachCampaign.update(id, {
      workflow_stage: 'closed',
      notes: (campaigns.find(c => c.id === id)?.notes || '') + `\n[${new Date().toLocaleDateString()}] Closed — ${reason}.`,
    });
    queryClient.invalidateQueries({ queryKey: ['outreach_pipeline'] });
  };

  const advanceStage = async (id, newStage) => {
    await base44.entities.OwnerOutreachCampaign.update(id, { workflow_stage: newStage });
    queryClient.invalidateQueries({ queryKey: ['outreach_pipeline'] });
  };

  const runAutoFollowUps = async () => {
    setRunningAuto(true);
    setAutoResult(null);
    try {
      const res = await base44.functions.invoke('sendFollowUpSMS', {});
      setAutoResult(res.data);
    } catch (e) {
      setAutoResult({ error: e.message });
    } finally {
      setRunningAuto(false);
      queryClient.invalidateQueries({ queryKey: ['outreach_pipeline'] });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Outreach Pipeline</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {campaigns.filter(c => c.workflow_stage !== 'closed').length} active leads ·{' '}
              {campaigns.filter(c => ['response','profile_complete','processing'].includes(c.workflow_stage)).length} responded ·{' '}
              <span className={needsFollowUp > 0 ? 'text-amber-600 font-semibold' : ''}>
                {needsFollowUp} need follow-up now
              </span>
            </p>
          </div>
          <Button
            onClick={runAutoFollowUps}
            disabled={runningAuto}
            className="gap-2 bg-slate-900 hover:bg-slate-700 text-white"
          >
            {runningAuto ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Running...</>
            ) : (
              <><RefreshCw className="w-4 h-4" /> Run Auto Follow-Ups Now</>
            )}
          </Button>
        </div>

        {autoResult && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-semibold ${autoResult.error ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'}`}>
            {autoResult.error ? `Error: ${autoResult.error}` : `✓ Sent ${autoResult.sent} follow-up messages. ${autoResult.skipped} skipped.`}
          </div>
        )}

        {/* Sequence Info Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
          <p className="text-xs font-bold tracking-widest text-slate-400 mb-3">AUTOMATED SMS SEQUENCE</p>
          <div className="flex gap-4 flex-wrap">
            {[
              { label: 'Day 1', desc: 'Initial outreach', color: '#3B82F6' },
              { label: 'Day 3', desc: 'Service reminder', color: '#F59E0B' },
              { label: 'Day 7', desc: 'Bob personal intro', color: '#EF4444' },
              { label: 'Day 14', desc: 'Final message', color: '#8B5CF6' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                <span className="text-xs font-bold text-slate-700">{s.label}</span>
                <span className="text-xs text-slate-400">— {s.desc}</span>
                {i < 3 && <span className="text-slate-300 mx-1">→</span>}
              </div>
            ))}
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-slate-700">Reply YES</span>
              <span className="text-xs text-slate-400">— Pipeline advances, Charlie engaged</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {[
            { key: 'active', label: 'All Active' },
            { key: 'needs_followup', label: `Needs Follow-Up (${needsFollowUp})` },
            { key: 'responded', label: 'Responded' },
            { key: 'closed', label: 'Closed' },
            { key: 'all', label: 'All' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filter === tab.key
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Campaign Cards */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No campaigns in this view</p>
            <p className="text-sm mt-1">Go to Listing Owners to send your first outreach SMS</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(campaign => (
              <PipelineCard
                key={campaign.id}
                campaign={campaign}
                onSendFollowUp={sendFollowUp}
                onClose={closeCampaign}
                onAdvance={advanceStage}
                sending={sending}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}