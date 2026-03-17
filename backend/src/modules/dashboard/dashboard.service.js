const db = require('../../config/database');

async function getStats() {
  const total = await db('leads').where({ is_deleted: false }).count('id as count').first();

  const wonStage = await db('pipeline_stages').where({ is_won: true }).first();
  const won = wonStage
    ? await db('leads').where({ stage_id: wonStage.id, is_deleted: false }).count('id as count').first()
    : { count: 0 };

  const pipelineValue = await db('leads')
    .where({ is_deleted: false })
    .whereNot({ stage_id: wonStage?.id })
    .sum('deal_value as total')
    .first();

  const conversionRate = total.count > 0
    ? ((won.count / total.count) * 100).toFixed(1)
    : '0.0';

  return {
    total_leads: total.count,
    won_leads: won.count,
    pipeline_value: pipelineValue.total || 0,
    conversion_rate: parseFloat(conversionRate),
  };
}

async function getBySource() {
  return db('leads')
    .where({ is_deleted: false })
    .groupBy('source')
    .select('source', db.raw('COUNT(id) as count'));
}

async function getByStage() {
  return db('leads')
    .join('pipeline_stages', 'leads.stage_id', 'pipeline_stages.id')
    .where('leads.is_deleted', false)
    .groupBy('leads.stage_id', 'pipeline_stages.name', 'pipeline_stages.color', 'pipeline_stages.order_index')
    .select(
      'pipeline_stages.name as stage',
      'pipeline_stages.color',
      'pipeline_stages.order_index',
      db.raw('COUNT(leads.id) as count'),
      db.raw('SUM(leads.deal_value) as value')
    )
    .orderBy('pipeline_stages.order_index');
}

async function getRecent(limit = 10) {
  return db('leads')
    .join('pipeline_stages', 'leads.stage_id', 'pipeline_stages.id')
    .where('leads.is_deleted', false)
    .select('leads.*', 'pipeline_stages.name as stage_name', 'pipeline_stages.color as stage_color')
    .orderBy('leads.created_at', 'desc')
    .limit(limit);
}

async function getUpcomingReminders(userId) {
  return db('reminders')
    .join('leads', 'reminders.lead_id', 'leads.id')
    .where('reminders.user_id', userId)
    .where('reminders.is_done', false)
    .select('reminders.*', 'leads.name as lead_name', 'leads.phone as lead_phone')
    .orderBy('reminders.due_at', 'asc')
    .limit(10);
}

module.exports = { getStats, getBySource, getByStage, getRecent, getUpcomingReminders };
