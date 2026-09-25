import React from 'react';
import GoogleAdsSnapshotCard from '@/components/admin/adsLeads/GoogleAdsSnapshotCard';
import AdViewerPreviewCard from '@/components/admin/adsLeads/AdViewerPreviewCard';
import CopilotLeadsTable from '@/components/admin/adsLeads/CopilotLeadsTable';
import PrLibrarySummaryCard from '@/components/admin/adsLeads/PrLibrarySummaryCard';
import MediaDistributionPlanCard from '@/components/admin/adsLeads/MediaDistributionPlanCard';

export default function AdminAdsLeadsDashboard() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Ads + Leads</h1>
        <p className="text-sm" style={{ color: '#0a0a0a' }}>Admin only. Month-1 Google Ads activity next to CoPilot leads. Chief's weekday morning board summarizes this — keep numbers updated after checking Google Ads.</p>
      </div>
      <GoogleAdsSnapshotCard />
      <AdViewerPreviewCard />
      <CopilotLeadsTable />
      <PrLibrarySummaryCard />
      <MediaDistributionPlanCard />
    </div>
  );
}