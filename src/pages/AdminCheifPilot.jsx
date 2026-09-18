import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ChiefPilotPageTwo from '@/components/admin/chiefPilot/ChiefPilotPageTwo';
import ChiefPilotExperimentalVoice from '@/components/admin/chiefPilot/ChiefPilotExperimentalVoice';

export default function AdminCheifPilot() {
  return (
    <div className="min-h-screen bg-dyson-black text-dyson-text p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="space-y-3">
          <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-dyson-taupe hover:text-dyson-gold"><ArrowLeft className="h-4 w-4" />Admin</Link>
          <p className="text-xs tracking-widest text-dyson-gold">DYSONHOMES.COM</p>
          <h1 className="text-2xl sm:text-3xl font-normal">CHIEF PILOT</h1>
          <p className="text-sm text-dyson-taupe">Chief Pilot workspace · Separate from the current live pages.</p>
        </header>
        <div className="flex justify-end">
          <ChiefPilotExperimentalVoice />
        </div>
        <ChiefPilotPageTwo />
      </div>
    </div>
  );
}