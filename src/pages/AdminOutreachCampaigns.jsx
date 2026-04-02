import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Calendar, Users, DollarSign, CheckCircle2, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

const STATUS_COLORS = {
  planning: 'bg-slate-100 text-slate-800',
  content_creation: 'bg-blue-100 text-blue-800',
  scheduled: 'bg-amber-100 text-amber-800',
  active: 'bg-green-100 text-green-800',
  completed: 'bg-emerald-100 text-emerald-800',
  paused: 'bg-red-100 text-red-800'
};

export default function AdminOutreachCampaigns() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['marketing_campaigns'],
    queryFn: () => base44.entities.MarketingCampaign.list('-created_date', 100),
    initialData: []
  });

  const filteredCampaigns = campaigns.filter(c => {
    const matchSearch = c.campaign_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
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
            <h1 className="font-bold text-slate-900">Marketing Campaigns</h1>
            <p className="text-xs text-slate-500">Quick reference for all campaigns</p>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium bg-white"
          >
            <option value="all">All Status</option>
            <option value="planning">Planning</option>
            <option value="content_creation">Content Creation</option>
            <option value="scheduled">Scheduled</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
          </select>
          <Link to="/admin/marketing-campaigns">
            <Button variant="outline" size="sm">Full Editor →</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto" />
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Megaphone className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No campaigns yet</p>
            <p className="text-sm mt-1">
              <Link to="/admin/marketing-campaigns" className="text-blue-600 hover:underline">Create one →</Link>
            </p>
          </div>
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
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-start">
                  {/* Campaign Name */}
                  <div className="md:col-span-2">
                    <p className="font-semibold text-slate-900 text-sm">{campaign.campaign_name}</p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{campaign.description}</p>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[campaign.status]}`}>
                      {campaign.status}
                    </span>
                  </div>

                  {/* Dates */}
                  <div className="text-sm">
                    <div className="flex items-center gap-1 text-slate-600 mb-1">
                      <Calendar className="w-3 h-3" />
                      <span className="text-xs text-slate-500">Run:</span>
                    </div>
                    <p className="text-xs font-medium">
                      {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : 'TBD'} 
                      {campaign.end_date && ` - ${new Date(campaign.end_date).toLocaleDateString()}`}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="text-sm">
                    <div className="flex items-center gap-1 text-slate-600 mb-1">
                      <Users className="w-3 h-3" />
                      <span className="text-xs text-slate-500">Platforms:</span>
                    </div>
                    <p className="text-xs font-medium">{campaign.platforms?.length || 0} platforms</p>
                  </div>

                  {/* Budget */}
                  <div className="text-sm">
                    <div className="flex items-center gap-1 text-slate-600 mb-1">
                      <DollarSign className="w-3 h-3" />
                      <span className="text-xs text-slate-500">Budget:</span>
                    </div>
                    <p className="text-xs font-medium">${campaign.budget?.toLocaleString() || '0'}</p>
                  </div>

                  {/* Progress */}
                  <div className="text-sm">
                    <div className="flex items-center gap-1 text-slate-600 mb-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span className="text-xs text-slate-500">Posts:</span>
                    </div>
                    <p className="text-xs font-medium">{campaign.posts_created || 0}/{campaign.total_posts_planned || 0}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

    </div>
  );
}