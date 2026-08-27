import { UserSearch, ShieldCheck, UserCheck, Search, Clock, CheckCircle2 } from 'lucide-react';

export const GOLD = '#D4AF37';

export const STATUS_CONFIG = {
  needs_destination_agent: { label: 'Needs Destination Agent', color: '#6366f1', icon: UserSearch },
  agent_vetting_in_progress: { label: 'Agent Vetting In Progress', color: GOLD, icon: ShieldCheck },
  agent_assigned: { label: 'Agent Assigned', color: '#059669', icon: UserCheck },
  house_hunting: { label: 'House Hunting', color: '#2563eb', icon: Search },
  in_escrow: { label: 'In Escrow', color: '#f59e0b', icon: Clock },
  closed: { label: 'Closed', color: '#059669', icon: CheckCircle2 },
};

export function statusConfig(status) {
  return STATUS_CONFIG[status] || STATUS_CONFIG.needs_destination_agent;
}