import React from 'react';
import { TrendingUp } from 'lucide-react';
import WisdomSectionPlaceholder from '@/components/wisdom/WisdomSectionPlaceholder';

export default function WisdomMarketing() {
  return (
    <WisdomSectionPlaceholder
      title="Marketing"
      description="Campaign performance, listing syndication, and lead attribution for Wisdom Properties. Track what's driving buyer and seller inquiries across every channel."
      icon={TrendingUp}
    />
  );
}