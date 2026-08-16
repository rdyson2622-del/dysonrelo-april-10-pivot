import React from 'react';
import { Users } from 'lucide-react';
import WisdomSectionPlaceholder from '@/components/wisdom/WisdomSectionPlaceholder';

export default function AgentRecords() {
  return (
    <WisdomSectionPlaceholder
      title="Agent Records"
      description="DRE license tracking, production history, and commission records for every agent in the Wisdom Properties office. Renewal alerts and performance benchmarks at a glance."
      icon={Users}
    />
  );
}