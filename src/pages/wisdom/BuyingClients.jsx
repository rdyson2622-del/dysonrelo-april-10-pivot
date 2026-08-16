import React from 'react';
import { ShoppingBag } from 'lucide-react';
import WisdomSectionPlaceholder from '@/components/wisdom/WisdomSectionPlaceholder';

export default function BuyingClients() {
  return (
    <WisdomSectionPlaceholder
      title="Buying Clients"
      description="Manage active buyer clients working with Wisdom Properties. Track search criteria, property tours, offer status, and contract milestones for buyers in your pipeline."
      icon={ShoppingBag}
    />
  );
}