import { useState } from 'react';
import { createObjectiveProject } from '@/components/copilot/copilotObjectiveRoadmaps';

const STORAGE_KEY = 'dyson_copilot_objective_projects';

function loadProjects() {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch (_) { return {}; }
}

export default function useCopilotObjectiveTracker() {
  const [projects, setProjects] = useState(loadProjects);

  const save = (next) => {
    setProjects(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const projectKey = (door, scope = 'general') => `${door}:${String(scope).trim().toLowerCase()}`;

  const ensureObjective = (door, requestText, scope) => {
    if (!door || door === 'news' || door === 'dnn') return null;
    const key = projectKey(door, scope);
    if (projects[key]) return projects[key];
    const project = createObjectiveProject(door, requestText);
    save({ ...projects, [key]: project });
    return project;
  };

  const confirmMilestone = (door, decision, scope) => {
    const key = projectKey(door, scope);
    const project = projects[key];
    if (!project) return null;
    const index = project.milestones.findIndex((item) => item.status !== 'completed');
    if (index < 0) return null;
    const status = decision === 'accomplished' ? 'completed' : decision === 'move_forward' ? 'in_progress' : 'paused';
    const milestones = project.milestones.map((item, itemIndex) => itemIndex === index
      ? { ...item, status, confirmedAt: new Date().toISOString() }
      : item);
    const updated = { ...project, milestones, updatedAt: new Date().toISOString() };
    save({ ...projects, [key]: updated });
    return { milestone: milestones[index], project: updated };
  };

  const getProject = (door, scope) => projects[projectKey(door, scope)] || null;
  const getCurrentMilestone = (door, projectOverride, scope) => {
    const project = projectOverride || getProject(door, scope);
    return project?.milestones.find((item) => item.status !== 'completed') || null;
  };

  return { projects, ensureObjective, confirmMilestone, getCurrentMilestone, getProject };
}