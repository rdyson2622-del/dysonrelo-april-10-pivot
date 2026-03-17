import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, LayoutGrid, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AgentDatabase from '../components/admin/AgentDatabase';
import ReferralFeeCalculator from '../components/admin/ReferralFeeCalculator';
import ReferralTracker from '../components/admin/ReferralTracker';
import ReferralFlowMockup from '../components/admin/ReferralFlowMockup';

const GOLD = '#D4AF37';

export default function AdminReferrals() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/Admin">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Referral Management</h1>
          <p className="text-sm text-slate-500 mt-1">Agent network, fee calculations, and referral flow modeling</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2" style={{ background: '#f5f5f5' }}>
          <TabsTrigger 
            value="dashboard" 
            className="gap-2 flex items-center"
            style={{
              borderBottom: activeTab === 'dashboard' ? `3px solid ${GOLD}` : '1px solid #e5e7eb',
              color: activeTab === 'dashboard' ? GOLD : '#666'
            }}
          >
            <LayoutGrid className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger 
            value="flow-mockup"
            className="gap-2 flex items-center"
            style={{
              borderBottom: activeTab === 'flow-mockup' ? `3px solid ${GOLD}` : '1px solid #e5e7eb',
              color: activeTab === 'flow-mockup' ? GOLD : '#666'
            }}
          >
            <Zap className="w-4 h-4" />
            Referral Flow Mockup
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column: Agent Database */}
            <div className="col-span-1">
              <AgentDatabase />
            </div>

            {/* Middle Column: Fee Calculator */}
            <div className="col-span-1">
              <ReferralFeeCalculator />
            </div>

            {/* Right Column: Status Tracker */}
            <div className="col-span-1">
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <ReferralTracker />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Flow Mockup Tab */}
        <TabsContent value="flow-mockup" className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Referral Flow Model</h2>
              <p className="text-sm text-slate-600">
                Interactive mockup showing consumer and agent experience across the full referral lifecycle: intake → proposal → acceptance → close.
              </p>
            </div>
            <ReferralFlowMockup />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}