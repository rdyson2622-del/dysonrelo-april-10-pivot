import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Mail, Phone, Calendar, CheckCircle2, AlertCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const GOLD = '#D4AF37';

const statusColors = {
  new_lead: 'bg-slate-100 text-slate-600',
  in_consultation: 'bg-blue-100 text-blue-700',
  actively_searching: 'bg-amber-100 text-amber-700',
  under_contract: 'bg-purple-100 text-purple-700',
  moved: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-red-100 text-red-700',
};

const budgetLabels = {
  under_200k: 'Under $200K',
  '200k_400k': '$200K - $400K',
  '400k_600k': '$400K - $600K',
  '600k_800k': '$600K - $800K',
  '800k_1m': '$800K - $1M',
  over_1m: 'Over $1M',
};

export default function AdminClientDetail() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: client, isLoading } = useQuery({
    queryKey: ['relocation-client', clientId],
    queryFn: () => base44.entities.RelocationClient.filter({ id: clientId }),
    select: (data) => data[0],
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['client-tasks', clientId],
    queryFn: () => base44.entities.RelocationTask.filter({ client_id: clientId }, '-created_date', 200),
    enabled: !!clientId,
  });

  if (isLoading) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center" style={{ background: '#A9A9A9' }}>
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-8 min-h-screen" style={{ background: '#A9A9A9' }}>
        <div className="text-center py-12 rounded-2xl border" style={{ background: 'rgba(255,255,255,0.85)', borderColor: 'rgba(0,0,0,0.1)' }}>
          <p className="font-medium" style={{ color: 'rgba(0,0,0,0.4)' }}>Client not found</p>
        </div>
      </div>
    );
  }

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const progressPercent = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div className="p-8 min-h-screen" style={{ background: '#A9A9A9' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/AdminClients')}
          style={{ color: '#000' }}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#000' }}>
            {client.full_name}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(0,0,0,0.6)' }}>
            Interview Summary & Move Plan
          </p>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border p-6"
            style={{ background: 'rgba(255,255,255,0.9)', borderColor: 'rgba(0,0,0,0.1)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ color: '#000' }}>Profile Details</h2>
              <Badge className={`${statusColors[client.status] || statusColors.new_lead} border-0 text-xs`}>
                {(client.status || 'new_lead').replace(/_/g, ' ')}
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Current Location */}
              {client.current_city && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5" style={{ color: GOLD }} />
                  <div>
                    <p className="text-xs text-gray-500">Current Location</p>
                    <p className="text-sm font-medium" style={{ color: '#000' }}>{client.current_city}</p>
                  </div>
                </div>
              )}

              {/* Destination */}
              {client.destination_city && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5" style={{ color: GOLD }} />
                  <div>
                    <p className="text-xs text-gray-500">Moving To</p>
                    <p className="text-sm font-medium" style={{ color: '#000' }}>
                      {client.destination_city}
                    </p>
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-0.5" style={{ color: GOLD }} />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-blue-600">{client.email}</p>
                </div>
              </div>

              {/* Phone */}
              {client.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 mt-0.5" style={{ color: GOLD }} />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium" style={{ color: '#000' }}>{client.phone}</p>
                  </div>
                </div>
              )}

              {/* Move Date */}
              {client.move_date && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 mt-0.5" style={{ color: GOLD }} />
                  <div>
                    <p className="text-xs text-gray-500">Planned Move</p>
                    <p className="text-sm font-medium" style={{ color: '#000' }}>
                      {new Date(client.move_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              )}

              {/* Budget */}
              {client.budget && (
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 mt-0.5" style={{ color: GOLD }} />
                  <div>
                    <p className="text-xs text-gray-500">Budget Range</p>
                    <p className="text-sm font-medium" style={{ color: '#000' }}>{budgetLabels[client.budget]}</p>
                  </div>
                </div>
              )}

              {/* Family Size */}
              {client.family_size && (
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 mt-0.5" style={{ color: GOLD }} />
                  <div>
                    <p className="text-xs text-gray-500">Family Size</p>
                    <p className="text-sm font-medium" style={{ color: '#000' }}>{client.family_size} person{client.family_size > 1 ? 's' : ''}</p>
                  </div>
                </div>
              )}
            </div>

            {client.notes && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                <p className="text-xs text-gray-500 mb-1">Notes</p>
                <p className="text-sm text-gray-700">{client.notes}</p>
              </div>
            )}
          </motion.div>

          {/* Tasks / Move Plan */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border p-6"
            style={{ background: 'rgba(255,255,255,0.9)', borderColor: 'rgba(0,0,0,0.1)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ color: '#000' }}>Move Plan ({tasks.length} tasks)</h2>
              <span className="text-sm font-medium" style={{ color: GOLD }}>
                {completedTasks}/{tasks.length} completed
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-4 h-2 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{ background: GOLD, width: `${progressPercent}%` }}
              />
            </div>

            {tasks.length === 0 ? (
              <p className="text-sm text-gray-400 py-6 text-center">No tasks yet</p>
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 rounded-lg"
                    style={{ background: task.status === 'completed' ? 'rgba(16,185,129,0.1)' : 'rgba(0,0,0,0.02)' }}
                  >
                    <div className="mt-0.5">
                      {task.status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium ${
                          task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800'
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>
                      )}
                      <div className="flex gap-2 mt-2">
                        {task.category && (
                          <span className="text-xs px-2 py-0.5 rounded" style={{ background: `${GOLD}22`, color: GOLD }}>
                            {task.category.replace(/_/g, ' ')}
                          </span>
                        )}
                        {task.priority && (
                          <span className="text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-700">
                            {task.priority}
                          </span>
                        )}
                        {task.due_date && (
                          <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                            Due: {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar - Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="rounded-2xl border p-4" style={{ background: 'rgba(255,255,255,0.9)', borderColor: 'rgba(0,0,0,0.1)' }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>Interview Status</p>
            <p className="text-sm font-medium mt-2" style={{ color: '#000' }}>Profile Captured ✓</p>
            <p className="text-xs text-gray-500 mt-1">
              Captured on {new Date(client.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div className="rounded-2xl border p-4" style={{ background: 'rgba(255,255,255,0.9)', borderColor: 'rgba(0,0,0,0.1)' }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>Progress</p>
            <div className="mt-3">
              <div className="text-2xl font-bold" style={{ color: '#000' }}>{progressPercent}%</div>
              <p className="text-xs text-gray-500">{completedTasks} of {tasks.length} tasks done</p>
            </div>
          </div>

          {client.assigned_agent && (
            <div className="rounded-2xl border p-4" style={{ background: 'rgba(255,255,255,0.9)', borderColor: 'rgba(0,0,0,0.1)' }}>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>Assigned Agent</p>
              <p className="text-sm font-medium mt-2" style={{ color: '#000' }}>{client.assigned_agent}</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}