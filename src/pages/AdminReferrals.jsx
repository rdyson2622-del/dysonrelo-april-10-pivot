import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AgentDatabase from '../components/admin/AgentDatabase';
import ReferralFeeCalculator from '../components/admin/ReferralFeeCalculator';
import ReferralTracker from '../components/admin/ReferralTracker';

export default function AdminReferrals() {
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
          <p className="text-sm text-slate-500 mt-1">Manage agent network, calculate fees, and track referral status</p>
        </div>
      </div>

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
    </div>
  );
}