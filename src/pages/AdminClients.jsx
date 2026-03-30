import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminClients() {
  const queryClient = useQueryClient();

  const handleDelete = async (id) => {
    if (!confirm('Delete this client? This cannot be undone.')) return;
    await base44.entities.RelocationClient.delete(id);
    queryClient.invalidateQueries({ queryKey: ['admin-clients'] });
  };

  const { data: clients, isLoading } = useQuery({
    queryKey: ['admin-clients'],
    queryFn: () => base44.entities.RelocationClient.list('-created_date'),
    initialData: [],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      new_lead: 'bg-blue-100 text-blue-800',
      in_consultation: 'bg-yellow-100 text-yellow-800',
      actively_searching: 'bg-purple-100 text-purple-800',
      under_contract: 'bg-orange-100 text-orange-800',
      moved: 'bg-green-100 text-green-800',
      closed: 'bg-green-200 text-green-900',
      inactive: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Client Pipeline</h1>
            <p className="text-muted-foreground mt-1">Manage relocation leads and track progress</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>

        <div className="grid gap-4">
          {clients.map((client) => (
            <Card key={client.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{client.full_name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {client.email} • {client.phone}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/admin/owner-detail?id=${client.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(client.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Moving From</p>
                    <p className="text-sm">{client.current_city || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Moving To</p>
                    <p className="text-sm">{client.destination_city}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Timeline</p>
                    <p className="text-sm">{client.move_date || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Budget</p>
                    <p className="text-sm">{client.budget?.replace('_', ' - ') || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(client.status)}`}>
                    {client.status?.replace('_', ' ').toUpperCase()}
                  </span>
                  {client.assigned_agent && (
                    <p className="text-xs text-muted-foreground">
                      Agent: {client.agent_name || client.assigned_agent}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}