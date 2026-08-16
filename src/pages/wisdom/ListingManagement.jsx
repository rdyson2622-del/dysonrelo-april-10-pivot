import React from 'react';
import { Home } from 'lucide-react';
import WisdomSectionPlaceholder from '@/components/wisdom/WisdomSectionPlaceholder';

export default function ListingManagement() {
  return (
    <WisdomSectionPlaceholder
      title="Listing Management"
      description="Manage active listings across the Wisdom Properties portfolio. Track price reductions, days on market, showing activity, and offer status pulled from Back Office."
      icon={Home}
    />
  );
}