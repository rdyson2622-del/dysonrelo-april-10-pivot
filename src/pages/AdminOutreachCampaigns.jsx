import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import OutreachWorkflow from '../components/admin/OutreachWorkflow';
import OutreachProcessGuide from '../components/admin/OutreachProcessGuide';
import PropertyDetailsPanel from '../components/admin/PropertyDetailsPanel';
import OutreachTaskList from '../components/admin/OutreachTaskList';

const STAGE_COLORS = {
  outreach: 'bg-blue-100 text-blue-800',
  response: 'bg-amber-100 text-amber-800',
  profile_complete: 'bg-emerald-100 text-emerald-800',
  processing: 'bg-purple-100 text-purple-800',
  closed: 'bg-slate-100 text-slate-800'
};

export default function AdminOutreachCampaigns() {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [sendingSMS, setSendingSMS] = useState(null);
  const queryClient = useQueryClient();

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['outreach_campaigns'],
    queryFn: () => base44.entities.OwnerOutreachCampaign.list(),
    initialData: []
  });

  const sendOutreachSMS = useMutation({
    mutationFn: async (listing_owner_id) => {
      const owner = await base44.entities.ListingOwner.get(listing_owner_id);
      return base44.functions.invoke('sendOwnerOutreachSMS', {
        listing_owner_id,
        phone: owner.phone,
        owner_name: owner.owner_name
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach_campaigns'] });
      setSendingSMS(null);
    }
  });

  const updateStage = useMutation({
    mutationFn: async ({ campaign_id, new_stage, ...data }) => {
      // Update the campaign stage
      await base44.functions.invoke('updateCampaignStage', {
        campaign_id,
        new_stage,
        ...data
      });

      // Generate tasks for the new stage
      const campaign = campaigns.find((c) => c.id === campaign_id);
      if (campaign) {
        await base44.functions.invoke('generateOutreachTasks', {
          campaign_id,
          campaign_stage: new_stage,
          owner_name: campaign.owner_name,
          property_address: campaign.property_address,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach_campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['outreach_tasks'] });
      setSelectedCampaign(null);
    }
  });

  const filteredCampaigns = campaigns.filter(c => {
    const matchSearch = c.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       c.property_address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStage = stageFilter === 'all' || c.workflow_stage === stageFilter;
    return matchSearch && matchStage;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center gap-3 border-b border-slate-100">
          <Link to="/admin">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-bold text-slate-900">Listing Outreach Campaigns</h1>
            <p className="text-xs text-slate-500">Manage SMS outreach and workflow progression</p>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search owners or properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium bg-white"
          >
            <option value="all">All Stages</option>
            <option value="outreach">Outreach</option>
            <option value="response">Response</option>
            <option value="profile_complete">Profile Complete</option>
            <option value="processing">Processing</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto" />
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <OutreachProcessGuide />
        ) : (
          <div className="grid gap-4">
            {filteredCampaigns.map((campaign, idx) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-lg border border-slate-200 p-5 hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedCampaign(campaign)}
              >
                <div className="grid grid-cols-5 gap-4 items-start">
                  {/* Owner Info */}
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{campaign.owner_name}</p>
                    <p className="text-xs text-slate-500 mt-1">{campaign.property_address}</p>
                  </div>

                  {/* Stage Badge */}
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STAGE_COLORS[campaign.workflow_stage]}`}>
                      {campaign.workflow_stage}
                    </span>
                  </div>

                  {/* Destination */}
                  <div>
                    {campaign.destination_city ? (
                      <>
                        <p className="text-sm text-slate-900 font-medium">{campaign.destination_city}, {campaign.destination_state}</p>
                        <p className="text-xs text-slate-500">Budget: {campaign.destination_price_range}</p>
                      </>
                    ) : (
                      <p className="text-xs text-slate-400">Not provided</p>
                    )}
                  </div>

                  {/* Dates */}
                  <div>
                    <p className="text-xs text-slate-500">SMS Sent:</p>
                    <p className="text-sm text-slate-900 font-medium">{new Date(campaign.sms_sent_date).toLocaleDateString()}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2">
                    {campaign.workflow_stage === 'outreach' && !campaign.sms_sent_date && (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSendingSMS(campaign.listing_owner_id);
                          sendOutreachSMS.mutate(campaign.listing_owner_id);
                        }}
                        disabled={sendingSMS === campaign.listing_owner_id}
                        className="gap-1"
                      >
                        <Send className="w-3 h-3" />
                        Send SMS
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Detail Panel */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-start justify-end">
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="bg-white w-96 h-screen shadow-xl overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">{selectedCampaign.owner_name}</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedCampaign(null)}
              >
                ✕
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">PROPERTY</p>
                <p className="text-sm text-slate-900">{selectedCampaign.property_address}</p>
                <p className="text-xs text-slate-500 mt-1">${selectedCampaign.listing_price?.toLocaleString()}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">CONTACT</p>
                <p className="text-sm text-slate-900 font-mono">{selectedCampaign.owner_phone}</p>
              </div>

              <PropertyDetailsPanel campaign={selectedCampaign} />

              <OutreachTaskList campaign_id={selectedCampaign.id} />

              <OutreachWorkflow
                campaign={selectedCampaign}
                onStageChange={(newStage) => updateStage.mutate({
                  campaign_id: selectedCampaign.id,
                  new_stage: newStage
                })}
                onEdit={() => {}}
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}