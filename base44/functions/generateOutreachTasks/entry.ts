import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const TASK_TEMPLATES = {
  outreach: [
    {
      task_type: 'order_title_report',
      title: 'Order Title Report',
      description: 'Request title report for the property to verify ownership and identify liens',
      priority: 'high',
      days_until_due: 2,
    },
    {
      task_type: 'check_response',
      title: 'Monitor for Response',
      description: 'Check for owner response to initial outreach SMS in next 48 hours',
      priority: 'medium',
      days_until_due: 2,
    },
  ],
  response: [
    {
      task_type: 'schedule_call',
      title: 'Schedule Call with Owner',
      description: 'Contact owner to discuss relocation plans and qualification',
      priority: 'high',
      days_until_due: 1,
    },
    {
      task_type: 'verify_moving_details',
      title: 'Verify Moving Details',
      description: 'Confirm destination city, timeline, and budget from owner',
      priority: 'high',
      days_until_due: 1,
    },
    {
      task_type: 'send_destination_info',
      title: 'Send Destination Info Packet',
      description: 'Email owner resources about their destination market',
      priority: 'medium',
      days_until_due: 3,
    },
  ],
  profile_complete: [
    {
      task_type: 'agent_match',
      title: 'Find & Match Destination Agent',
      description: 'Identify and match receiving agent in destination city',
      priority: 'high',
      days_until_due: 2,
    },
    {
      task_type: 'prepare_proposal',
      title: 'Prepare Agent Referral Proposal',
      description: 'Create and send referral agreement to receiving agent',
      priority: 'high',
      days_until_due: 3,
    },
  ],
  processing: [
    {
      task_type: 'update_notes',
      title: 'Update Transaction Notes',
      description: 'Document deal progress and any special conditions',
      priority: 'medium',
      days_until_due: 7,
    },
  ],
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      campaign_id,
      campaign_stage,
      owner_name,
      property_address,
      script_name,
    } = await req.json();

    if (!campaign_id || !campaign_stage) {
      return Response.json(
        { error: 'Missing required fields: campaign_id, campaign_stage' },
        { status: 400 }
      );
    }

    // Check if tasks already exist for this campaign at this stage
    const existingTasks = await base44.entities.OutreachTask.filter(
      {
        campaign_id,
        triggered_by_stage: campaign_stage,
      }
    );

    // Only generate if no tasks exist for this stage
    if (existingTasks && existingTasks.length > 0) {
      return Response.json({
        message: 'Tasks already exist for this campaign stage',
        tasks_created: 0,
      });
    }

    const templates = TASK_TEMPLATES[campaign_stage] || [];
    const today = new Date();
    const createdTasks = [];

    for (const template of templates) {
      const dueDate = new Date(today);
      dueDate.setDate(dueDate.getDate() + template.days_until_due);

      const newTask = await base44.entities.OutreachTask.create({
        campaign_id,
        owner_name,
        property_address,
        task_type: template.task_type,
        title: template.title,
        description: template.description,
        status: 'pending',
        triggered_by_stage: campaign_stage,
        triggered_by_script: script_name || 'system_generated',
        due_date: dueDate.toISOString().split('T')[0],
        priority: template.priority,
      });

      createdTasks.push(newTask);
    }

    return Response.json({
      message: `Generated ${createdTasks.length} tasks for ${campaign_stage} stage`,
      tasks_created: createdTasks.length,
      tasks: createdTasks,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});