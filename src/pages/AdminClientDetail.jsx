import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Mail, MapPin } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

export default function AdminOwnerDetail() {
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get('id');

  const { data: client } = useQuery({
    queryKey: ['admin-client-detail', clientId],
    queryFn: () => base44.entities.RelocationClient.get(clientId),
    enabled: !!clientId,
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['admin-client-tasks', clientId],
    queryFn: () => base44.entities.RelocationTask.filter({ client_id: clientId }, '-created_date'),
    enabled: !!clientId,
  });

  if (!client) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/admin/clients">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{client.full_name}</h1>
            <p className="text-muted-foreground">Relocation Client</p>
          </div>
        </div>

        {/* Client Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{client.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{client.phone || '—'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{client.current_city || '—'} → {client.destination_city}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Timeline: </span>
                <span className="text-sm">{client.move_date || '—'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Relocation Tasks ({tasks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <p className="text-muted-foreground">No tasks yet</p>
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">{task.category}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      task.status === 'completed' ? 'bg-green-100 text-green-800' :
                      task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}